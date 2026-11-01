// Çizgi ikonlar (emoji kullanılmaz, her yerde aynı görünür)
import type { JSX } from 'preact';

type P = { size?: number; color?: string } & JSX.SVGAttributes<SVGSVGElement>;
const base = (size = 22, color = 'currentColor') => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: color,
  'stroke-width': 2,
  'stroke-linecap': 'round' as const,
  'stroke-linejoin': 'round' as const,
  'aria-hidden': 'true' as const,
});

export const IconFener = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M9 2h6" />
    <path d="M10 2v2M14 2v2" />
    <path d="M8 7h8l-1 4H9z" />
    <path d="M9 11v7a3 3 0 0 0 6 0v-7" />
    <path d="M12 14v2" />
  </svg>
);
export const IconChat = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
export const IconMap = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z" />
    <path d="M8 2v16M16 6v16" />
  </svg>
);
export const IconBook = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z" />
    <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5" />
  </svg>
);
export const IconShield = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M12 8v6M9 11h6" />
  </svg>
);
export const IconWifi = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M5 12.5a10 10 0 0 1 14 0" />
    <path d="M8.5 16a5 5 0 0 1 7 0" />
    <path d="M12 19.5h.01" />
    <path d="M1.5 9a15 15 0 0 1 21 0" />
  </svg>
);
export const IconSend = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M5 12h14" />
    <path d="M13 6l6 6-6 6" />
  </svg>
);
export const IconWarn = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M12 9v4M12 17h.01" />
    <path d="M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
  </svg>
);
export const IconBag = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M4 8h16v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    <path d="M12 12v4M10 14h4" />
  </svg>
);
export const IconLocate = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    <circle cx="12" cy="12" r="8" />
  </svg>
);
export const IconChip = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
  </svg>
);
export const IconSignal = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <path d="M12 20v-6" />
    <circle cx="12" cy="11" r="2" />
    <path d="M7.8 6.8a6 6 0 0 0 0 8.4M16.2 6.8a6 6 0 0 1 0 8.4" />
    <path d="M5 4a10 10 0 0 0 0 14M19 4a10 10 0 0 1 0 14" />
  </svg>
);
export const IconTools = ({ size, color, ...r }: P) => (
  <svg {...base(size, color)} {...r}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
);
