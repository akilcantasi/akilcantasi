#!/usr/bin/env node
// Akıl Çantası — Bilgi Noktası sunucusu
// Bağımlılıksız Node (>=18) HTTP sunucusu. Derlenmiş uygulamayı (dist/) ve
// içerik paketlerini (data/) aynı Wi-Fi / erişim noktasındaki tüm telefonlara sunar.
//
//   node server/server.mjs [--port 8080] [--data ./data] [--dist ./dist] [--host 0.0.0.0]
//   Ortam değişkenleri: AKIL_DATA, AKIL_PORT, AKIL_DIST
//
// Uç noktalar:
//   GET  /api/status            {server,name,addresses,port,clients,apk}
//   GET  /api/packs             {files:[{name,size,url}]}
//   GET|HEAD /data/<dosya>      Range (206) destekli paket dosyaları
//   GET  /download/akil-cantasi.apk
//   GET  /packs-manifest.json   data/ içinde varsa oradan, yoksa dist/'ten
//   GET  /api/board?since=<ms>  {items:[…], now} mesaj panosu (rev > since)
//   POST /api/board             {id,kind,from,text,lat?,lon?,status?} → data/board.json
//   GET  /api/fetch             {available, allowed, jobs:[…]} sunucu tarafı paket indirmeleri
//   POST /api/fetch             {action:'start'|'pause'|'cancel', file} (yalnız bu bilgisayardan;
//                               telefonlardan izin için --uzaktan-indirme ya da AKIL_REMOTE_FETCH=1)
//   diğer her şey               dist/ (SPA: uzantısız yollar index.html)
import http from 'node:http';
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createFetcher } from './fetcher.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SERVER_NAME = 'Akıl Çantası Bilgi Noktası';
// connect-src http: — İletişim'de elle girilen başka bir bilgi noktası (http://192.168.x.x:8080)
// ve LAN aynaları; https: zaten açık olduğundan güvenliği azaltmaz.
export const CSP =
  "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; " +
  "img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' blob: data: http: https:; media-src 'self' blob:; " +
  "object-src 'none'; base-uri 'none'; frame-src 'none'; form-action 'none'";
export const PACK_EXTS = ['.zim', '.gguf', '.pmtiles', '.geojson', '.json', '.tar'];
const APK_NAME = 'akil-cantasi.apk';
const CLIENT_WINDOW_MS = 2 * 60 * 1000;

export const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.geojson': 'application/geo+json',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.wasm': 'application/wasm',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.pbf': 'application/x-protobuf',
  '.pmtiles': 'application/octet-stream',
  '.zim': 'application/octet-stream',
  '.gguf': 'application/octet-stream',
  '.apk': 'application/vnd.android.package-archive',
};

export function mimeOf(name) {
  return MIME[path.extname(name).toLowerCase()] ?? 'application/octet-stream';
}

/** LAN IPv4 adresleri (iç/loopback hariç). Önce özel ağ adresleri. */
export function lanAddresses() {
  const out = [];
  for (const list of Object.values(os.networkInterfaces())) {
    for (const a of list ?? []) {
      const fam = typeof a.family === 'number' ? (a.family === 4 ? 'IPv4' : 'IPv6') : a.family;
      if (fam === 'IPv4' && !a.internal) out.push(a.address);
    }
  }
  const priv = (ip) => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(ip);
  return out.sort((a, b) => Number(priv(b)) - Number(priv(a)));
}

/**
 * Tek aralıklı Range başlığını çözer.
 * Dönüş: null (başlık yok/çoklu aralık → tam dosya), 'invalid' (416) ya da {start,end}.
 */
export function parseRange(header, size) {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header).trim());
  if (!m) return String(header).includes(',') ? null : 'invalid';
  let [, s, e] = m;
  if (s === '' && e === '') return 'invalid';
  let start, end;
  if (s === '') {
    const n = Number(e);
    if (n === 0) return 'invalid';
    start = Math.max(0, size - n);
    end = size - 1;
  } else {
    start = Number(s);
    end = e === '' ? size - 1 : Math.min(Number(e), size - 1);
  }
  if (start >= size || start > end) return 'invalid';
  return { start, end };
}

/** Kök dizin altında güvenli yol; dışarı çıkıyorsa null. */
export function safeJoin(root, rel) {
  let dec;
  try {
    dec = decodeURIComponent(rel);
  } catch {
    return null;
  }
  if (dec.includes('\0')) return null;
  const p = path.resolve(root, '.' + path.sep + dec.replace(/^[/\\]+/, ''));
  const r = path.resolve(root);
  if (p !== r && !p.startsWith(r + path.sep)) return null;
  return p;
}

function parseArgs(argv) {
  const o = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--port' || a === '-p') o.port = Number(next());
    else if (a.startsWith('--port=')) o.port = Number(a.slice(7));
    else if (a === '--data' || a === '-d') o.data = next();
    else if (a.startsWith('--data=')) o.data = a.slice(7);
    else if (a === '--dist') o.dist = next();
    else if (a.startsWith('--dist=')) o.dist = a.slice(7);
    else if (a === '--host') o.host = next();
    else if (a === '--quiet' || a === '-q') o.quiet = true;
    else if (a === '--uzaktan-indirme' || a === '--remote-fetch') o.remoteFetch = true;
    else if (a === '--help' || a === '-h') o.help = true;
  }
  return o;
}

async function statFile(p) {
  try {
    const st = await fsp.stat(p);
    return st.isFile() ? st : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Mesaj panosu (İletişim sekmesi). Aynı ağdaki telefonlar mesaj, "iyiyim"
// bildirimi, kayıp ilanı ve duyuru paylaşır. Kurallar src/iletisim/board.ts ve
// android/…/InfoPointServer.java ile aynıdır.
export const BOARD_KINDS = ['mesaj', 'iyiyim', 'kayip', 'duyuru'];
export const BOARD_LIMITS = { id: 64, from: 40, text: 600, body: 4096, items: 2000, page: 500, ratePerMin: 20 };
const CHECKIN = ['iyiyim', 'yardim', 'yarali'];
const MISSING = ['araniyor', 'bulundu'];
const BOARD_ID_RE = /^[A-Za-z0-9_-]{6,64}$/;

/** Düz metin: denetim, yön (bidi) ve sıfır genişlikli karakterleri atar, uzunluğu sınırlar. */
export function cleanBoardText(s, max, multiline = false) {
  let t = String(s ?? '')
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, '')
    .replace(/[​-‏‪-‮⁠-⁩﻿]/g, '');
  if (!multiline) t = t.replace(/\n+/g, ' ');
  else t = t.replace(/[ ]+\n/g, '\n').replace(/\n{3,}/g, '\n\n');
  t = t.replace(/ {2,}/g, ' ').trim();
  const cps = Array.from(t);
  return cps.length > max ? cps.slice(0, max).join('').trim() : t;
}

/** Gelen kaydı doğrular ve temizler: {ok:true,item} | {ok:false,error} */
export function validateBoardItem(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return { ok: false, error: 'Geçersiz kayıt' };
  const id = typeof raw.id === 'string' ? raw.id : '';
  if (!BOARD_ID_RE.test(id)) return { ok: false, error: 'Geçersiz kimlik' };
  const kind = raw.kind;
  if (!BOARD_KINDS.includes(kind)) return { ok: false, error: 'Geçersiz tür' };
  const from = cleanBoardText(raw.from, BOARD_LIMITS.from);
  if (!from) return { ok: false, error: 'Ad gerekli' };
  const text = cleanBoardText(raw.text, BOARD_LIMITS.text, true);
  if (!text && kind !== 'iyiyim') return { ok: false, error: 'Metin gerekli' };
  const item = { id, kind, from, text };
  if (raw.lat != null || raw.lon != null) {
    const lat = Number(raw.lat);
    const lon = Number(raw.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return { ok: false, error: 'Geçersiz konum' };
    item.lat = Math.round(lat * 1e5) / 1e5;
    item.lon = Math.round(lon * 1e5) / 1e5;
  }
  if (kind === 'iyiyim') {
    const st = raw.status ?? 'iyiyim';
    if (!CHECKIN.includes(st)) return { ok: false, error: 'Geçersiz durum' };
    item.status = st;
  } else if (kind === 'kayip') {
    const st = raw.status ?? 'araniyor';
    if (!MISSING.includes(st)) return { ok: false, error: 'Geçersiz durum' };
    item.status = st;
  } else if (raw.status != null && raw.status !== '') {
    return { ok: false, error: 'Bu türde durum olmaz' };
  }
  return { ok: true, item };
}

/**
 * Pano deposu: bellekte liste, <dataDir>/board.json dosyasına gecikmeli ve
 * atomik (geçici dosya + yeniden adlandırma) yazılır.
 */
async function openBoard(dataDir, o = {}) {
  const file = path.join(dataDir, 'board.json');
  const maxItems = o.maxItems ?? BOARD_LIMITS.items;
  const ratePerMin = o.ratePerMin ?? BOARD_LIMITS.ratePerMin;
  /** @type {Map<string, any>} */
  const items = new Map();
  try {
    const d = JSON.parse(await fsp.readFile(file, 'utf8'));
    for (const raw of Array.isArray(d?.items) ? d.items : []) {
      const v = validateBoardItem(raw);
      if (!v.ok) continue;
      const time = Number(raw.time) || Date.now();
      items.set(v.item.id, { ...v.item, time, rev: Number(raw.rev) || time, ...(raw.local ? { local: true } : {}) });
    }
  } catch {
    /* dosya yok ya da bozuk: boş pano */
  }
  let lastRev = 0;
  for (const it of items.values()) lastRev = Math.max(lastRev, it.rev);
  // Saat geri alınsa da rev artarak gitsin (?since= güvenilir kalsın)
  const nextRev = () => (lastRev = Math.max(Date.now(), lastRev + 1));

  let timer = null;
  let writing = Promise.resolve();
  const writeNow = () => {
    timer = null;
    const body = JSON.stringify({ version: 1, items: [...items.values()] });
    writing = writing.then(async () => {
      const tmp = file + '.tmp';
      try {
        await fsp.writeFile(tmp, body);
        await fsp.rename(tmp, file);
      } catch {}
    });
    return writing;
  };
  const scheduleSave = () => {
    if (!timer) timer = setTimeout(writeNow, 250);
  };

  const hits = new Map(); // ip → [zamanlar]
  const rateOk = (ip) => {
    const now = Date.now();
    const arr = (hits.get(ip) ?? []).filter((t) => now - t < 60_000);
    if (arr.length >= ratePerMin) {
      hits.set(ip, arr);
      return Math.ceil((60_000 - (now - arr[0])) / 1000);
    }
    arr.push(now);
    hits.set(ip, arr);
    if (hits.size > 5000) hits.clear();
    return 0;
  };

  return {
    list(since) {
      const out = [];
      for (const it of items.values()) if (it.rev > since) out.push(it);
      out.sort((a, b) => b.rev - a.rev);
      return out.slice(0, BOARD_LIMITS.page);
    },
    rateOk,
    /** @returns {{status:number, item:any, duplicate?:boolean}} */
    add(item, local) {
      const cur = items.get(item.id);
      if (cur) {
        // Tek izinli değişiklik: kayıp ilanı "bulundu" olarak işaretlenir
        if (cur.kind === 'kayip' && item.kind === 'kayip' && cur.status === 'araniyor' && item.status === 'bulundu') {
          cur.status = 'bulundu';
          cur.rev = nextRev();
          scheduleSave();
          return { status: 200, item: cur };
        }
        return { status: 200, item: cur, duplicate: true };
      }
      const rev = nextRev();
      const it = { ...item, time: rev, rev, ...(local ? { local: true } : {}) };
      items.set(it.id, it);
      if (items.size > maxItems) {
        const old = [...items.values()].sort((a, b) => a.time - b.time);
        for (const x of old.slice(0, items.size - maxItems)) items.delete(x.id);
      }
      scheduleSave();
      return { status: 201, item: it };
    },
    async flush() {
      if (timer) {
        clearTimeout(timer);
        await writeNow();
      }
      await writing;
    },
  };
}

/** İstek gövdesini sınırlı okur; aşarsa null */
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let n = 0;
    let over = false;
    req.on('data', (c) => {
      if (over) return;
      n += c.length;
      if (n > limit) {
        over = true;
        resolve(null);
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!over) resolve(Buffer.concat(chunks));
    });
    req.on('error', reject);
  });
}

/**
 * Sunucuyu başlatır.
 * @param {{port?:number, host?:string, data?:string, dist?:string, apkDirs?:string[],
 *          throttleBps?:number, onRequest?:(req:http.IncomingMessage)=>void, quiet?:boolean}} opts
 * @returns {Promise<{server:http.Server, port:number, url:string, addresses:string[], close:()=>Promise<void>}>}
 */
export async function startServer(opts = {}) {
  const dataDir = path.resolve(opts.data ?? process.env.AKIL_DATA ?? path.join(ROOT, 'data'));
  const distDir = path.resolve(opts.dist ?? process.env.AKIL_DIST ?? path.join(ROOT, 'dist'));
  const apkDirs = opts.apkDirs ?? [dataDir, path.join(ROOT, 'apk')];
  const host = opts.host ?? '0.0.0.0';
  const throttleBps = opts.throttleBps ?? (Number(process.env.AKIL_THROTTLE) || 0);
  await fsp.mkdir(dataDir, { recursive: true }).catch(() => {});
  const board = await openBoard(dataDir, opts.board);
  const remoteFetch = opts.remoteFetch ?? process.env.AKIL_REMOTE_FETCH === '1';
  async function loadManifest() {
    for (const p of [path.join(dataDir, 'packs-manifest.json'), path.join(distDir, 'packs-manifest.json')]) {
      try {
        return JSON.parse(await fsp.readFile(p, 'utf8'));
      } catch {}
    }
    return null;
  }
  const fetcher = createFetcher({ dataDir, loadManifest, fetch: opts.fetchImpl, ...(opts.fetcher ?? {}) });
  await fetcher.restore();

  const seen = new Map(); // ip → son görülme
  const clientIp = (req) => String(req.socket.remoteAddress ?? '').replace(/^::ffff:/, '');
  const isLoopback = (ip) => ip === '::1' || ip.startsWith('127.');
  const clientCount = () => {
    const now = Date.now();
    let n = 0;
    for (const [ip, t] of seen) {
      if (now - t > CLIENT_WINDOW_MS) seen.delete(ip);
      else n++;
    }
    return n;
  };

  async function findApk() {
    for (const d of apkDirs) {
      const p = path.join(d, APK_NAME);
      const st = await statFile(p);
      if (st) return { p, st };
    }
    return null;
  }

  function baseHeaders(extra = {}) {
    return {
      // wllama çok iş parçacıklı WebAssembly için (SharedArrayBuffer)
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      // Android uygulaması (farklı köken) da paketleri okuyabilsin
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Range, Content-Type, If-Range',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Expose-Headers': 'Content-Length, Content-Range, Accept-Ranges, ETag, Last-Modified',
      'X-Content-Type-Options': 'nosniff',
      // Arşivden gelen içerik betik çalıştıramasın
      'Content-Security-Policy': CSP,
      ...extra,
    };
  }

  function sendJson(req, res, status, obj) {
    const body = Buffer.from(JSON.stringify(obj));
    res.writeHead(status, baseHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': body.length, 'Cache-Control': 'no-store' }));
    res.end(req.method === 'HEAD' ? undefined : body);
  }

  function sendText(req, res, status, text, extra = {}) {
    const body = Buffer.from(text);
    res.writeHead(status, baseHeaders({ 'Content-Type': 'text/plain; charset=utf-8', 'Content-Length': body.length, ...extra }));
    res.end(req.method === 'HEAD' ? undefined : body);
  }

  function pipeThrottled(stream, res) {
    if (!throttleBps) return stream.pipe(res);
    // Test/gösterim amaçlı yavaşlatma (AKIL_THROTTLE bayt/sn)
    let sent = 0;
    const t0 = Date.now();
    stream.on('data', (chunk) => {
      sent += chunk.length;
      const ok = res.write(chunk);
      const wait = (sent / throttleBps) * 1000 - (Date.now() - t0);
      if (wait > 0 || !ok) {
        stream.pause();
        const resume = () => setTimeout(() => stream.resume(), Math.max(0, wait));
        if (!ok) res.once('drain', resume);
        else resume();
      }
    });
    stream.on('end', () => res.end());
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
  }

  /** Dosyayı Range/HEAD desteğiyle gönderir */
  async function sendFile(req, res, p, st, extra = {}) {
    const size = st.size;
    const etag = `W/"${size.toString(16)}-${Math.floor(st.mtimeMs).toString(16)}"`;
    const headers = baseHeaders({
      'Content-Type': mimeOf(p),
      'Accept-Ranges': 'bytes',
      'Last-Modified': st.mtime.toUTCString(),
      ETag: etag,
      ...extra,
    });
    let range = parseRange(req.headers.range, size);
    const ifRange = req.headers['if-range'];
    if (range && ifRange && ifRange !== etag && ifRange !== headers['Last-Modified']) range = null;
    if (range === 'invalid') {
      res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}`, 'Content-Length': 0 });
      res.end();
      return;
    }
    if (!range && req.headers['if-none-match'] === etag) {
      res.writeHead(304, headers);
      res.end();
      return;
    }
    const { start, end } = range ?? { start: 0, end: size - 1 };
    const len = size === 0 ? 0 : end - start + 1;
    if (range) {
      res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': len });
    } else {
      res.writeHead(200, { ...headers, 'Content-Length': size });
    }
    if (req.method === 'HEAD' || len === 0) {
      res.end();
      return;
    }
    pipeThrottled(fs.createReadStream(p, { start, end }), res);
  }

  async function listPacks() {
    let names = [];
    try {
      names = await fsp.readdir(dataDir);
    } catch {
      return [];
    }
    const files = [];
    // data/ ve bir alt düzey klasör (ör. data/maps, data/models, data/zim)
    const consider = async (rel, name) => {
      if (name.startsWith('.') || name === 'packs-manifest.json' || (!rel && name === 'board.json')) return;
      const full = path.join(dataDir, rel, name);
      if (!PACK_EXTS.includes(path.extname(name).toLowerCase())) {
        if (rel) return;
        try {
          if ((await fsp.stat(full)).isDirectory() && !name.startsWith('_')) {
            for (const n of (await fsp.readdir(full)).sort()) await consider(name, n);
          }
        } catch {}
        return;
      }
      const st = await statFile(full);
      if (!st) return;
      const url = './data/' + (rel ? encodeURIComponent(rel) + '/' : '') + encodeURIComponent(name);
      files.push({ name, size: st.size, url });
    };
    for (const name of names.sort()) await consider('', name);
    return files;
  }

  async function handleBoard(req, res, ip) {
    if (req.method === 'GET' || req.method === 'HEAD') {
      let since = 0;
      try {
        since = Number(new URL(req.url ?? '/', 'http://x').searchParams.get('since')) || 0;
      } catch {}
      sendJson(req, res, 200, { items: board.list(since), now: Date.now() });
      return;
    }
    if (req.method !== 'POST') {
      sendText(req, res, 405, 'Yöntem desteklenmiyor', { Allow: 'GET, HEAD, POST, OPTIONS' });
      return;
    }
    const ct = String(req.headers['content-type'] ?? '');
    if (!ct.toLowerCase().startsWith('application/json')) {
      req.resume();
      sendJson(req, res, 415, { error: 'JSON bekleniyor' });
      return;
    }
    const wait = board.rateOk(ip || '?');
    if (wait) {
      req.resume();
      res.setHeader('Retry-After', String(wait));
      sendJson(req, res, 429, { error: 'Çok sık gönderim. Biraz bekleyin.', retryAfter: wait });
      return;
    }
    const body = await readBody(req, BOARD_LIMITS.body);
    if (!body) {
      sendJson(req, res, 413, { error: 'Kayıt çok büyük' });
      return;
    }
    let raw;
    try {
      raw = JSON.parse(body.toString('utf8'));
    } catch {
      sendJson(req, res, 400, { error: 'Geçersiz JSON' });
      return;
    }
    const v = validateBoardItem(raw);
    if (!v.ok) {
      sendJson(req, res, 400, { error: v.error });
      return;
    }
    const r = board.add(v.item, isLoopback(ip));
    sendJson(req, res, r.status, { ok: true, item: r.item, duplicate: !!r.duplicate });
  }

  async function handleFetch(req, res, ip) {
    const allowed = isLoopback(ip || '') || remoteFetch;
    if (req.method === 'GET' || req.method === 'HEAD') {
      sendJson(req, res, 200, { available: true, allowed, jobs: fetcher.list() });
      return;
    }
    if (req.method !== 'POST') {
      sendText(req, res, 405, 'Yöntem desteklenmiyor', { Allow: 'GET, HEAD, POST, OPTIONS' });
      return;
    }
    if (!allowed) {
      req.resume();
      sendJson(req, res, 403, { error: 'Bu bilgi noktası yalnızca kendi bilgisayarından indirme kabul ediyor.' });
      return;
    }
    const body = await readBody(req, 2048);
    let raw;
    try {
      raw = JSON.parse(body?.toString('utf8') ?? '');
    } catch {
      sendJson(req, res, 400, { error: 'Geçersiz JSON' });
      return;
    }
    const file = typeof raw?.file === 'string' ? raw.file : '';
    if (raw?.action === 'start') {
      const r = await fetcher.start(file);
      sendJson(req, res, r.ok ? 200 : r.status, r.ok ? { ok: true, job: r.job } : { error: r.error });
    } else if (raw?.action === 'pause') {
      sendJson(req, res, 200, { ok: fetcher.pause(file) });
    } else if (raw?.action === 'cancel') {
      sendJson(req, res, 200, { ok: await fetcher.cancel(file) });
    } else sendJson(req, res, 400, { error: 'Geçersiz işlem' });
  }

  async function handle(req, res) {
    opts.onRequest?.(req);
    const ip = clientIp(req);
    if (ip && !isLoopback(ip)) seen.set(ip, Date.now());

    if (req.method === 'OPTIONS') {
      res.writeHead(204, baseHeaders({ 'Access-Control-Max-Age': '86400' }));
      res.end();
      return;
    }
    if ((req.url ?? '').split('?')[0] === '/api/board') {
      await handleBoard(req, res, ip);
      return;
    }
    if ((req.url ?? '').split('?')[0] === '/api/fetch') {
      await handleFetch(req, res, ip);
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      sendText(req, res, 405, 'Yöntem desteklenmiyor', { Allow: 'GET, HEAD, OPTIONS' });
      return;
    }
    let pathname;
    try {
      pathname = new URL(req.url ?? '/', 'http://x').pathname;
    } catch {
      sendText(req, res, 400, 'Geçersiz adres');
      return;
    }

    if (pathname === '/api/status') {
      const port = server.address()?.port;
      sendJson(req, res, 200, { server: true, name: SERVER_NAME, addresses: lanAddresses(), port, clients: clientCount(), apk: !!(await findApk()) });
      return;
    }
    if (pathname === '/api/packs') {
      sendJson(req, res, 200, { files: await listPacks() });
      return;
    }
    if (pathname.startsWith('/data/')) {
      const rel = pathname.slice('/data/'.length);
      const p = safeJoin(dataDir, rel);
      if (!p || !PACK_EXTS.includes(path.extname(p).toLowerCase()) || p === path.join(dataDir, 'board.json')) {
        sendText(req, res, p ? 404 : 403, p ? 'Bulunamadı' : 'Erişim yok');
        return;
      }
      const st = await statFile(p);
      if (!st) {
        sendText(req, res, 404, 'Bulunamadı');
        return;
      }
      await sendFile(req, res, p, st, { 'Cache-Control': 'no-cache' });
      return;
    }
    if (pathname === '/download/' + APK_NAME) {
      const apk = await findApk();
      if (!apk) {
        sendText(req, res, 404, 'APK bu bilgi noktasında yok');
        return;
      }
      await sendFile(req, res, apk.p, apk.st, { 'Content-Disposition': `attachment; filename="${APK_NAME}"`, 'Cache-Control': 'no-cache' });
      return;
    }
    if (pathname === '/packs-manifest.json') {
      const local = path.join(dataDir, 'packs-manifest.json');
      const st = await statFile(local);
      if (st) {
        await sendFile(req, res, local, st, { 'Cache-Control': 'no-store' });
        return;
      }
    }

    // Statik dosyalar (dist/)
    const p = safeJoin(distDir, pathname);
    if (!p) {
      sendText(req, res, 403, 'Erişim yok');
      return;
    }
    let st = await statFile(p);
    let file = p;
    if (!st && (await fsp.stat(p).catch(() => null))?.isDirectory()) {
      file = path.join(p, 'index.html');
      st = await statFile(file);
    }
    if (!st && !path.extname(pathname)) {
      // SPA geri dönüşü
      file = path.join(distDir, 'index.html');
      st = await statFile(file);
    }
    if (!st) {
      sendText(req, res, 404, 'Bulunamadı');
      return;
    }
    const isHtml = file.endsWith('.html') || file.endsWith('.webmanifest') || file.endsWith('sw.js');
    const cache = isHtml ? 'no-cache' : file.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=31536000, immutable' : 'public, max-age=3600';
    await sendFile(req, res, file, st, { 'Cache-Control': cache });
  }

  const server = http.createServer((req, res) => {
    handle(req, res).catch((e) => {
      if (!res.headersSent) sendText(req, res, 500, 'Sunucu hatası: ' + (e?.message ?? e));
      else res.destroy();
    });
  });
  server.keepAliveTimeout = 5000;

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(opts.port ?? 8080, host, () => {
      server.off('error', reject);
      resolve();
    });
  });
  const port = server.address().port;
  const addresses = lanAddresses();
  const close = () =>
    new Promise((r) => {
      fetcher.stopAll();
      server.closeAllConnections?.();
      server.close(() => r());
    }).then(() => board.flush());
  return { server, port, url: `http://localhost:${port}/`, addresses, dataDir, distDir, close, fetcher };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log('Kullanım: node server/server.mjs [--port 8080] [--data <klasör>] [--dist <klasör>] [--host 0.0.0.0]');
    return;
  }
  const port = args.port ?? (Number(process.env.AKIL_PORT) || 8080);
  let s;
  try {
    s = await startServer({ ...args, port });
  } catch (e) {
    if (e?.code === 'EADDRINUSE') console.error(`\n  Port ${port} kullanımda. Başka bir port deneyin:  node server/server.mjs --port 8081\n`);
    else if (e?.code === 'EACCES') console.error(`\n  Port ${port} için izin yok. 1024 üstü bir port deneyin (--port 8080).\n`);
    else console.error(e);
    process.exit(1);
  }
  const hasDist = !!(await statFile(path.join(s.distDir, 'index.html')));
  const urls = s.addresses.map((a) => `http://${a}:${s.port}`);
  const line = '─'.repeat(52);
  console.log(`\n  ${SERVER_NAME}\n  ${line}`);
  if (!hasDist) console.log(`  UYARI: ${s.distDir} içinde index.html yok. Önce "npm run build" çalıştırın.`);
  console.log(`  Paket klasörü : ${s.dataDir}`);
  console.log(`  Bu bilgisayar : http://localhost:${s.port}`);
  if (urls.length) {
    console.log('  Telefonlar    : aynı Wi-Fi / erişim noktasına bağlanıp şu adresi açsın:');
    for (const u of urls) console.log('                  ' + u);
    try {
      const QR = (await import('./vendor/qrcode.mjs').catch(() => import('qrcode'))).default;
      const qr = await QR.toString(urls[0], { type: 'terminal', small: true });
      console.log('\n' + qr);
    } catch {
      /* qrcode yoksa QR gösterilmez */
    }
  } else {
    console.log('  Ağ bağlantısı bulunamadı. Wi-Fi ya da Mobil erişim noktasını açıp sunucuyu yeniden başlatın.');
  }
  console.log(`  ${line}\n  Durdurmak için Ctrl+C\n`);
  const stop = () => {
    console.log('\n  Bilgi noktası kapatılıyor…');
    s.close().then(() => process.exit(0));
    setTimeout(() => process.exit(0), 2000).unref();
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main();
}
