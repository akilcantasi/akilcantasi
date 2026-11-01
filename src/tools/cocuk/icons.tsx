// Çocuk köşesi küçük simgeleri (emoji yazı tipine bağımlı olmamak için SVG).
const P = { width: 24, height: 24, viewBox: '0 0 24 24', 'aria-hidden': 'true' as const };

export const IcBack = () => (
  <svg {...P}>
    <path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
export const IcRestart = () => (
  <svg {...P}>
    <path d="M19 12a7 7 0 1 1-2.05-4.95" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" />
    <path d="M19 4v4.5h-4.5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
export const IcGrid = () => (
  <svg {...P}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" fill="currentColor" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" fill="currentColor" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" fill="currentColor" />
  </svg>
);
export const IcStar = ({ on = true }: { on?: boolean }) => (
  <svg {...P}>
    <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17.2l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill={on ? '#ffd23f' : 'none'} stroke="#ffd23f" stroke-width="1.6" stroke-linejoin="round" />
  </svg>
);
export const IcFoot = () => (
  <svg {...P}>
    <ellipse cx="8" cy="9" rx="3" ry="4.5" fill="currentColor" />
    <ellipse cx="16" cy="15" rx="3" ry="4.5" fill="currentColor" />
  </svg>
);
export const IcUndo = () => (
  <svg {...P}>
    <path d="M9 14L4 9l5-5" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round" />
  </svg>
);
export const IcTrash = () => (
  <svg {...P}>
    <path d="M5 7h14M10 4h4M7 7l1 13h8l1-13" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
export const IcBucket = () => (
  <svg {...P}>
    <path d="M5 11l7-7 7 7-7 7z" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linejoin="round" />
    <path d="M5 11h14" stroke="currentColor" stroke-width="2.2" />
    <path d="M20.5 15c0 1.5-1 2.5-1.8 2.5S17 16.5 17 15c0-1 1.7-3 1.7-3s1.8 2 1.8 3z" fill="currentColor" />
  </svg>
);
export const IcBrush = () => (
  <svg {...P}>
    <path d="M14 4l6 6-8 8-3-3z" fill="currentColor" />
    <path d="M8 16c-3 0-4 2-4 4h3c2 0 3-1 3-2.5" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
  </svg>
);
export const IcCheck = () => (
  <svg {...P}>
    <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
);
export const IcX = () => (
  <svg {...P}>
    <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.8" fill="none" stroke-linecap="round" />
  </svg>
);
export const IcPlay = () => (
  <svg {...P}>
    <path d="M8 5l11 7-11 7z" fill="currentColor" />
  </svg>
);
export const IcPause = () => (
  <svg {...P}>
    <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
    <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);
