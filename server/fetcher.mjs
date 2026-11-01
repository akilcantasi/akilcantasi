// Akıl Çantası — sunucu tarafı paket indirici.
//
// Tarayıcı Kiwix dosyalarını yalnızca CORS izni veren tek aynadan (mirror.download.kiwix.org)
// indirebilir; o ayna sık sık çok yavaşlar. Bilgi noktası sunucusu ise CORS'a bağlı değildir:
//   1) Katalogdaki paketin bütün aynalarını kısa bir ölçümle dener, en hızlılarını seçer
//   2) Dosyayı birkaç paralel bağlantıyla (bölüm bölüm) indirir
//   3) Takılan bağlantıyı yeniler, gerekirse başka aynaya geçer
//   4) Yarım kalan indirme sunucu yeniden açılınca kaldığı yerden sürer
//   5) Bitince boyut (ve varsa SHA-256) doğrulanır, dosya data/ klasörüne taşınır
//
// Yalnızca katalogdaki (packs-manifest.json) paketler indirilebilir; istemci adres gönderemez.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

/** Kiwix aynaları (…/zim/<dizin>/<dosya> yapısı). Ölçümle sıralanır; hepsinde her dosya olmayabilir. */
export const KIWIX_MIRRORS = [
  'https://ftp.fau.de/kiwix/zim',
  'https://ftp.nluug.nl/pub/kiwix/zim',
  'https://mirrors.dotsrc.org/kiwix/zim',
  'https://mirror.accum.se/mirror/kiwix.org/zim',
  'https://dumps.wikimedia.org/kiwix/zim',
  'https://wi.mirror.driftle.ss/kiwix/zim',
  'https://mirror.download.kiwix.org/zim',
  'https://download.kiwix.org/zim',
];

export const PART_DIR = '_indiriliyor';
const SEGMENTS = 4;
const MIN_SEGMENT = 16 * 1024 * 1024;
const PROBE_BYTES = 3 * 1024 * 1024;
const PROBE_MS = 7000;
const STALL_MS = 25000;
const SAVE_MS = 2000;

/**
 * Bir paket adresinden denenebilecek tüm aynaları üretir.
 * Kiwix adreslerinde (…/zim/<yol>) bilinen bütün aynalar eklenir; diğerleri olduğu gibi kalır.
 */
export function expandMirrors(urls) {
  const out = [];
  const add = (u) => {
    if (u && /^https?:\/\//.test(u) && !out.includes(u)) out.push(u);
  };
  for (const u of urls ?? []) {
    const m = /^https?:\/\/[^/]*kiwix\.org\/zim\/(.+)$/.exec(u) ?? /^https?:\/\/[^/]+\/(?:.*\/)?kiwix(?:\.org)?(?:-md)?\/zim\/(.+)$/.exec(u);
    if (m) for (const b of KIWIX_MIRRORS) add(`${b}/${m[1]}`);
    add(u);
  }
  return out;
}

/** Kalan aralığı en çok n bölüme ayırır: [{start,end,pos}] (end dahil). */
export function planSegments(total, n = SEGMENTS, min = MIN_SEGMENT) {
  if (!total) return [{ start: 0, end: -1, pos: 0 }];
  const count = Math.max(1, Math.min(n, Math.floor(total / min) || 1));
  const size = Math.ceil(total / count);
  const out = [];
  for (let i = 0; i < count; i++) {
    const start = i * size;
    const end = Math.min(total, start + size) - 1;
    if (start <= end) out.push({ start, end, pos: start });
  }
  return out;
}

export function remaining(segs) {
  return segs.reduce((a, s) => a + (s.end < 0 ? 1 : Math.max(0, s.end - s.pos + 1)), 0);
}

function safeName(name) {
  return typeof name === 'string' && /^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(name) && !name.includes('..');
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * @param {{ dataDir: string, loadManifest: () => Promise<any>, onChange?: () => void, fetch?: typeof fetch,
 *           segments?: number, minSegment?: number, stallMs?: number, probeMs?: number, mirrors?: (urls:string[]) => string[] }} o
 */
export function createFetcher(o) {
  const f = o.fetch ?? fetch;
  const partDir = path.join(o.dataDir, PART_DIR);
  const jobs = new Map(); // file → job
  const expand = o.mirrors ?? expandMirrors;
  const stallMs = o.stallMs ?? STALL_MS;

  const pub = (j) => ({
    file: j.file,
    id: j.id,
    status: j.status,
    received: j.received,
    total: j.total,
    speed: Math.round(j.speed),
    mirror: j.mirrorHost ?? null,
    error: j.error ?? null,
  });

  async function findEntry(fileOrId) {
    const m = await o.loadManifest().catch(() => null);
    return (m?.packs ?? []).find((p) => p.file === fileOrId || p.id === fileOrId) ?? null;
  }

  /** Aynaları paralel ölçer; çalışanları hıza göre sıralı döndürür. */
  async function probe(urls) {
    // İlk ayna ölçümü bitirince diğerlerine kısa bir ek süre tanınır; yavaş aynalar beklenmez
    const ctls = [];
    let graceSet = false;
    const grace = () => {
      if (graceSet) return;
      graceSet = true;
      setTimeout(() => ctls.forEach((c) => c.abort()), 1500).unref?.();
    };
    const results = await Promise.all(
      urls.map(async (url) => {
        const ctl = new AbortController();
        ctls.push(ctl);
        const t = setTimeout(() => ctl.abort(), o.probeMs ?? PROBE_MS);
        const t0 = Date.now();
        let got = 0;
        let total = 0;
        try {
          const r = await f(url, { headers: { Range: `bytes=0-${PROBE_BYTES - 1}` }, signal: ctl.signal, redirect: 'follow' });
          if (r.status !== 206 && r.status !== 200) {
            r.body?.cancel?.().catch(() => {});
            return null;
          }
          const cr = /\/(\d+)$/.exec(r.headers.get('content-range') ?? '');
          total = cr ? Number(cr[1]) : r.status === 200 ? Number(r.headers.get('content-length')) || 0 : 0;
          const ranges = r.status === 206;
          const reader = r.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            got += value.length;
            if (got >= PROBE_BYTES) {
              reader.cancel().catch(() => {});
              break;
            }
          }
          const sec = Math.max(0.05, (Date.now() - t0) / 1000);
          grace();
          return { url, speed: got / sec, total, ranges };
        } catch {
          const sec = Math.max(0.05, (Date.now() - t0) / 1000);
          return got > 256 * 1024 ? { url, speed: got / sec, total, ranges: true } : null;
        } finally {
          clearTimeout(t);
        }
      }),
    );
    return results.filter(Boolean).sort((a, b) => b.speed - a.speed);
  }

  async function saveState(j) {
    const st = { file: j.file, id: j.id, total: j.total, sha256: j.sha256 ?? '', segments: j.segments };
    await fsp.writeFile(j.statePath, JSON.stringify(st)).catch(() => {});
  }

  async function run(j) {
    j.status = 'checking';
    j.error = null;
    o.onChange?.();
    const ctl = new AbortController();
    j.ctl = ctl;
    let fh;
    try {
      await fsp.mkdir(partDir, { recursive: true });
      const ranked = await probe(j.urls);
      if (ctl.signal.aborted) throw Object.assign(new Error('durduruldu'), { aborted: true });
      if (!ranked.length) throw new Error('Hiçbir kaynağa ulaşılamadı. İnternet bağlantısını kontrol edin.');
      const total = j.expectedSize || ranked.find((r) => r.total)?.total || 0;
      if (j.expectedSize && ranked[0].total && ranked[0].total !== j.expectedSize) {
        // Boyutu uyuşmayan aynaları ele (eski sürüm vb.)
        const ok = ranked.filter((r) => !r.total || r.total === j.expectedSize);
        if (!ok.length) throw new Error('Sunucudaki dosya boyutu katalogla uyuşmuyor.');
        ranked.splice(0, ranked.length, ...ok);
      }
      const mirrors = ranked.map((r) => r.url);
      // Bölümler, en hızlının en az yarısı kadar hızlı aynalara paylaştırılır
      const good = Math.max(1, ranked.filter((r) => r.speed >= ranked[0].speed * 0.5).length);
      const canRange = ranked[0].ranges && total > 0;

      // Önceki ilerleme
      let segs = null;
      try {
        const prev = JSON.parse(await fsp.readFile(j.statePath, 'utf8'));
        if (prev.total === total && Array.isArray(prev.segments) && fs.existsSync(j.partPath)) segs = prev.segments;
      } catch {}
      if (!segs || !canRange) {
        segs = canRange ? planSegments(total, o.segments ?? SEGMENTS, o.minSegment ?? MIN_SEGMENT) : [{ start: 0, end: -1, pos: 0 }];
        await fsp.rm(j.partPath, { force: true });
      }
      j.total = total;
      j.segments = segs;
      j.received = total ? total - remaining(segs) : 0;
      fh = await fsp.open(j.partPath, fs.existsSync(j.partPath) ? 'r+' : 'w+');
      j.status = 'downloading';
      o.onChange?.();

      // Hız: son birkaç saniyedeki bayt
      const samples = [];
      const tick = setInterval(() => {
        samples.push([Date.now(), j.received]);
        while (samples.length > 6) samples.shift();
        if (samples.length > 1) {
          const [t0, b0] = samples[0];
          const [t1, b1] = samples[samples.length - 1];
          j.speed = t1 > t0 ? ((b1 - b0) * 1000) / (t1 - t0) : 0;
        }
        o.onChange?.();
      }, 1000);
      const saver = setInterval(() => void saveState(j), SAVE_MS);

      const worker = async (seg, k) => {
        let mi = k % Math.min(good, 3);
        let fails = 0;
        while ((seg.end < 0 || seg.pos <= seg.end) && !ctl.signal.aborted) {
          const url = mirrors[mi % mirrors.length];
          const local = new AbortController();
          const onAbort = () => local.abort();
          ctl.signal.addEventListener('abort', onAbort);
          let stallTimer = setTimeout(() => local.abort(), stallMs);
          const before = seg.pos;
          try {
            const headers = canRange ? { Range: `bytes=${seg.pos}-${seg.end}` } : {};
            const r = await f(url, { headers, signal: local.signal, redirect: 'follow' });
            if (canRange && r.status !== 206) throw new Error('aralık desteklenmiyor (HTTP ' + r.status + ')');
            if (!canRange && r.status !== 200) throw new Error('HTTP ' + r.status);
            j.mirrorHost ??= new URL(r.url || url).host;
            const reader = r.body.getReader();
            for (;;) {
              const { done, value } = await reader.read();
              if (done) break;
              clearTimeout(stallTimer);
              stallTimer = setTimeout(() => local.abort(), stallMs);
              let buf = value;
              if (seg.end >= 0 && seg.pos + buf.length > seg.end + 1) buf = buf.subarray(0, seg.end + 1 - seg.pos);
              await fh.write(buf, 0, buf.length, seg.pos);
              seg.pos += buf.length;
              j.received += buf.length;
              if (seg.end >= 0 && seg.pos > seg.end) {
                reader.cancel().catch(() => {});
                break;
              }
            }
            if (seg.end < 0) seg.end = seg.pos - 1; // boyutu bilinmeyen tek parça bitti
          } catch (e) {
            if (ctl.signal.aborted) break;
            // ilerleme yoksa sıradaki aynaya geç
            if (seg.pos === before) {
              fails++;
              mi++;
              if (fails > mirrors.length * 3) throw new Error('Bağlantı tekrar tekrar koptu: ' + (e?.message ?? e));
              await sleep(Math.min(8000, 500 * fails));
            }
          } finally {
            clearTimeout(stallTimer);
            ctl.signal.removeEventListener('abort', onAbort);
          }
        }
      };

      try {
        await Promise.all(segs.map((s, k) => worker(s, k)));
      } finally {
        clearInterval(tick);
        clearInterval(saver);
        await saveState(j);
      }
      if (ctl.signal.aborted) throw Object.assign(new Error('durduruldu'), { aborted: true });

      await fh.sync().catch(() => {});
      const size = (await fh.stat()).size;
      await fh.close();
      fh = null;
      if (j.total && size !== j.total) throw new Error(`Boyut uyuşmuyor (${size} / ${j.total}).`);
      j.total = size;
      j.received = size;
      if (j.sha256) {
        j.status = 'verifying';
        o.onChange?.();
        const h = crypto.createHash('sha256');
        await new Promise((res, rej) => fs.createReadStream(j.partPath).on('data', (d) => h.update(d)).on('end', res).on('error', rej));
        if (h.digest('hex') !== j.sha256.toLowerCase()) {
          await fsp.rm(j.partPath, { force: true });
          await fsp.rm(j.statePath, { force: true });
          throw new Error('SHA-256 doğrulaması başarısız; dosya silindi, yeniden indirin.');
        }
      }
      await fsp.rename(j.partPath, j.finalPath);
      await fsp.rm(j.statePath, { force: true });
      j.status = 'done';
      j.speed = 0;
      o.onChange?.();
      setTimeout(() => {
        if (jobs.get(j.file) === j && j.status === 'done') jobs.delete(j.file);
        o.onChange?.();
      }, 30_000).unref?.();
    } catch (e) {
      await fh?.close().catch(() => {});
      j.speed = 0;
      if (e?.aborted || ctl.signal.aborted) {
        if (j.removeOnAbort) {
          await fsp.rm(j.partPath, { force: true });
          await fsp.rm(j.statePath, { force: true });
          jobs.delete(j.file);
        } else j.status = 'paused';
      } else {
        j.status = 'error';
        j.error = e?.message ?? String(e);
      }
      o.onChange?.();
    } finally {
      j.ctl = null;
    }
  }

  return {
    /** Katalogdaki paketi indirmeye başlar (ya da sürdürür). */
    async start(fileOrId) {
      const e = await findEntry(fileOrId);
      if (!e) return { ok: false, status: 404, error: 'Paket katalogda yok' };
      if (!safeName(e.file)) return { ok: false, status: 400, error: 'Geçersiz dosya adı' };
      if (!(e.urls ?? []).some((u) => /^https?:\/\//.test(u))) return { ok: false, status: 400, error: 'Bu paket sunucuda indirilemez' };
      const finalPath = path.join(o.dataDir, e.file);
      // Aynı adlı dosya varsa: boyutu katalogla aynıysa indirilecek bir şey yok; farklıysa yeni sürüm
      // .part'a iner, bitince eskisinin yerine geçer (o ana kadar eski dosya sunulmaya devam eder).
      if (fs.existsSync(finalPath)) {
        const have = fs.statSync(finalPath).size;
        if (e.sizeApprox || !e.size || have === e.size) return { ok: true, job: { file: e.file, id: e.id, status: 'done', received: have, total: have, speed: 0 } };
      }
      let j = jobs.get(e.file);
      if (j && (j.status === 'downloading' || j.status === 'checking' || j.status === 'verifying')) return { ok: true, job: pub(j) };
      j ??= {
        file: e.file,
        id: e.id,
        received: 0,
        total: e.sizeApprox ? 0 : e.size || 0,
        speed: 0,
        status: 'paused',
      };
      Object.assign(j, {
        urls: expand(e.urls),
        expectedSize: e.sizeApprox ? 0 : e.size || 0,
        sha256: e.sha256 || '',
        partPath: path.join(partDir, e.file + '.part'),
        statePath: path.join(partDir, e.file + '.durum'),
        finalPath,
        removeOnAbort: false,
        mirrorHost: null,
      });
      jobs.set(e.file, j);
      void run(j);
      return { ok: true, job: pub(j) };
    },
    pause(file) {
      const j = jobs.get(file);
      if (!j) return false;
      j.ctl?.abort();
      if (!j.ctl) j.status = 'paused';
      o.onChange?.();
      return true;
    },
    async cancel(file) {
      const j = jobs.get(file);
      if (j?.ctl) {
        j.removeOnAbort = true;
        j.ctl.abort();
      } else {
        jobs.delete(file);
        if (safeName(file)) {
          await fsp.rm(path.join(partDir, file + '.part'), { force: true });
          await fsp.rm(path.join(partDir, file + '.durum'), { force: true });
        }
      }
      o.onChange?.();
      return true;
    },
    /** Önceki oturumdan kalan yarım indirmeleri "duraklatıldı" olarak listeler. */
    async restore() {
      let names = [];
      try {
        names = await fsp.readdir(partDir);
      } catch {
        return;
      }
      for (const n of names) {
        if (!n.endsWith('.durum')) continue;
        try {
          const st = JSON.parse(await fsp.readFile(path.join(partDir, n), 'utf8'));
          if (!safeName(st.file) || jobs.has(st.file)) continue;
          const segs = Array.isArray(st.segments) ? st.segments : [];
          jobs.set(st.file, { file: st.file, id: st.id, status: 'paused', total: st.total || 0, received: st.total ? st.total - remaining(segs) : 0, speed: 0 });
        } catch {}
      }
    },
    list() {
      return [...jobs.values()].map(pub);
    },
    stopAll() {
      for (const j of jobs.values()) j.ctl?.abort();
    },
  };
}
