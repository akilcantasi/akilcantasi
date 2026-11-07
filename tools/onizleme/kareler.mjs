// README önizlemeleri — 2. adım: kareleri HTML ile çizip ekran görüntüsünü al.
//   node tools/onizleme/kareler.mjs [ham-klasörü] [kare-klasörü]
// Girdi: cek.mjs'nin telefon görüntüleri (780×1688). Çıktı: 2× boyutta kareler (2400×1500) ve
// tek telefon görüntüleri; birlestir.py bunları küçültüp WebP / PNG yapar. kareler.json süreleri taşır.
// Yazı tipleri uygulamanınkiler: node_modules/@fontsource (Poppins, IBM Plex Sans).
import { createRequire } from 'module';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const require = createRequire(import.meta.url);
let pw;
try { pw = require('playwright'); } catch { pw = require('/opt/npm-tools/node_modules/playwright'); }

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const HAM = path.resolve(process.argv[2] ?? path.join(os.tmpdir(), 'akil-onizleme', 'ham'));
const OUT = path.resolve(process.argv[3] ?? path.join(os.tmpdir(), 'akil-onizleme', 'kare'));
fs.mkdirSync(OUT, { recursive: true });

const W = 1200, H = 750; // CSS pikseli; deviceScaleFactor 2 ile çekilir
const url = (p) => pathToFileURL(p).href;
// @fontsource CSS'i olduğu gibi alınır (unicode-range ile latin + latin-ext), adresler mutlak yapılır
const fontCss = (pkg, agirlik) => {
  const dir = path.join(ROOT, 'node_modules/@fontsource', pkg);
  return fs.readFileSync(path.join(dir, agirlik + '.css'), 'utf8').replace(/url\(\.\/files\//g, 'url(' + url(path.join(dir, 'files')) + '/');
};
const YAZI_TIPLERI = [400, 500, 600, 700].map((a) => fontCss('poppins', a)).join('\n') + [400, 500].map((a) => fontCss('ibm-plex-sans', a)).join('\n');
const ham = (ad) => url(path.join(HAM, ad + '.png'));

const SEKMELER = ['Fener', 'Rehber', 'Harita', 'İletişim', 'Kütüphane', 'Araçlar'];

// ---------- kare tanımları ----------
const DOSYALAR = {
  onizleme: {
    adimlar: SEKMELER,
    kareler: [
      { ekran: ['fener-soru'], aktif: 0, baslik: 'Fener: internetsiz yapay zekâ asistanı', alt: 'Sorunuzu yazın. Cevap telefondaki rehberlerden ve Vikipedi’den gelir; internet ve şebeke gerekmez.' },
      { ekran: ['fener-cevap', 'fener-kaynak'], aktif: 0, baslik: 'Her cevap kaynağıyla', alt: 'Rehber ve Vikipedi kaynakları tek dokunuşla açılır. Model yüklü değilse Fener rehberden cevap verir.' },
      { ekran: ['rehber-ana', 'rehber-detay'], aktif: 1, baslik: 'Rehber: internetsiz, çizimli adım adım', alt: '18 kategoride 168 resimli rehber: deprem, ilk yardım, yangın, sel, su ve gıda, barınma…' },
      { ekran: ['rehber-adimlar'], aktif: 1, baslik: 'Her adım bir çizimle', alt: 'Panik anında okunması kolay: kısa cümleler, büyük yazı, açık çizimler.' },
      { ekran: ['harita-ana', 'harita-nokta'], aktif: 2, baslik: 'Harita: çevrimdışı Türkiye', alt: 'Toplanma alanı, sağlık, eczane ve su noktaları. En yakın toplanma alanı tek dokunuşla.' },
      { ekran: ['harita-ara', 'harita-yer'], aktif: 2, baslik: 'Yer adı araması, internetsiz', alt: 'İlçe, mahalle ya da köy adını yazın; harita oraya gider, pusula yönü gösterir.' },
      { ekran: ['iletisim-ana', 'iletisim-pano'], aktif: 3, baslik: 'İletişim: şebeke yokken de haberleşin', alt: 'Aynı Wi-Fi’daki herkesle mesaj panosu, “iyiyim” bildirimi, SOS ışık ve ses, konumlu SMS.' },
      { ekran: ['iletisim-kayip'], aktif: 3, baslik: 'Kayıp kişi ilanları', alt: 'İlanlar imzalı gelir; başka telefonda “✓ doğrulandı” görünür. “Bulundu” işaretini yalnız ilanı veren koyabilir.' },
      { ekran: ['kutuphane-ara', 'kutuphane-makale'], aktif: 4, baslik: 'Kütüphane: Vikipedi cebinizde', alt: 'ZIM arşivlerinde başlık ve tam metin araması. Makaleyi okurken Fener’e sorabilirsiniz.' },
      { ekran: ['araclar', 'enkaz-acik'], aktif: 5, baslik: 'Araçlar: hazırlıktan enkaza', alt: 'Afet çantası listesi, su ve yiyecek hesabı, pusula, radyo rehberi ve enkaz modu.', sure: 2800 },
    ],
  },
  enkaz: {
    adimlar: ['Enkaz altındaki', 'Kurtarıcı'],
    kareler: [
      { ekran: ['enkaz-hazirlik'], aktif: 0, baslik: 'Enkaz modu: önceden hazırlık', alt: 'Bina, blok, kat ve daire kaydedilir; kurtarıcı sizi nerede arayacağını bilir.' },
      { ekran: ['enkaz-baslat'], aktif: 0, baslik: 'Tek dokunuşla başlat', alt: '112’ye ve yakınlarınıza konumlu SMS gider; telefon Bluetooth işareti yaymaya başlar.' },
      { ekran: ['enkaz-acik'], aktif: 0, baslik: 'İşaret kodu, SOS ses ve ışık', alt: 'AK-00004D kodlu işaret, aralıklı SOS sesi. Ekran kapalıyken de sürer, pili idareli kullanır.' },
      { ekran: ['arama-bos', 'arama-iz'], aktif: 1, baslik: 'Kurtarıcı: Enkaz arama', alt: 'Yakındaki işaretler duyulur. Sinyal gücü ve “Yaklaşıyorsunuz” göstergesi yönü bulmaya yardım eder.' },
      { ekran: ['arama-iz', 'enkaz-mesaj'], aktif: 1, baslik: 'Enkazdaki telefona kısa mesaj', alt: 'Şebekesiz, Bluetooth ile. Mesaj enkazdaki telefonda yazılır ve sesli okunur; hazır yanıtla cevap verilir.' },
      { ekran: ['arama-mesaj'], aktif: 1, baslik: 'Yanıt kurtarıcıya ulaşır', alt: '“Yaralıyım.” İşaret kodu, kat ve yanıt 112’ye SMS ile bildirilebilir.', sure: 2800 },
    ],
  },
  harita: {
    adimlar: ['Ara', 'Seç', 'Yön'],
    kareler: [
      { ekran: ['harita-ana'], aktif: 0, baslik: 'Çevrimdışı harita', alt: 'Türkiye haritası telefonda. Konumunuz ve çevredeki afet noktaları internetsiz görünür.' },
      { ekran: ['harita-ara'], aktif: 0, baslik: 'Yer adıyla arayın', alt: 'İlçe, mahalle, köy: Türkçe harf yazmadan da bulur, uzaklığı yanında yazar.' },
      { ekran: ['harita-yer'], aktif: 1, baslik: 'Harita oraya gider', alt: 'Seçilen yer işaretlenir; uzaklık ve yürüyerek süre kartta görünür.' },
      { ekran: ['harita-yon'], aktif: 2, baslik: 'Yön göster', alt: 'Pusula, seçilen yere kuş uçuşu yönü ve uzaklığı gösterir.', sure: 2800 },
    ],
  },
};

// Tablodaki tek telefon görüntüleri
const TEKLER = { rehber: 'rehber-detay', harita: 'harita-nokta', iletisim: 'iletisim-pano', kutuphane: 'kutuphane-makale', fener: 'fener-cevap', araclar: 'araclar' };

const CSS = `
${YAZI_TIPLERI}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { width: ${W}px; height: ${H}px; overflow: hidden; }
body { font-family: Poppins, sans-serif; color: #f4f7fb; -webkit-font-smoothing: antialiased;
  background:
    radial-gradient(640px 420px at 8% 0%, rgba(245,165,36,0.13), transparent 70%),
    radial-gradient(700px 520px at 100% 100%, rgba(116,182,255,0.10), transparent 70%),
    linear-gradient(150deg, #13263f 0%, #0e1b2c 55%, #0b1625 100%); }
.sahne { position: absolute; inset: 0; display: flex; align-items: center; padding: 0 44px 0 60px; gap: 30px; }
.sol { flex: 0 0 430px; display: flex; flex-direction: column; height: 100%; padding: 60px 0 56px; }
.marka { display: flex; align-items: center; gap: 12px; }
.marka img { width: 44px; height: 44px; border-radius: 12px; }
.marka b { font-size: 22px; font-weight: 700; letter-spacing: 0.2px; }
.marka b i { font-style: italic; font-weight: 500; color: #f5a524; }
.metin { margin-top: auto; margin-bottom: auto; }
.sekme { display: inline-block; font-size: 15px; font-weight: 600; color: #1a1206; background: #f5a524; border-radius: 999px; padding: 5px 16px; margin-bottom: 20px; }
h1 { font-size: 38px; line-height: 1.18; font-weight: 600; letter-spacing: -0.3px; }
p { margin-top: 18px; font-family: 'IBM Plex Sans', sans-serif; font-size: 20px; line-height: 1.5; color: #c3cfdd; }
.adimlar { display: flex; flex-wrap: nowrap; gap: 6px; }
.adimlar span { font-size: 11.5px; font-weight: 500; color: #98a8bd; border: 1px solid #26405f; border-radius: 999px; padding: 3px 8px; white-space: nowrap; }
.adimlar span.on { color: #f5a524; border-color: #f5a524; background: rgba(245,165,36,0.12); }
.sag { flex: 1; min-width: 0; display: flex; justify-content: center; align-items: center; gap: 22px; height: 100%; }
.tel { position: relative; padding: 7px; border-radius: 44px; background: #070f1a;
  box-shadow: 0 0 0 1.5px rgba(255,255,255,0.10), 0 28px 60px rgba(0,0,0,0.45), 0 8px 18px rgba(0,0,0,0.30); }
.tel img { display: block; width: 282px; height: 610px; border-radius: 35px; }
.tek .tel img { width: 304px; height: 658px; border-radius: 37px; }
.ikinci { transform: translateY(14px); }
/* Tek telefon (tablo): saydam zemin */
body.yalniz { background: transparent; width: 420px; height: 880px; }
body.yalniz .tel { position: absolute; left: 22px; top: 14px; box-shadow: 0 0 0 1.5px rgba(255,255,255,0.10), 0 12px 24px rgba(0,0,0,0.28); }
body.yalniz .tel img { width: 362px; height: 784px; border-radius: 40px; }
`;

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
function kareHtml(d, k) {
  const tel = k.ekran.map((e, i) => `<div class="tel${i === 1 ? ' ikinci' : ''}"><img src="${ham(e)}"></div>`).join('');
  return `<!doctype html><html lang="tr"><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="sahne">
  <div class="sol">
    <div class="marka"><img src="${url(path.join(ROOT, 'public/icon-192.png'))}"><b>AKIL<i>çantası</i></b></div>
    <div class="metin">
      <span class="sekme">${esc(d.adimlar[k.aktif])}</span>
      <h1>${esc(k.baslik)}</h1>
      <p>${esc(k.alt)}</p>
    </div>
    <div class="adimlar">${d.adimlar.map((a, i) => `<span class="${i === k.aktif ? 'on' : ''}">${esc(a)}</span>`).join('')}</div>
  </div>
  <div class="sag${k.ekran.length === 1 ? ' tek' : ''}">${tel}</div>
</div></body></html>`;
}
const tekHtml = (e) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body class="yalniz"><div class="tel"><img src="${ham(e)}"></div></body></html>`;

// Eksik ham görüntü varsa baştan söyle
const gerekli = new Set([...Object.values(DOSYALAR).flatMap((d) => d.kareler.flatMap((k) => k.ekran)), ...Object.values(TEKLER)]);
const eksik = [...gerekli].filter((e) => !fs.existsSync(path.join(HAM, e + '.png')));
if (eksik.length) { console.error('Eksik ham görüntü: ' + eksik.join(', ') + '\nÖnce: node tools/onizleme/cek.mjs ' + HAM); process.exit(1); }

const browser = await pw.chromium.launch();
const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
const tmp = path.join(OUT, '_sayfa.html');
const ozet = { dosyalar: {}, tekler: {} };
async function ciz(html, dosya) {
  fs.writeFileSync(tmp, html);
  await p.goto(url(tmp));
  await p.evaluate(async () => {
    await Promise.all(['400 20px "IBM Plex Sans"', '600 38px Poppins', '700 22px Poppins', '500 13px Poppins'].map((f) => document.fonts.load(f, 'Ağış çÖÜ Her')));
    await document.fonts.ready;
  });
  await p.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await p.screenshot({ path: dosya, omitBackground: true });
}
for (const [ad, d] of Object.entries(DOSYALAR)) {
  await p.setViewportSize({ width: W, height: H });
  ozet.dosyalar[ad] = [];
  for (const [i, k] of d.kareler.entries()) {
    const f = path.join(OUT, `${ad}-${String(i + 1).padStart(2, '0')}.png`);
    await ciz(kareHtml(d, k), f);
    ozet.dosyalar[ad].push({ dosya: path.basename(f), sure: k.sure ?? 2200 });
    console.log('  ✓', path.basename(f));
  }
}
await p.setViewportSize({ width: 420, height: 880 });
for (const [ad, e] of Object.entries(TEKLER)) {
  const f = path.join(OUT, `tek-${ad}.png`);
  await ciz(tekHtml(e), f);
  ozet.tekler[ad] = path.basename(f);
  console.log('  ✓', path.basename(f));
}
fs.rmSync(tmp);
fs.writeFileSync(path.join(OUT, 'kareler.json'), JSON.stringify(ozet, null, 2));
await browser.close();
console.log('Bitti →', OUT);
