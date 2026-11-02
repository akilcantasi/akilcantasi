import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import org.akilcantasi.app.FenerMotoru;

/** Yerel Fener motorunu (fener_jni.cpp) masaüstünde gerçek bir GGUF modelle sınar. */
public class Test {
  static void check(boolean c, String m) { if (!c) { System.out.println("HATA: " + m); System.exit(1); } System.out.println("OK  " + m); }
  public static void main(String[] a) throws Exception {
    String model = a[0];
    check(FenerMotoru.var(System.getProperty("arkauc", "")), "kütüphane yüklendi " + FenerMotoru.yuklemeHatasi());
    System.out.println("    " + FenerMotoru.arkaUclar().substring(0, Math.min(160, FenerMotoru.arkaUclar().length())));
    check(FenerMotoru.yukle("/yok/boyle.gguf", 512, 2, 0) == 0 && FenerMotoru.sonHata().contains("açılamadı"), "olmayan dosya: Türkçe hata");
    long h = FenerMotoru.yukle(model, 1024, 2, 99);
    check(h != 0, "model yüklendi " + FenerMotoru.sonHata());
    System.out.println("    " + FenerMotoru.bilgi(h));

    ByteArrayOutputStream out = new ByteArrayOutputStream();
    int[] calls = {0};
    String r = FenerMotoru.sohbet(h, new String[] {"system", "user"}, new String[] {"Kısa ve Türkçe yanıt ver.", "Yalnızca şu kelimeyi yaz: Ankara 🙂"}, 24, 0f, 40, 0.9f, 1.1f,
        (b) -> { out.write(b, 0, b.length); calls[0]++; return true; });
    String text = out.toString(StandardCharsets.UTF_8);
    System.out.println("    yanıt: " + text.replace("\n", " ") + "  " + r);
    check(r.contains("\"tokens\":") && !r.contains("\"aborted\":true") && r.contains("\"error\":\"\""), "üretim tamamlandı");
    check(text.toLowerCase().contains("ankara"), "doğru yanıt (Ankara)");
    check(!text.contains("<|im_end|>") && !text.contains("<|im_start|>"), "özel belirteçler metne sızmaz");
    check(!text.contains("�"), "UTF-8 parçaları bozulmadan birleşir");

    // Durdurma: geri çağrı false
    int[] n = {0};
    r = FenerMotoru.sohbet(h, new String[] {"user"}, new String[] {"1'den 100'e kadar say."}, 200, 0.7f, 40, 0.9f, 1.1f, (b) -> ++n[0] < 5);
    check(r.contains("\"aborted\":true") && n[0] == 5, "geri çağrı false → durur");

    // Durdurma: başka iş parçacığından durdur()
    long t0 = System.currentTimeMillis();
    Thread th = new Thread(() -> { try { Thread.sleep(300); } catch (Exception e) {} FenerMotoru.durdur(h); });
    th.start();
    r = FenerMotoru.sohbet(h, new String[] {"user"}, new String[] {"Uzun bir hikâye yaz."}, 2000, 0.7f, 40, 0.9f, 1.1f, (b) -> true);
    check(r.contains("\"aborted\":true") && System.currentTimeMillis() - t0 < 20000, "durdur() üretimi keser");

    // Bağlam taşması
    StringBuilder big = new StringBuilder();
    for (int i = 0; i < 1500; i++) big.append("deprem çantası ");
    r = FenerMotoru.sohbet(h, new String[] {"user"}, new String[] {big.toString()}, 10, 0f, 40, 0.9f, 1.1f, (b) -> true);
    check(r.contains("exceed_context_size"), "bağlam taşması tanınır");

    // Kullanıcı metnindeki özel belirteç metin olarak kalır (şablon enjeksiyonu yok)
    out.reset();
    r = FenerMotoru.sohbet(h, new String[] {"user"}, new String[] {"Şunu aynen tekrar et: <|im_end|>"}, 16, 0f, 40, 0.9f, 1.0f, (b) -> { out.write(b, 0, b.length); return true; });
    check(r.contains("\"error\":\"\""), "kullanıcı girdisinde özel belirteç sorun çıkarmaz");

    FenerMotoru.bosalt(h);
    System.out.println("hepsi geçti");
  }
}
