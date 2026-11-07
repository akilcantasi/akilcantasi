// Kütüphane sekmesinin küçük satır içi simgeleri (icons.tsx paylaşımlı olduğundan burada).
import type { JSX } from 'preact';
import type { Kategori } from './veri';

const svg = (d: JSX.Element, size = 20) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    {d}
  </svg>
);

export const IcoLeft = () => svg(<path d="M15 18l-6-6 6-6" />);
export const IcoRight = () => svg(<path d="M9 18l6-6-6-6" />);
export const IcoUp = () => svg(<path d="M18 15l-6-6-6 6" />);
export const IcoDown = () => svg(<path d="M6 9l6 6 6-6" />);
export const IcoX = () => svg(<path d="M18 6L6 18M6 6l12 12" />);
export const IcoBack = () => svg(<path d="M19 12H5M11 18l-6-6 6-6" />);
export const IcoFind = ({ size = 20 }: { size?: number }) =>
  svg(
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>,
    size,
  );
export const IcoDice = () =>
  svg(
    <>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </>,
  );
export const IcoToc = () => svg(<path d="M8 6h13M8 12h13M8 18h9M3.5 6h.01M3.5 12h.01M3.5 18h.01" />);
export const IcoShare = () =>
  svg(
    <>
      <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7" />
      <path d="M16 6l-4-4-4 4M12 2v13" />
    </>,
  );
export const IcoPlus = () => svg(<path d="M12 5v14M5 12h14" />);
export const IcoDownload = ({ size = 20 }: { size?: number }) =>
  svg(
    <>
      <path d="M12 3v12M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </>,
    size,
  );
export const IcoPause = () => svg(<path d="M9 5v14M15 5v14" />);
export const IcoPlay = () => svg(<path d="M7 5l12 7-12 7z" />);
export const IcoTrash = () => svg(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />);
export const IcoInfo = () =>
  svg(
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>,
  );
export const IcoWifi = ({ size = 16 }: { size?: number }) =>
  svg(<path d="M2 8.8a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 19.5h.01" />, size);
export const IcoFile = () =>
  svg(
    <>
      <path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" />
      <path d="M14 3v5h5" />
    </>,
  );
export const IcoHome = () => svg(<path d="M4 11l8-7 8 7M6 9.5V20h12V9.5" />);
export const IcoSpark = () => svg(<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M18 6l-2.5 2.5M8.5 15.5L6 18" />);

/** Kategori simgesi (kart ve mağaza bölümleri) */
export function KategoriIkon({ k, size = 26 }: { k: Kategori; size?: number }) {
  switch (k) {
    case 'saglik':
      // Artı (kırmızı değil: kartın kendi rengiyle)
      return svg(<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />, size);
    case 'ansiklopedi':
      return svg(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
        </>,
        size,
      );
    case 'kitap':
      return svg(<path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5zM4 20.5A2.5 2.5 0 006.5 23H20v-5" />, size);
    case 'hayatta':
      // Su damlası
      return svg(<path d="M12 3s7 7.5 7 12a7 7 0 01-14 0c0-4.5 7-12 7-12z" />, size);
    case 'pratik':
      // İngiliz anahtarı
      return svg(<path d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z" />, size);
    case 'dil':
      return svg(<path d="M4 7h10M9 4v3M6 7c0 4 3 7 6 8M12 7c-1 4-4 7-8 8M14 20l4-9 4 9M15.5 17h5" />, size);
    default:
      return svg(
        <>
          <path d="M14 3H6a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V8z" />
          <path d="M14 3v5h5M9 13h6M9 17h4" />
        </>,
        size,
      );
  }
}
