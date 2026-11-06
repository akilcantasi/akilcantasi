import org.akilcantasi.app.EnkazIsareti;
import org.akilcantasi.app.SarsintiDedektoru;
import java.util.Random;

public class Test {
    static int hata = 0;
    static void ok(boolean c, String m) { System.out.println((c ? "OK   " : "HATA ") + m); if (!c) hata++; }

    static long t = 0;
    static Random rnd = new Random(7);
    /** 25 Hz örnekler; döndürdüğü: görülen sonuçlar (SOR=1, HAREKET=2) bit maskesi */
    static int besle(SarsintiDedektoru d, double sn, double[] g, double genlik, double hz, boolean rastgele) {
        int gorulen = 0;
        int adet = (int) (sn * 25);
        for (int i = 0; i < adet; i++) {
            t += 40;
            double ts = t / 1000.0;
            double x = g[0] + rnd.nextGaussian() * 0.03, y = g[1] + rnd.nextGaussian() * 0.03, z = g[2] + rnd.nextGaussian() * 0.03;
            if (genlik > 0) {
                if (rastgele) { x += rnd.nextGaussian() * genlik; y += rnd.nextGaussian() * genlik; z += rnd.nextGaussian() * genlik; }
                else { x += genlik * Math.sin(2 * Math.PI * hz * ts); y += genlik * Math.cos(2 * Math.PI * hz * ts); }
            }
            int r = d.ornek(t, x, y, z);
            if (r != 0) gorulen |= 1 << r;
        }
        return gorulen;
    }

    static void sarsinti() {
        double[] duz = {0, 0, 9.81}, dik = {0, 9.81, 0};
        SarsintiDedektoru d = new SarsintiDedektoru();
        besle(d, 40, duz, 0, 0, false);
        besle(d, 8, duz, 3, 3, false);
        ok(d.asama().equals("SONRASI"), "deprem: titreme algılandı (" + d.asama() + ")");
        int r = besle(d, 130, duz, 0, 0, false);
        ok((r & 2) != 0, "deprem + 2 dk hareketsizlik → sor");
        r = besle(d, 5, duz, 3, 0, true);
        ok((r & 4) != 0, "sorulduktan sonra hareket → iptal");

        SarsintiDedektoru y = new SarsintiDedektoru();
        besle(y, 40, duz, 0, 0, false);
        r = besle(y, 60, dik, 2.5, 2, false) | besle(y, 130, dik, 0, 0, false);
        ok((r & 2) == 0, "telefonu alıp yürüme (yön değişir) sorulmaz");

        SarsintiDedektoru s = new SarsintiDedektoru();
        besle(s, 10, duz, 0, 0, false);
        r = besle(s, 8, duz, 3, 3, false) | besle(s, 130, duz, 0, 0, false);
        ok((r & 2) == 0, "öncesinde 30 sn sakinlik yoksa sorulmaz");

        SarsintiDedektoru k = new SarsintiDedektoru();
        besle(k, 40, duz, 0, 0, false);
        r = besle(k, 2, duz, 3, 3, false) | besle(k, 130, duz, 0, 0, false);
        ok((r & 2) == 0, "2 sn'lik kısa sarsıntı (kapı çarpması) sorulmaz");

        SarsintiDedektoru pd = new SarsintiDedektoru();
        besle(pd, 40, duz, 0, 0, false);
        besle(pd, 5, duz, 0.8, 0, true); // zayıf başlangıç (P dalgası)
        besle(pd, 8, duz, 3, 3, false);
        r = besle(pd, 130, duz, 0, 0, false);
        ok((r & 2) != 0, "zayıf başlangıçtan sonra gelen güçlü sarsıntı da sayılır");

        SarsintiDedektoru dk = new SarsintiDedektoru();
        besle(dk, 40, duz, 0, 0, false);
        besle(dk, 3, duz, 3, 3, false);
        besle(dk, 2, duz, 0.8, 0, true);
        besle(dk, 3, duz, 3, 3, false);
        r = besle(dk, 130, duz, 0, 0, false);
        ok((r & 2) != 0, "kısa duraksamalı sarsıntı sayılır");

        SarsintiDedektoru gc = new SarsintiDedektoru();
        besle(gc, 40, duz, 0, 0, false);
        besle(gc, 30, dik, 1.0, 0, true); // telefon alındı, 30 sn hareket
        r = besle(gc, 8, dik, 3, 3, false) | besle(gc, 130, dik, 0, 0, false);
        ok((r & 2) == 0, "silah 20 sn sonra düşer; yön değişmişken sallama sayılmaz");

        SarsintiDedektoru m = new SarsintiDedektoru();
        besle(m, 40, duz, 0, 0, false);
        besle(m, 8, duz, 3, 3, false);
        r = besle(m, 700, duz, 1.2, 0, true);
        ok((r & 2) == 0 && m.asama().equals("BEKLE"), "sarsıntıdan sonra sürekli hareket (kişi ayakta) → sorulmaz, sıfırlanır");
    }

    /** Kurtarıcı mesajı uyarı sınırı (sahte mesaj yağmuru pili bitirmesin) */
    static void uyariSiniri() {
        org.akilcantasi.app.MesajUyariSiniri u = new org.akilcantasi.app.MesajUyariSiniri();
        long t0 = 1_000_000L;
        ok(u.izinVer(t0, 1), "ilk mesaj uyarır");
        ok(!u.izinVer(t0 + 5_000, 2), "20 sn dolmadan farklı mesaj da uyarmaz");
        ok(u.izinVer(t0 + 20_000, 2), "20 sn sonra yeni mesaj uyarır");
        ok(!u.izinVer(t0 + 45_000, 2), "aynı mesaj 1 dk içinde yeniden duyurulmaz");
        ok(u.izinVer(t0 + 45_000, 3), "farklı mesaj 20 sn sonra uyarır");
        ok(u.izinVer(t0 + 90_000, 2), "aynı mesaj 1 dk sonra yeniden duyurulur");
        // Yağmur: her 1 sn'de farklı kodlu mesaj, 10 dk boyunca → en çok 6 uyarı
        org.akilcantasi.app.MesajUyariSiniri y = new org.akilcantasi.app.MesajUyariSiniri();
        int n = 0;
        for (int i = 0; i < 600; i++) if (y.izinVer(t0 + i * 1000L, i % 13)) n++;
        ok(n == 6, "10 dk'lık sahte mesaj yağmurunda en çok 6 uyarı: " + n);
        // Pencere kayınca yeniden izin
        int m = 0;
        for (int i = 600; i < 1200; i++) if (y.izinVer(t0 + i * 1000L, i % 13)) m++;
        ok(m >= 1 && m <= 6, "sonraki 10 dk'da yine en çok 6: " + m);
        // 10 dk'da 6'dan fazla izin hiçbir pencerede yok (kayan pencere)
        org.akilcantasi.app.MesajUyariSiniri k = new org.akilcantasi.app.MesajUyariSiniri();
        java.util.ArrayList<Long> izinler = new java.util.ArrayList<>();
        for (int i = 0; i < 3600; i++) { long z = t0 + i * 1000L; if (k.izinVer(z, i)) izinler.add(z); }
        boolean kayanOk = true;
        for (int i = 6; i < izinler.size(); i++) if (izinler.get(i) - izinler.get(i - 6) < 600_000L) kayanOk = false;
        ok(kayanOk, "kayan 10 dk pencerede hiçbir zaman 6'dan fazla uyarı (" + izinler.size() + " uyarı / 1 saat)");
        // Saat geri giderse kilitlenmez
        org.akilcantasi.app.MesajUyariSiniri g = new org.akilcantasi.app.MesajUyariSiniri();
        ok(g.izinVer(t0, 1) && g.izinVer(t0 - 500_000, 2), "saat geri giderse sınır sıfırlanır, kilitlenmez");
    }

    public static void main(String[] a) {
        uyariSiniri();
        EnkazIsareti e = new EnkazIsareti();
        e.kimlik = 0x1234ABCD; e.lat = 39.9208; e.lon = 32.8541; e.yasDk = 42; e.pil = 67; e.kat = 3; e.dogruluk = 9; e.guc = 3; e.otomatik = true;
        byte[] b = e.kodla();
        ok(b.length == 24, "uzunluk 24 (3 bayt bayrak + 4 bayt başlıkla 31)");
        EnkazIsareti c = EnkazIsareti.coz(b);
        ok(c != null && c.kimlik == 0x1234ABCD, "kimlik");
        ok(Math.abs(c.lat - 39.9208) < 1e-6 && Math.abs(c.lon - 32.8541) < 1e-6, "konum");
        ok(c.yasDk == 42 && c.pil == 67 && c.kat == 3 && c.guc == 3, "yaş, pil, kat, güç");
        ok(c.dogruluk == 12, "doğruluk 4 m adımla yukarı yuvarlanır: " + c.dogruluk);
        ok(c.enkaz && c.otomatik && c.konumVar(), "bayraklar");

        EnkazIsareti y = new EnkazIsareti();
        y.kimlik = -5; y.kat = -2;
        EnkazIsareti yc = EnkazIsareti.coz(y.kodla());
        ok(!yc.konumVar() && yc.yasDk == -1 && yc.pil == -1 && yc.dogruluk == -1, "bilinmeyenler korunur");
        ok(yc.kat == -2 && yc.kimlik == -5, "eksi kat ve kimlik");
        EnkazIsareti z = new EnkazIsareti();
        ok(EnkazIsareti.coz(z.kodla()).kat == EnkazIsareti.KAT_YOK, "kat yok");
        z.lat = -33.9; z.lon = -151.2; z.yasDk = 999999; z.pil = 140; z.dogruluk = 5000;
        EnkazIsareti zc = EnkazIsareti.coz(z.kodla());
        ok(Math.abs(zc.lat + 33.9) < 1e-6 && Math.abs(zc.lon + 151.2) < 1e-6, "güney/batı yarımküre");
        ok(zc.yasDk == 65534 && zc.pil == 100 && zc.dogruluk == 1016, "sınırlar");

        byte[] bozuk = e.kodla(); bozuk[0] = 'X';
        ok(EnkazIsareti.coz(bozuk) == null, "imza yanlışsa null");
        byte[] surum = e.kodla(); surum[2] = (byte) 0x21;
        ok(EnkazIsareti.coz(surum) == null, "bilinmeyen sürüm null");
        ok(EnkazIsareti.coz(new byte[5]) == null, "kısa veri null");

        // Mesajlaşma alanları ve eski 21 baytlık işaret
        e.onay = 7; e.yanit = 3; e.yanitSayac = 200;
        EnkazIsareti m = EnkazIsareti.coz(e.kodla());
        ok(m.onay == 7 && m.yanit == 3 && m.yanitSayac == 200, "onay ve yanıt");
        byte[] eski = java.util.Arrays.copyOf(e.kodla(), 21);
        EnkazIsareti ec = EnkazIsareti.coz(eski);
        ok(ec != null && ec.kimlik == e.kimlik && ec.onay == 0 && ec.yanit == 0, "eski 21 baytlık işaret okunur");
        byte[] msj = EnkazIsareti.mesajKodla(0x1234ABCD, 255, 4);
        int[] mc = EnkazIsareti.mesajCoz(msj);
        ok(mc != null && mc[0] == 0x1234ABCD && mc[1] == 255 && mc[2] == 4, "kurtarıcı mesajı");
        ok(EnkazIsareti.coz(msj) == null && EnkazIsareti.mesajCoz(e.kodla()) == null, "mesaj ve işaret karışmaz");
        ok(EnkazIsareti.kod(0x1234ABCD).equals("AK-34ABCD") && EnkazIsareti.kod(-1).equals("AK-FFFFFF"), "işaret kodu");

        String uzun = "Ayşe Yılmaz · B blok 3. kat daire 12 arka cephe";
        byte[] t = EnkazIsareti.etiketKodla(uzun);
        ok(t.length <= 3 + EnkazIsareti.ETIKET_BAYT, "etiket sınırı");
        String g = EnkazIsareti.etiketCoz(t);
        ok(uzun.startsWith(g) && !g.contains("�"), "etiket UTF-8 ortadan bölünmez: " + g);
        ok("Mehmet".equals(EnkazIsareti.etiketCoz(EnkazIsareti.etiketKodla(" Mehmet "))), "kısa etiket");
        ok(EnkazIsareti.etiketCoz(e.kodla()) == null, "işaret etiket sanılmaz");
        // Başkasının yayınladığı etiket güvenilmez: denetim/yön karakterleri atılır, uzunluk sınırlı
        byte[] kotu = ("AK\u0002Ay‮şe\u0007​ · 3. kat").getBytes(java.nio.charset.StandardCharsets.UTF_8);
        kotu[2] = 2;
        ok("Ayşe · 3. kat".equals(EnkazIsareti.etiketCoz(kotu)), "sahte etiketteki yön/denetim karakterleri atılır: " + EnkazIsareti.etiketCoz(kotu));
        byte[] cokUzun = new byte[3 + 240];
        cokUzun[0] = 'A'; cokUzun[1] = 'K'; cokUzun[2] = 2;
        java.util.Arrays.fill(cokUzun, 3, cokUzun.length, (byte) 'x');
        ok(EnkazIsareti.etiketCoz(cokUzun).length() == 40, "uzun (genişletilmiş reklam) etiketi 40 karakterle sınırlı");

        // Ham reklam: bayraklar + işaret (0xFFFF) + tarama yanıtı etiketi (0xFFFF) + sondaki sıfırlar
        java.io.ByteArrayOutputStream ham = new java.io.ByteArrayOutputStream();
        ham.write(new byte[] {2, 1, 6}, 0, 3);
        byte[] is = e.kodla();
        ham.write(is.length + 3); ham.write(0xFF); ham.write(0xFF); ham.write(0xFF); ham.write(is, 0, is.length);
        byte[] et = EnkazIsareti.etiketKodla("Ayşe · 3. kat");
        ham.write(et.length + 3); ham.write(0xFF); ham.write(0xFF); ham.write(0xFF); ham.write(et, 0, et.length);
        ham.write(new byte[6], 0, 6);
        byte[][] ay = EnkazIsareti.hamdanAyikla(ham.toByteArray(), EnkazIsareti.SIRKET);
        ok(ay[0] != null && EnkazIsareti.coz(ay[0]).kimlik == e.kimlik, "hamdan işaret");
        ok("Ayşe · 3. kat".equals(EnkazIsareti.etiketCoz(ay[1])), "hamdan etiket");
        java.io.ByteArrayOutputStream h2 = new java.io.ByteArrayOutputStream();
        h2.write(new byte[] {2, 1, 6}, 0, 3);
        byte[] ms = EnkazIsareti.mesajKodla(5, 1, 2);
        h2.write(ms.length + 3); h2.write(0xFF); h2.write(0xFF); h2.write(0xFF); h2.write(ms, 0, ms.length);
        byte[][] ay2 = EnkazIsareti.hamdanAyikla(h2.toByteArray(), EnkazIsareti.SIRKET);
        ok(ay2[0] == null && ay2[2] != null && EnkazIsareti.mesajCoz(ay2[2])[0] == 5, "hamdan kurtarıcı mesajı");
        byte[] baska = {5, (byte) 0xFF, 0x4C, 0x00, 'A', 'K'};
        ok(EnkazIsareti.hamdanAyikla(baska, EnkazIsareti.SIRKET)[0] == null, "başka şirket kimliği yok sayılır");
        byte[] kesik = {30, (byte) 0xFF, (byte) 0xFF, (byte) 0xFF, 'A', 'K', 0x11};
        ok(EnkazIsareti.hamdanAyikla(kesik, EnkazIsareti.SIRKET)[0] == null, "kesik veri taşmaz");

        sarsinti();
        hata += org.akilcantasi.app.MeshSinama.calistir();
        System.out.println(hata == 0 ? "Hepsi geçti" : hata + " HATA");
        System.exit(hata == 0 ? 0 : 1);
    }
}
