import com.sun.net.httpserver.*;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.*;
import java.security.MessageDigest;
import java.util.*;
import org.akilcantasi.app.PaketIndirici;
import org.akilcantasi.app.SinamaErisim;

public class Test {
  static byte[] data;
  static volatile int delayMs = 0;
  static int hits = 0; static java.util.concurrent.atomic.AtomicLong served = new java.util.concurrent.atomic.AtomicLong();
  static String hex(byte[] d) { StringBuilder b = new StringBuilder(); for (byte x : d) b.append(String.format("%02x", x)); return b.toString(); }
  static void check(boolean c, String m) { if (!c) { System.out.println("HATA: " + m); System.exit(1); } System.out.println("OK  " + m); }
  static String status(PaketIndirici d, String f) throws Exception {
    String js = d.jobsJson().toString(); int i = js.indexOf("\"file\":\"" + f + "\""); if (i < 0) return "none";
    int s = js.indexOf("\"status\":\"", i) + 10; return js.substring(s, js.indexOf('"', s));
  }
  public static void main(String[] a) throws Exception {
    data = new byte[70 * 1024 * 1024]; new Random(1).nextBytes(data);
    String sha = hex(MessageDigest.getInstance("SHA-256").digest(data));
    // HTTPS: indirici yalnız https + izinli alan adına gider (calistir.sh: hosts dosyası, sertifika)
    HttpsServer srv = HttpsServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
    java.security.KeyStore ks = java.security.KeyStore.getInstance("PKCS12");
    try (InputStream ki = new FileInputStream(System.getProperty("sinama.anahtar"))) { ks.load(ki, "sinama".toCharArray()); }
    javax.net.ssl.KeyManagerFactory kmf = javax.net.ssl.KeyManagerFactory.getInstance(javax.net.ssl.KeyManagerFactory.getDefaultAlgorithm());
    kmf.init(ks, "sinama".toCharArray());
    javax.net.ssl.SSLContext ssl = javax.net.ssl.SSLContext.getInstance("TLS");
    ssl.init(kmf.getKeyManagers(), null, null);
    srv.setHttpsConfigurator(new HttpsConfigurator(ssl));
    srv.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());
    srv.createContext("/", ex -> {
      synchronized (Test.class) { hits++; }
      if (ex.getRequestURI().getPath().contains("yok")) { ex.sendResponseHeaders(404, -1); ex.close(); return; }
      String r = ex.getRequestHeaders().getFirst("Range");
      long st = 0, en = data.length - 1;
      if (r != null) { String[] p = r.substring(6).split("-", -1); st = Long.parseLong(p[0]); if (!p[1].isEmpty()) en = Math.min(en, Long.parseLong(p[1])); }
      ex.getResponseHeaders().add("Content-Range", "bytes " + st + "-" + en + "/" + data.length);
      ex.sendResponseHeaders(r != null ? 206 : 200, en - st + 1);
      try (OutputStream o = ex.getResponseBody()) {
        for (long p = st; p <= en; p += 65536) {
          int n = (int) Math.min(65536, en - p + 1); o.write(data, (int) p, n); served.addAndGet(n);
          if (delayMs > 0) Thread.sleep(delayMs);
        }
      } catch (Exception ignored) {}
      ex.close();
    });
    srv.start();
    String base = "https://akilcantasi.com:" + srv.getAddress().getPort();
    File root = Files.createTempDirectory("ind").toFile();
    android.content.Context.root = root;
    android.content.Context ctx = new android.content.Context();
    PaketIndirici d = PaketIndirici.get(ctx);

    // 0) Adres ve ad denetimleri (sayfaya sızan betik rastgele kaynak / yol veremesin)
    check(SinamaErisim.izinliAdres("https://download.kiwix.org/zim/a.zim") && SinamaErisim.izinliAdres("https://cdn-lfs.huggingface.co/x"), "izinli alanlar ve alt alan adları");
    check(!SinamaErisim.izinliAdres("http://download.kiwix.org/zim/a.zim"), "düz http reddedilir");
    check(!SinamaErisim.izinliAdres("https://evil-huggingface.co/x") && !SinamaErisim.izinliAdres("https://huggingface.co.evil.example/x"), "benzer ama başka alan reddedilir");
    check(!SinamaErisim.izinliAdres("https://127.0.0.1/x") && !SinamaErisim.izinliAdres("file:///sdcard/x.zim") && !SinamaErisim.izinliAdres(null), "IP, file: ve boş reddedilir");
    check(SinamaErisim.expandMirrors(Arrays.asList("http://a.example/x.zim", "https://a.example/y.zim")).isEmpty(), "izinsiz adresler ayna listesine girmez");
    check(!PaketIndirici.isPackName("../x.zim") && !PaketIndirici.isPackName("a/b.zim") && !PaketIndirici.isPackName(".gizli.zim")
        && !PaketIndirici.isPackName("x.exe") && PaketIndirici.isPackName("wikipedia_tr_all_mini_2026-09.zim"), "paket adı denetimi");
    File disari = new File(root, "packs/disari.part");
    disari.getParentFile().mkdirs();
    Files.write(disari.toPath(), new byte[] {1});
    d.cancel("../disari");
    check(disari.exists(), "iptal: '../' ile paket klasörü dışındaki dosya silinmez");
    boolean reddedildi = false;
    try { d.start("../kacak.zim", Collections.singletonList(base + "/a/x.zim"), 0, null); } catch (IOException e) { reddedildi = true; }
    check(reddedildi, "geçersiz adla indirme başlamaz");
    d.start("duz.zim", Collections.singletonList("http://127.0.0.1:" + srv.getAddress().getPort() + "/a/duz.zim"), data.length, null);
    long t00 = System.currentTimeMillis();
    while (!status(d, "duz.zim").equals("error") && System.currentTimeMillis() - t00 < 20000) Thread.sleep(100);
    check(status(d, "duz.zim").equals("error") && !new File(root, "packs/duz.zim").exists(), "http adresinden indirme yapılmaz");
    d.cancel("duz.zim");

    // 1) Uçtan uca: bir ayna 404, diğeri çalışıyor; 4 bölüm; SHA doğrulama
    d.start("deneme.zim", Arrays.asList(base + "/yok/deneme.zim", base + "/a/deneme.zim"), data.length, sha);
    long t0 = System.currentTimeMillis();
    while (!status(d, "deneme.zim").equals("done") && System.currentTimeMillis() - t0 < 60000) Thread.sleep(200);
    File out = new File(root, "packs/deneme.zim");
    check(out.isFile() && out.length() == data.length, "indirilen dosya paket klasöründe, boyut doğru");
    check(hex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(out.toPath()))).equals(sha), "içerik birebir aynı");
    check(!new File(root, "packs/_indiriliyor/deneme.zim.part").exists(), ".part temizlendi");

    // 2) Duraklat → sürdür: kaldığı yerden devam
    delayMs = 20;
    d.start("iki.zim", Collections.singletonList(base + "/b/iki.zim"), data.length, sha);
    Thread.sleep(2500);
    d.pause("iki.zim");
    Thread.sleep(1500);
    String js = d.jobsJson().toString();
    long rec = Long.parseLong(js.replaceAll(".*\"file\":\"iki.zim\",\"status\":\"paused\",\"received\":(\\d+).*", "$1"));
    check(rec > 0 && rec < data.length, "duraklatıldı, alınan " + rec);
    check(new File(root, "packs/_indiriliyor/iki.zim.durum").exists(), "durum dosyası yazıldı");
    // Uygulama yeniden açılmış gibi: yeni örnek, yarım iş "paused" olarak gelmeli
    java.lang.reflect.Field f = PaketIndirici.class.getDeclaredField("instance"); f.setAccessible(true); f.set(null, null);
    d = PaketIndirici.get(ctx);
    check(status(d, "iki.zim").equals("paused"), "yeniden açılışta yarım indirme listede");
    delayMs = 0;
    served.set(0);
    d.start("iki.zim", Collections.emptyList(), 0, null); // adres ve boyut kayıttan gelir
    t0 = System.currentTimeMillis();
    while (!status(d, "iki.zim").equals("done") && System.currentTimeMillis() - t0 < 60000) Thread.sleep(200);
    File out2 = new File(root, "packs/iki.zim");
    check(out2.length() == data.length && hex(MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(out2.toPath()))).equals(sha), "sürdürülen indirme doğru tamamlandı");
    check(served.get() < data.length - rec + 12L * 1024 * 1024, "sürdürmede yalnız kalan kısım indirildi (" + served.get() / 1048576 + " MB, ölçüm dahil)");

    // 3) Yanlış SHA → hata, dosya taşınmaz
    d.start("bozuk.zim", Collections.singletonList(base + "/c/bozuk.zim"), data.length, "00");
    t0 = System.currentTimeMillis();
    while (!status(d, "bozuk.zim").equals("error") && System.currentTimeMillis() - t0 < 60000) Thread.sleep(200);
    check(status(d, "bozuk.zim").equals("error") && !new File(root, "packs/bozuk.zim").exists(), "doğrulama hatası yakalandı");

    // 4) Boyut tutmayan ayna elenir; iptal .part'ı siler
    delayMs = 20;
    d.start("iptal.zim", Collections.singletonList(base + "/d/iptal.zim"), data.length, null);
    Thread.sleep(1500);
    d.cancel("iptal.zim");
    check(status(d, "iptal.zim").equals("none") && !new File(root, "packs/_indiriliyor/iptal.zim.part").exists(), "iptal: iş ve .part silindi");
    d.start("boyut.zim", Collections.singletonList(base + "/e/boyut.zim"), 12345, null);
    t0 = System.currentTimeMillis();
    while (!status(d, "boyut.zim").equals("error") && System.currentTimeMillis() - t0 < 30000) Thread.sleep(200);
    check(status(d, "boyut.zim").equals("error"), "boyutu tutmayan kaynak kabul edilmedi");

    // 5) Yer denetimi: boyut bilinmese de (katalogda yaklaşık) telefon belleği doldurulmaz
    android.os.StatFs.bos = 100L * 1024 * 1024; // 70 MB dosya + 64 MB yedek sığmaz
    d.start("yer.zim", Collections.singletonList(base + "/f/yer.zim"), 0, null);
    t0 = System.currentTimeMillis();
    while (!status(d, "yer.zim").equals("error") && System.currentTimeMillis() - t0 < 30000) Thread.sleep(100);
    String yerJs = d.jobsJson().toString();
    check(status(d, "yer.zim").equals("error") && yerJs.contains("Yer yetersiz") && !new File(root, "packs/_indiriliyor/yer.zim.part").exists(),
        "boyut bilinmeyen indirmede yer yetmiyorsa başlamaz, .part ayrılmaz");
    boolean yerYok = false;
    try { d.start("yer2.zim", Collections.singletonList(base + "/f/yer2.zim"), data.length, null); } catch (IOException e) { yerYok = e.getMessage().startsWith("Yer yetersiz"); }
    check(yerYok, "boyut biliniyorsa hemen reddedilir");
    android.os.StatFs.bos = 10_000_000_000L;

    srv.stop(0);
    System.out.println("TÜMÜ OK");
    System.exit(0);
  }
}
