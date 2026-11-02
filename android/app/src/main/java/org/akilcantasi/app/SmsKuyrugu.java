package org.akilcantasi.app;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * SMS giden kutusu: kalıcı kuyruk ve yeniden deneme kuralları (Android'e bağımlı değil, sınanır).
 *
 * Durumlar:
 *   bekliyor     sıradaki denemeyi (sonraki) bekliyor
 *   gonderiliyor telefona verildi, "gönderildi" sonucu bekleniyor
 *   gitti        tüm parçalar operatöre ulaştı
 *   ulasti       alıcının telefonu teslim raporu verdi
 *   hata         vazgeçildi (OMUR boyunca gönderilemedi)
 *
 * Kurallar:
 *   • Başarısız denemeden sonra artan bekleme: 15 sn, 30 sn, 1, 2, 5, 10 dk, sonra hep 15 dk.
 *   • Şebeke geri gelince (servisGeldi) bekleyenler hemen denenir.
 *   • "Gönderildi" sonucu ASKIDA süresi içinde gelmezse deneme başarısız sayılır.
 *   • Eski bir denemeden geç gelen sonuç (deneme numarası tutmaz) yok sayılır.
 *   • OMUR (3 gün) dolunca "hata"; kullanıcı yine de "Şimdi dene" ile sürdürebilir.
 */
public class SmsKuyrugu {

    public static final long[] GECIKME = {15_000, 30_000, 60_000, 120_000, 300_000, 600_000, 900_000};
    public static final long ASKIDA = 3 * 60_000;
    public static final long OMUR = 72L * 3600_000;
    public static final int AZAMI = 200;

    public static class Mesaj {
        public String id, to, name, body, state = "bekliyor", error = "";
        public long created, nextTry, tried, sentAt, deliveredAt;
        public int attempts, parts, partsSent, partsDelivered;

        JSONObject json() throws Exception {
            JSONObject o = new JSONObject();
            o.put("id", id).put("to", to).put("name", name).put("body", body).put("state", state).put("error", error);
            o.put("created", created).put("nextTry", nextTry).put("tried", tried).put("sentAt", sentAt).put("deliveredAt", deliveredAt);
            o.put("attempts", (long) attempts).put("parts", (long) parts).put("partsSent", (long) partsSent).put("partsDelivered", (long) partsDelivered);
            return o;
        }

        static Mesaj from(JSONObject o) {
            Mesaj m = new Mesaj();
            m.id = o.optString("id", "");
            m.to = o.optString("to", "");
            m.name = o.optString("name", "");
            m.body = o.optString("body", "");
            m.state = o.optString("state", "bekliyor");
            m.error = o.optString("error", "");
            m.created = o.optLong("created", 0);
            m.nextTry = o.optLong("nextTry", 0);
            m.tried = o.optLong("tried", 0);
            m.sentAt = o.optLong("sentAt", 0);
            m.deliveredAt = o.optLong("deliveredAt", 0);
            m.attempts = (int) o.optLong("attempts", 0);
            m.parts = (int) o.optLong("parts", 0);
            m.partsSent = (int) o.optLong("partsSent", 0);
            m.partsDelivered = (int) o.optLong("partsDelivered", 0);
            return m;
        }

        public boolean acik() {
            return "bekliyor".equals(state) || "gonderiliyor".equals(state);
        }
    }

    private final File file;
    private final List<Mesaj> list = new ArrayList<>();
    private int seq;

    public SmsKuyrugu(File file) {
        this.file = file;
        load();
    }

    public static long gecikme(int attempts) {
        return GECIKME[Math.max(0, Math.min(GECIKME.length - 1, attempts - 1))];
    }

    // ------------------------------------------------------------------ işlemler

    /** Her alıcı için ayrı mesaj; hemen denenecek biçimde kuyruğa girer. */
    public synchronized List<Mesaj> ekle(String[] to, String[] names, String body, long now) {
        List<Mesaj> out = new ArrayList<>();
        for (int i = 0; i < to.length; i++) {
            String n = temizNumara(to[i]);
            if (n.isEmpty()) continue;
            Mesaj m = new Mesaj();
            m.id = Long.toString(now, 36) + "-" + Integer.toString(++seq, 36) + i;
            m.to = n;
            m.name = names != null && i < names.length && names[i] != null ? names[i] : "";
            m.body = body;
            m.created = now;
            m.nextTry = now;
            list.add(m);
            out.add(m);
        }
        // Taşarsa en eski kapanmış kayıtlar atılır (açıklara dokunulmaz)
        for (int i = 0; list.size() > AZAMI && i < list.size(); ) {
            if (!list.get(i).acik()) list.remove(i);
            else i++;
        }
        save();
        return out;
    }

    /** Şimdi gönderilmesi gerekenler. Sonucu askıda kalmış denemeler başarısız sayılıp yeniden sıraya alınır. */
    public synchronized List<Mesaj> hazirOlanlar(long now) {
        boolean changed = false;
        for (Mesaj m : list) {
            if ("gonderiliyor".equals(m.state) && now - m.tried > ASKIDA) {
                basarisiz(m, "Gönderim sonucu alınamadı", now);
                changed = true;
            }
        }
        if (changed) save();
        List<Mesaj> out = new ArrayList<>();
        for (Mesaj m : list) if ("bekliyor".equals(m.state) && m.nextTry <= now) out.add(m);
        return out;
    }

    /** Telefona verildi. Dönen deneme numarası sonuç bildirimlerinde geri gelir. */
    public synchronized int basladi(String id, int parts, long now) {
        Mesaj m = bul(id);
        if (m == null) return -1;
        m.state = "gonderiliyor";
        m.attempts++;
        m.parts = Math.max(1, parts);
        m.partsSent = 0;
        m.partsDelivered = 0;
        m.tried = now;
        save();
        return m.attempts;
    }

    /** Bir parçanın "gönderildi" sonucu. hata null ise başarılı. Mesajın durumu değiştiyse true. */
    public synchronized boolean gonderimSonucu(String id, int attempt, String hata, long now) {
        Mesaj m = bul(id);
        if (m == null || m.attempts != attempt || !"gonderiliyor".equals(m.state)) return false;
        if (hata != null) {
            basarisiz(m, hata, now);
        } else {
            m.partsSent++;
            if (m.partsSent < m.parts) {
                save();
                return false;
            }
            m.state = "gitti";
            m.sentAt = now;
            m.error = "";
        }
        save();
        return true;
    }

    /** Teslim raporu (alıcının telefonuna ulaştı). */
    public synchronized boolean teslimSonucu(String id, int attempt, boolean ok, long now) {
        Mesaj m = bul(id);
        if (m == null || m.attempts != attempt || !ok) return false;
        if (!"gitti".equals(m.state) && !"gonderiliyor".equals(m.state)) return false;
        m.partsDelivered++;
        if (m.partsDelivered < m.parts) {
            save();
            return false;
        }
        m.state = "ulasti";
        m.deliveredAt = now;
        if (m.sentAt == 0) m.sentAt = now;
        save();
        return true;
    }

    /** Gönderim hiç başlatılamadı (izin yok, istisna): deneme sayılır, bekleme kuralı işler. */
    public synchronized void baslatilamadi(String id, String hata, long now) {
        Mesaj m = bul(id);
        if (m == null || !m.acik()) return;
        m.attempts++;
        basarisiz(m, hata, now);
        save();
    }

    /** Şebeke geri geldi: bekleyenler hemen denensin. */
    public synchronized boolean servisGeldi(long now) {
        boolean any = false;
        for (Mesaj m : list) {
            if ("bekliyor".equals(m.state) && m.nextTry > now) {
                m.nextTry = now;
                any = true;
            }
        }
        if (any) save();
        return any;
    }

    /** Kullanıcı "Şimdi dene" dedi (id null ise hepsi); vazgeçilmiş mesaj da yeniden açılır. */
    public synchronized boolean simdiDene(String id, long now) {
        boolean any = false;
        for (Mesaj m : list) {
            if (id != null && !id.equals(m.id)) continue;
            if ("bekliyor".equals(m.state) || "hata".equals(m.state)) {
                if ("hata".equals(m.state)) m.created = now; // ömür yeniden başlar
                m.state = "bekliyor";
                m.nextTry = now;
                any = true;
            }
        }
        if (any) save();
        return any;
    }

    public synchronized boolean iptal(String id) {
        boolean r = list.removeIf((m) -> m.id.equals(id));
        if (r) save();
        return r;
    }

    /** Sonuçlanmış (gitti, ulaştı, hata) kayıtları siler. */
    public synchronized int temizle() {
        int n = list.size();
        list.removeIf((m) -> !m.acik());
        if (n != list.size()) save();
        return n - list.size();
    }

    /** Bir sonraki uyanma zamanı (yoksa 0). */
    public synchronized long sonrakiUyanma() {
        long t = 0;
        for (Mesaj m : list) {
            long x = "bekliyor".equals(m.state) ? m.nextTry : "gonderiliyor".equals(m.state) ? m.tried + ASKIDA + 1 : 0;
            if (x > 0 && (t == 0 || x < t)) t = x;
        }
        return t;
    }

    public synchronized int acikSayisi() {
        int n = 0;
        for (Mesaj m : list) if (m.acik()) n++;
        return n;
    }

    public synchronized Mesaj bul(String id) {
        for (Mesaj m : list) if (m.id.equals(id)) return m;
        return null;
    }

    public synchronized JSONArray json() {
        JSONArray a = new JSONArray();
        try {
            for (int i = list.size() - 1; i >= 0; i--) a.put(list.get(i).json());
        } catch (Exception ignored) {
        }
        return a;
    }

    // ------------------------------------------------------------------ yardımcılar

    private void basarisiz(Mesaj m, String hata, long now) {
        m.error = hata;
        if (now - m.created > OMUR) {
            m.state = "hata";
            m.nextTry = 0;
        } else {
            m.state = "bekliyor";
            m.nextTry = now + gecikme(m.attempts);
        }
    }

    public static String temizNumara(String s) {
        if (s == null) return "";
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if ((c >= '0' && c <= '9') || (c == '+' && b.length() == 0)) b.append(c);
        }
        return b.length() > 20 ? "" : b.toString();
    }

    /** SmsManager sonuç kodlarının Türkçe karşılığı */
    public static String hataAdi(int kod) {
        switch (kod) {
            case 1: return "Gönderilemedi (genel hata)";
            case 2: return "Telefon radyosu kapalı (uçak modu?)";
            case 3: return "Gönderilemedi (geçersiz ileti)";
            case 4: return "Şebeke yok";
            case 5: return "Gönderim sınırı aşıldı";
            default: return "Gönderilemedi (kod " + kod + ")";
        }
    }

    private void load() {
        list.clear();
        if (file == null || !file.exists()) return;
        try (InputStream in = new FileInputStream(file)) {
            byte[] d = new byte[(int) file.length()];
            int off = 0, n;
            while (off < d.length && (n = in.read(d, off, d.length - off)) > 0) off += n;
            JSONArray a = new JSONObject(new String(d, 0, off, StandardCharsets.UTF_8)).getJSONArray("items");
            for (int i = 0; i < a.length(); i++) list.add(Mesaj.from(a.getJSONObject(i)));
        } catch (Exception ignored) {
            // bozuk dosya: boş kuyrukla devam
        }
    }

    private void save() {
        if (file == null) return;
        try {
            JSONArray a = new JSONArray();
            for (Mesaj m : list) a.put(m.json());
            JSONObject o = new JSONObject().put("items", a);
            File tmp = new File(file.getPath() + ".tmp");
            try (OutputStream out = new FileOutputStream(tmp)) {
                out.write(o.toString().getBytes(StandardCharsets.UTF_8));
            }
            if (!tmp.renameTo(file)) {
                file.delete();
                tmp.renameTo(file);
            }
        } catch (Exception ignored) {
        }
    }
}
