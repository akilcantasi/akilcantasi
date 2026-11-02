// Araçlar sekmesi: araç kutuları → seçilen araç.
import { useEffect, useState } from 'preact/hooks';
import type { ComponentType } from 'preact';
import { go, useAppState } from '../lib/store';
import { TOOLS, type ToolDef } from '../tools/registry';

/** Araç simgeleri (24×24 çizgi) */
const TOOL_ICON: Record<string, string> = {
  enkaz: '<path d="M3 20h18"/><path d="M5 20l3-7 4 2 3-5 4 10"/><circle cx="17" cy="5" r="1.5"/><path d="M14.5 2.5a4 4 0 0 1 5 5M13 1a6 6 0 0 1 8 8"/>',
  'enkaz-arama': '<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5L20 20"/><path d="M7.5 10a2.5 2.5 0 0 1 5 0"/><path d="M10 10h.01"/>',
  hava: '<path d="M7 18a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 8.5a4.5 4.5 0 0 1 .5 9z"/><path d="M8 21l1-1.5M12 21l1-1.5M16 21l1-1.5"/>',
  canta: '<rect x="4" y="7" width="16" height="13" rx="2.5"/><path d="M9 7V5a3 3 0 0 1 6 0v2M12 11v5M9.5 13.5h5"/>',
  hesap: '<path d="M12 3s-6 6.5-6 11a6 6 0 0 0 12 0c0-4.5-6-11-6-11z"/>',
  stok: '<path d="M4 7l8-4 8 4-8 4z"/><path d="M4 12l8 4 8-4M4 17l8 4 8-4"/>',
  pil: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 10v4M7 10v4M10.5 10v4"/>',
  pusula: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
  cocuk: '<circle cx="12" cy="8" r="3.5"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/><path d="M9 7.5h.01M15 7.5h.01"/>',
  sozluk: '<path d="M4 5h9v9H8l-4 3z"/><path d="M13 9h7v8l-3-2h-4"/>',
  radyo: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M7 9l10-5"/><circle cx="8.5" cy="14.5" r="2"/><path d="M14 13h4M14 16h4"/>',
  paylas: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  ayarlar: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
};

const CSS = `
.tl-group { font-size: 15px; color: var(--text); margin: 10px 0 0; font-weight: 600; }
.tl-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.tl-card { text-align: left; background: var(--card); border: 1px solid var(--line2); border-radius: 18px; padding: 14px 12px; color: var(--text); display: flex; flex-direction: column; gap: 4px; min-height: 84px; }
.tl-card:hover { border-color: rgba(255,200,97,0.45); }
.tl-ic { width: 40px; height: 40px; border-radius: 13px; display: flex; align-items: center; justify-content: center; background: var(--accent-soft); color: var(--accent2); margin-bottom: 6px; }
.tl-card b { font-size: 16px; line-height: 1.25; }
.tl-card > span:not(.tl-ic) { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.tl-back { align-self: flex-start; min-height: 44px; background: var(--glass); border: 1px solid var(--glass-line); border-radius: 999px; color: var(--accent2); font-size: 14px; font-weight: 500; padding: 0 14px; }
.tl-title { font-size: 24px; font-weight: 600; margin: 0; }
`;

function ToolView({ t }: { t: ToolDef }) {
  const [C, setC] = useState<ComponentType | null>(null);
  const [err, setErr] = useState('');
  useEffect(() => {
    let alive = true;
    setC(null);
    t.load()
      .then((m) => alive && setC(() => m.default))
      .catch((e) => alive && setErr(String(e?.message ?? e)));
    return () => {
      alive = false;
    };
  }, [t.id]);
  return (
    <div class="pad" data-testid={'tool-' + t.id}>
      <button class="tl-back" data-testid="tool-back" onClick={() => go.tool(null)}>
        ← Araçlar
      </button>
      <h1 class="tl-title">{t.title}</h1>
      {err ? <p class="empty">Yüklenemedi: {err}</p> : C ? <C /> : <p class="empty">Yükleniyor…</p>}
    </div>
  );
}

export function AraclarTab() {
  const s = useAppState();
  const open = TOOLS.find((t) => t.id === s.openTool);
  useEffect(() => {
    document.getElementById('main')?.scrollTo({ top: 0 });
  }, [open?.id]);
  if (open) {
    return (
      <>
        <style>{CSS}</style>
        <ToolView t={open} />
      </>
    );
  }
  const groups = [...new Set(TOOLS.map((t) => t.group))];
  return (
    <div class="pad">
      <style>{CSS}</style>
      {groups.map((g) => (
        <section key={g} style="display:flex;flex-direction:column;gap:10px">
          <h2 class="tl-group">{g}</h2>
          <div class="tl-grid">
            {TOOLS.filter((t) => t.group === g).map((t) => (
              <button key={t.id} class="tl-card" data-testid={'tool-card-' + t.id} onClick={() => go.tool(t.id)}>
                {TOOL_ICON[t.id] && (
                  <span class="tl-ic" aria-hidden="true">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" dangerouslySetInnerHTML={{ __html: TOOL_ICON[t.id] }} />
                  </span>
                )}
                <b>{t.title}</b>
                <span>{t.desc}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
