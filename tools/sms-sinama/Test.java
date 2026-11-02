import java.io.File;
import java.nio.file.Files;
import java.util.List;
import org.akilcantasi.app.SmsKuyrugu;
import org.akilcantasi.app.SmsKuyrugu.Mesaj;

public class Test {
  static void check(boolean c, String m) { if (!c) { System.out.println("HATA: " + m); System.exit(1); } System.out.println("OK  " + m); }
  public static void main(String[] a) throws Exception {
    File dir = Files.createTempDirectory("sms").toFile();
    File f = new File(dir, "sms-kutusu.json");
    long t = 1_000_000;
    SmsKuyrugu q = new SmsKuyrugu(f);
    List<Mesaj> ek = q.ekle(new String[] {"0532 000 00 00", "+90 (555) 111-22-33", "abc"}, new String[] {"Ayşe", "Mehmet", "x"}, "İyiyim. Konum: 39.92,32.85", t);
    check(ek.size() == 2, "geçersiz numara atlanır, her alıcı ayrı mesaj");
    check(ek.get(0).to.equals("05320000000") && ek.get(1).to.equals("+905551112233"), "numaralar temizlenir");
    check(q.hazirOlanlar(t).size() == 2, "yeni mesajlar hemen hazır");
    String id = ek.get(0).id, id2 = ek.get(1).id;

    // 1) Şebeke yok: artan bekleme
    int at = q.basladi(id, 1, t);
    check(at == 1 && q.bul(id).state.equals("gonderiliyor"), "gönderim başladı, deneme 1");
    check(q.hazirOlanlar(t).size() == 1, "gönderilmekte olan tekrar verilmez");
    q.gonderimSonucu(id, at, SmsKuyrugu.hataAdi(4), t);
    check(q.bul(id).state.equals("bekliyor") && q.bul(id).nextTry == t + 15_000, "şebeke yok → 15 sn sonra");
    check(q.bul(id).error.equals("Şebeke yok"), "hata adı Türkçe");
    check(q.hazirOlanlar(t + 14_000).stream().noneMatch(m -> m.id.equals(id)), "bekleme dolmadan verilmez");
    long now = t;
    long[] beklenen = {15_000, 30_000, 60_000, 120_000, 300_000, 600_000, 900_000, 900_000};
    for (int i = 1; i < beklenen.length; i++) {
      now = q.bul(id).nextTry;
      check(q.hazirOlanlar(now).stream().anyMatch(m -> m.id.equals(id)), "deneme " + (i + 1) + " zamanı geldi");
      int k = q.basladi(id, 1, now);
      q.gonderimSonucu(id, k, "Şebeke yok", now);
      check(q.bul(id).nextTry - now == beklenen[i], "deneme " + (i + 1) + " sonrası bekleme " + beklenen[i] / 1000 + " sn");
    }

    // 2) Şebeke geldi: hemen dene
    check(q.servisGeldi(now + 1000) && q.bul(id).nextTry == now + 1000, "şebeke gelince bekleyen hemen denenir");

    // 3) Çok parçalı: tüm parçalar gidince "gitti", teslim raporlarıyla "ulasti"
    int k = q.basladi(id, 3, now + 1000);
    check(!q.gonderimSonucu(id, k, null, now + 1100), "1/3 parça: durum değişmez");
    q.gonderimSonucu(id, k, null, now + 1200);
    check(q.bul(id).state.equals("gonderiliyor"), "2/3 parça: hâlâ gönderiliyor");
    check(q.gonderimSonucu(id, k, null, now + 1300) && q.bul(id).state.equals("gitti"), "3/3 parça: gitti");
    check(!q.gonderimSonucu(id, k - 1, "Şebeke yok", now + 1400) && q.bul(id).state.equals("gitti"), "eski denemenin geç sonucu yok sayılır");
    q.teslimSonucu(id, k, true, now + 2000); q.teslimSonucu(id, k, true, now + 2000);
    check(q.bul(id).state.equals("gitti"), "teslim 2/3: gitti");
    check(q.teslimSonucu(id, k, true, now + 2100) && q.bul(id).state.equals("ulasti"), "teslim 3/3: ulaştı");

    // 4) Askıda kalan deneme
    int k2 = q.basladi(id2, 1, t);
    check(q.sonrakiUyanma() == t + SmsKuyrugu.ASKIDA + 1, "askıdaki deneme için uyanma planlanır");
    List<Mesaj> h = q.hazirOlanlar(t + SmsKuyrugu.ASKIDA + 1);
    check(q.bul(id2).state.equals("bekliyor") && q.bul(id2).error.contains("sonucu alınamadı") && h.isEmpty(), "sonuç gelmezse başarısız sayılır, beklemeye alınır");
    check(!q.gonderimSonucu(id2, k2, null, t + SmsKuyrugu.ASKIDA + 2), "askıdan düşmüş denemenin sonucu sayılmaz");

    // 5) Kalıcılık: yeniden açılınca aynı kuyruk
    SmsKuyrugu q2 = new SmsKuyrugu(f);
    check(q2.bul(id).state.equals("ulasti") && q2.bul(id2).state.equals("bekliyor") && q2.bul(id2).attempts == 1, "dosyadan aynı durumla yüklenir");
    check(q2.bul(id).name.equals("Ayşe") && q2.bul(id).body.startsWith("İyiyim"), "Türkçe metin ve ad korunur");
    check(q2.acikSayisi() == 1, "açık mesaj sayısı");

    // 6) Ömür: 3 gün sonra vazgeç, Şimdi dene yeniden açar
    long late = t + SmsKuyrugu.OMUR + 10;
    int k3 = q2.basladi(id2, 1, late);
    q2.gonderimSonucu(id2, k3, "Şebeke yok", late);
    check(q2.bul(id2).state.equals("hata") && q2.sonrakiUyanma() == 0, "3 gün dolunca vazgeçilir, uyanma yok");
    check(q2.simdiDene(id2, late + 1) && q2.bul(id2).state.equals("bekliyor") && q2.hazirOlanlar(late + 1).size() == 1, "Şimdi dene vazgeçilmişi yeniden açar");
    q2.baslatilamadi(id2, "SMS izni yok", late + 2);
    check(q2.bul(id2).state.equals("bekliyor") && q2.bul(id2).error.equals("SMS izni yok"), "başlatılamazsa bekleme kuralı işler");

    // 7) Temizle ve iptal
    check(q2.temizle() == 1 && q2.bul(id) == null, "sonuçlanmışlar temizlenir");
    check(q2.iptal(id2) && q2.acikSayisi() == 0 && q2.sonrakiUyanma() == 0, "iptal kuyruktan çıkarır");

    // 7b) Kalıcı hata (ör. FDN, kısa numara engeli): yeniden denenmez
    List<Mesaj> e2 = q2.ekle(new String[] {"112"}, null, "ACİL", late + 10);
    int k4 = q2.basladi(e2.get(0).id, 1, late + 10);
    check(SmsKuyrugu.kaliciHata(6) && !SmsKuyrugu.kaliciHata(4), "kalıcı/geçici hata ayrımı");
    check(q2.kaliciBasarisiz(e2.get(0).id, k4, SmsKuyrugu.hataAdi(6), late + 11) && q2.bul(e2.get(0).id).state.equals("hata") && q2.sonrakiUyanma() == 0, "kalıcı hata hemen sonuçlanır");

    // 8) Bozuk dosya
    Files.writeString(f.toPath(), "{bozuk");
    check(new SmsKuyrugu(f).acikSayisi() == 0, "bozuk dosyada boş kuyruk");
    System.out.println("hepsi geçti");
  }
}
