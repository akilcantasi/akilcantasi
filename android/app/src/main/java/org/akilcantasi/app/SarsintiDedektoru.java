package org.akilcantasi.app;

/**
 * Sarsıntı ölçütü (Android'e bağımlı değil; tools/enkaz-sinama ile sınanır).
 *
 * İvmeölçer örnekleri saniyelik dilimlere toplanır. Bir dilim:
 *   sakin   : örneklerin %90'ında yerçekimi dışı ivme < 0,35 m/s²
 *   titrek  : örneklerin %50'sinde > 1,5 m/s²
 * Aşamalar:
 *   1. Silahlanma: en az 30 sn kesintisiz sakin (telefon masada/cepte duruyor). Silah
 *      sonraki 20 sn boyunca sürer: depremin zayıf başlangıcı (P dalgası) güçlü sarsıntıdan
 *      önce sakinliği bozsa da sayılır.
 *   2. Titreme: telefonun yönü sakin dönemdekinden 25°'den az sapmışken en az 4 titrek saniye
 *      (araya en çok 2 saniye boşluk). Telefonu elle alıp yürümek yönü değiştirir; sayılmaz.
 *   3. Sonrası: 10 dakika içinde 2 dakika kesintisiz sakinlik → SOR.
 *   4. Soruldu: belirgin hareket (art arda 3 hareketli saniye ya da yönün 30°'den çok değişmesi) → HAREKET.
 */
public final class SarsintiDedektoru {

    public static final int YOK = 0, SOR = 1, HAREKET = 2;

    static final double SAKIN = 0.35, GUCLU = 1.5;
    static final int SILAH_SN = 30, SILAH_SURE_SN = 20, TITREME_SN = 4, SONRA_SAKIN_SN = 120, SONRA_EN_COK_SN = 600;
    static final double YON_SAPMA = 25, YON_HAREKET = 30;

    private enum Asama { BEKLE, TITREME, SONRASI, SORULDU }

    private Asama asama = Asama.BEKLE;
    private double gx, gy, gz;
    private boolean gHazir;
    private long dilimBas = -1;
    private int n, guclu, sakin;
    private int sakinSn, titrekSn, bosluk, sonraSn, hareketSn, silahKalan;
    private double[] ref;
    private double[] sorulduYon;

    public void sifirla() {
        asama = Asama.BEKLE;
        sakinSn = titrekSn = bosluk = sonraSn = hareketSn = silahKalan = 0;
        ref = null;
        sorulduYon = null;
    }

    public String asama() {
        return asama.name();
    }

    /** t: ms; değerler m/s². Saniye dilimi kapanınca sonuç döner, yoksa YOK. */
    public int ornek(long t, double x, double y, double z) {
        if (!gHazir) {
            gx = x;
            gy = y;
            gz = z;
            gHazir = true;
        } else {
            gx = 0.92 * gx + 0.08 * x;
            gy = 0.92 * gy + 0.08 * y;
            gz = 0.92 * gz + 0.08 * z;
        }
        double lin = Math.sqrt((x - gx) * (x - gx) + (y - gy) * (y - gy) + (z - gz) * (z - gz));
        if (dilimBas < 0) dilimBas = t;
        int sonuc = YOK;
        if (t - dilimBas >= 1000) {
            sonuc = dilimKapat();
            dilimBas = t;
            n = guclu = sakin = 0;
        }
        n++;
        if (lin > GUCLU) guclu++;
        if (lin < SAKIN) sakin++;
        return sonuc;
    }

    private int dilimKapat() {
        if (n == 0) return YOK;
        boolean sakinD = sakin >= 0.9 * n;
        boolean titrekD = guclu >= 0.5 * n;
        boolean hareketD = !sakinD && guclu >= 0.2 * n;
        double[] g = { gx, gy, gz };
        switch (asama) {
            case BEKLE:
                if (sakinD) {
                    sakinSn++;
                    ref = g;
                    if (sakinSn >= SILAH_SN) silahKalan = SILAH_SURE_SN;
                    return YOK;
                }
                sakinSn = 0;
                if (titrekD && silahKalan > 0 && ref != null && aci(ref, g) < YON_SAPMA) {
                    asama = Asama.TITREME;
                    titrekSn = 1;
                    bosluk = 0;
                } else if (silahKalan > 0) silahKalan--;
                return YOK;
            case TITREME:
                if (titrekD && aci(ref, g) < YON_SAPMA) {
                    titrekSn++;
                    bosluk = 0;
                    if (titrekSn >= TITREME_SN) {
                        asama = Asama.SONRASI;
                        sonraSn = 0;
                        sakinSn = 0;
                    }
                } else if (++bosluk > 2 || aci(ref, g) >= YON_SAPMA) {
                    // Silah süresi korunur: kısa bir duraksamadan sonra sarsıntı yeniden başlayabilir
                    asama = Asama.BEKLE;
                    sakinSn = 0;
                }
                return YOK;
            case SONRASI:
                sonraSn++;
                sakinSn = sakinD ? sakinSn + 1 : 0;
                if (sakinSn >= SONRA_SAKIN_SN) {
                    asama = Asama.SORULDU;
                    sorulduYon = g;
                    hareketSn = 0;
                    return SOR;
                }
                if (sonraSn > SONRA_EN_COK_SN) sifirla();
                return YOK;
            case SORULDU:
                hareketSn = hareketD ? hareketSn + 1 : 0;
                if (hareketSn >= 3 || aci(sorulduYon, g) > YON_HAREKET) {
                    sifirla();
                    return HAREKET;
                }
                return YOK;
        }
        return YOK;
    }

    static double aci(double[] a, double[] b) {
        double na = Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
        double nb = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
        if (na == 0 || nb == 0) return 180;
        double c = (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / (na * nb);
        return Math.toDegrees(Math.acos(Math.max(-1, Math.min(1, c))));
    }
}
