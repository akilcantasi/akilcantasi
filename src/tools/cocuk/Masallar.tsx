import { useEffect, useState } from 'preact/hooks';
import { MASALLAR } from './masal-veri';
import { Pic } from './pictures';
import { IcBack } from './icons';
import { findVoice, speakAll, useVoices } from '../sozluk/speech';

const LS_SIZE = 'akil.cocuk.yazi';
const SIZES = [20, 24, 28, 32];

function loadSize(): number {
  try {
    const v = Number(localStorage.getItem(LS_SIZE));
    if (SIZES.includes(v)) return v;
  } catch {
    /* yok say */
  }
  return 24;
}

export function Masallar() {
  const [open, setOpen] = useState<string | null>(null);
  const m = MASALLAR.find((x) => x.id === open);
  if (m) return <Reader key={m.id} id={m.id} onBack={() => setOpen(null)} onNext={(id) => setOpen(id)} />;
  return (
    <div class="ck-story-grid" data-testid="masal-list">
      {MASALLAR.map((x) => (
        <button key={x.id} class="ck-story-card" data-testid={'masal-' + x.id} onClick={() => setOpen(x.id)}>
          <Pic id={x.pic} size={56} />
          <span>{x.title}</span>
        </button>
      ))}
    </div>
  );
}

function Reader({ id, onBack, onNext }: { id: string; onBack: () => void; onNext: (id: string) => void }) {
  const idx = MASALLAR.findIndex((x) => x.id === id);
  const m = MASALLAR[idx];
  const next = MASALLAR[(idx + 1) % MASALLAR.length];
  const [size, setSize] = useState(loadSize);
  const [reading, setReading] = useState<number | null>(null);
  const [stopFn, setStopFn] = useState<(() => void) | null>(null);
  const voices = useVoices();
  const voice = findVoice('tr', voices);

  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0 });
  }, [id]);
  useEffect(() => () => stopFn?.(), [stopFn]);
  useEffect(() => {
    try {
      localStorage.setItem(LS_SIZE, String(size));
    } catch {
      /* yok say */
    }
  }, [size]);

  const start = () => {
    if (!voice) return;
    const stop = speakAll([m.title, ...m.text], voice, {
      rate: 0.85,
      onPart: (i) => setReading(i - 1),
      onEnd: () => {
        setReading(null);
        setStopFn(null);
      },
    });
    setStopFn(() => stop);
  };
  const stop = () => {
    stopFn?.();
    setStopFn(null);
    setReading(null);
  };

  return (
    <article class="ck-reader" data-testid="masal-reader">
      <div class="ck-reader-bar">
        <button class="ck-round" aria-label="Masal listesine dön" data-testid="masal-back" onClick={() => (stop(), onBack())}>
          <IcBack />
        </button>
        <button class="ck-round" aria-label="Yazıyı küçült" data-testid="masal-smaller" disabled={size <= SIZES[0]} onClick={() => setSize(SIZES[Math.max(0, SIZES.indexOf(size) - 1)])}>
          A−
        </button>
        <button
          class="ck-round"
          aria-label="Yazıyı büyüt"
          data-testid="masal-bigger"
          disabled={size >= SIZES[SIZES.length - 1]}
          onClick={() => setSize(SIZES[Math.min(SIZES.length - 1, SIZES.indexOf(size) + 1)])}
        >
          A+
        </button>
        {stopFn ? (
          <button class="ck-pill on" data-testid="masal-stop" onClick={stop}>
            Durdur
          </button>
        ) : (
          <button class="ck-pill" data-testid="masal-read" disabled={!voice} onClick={start} title={voice ? '' : 'Bu cihazda Türkçe ses yok'}>
            <SpeakerIcon /> Sesli oku
          </button>
        )}
      </div>
      {!voice && (
        <p class="ck-hint" data-testid="masal-novoice">
          Bu cihazda Türkçe okuma sesi bulunamadı. Masalı bir büyüğünüz okuyabilir.
        </p>
      )}
      <div class="ck-reader-pic">
        <Pic id={m.pic} size={96} />
      </div>
      <h2 class="ck-reader-title" style={{ fontSize: size + 6 + 'px' }}>
        {m.title}
      </h2>
      <div class="ck-reader-text" style={{ fontSize: size + 'px' }} data-testid="masal-text">
        {m.text.map((p, i) => (
          <p key={i} class={reading === i ? 'reading' : ''}>
            {p}
          </p>
        ))}
      </div>
      <p class="ck-end">— Son —</p>
      <button class="ck-big-btn" data-testid="masal-next" onClick={() => (stop(), onNext(next.id))}>
        Sıradaki masal: {next.title} →
      </button>
    </article>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="vertical-align:-4px">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
    </svg>
  );
}
