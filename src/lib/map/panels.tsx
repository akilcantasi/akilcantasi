// Harita sekmesinin konum/yön panelleri: iz kaydı kartı, hedef (gidiş) kartı,
// yer işaretleri listesi ve ekleme formu.
import { useEffect, useRef, useState } from 'preact/hooks';
import { bearingDeg, distanceM, formatDecimal, formatDistance, formatDuration, walkMinutes, type LatLon } from './geo';
import { angleDiff, cardinal8, cardinal8Long, relativeBearing, turnHint } from './compass';
import { backtrack, formatClock, pathLength, trackDurationMs, type TrackState } from './track';
import { recorder } from './recorder';
import { setNavTarget, type NavTarget } from './nav';
import { WAYPOINT_TYPES, WAYPOINT_TYPE_ORDER, waypointStore, type Waypoint, type WaypointType } from './waypoints';
import { ShareBox, WpBadge } from './ui';

export function Sheet({ title, testid, onClose, children }: { title: string; testid: string; onClose: () => void; children: any }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, []);
  return (
    <div class="sheet-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div class="sheet" role="dialog" aria-modal="true" aria-label={title} data-testid={testid} tabIndex={-1} ref={ref}>
        <div class="row">
          <strong class="grow sheet-title">{title}</strong>
          <button type="button" class="btn" data-testid={testid + '-close'} onClick={onClose}>
            Kapat
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Kayıt sürerken her saniye yeniden çiz. */
export function useTicker(on: boolean, ms = 1000) {
  const [, setN] = useState(0);
  useEffect(() => {
    if (!on) return;
    const t = setInterval(() => setN((n) => n + 1), ms);
    return () => clearInterval(t);
  }, [on, ms]);
}

const REC_ERR: Record<string, string> = {
  denied: 'Konum izni verilmedi; iz kaydedilemiyor. Ayarlardan konum izni verin.',
  unavailable: 'Konum alınamıyor. GPS açık mı? Açık alana çıkın.',
  timeout: 'Konum uzun süredir alınamadı. Açık alana çıkın.',
  unsupported: 'Bu cihaz konum özelliğini desteklemiyor.',
  insecure: 'Konum yalnızca güvenli bağlantıda (https ya da uygulamanın kendisi) çalışır.',
};

export function IzCard({
  track,
  loc,
  onClose,
  onFit,
}: {
  track: TrackState;
  loc: LatLon | null;
  onClose: () => void;
  onFit: () => void;
}) {
  const [confirmDel, setConfirmDel] = useState(false);
  useTicker(track.recording);
  const len = pathLength(track.points);
  const dur = trackDurationMs(track);
  const err = recorder.error();
  const has = track.points.length > 0;
  const back = has && loc ? backtrack(track.points, loc) : null;
  return (
    <div class="card iz-card" data-testid="track-card" role="region" aria-label="İz kaydı">
      <div class="row">
        <span class={'rec-dot' + (track.recording ? ' on' : '')} aria-hidden="true" />
        <strong class="grow" data-testid="track-status">
          {track.recording ? 'İz kaydediliyor' : has ? 'İz kaydı durdu' : 'İz kaydı'}
        </strong>
        <button type="button" class="poi-close" aria-label="İz kartını kapat" data-testid="track-card-close" onClick={onClose}>
          ×
        </button>
      </div>
      {track.startedAt != null || has ? (
        <div class="iz-stats">
          <div>
            <div class="label">Mesafe</div>
            <div class="iz-num mono" data-testid="track-distance">
              {formatDistance(len)}
            </div>
          </div>
          <div>
            <div class="label">Süre</div>
            <div class="iz-num mono" data-testid="track-time">
              {formatClock(dur)}
            </div>
          </div>
          <div>
            <div class="label">Nokta</div>
            <div class="iz-num mono" data-testid="track-points" title={`${track.rejected} gürültülü konum atlandı`}>
              {track.points.length}
            </div>
          </div>
        </div>
      ) : (
        <p class="empty">
          Yürüdüğünüz yolu kaydeder; kaybolduğunuzda aynı yoldan başlangıca dönebilirsiniz. İnternet gerekmez, yalnızca GPS kullanılır.
        </p>
      )}
      {track.recording && !has && !err && <p class="warn">İlk iyi konum bekleniyor… (± 35 m'den kötü konumlar atlanır)</p>}
      {err && (
        <p class="field-err" role="alert" data-testid="track-error">
          {REC_ERR[err]}
        </p>
      )}
      {back && (
        <div class="muted mono iz-back" data-testid="track-back-summary">
          Başlangıç: {formatDistance(back.straightM)} {cardinal8(back.straightBearing)} kuş uçuşu · iz boyunca {formatDistance(back.alongM)}
        </div>
      )}
      <div class="row wrap">
        {track.recording ? (
          <button type="button" class="btn primary grow" data-testid="track-stop" onClick={() => recorder.stop()}>
            Kaydı durdur
          </button>
        ) : has ? (
          <>
            <button type="button" class="btn primary grow" data-testid="track-continue" onClick={() => recorder.continue()}>
              Devam et
            </button>
            <button type="button" class="btn grow" data-testid="track-new" onClick={() => setConfirmDel(true)}>
              Yeni iz
            </button>
          </>
        ) : (
          <button type="button" class="btn primary grow" data-testid="track-start" onClick={() => recorder.start()}>
            Kaydı başlat
          </button>
        )}
        {has && (
          <button
            type="button"
            class="btn grow"
            data-testid="track-goback"
            onClick={() => {
              const s = track.points[0];
              setNavTarget({ kind: 'start', name: 'İz başlangıcı', lat: s.lat, lon: s.lon, mode: track.points.length > 2 ? 'track' : 'straight' });
            }}
          >
            Başlangıca dön
          </button>
        )}
      </div>
      {has && (
        <div class="row wrap">
          <button type="button" class="link-btn" data-testid="track-fit" onClick={onFit}>
            İzi haritada göster
          </button>
          <span class="grow" />
          {!confirmDel && (
            <button type="button" class="link-btn" data-testid="track-delete" onClick={() => setConfirmDel(true)}>
              İzi sil
            </button>
          )}
        </div>
      )}
      {confirmDel && (
        <div class="inline-confirm" role="alertdialog" aria-label="İzi sil">
          <span>Kayıtlı iz silinsin mi? Başlangıç noktası da kaybolur.</span>
          <button type="button" class="btn" data-testid="track-delete-cancel" onClick={() => setConfirmDel(false)}>
            Vazgeç
          </button>
          <button
            type="button"
            class="btn danger"
            data-testid="track-delete-confirm"
            onClick={() => {
              setConfirmDel(false);
              recorder.clear();
            }}
          >
            Sil
          </button>
        </div>
      )}
      <p class="warn">
        Ekran kilitliyken ya da uygulama arka plandayken telefon konum vermeyebilir; kayıt sırasında uygulamayı açık tutun. İz bu
        cihazda saklanır.
      </p>
    </div>
  );
}

/** Hedefe giderken: mesafe, yön, dönüş ipucu; başlangıca dönüşte kuş uçuşu / iz boyunca. */
export function NavCard({
  target,
  loc,
  heading,
  track,
  onLocate,
  onFit,
  locMsg,
}: {
  target: NavTarget;
  loc: LatLon | null;
  heading: number | null;
  track: TrackState;
  onLocate: () => void;
  onFit: () => void;
  locMsg: string;
}) {
  const isStart = target.kind === 'start';
  const mode = isStart && target.mode === 'track' && track.points.length > 1 ? 'track' : 'straight';
  let d = 0;
  let b = 0;
  let along: number | null = null;
  if (loc) {
    if (mode === 'track') {
      const bt = backtrack(track.points, loc)!;
      d = bt.nextM;
      b = bt.nextBearing;
      along = bt.alongM;
    } else {
      d = distanceM(loc, target);
      b = bearingDeg(loc, target);
    }
  }
  const rel = heading == null ? b : relativeBearing(b, heading);
  const arrived = loc && (mode === 'track' ? (along ?? 0) < 15 : d < 15);
  const t = target.kind === 'wp' ? waypointStore().get(target.id ?? '') : undefined;
  return (
    <div class="card nav-card" data-testid="nav-card" role="region" aria-label="Hedefe git">
      <div class="row">
        {t ? <WpBadge type={t.type} size={20} /> : <span class="nav-ic" aria-hidden="true">{isStart ? '⌂' : '◎'}</span>}
        <strong class="grow nav-name" data-testid="nav-name">
          {isStart ? 'Başlangıca dön' : t?.name ?? target.name}
        </strong>
        <button type="button" class="btn" data-testid="nav-fit" onClick={onFit} disabled={!loc} aria-label="Konumu ve hedefi haritada göster">
          Göster
        </button>
        <button type="button" class="btn" data-testid="nav-end" onClick={() => setNavTarget(null)}>
          Bitir
        </button>
      </div>
      {isStart && track.points.length > 1 && (
        <div class="row" role="group" aria-label="Dönüş biçimi">
          <button
            type="button"
            class="chip grow"
            data-testid="nav-mode-straight"
            aria-pressed={mode === 'straight' ? 'true' : 'false'}
            onClick={() => setNavTarget({ ...target, mode: 'straight' })}
          >
            Kuş uçuşu
          </button>
          <button
            type="button"
            class="chip grow"
            data-testid="nav-mode-track"
            aria-pressed={mode === 'track' ? 'true' : 'false'}
            onClick={() => setNavTarget({ ...target, mode: 'track' })}
          >
            İz boyunca
          </button>
        </div>
      )}
      {!loc ? (
        <div class="col">
          <p class="empty">{locMsg || 'Konumunuz henüz bilinmiyor.'}</p>
          <button type="button" class="btn primary" data-testid="nav-locate" onClick={onLocate}>
            Konumumu bul
          </button>
        </div>
      ) : arrived ? (
        <div class="nav-arrived" data-testid="nav-arrived" role="status">
          Hedefe vardınız (15 m içinde).
        </div>
      ) : (
        <div class="nav-body">
          <svg class="nav-arrow" viewBox="0 0 100 100" width="64" height="64" role="img" aria-label={heading == null ? `Yön ${cardinal8Long(b)}` : turnHint(rel)} data-testid="nav-arrow" data-rot={rel.toFixed(1)}>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#2E3643" stroke-width="3" />
            <g transform={`rotate(${rel} 50 50)`}>
              <path d="M50 12 L68 64 L50 54 L32 64 Z" fill="#F5A524" />
            </g>
          </svg>
          <div class="grow">
            <div class="nav-big mono" data-testid="nav-distance">
              {mode === 'track' ? formatDistance(along!) : formatDistance(d)}
            </div>
            <div class="mono nav-sub" data-testid="nav-bearing">
              {cardinal8(b)} · {Math.round(b) % 360}° {mode === 'track' ? `· iz noktası ${formatDistance(d)}` : '· kuş uçuşu'}
            </div>
            <div class="nav-sub">
              {heading != null ? (
                <b data-testid="nav-turn">
                  {turnHint(rel)}
                  {Math.abs(angleDiff(0, rel)) > 15 ? ` (${Math.round(Math.abs(angleDiff(0, rel)))}°)` : ''}
                </b>
              ) : (
                <span>Ok kuzeye göre (pusula yok)</span>
              )}{' '}
              · ~{formatDuration(walkMinutes(mode === 'track' ? along! : d))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Yer işaretleri ----------

export interface AddPreset {
  /** uzun basma / sağ tık ile seçilen nokta */
  picked?: LatLon | null;
  /** haritada dokunulan yer işareti: listede öne çıkar */
  focusId?: string;
}

export function WaypointSheet({
  list,
  loc,
  center,
  preset,
  startAdding,
  onClose,
  onShow,
}: {
  list: Waypoint[];
  loc: LatLon | null;
  center: () => LatLon | null;
  preset: AddPreset;
  startAdding: boolean;
  onClose: () => void;
  onShow: (w: Waypoint) => void;
}) {
  const [adding, setAdding] = useState(startAdding);
  const [editing, setEditing] = useState<Waypoint | null>(null);
  const [open, setOpen] = useState<{ id: string; what: 'share' | 'del' } | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    if (!preset.focusId) return;
    document.querySelector(`[data-testid="wp-item"][data-id="${CSS.escape(preset.focusId)}"]`)?.scrollIntoView({ block: 'center' });
  }, [preset.focusId]);
  const sorted = loc ? [...list].sort((a, b) => distanceM(loc, a) - distanceM(loc, b)) : [...list].reverse();
  return (
    <Sheet title="Yer işaretleri" testid="wp-sheet" onClose={onClose}>
      {editing ? (
        <AddWaypointForm
          loc={loc}
          center={center}
          picked={null}
          edit={editing}
          onCancel={() => setEditing(null)}
          onSaved={(w) => {
            setEditing(null);
            setMsg(`"${w.name}" güncellendi.`);
          }}
        />
      ) : adding ? (
        <AddWaypointForm
          loc={loc}
          center={center}
          picked={preset.picked ?? null}
          onCancel={() => (startAdding ? onClose() : setAdding(false))}
          onSaved={(w) => {
            setAdding(false);
            setMsg(`"${w.name}" kaydedildi.`);
          }}
        />
      ) : (
        <>
          <button type="button" class="btn primary" data-testid="wp-add" onClick={() => setAdding(true)}>
            + Yer işareti ekle
          </button>
          {msg && (
            <p class="warn" role="status" data-testid="wp-msg">
              {msg}
            </p>
          )}
          {!list.length ? (
            <p class="empty" data-testid="wp-empty">
              Henüz yer işareti yok. Çadırınızı, su kaynağını ya da buluşma noktasını kaydedin; internetsiz geri bulun. Haritada bir
              noktaya uzun basarak da ekleyebilirsiniz.
            </p>
          ) : (
            <ul class="wp-list" data-testid="wp-list">
              {sorted.map((w) => {
                const t = WAYPOINT_TYPES[w.type];
                const isOpen = open?.id === w.id;
                return (
                  <li key={w.id} class={'wp-item' + (preset.focusId === w.id ? ' focus' : '')} data-testid="wp-item" data-id={w.id}>
                    <button type="button" class="wp-row" data-testid="wp-show" onClick={() => onShow(w)} aria-label={`${w.name} haritada göster`}>
                      <WpBadge type={w.type} size={24} />
                      <span class="grow wp-txt">
                        <span class="wp-name">{w.name}</span>
                        <span class="muted wp-meta">{t.label}</span>
                      </span>
                      {loc && (
                        <span class="mono muted wp-dist" data-testid="wp-dist">
                          {formatDistance(distanceM(loc, w))} {cardinal8(bearingDeg(loc, w))}
                        </span>
                      )}
                    </button>
                    <div class="row wrap wp-actions">
                      <button
                        type="button"
                        class="btn primary grow"
                        data-testid="wp-goto"
                        onClick={() => {
                          setNavTarget({ kind: 'wp', id: w.id, name: w.name, lat: w.lat, lon: w.lon });
                          onClose();
                        }}
                      >
                        Buraya git
                      </button>
                      <button
                        type="button"
                        class="btn grow"
                        data-testid="wp-share-toggle"
                        aria-expanded={isOpen && open!.what === 'share' ? 'true' : 'false'}
                        onClick={() => setOpen(isOpen && open!.what === 'share' ? null : { id: w.id, what: 'share' })}
                      >
                        Paylaş
                      </button>
                      <button type="button" class="btn" data-testid="wp-edit" aria-label={`${w.name} düzenle`} onClick={() => setEditing(w)}>
                        Düzenle
                      </button>
                      <button type="button" class="btn" data-testid="wp-delete" aria-label={`${w.name} sil`} onClick={() => setOpen({ id: w.id, what: 'del' })}>
                        Sil
                      </button>
                    </div>
                    {isOpen && open!.what === 'share' && <ShareBox wp={w} />}
                    {isOpen && open!.what === 'del' && (
                      <div class="inline-confirm" role="alertdialog" aria-label="Yer işaretini sil">
                        <span>"{w.name}" silinsin mi?</span>
                        <button type="button" class="btn" data-testid="wp-delete-cancel" onClick={() => setOpen(null)}>
                          Vazgeç
                        </button>
                        <button
                          type="button"
                          class="btn danger"
                          data-testid="wp-delete-confirm"
                          onClick={() => {
                            waypointStore().remove(w.id);
                            setOpen(null);
                          }}
                        >
                          Sil
                        </button>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </Sheet>
  );
}

type Src = 'konum' | 'merkez' | 'secilen';

function AddWaypointForm({
  loc,
  center,
  picked,
  edit,
  onCancel,
  onSaved,
}: {
  loc: LatLon | null;
  center: () => LatLon | null;
  picked: LatLon | null;
  /** verilirse düzenleme: ad ve tür değişir, konum aynı kalır */
  edit?: Waypoint;
  onCancel: () => void;
  onSaved: (w: Waypoint) => void;
}) {
  const [name, setName] = useState(edit?.name ?? '');
  const [type, setType] = useState<WaypointType>(edit?.type ?? 'cadir');
  const [src, setSrc] = useState<Src>(picked ? 'secilen' : loc ? 'konum' : 'merkez');
  const [err, setErr] = useState<string | null>(null);
  const c = center();
  const pos = edit ? edit : src === 'secilen' ? picked : src === 'konum' ? loc : c;
  function save() {
    if (edit) {
      const w = waypointStore().update(edit.id, { name, type });
      if (w) onSaved(w);
      else setErr('Yer işareti bulunamadı (silinmiş olabilir).');
      return;
    }
    if (!pos) {
      setErr(src === 'konum' ? 'Konumunuz henüz bilinmiyor; harita merkezini seçin ya da konum bekleyin.' : 'Nokta seçilemedi.');
      return;
    }
    try {
      onSaved(waypointStore().add({ name, type, lat: pos.lat, lon: pos.lon }));
    } catch (e) {
      setErr('Kaydedilemedi: ' + (e instanceof Error ? e.message : String(e)));
    }
  }
  return (
    <form
      class="col wp-form"
      data-testid="wp-form"
      data-mode={edit ? 'edit' : 'add'}
      onSubmit={(e) => {
        e.preventDefault();
        save();
      }}
    >
      <label class="label" for="wp-name">
        Ad
      </label>
      <input
        id="wp-name"
        class="input"
        data-testid="wp-name"
        maxLength={60}
        placeholder={WAYPOINT_TYPES[type].label}
        value={name}
        onInput={(e) => setName((e.target as HTMLInputElement).value)}
      />
      <div class="label">Tür</div>
      <div class="type-chips" role="group" aria-label="Tür">
        {WAYPOINT_TYPE_ORDER.map((t) => (
          <button
            key={t}
            type="button"
            class="chip"
            data-testid="wp-type"
            data-type={t}
            aria-pressed={type === t ? 'true' : 'false'}
            onClick={() => setType(t)}
          >
            <WpBadge type={t} size={18} />
            {WAYPOINT_TYPES[t].label}
          </button>
        ))}
      </div>
      {!edit && <div class="label">Nerede?</div>}
      {!edit && (
      <div class="type-chips" role="group" aria-label="Konum kaynağı">
        {picked && (
          <button type="button" class="chip" data-testid="wp-src-picked" aria-pressed={src === 'secilen' ? 'true' : 'false'} onClick={() => setSrc('secilen')}>
            Seçilen nokta
          </button>
        )}
        <button type="button" class="chip" data-testid="wp-src-loc" aria-pressed={src === 'konum' ? 'true' : 'false'} onClick={() => setSrc('konum')}>
          Konumum
        </button>
        <button type="button" class="chip" data-testid="wp-src-center" aria-pressed={src === 'merkez' ? 'true' : 'false'} onClick={() => setSrc('merkez')}>
          Harita merkezi
        </button>
      </div>
      )}
      <div class="mono muted" data-testid="wp-pos">
        {pos ? formatDecimal(pos.lat, pos.lon) : src === 'konum' ? 'Konum bekleniyor…' : '—'}
      </div>
      {err && (
        <p class="field-err" role="alert" data-testid="wp-err">
          {err}
        </p>
      )}
      <div class="row">
        <button type="button" class="btn grow" data-testid="wp-cancel" onClick={onCancel}>
          Vazgeç
        </button>
        <button type="submit" class="btn primary grow" data-testid="wp-save" disabled={!pos}>
          Kaydet
        </button>
      </div>
    </form>
  );
}
