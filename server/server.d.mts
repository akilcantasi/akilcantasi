import type http from 'node:http';

export const SERVER_NAME: string;
export const PACK_EXTS: string[];
export const MIME: Record<string, string>;
export function mimeOf(name: string): string;
export function lanAddresses(): string[];
export function parseRange(header: string | undefined | null, size: number): null | 'invalid' | { start: number; end: number };
export function safeJoin(root: string, rel: string, p?: typeof import('node:path')): string | null;
export function unsafeSegment(seg: string): boolean;

export const BOARD_KINDS: string[];
export const BOARD_LIMITS: { id: number; from: number; text: number; body: number; items: number; page: number; ratePerMin: number };
export interface BoardItemIn {
  id: string;
  kind: 'mesaj' | 'iyiyim' | 'kayip' | 'duyuru';
  from: string;
  text: string;
  lat?: number;
  lon?: number;
  status?: string;
}
export function cleanBoardText(s: unknown, max: number, multiline?: boolean): string;
export function validateBoardItem(raw: unknown): { ok: true; item: BoardItemIn } | { ok: false; error: string };

export interface StartOptions {
  port?: number;
  host?: string;
  data?: string;
  dist?: string;
  apkDirs?: string[];
  throttleBps?: number;
  onRequest?: (req: http.IncomingMessage) => void;
  quiet?: boolean;
  /** mesaj panosu sınırları (testler için) */
  board?: { maxItems?: number; ratePerMin?: number };
  /** Telefonlardan da sunucu tarafı indirme başlatılabilsin */
  remoteFetch?: boolean;
  /** Testler: sunucu indiricisinin kullanacağı fetch ve ayarlar */
  fetchImpl?: typeof fetch;
  fetcher?: { segments?: number; minSegment?: number; stallMs?: number; probeMs?: number; mirrors?: (urls: string[]) => string[] };
}

export interface FetchJob {
  file: string;
  id?: string;
  status: 'checking' | 'downloading' | 'verifying' | 'paused' | 'error' | 'done';
  received: number;
  total: number;
  speed: number;
  mirror: string | null;
  error: string | null;
}

export interface RunningServer {
  fetcher: { list(): FetchJob[]; start(f: string): Promise<{ ok: boolean; status?: number; error?: string; job?: FetchJob }>; pause(f: string): boolean; cancel(f: string): Promise<boolean>; stopAll(): void };
  server: http.Server;
  port: number;
  url: string;
  addresses: string[];
  dataDir: string;
  distDir: string;
  close(): Promise<void>;
}

export function startServer(opts?: StartOptions): Promise<RunningServer>;
