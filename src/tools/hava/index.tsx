// Hava ve iklim: il il iklim normalleri ve önümüzdeki ayların mevsimsel eğilimi (internetsiz).
// Veri: hava-iklim-tr.json paketi (ECMWF SEAS5 + NASA POWER), her ay yenilenir.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { findPack, openBlob } from '../../lib/packs';
import { PackRow, usePackRows } from '../../lib/packs-ui';
import { useAppState } from '../../lib/store';
import { AY_ADI, ayEtiketi, enYakinIl, gelecekAylar, isHavaPaketi, num, sicaklikYorum, tahminYasi, yagisYorum, type HavaPaketi } from '../../lib/hava';

const CSS = `
.hv { display: flex; flex-direction: column; gap: 14px; }
.hv-pick { display: flex; gap: 8px; align-items: stretch; }
.hv-sel { flex: 1; min-height: 48px; background: var(--card); border: 1px solid var(--line-input); border-radius: 14px; color: var(--text); padding: 0 12px; font-size: 16px; }
.hv-loc { min-height: 48px; white-space: nowrap; }
.hv-note { background: var(--glass); border: 1px solid var(--glass-line); border-radius: 16px; padding: 12px 14px; font-size: 13.5px; line-height: 1.5; color: var(--text2); margin: 0; }
.hv-note b { color: var(--text); }
.hv-note.old { border-color: rgba(245,165,36,0.5); background: rgba(245,165,36,0.08); }
.hv-h { margin: 4px 0 0; font-size: 16px; font-weight: 600; }
.hv-months { display: flex; flex-direction: column; gap: 8px; }
.hv-m { background: var(--card); border: 1px solid var(--line2); border-radius: 16px; padding: 12px 14px; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 12px; align-items: center; }
.hv-m-name { font-size: 15px; font-weight: 600; }
.hv-m-t { font-size: 24px; font-weight: 600; font-variant-numeric: tabular-nums; grid-row: span 3; text-align: right; }
.hv-m-t small { display: block; font-size: 11.5px; font-weight: 400; color: var(--muted); }
.hv-tag { font-size: 13px; display: flex; align-items: baseline; gap: 6px; color: var(--text2); }
.hv-dot { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; align-self: flex-start; margin-top: 5px; background: var(--muted); }
.hv-dot.sicak { background: #f5a524; } .hv-dot.soguk { background: #86b4da; }
.hv-dot.kurak { background: #d9a066; } .hv-dot.yagisli { background: #4fd1a5; }
.hv-frost { font-size: 12.5px; color: #c9e3ff; }
.hv-year { background: var(--card); border: 1px solid var(--line2); border-radius: 16px; padding: 6px 12px; }
.hv-row { display: grid; grid-template-columns: 40px minmax(0, 1fr) 62px 52px; gap: 10px; align-items: center; min-height: 34px; font-size: 13.5px; }
.hv-row + .hv-row { border-top: 1px solid var(--line2); }
.hv-row.now { color: var(--accent2); font-weight: 600; }
.hv-bar { position: relative; height: 10px; border-radius: 5px; background: rgba(255,255,255,0.06); }
.hv-bar i { position: absolute; top: 0; bottom: 0; border-radius: 5px; background: linear-gradient(90deg, #86b4da, #f5a524); }
.hv-row .tt { text-align: right; font-variant-numeric: tabular-nums; font-size: 12.5px; color: var(--text2); white-space: nowrap; }
.hv-row .r { text-align: right; font-variant-numeric: tabular-nums; color: var(--text2); }
.hv-legend { font-size: 12px; color: var(--muted); margin: 4px 0 2px; }
.hv-src { font-size: 12px; color: var(--muted); line-height: 1.5; }
.hv-src a { color: var(--muted); }
`;

let cache: HavaPaketi | null = null;
const LS = 'ac.hava.il';

function useHava() {
  const app = useAppState();
  const [data, setData] = useState<HavaPaketi | null>(cache);
  const [state, setState] = useState<'loading' | 'none' | 'ok' | 'bad'>(cache ? 'ok' : 'loading');
  useEffect(() => {
    let alive = true;
    (async () => {
      const p = await findPack('hava');
      if (!p) return alive && setState('none');
      try {
        const j = JSON.parse(await (await openBlob(p)).text());
        if (!isHavaPaketi(j)) throw new Error('biçim');
        cache = j;
        if (alive) {
          setData(j);
          setState('ok');
        }
      } catch {
        if (alive) setState('bad');
      }
    })();
    return () => {
      alive = false;
    };
  }, [app.packsVersion]);
  return { data, state };
}

function Indir() {
  const { rows, dlFor, memGB, rec } = usePackRows();
  const row = rows.find((r) => r.entry?.id === 'hava-tr');
  return (
    <div class="hv" data-testid="hava-yok">
      <p class="hv-note">
        <b>Hava ve iklim paketi yüklü değil.</b> 81 il için ay ay iklim normallerini ve önümüzdeki 6–7 ayın mevsimsel eğilimini (normalden sıcak/soğuk, yağışlı/kurak) internetsiz gösterir. Çok küçüktür; her ay yenilenir.
      </p>
      {row ? <PackRow row={row} dl={dlFor(row)} memGB={memGB} recommended={rec.tier} /> : <p class="hv-note">Katalog yükleniyor…</p>}
    </div>
  );
}

export default function Hava() {
  const { data, state } = useHava();
  const [plaka, setPlaka] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(LS)) || 6;
    } catch {
      return 6;
    }
  });
  const [locBusy, setLocBusy] = useState(false);
  const [locErr, setLocErr] = useState('');
  const il = useMemo(() => data?.iller.find((x) => x.plaka === plaka) ?? data?.iller[0] ?? null, [data, plaka]);
  const choose = (p: number) => {
    setPlaka(p);
    try {
      localStorage.setItem(LS, String(p));
    } catch {}
  };
  const fromLocation = () => {
    if (!data || !navigator.geolocation) return;
    setLocBusy(true);
    setLocErr('');
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLocBusy(false);
        choose(enYakinIl(data.iller, p.coords.latitude, p.coords.longitude).plaka);
      },
      () => {
        setLocBusy(false);
        setLocErr('Konum alınamadı; ili listeden seçin.');
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 30 * 60 * 1000 },
    );
  };

  if (state === 'loading') return <style>{CSS}</style>;
  if (state === 'none')
    return (
      <>
        <style>{CSS}</style>
        <Indir />
      </>
    );
  if (state === 'bad' || !data || !il)
    return (
      <>
        <style>{CSS}</style>
        <p class="hv-note">Hava paketi okunamadı. Paketler ekranından silip yeniden indirin.</p>
      </>
    );

  const now = new Date();
  const yas = tahminYasi(data.uretim, now);
  const aylar = gelecekAylar(il, now);
  const temps = il.normal.t.filter((x): x is number => x != null);
  const lo = Math.min(...il.normal.tmin.map((x, i) => x ?? il.normal.t[i] ?? 0), ...temps);
  const hi = Math.max(...il.normal.tmax.map((x, i) => x ?? il.normal.t[i] ?? 0), ...temps);
  const span = Math.max(1, hi - lo);
  const curM = now.getMonth();

  return (
    <div class="hv" data-testid="hava">
      <style>{CSS}</style>
      <div class="hv-pick">
        <select class="hv-sel" aria-label="İl" data-testid="hava-il" value={String(il.plaka)} onChange={(e) => choose(Number((e.target as HTMLSelectElement).value))}>
          {[...data.iller]
            .sort((a, b) => a.ad.localeCompare(b.ad, 'tr'))
            .map((x) => (
              <option key={x.plaka} value={String(x.plaka)}>
                {x.ad}
              </option>
            ))}
        </select>
        <button class="btn hv-loc" data-testid="hava-konum" onClick={fromLocation} disabled={locBusy}>
          {locBusy ? 'Bulunuyor…' : 'Konumumdan'}
        </button>
      </div>
      {locErr && <p class="cm-err">{locErr}</p>}

      <p class={'hv-note' + (yas > 45 ? ' old' : '')} data-testid="hava-not">
        Bu bir <b>mevsim eğilimidir</b>, gün gün hava durumu değildir: her ayın normaline göre daha sıcak mı soğuk mu, yağışlı mı kurak mı geçeceğini gösterir.{' '}
        {data.tahmin ? (
          <>
            Tahmin <b>{new Date(data.uretim).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</b> tarihli ({data.tahmin.model}){yas > 45 ? ` — ${yas} günlük, eski olabilir; internet varken paketi güncelleyin.` : '.'}
          </>
        ) : (
          <>Bu pakette tahmin yok; yalnız iklim normalleri var.</>
        )}
      </p>

      {aylar.length > 0 && (
        <>
          <h2 class="hv-h">Önümüzdeki aylar · {il.ad}</h2>
          <div class="hv-months" data-testid="hava-aylar">
            {aylar.map((a) => {
              const mi = Number(a.ay.slice(5, 7)) - 1;
              const ty = sicaklikYorum(a.tSapma);
              const yy = yagisYorum(a.yagisOran);
              const tmin = il.normal.tmin[mi];
              return (
                <div class="hv-m" key={a.ay} data-testid="hava-ay">
                  <span class="hv-m-name">{ayEtiketi(a.ay)}</span>
                  <span class="hv-m-t">
                    {a.t != null ? num(a.t) + '°' : '–'}
                    <small>ortalama</small>
                  </span>
                  {ty && (
                    <span class="hv-tag">
                      <span class={'hv-dot ' + ty.yon} aria-hidden="true" />
                      Sıcaklık {ty.metin}
                    </span>
                  )}
                  {yy && (
                    <span class="hv-tag">
                      <span class={'hv-dot ' + yy.yon} aria-hidden="true" />
                      Yağış {yy.metin}
                      {a.yagis != null ? ` · ~${a.yagis} mm` : ''}
                    </span>
                  )}
                  {tmin != null && tmin < 0 && <span class="hv-frost">Geceleri don olağan (ortalama en düşük {num(tmin)}°)</span>}
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 class="hv-h">Yıl boyu normaller · {il.ad}</h2>
      <div class="hv-year" data-testid="hava-normaller">
        <p class="hv-legend">Ortalama en düşük – en yüksek sıcaklık ve aylık yağış</p>
        {AY_ADI.map((ad, i) => {
          const mn = il.normal.tmin[i] ?? il.normal.t[i];
          const mx = il.normal.tmax[i] ?? il.normal.t[i];
          const left = mn == null ? 0 : ((mn - lo) / span) * 100;
          const width = mn == null || mx == null ? 0 : Math.max(2, ((mx - mn) / span) * 100);
          return (
            <div class={'hv-row' + (i === curM ? ' now' : '')} key={ad}>
              <span>{ad.slice(0, 3)}</span>
              <span class="hv-bar" title={mn != null && mx != null ? `${num(mn)}° – ${num(mx)}°` : ''} aria-label={mn != null && mx != null ? `${ad}: en düşük ${num(mn)}, en yüksek ${num(mx)} derece` : ad}>
                <i style={{ left: left + '%', width: width + '%' }} />
              </span>
              <span class="tt">{mn != null && mx != null ? `${Math.round(mn)}…${Math.round(mx)}°` : '–'}</span>
              <span class="r">{il.normal.yagis[i] != null ? il.normal.yagis[i] + ' mm' : '–'}</span>
            </div>
          );
        })}
      </div>

      <p class="hv-src">
        Kaynaklar:{' '}
        {data.kaynaklar.map((k, i) => (
          <span key={k.ad}>
            {i > 0 ? ' · ' : ''}
            {/* Paket verisinden gelen bağlantı: yalnız https (javascript: vb. çalışmasın) */}
            {typeof k.adres === 'string' && /^https:\/\//i.test(k.adres) ? (
              <a href={k.adres} target="_blank" rel="noopener noreferrer">
                {k.ad}
              </a>
            ) : (
              <span>{k.ad}</span>
            )}{' '}
            ({k.lisans})
          </span>
        ))}
        . Normaller il merkezinin yaklaşık 50 km'lik ızgara ortalamasıdır; dağlık yerlerde gerçek değerler farklı olabilir.
      </p>
    </div>
  );
}
