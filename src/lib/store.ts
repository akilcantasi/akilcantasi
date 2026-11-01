// Küçük, bağımlılıksız durum deposu. Sekmeler arası gezinme ve paylaşılan
// durum (pil modu, açık rehber/makale, asistan soruları) buradan yönetilir.
import { useEffect, useState } from 'preact/hooks';

export const TAB_IDS = ['fener', 'rehber', 'harita', 'iletisim', 'kutuphane', 'araclar'] as const;
export type TabId = (typeof TAB_IDS)[number];

export interface AppState {
  tab: TabId;
  online: boolean;
  batterySaver: boolean;
  /** Rehber sekmesinde açık rehber */
  openGuideId: string | null;
  /** Rehber sekmesinde açık kategori (rehberden geri dönünce buraya gelinir) */
  openCategoryId: string | null;
  /** Araçlar sekmesinde açık araç (src/tools/registry.ts) */
  openTool: string | null;
  /** İletişim sekmesinde açık bölüm (src/iletisim) */
  openComm: string | null;
  /** Kütüphane sekmesinde açık makale yolu */
  openArticlePath: string | null;
  /** Asistana dışarıdan gönderilen bekleyen soru (harita/kütüphane "asistana sor") */
  pendingQuestion: { text: string; context?: { title: string; text: string; source: string } } | null;
  /** Paket durumları değiştiğinde artar; dinleyiciler yeniden yükler */
  packsVersion: number;
  /** Alt menüden sekmeye her dokunuşta artar; sekmeler yerel iç ekranlarını kapatır */
  homeTap: number;
  /** "Hazırlanalım" kurulum ekranı açık */
  kurulum: boolean;
}

type Listener = (s: AppState) => void;

function loadBool(key: string, def: boolean) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? def : v === '1';
  } catch {
    return def;
  }
}

let state: AppState = {
  tab: 'fener',
  online: typeof navigator !== 'undefined' ? navigator.onLine : false,
  batterySaver: typeof localStorage !== 'undefined' ? loadBool('ac.batterySaver', false) : false,
  openGuideId: null,
  openCategoryId: null,
  openTool: null,
  openComm: null,
  openArticlePath: null,
  pendingQuestion: null,
  packsVersion: 0,
  homeTap: 0,
  kurulum: false,
};
const listeners = new Set<Listener>();

export function getState() {
  return state;
}

export function setState(patch: Partial<AppState>) {
  state = { ...state, ...patch };
  if ('batterySaver' in patch) {
    try {
      localStorage.setItem('ac.batterySaver', state.batterySaver ? '1' : '0');
    } catch {}
  }
  listeners.forEach((l) => l(state));
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useAppState(): AppState {
  const [s, set] = useState(state);
  useEffect(() => {
    const un = subscribe(set);
    set(state);
    return () => {
      un();
    };
  }, []);
  return s;
}

export const go = {
  tab: (tab: TabId) => {
    if ((TAB_IDS as readonly string[]).includes(tab)) setState({ tab });
  },
  /** Alt menüden sekmeye dokunuş. Başka sekmeden gelince kalınan yer korunur;
   *  zaten açık olan sekmeye dokununca sekmenin ana ekranına dönülür. */
  home: (tab: TabId) => {
    if (!(TAB_IDS as readonly string[]).includes(tab)) return;
    if (state.tab !== tab) {
      setState({ tab });
      return;
    }
    const reset: Partial<AppState> =
      tab === 'rehber'
        ? { openGuideId: null, openCategoryId: null }
        : tab === 'araclar'
          ? { openTool: null }
          : tab === 'iletisim'
            ? { openComm: null }
            : tab === 'kutuphane'
              ? { openArticlePath: null }
              : {};
    setState({ tab, ...reset, homeTap: state.homeTap + 1 });
  },
  guide: (id: string | null) => setState({ tab: 'rehber', openGuideId: id }),
  category: (id: string | null) => setState({ tab: 'rehber', openGuideId: null, openCategoryId: id }),
  tool: (id: string | null) => setState({ tab: 'araclar', openTool: id }),
  comm: (id: string | null) => setState({ tab: 'iletisim', openComm: id }),
  article: (path: string | null) => setState({ tab: 'kutuphane', openArticlePath: path }),
  ask: (text: string, context?: AppState['pendingQuestion'] extends infer T ? T extends { context?: infer C } ? C : never : never) =>
    setState({ tab: 'fener', pendingQuestion: { text, context } }),
};

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => setState({ online: true }));
  window.addEventListener('offline', () => setState({ online: false }));
}
