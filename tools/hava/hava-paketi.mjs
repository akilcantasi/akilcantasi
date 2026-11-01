// Akıl Çantası — hava ve iklim paketi üretici.
//
//   node tools/hava/hava-paketi.mjs <çıktı.json>
//
// İnternet yokken de işe yarayacak iki bilgi toplar, 81 il için:
//  1) İklim normalleri (ay ay ortalama, en yüksek, en düşük sıcaklık ve yağış):
//     NASA POWER iklim verisi (power.larc.nasa.gov), il başına tek istek.
//  2) Önümüzdeki ~6 ayın eğilimi: ECMWF SEAS5 mevsimsel tahmini (Open-Meteo üzerinden, CC BY 4.0).
//     Gün gün hava durumu DEĞİLDİR; her ay için "normalden ne kadar sıcak/soğuk, yağışlı/kurak".
//
// Hesap:
//  - Beklenen aylık sıcaklık = il normali + modelin sıcaklık sapması (°C).
//  - Yağış oranı = modelin aylık yağış ortalaması / modelin kendi iklimi (ortalama − sapma).
//    Böylece birim (mm/gün ya da mm/ay) farkı sonucu etkilemez.
// SEAS5 her ayın 5'inde güncellenir; paket o tarihten sonra üretilmelidir.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const DAYS = [31, 28.25, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export const POWER_URL = (lat, lon) =>
  `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,T2M_MAX,T2M_MIN,PRECTOTCORR&community=AG&longitude=${lon}&latitude=${lat}&format=JSON`;

export const SEASONAL_VARS = ['temperature_2m_mean', 'temperature_2m_anomaly', 'precipitation_mean', 'precipitation_anomaly'];
export const SEASONAL_URL = (lats, lons) =>
  `https://seasonal-api.open-meteo.com/v1/seasonal?latitude=${lats.join(',')}&longitude=${lons.join(',')}&monthly=${SEASONAL_VARS.join(',')}&timezone=GMT`;

const r1 = (x) => (Number.isFinite(x) ? Math.round(x * 10) / 10 : null);
const r2 = (x) => (Number.isFinite(x) ? Math.round(x * 100) / 100 : null);

/** NASA POWER iklim yanıtı → { t, tmax, tmin, yagis } (12 aylık diziler; yağış mm/ay) */
export function parsePower(json) {
  const p = json?.properties?.parameter;
  if (!p?.T2M) throw new Error('NASA POWER yanıtında T2M yok');
  const get = (k) => MONTHS.map((m) => {
    const v = Number(p[k]?.[m]);
    return Number.isFinite(v) && v > -900 ? v : NaN;
  });
  const prec = get('PRECTOTCORR'); // mm/gün
  return {
    t: get('T2M').map(r1),
    tmax: get('T2M_MAX').map(r1),
    tmin: get('T2M_MIN').map(r1),
    yagis: prec.map((v, i) => (Number.isFinite(v) ? Math.round(v * DAYS[i]) : null)),
  };
}

/**
 * Open-Meteo mevsimsel yanıtı (tek konum nesnesi) → aylar.
 * Her ay: { ay: 'YYYY-MM', tSapma, yagisOran }
 */
export function parseSeasonal(json) {
  const m = json?.monthly;
  if (!m?.time?.length) throw new Error('mevsimsel yanıtta monthly.time yok');
  const out = [];
  for (let i = 0; i < m.time.length; i++) {
    const ay = String(m.time[i]).slice(0, 7);
    const ta = Number(m.temperature_2m_anomaly?.[i]);
    const pm = Number(m.precipitation_mean?.[i]);
    const pa = Number(m.precipitation_anomaly?.[i]);
    const clim = pm - pa;
    const oran = Number.isFinite(pm) && Number.isFinite(pa) && clim > 0.01 ? pm / clim : null;
    out.push({ ay, tSapma: r1(ta), yagisOran: oran == null ? null : r2(Math.max(0, Math.min(5, oran))) });
  }
  return out;
}

/** Bir ilin tahmin aylarını normalle birleştirir: beklenen sıcaklık ve yağış */
export function combine(normal, aylar) {
  return aylar.map((a) => {
    const mi = Number(a.ay.slice(5, 7)) - 1;
    const tn = normal.t[mi];
    const yn = normal.yagis[mi];
    return {
      ay: a.ay,
      t: tn != null && a.tSapma != null ? r1(tn + a.tSapma) : null,
      tSapma: a.tSapma,
      yagis: yn != null && a.yagisOran != null ? Math.round(yn * a.yagisOran) : null,
      yagisOran: a.yagisOran,
    };
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 5) {
  let last;
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'AkilCantasi-hava/1.0 (+https://github.com/akilcantasi/akilcantasi)' } });
      if (res.ok) return await res.json();
      last = new Error(`${res.status} ${(await res.text()).slice(0, 200)}`);
      if (res.status === 400) break; // parametre hatası: tekrar denemenin anlamı yok
    } catch (e) {
      last = e;
    }
    await sleep(3000 * (i + 1));
  }
  throw last;
}

export async function build({ iller, log = console.log, fetchJson = getJson, now = new Date() }) {
  // 1) Normaller
  const normals = [];
  for (const il of iller) {
    const j = await fetchJson(POWER_URL(il.lat, il.lon));
    normals.push(parsePower(j));
    log(`normal: ${il.ad}`);
    await sleep(fetchJson === getJson ? 400 : 0);
  }
  // 2) Mevsimsel tahmin (10'arlı gruplar hâlinde)
  const seasonal = [];
  let seasonalError = null;
  try {
    for (let i = 0; i < iller.length; i += 10) {
      const g = iller.slice(i, i + 10);
      const j = await fetchJson(SEASONAL_URL(g.map((x) => x.lat), g.map((x) => x.lon)));
      const arr = Array.isArray(j) ? j : [j];
      if (arr.length !== g.length) throw new Error(`mevsimsel yanıt sayısı ${arr.length} ≠ ${g.length}`);
      for (const x of arr) seasonal.push(parseSeasonal(x));
      log(`tahmin: ${g[0].ad} … ${g[g.length - 1].ad}`);
      await sleep(fetchJson === getJson ? 1500 : 0);
    }
  } catch (e) {
    // Normaller tek başına da işe yarar; tahmin alınamazsa paket yine üretilir
    seasonalError = String(e?.message ?? e);
    log('! mevsimsel tahmin alınamadı: ' + seasonalError);
    seasonal.length = 0;
  }
  const aylar = seasonal[0]?.map((a) => a.ay) ?? [];
  return {
    v: 1,
    uretim: now.toISOString().slice(0, 10),
    tahmin: seasonal.length
      ? { model: 'ECMWF SEAS5, topluluk ortalaması', baslangic: aylar[0] ?? null, aylar }
      : null,
    kaynaklar: [
      { ad: 'Mevsimsel tahmin: ECMWF SEAS5', lisans: 'CC BY 4.0', adres: 'https://www.ecmwf.int/' },
      { ad: 'Tahmin verisi: Open-Meteo.com', lisans: 'CC BY 4.0', adres: 'https://open-meteo.com/' },
      { ad: 'İklim normalleri: NASA POWER (NASA Langley)', lisans: 'Kamu verisi', adres: 'https://power.larc.nasa.gov/' },
    ],
    iller: iller.map((il, i) => ({
      plaka: il.plaka,
      ad: il.ad,
      lat: il.lat,
      lon: il.lon,
      normal: normals[i],
      aylar: seasonal[i] ? combine(normals[i], seasonal[i]) : [],
    })),
  };
}

async function main() {
  const out = process.argv[2];
  if (!out) {
    console.error('Kullanım: node tools/hava/hava-paketi.mjs <çıktı.json>');
    process.exit(2);
  }
  const { iller } = JSON.parse(fs.readFileSync(path.join(HERE, 'iller.json'), 'utf8'));
  const pack = await build({ iller });
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(pack));
  const ornek = pack.iller.find((x) => x.plaka === 6);
  console.log(`\nYazıldı: ${out} (${fs.statSync(out).size} bayt) · tahmin: ${pack.tahmin ? pack.tahmin.aylar.join(', ') : 'YOK'}`);
  console.log('Örnek (Ankara): ' + JSON.stringify({ normal: ornek.normal, aylar: ornek.aylar }));
  if (!pack.tahmin) process.exitCode = 3;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error('HATA: ' + (e?.message ?? e));
    process.exit(1);
  });
}
