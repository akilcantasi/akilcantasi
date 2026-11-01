// Akıl Çantası — Raspberry Pi "captive portal" ön sunucusu (İSTEĞE BAĞLI)
// DONANIMDA TEST EDİLMEDİ.
//
// Port 80'i dinler. Telefonların "internet var mı?" yoklamalarını ve başka
// alan adlarına giden istekleri (dnsmasq tüm adları Pi'ye yönlendirir)
// http://<pi>/ adresine yönlendirir; geri kalan her şeyi asıl sunucuya
// (server/server.mjs, varsayılan 127.0.0.1:8080) aktarır. Range istekleri ve
// büyük paket dosyaları akış olarak geçer.
//
//   node tools/pi/captive.mjs [--port 80] [--target 127.0.0.1:8080] [--host 10.42.0.1]
// Bağımlılık yok, yalnız Node.js.
import http from 'node:http';

function arg(name, def) {
  const i = process.argv.indexOf('--' + name);
  return i > 0 && process.argv[i + 1] ? process.argv[i + 1] : def;
}
const PORT = Number(arg('port', process.env.AKIL_CAPTIVE_PORT ?? 80));
const [TH, TP] = String(arg('target', process.env.AKIL_TARGET ?? '127.0.0.1:8080')).split(':');
const TARGET_HOST = TH || '127.0.0.1';
const TARGET_PORT = Number(TP || 8080);
// Telefonları yönlendireceğimiz adres (NetworkManager paylaşımlı ağ varsayılanı 10.42.0.1)
const PORTAL_HOST = String(arg('host', process.env.AKIL_PORTAL_HOST ?? '10.42.0.1'));
// Bu adlarla gelen istekler "bizim" sayılır, yönlendirilmez.
const OWN = new Set([PORTAL_HOST, 'localhost', '127.0.0.1', 'akilcantasi.lan', 'akilcantasi.local', 'akilcantasi']);

// Bilinen yoklama yolları (Android, iOS/macOS, Windows, Firefox, Linux)
const PROBES = new Set([
  '/generate_204',
  '/gen_204',
  '/hotspot-detect.html',
  '/library/test/success.html',
  '/connecttest.txt',
  '/ncsi.txt',
  '/redirect',
  '/success.txt',
  '/canonical.html',
  '/check_network_status.txt',
]);

export function isOwnHost(hostHeader) {
  if (!hostHeader) return true;
  const h = hostHeader.replace(/:\d+$/, '').replace(/^\[|\]$/g, '').toLowerCase();
  if (OWN.has(h)) return true;
  // Pi'nin kendi IP adresleri (Ethernet / başka ağ) — yönlendirme yapma
  return /^(\d{1,3}\.){3}\d{1,3}$/.test(h) || h.includes(':');
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', 'http://x');
  if (!isOwnHost(req.headers.host) || PROBES.has(url.pathname)) {
    const loc = `http://${PORTAL_HOST}/`;
    res.writeHead(302, { Location: loc, 'Cache-Control': 'no-store', 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`<!doctype html><meta charset="utf-8"><title>Akıl Çantası</title><a href="${loc}">Akıl Çantası'nı aç</a>`);
    return;
  }
  const up = http.request(
    { host: TARGET_HOST, port: TARGET_PORT, method: req.method, path: req.url, headers: { ...req.headers, 'x-forwarded-for': req.socket.remoteAddress ?? '' } },
    (r) => {
      res.writeHead(r.statusCode ?? 502, r.headers);
      r.pipe(res);
    },
  );
  up.on('error', () => {
    if (!res.headersSent) res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Akıl Çantası sunucusu henüz hazır değil. Birkaç saniye sonra yenileyin.');
  });
  req.on('aborted', () => up.destroy());
  res.on('close', () => up.destroy());
  req.pipe(up);
});
server.keepAliveTimeout = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Akıl Çantası captive ön sunucusu :${PORT} → ${TARGET_HOST}:${TARGET_PORT} (yönlendirme: http://${PORTAL_HOST}/)`);
});
