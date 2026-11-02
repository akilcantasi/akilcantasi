// Akıl Çantası logosu: kitap oyuklu çanta, Şafak gradyanı (sarı → turuncu → gül).
// Kaynak geometri tools/logo/simge-uret.py ile aynıdır (1024 birimlik çizim alanı);
// Android simgeleri, açılış ekranı ve tarayıcı simgesi oradan üretilir.

export const LOGO = {
  stops: ['#FDE047', '#FB923C', '#F43F5E'],
  body: 'M352 296H672C732 296 762 326 770 386C782 476 804 610 812 694C818 764 784 810 722 810H302C240 810 206 764 212 694C220 610 242 476 254 386C262 326 292 296 352 296Z',
  handle: 'M393 330V313A118 118 0 0 1 629 313V330',
  lpage: 'M370 424H474Q500 424 500 450V682C470 652 420 640 370 640Q344 640 344 614V450Q344 424 370 424Z',
  rpage: 'M654 424H550Q524 424 524 450V682C554 652 604 640 654 640Q680 640 680 614V450Q680 424 654 424Z',
};

let seq = 0;

/** Uygulama simgesi (yuvarlatılmış kare). Süs olarak kullanılır; yanında her zaman uygulamanın adı vardır. */
export function AppLogo({ size = 32, class: cls }: { size?: number; class?: string }) {
  const id = `lg${++seq}`;
  const n = LOGO.stops.length - 1;
  return (
    <svg class={cls} width={size} height={size} viewBox="0 0 1024 1024" aria-hidden="true" focusable="false" style={{ flexShrink: 0, display: 'block' }}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          {LOGO.stops.map((c, i) => (
            <stop key={c} offset={0.05 + (0.85 * i) / n} stop-color={c} />
          ))}
        </linearGradient>
      </defs>
      <rect width="1024" height="1024" rx="230" fill={`url(#${id}g)`} />
      <path d={LOGO.handle} fill="none" stroke="#fff" stroke-width="56" stroke-linecap="round" />
      {/* Gövde ve kitap tek yol: kitap sayfaları gövdede oyuk (çift-tek dolgu kuralı) */}
      <path d={`${LOGO.body}${LOGO.lpage}${LOGO.rpage}`} fill="#fff" fill-rule="evenodd" />
    </svg>
  );
}
