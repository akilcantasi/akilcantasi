// Haritada yer adı arama alanı: il, ilçe, mahalle, köy ve afet noktaları (toplanma alanı,
// hastane, eczane…) internetsiz aranır. Yer adları harita paketinden cihazda bir kez
// çıkarılır (yer-dizini.ts); hazırlanırken noktalar ve iller yine aranabilir.
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import type { RandomAccessSource } from '../source';
import { formatDistance, type LatLon } from './geo';
import { POI_TYPES, type Poi, type PoiType } from './poi';
import { ara, aramaDizini, yerleriTamamla, type Sonuc } from './yer-arama';
import { dizinAnahtari, dizinDinle, dizinDurumu, dizinHazirla, type DizinDurum, type HazirDizin } from './yer-dizini';

type Sinir = [number, number, number, number] | null;

/** Harita paketinin yer adı dizini; `basla` false iken kendiliğinden kurulmaz */
export function useYerDizini(src: RandomAccessSource | null, basla: boolean): DizinDurum {
  const anahtar = src ? dizinAnahtari(src) : '';
  const [d, setD] = useState<DizinDurum>(() => (src ? dizinDurumu(anahtar) : { durum: 'yok' }));
  useEffect(() => {
    if (!src) {
      setD({ durum: 'yok' });
      return;
    }
    setD(dizinDurumu(anahtar));
    const off = dizinDinle(() => setD(dizinDurumu(anahtar)));
    if (basla) setD(dizinHazirla(src));
    return off;
  }, [anahtar, basla]);
  return d;
}

function SonucRozet({ s }: { s: Sonuc }) {
  if (s.poiId) {
    const t = POI_TYPES[s.tur as PoiType];
    return (
      <span class="poi-badge yer-rozet" style={{ background: t.color, width: 26, height: 26, fontSize: 13 }} aria-hidden="true">
        {t.letter}
      </span>
    );
  }
  return (
    <span class={'yer-rozet yer-rozet-yer t-' + s.tur} aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0C18.5 15.4 12 21 12 21Z" />
        <circle cx="12" cy="10" r="2.3" />
      </svg>
    </span>
  );
}

export function YerArama({
  src,
  noktalar,
  sinir,
  merkez,
  otomatik,
  onSec,
}: {
  src: RandomAccessSource | null;
  noktalar: Poi[];
  /** Haritanın (ya da noktaların) kapsadığı alan: dışındaki iller listelenmez */
  sinir: Sinir;
  merkez: () => LatLon | null;
  /** Yer adları sekme açılınca kendiliğinden hazırlansın mı (düşük güçte yalnız aramaya dokununca) */
  otomatik: boolean;
  onSec: (s: Sonuc) => void;
}) {
  const [q, setQ] = useState('');
  const [acik, setAcik] = useState(false);
  const [dokundu, setDokundu] = useState(false);
  // Otomatik kurma haritanın ilk çizimini geciktirmesin: biraz sonra başlar
  const [gecikti, setGecikti] = useState(false);
  useEffect(() => {
    if (!otomatik) return;
    const t = setTimeout(() => setGecikti(true), 2500);
    return () => clearTimeout(t);
  }, [otomatik]);
  const durum = useYerDizini(src, dokundu || (otomatik && gecikti));
  const [aranan, setAranan] = useState('');
  const kutu = useRef<HTMLDivElement>(null);
  const giris = useRef<HTMLInputElement>(null);
  const [maxH, setMaxH] = useState<number | null>(null);

  // Yazarken her tuşta değil, kısa aralıkla ara (80 bin yer adı ~10 ms)
  useEffect(() => {
    const t = setTimeout(() => setAranan(q), 90);
    return () => clearTimeout(t);
  }, [q]);

  // Dizin hazır değilken (hazırlanıyor, hata, harita paketi yok) iller ve noktalar aranır
  const hazir: HazirDizin | null = durum.durum === 'hazir' ? durum.dizin : null;
  const iller = useMemo(() => yerleriTamamla([], sinir), [sinir?.join(',')]);
  const dizin = useMemo(() => (hazir ? aramaDizini(hazir.yerler, noktalar, hazir.adlar) : aramaDizini(iller, noktalar)), [hazir, iller, noktalar]);
  const sonuclar = useMemo(() => (aranan.trim() ? ara(dizin, aranan, merkez()) : []), [dizin, aranan]);
  const yerAdiVar = !!hazir && hazir.yerler.some((y) => y.tur !== 'il');

  // Ekran klavyesi sonuçları örtmesin: liste görünür alanın (visualViewport) altında biter
  useEffect(() => {
    if (!acik) return;
    const vv = window.visualViewport;
    const olc = () => {
      const r = kutu.current?.getBoundingClientRect();
      if (!r) return;
      const alt = vv ? vv.height + vv.offsetTop : window.innerHeight;
      // Yazı boyutu ayarı alanı CSS zoom ile büyütür: ölçü ekran pikseli, stil zoom'suz piksel
      const z = parseFloat(getComputedStyle(kutu.current!).zoom || '1') || 1;
      setMaxH(Math.max(132, Math.floor((alt - r.bottom - 10) / z)));
    };
    olc();
    vv?.addEventListener('resize', olc);
    vv?.addEventListener('scroll', olc);
    window.addEventListener('resize', olc);
    return () => {
      vv?.removeEventListener('resize', olc);
      vv?.removeEventListener('scroll', olc);
      window.removeEventListener('resize', olc);
    };
  }, [acik]);

  // Dışarı dokununca liste kapanır
  useEffect(() => {
    if (!acik) return;
    const f = (e: PointerEvent) => {
      if (kutu.current && !kutu.current.contains(e.target as Node)) setAcik(false);
    };
    document.addEventListener('pointerdown', f, true);
    return () => document.removeEventListener('pointerdown', f, true);
  }, [acik]);

  function sec(s: Sonuc) {
    setAcik(false);
    setQ(s.ad);
    setAranan(s.ad);
    giris.current?.blur(); // klavye kapansın, harita görünsün
    onSec(s);
  }

  const hazirlaniyor = durum.durum === 'hazirlaniyor';
  const yuzde = hazirlaniyor ? Math.round(durum.oran * 100) : 0;
  const listeId = 'yer-sonuclar';

  return (
    <div class={'yer-ara' + (acik ? ' acik' : '')} ref={kutu}>
      <div class="yer-ara-alan">
        <svg class="yer-ara-ikon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="6.5" />
          <path d="m20 20-4.2-4.2" />
        </svg>
        <input
          ref={giris}
          class="input yer-ara-input"
          type="search"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          autoCorrect="off"
          spellcheck={false}
          placeholder="İlçe, mahalle, köy ara…"
          aria-label="Haritada yer ara"
          aria-controls={listeId}
          aria-expanded={acik ? 'true' : 'false'}
          data-testid="yer-ara"
          value={q}
          onFocus={() => {
            setDokundu(true);
            setAcik(true);
          }}
          onInput={(e) => {
            setQ((e.target as HTMLInputElement).value);
            setAcik(true);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setAcik(false);
              (e.target as HTMLInputElement).blur();
            } else if (e.key === 'Enter') {
              e.preventDefault();
              const ilk = q.trim() ? ara(dizin, q, merkez())[0] : undefined;
              if (ilk) sec(ilk);
            }
          }}
        />
        {q && (
          <button
            type="button"
            class="yer-ara-sil"
            data-testid="yer-ara-sil"
            aria-label="Aramayı temizle"
            onClick={() => {
              setQ('');
              setAranan('');
              giris.current?.focus();
            }}
          >
            ×
          </button>
        )}
      </div>

      {acik && (
        <div class="yer-ara-liste card" id={listeId} data-testid="yer-sonuclar" style={maxH ? { maxHeight: maxH + 'px' } : undefined}>
          {hazirlaniyor && (
            <div class="yer-hazirlik" data-testid="yer-hazirlik" role="status">
              <span>Yer adları hazırlanıyor… %{yuzde}</span>
              <span class="yer-cubuk" aria-hidden="true">
                <span style={{ width: yuzde + '%' }} />
              </span>
            </div>
          )}
          {durum.durum === 'hata' && (
            <p class="yer-not" data-testid="yer-hata">
              Haritadaki yer adları okunamadı; yalnız iller ve noktalar aranıyor.
            </p>
          )}
          {!aranan.trim() ? (
            <p class="yer-not" data-testid="yer-bos">
              {durum.durum === 'hazir' && !yerAdiVar && src
                ? 'Bu harita paketinde mahalle ve köy adları yok; iller ve afet noktaları aranır.'
                : 'İl, ilçe, mahalle ya da köy adı yazın. "Toplanma", "hastane", "eczane" yazınca en yakın noktalar gelir.'}
            </p>
          ) : sonuclar.length === 0 ? (
            q.trim() === aranan.trim() && (
              <p class="yer-not" data-testid="yer-sonuc-yok" role="status">
                “{aranan.trim()}” bulunamadı.{hazirlaniyor ? ' Yer adları hazırlanınca yeniden bakılır.' : ' Yazımı denetleyin ya da adın başını yazın.'}
              </p>
            )
          ) : (
            <>
              <span class="sr-only" role="status">
                {sonuclar.length} sonuç
              </span>
              <ul class="yer-sonuc-liste">
                {sonuclar.map((s) => (
                  <li key={s.id}>
                    <button type="button" class="yer-sonuc" data-testid="yer-sonuc" data-tur={s.tur} onClick={() => sec(s)}>
                      <SonucRozet s={s} />
                      <span class="yer-sonuc-metin">
                        <span class="yer-sonuc-ad">{s.ad}</span>
                        <span class="yer-sonuc-alt">
                          <span class="yer-tur" data-testid="yer-tur">
                            {s.etiket}
                          </span>
                          {s.ust && <span> · {s.ust} yakını</span>}
                        </span>
                      </span>
                      {isFinite(s.uzaklik) && <span class="yer-sonuc-uz mono">{formatDistance(s.uzaklik)}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
