package org.akilcantasi.app;

import java.nio.charset.StandardCharsets;

/**
 * Enkaz işaretinin Bluetooth (BLE) reklam içeriği: kodlama ve çözme.
 * Android'e bağımlı değildir; tools/enkaz-sinama ile bilgisayarda sınanır.
 *
 * Üretici verisi (şirket kimliği 0xFFFF: Bluetooth SIG'in deneme/iç kullanım değeri):
 *
 *   bayt  0-1   'A' 'K'                  imza
 *   bayt  2     sürüm(üst 4 bit) | bayraklar(alt 4 bit)
 *                 bit0 enkaz modu açık, bit1 konum var, bit2 otomatik açıldı (sarsıntı)
 *   bayt  3-6   kimlik (int, rastgele; cihaz başına sabit)
 *   bayt  7-10  enlem  × 1e7 (int)
 *   bayt 11-14  boylam × 1e7 (int)
 *   bayt 15-16  konumun yaşı, dakika (0xFFFF: bilinmiyor; 65534'te sınırlanır)
 *   bayt 17     pil yüzdesi (0xFF: bilinmiyor)
 *   bayt 18     kat (işaretli; -128: bilinmiyor)
 *   bayt 19     konum doğruluğu / 4 m (0xFF: 1 km ve üstü ya da bilinmiyor)
 *   bayt 20     yayın gücü düzeyi (0 çok düşük … 3 yüksek)
 *   bayt 21     son alınan kurtarıcı mesajının numarası (onay; 0: yok)
 *   bayt 22     enkazdaki kişinin hazır yanıtı (Mesajlar.YANITLAR; 0: yok)
 *   bayt 23     yanıt sayacı (aynı yanıt yeniden verildiğinde artar)
 *   = 24 bayt (Android'in eklediği 3 baytlık bayraklar + 4 bayt başlıkla tam 31 bayt).
 *   Eski 21 baytlık işaretler de okunur (son üç alan 0 sayılır).
 *
 * Tarama yanıtı (aynı şirket kimliği): 'A' 'K' 0x02 + UTF-8 etiket (en çok ETIKET_BAYT bayt),
 * örn. "Ayşe · B blok 3. kat".
 *
 * Kurtarıcı mesajı (kurtarıcının telefonu yayar): 'A' 'K' 0x03 + hedef kimlik (4) + mesaj
 * numarası (1, 1–255 döner) + hazır mesaj kodu (1; Mesajlar.MESAJLAR) = 9 bayt.
 */
public final class EnkazIsareti {

    public static final int SIRKET = 0xFFFF;
    public static final int SURUM = 1;
    public static final int UZUNLUK = 24;
    static final int ESKI_UZUNLUK = 21;
    public static final int ETIKET_BAYT = 24;
    public static final int KAT_YOK = -128;

    public boolean enkaz = true;
    public boolean otomatik = false;
    public int kimlik;
    /** NaN: konum yok */
    public double lat = Double.NaN, lon = Double.NaN;
    /** -1: bilinmiyor */
    public int yasDk = -1;
    public int pil = -1;
    public int kat = KAT_YOK;
    /** metre; -1 bilinmiyor */
    public int dogruluk = -1;
    public int guc = 3;
    /** Onaylanan son kurtarıcı mesajı (0: yok) */
    public int onay = 0;
    /** Hazır yanıt kodu (0: yok) ve sayacı */
    public int yanit = 0, yanitSayac = 0;

    public boolean konumVar() {
        return !Double.isNaN(lat) && !Double.isNaN(lon);
    }

    public byte[] kodla() {
        byte[] b = new byte[UZUNLUK];
        b[0] = 'A';
        b[1] = 'K';
        int bayrak = (enkaz ? 1 : 0) | (konumVar() ? 2 : 0) | (otomatik ? 4 : 0);
        b[2] = (byte) ((SURUM << 4) | bayrak);
        int32(b, 3, kimlik);
        int32(b, 7, konumVar() ? (int) Math.round(lat * 1e7) : 0);
        int32(b, 11, konumVar() ? (int) Math.round(lon * 1e7) : 0);
        int yas = yasDk < 0 ? 0xFFFF : Math.min(yasDk, 0xFFFE);
        b[15] = (byte) (yas >> 8);
        b[16] = (byte) yas;
        b[17] = (byte) (pil < 0 ? 0xFF : Math.min(pil, 100));
        b[18] = (byte) (kat == KAT_YOK ? KAT_YOK : Math.max(-127, Math.min(127, kat)));
        b[19] = (byte) (dogruluk < 0 ? 0xFF : Math.min(254, (dogruluk + 3) / 4));
        b[20] = (byte) Math.max(0, Math.min(3, guc));
        b[21] = (byte) onay;
        b[22] = (byte) yanit;
        b[23] = (byte) yanitSayac;
        return b;
    }

    /** Geçersizse null */
    public static EnkazIsareti coz(byte[] b) {
        if (b == null || b.length < ESKI_UZUNLUK || b[0] != 'A' || b[1] != 'K') return null;
        int surum = (b[2] & 0xFF) >> 4;
        if (surum != SURUM) return null;
        EnkazIsareti e = new EnkazIsareti();
        int bayrak = b[2] & 0x0F;
        e.enkaz = (bayrak & 1) != 0;
        e.otomatik = (bayrak & 4) != 0;
        e.kimlik = int32(b, 3);
        if ((bayrak & 2) != 0) {
            e.lat = int32(b, 7) / 1e7;
            e.lon = int32(b, 11) / 1e7;
            if (Math.abs(e.lat) > 90 || Math.abs(e.lon) > 180) {
                e.lat = Double.NaN;
                e.lon = Double.NaN;
            }
        }
        int yas = ((b[15] & 0xFF) << 8) | (b[16] & 0xFF);
        e.yasDk = yas == 0xFFFF ? -1 : yas;
        int pil = b[17] & 0xFF;
        e.pil = pil == 0xFF ? -1 : Math.min(pil, 100);
        e.kat = b[18];
        int d = b[19] & 0xFF;
        e.dogruluk = d == 0xFF ? -1 : d * 4;
        e.guc = b[20] & 0x03;
        if (b.length >= UZUNLUK) {
            e.onay = b[21] & 0xFF;
            e.yanit = b[22] & 0xFF;
            e.yanitSayac = b[23] & 0xFF;
        }
        return e;
    }

    /** Tarama yanıtı: etiket UTF-8'de karakter ortasından bölünmeden kısaltılır */
    public static byte[] etiketKodla(String etiket) {
        byte[] t = kisalt(etiket == null ? "" : etiket.trim(), ETIKET_BAYT);
        byte[] b = new byte[3 + t.length];
        b[0] = 'A';
        b[1] = 'K';
        b[2] = 2;
        System.arraycopy(t, 0, b, 3, t.length);
        return b;
    }

    public static String etiketCoz(byte[] b) {
        if (b == null || b.length < 3 || b[0] != 'A' || b[1] != 'K' || b[2] != 2) return null;
        return new String(b, 3, b.length - 3, StandardCharsets.UTF_8);
    }

    /** Kurtarıcı mesajı: hedef kimlik, numara, kod */
    public static byte[] mesajKodla(int hedef, int no, int kod) {
        byte[] b = new byte[9];
        b[0] = 'A';
        b[1] = 'K';
        b[2] = 3;
        int32(b, 3, hedef);
        b[7] = (byte) no;
        b[8] = (byte) kod;
        return b;
    }

    /** [hedef, numara, kod] ya da null */
    public static int[] mesajCoz(byte[] b) {
        if (b == null || b.length < 9 || b[0] != 'A' || b[1] != 'K' || b[2] != 3) return null;
        return new int[] { int32(b, 3), b[7] & 0xFF, b[8] & 0xFF };
    }

    /** Ekranda ve SMS'te görünen kısa kod: kimliğin son 24 biti, "AK-3F2A9C" */
    public static String kod(int kimlik) {
        return String.format("AK-%06X", kimlik & 0xFFFFFF);
    }

    /**
     * Ham reklam + tarama yanıtı baytlarından (ScanRecord.getBytes) bu şirket kimliğine ait tüm
     * üretici verilerini çıkarır. Android'in ayrıştırılmış kaydı aynı kimlikli iki veriden yalnız
     * birini tuttuğu için işaret ve etiket ham baytlardan okunur.
     * Dönen dizi: [işaret, etiket, kurtarıcı mesajı] (olmayan null)
     */
    public static byte[][] hamdanAyikla(byte[] ham, int sirket) {
        byte[][] r = new byte[3][];
        if (ham == null) return r;
        int i = 0;
        while (i < ham.length) {
            int uz = ham[i] & 0xFF;
            if (uz == 0 || i + uz >= ham.length) break; // yapı ham[i..i+uz] aralığında olmalı
            int tur = ham[i + 1] & 0xFF;
            if (tur == 0xFF && uz >= 3) {
                int sk = (ham[i + 2] & 0xFF) | ((ham[i + 3] & 0xFF) << 8);
                if (sk == sirket) {
                    byte[] v = new byte[uz - 3];
                    System.arraycopy(ham, i + 4, v, 0, v.length);
                    if (v.length >= 3 && v[0] == 'A' && v[1] == 'K') {
                        if (v[2] == 2) r[1] = v;
                        else if (v[2] == 3) r[2] = v;
                        else r[0] = v;
                    }
                }
            }
            i += uz + 1;
        }
        return r;
    }

    static byte[] kisalt(String s, int max) {
        byte[] t = s.getBytes(StandardCharsets.UTF_8);
        if (t.length <= max) return t;
        int n = max;
        // UTF-8 devam baytı (10xxxxxx) ise geri git
        while (n > 0 && (t[n] & 0xC0) == 0x80) n--;
        byte[] r = new byte[n];
        System.arraycopy(t, 0, r, 0, n);
        return r;
    }

    private static void int32(byte[] b, int i, int v) {
        b[i] = (byte) (v >> 24);
        b[i + 1] = (byte) (v >> 16);
        b[i + 2] = (byte) (v >> 8);
        b[i + 3] = (byte) v;
    }

    private static int int32(byte[] b, int i) {
        return ((b[i] & 0xFF) << 24) | ((b[i + 1] & 0xFF) << 16) | ((b[i + 2] & 0xFF) << 8) | (b[i + 3] & 0xFF);
    }
}
