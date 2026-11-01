import { useEffect, useRef, useState } from 'preact/hooks';
import { floodFill, hexToRgba } from './logic';
import { COLORING_PICS, Pic, PICS } from './pictures';
import { IcBrush, IcBucket, IcCheck, IcTrash, IcUndo, IcX } from './icons';

const SIZE = 600; // iç çözünürlük (piksel)
const K = SIZE / 100; // çizim ölçeği
const LINE = 1.8; // çizgi kalınlığı (100'lük birimde)

export const COLORS = ['#e63946', '#ff8fab', '#f4a261', '#ffd23f', '#52b788', '#2d6a4f', '#4cc9f0', '#3a86ff', '#8e44ad', '#8d5b3e', '#adb5bd', '#ffffff'];

// Görünen çizgi, sınır maskesinden biraz kalındır: dolgu kenarındaki kenar yumuşatma boşluklarını örter.
function drawLines(ctx: CanvasRenderingContext2D, pic: string, width = LINE + 0.8, color = '#1d2430') {
  const p = PICS[pic];
  ctx.save();
  ctx.setTransform(K, 0, 0, K, 0, 0);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  for (const s of p.shapes) ctx.stroke(new Path2D(s.d));
  ctx.restore();
}

function buildWall(pic: string): Uint8Array {
  const c = document.createElement('canvas');
  c.width = SIZE;
  c.height = SIZE;
  const x = c.getContext('2d')!;
  drawLines(x, pic, LINE, '#000');
  const d = x.getImageData(0, 0, SIZE, SIZE).data;
  const wall = new Uint8Array(SIZE * SIZE);
  for (let i = 0; i < wall.length; i++) wall[i] = d[i * 4 + 3] > 90 ? 1 : 0;
  return wall;
}

export function Boyama() {
  const [pic, setPic] = useState<string | null>(null);
  if (!pic)
    return (
      <div class="ck-pic-grid" data-testid="boya-list">
        {COLORING_PICS.map((id) => (
          <button key={id} class="ck-pic-btn" data-testid={'boya-pic-' + id} aria-label={PICS[id].name} onClick={() => setPic(id)}>
            <Pic id={id} size="80%" outline />
          </button>
        ))}
      </div>
    );
  return <Canvas key={pic} pic={pic} onBack={() => setPic(null)} />;
}

function Canvas({ pic, onBack }: { pic: string; onBack: () => void }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wall = useRef<Uint8Array | null>(null);
  const undo = useRef<ImageData[]>([]);
  const drawing = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[3]);
  const [tool, setTool] = useState<'bucket' | 'brush'>('bucket');
  const [canUndo, setCanUndo] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [err, setErr] = useState('');

  const ctx = () => ref.current?.getContext('2d', { willReadFrequently: true }) ?? null;

  const reset = () => {
    const c = ctx();
    if (!c) return;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.fillStyle = '#ffffff';
    c.fillRect(0, 0, SIZE, SIZE);
    drawLines(c, pic);
  };

  useEffect(() => {
    try {
      wall.current = buildWall(pic);
      reset();
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    }
  }, [pic]);

  const snap = () => {
    const c = ctx();
    if (!c) return;
    undo.current.push(c.getImageData(0, 0, SIZE, SIZE));
    if (undo.current.length > 15) undo.current.shift();
    setCanUndo(true);
  };

  const pos = (e: PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };

  const down = (e: PointerEvent) => {
    const c = ctx();
    if (!c) return;
    e.preventDefault();
    const p = pos(e);
    snap();
    if (tool === 'bucket') {
      const img = c.getImageData(0, 0, SIZE, SIZE);
      const n = floodFill(img.data, SIZE, SIZE, p.x, p.y, hexToRgba(color), wall.current ?? undefined);
      if (n === 0) {
        undo.current.pop();
        setCanUndo(undo.current.length > 0);
        return;
      }
      c.putImageData(img, 0, 0);
      drawLines(c, pic);
    } else {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      drawing.current = p;
      dot(c, p, p);
    }
  };

  const dot = (c: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }) => {
    c.save();
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.strokeStyle = color;
    c.lineWidth = 28;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(a.x, a.y);
    c.lineTo(b.x + 0.01, b.y);
    c.stroke();
    c.restore();
  };

  const move = (e: PointerEvent) => {
    if (!drawing.current) return;
    const c = ctx();
    if (!c) return;
    const p = pos(e);
    dot(c, drawing.current, p);
    drawing.current = p;
  };

  const up = () => {
    if (!drawing.current) return;
    drawing.current = null;
    const c = ctx();
    if (c) drawLines(c, pic);
  };

  const doUndo = () => {
    const c = ctx();
    const img = undo.current.pop();
    if (c && img) c.putImageData(img, 0, 0);
    setCanUndo(undo.current.length > 0);
  };

  if (err) return <p class="empty">Boyama açılamadı: {err}</p>;

  return (
    <div class="ck-paint" data-testid="boya-paint">
      <div class="ck-paint-bar">
        <button class="ck-round" aria-label="Resim seç" data-testid="boya-back" onClick={onBack}>
          <Pic id={pic} size={28} outline />
        </button>
        <button class={'ck-round' + (tool === 'bucket' ? ' on' : '')} aria-label="Boya kovası" aria-pressed={tool === 'bucket'} data-testid="boya-tool-bucket" onClick={() => setTool('bucket')}>
          <IcBucket />
        </button>
        <button class={'ck-round' + (tool === 'brush' ? ' on' : '')} aria-label="Fırça" aria-pressed={tool === 'brush'} data-testid="boya-tool-brush" onClick={() => setTool('brush')}>
          <IcBrush />
        </button>
        <button class="ck-round" aria-label="Geri al" data-testid="boya-undo" disabled={!canUndo} onClick={doUndo}>
          <IcUndo />
        </button>
        {confirmClear ? (
          <>
            <button
              class="ck-round danger"
              aria-label="Evet, hepsini sil"
              data-testid="boya-clear-yes"
              onClick={() => {
                snap();
                reset();
                setConfirmClear(false);
              }}
            >
              <IcCheck />
            </button>
            <button class="ck-round" aria-label="Vazgeç" data-testid="boya-clear-no" onClick={() => setConfirmClear(false)}>
              <IcX />
            </button>
          </>
        ) : (
          <button class="ck-round" aria-label="Hepsini sil" data-testid="boya-clear" onClick={() => setConfirmClear(true)}>
            <IcTrash />
          </button>
        )}
      </div>
      <canvas
        ref={ref}
        width={SIZE}
        height={SIZE}
        class="ck-canvas"
        data-testid="boya-canvas"
        aria-label={'Boyama sayfası: ' + PICS[pic].name}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={up}
      />
      <div class="ck-colors" role="group" aria-label="Renkler">
        {COLORS.map((c) => (
          <button
            key={c}
            class={'ck-color' + (c === color ? ' on' : '')}
            style={{ background: c }}
            aria-label={'Renk ' + c}
            aria-pressed={c === color}
            data-testid={'boya-color-' + c.slice(1)}
            onClick={() => setColor(c)}
          />
        ))}
      </div>
    </div>
  );
}
