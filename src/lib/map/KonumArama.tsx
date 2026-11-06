// "Konum aranıyor" kartı: telefonun ne yaptığını görünür kılar.
// Android uygulamasında gökyüzü haritası (uyduların yeri), sinyal çubukları ve
// aşama listesi; tarayıcıda uydu bilgisi olmadığı için süreye dayalı anlatım.
import { useEffect, useState } from "preact/hooks";
import { nativeKonum, type KonumDurum, type Uydu } from "../native";
import {
  GEREKEN_UYDU,
  sinyalSinifi,
  sureYaz,
  webOzet,
  yerelOzet,
  type AdimDurum,
} from "./konum-arama";

const ADIM_IKON: Record<AdimDurum, string> = {
  tamam: "✓",
  suruyor: "",
  bekliyor: "",
  hata: "!",
};

function GokHaritasi({ uydular }: { uydular: Uydu[] }) {
  const R = 44;
  return (
    <svg
      class="ka-gok"
      viewBox="-50 -50 100 100"
      role="img"
      aria-label={`Gökyüzü haritası: ${uydular.filter((u) => u.sinyal > 0).length} uydu`}
    >
      <circle r={R} class="ka-halka" />
      <circle r={R / 2} class="ka-halka ince" />
      <line x1={-R} y1="0" x2={R} y2="0" class="ka-halka ince" />
      <line x1="0" y1={-R} x2="0" y2={R} class="ka-halka ince" />
      <circle r={R} class="ka-tarama" />
      <text x="0" y={-R + 8} text-anchor="middle" class="ka-k">
        K
      </text>
      {uydular
        .filter((u) => u.sinyal > 0)
        .map((u) => {
          const r = ((90 - Math.max(0, Math.min(90, u.yukseklik))) / 90) * R;
          const a = (u.az * Math.PI) / 180;
          const x = Math.sin(a) * r;
          const y = -Math.cos(a) * r;
          return (
            <circle
              key={u.tur + u.id}
              cx={x.toFixed(1)}
              cy={y.toFixed(1)}
              r={u.kullanilan ? 3.6 : 3}
              class={`ka-uydu ${sinyalSinifi(u.sinyal)}${u.kullanilan ? " kullanilan" : ""}`}
            />
          );
        })}
    </svg>
  );
}

function SinyalCubuklari({ uydular }: { uydular: Uydu[] }) {
  const liste = uydular
    .filter((u) => u.sinyal > 0)
    .sort((a, b) => b.sinyal - a.sinyal)
    .slice(0, 14);
  return (
    <div class="ka-cubuklar" aria-hidden="true">
      {liste.length === 0
        ? Array.from({ length: 10 }, (_, i) => (
            <span key={i} class="ka-cubuk bos" style={{ height: "6%" }} />
          ))
        : liste.map((u) => (
            <span
              key={u.tur + u.id}
              class={`ka-cubuk ${sinyalSinifi(u.sinyal)}${u.kullanilan ? " kullanilan" : ""}`}
              style={{
                height: `${Math.max(6, Math.min(100, (u.sinyal / 45) * 100))}%`,
              }}
              title={`${u.tur} ${u.id}: ${u.sinyal} dB-Hz`}
            />
          ))}
      <span class="ka-esik" style={{ bottom: `${(20 / 45) * 100}%` }} />
    </div>
  );
}

/**
 * kompakt: harita altındaki kısa sürüm (gökyüzü + o anki aşama + ipucu);
 * tam sürüm (tüm aşamalar ve açıklama) "Konumumu söyle" panelinde.
 */
export function KonumArama({
  durum,
  baslangic,
  testid = "loc-search",
  kompakt = false,
}: {
  durum: KonumDurum | null;
  baslangic: number;
  testid?: string;
  kompakt?: boolean;
}) {
  const [, tik] = useState(0);
  useEffect(() => {
    const t = setInterval(() => tik((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const gecen = durum ? durum.gecenMs : Date.now() - baslangic;
  const oz = durum ? yerelOzet(durum) : webOzet(gecen);
  const hata = oz.adimlar.some((a) => a.durum === "hata");
  const tamamlanan = oz.adimlar.filter((a) => a.durum === "tamam").length;
  const simdiki =
    oz.adimlar.find((a) => a.durum !== "tamam") ??
    oz.adimlar[oz.adimlar.length - 1];

  return (
    // Canlı bölge yalnızca başlık ve ipucu: saniyede bir değişen süre ve uydu sayısı
    // ekran okuyucuda her saniye yeniden okunmasın
    <div
      class={"ka card" + (hata ? " hata" : "") + (kompakt ? " kompakt" : "")}
      data-testid={testid}
    >
      <div class="ka-ust">
        <span class={"ka-nabiz" + (hata ? " dur" : "")} aria-hidden="true" />
        <strong class="grow" role="status">
          {hata ? "Konum aranamıyor" : "Konum aranıyor"}
        </strong>
        <span class="mono ka-sure" data-testid="loc-search-time">
          {sureYaz(gecen)}
        </span>
      </div>

      {durum && (
        <div class="ka-gorsel">
          <GokHaritasi uydular={durum.uydular} />
          <div class="ka-sag">
            <SinyalCubuklari uydular={durum.uydular} />
            <div class="ka-sayilar" data-testid="loc-search-counts">
              <span>
                <b>{oz.gorulen}</b> duyulan
              </span>
              <span>
                <b>{oz.guclu}</b> güçlü
              </span>
              <span>
                <b>{oz.kullanilan}</b>/{GEREKEN_UYDU} kullanılan
              </span>
            </div>
          </div>
        </div>
      )}

      {kompakt && (
        <div
          class={"ka-adim simdiki " + simdiki.durum}
          data-testid="loc-search-step"
        >
          <span class="ka-ikon" aria-hidden="true">
            {ADIM_IKON[simdiki.durum]}
          </span>
          <span class="grow">{simdiki.ad}</span>
          <span class="ka-not">
            {tamamlanan}/{oz.adimlar.length}
          </span>
        </div>
      )}
      {!kompakt && (
        <ol class="ka-adimlar">
          {oz.adimlar.map((a) => (
            <li key={a.ad} class={"ka-adim " + a.durum}>
              <span class="ka-ikon" aria-hidden="true">
                {ADIM_IKON[a.durum]}
              </span>
              <span class="grow">{a.ad}</span>
              {a.not && <span class="ka-not">{a.not}</span>}
            </li>
          ))}
        </ol>
      )}

      <p class="ka-ipucu" data-testid="loc-search-hint" aria-live="polite">
        {oz.ipucu}
      </p>
      {oz.eylem && (
        <button
          type="button"
          class="btn primary"
          data-testid="loc-search-action"
          onClick={() =>
            oz.eylem!.tur === "konumAyarlari"
              ? nativeKonum.openLocationSettings()
              : nativeKonum.openAppSettings()
          }
        >
          {oz.eylem.etiket}
        </button>
      )}
      {kompakt ? null : durum ? (
        <p class="ka-aciklama">
          Noktalar gökyüzündeki uydular: merkez tam tepeniz, kenar ufuk. Dolu
          nokta konumda kullanılan uydu; çizgi güçlü sinyal sınırı.
        </p>
      ) : (
        <p class="ka-aciklama">
          Tarayıcı uydu ayrıntısını göstermez; Android uygulamasında uydular ve
          sinyal güçleri canlı görünür.
        </p>
      )}
    </div>
  );
}
