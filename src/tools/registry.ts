// Araçlar sekmesindeki araçların listesi. Her araç kendi klasöründeki
// bileşeni tembel yükler (src/tools/<id>/index.tsx → export default bileşen).
import type { ComponentType } from 'preact';

export interface ToolDef {
  id: string;
  title: string;
  /** kısa açıklama */
  desc: string;
  /** grup başlığı */
  group: 'Kaynaklar' | 'Yön ve konum' | 'Bilgi ve eğlence' | 'Cihaz';
  load: () => Promise<{ default: ComponentType }>;
}

export const TOOLS: ToolDef[] = [
  { id: 'canta', title: 'Afet çantası', desc: 'Kontrol listesi ve son kullanma tarihleri', group: 'Kaynaklar', load: () => import('./canta') },
  { id: 'hesap', title: 'Su ve yiyecek hesabı', desc: 'Kaç kişi, kaç gün, ne kadar gerekir', group: 'Kaynaklar', load: () => import('./hesap') },
  { id: 'stok', title: 'Stok listesi', desc: 'Elinizdekiler, miktar ve tarih', group: 'Kaynaklar', load: () => import('./stok') },
  { id: 'pil', title: 'Pil ve şarj', desc: 'Kalan süre tahmini ve tasarruf ipuçları', group: 'Kaynaklar', load: () => import('./pil') },
  { id: 'pusula', title: 'Pusula', desc: 'Kuzey, yön ve hedefe açı', group: 'Yön ve konum', load: () => import('./pusula') },
  { id: 'cocuk', title: 'Çocuk köşesi', desc: 'Masallar, oyunlar, boyama', group: 'Bilgi ve eğlence', load: () => import('./cocuk') },
  { id: 'sozluk', title: 'Acil durum cümleleri', desc: 'İngilizce, Arapça, Kürtçe, Farsça…', group: 'Bilgi ve eğlence', load: () => import('./sozluk') },
  { id: 'radyo', title: 'Radyo rehberi', desc: 'Afette hangi yayını, nasıl dinlemeli', group: 'Bilgi ve eğlence', load: () => import('./radyo') },
  { id: 'paylas', title: 'Paketler ve paylaşım', desc: 'İndir, içe aktar, bilgi noktası', group: 'Cihaz', load: () => import('./paylas') },
  { id: 'ayarlar', title: 'Ayarlar', desc: 'Yazı boyutu, kontrast, düşük güç, depolama', group: 'Cihaz', load: () => import('./ayarlar') },
];
