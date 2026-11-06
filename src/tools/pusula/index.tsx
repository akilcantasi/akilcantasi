// Pusula aracı: telefonun yön sensöründen büyük pusula gülü, derece ve
// Türkçe yön adı, kalibrasyon ipucu ve "Hedefe yön" (yer işareti ya da
// elle girilen koordinat → telefonun baktığı yöne göre ok + mesafe).
//
// Kaynak notları:
//  - Yön verisi: W3C DeviceOrientation Event (deviceorientationabsolute),
//    iOS Safari webkitCompassHeading + DeviceOrientationEvent.requestPermission().
//  - Kalibrasyon: telefonla havada "8" çizmek (Google Haritalar yardım/blog, 2016:
//    "calibrate your compass by moving your phone in a figure 8").
//  - Telefon pusulası MANYETİK kuzeyi gösterir; harita yönleri GERÇEK kuzeye
//    göredir. Türkiye'de fark birkaç derecedir (NOAA: manyetik sapma yere ve
//    zamana göre değişir), kısa mesafede önemsizdir.
import { useEffect, useMemo, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { bearingDeg, distanceM, formatDecimal, formatDistance, formatDuration, walkMinutes } from '../../lib/map/geo';
import { angleDiff, cardinal8, cardinal8Long, needsCalibration, relativeBearing, turnHint } from '../../lib/map/compass';
import { requestCompassPermission, useCompass } from '../../lib/map/useCompass';
import { GEO_MSG, useGeoWatch } from '../../lib/map/useGeo';
import { parseCoordinates, waypointStore, WAYPOINT_TYPES } from '../../lib/map/waypoints';
import { setNavTarget, useNavTarget, type NavTarget } from '../../lib/map/nav';
import { useTrack } from '../../lib/map/recorder';
import { WpBadge, useWaypoints } from '../../lib/map/ui';

const CSS = `
.pz { display: flex; flex-direction: column; gap: 14px; }
/* Aralığı flex gap belirler; paragrafların varsayılan kenar boşlukları düzensiz boşluk yaratıyordu */
.pz p { margin: 0; }
.pz-rose-wrap { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.pz-rose { width: min(84vw, 320px); height: auto; display: block; touch-action: manipulation; }
.pz-head { font-size: 44px; font-weight: 700; line-height: 1; font-family: var(--mono); letter-spacing: -0.02em; }
.pz-head small { font-size: 24px; color: var(--accent); margin-left: 8px; }
.pz-sub { font-size: 15px; color: var(--text2); }
.pz-msg { display: flex; flex-direction: column; gap: 10px; }
.pz-tilt { color: var(--accent); font-size: 13px; font-weight: 600; }
.pz-hint { font-size: 13px; line-height: 1.5; color: var(--text2); }
.pz-hint.hot { border-color: var(--accent); }
.pz-hint b { color: var(--text); }
.pz-target { display: flex; flex-direction: column; gap: 10px; }
.pz-tgt-list { display: flex; flex-direction: column; gap: 6px; }
.pz-tgt-list .list-btn { flex-direction: row; align-items: center; gap: 10px; }
.pz-tgt-list .list-btn[aria-pressed='true'] { border-color: var(--accent); }
.pz-out { display: flex; flex-direction: column; align-items: center; gap: 4px; text-align: center; }
.pz-big { font-size: 30px; font-weight: 700; font-family: var(--mono); }
.pz-turn { font-size: 17px; font-weight: 600; color: var(--accent); }
.pz-arrow { width: 150px; height: 150px; }
`;

const TICKS = Array.from({ length: 72 }, (_, i) => i * 5);
const LABELS: [number, string][] = [
  [0, 'K'],
  [45, 'KD'],
  [90, 'D'],
  [135, 'GD'],
  [180, 'G'],
  [225, 'GB'],
  [270, 'B'],
  [315, 'KB'],
];

/** Pusula gülü: kadran telefon dönünce ters yöne döner; üstteki çizgi telefonun baktığı yön. */
function Rose({ heading, target }: { heading: number | null; target: number | null }) {
  const rot = heading == null ? 0 : -heading;
  return (
    <svg class="pz-rose" viewBox="0 0 200 200" role="img" aria-label={heading == null ? 'Pusula' : `Yön ${Math.round(heading)} derece`} data-testid="compass-rose">
      <circle cx="100" cy="100" r="96" fill="#10141a" stroke="#2e3643" stroke-width="2" />
      <g transform={`rotate(${rot} 100 100)`} data-testid="compass-dial" data-rot={rot.toFixed(1)}>
        {TICKS.map((d) => {
          const major = d % 30 === 0;
          const len = d % 90 === 0 ? 12 : major ? 9 : 5;
          return (
            <line
              key={d}
              x1="100"
              y1={8}
              x2="100"
              y2={8 + len}
              stroke={d === 0 ? '#ff6b6b' : major ? '#c9d1db' : '#4a5363'}
              stroke-width={major ? 2 : 1}
              transform={`rotate(${d} 100 100)`}
            />
          );
        })}
        {LABELS.map(([d, t]) => {
          const big = d % 90 === 0;
          const r = big ? 70 : 72;
          const a = (d * Math.PI) / 180;
          const x = 100 + r * Math.sin(a);
          const y = 100 - r * Math.cos(a);
          return (
            <text
              key={t}
              x={x}
              y={y}
              text-anchor="middle"
              dominant-baseline="central"
              fill={d === 0 ? '#ff6b6b' : big ? '#e8ecf1' : '#9aa4b2'}
              font-size={big ? 20 : 11}
              font-weight={big ? 700 : 500}
              font-family="IBM Plex Mono, monospace"
              transform={`rotate(${-rot} ${x} ${y})`}
            >
              {t}
            </text>
          );
        })}
        {target != null && (
          <g transform={`rotate(${target} 100 100)`} data-testid="compass-target-mark">
            <path d="M100 22 L108 36 L92 36 Z" fill="#f5a524" stroke="#0b0e13" stroke-width="1.5" />
          </g>
        )}
        {/* kuzey iğnesi */}
        <path d="M100 40 L109 100 L100 94 L91 100 Z" fill="#ff6b6b" />
        <path d="M100 160 L109 100 L100 106 L91 100 Z" fill="#4a5363" />
      </g>
      <circle cx="100" cy="100" r="5" fill="#e8ecf1" />
      {/* telefonun baktığı yön */}
      <path d="M100 0 L106 10 L94 10 Z" fill="#f5a524" />
    </svg>
  );
}

function Arrow({ rot, label }: { rot: number; label: string }) {
  return (
    <svg class="pz-arrow" viewBox="0 0 100 100" role="img" aria-label={label} data-testid="target-arrow" data-rot={rot.toFixed(1)}>
      <circle cx="50" cy="50" r="46" fill="none" stroke="#2e3643" stroke-width="2" />
      <g transform={`rotate(${rot} 50 50)`}>
        <path d="M50 10 L68 62 L50 52 L32 62 Z" fill="#f5a524" />
      </g>
    </svg>
  );
}

export default function Pusula() {
  const c = useCompass(true);
  const nav = useNavTarget();
  const wps = useWaypoints();
  const track = useTrack();
  const [coordText, setCoordText] = useState('');
  const [coordErr, setCoordErr] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const geo = useGeoWatch(!!nav);

  const heading = c.status === 'ok' ? c.heading : null;
  const start = track.points[0] ?? null;

  // "Başlangıca dön" hedefi iz değişince güncel kalsın
  const target: NavTarget | null = useMemo(() => {
    if (nav?.kind === 'start') return start ? { ...nav, lat: start.lat, lon: start.lon } : null;
    if (nav?.kind === 'wp' && nav.id && !wps.some((w) => w.id === nav.id)) return null; // silinmiş
    return nav;
  }, [nav, start, wps]);

  const fix = geo.fix;
  const rel = target && fix ? { d: distanceM(fix, target), b: bearingDeg(fix, target) } : null;

  function chooseCoords() {
    const p = parseCoordinates(coordText);
    if (!p) {
      setCoordErr('Koordinat anlaşılamadı. Örnek: 39.9208, 32.8541 ya da 39° 55′ 15″ K 32° 51′ 15″ D');
      return;
    }
    setCoordErr(null);
    setNavTarget({ kind: 'coord', name: formatDecimal(p.lat, p.lon, 5), lat: p.lat, lon: p.lon });
  }

  useEffect(() => {
    if (!savedMsg) return;
    const t = setTimeout(() => setSavedMsg(null), 4000);
    return () => clearTimeout(t);
  }, [savedMsg]);

  return (
    <div class="pz" data-testid="pusula">
      <style>{CSS}</style>

      {c.status === 'ok' ? (
        <div class="pz-rose-wrap">
          <Rose heading={heading} target={rel ? rel.b : null} />
          <div class="pz-head" data-testid="compass-heading">
            {Math.round(heading!) % 360}°<small data-testid="compass-cardinal">{cardinal8(heading!)}</small>
          </div>
          <div class="pz-sub">{cardinal8Long(heading!)} yönüne bakıyorsunuz</div>
          {c.tilted && (
            <div class="pz-tilt" role="status" data-testid="compass-tilt">
              Telefonu yere paralel, düz tutun.
            </div>
          )}
        </div>
      ) : (
        <div class="card pz-msg" data-testid="compass-status" data-status={c.status}>
          {c.status === 'needs-permission' && (
            <>
              <p class="empty">Pusulayı kullanmak için hareket ve yön sensörü izni gerekiyor.</p>
              <button type="button" class="btn primary" data-testid="compass-permission" onClick={() => requestCompassPermission()}>
                Pusulayı başlat
              </button>
            </>
          )}
          {(c.status === 'pending' || c.status === 'idle') && <p class="empty">Yön sensörü bekleniyor…</p>}
          {c.status === 'denied' && (
            <>
              <p class="empty">Yön sensörü izni verilmedi. iPhone'da: Ayarlar → Safari → Hareket ve Yön Erişimi'ni açıp sayfayı yenileyin.</p>
              <button type="button" class="btn" data-testid="compass-permission" onClick={() => requestCompassPermission()}>
                Tekrar dene
              </button>
            </>
          )}
          {(c.status === 'no-sensor' || c.status === 'unsupported') && (
            <>
              <strong>Bu cihazda pusula sensörü bulunamadı</strong>
              <p class="empty">
                Masaüstü bilgisayarlarda ve bazı ucuz telefonlarda manyetik sensör yoktur. Hedef yönü yine de aşağıda kuzeye göre
                gösterilir.
              </p>
              <p class="pz-hint">
                <b>Sensörsüz kuzey:</b> Gece Kutup Yıldızı kuzeyi gösterir. Türkiye'de öğle saatinde güneş güney yönündedir; gölgeniz
                kuzeye düşer.
              </p>
            </>
          )}
        </div>
      )}

      {c.status === 'ok' && (
        <p class={'card pz-hint' + (needsCalibration(c.accuracy) ? ' hot' : '')} data-testid="compass-calibration">
          {needsCalibration(c.accuracy) ? <b>Pusula doğruluğu düşük (± {Math.round(c.accuracy!)}°). </b> : <b>Kalibrasyon: </b>}
          Yön tutarsızsa telefonu havada birkaç kez büyük bir "8" çizerek döndürün. Metal, mıknatıs, hoparlör ve araç içinden uzak
          durun. Pusula manyetik kuzeyi gösterir; Türkiye'de gerçek kuzeyle farkı birkaç derecedir.
        </p>
      )}

      <section class="card pz-target" data-testid="target-section" aria-label="Hedefe yön">
        <div class="row">
          <strong class="grow">Hedefe yön</strong>
          {target && (
            <button type="button" class="link-btn" data-testid="target-clear" onClick={() => setNavTarget(null)}>
              Hedefi kaldır
            </button>
          )}
        </div>

        {target ? (
          <div class="pz-out" data-testid="target-out">
            <div class="row">
              {target.kind === 'wp' && wps.find((w) => w.id === target.id) && <WpBadge type={wps.find((w) => w.id === target.id)!.type} size={20} />}
              <span class="label" data-testid="target-name">
                {target.kind === 'start' ? 'İz başlangıcı' : target.name}
              </span>
            </div>
            {!fix ? (
              <>
                <p class="empty" data-testid="target-geo-msg">
                  {GEO_MSG[geo.status] || 'Konumunuz bekleniyor…'}
                </p>
                {(geo.status === 'denied' || geo.status === 'timeout' || geo.status === 'unavailable') && (
                  <button type="button" class="btn" data-testid="target-geo-retry" onClick={geo.retry}>
                    Tekrar dene
                  </button>
                )}
              </>
            ) : (
              (() => {
                const r = rel!;
                const relB = heading == null ? r.b : relativeBearing(r.b, heading);
                return (
                  <>
                    <Arrow rot={relB} label={heading == null ? `Hedef ${cardinal8Long(r.b)} yönünde` : turnHint(relB)} />
                    {heading != null && (
                      <div class="pz-turn" data-testid="target-turn">
                        {turnHint(relB)}
                        {Math.abs(angleDiff(0, relB)) > 15 ? ` (${Math.round(Math.abs(angleDiff(0, relB)))}°)` : ''}
                      </div>
                    )}
                    <div class="pz-big" data-testid="target-distance">
                      {formatDistance(r.d)}
                    </div>
                    <div class="mono" data-testid="target-bearing">
                      {cardinal8(r.b)} · {Math.round(r.b) % 360}°
                    </div>
                    <div class="muted">
                      Kuş uçuşu · yürüyerek ~{formatDuration(walkMinutes(r.d))} · GPS ± {formatDistance(fix.accuracy)}
                    </div>
                    {heading == null && <p class="warn">Pusula yok: ok, telefonun üst kenarı kuzeyi gösterirken doğrudur.</p>}
                  </>
                );
              })()
            )}
            <div class="row" style={{ width: '100%' }}>
              {target.kind === 'coord' && (
                <button
                  type="button"
                  class="btn grow"
                  data-testid="target-save"
                  onClick={() => {
                    const w = waypointStore().add({ name: 'Hedef', type: 'diger', lat: target.lat, lon: target.lon });
                    setNavTarget({ kind: 'wp', id: w.id, name: w.name, lat: w.lat, lon: w.lon });
                    setSavedMsg('Yer işareti olarak kaydedildi');
                  }}
                >
                  Yer işareti yap
                </button>
              )}
              <button type="button" class="btn grow" data-testid="target-onmap" onClick={() => go.tab('harita')}>
                Haritada göster
              </button>
            </div>
            {savedMsg && <p class="warn" role="status">{savedMsg}</p>}
          </div>
        ) : (
          <p class="empty">Kayıtlı bir yer işareti seçin ya da koordinat yazın.</p>
        )}

        <div class="label">Yer işaretleri</div>
        {wps.length || start ? (
          <div class="pz-tgt-list">
            {start && (
              <button
                type="button"
                class="list-btn"
                data-testid="target-pick-start"
                aria-pressed={target?.kind === 'start' ? 'true' : 'false'}
                onClick={() => setNavTarget({ kind: 'start', name: 'İz başlangıcı', lat: start.lat, lon: start.lon, mode: 'straight' })}
              >
                <span aria-hidden="true">⌂</span>
                <span class="grow">Başlangıca dön (iz başlangıcı)</span>
              </button>
            )}
            {wps.map((w) => (
              <button
                key={w.id}
                type="button"
                class="list-btn"
                data-testid="target-pick-wp"
                data-id={w.id}
                aria-pressed={target?.kind === 'wp' && target.id === w.id ? 'true' : 'false'}
                onClick={() => setNavTarget({ kind: 'wp', id: w.id, name: w.name, lat: w.lat, lon: w.lon })}
              >
                <WpBadge type={w.type} size={20} />
                <span class="grow">
                  {w.name}
                  <span class="muted"> · {WAYPOINT_TYPES[w.type].label}</span>
                </span>
                {fix && <span class="mono muted">{formatDistance(distanceM(fix, w))}</span>}
              </button>
            ))}
          </div>
        ) : (
          <p class="empty" data-testid="target-no-wp">
            Henüz yer işareti yok. Harita sekmesinden "Yer işaretleri" ile ekleyebilirsiniz.
          </p>
        )}

        <label class="label" for="pz-coord">
          Koordinat gir
        </label>
        <div class="row">
          <input
            id="pz-coord"
            class="input grow"
            data-testid="target-coord-input"
            inputMode="text"
            autoComplete="off"
            placeholder="39.9208, 32.8541"
            value={coordText}
            onInput={(e) => setCoordText((e.target as HTMLInputElement).value)}
            onKeyDown={(e) => e.key === 'Enter' && chooseCoords()}
          />
          <button type="button" class="btn primary" data-testid="target-coord-set" onClick={chooseCoords} disabled={!coordText.trim()}>
            Git
          </button>
        </div>
        {coordErr && (
          <p class="field-err" role="alert" data-testid="target-coord-err">
            {coordErr}
          </p>
        )}
        <p class="warn">Ondalık (39.9208, 32.8541) ya da derece-dakika-saniye (39° 55′ 15″ K 32° 51′ 15″ D) yazabilirsiniz.</p>
      </section>
    </div>
  );
}

