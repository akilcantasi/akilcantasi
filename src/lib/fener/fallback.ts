// Model yokken (ya da cihaz yetersiz / pil tasarrufu açık / model hata verdi)
// Fener'in yapay zekâsız cevabı: en uygun rehberin özeti + ilk adımları ve
// varsa Vikipedi'den kısa bir parça. Böylece Fener her durumda yardım eder.
import { clip, stepToText, type FenerSource, type Retrieval } from './rag';

export type FallbackReason = 'no-model' | 'battery' | 'unsupported' | 'error' | 'stopped';

export const FALLBACK_LABELS: Record<FallbackReason, string> = {
  'no-model': 'Model yüklü değil — rehberden yanıt',
  battery: 'Pil tasarrufu açık — rehberden yanıt',
  unsupported: 'Bu cihaz modeli çalıştıramıyor — rehberden yanıt',
  error: 'Model çalışmadı — rehberden yanıt',
  // Kullanıcı model yazmaya başlamadan "Durdur"a bastı (arama ya da yükleme sırasında)
  stopped: 'Durduruldu — rehberden yanıt',
};

export interface FallbackAnswer {
  label: string;
  text: string;
  sources: FenerSource[];
  critical: boolean;
  topGuideId: string | null;
  /** Hiçbir rehber/makale eşleşmedi */
  empty: boolean;
}

const MAX_STEPS = 4;

export function fallbackAnswer(r: Retrieval, reason: FallbackReason = 'no-model'): FallbackAnswer {
  const sources: FenerSource[] = [];
  const parts: string[] = [];
  let n = 0;

  const top = r.guides[0]?.guide;
  if (top) {
    n++;
    sources.push({ n, kind: 'rehber', id: top.id, title: top.title });
    const lines: string[] = [top.title.toLocaleUpperCase('tr-TR')];
    if (top.summary) lines.push(top.summary.trim());
    const steps = (top.steps ?? []).slice(0, MAX_STEPS).map(stepToText).filter(Boolean);
    if (steps.length) {
      lines.push('');
      lines.push('İlk adımlar:');
      steps.forEach((s, i) => lines.push(`${i + 1}. ${clip(s, 260)}`));
      const more = (top.steps?.length ?? 0) - steps.length;
      if (more > 0) lines.push(`… ve ${more} adım daha — rehberin tamamını açın.`);
    }
    const dont = (top.dont ?? []).slice(0, 2).map(stepToText).filter(Boolean);
    if (dont.length) {
      lines.push('');
      lines.push('Yapmayın:');
      dont.forEach((d) => lines.push(`• ${clip(d, 200)}`));
    }
    parts.push(lines.join('\n'));
  }

  // Diğer uygun rehberler: yalnızca başlık (kaynak etiketi olarak tıklanır)
  for (const h of r.guides.slice(1, 3)) {
    n++;
    sources.push({ n, kind: 'rehber', id: h.guide.id, title: h.guide.title });
  }
  if (r.guides.length > 1) {
    parts.push('İlgili diğer rehberler: ' + r.guides.slice(1, 3).map((h) => h.guide.title).join(', '));
  }

  const art = r.articles[0];
  if (art) {
    n++;
    sources.push({ n, kind: 'vikipedi', path: art.path, title: art.title, label: art.label });
    parts.push(`${art.label || 'Vikipedi'}'den — ${art.title}:\n${clip(art.text, top ? 320 : 700)}`);
  }

  if (r.context && r.context.text) {
    n++;
    sources.push({ n, kind: 'baglam', title: r.context.title || r.context.source });
    if (!top && !art) parts.push(`${r.context.title}:\n${clip(r.context.text, 500)}`);
  }

  const empty = !top && !art;
  if (empty && parts.length === 0) {
    parts.push(
      'Bu soruyla eşleşen bir rehber ya da makale bulamadım.\n' +
        "Rehber sekmesindeki konulara göz atabilir ya da soruyu farklı sözcüklerle sorabilirsiniz (ör. \"kanama\", \"enkaz\", \"su\").\n" +
        "Hayati bir durumdaysanız hemen 112'yi arayın.",
    );
  } else if (r.critical) {
    parts.push("Hayati bir durumdaysanız önce 112'yi arayın.");
  }

  return {
    label: FALLBACK_LABELS[reason],
    text: parts.join('\n\n'),
    sources,
    critical: r.critical,
    topGuideId: r.topGuideId,
    empty,
  };
}
