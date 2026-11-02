// Konum aramasının hangi aşamada olduğunu, telefonun bildirdiği uydu durumundan
// çıkarır. Arayüzden bağımsızdır; testleri tests/konum-arama.test.ts içinde.
import type { KonumDurum, Uydu } from '../native';

/** Konum hesabında işe yarayacak kadar güçlü sinyal (dB-Hz) */
export const GUCLU_SINYAL = 20;
/** Konum için gereken en az uydu sayısı */
export const GEREKEN_UYDU = 4;

export type AdimDurum = 'tamam' | 'suruyor' | 'bekliyor' | 'hata';
export interface Adim {
  ad: string;
  durum: AdimDurum;
  not?: string;
}
export type Eylem = 'konumAyarlari' | 'uygulamaAyarlari';

export interface AramaOzeti {
  adimlar: Adim[];
  ipucu: string;
  eylem?: { tur: Eylem; etiket: string };
  gorulen: number;
  guclu: number;
  yorungeli: number;
  kullanilan: number;
  /** Yörünge bilgisi bu cihazdan okunabiliyor mu (Android 8+) */
  yorungeBiliniyor: boolean;
}

export function sayilar(uydular: Uydu[]) {
  const duyulan = uydular.filter((u) => u.sinyal > 0);
  const guclu = duyulan.filter((u) => u.sinyal >= GUCLU_SINYAL);
  const yorungeBiliniyor = uydular.some((u) => typeof u.yorunge === 'boolean');
  return {
    gorulen: duyulan.length,
    guclu: guclu.length,
    yorungeli: yorungeBiliniyor ? guclu.filter((u) => u.yorunge).length : guclu.length,
    kullanilan: uydular.filter((u) => u.kullanilan).length,
    yorungeBiliniyor,
  };
}

/** Telefonun bildirdiği durumdan (Android uygulaması) aşamaları çıkarır */
export function yerelOzet(d: KonumDurum): AramaOzeti {
  const n = sayilar(d.uydular);
  const sn = d.gecenMs / 1000;
  const adimlar: Adim[] = [];
  let ipucu = '';
  let eylem: AramaOzeti['eylem'];

  // 1. İzin
  if (d.izin === 'yok') {
    adimlar.push({ ad: 'Konum izni', durum: 'hata', not: 'verilmedi' });
    ipucu = 'Uygulamanın konum izni yok. Ayarlardan "Konum" iznini açın, "Tam konum"u seçin.';
    eylem = { tur: 'uygulamaAyarlari', etiket: 'Uygulama izinlerini aç' };
  } else if (d.izin === 'yaklasik') {
    adimlar.push({ ad: 'Konum izni', durum: 'hata', not: 'yalnız yaklaşık' });
    ipucu = 'Yalnız "yaklaşık konum" izni verilmiş; bu izinle GPS uyduları kullanılamaz. Ayarlardan "Tam konum"u açın.';
    eylem = { tur: 'uygulamaAyarlari', etiket: 'Uygulama izinlerini aç' };
  } else adimlar.push({ ad: 'Konum izni', durum: 'tamam' });

  // 2. Konum servisi / GPS
  const izinTamam = d.izin === 'tam';
  if (!d.konumAcik) {
    adimlar.push({ ad: 'Telefonun konum özelliği', durum: 'hata', not: 'kapalı' });
    if (!ipucu) {
      ipucu = 'Telefonun konum özelliği kapalı. Açın; bu bir şey indirmez, internet gerektirmez.';
      eylem = { tur: 'konumAyarlari', etiket: 'Konum ayarlarını aç' };
    }
  } else if (!d.gpsVar) {
    adimlar.push({ ad: 'GPS alıcısı', durum: 'hata', not: 'bu cihazda yok' });
    if (!ipucu) ipucu = 'Bu cihazda GPS alıcısı yok; konum yalnız mobil ağ ya da Wi-Fi ile bulunabilir.';
  } else if (!d.gpsAcik) {
    adimlar.push({ ad: 'GPS', durum: 'hata', not: 'kapalı' });
    if (!ipucu) {
      ipucu = 'Konum açık ama GPS kullanılmıyor. Konum ayarlarında doğruluk/GPS seçeneğini açın.';
      eylem = { tur: 'konumAyarlari', etiket: 'Konum ayarlarını aç' };
    }
  } else adimlar.push({ ad: 'GPS açık', durum: izinTamam ? 'tamam' : 'bekliyor' });

  const engel = adimlar.some((a) => a.durum === 'hata');
  const bulundu = !!d.konum || n.kullanilan >= GEREKEN_UYDU;

  // 3. Uydu görme
  adimlar.push({
    ad: 'Uydular aranıyor',
    durum: engel ? 'bekliyor' : n.gorulen > 0 || bulundu ? 'tamam' : 'suruyor',
    not: n.gorulen > 0 ? `${n.gorulen} uydu duyuluyor` : undefined,
  });
  // 4. Güçlü sinyal + yörünge bilgisi
  const yeterli = n.yorungeli >= GEREKEN_UYDU;
  adimlar.push({
    ad: n.yorungeBiliniyor ? 'Yörünge bilgisi iniyor' : 'Güçlü sinyal toplanıyor',
    durum: engel || (n.gorulen === 0 && !bulundu) ? 'bekliyor' : yeterli || bulundu ? 'tamam' : 'suruyor',
    not: n.gorulen > 0 ? `${Math.min(n.yorungeli, 99)} / ${GEREKEN_UYDU} hazır` : undefined,
  });
  // 5. Hesap
  adimlar.push({
    ad: 'Konum hesaplanıyor',
    durum: bulundu ? 'tamam' : engel || !yeterli ? 'bekliyor' : 'suruyor',
    not: n.kullanilan > 0 ? `${n.kullanilan} uydu kullanılıyor` : undefined,
  });

  if (!ipucu) {
    if (bulundu) ipucu = 'Konum bulundu.';
    else if (n.gorulen === 0)
      ipucu =
        sn < 20
          ? 'Uydular dinleniyor…'
          : 'Hiç uydu duyulmuyor. Bina içindeyseniz pencere kenarına ya da açık alana çıkın; uydu sinyali beton ve metalden geçemez.';
    else if (n.guclu < GEREKEN_UYDU)
      ipucu = `${n.gorulen} uydu duyuluyor ama yalnız ${n.guclu} tanesinin sinyali güçlü. Gökyüzünü daha geniş gören bir yere geçin, telefonun üst kısmını elinizle kapatmayın.`;
    else if (!yeterli)
      ipucu =
        'Sinyal yeterli. Her uydu kendi yörünge bilgisini yaklaşık 30 saniyede bir yayınlar; internetsiz ilk aramada bunun toplanması 1–3 dakika sürer. Yerinizden ayrılmadan bekleyin.';
    else ipucu = 'Uydular hazır, konum hesaplanıyor…';
  }
  return { adimlar, ipucu, eylem, ...n };
}

/** Tarayıcıda uydu bilgisi yok; yalnız geçen süreye göre ne olduğu anlatılır */
export function webOzet(gecenMs: number): AramaOzeti {
  const sn = gecenMs / 1000;
  const adimlar: Adim[] = [
    { ad: 'Konum istendi', durum: 'tamam' },
    { ad: 'Uydular aranıyor', durum: sn < 15 ? 'suruyor' : 'tamam', not: sn < 15 ? undefined : 'tahmini' },
    { ad: 'Yörünge bilgisi iniyor', durum: sn < 15 ? 'bekliyor' : 'suruyor', not: 'internetsiz 1–3 dk' },
    { ad: 'Konum hesaplanıyor', durum: 'bekliyor' },
  ];
  const ipucu =
    sn < 15
      ? 'Telefon GPS uydularını dinliyor…'
      : sn < 180
        ? 'İnternetsiz ilk aramada uyduların yörünge bilgisi gökten yavaşça iner (1–3 dk). Gökyüzünü gören açık bir yerde bekleyin.'
        : 'Uzun sürdü. Telefonun konum özelliğinin açık olduğunu ve uygulamanın konum izni olduğunu denetleyin; açık alanda bekleyin.';
  return { adimlar, ipucu, gorulen: 0, guclu: 0, yorungeli: 0, kullanilan: 0, yorungeBiliniyor: false };
}

/** Sinyal gücüne göre renk sınıfı */
export function sinyalSinifi(db: number): 'yok' | 'zayif' | 'orta' | 'iyi' {
  if (db <= 0) return 'yok';
  if (db < GUCLU_SINYAL) return 'zayif';
  if (db < 30) return 'orta';
  return 'iyi';
}

export function sureYaz(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
