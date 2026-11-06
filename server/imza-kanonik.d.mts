// server/imza-kanonik.mjs için tür bildirimleri (istemci ve testler kullanır).
export interface DurumGuncelleme {
  st: 'araniyor' | 'bulundu';
  ts: number;
  sig: string;
}
export interface ImzaAlanlari {
  pub: string;
  sig: string;
  ts: number;
  upd?: DurumGuncelleme;
}
export const PUB_RE: RegExp;
export const SIG_RE: RegExp;
export const DURUMLAR: string[];
export const TS_MIN: number;
export const TS_MAX: number;
export function kanonikIlan(it: { id: string; kind: string; from: string; text: string; status?: string; lat?: number; lon?: number; ts: number; pub: string }): string;
export function kanonikDurum(id: string, st: string, ts: number, pub: string): string;
export function kanonikBilgiNoktasi(it: { id: string; kind: string; from: string; text: string; status?: string; lat?: number; lon?: number; time: number }, bpub: string): string;
export function imzaAlanlari(raw: unknown, kind: string): { ok: true; f: ImzaAlanlari | null } | { ok: false; error: string };
export function bnAlanlari(raw: unknown): { bpub: string; bsig: string } | null;
export function b64uKodla(b: Uint8Array): string;
export function b64uCoz(s: string): Uint8Array | null;
export const ONEK_UZ: number;
export function kimlikOneki(pub: string): string;
export function kimlikBagli(id: unknown, pub: unknown): boolean;
