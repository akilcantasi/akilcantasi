package org.akilcantasi.app;

/**
 * Kurtarıcı mesajı uyarılarının (titreşim, uyarı sesi, sesli okuma) sıklık sınırı.
 *
 * Mesajlar Bluetooth üzerinden imzasız gelir; yakındaki biri sahte mesaj yağdırarak enkaz
 * altındaki kişinin telefonunu sürekli titretip konuşturabilir ve pilini bitirebilir. Bu yüzden:
 *  • iki uyarı arasında en az {@link #EN_AZ_ARALIK_MS} (20 sn);
 *  • aynı mesaj (aynı kod) {@link #AYNI_MESAJ_MS} (1 dk) içinde yeniden duyurulmaz;
 *  • {@link #PENCERE_MS} (10 dk) içinde en çok {@link #PENCERE_SINIR} uyarı.
 * Sınır yalnız uyarıları keser: yeni mesajlar yine kaydedilir ve ekranda/bildirimde (sessiz) görünür.
 *
 * Android'e bağımlı değildir; tools/enkaz-sinama ile masaüstünde sınanır. Tek iş parçacığından
 * (servisin ana iş parçacığı) çağrılır.
 */
public final class MesajUyariSiniri {

    static final long EN_AZ_ARALIK_MS = 20_000L;
    static final long AYNI_MESAJ_MS = 60_000L;
    static final long PENCERE_MS = 10 * 60_000L;
    static final int PENCERE_SINIR = 6;

    /** Son uyarıların zamanları (halka) */
    private final long[] zamanlar = new long[PENCERE_SINIR];
    private int adet = 0;
    private int bas = 0;
    private long sonUyari = Long.MIN_VALUE;
    private int sonKod = Integer.MIN_VALUE;
    private long sonKodZaman = Long.MIN_VALUE;

    /**
     * Bu mesaj için uyarı verilsin mi? true dönerse uyarı verilmiş sayılır (sayaçlar ilerler).
     * Saat geri giderse (kullanıcı saati değiştirdi) sınır sıfırlanır; kilitlenip kalmaz.
     */
    public boolean izinVer(long simdi, int kod) {
        if (sonUyari != Long.MIN_VALUE && simdi < sonUyari) sifirla();
        // Aynı mesaj kısa sürede yeniden: sessiz (bu duyuluş da süreyi uzatmaz)
        if (kod == sonKod && sonKodZaman != Long.MIN_VALUE && simdi - sonKodZaman < AYNI_MESAJ_MS) return false;
        if (sonUyari != Long.MIN_VALUE && simdi - sonUyari < EN_AZ_ARALIK_MS) return false;
        // Pencere dışına çıkanlar atılır
        while (adet > 0 && simdi - zamanlar[bas] >= PENCERE_MS) {
            bas = (bas + 1) % PENCERE_SINIR;
            adet--;
        }
        if (adet >= PENCERE_SINIR) return false;
        zamanlar[(bas + adet) % PENCERE_SINIR] = simdi;
        adet++;
        sonUyari = simdi;
        sonKod = kod;
        sonKodZaman = simdi;
        return true;
    }

    public void sifirla() {
        adet = 0;
        bas = 0;
        sonUyari = Long.MIN_VALUE;
        sonKod = Integer.MIN_VALUE;
        sonKodZaman = Long.MIN_VALUE;
    }
}
