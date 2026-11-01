// Çocuk köşesi: masallar ve oyunlar (3–10 yaş), tamamen çevrimdışı.
import { useEffect, useState } from 'preact/hooks';
import { Pic } from './pictures';
import { Masallar } from './Masallar';
import { Hafiza } from './Hafiza';
import { Boyama } from './Boyama';
import { Bilgi } from './Bilgi';
import { Nefes } from './Nefes';
import { IcBack } from './icons';
import { stopSpeaking } from '../sozluk/speech';

const CSS = `
.ck { display: flex; flex-direction: column; gap: 14px; }
.ck-home { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.ck-tile { min-height: 150px; border-radius: 22px; border: 2px solid var(--line3); background: var(--card); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; font-size: 20px; font-weight: 700; padding: 12px; }
.ck-tile:active { transform: scale(0.97); }
.ck-tile.wide { grid-column: 1 / -1; min-height: 120px; flex-direction: row; gap: 16px; }
.ck-tile[data-c='1'] { border-color: #6c8cff; background: rgba(108,140,255,0.10); }
.ck-tile[data-c='2'] { border-color: #ffd23f; background: rgba(255,210,63,0.08); }
.ck-tile[data-c='3'] { border-color: #ff8fab; background: rgba(255,143,171,0.10); }
.ck-tile[data-c='4'] { border-color: #52b788; background: rgba(82,183,136,0.10); }
.ck-tile[data-c='5'] { border-color: #ff6b6b; background: rgba(255,107,107,0.10); }
.ck-head { display: flex; align-items: center; gap: 10px; }
.ck-head h2 { margin: 0; font-size: 22px; }
.ck-round { width: 52px; height: 52px; min-width: 52px; border-radius: 50%; border: 2px solid var(--line3); background: var(--card); color: var(--text); display: inline-flex; align-items: center; justify-content: center; font-size: 17px; font-weight: 700; padding: 0; }
.ck-round.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
.ck-round.danger { background: var(--danger); border-color: var(--danger); color: var(--on-accent); }
.ck-round:disabled { opacity: 0.4; }
.ck-pill { min-height: 52px; border-radius: 26px; border: 2px solid var(--accent); background: transparent; color: var(--accent); padding: 0 18px; font-size: 17px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; }
.ck-pill.on { background: var(--accent); color: var(--on-accent); }
.ck-pill:disabled { opacity: 0.4; border-color: var(--line3); color: var(--muted); }
.ck-big-btn { min-height: 60px; border-radius: 18px; border: none; background: var(--accent); color: var(--on-accent); font-size: 19px; font-weight: 700; padding: 10px 18px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; }
.ck-hint { margin: 0; font-size: 15px; color: var(--muted); line-height: 1.45; text-align: center; }

/* masallar */
.ck-story-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.ck-story-card { min-height: 128px; border-radius: 18px; border: 1px solid var(--line3); background: var(--card); color: var(--text); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; padding: 10px; font-size: 15px; font-weight: 600; line-height: 1.3; text-align: center; }
.ck-reader { display: flex; flex-direction: column; gap: 12px; }
.ck-reader-bar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; position: sticky; top: 0; background: var(--bg); padding: 6px 0; z-index: 2; }
.ck-reader-pic { display: flex; justify-content: center; background: #fdf6e3; border-radius: 20px; padding: 14px; }
.ck-reader-title { margin: 0; line-height: 1.25; text-align: center; }
.ck-reader-text { font-family: Georgia, 'Noto Serif', serif; line-height: 1.65; color: #f3eee3; }
.ck-reader-text p { margin: 0 0 0.8em; border-radius: 8px; transition: background 0.3s; }
.ck-reader-text p.reading { background: rgba(245,165,36,0.15); }
.ck-end { text-align: center; color: var(--muted); margin: 0; font-size: 18px; }

/* hafıza */
.ck-levels { display: flex; flex-direction: column; gap: 12px; }
.ck-level { min-height: 96px; border-radius: 20px; border: 2px solid var(--line3); background: var(--card); color: var(--text); display: flex; align-items: center; gap: 16px; padding: 12px 18px; font-size: 22px; }
.ck-dots { display: grid; grid-template-columns: repeat(4, 12px); gap: 5px; }
.ck-dots i { width: 12px; height: 12px; border-radius: 3px; background: var(--accent); display: block; }
.ck-mem { display: flex; flex-direction: column; gap: 12px; position: relative; }
.ck-mem-bar { display: flex; gap: 8px; align-items: center; }
.ck-chip-stat { min-height: 44px; display: inline-flex; align-items: center; gap: 6px; padding: 0 14px; border-radius: 22px; background: var(--card); border: 1px solid var(--line3); font-size: 18px; font-weight: 700; }
.ck-mem-bar .ck-chip-stat:nth-child(2) { margin-right: auto; }
.ck-mem-grid { display: grid; gap: 10px; }
.ck-card { aspect-ratio: 1; min-height: 64px; border-radius: 16px; border: 2px solid #3a4a8c; background: linear-gradient(135deg, #3a4a8c, #6c8cff); display: flex; align-items: center; justify-content: center; padding: 0; transition: transform 0.2s; }
.ck-card.face { background: #fdf6e3; border-color: #e0d6bd; }
.ck-card.done { border-color: var(--ok); box-shadow: 0 0 0 3px rgba(61,214,140,0.35); }
.ck-card-back { font-size: 34px; font-weight: 800; color: rgba(255,255,255,0.85); }
.ck-win { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; background: var(--card); border: 2px solid var(--accent); border-radius: 22px; padding: 18px; }
.ck-win b { font-size: 24px; }
.ck-win span { font-size: 17px; color: var(--text2); line-height: 1.4; }
.ck-win-stars { display: flex; gap: 6px; }
.ck-win-stars svg { width: 48px; height: 48px; }

/* boyama */
.ck-pic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.ck-pic-btn { aspect-ratio: 1; border-radius: 20px; border: 2px solid var(--line3); background: #fff; display: flex; align-items: center; justify-content: center; padding: 0; }
.ck-paint { display: flex; flex-direction: column; gap: 10px; }
.ck-paint-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.ck-paint-bar .ck-round:first-child { background: #fff; }
.ck-canvas { width: 100%; max-width: 480px; aspect-ratio: 1; border-radius: 18px; background: #fff; touch-action: none; align-self: center; display: block; }
.ck-colors { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 8px; }
.ck-color { aspect-ratio: 1; min-height: 48px; border-radius: 50%; border: 3px solid var(--line3); padding: 0; }
.ck-color.on { border-color: #fff; box-shadow: 0 0 0 3px var(--accent); transform: scale(1.06); }

/* bilgi yarışması */
.ck-quiz { display: flex; flex-direction: column; gap: 14px; }
.ck-progress { display: flex; gap: 5px; }
.ck-progress i { flex: 1; height: 8px; border-radius: 4px; background: var(--line3); display: block; }
.ck-progress i.past { background: var(--ok); }
.ck-progress i.now { background: var(--accent); }
.ck-q { margin: 0; font-size: 24px; line-height: 1.3; }
.ck-opts { display: flex; flex-direction: column; gap: 10px; }
.ck-opt { min-height: 64px; border-radius: 18px; border: 2px solid var(--line3); background: var(--card); color: var(--text); font-size: 19px; font-weight: 600; text-align: left; padding: 10px 16px; display: flex; align-items: center; gap: 8px; }
.ck-opt.ok { border-color: var(--ok); background: rgba(61,214,140,0.15); }
.ck-opt.no { border-color: var(--danger); background: rgba(255,138,122,0.12); }
.ck-opt.dim { opacity: 0.5; }
.ck-opt:disabled { cursor: default; color: var(--text); }
.ck-feedback { display: flex; flex-direction: column; gap: 10px; border-radius: 18px; padding: 14px; background: rgba(245,165,36,0.12); border: 2px solid rgba(245,165,36,0.5); }
.ck-feedback.ok { background: rgba(61,214,140,0.12); border-color: rgba(61,214,140,0.6); }
.ck-feedback b { font-size: 22px; }
.ck-feedback span { font-size: 17px; line-height: 1.45; color: var(--text2); }

/* nefes */
.ck-breath { display: flex; flex-direction: column; align-items: center; gap: 12px; }
.ck-breath-stage { width: 100%; max-width: 320px; aspect-ratio: 200 / 240; }
.ck-balloon { width: 100%; height: 100%; display: block; }
.ck-breath-word { font-size: 34px; font-weight: 800; color: var(--accent); min-height: 44px; }
.ck-breath-count { display: flex; gap: 10px; min-height: 44px; }
.ck-breath-count i { width: 44px; height: 44px; border-radius: 50%; border: 2px solid var(--line3); display: flex; align-items: center; justify-content: center; font-style: normal; font-size: 20px; font-weight: 700; color: var(--muted); }
.ck-breath-count i.on { background: var(--accent); border-color: var(--accent); color: var(--on-accent); }
`;

type View = 'home' | 'masal' | 'hafiza' | 'boya' | 'bilgi' | 'nefes';
const TITLES: Record<View, string> = { home: '', masal: 'Masallar', hafiza: 'Hafıza oyunu', boya: 'Boyama', bilgi: 'Afete hazır mıyım?', nefes: 'Balon nefesi' };

export default function Cocuk() {
  const [v, setV] = useState<View>('home');
  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0 });
    if (v !== 'masal') stopSpeaking();
  }, [v]);
  useEffect(() => () => stopSpeaking(), []);

  return (
    <div class="ck" data-testid="cocuk">
      <style>{CSS}</style>
      {v === 'home' ? (
        <div class="ck-home">
          <button class="ck-tile wide" data-c="1" data-testid="ck-open-masal" onClick={() => setV('masal')}>
            <Pic id="moon" size={72} />
            Masallar
          </button>
          <button class="ck-tile" data-c="2" data-testid="ck-open-hafiza" onClick={() => setV('hafiza')}>
            <Pic id="star" size={64} />
            Hafıza
          </button>
          <button class="ck-tile" data-c="3" data-testid="ck-open-boya" onClick={() => setV('boya')}>
            <Pic id="flower" size={64} />
            Boyama
          </button>
          <button class="ck-tile" data-c="4" data-testid="ck-open-bilgi" onClick={() => setV('bilgi')}>
            <Pic id="turtle" size={64} />
            Hazır mıyım?
          </button>
          <button class="ck-tile" data-c="5" data-testid="ck-open-nefes" onClick={() => setV('nefes')}>
            <Pic id="balloon" size={64} />
            Nefes
          </button>
        </div>
      ) : (
        <>
          <div class="ck-head">
            <button class="ck-round" aria-label="Çocuk köşesine dön" data-testid="ck-home" onClick={() => setV('home')}>
              <IcBack />
            </button>
            <h2>{TITLES[v]}</h2>
          </div>
          {v === 'masal' && <Masallar />}
          {v === 'hafiza' && <Hafiza />}
          {v === 'boya' && <Boyama />}
          {v === 'bilgi' && <Bilgi />}
          {v === 'nefes' && <Nefes />}
        </>
      )}
    </div>
  );
}
