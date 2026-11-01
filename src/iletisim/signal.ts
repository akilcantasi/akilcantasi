// İşaret oynatıcı: ekran ışığı, ses (WebAudio) ve telefon flaşı aynı zaman
// çizelgesiyle açılıp kapanır. Şebeke ya da internet gerektirmez.
//
// Düdük deseni: üç kısa ses, ara, tekrar. Dağ/arama-kurtarma geleneğinde
// "üçlü" işaretler (üç düdük, üç ışık) imdat anlamına gelir.
// Kaynak: en.wikipedia.org/wiki/Distress_signal ("three blasts on a whistle…").
import { native } from '../lib/native';
import { SOS, morseToSteps, type Step } from './morse';

export type SoundKind = 'whistle' | 'siren' | 'tone';

/** SOS: ...---... (birim) — ardından 7 birim boşluk ve tekrar */
export const SOS_STEPS: Step[] = [...morseToSteps(SOS), [false, 7]];
/** Üç kısa düdük: 100 ms birimle 0,5 sn ses, 0,4 sn ara ×3, 2 sn bekleme */
export const WHISTLE_STEPS: Step[] = [
  [true, 5], [false, 4],
  [true, 5], [false, 4],
  [true, 5], [false, 20],
];

let ctx: AudioContext | null = null;
function audio(): AudioContext | null {
  try {
    const C = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!C) return null;
    ctx ??= new C();
    if (ctx!.state === 'suspended') ctx!.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}

/** Sürekli çalan ses kaynağı; kazancı açılıp kapatılır */
class Voice {
  private gain: GainNode;
  private nodes: AudioScheduledSourceNode[] = [];
  constructor(private c: AudioContext, kind: SoundKind, freq = 700) {
    this.gain = c.createGain();
    this.gain.gain.value = 0;
    // Sınırlayıcı: kare dalga kulak tırmalar ama hoparlörde en yüksek algılanan ses
    const comp = c.createDynamicsCompressor();
    this.gain.connect(comp).connect(c.destination);
    const t = c.currentTime;
    if (kind === 'whistle') {
      // Düdük: ~3 kHz civarı iki yakın ton + hafif titreşim (vibrato)
      for (const f of [2900, 3150]) {
        const o = c.createOscillator();
        o.type = 'square';
        o.frequency.value = f;
        const lfo = c.createOscillator();
        lfo.frequency.value = 28;
        const depth = c.createGain();
        depth.gain.value = 60;
        lfo.connect(depth).connect(o.frequency);
        o.connect(this.gain);
        o.start(t);
        lfo.start(t);
        this.nodes.push(o, lfo);
      }
    } else if (kind === 'siren') {
      const o = c.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = 1000;
      const lfo = c.createOscillator();
      lfo.type = 'triangle';
      lfo.frequency.value = 0.5; // 2 sn'de bir yükselip alçalır
      const depth = c.createGain();
      depth.gain.value = 450;
      lfo.connect(depth).connect(o.frequency);
      o.connect(this.gain);
      o.start(t);
      lfo.start(t);
      this.nodes.push(o, lfo);
    } else {
      const o = c.createOscillator();
      o.type = 'sine';
      o.frequency.value = freq;
      o.connect(this.gain);
      o.start(t);
      this.nodes.push(o);
    }
  }
  set(on: boolean, level = 0.9) {
    const t = this.c.currentTime;
    this.gain.gain.cancelScheduledValues(t);
    // 5 ms yumuşak geçiş: tıkırtı olmasın
    this.gain.gain.setTargetAtTime(on ? level : 0, t, 0.005);
  }
  stop() {
    this.set(false);
    const t = this.c.currentTime + 0.05;
    for (const n of this.nodes) {
      try {
        n.stop(t);
      } catch {}
    }
    setTimeout(() => this.gain.disconnect(), 100);
  }
}

export interface PlayOptions {
  steps: Step[];
  unitMs: number;
  loop?: boolean;
  sound?: SoundKind | null;
  toneHz?: number;
  torch?: boolean;
  /** ekran/arayüz için: her açılıp kapanmada */
  onChange?: (on: boolean) => void;
  onEnd?: () => void;
}

export interface Player {
  stop(): void;
  /** flaş denendi ama çalışmadı */
  torchFailed(): boolean;
}

/** Çizelgeyi oynatır. Sürüklenme olmasın diye hedef zamanlara göre ayarlanır. */
export function play(o: PlayOptions): Player {
  const c = o.sound ? audio() : null;
  const voice = c && o.sound ? new Voice(c, o.sound, o.toneHz) : null;
  let torchOk = !!o.torch;
  let torchTried = false;
  let torchState = false;
  let stopped = false;
  let timer: any = null;
  let i = 0;
  let target = performance.now();

  const setTorch = (on: boolean) => {
    if (!torchOk || torchState === on) return;
    torchState = on;
    native.setTorch(on).then((ok) => {
      torchTried = true;
      if (!ok && on) torchOk = false;
    });
  };
  const apply = (on: boolean) => {
    voice?.set(on);
    setTorch(on);
    o.onChange?.(on);
  };
  const step = () => {
    if (stopped) return;
    if (i >= o.steps.length) {
      if (!o.loop) {
        finish();
        o.onEnd?.();
        return;
      }
      i = 0;
    }
    const [on, units] = o.steps[i++];
    apply(on);
    target += units * o.unitMs;
    timer = setTimeout(step, Math.max(0, target - performance.now()));
  };
  const finish = () => {
    stopped = true;
    clearTimeout(timer);
    voice?.stop();
    if (torchState) {
      torchState = false;
      native.setTorch(false);
    }
    o.onChange?.(false);
  };
  if (!o.steps.length) {
    queueMicrotask(() => o.onEnd?.());
  } else step();
  return {
    stop: () => {
      if (!stopped) finish();
    },
    torchFailed: () => torchTried && !torchOk,
  };
}

/** Sürekli ışık (el feneri) */
export function steady(o: { torch?: boolean; onChange?: (on: boolean) => void }): Player {
  let failed = false;
  let tried = false;
  if (o.torch)
    native.setTorch(true).then((ok) => {
      tried = true;
      failed = !ok;
    });
  o.onChange?.(true);
  let stopped = false;
  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      if (o.torch) native.setTorch(false);
      o.onChange?.(false);
    },
    torchFailed: () => tried && failed,
  };
}

/** Ekranın kararmasını engeller (destekleniyorsa) */
export async function keepAwake(): Promise<() => void> {
  try {
    const wl = await (navigator as any).wakeLock?.request('screen');
    return () => wl?.release?.().catch?.(() => {});
  } catch {
    return () => {};
  }
}
