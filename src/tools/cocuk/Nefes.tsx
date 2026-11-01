import { useEffect, useRef, useState } from 'preact/hooks';
import { breathPhase } from './logic';
import { IcPause, IcPlay } from './icons';

/** Sakinleştirici nefes oyunu: balon 4 sn şişer (nefes al), 4 sn söner (nefes ver). */
export function Nefes() {
  const [running, setRunning] = useState(false);
  const [st, setSt] = useState(() => breathPhase(0));
  const t0 = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    if (!running) return;
    t0.current = performance.now();
    const tick = (now: number) => {
      setSt(breathPhase(now - t0.current));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [running]);

  const s = running ? st : { ...breathPhase(0), scale: 0.55 };
  return (
    <div class="ck-breath" data-testid="nefes">
      <div class="ck-breath-stage">
        <svg viewBox="0 0 200 240" class="ck-balloon" aria-hidden="true">
          <g style={{ transform: `scale(${s.scale.toFixed(3)})`, transformOrigin: '100px 175px' }} data-testid="nefes-balloon" data-scale={s.scale.toFixed(2)}>
            <ellipse cx="100" cy="95" rx="70" ry="82" fill="#ff6b6b" stroke="#1d2430" stroke-width="4" />
            <path d="M60 60 Q52 80 55 100" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity="0.7" />
            <path d="M92 176 L108 176 L100 186 Z" fill="#e63946" stroke="#1d2430" stroke-width="3" />
          </g>
          <path d="M100 186 Q90 205 104 220 Q112 230 100 240" stroke="#c9d1db" stroke-width="3" fill="none" />
        </svg>
      </div>
      <div class="ck-breath-word" data-testid="nefes-phase" aria-live="polite">
        {running ? (s.phase === 'in' ? 'Nefes al' : 'Nefes ver') : 'Hazır mısın?'}
      </div>
      <div class="ck-breath-count" data-testid="nefes-count">
        {running
          ? [1, 2, 3, 4].map((n) => (
              <i key={n} class={n <= s.count ? 'on' : ''}>
                {n}
              </i>
            ))
          : null}
      </div>
      {running && s.cycle > 0 && (
        <p class="ck-hint" data-testid="nefes-cycles">
          {s.cycle} balon şişirdin. {s.cycle >= 5 ? 'Ne kadar sakinsin, aferin!' : ''}
        </p>
      )}
      <button class="ck-big-btn" data-testid="nefes-start" onClick={() => setRunning(!running)}>
        {running ? <IcPause /> : <IcPlay />} {running ? 'Dur' : 'Başla'}
      </button>
      <p class="ck-hint">Burnundan yavaşça nefes al, balon şişsin. Ağzından yavaşça ver, balon sönsün.</p>
    </div>
  );
}
