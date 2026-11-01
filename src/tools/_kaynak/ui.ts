// Kaynak araçlarının ortak stilleri (bileşenlerde <style>{KAYNAK_CSS}</style>).
export const KAYNAK_CSS = `
.kn { display: flex; flex-direction: column; gap: 14px; }
.kn-seg { display: flex; gap: 6px; flex-wrap: wrap; }
.kn-seg .chip { min-height: 44px; }
.kn-h { font-size: 15px; font-weight: 700; margin: 0; }
.kn-sub { font-size: 13px; color: var(--muted); line-height: 1.45; margin: 0; }
.kn-alert { border-radius: 14px; padding: 12px 14px; border: 1px solid var(--line3); background: var(--bg2); display: flex; flex-direction: column; gap: 6px; }
.kn-alert.bad { border-color: var(--danger); }
.kn-alert.soon { border-color: var(--accent); }
.kn-alert li { font-size: 14px; line-height: 1.4; }
.kn-alert ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.kn-red { color: var(--danger); font-weight: 600; }
.kn-amber { color: var(--accent); font-weight: 600; }
.kn-ok { color: var(--ok); font-weight: 600; }
.kn-group { display: flex; flex-direction: column; gap: 6px; }
.kn-group > h2, .kn-group > h3 { font-size: 15px; color: var(--text); margin: 6px 0 0; font-weight: 600; display: flex; justify-content: space-between; }
.kn-item { background: var(--card); border: 1px solid var(--line2); border-radius: 12px; display: flex; flex-direction: column; }
.kn-item.exp-expired { border-color: var(--danger); }
.kn-item.exp-soon { border-color: var(--accent); }
.kn-check { display: flex; gap: 12px; align-items: center; min-height: 52px; padding: 8px 12px; cursor: pointer; }
.kn-check input[type=checkbox] { width: 24px; height: 24px; accent-color: var(--accent); flex-shrink: 0; margin: 0; }
.kn-check .t { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.kn-check .t b { font-weight: 500; font-size: 15px; line-height: 1.3; }
.kn-check.done .t b { color: var(--muted); text-decoration: line-through; }
.kn-check .t small { font-size: 12.5px; color: var(--muted); line-height: 1.35; }
.kn-icon { min-width: 44px; min-height: 44px; border-radius: 10px; border: 1px solid transparent; background: transparent; color: var(--muted); display: inline-flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
.kn-icon:hover { border-color: var(--line3); color: var(--text); }
.kn-icon[aria-pressed='true'], .kn-icon.has { color: var(--accent); }
.kn-exp { display: flex; gap: 8px; align-items: center; padding: 0 12px 10px 48px; flex-wrap: wrap; }
.kn-exp .input { width: auto; flex: 1; min-width: 150px; height: 44px; }
.kn-date { font-size: 12.5px; font-family: var(--mono); }
.kn-form { display: flex; flex-direction: column; gap: 10px; }
.kn-field { display: flex; flex-direction: column; gap: 4px; }
.kn-field > span { font-size: 13px; color: var(--text2); }
.kn-grid2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.kn-select { height: 46px; width: 100%; background: var(--card); border: 1px solid var(--line-input); border-radius: 12px; color: var(--text); padding: 0 10px; font-size: 15px; }
.kn-stepper { display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 52px; padding: 4px 4px 4px 12px; background: var(--card); border: 1px solid var(--line2); border-radius: 12px; }
.kn-stepper .lbl { display: flex; flex-direction: column; min-width: 0; }
.kn-stepper .lbl b { font-size: 15px; font-weight: 500; }
.kn-stepper .lbl small { font-size: 12px; color: var(--muted); }
.kn-stepper .ctl { display: flex; align-items: center; gap: 4px; }
.kn-stepper .ctl button { width: 44px; height: 44px; border-radius: 10px; border: 1px solid var(--line3); background: var(--bg2); color: var(--text); font-size: 20px; font-weight: 600; }
.kn-stepper .ctl output, .kn-stepper .ctl input { width: 48px; height: 44px; text-align: center; font-family: var(--mono); font-size: 17px; background: transparent; border: none; color: var(--text); }
.kn-big { font-size: 30px; font-weight: 700; font-family: var(--mono); line-height: 1.1; }
.kn-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.kn-stat { background: var(--bg2); border: 1px solid var(--line2); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; gap: 4px; }
.kn-stat .label { font-size: 11px; }
.kn-stat small { font-size: 12px; color: var(--muted); line-height: 1.35; }
.kn-table { width: 100%; border-collapse: collapse; font-size: 14px; }
.kn-table td { padding: 8px 4px; border-bottom: 1px solid var(--line2); vertical-align: top; }
.kn-table td.num { text-align: right; font-family: var(--mono); white-space: nowrap; }
.kn-table small { color: var(--muted); font-size: 12px; display: block; }
.kn-src { font-size: 12.5px; color: var(--muted); line-height: 1.45; display: flex; flex-direction: column; gap: 6px; }
.kn-src ul { margin: 0; padding-left: 18px; display: flex; flex-direction: column; gap: 4px; }
.kn-src b { color: var(--text2); font-weight: 600; }
.kn-confirm { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; font-size: 14px; }
.kn-pbar { height: 10px; background: var(--line2); border-radius: 5px; overflow: hidden; }
.kn-pbar > div { height: 100%; background: var(--accent); }
.kn-pbar.ok > div { background: var(--ok); }
.kn-pbar.bad > div { background: var(--danger); }
.kn-pre { white-space: pre-wrap; font-family: var(--mono); font-size: 12.5px; background: var(--bg2); border: 1px solid var(--line2); border-radius: 12px; padding: 12px; margin: 0; max-height: 320px; overflow: auto; user-select: all; }
.kn-tips { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 8px; font-size: 14px; line-height: 1.45; }
.kn-tips b { color: var(--text); }
.kn-switch { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 56px; }
/* Dokunma alanı 56×44; görünen ray 56×32 (::before), topuz ::after */
.kn-toggle { width: 56px; height: 44px; border: none; background: transparent; position: relative; flex-shrink: 0; padding: 0; }
.kn-toggle::before { content: ''; position: absolute; left: 0; top: 6px; width: 56px; height: 32px; box-sizing: border-box; border-radius: 16px; border: 1px solid var(--line3); background: var(--line2); }
.kn-toggle::after { content: ''; position: absolute; top: 10px; left: 4px; width: 24px; height: 24px; border-radius: 50%; background: var(--muted); transition: left 0.15s; }
.kn-toggle[aria-checked='true']::before { background: var(--accent); border-color: var(--accent); }
.kn-toggle[aria-checked='true']::after { left: 28px; background: #0b0e13; }
.kn-touch { min-height: 44px; }
`;
