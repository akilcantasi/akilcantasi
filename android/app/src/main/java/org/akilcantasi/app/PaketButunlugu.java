package org.akilcantasi.app;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.RandomAccessFile;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Paket dosyalarının bütünlük kaydı (Android'e bağımlı değildir; tools/indirici-sinama sınar).
 *
 * Android 7–10'da paket klasörü (Android/data/org.akilcantasi.app/files/packs) depolama izni olan
 * başka uygulamalarca yazılabilir. Bu yüzden indirme bitince her paketin boyutu, değiştirilme zamanı
 * ve kısmi SHA-256'sı (ilk ve son 4 MB) uygulamanın iç deposunda (getFilesDir, başka uygulama
 * okuyamaz/yazamaz) saklanır. Model yerel motora verilmeden önce bu bilgiler yeniden denetlenir;
 * tutmazsa model açılmaz.
 *
 * Kaydı olmayan dosyalar (bu sürümden önce indirilmiş paketler) eskisi gibi açılır ve ilk başarılı
 * açılışta kaydedilir; böylece kullanıcıdaki paketler bozulmaz.
 */
public final class PaketButunlugu {

    public enum Durum { KAYIT_YOK, TAMAM, DEGISMIS }

    /** Arayüzde gösterilen ileti (src/lib/fener/engine.ts nativeErrorText bu metni tanır) */
    public static final String MODEL_DEGISMIS = "Model dosyası değişmiş görünüyor; yeniden indirin";

    static final int UC_BAYT = 4 * 1024 * 1024;
    static final String KAYIT_DOSYASI = "paket-butunlugu.properties";
    private static final Object KILIT = new Object();
    private static final Pattern PARCA = Pattern.compile("^(.+)-(\\d{5})-of-(\\d{5})\\.gguf$", Pattern.CASE_INSENSITIVE);

    private final File kayitDosyasi;

    /** icKlasor: uygulamanın iç deposu (Context.getFilesDir()) */
    public PaketButunlugu(File icKlasor) {
        this.kayitDosyasi = new File(icKlasor, KAYIT_DOSYASI);
    }

    static final class Kayit {
        final long boyut;
        final long zaman;
        final String kismi;
        final String sha256;

        Kayit(long boyut, long zaman, String kismi, String sha256) {
            this.boyut = boyut;
            this.zaman = zaman;
            this.kismi = kismi;
            this.sha256 = sha256 == null || sha256.isEmpty() ? null : sha256;
        }

        String yaz() {
            return boyut + ";" + zaman + ";" + kismi + ";" + (sha256 == null ? "" : sha256);
        }

        static Kayit oku(String s) {
            if (s == null) return null;
            String[] p = s.split(";", -1);
            if (p.length < 3) return null;
            try {
                return new Kayit(Long.parseLong(p[0]), Long.parseLong(p[1]), p[2], p.length > 3 ? p[3] : null);
            } catch (NumberFormatException e) {
                return null;
            }
        }
    }

    // ---- kayıt dosyası --------------------------------------------------------------------

    private Properties yukle() {
        Properties p = new Properties();
        if (!kayitDosyasi.isFile()) return p;
        try (FileInputStream in = new FileInputStream(kayitDosyasi)) {
            p.load(in);
        } catch (Exception ignored) {
            // Bozuk kayıt: boş sayılır (paketler "kayıtsız" gibi açılır, yeniden kaydedilir)
        }
        return p;
    }

    private void kaydetDosya(Properties p) throws IOException {
        File dir = kayitDosyasi.getParentFile();
        if (dir != null && !dir.exists()) dir.mkdirs();
        File tmp = new File(kayitDosyasi.getPath() + ".tmp");
        try (FileOutputStream o = new FileOutputStream(tmp)) {
            p.store(o, "Akil Cantasi paket butunlugu");
            o.getFD().sync();
        }
        if (!tmp.renameTo(kayitDosyasi)) {
            kayitDosyasi.delete();
            if (!tmp.renameTo(kayitDosyasi)) throw new IOException("bütünlük kaydı yazılamadı");
        }
    }

    // ---- işlemler ---------------------------------------------------------------------------

    /**
     * Dosyanın şimdiki hâlini kaydeder. tamSha256: indirmede doğrulanmış tam özet (bilinmiyorsa null);
     * yalnız değiştirilme zamanı kaydıyla tutmadığında dosyanın gerçekten aynı olduğunu anlamak için kullanılır.
     */
    public void kaydet(File f, String tamSha256) throws IOException {
        String kismi = kismiOzet(f);
        Kayit k = new Kayit(f.length(), f.lastModified(), kismi, tamSha256 == null ? null : tamSha256.toLowerCase(Locale.ROOT));
        synchronized (KILIT) {
            Properties p = yukle();
            p.setProperty(f.getName(), k.yaz());
            kaydetDosya(p);
        }
    }

    public void sil(String ad) {
        synchronized (KILIT) {
            Properties p = yukle();
            if (p.remove(ad) == null) return;
            try { kaydetDosya(p); } catch (IOException ignored) {}
        }
    }

    /** Paket klasöründe artık olmayan dosyaların kayıtlarını siler (silinip yeniden konan dosya eski kayda takılmasın) */
    public void temizle(File paketKlasoru) {
        synchronized (KILIT) {
            Properties p = yukle();
            boolean degisti = false;
            for (String ad : new ArrayList<>(p.stringPropertyNames())) {
                if (!new File(paketKlasoru, ad).isFile()) {
                    p.remove(ad);
                    degisti = true;
                }
            }
            if (degisti) try { kaydetDosya(p); } catch (IOException ignored) {}
        }
    }

    boolean kayitVar(String ad) {
        synchronized (KILIT) {
            return yukle().getProperty(ad) != null;
        }
    }

    /**
     * Dosyayı kayıtla karşılaştırır. Boyut ya da kısmi özet farklıysa DEGISMIS. Yalnız değiştirilme
     * zamanı farklıysa (aynı dosyanın yeniden kopyalanması, yedekten geri yükleme):
     * tam özet biliniyorsa dosyanın tamamı yeniden özetlenir, tutmazsa DEGISMIS; tam özet
     * bilinmiyorsa (elle konan model, özetsiz katalog paketi) boyut ve kısmi özetin tutması yeter.
     * Kabul edilince kayıttaki zaman güncellenir.
     */
    public Durum denetle(File f) throws IOException {
        Kayit k;
        synchronized (KILIT) {
            k = Kayit.oku(yukle().getProperty(f.getName()));
        }
        if (k == null) return Durum.KAYIT_YOK;
        if (!f.isFile() || f.length() != k.boyut) return Durum.DEGISMIS;
        if (!kismiOzet(f).equals(k.kismi)) return Durum.DEGISMIS;
        if (f.lastModified() == k.zaman) return Durum.TAMAM;
        if (k.sha256 != null && !k.sha256.equals(tamOzet(f))) return Durum.DEGISMIS;
        kaydet(f, k.sha256);
        return Durum.TAMAM;
    }

    /**
     * Yerel motora verilecek modelin bütün parçalarını denetler. Değişmiş parça varsa
     * IOException(MODEL_DEGISMIS). Döner: kaydı olmayan parçalar (açılış başarılı olunca kaydedilir).
     */
    public List<File> modelDenetle(File ilkParca) throws IOException {
        List<File> kayitsiz = new ArrayList<>();
        for (File p : modelParcalari(ilkParca)) {
            Durum d = denetle(p);
            if (d == Durum.DEGISMIS) throw new IOException(MODEL_DEGISMIS);
            if (d == Durum.KAYIT_YOK) kayitsiz.add(p);
        }
        return kayitsiz;
    }

    /** Kaydı olmayan dosyaları kaydeder (hata yutulur: kayıt yazılamasa da model açılmıştır) */
    public void kayitsizlariKaydet(List<File> dosyalar) {
        for (File f : dosyalar) {
            try {
                if (!kayitVar(f.getName())) kaydet(f, null);
            } catch (Exception ignored) {}
        }
    }

    /**
     * Bölünmüş GGUF (ad-00001-of-00003.gguf) ise yerel motorun açacağı bütün parçalar (var olanlar);
     * değilse yalnız dosyanın kendisi.
     */
    public static List<File> modelParcalari(File ilk) {
        List<File> out = new ArrayList<>();
        out.add(ilk);
        Matcher m = PARCA.matcher(ilk.getName());
        if (!m.matches()) return out;
        int toplam;
        try {
            toplam = Integer.parseInt(m.group(3));
        } catch (NumberFormatException e) {
            return out;
        }
        if (toplam < 2 || toplam > 999) return out;
        File dir = ilk.getAbsoluteFile().getParentFile();
        for (int i = 1; i <= toplam; i++) {
            File p = new File(dir, String.format(Locale.ROOT, "%s-%05d-of-%05d.gguf", m.group(1), i, toplam));
            if (p.getName().equals(ilk.getName())) continue;
            if (p.isFile()) out.add(p);
        }
        return out;
    }

    // ---- özetler -------------------------------------------------------------------------

    /** İlk 4 MB ile son 4 MB'ın (dosya 8 MB'tan küçükse tamamının) SHA-256'sı */
    static String kismiOzet(File f) throws IOException {
        try (RandomAccessFile raf = new RandomAccessFile(f, "r")) {
            MessageDigest md = sha();
            long boyut = raf.length();
            byte[] buf = new byte[256 * 1024];
            long basSon = Math.min(boyut, UC_BAYT);
            oku(raf, md, buf, 0, basSon);
            long sonBas = Math.max(basSon, boyut - UC_BAYT);
            oku(raf, md, buf, sonBas, boyut);
            return hex(md.digest());
        }
    }

    static String tamOzet(File f) throws IOException {
        try (RandomAccessFile raf = new RandomAccessFile(f, "r")) {
            MessageDigest md = sha();
            oku(raf, md, new byte[1024 * 1024], 0, raf.length());
            return hex(md.digest());
        }
    }

    private static void oku(RandomAccessFile raf, MessageDigest md, byte[] buf, long bas, long son) throws IOException {
        raf.seek(bas);
        long kalan = son - bas;
        while (kalan > 0) {
            int n = raf.read(buf, 0, (int) Math.min(buf.length, kalan));
            if (n < 0) throw new IOException("dosya beklenenden kısa");
            md.update(buf, 0, n);
            kalan -= n;
        }
    }

    private static MessageDigest sha() throws IOException {
        try {
            return MessageDigest.getInstance("SHA-256");
        } catch (Exception e) {
            throw new IOException("SHA-256 yok");
        }
    }

    private static String hex(byte[] d) {
        StringBuilder sb = new StringBuilder(d.length * 2);
        for (byte b : d) sb.append(String.format(Locale.ROOT, "%02x", b));
        return sb.toString();
    }
}
