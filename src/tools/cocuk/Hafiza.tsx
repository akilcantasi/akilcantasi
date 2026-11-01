import { useEffect, useState } from 'preact/hooks';
import { flip, hideMismatch, isWon, newMemoryGame, type MemoryGame } from './logic';
import { MEMORY_PICS, Pic, PICS } from './pictures';
import { IcFoot, IcGrid, IcRestart, IcStar } from './icons';

const LEVELS = [
  { pairs: 3, cols: 3, label: 'Kolay' },
  { pairs: 6, cols: 3, label: 'Orta' },
  { pairs: 8, cols: 4, label: 'Zor' },
];

export function Hafiza() {
  const [level, setLevel] = useState<number | null>(null);
  const [g, setG] = useState<MemoryGame | null>(null);

  const start = (li: number) => {
    setLevel(li);
    setG(newMemoryGame(MEMORY_PICS.slice(0, LEVELS[li].pairs)));
  };

  useEffect(() => {
    if (!g?.locked) return;
    const t = setTimeout(() => setG((x) => (x ? hideMismatch(x) : x)), 900);
    return () => clearTimeout(t);
  }, [g?.locked]);

  if (level === null || !g) {
    return (
      <div class="ck-levels" data-testid="hafiza-levels">
        {LEVELS.map((l, i) => (
          <button key={i} class="ck-level" data-testid={'hafiza-level-' + i} onClick={() => start(i)}>
            <span class="ck-dots" aria-hidden="true">
              {Array.from({ length: l.pairs * 2 }).map((_, k) => (
                <i key={k} />
              ))}
            </span>
            <b>{l.label}</b>
          </button>
        ))}
      </div>
    );
  }

  const won = isWon(g);
  const L = LEVELS[level];
  return (
    <div class="ck-mem" data-testid="hafiza-game">
      <div class="ck-mem-bar">
        <span class="ck-chip-stat" data-testid="hafiza-moves" aria-label="Hamle sayısı">
          <IcFoot /> {g.moves}
        </span>
        <span class="ck-chip-stat" data-testid="hafiza-matches" aria-label="Bulunan eş">
          <IcStar /> {g.matches}/{L.pairs}
        </span>
        <button class="ck-round" aria-label="Yeniden başlat" data-testid="hafiza-restart" onClick={() => start(level)}>
          <IcRestart />
        </button>
        <button class="ck-round" aria-label="Seviye seç" data-testid="hafiza-levelback" onClick={() => setLevel(null)}>
          <IcGrid />
        </button>
      </div>
      <div class="ck-mem-grid" style={{ gridTemplateColumns: `repeat(${L.cols}, minmax(0, 1fr))` }}>
        {g.cards.map((c, i) => {
          const face = c.open || c.matched;
          return (
            <button
              key={c.id}
              class={'ck-card' + (face ? ' face' : '') + (c.matched ? ' done' : '')}
              data-testid={'hafiza-card-' + i}
              data-pic={c.pic}
              data-state={c.matched ? 'matched' : c.open ? 'open' : 'closed'}
              aria-label={face ? PICS[c.pic].name : 'Kapalı kart'}
              onClick={() => setG((x) => (x ? flip(x, i) : x))}
            >
              {face ? <Pic id={c.pic} size="78%" /> : <span class="ck-card-back" aria-hidden="true">?</span>}
            </button>
          );
        })}
      </div>
      {won && (
        <div class="ck-win" data-testid="hafiza-win">
          <div class="ck-win-stars" aria-hidden="true">
            <IcStar />
            <IcStar />
            <IcStar />
          </div>
          <b>Tebrikler! Hepsini buldun!</b>
          <span>{g.moves} hamlede bitirdin.</span>
          <button class="ck-big-btn" data-testid="hafiza-again" onClick={() => start(level)}>
            Yeniden oyna
          </button>
        </div>
      )}
    </div>
  );
}
