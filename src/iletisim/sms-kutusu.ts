// SMS giden kutusu: durum metinleri (saf mantık, test edilir) ve arayüz kancası.
import { useEffect, useState } from 'preact/hooks';
import { nativeSms, type SmsKayit } from '../lib/native';

/** "2 dk", "40 sn" */
export function sureMetni(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s} sn`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} dk`;
  return `${Math.round(m / 60)} sa`;
}

/** Bir mesajın kısa durum satırı ve rengi */
export function durumMetni(m: SmsKayit, now: number): { text: string; tone: 'ok' | 'wait' | 'bad' } {
  switch (m.state) {
    case 'ulasti':
      return { text: 'Ulaştı', tone: 'ok' };
    case 'gitti':
      return { text: m.attempts > 1 ? `Gönderildi (${m.attempts}. denemede)` : 'Gönderildi', tone: 'ok' };
    case 'gonderiliyor':
      return { text: m.attempts > 1 ? `Gönderiliyor (${m.attempts}. deneme)…` : 'Gönderiliyor…', tone: 'wait' };
    case 'hata':
      return { text: `Gönderilemedi: ${m.error || 'bilinmeyen hata'}`, tone: 'bad' };
    default: {
      const kalan = m.nextTry - now;
      const neden = m.error ? `${m.error}. ` : '';
      return { text: kalan > 1000 ? `${neden}${sureMetni(kalan)} sonra yeniden denenecek` : `${neden}Deneniyor…`, tone: m.error ? 'bad' : 'wait' };
    }
  }
}

/** Giden kutusunu izler (olay + açıkken her 5 sn yenileme) */
export function useSmsKutusu(): { items: SmsKayit[]; izin: boolean; refresh: () => void } | null {
  const avail = nativeSms.available();
  const [st, setSt] = useState<{ items: SmsKayit[]; izin: boolean }>({ items: [], izin: true });
  const refresh = () => void nativeSms.list().then(setSt);
  useEffect(() => {
    if (!avail) return;
    refresh();
    const off = nativeSms.listen((items) => setSt((s) => ({ ...s, items })));
    const t = setInterval(refresh, 5000);
    return () => {
      off();
      clearInterval(t);
    };
  }, [avail]);
  return avail ? { ...st, refresh } : null;
}
