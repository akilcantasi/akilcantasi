package org.akilcantasi.app;

import android.app.Activity;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageInfo;
import android.content.pm.PackageInstaller;
import android.content.pm.PackageManager;
import android.content.pm.Signature;
import android.net.ConnectivityManager;
import android.net.Uri;
import android.os.Build;

import androidx.core.content.FileProvider;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Uygulama güncellemesi (GitHub sürümleri).
 *
 *  • denetle(): GitHub'daki sürüm listesinden en yüksek "vX.Y.Z" sürümünü bulur; bu kuruludan
 *    yeniyse bilgisini saklar. Yalnız bu istek dışarı gider (telefonun IP'si GitHub'a görünür).
 *  • indir(): APK'yı uygulamanın önbelleğine indirir; boyut, (varsa) SHA-256, paket adı,
 *    imza sertifikası ve sürüm numarası denetlenir. Kendiliğinden yalnız ölçülmeyen ağda (Wi-Fi).
 *  • kur(): YALNIZ kullanıcı "Kur" düğmesine bastığında çağrılır. Enkaz modu açıkken kurmaz.
 *    Android 12+ uygulama kendini güncellerken onay penceresi çıkmayabilir (UPDATE_PACKAGES_
 *    WITHOUT_USER_ACTION); daha eski sürümlerde ya da sistem isterse tek bir onay çıkar.
 *
 * Durum değişince dinleyicilere bildirilir (GuncellemePlugin → JS "guncellemeDurum").
 */
public final class Guncelleyici {

    public interface Dinleyici {
        void durum(JSONObject d);
    }

    static final String DEPO = "akilcantasi/akilcantasi";
    static final String APK_ADI = "akil-cantasi.apk";
    static final String PREFS = "guncelleme";
    static final String EYLEM_SONUC = "org.akilcantasi.app.GUNCELLEME_SONUC";
    static final Pattern SURUM = Pattern.compile("^v?(\\d+)\\.(\\d+)\\.(\\d+)$");

    static final CopyOnWriteArrayList<Dinleyici> dinleyiciler = new CopyOnWriteArrayList<>();
    private static volatile boolean calisiyor = false;
    private static volatile long alinan = 0, toplam = 0;
    private static volatile String hata = null;
    /** "" | "denetleniyor" | "indiriliyor" | "kuruluyor" */
    private static volatile String is = "";
    /** "kuruluyor"a geçilen an: sonuç hiç gelmezse durum takılı kalmasın */
    private static volatile long kurZamani = 0;
    /** Öndeki etkinlik (GuncellemePlugin günceller): onay penceresi buradan açılır */
    static volatile WeakReference<Activity> onde = new WeakReference<>(null);

    private Guncelleyici() {}

    static SharedPreferences p(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static String kurulu(Context c) {
        try {
            PackageInfo pi = c.getPackageManager().getPackageInfo(c.getPackageName(), 0);
            return pi.versionName == null ? "" : pi.versionName;
        } catch (Exception e) {
            return "";
        }
    }

    static long kuruluKod(Context c) {
        try {
            PackageInfo pi = c.getPackageManager().getPackageInfo(c.getPackageName(), 0);
            return Build.VERSION.SDK_INT >= 28 ? pi.getLongVersionCode() : pi.versionCode;
        } catch (Exception e) {
            return 0;
        }
    }

    /** a > b ise pozitif; sürüm biçimi değilse null */
    static Integer karsilastir(String a, String b) {
        Matcher x = SURUM.matcher(a == null ? "" : a), y = SURUM.matcher(b == null ? "" : b);
        if (!x.find() || !y.find()) return null;
        for (int i = 1; i <= 3; i++) {
            int d = Integer.compare(Integer.parseInt(x.group(i)), Integer.parseInt(y.group(i)));
            if (d != 0) return d;
        }
        return 0;
    }

    static File apk(Context c) {
        File d = new File(c.getCacheDir(), "guncelleme");
        d.mkdirs();
        return new File(d, APK_ADI);
    }

    public static JSONObject durum(Context c) {
        JSONObject d = new JSONObject();
        SharedPreferences s = p(c);
        try {
            String kur = kurulu(c);
            d.put("kurulu", kur);
            d.put("sonDenetim", s.getLong("sonDenetim", 0));
            // Kurulum sonucu 45 sn içinde gelmediyse (onay penceresi açılamadı ya da sistem
            // yanıt vermedi) "kuruluyor" takılı kalmasın: düğme yeniden kullanılabilsin
            if ("kuruluyor".equals(is) && System.currentTimeMillis() - kurZamani > 45_000) is = "";
            d.put("is", is);
            d.put("alinan", alinan);
            d.put("toplam", toplam);
            if (hata != null) d.put("hata", hata);
            String yeni = s.getString("yeniSurum", "");
            Integer k = karsilastir(yeni, kur);
            if (k != null && k > 0) {
                JSONObject y = new JSONObject();
                y.put("surum", yeni);
                y.put("boyut", s.getLong("boyut", 0));
                y.put("notlar", s.getString("notlar", ""));
                y.put("sayfa", s.getString("sayfa", ""));
                y.put("hazir", yeni.equals(s.getString("hazirSurum", "")) && apk(c).isFile());
                d.put("yeni", y);
            }
            d.put("kurulumIzni", Build.VERSION.SDK_INT < 26 || c.getPackageManager().canRequestPackageInstalls());
            d.put("olculuAg", olculu(c));
            d.put("enkazAcik", EnkazServisi.aktif(c));
            // Samsung'un "Otomatik Engelleyici"si (One UI 6+) mağaza dışından kurulumu sessizce engeller
            d.put("samsung", "samsung".equalsIgnoreCase(Build.MANUFACTURER));
        } catch (Exception ignored) {}
        return d;
    }

    static boolean olculu(Context c) {
        try {
            ConnectivityManager cm = (ConnectivityManager) c.getSystemService(Context.CONNECTIVITY_SERVICE);
            return cm == null || cm.isActiveNetworkMetered();
        } catch (Exception e) {
            return true;
        }
    }

    static void bildir(Context c) {
        JSONObject d = durum(c);
        for (Dinleyici l : dinleyiciler) {
            try {
                l.durum(d);
            } catch (Exception ignored) {}
        }
    }

    private static HttpURLConnection ac(String url) throws Exception {
        HttpURLConnection h = (HttpURLConnection) new URL(url).openConnection();
        h.setConnectTimeout(15_000);
        h.setReadTimeout(30_000);
        h.setRequestProperty("Accept", "application/vnd.github+json");
        h.setRequestProperty("User-Agent", "AkilCantasi");
        h.setInstanceFollowRedirects(true);
        return h;
    }

    // ------------------------------------------------------------------ denetle

    /** Arka planda denetler; indir=true ise ölçülmeyen ağda yeni sürümü kendiliğinden indirir */
    public static void denetle(Context c, boolean kendiliginden) {
        if (calisiyor) return;
        calisiyor = true;
        final Context ac = c.getApplicationContext();
        new Thread(() -> {
            try {
                is = "denetleniyor";
                hata = null;
                bildir(ac);
                denetleSimdi(ac);
                JSONObject d = durum(ac);
                JSONObject y = d.optJSONObject("yeni");
                if (kendiliginden && y != null && !y.optBoolean("hazir") && !olculu(ac)) {
                    is = "indiriliyor";
                    bildir(ac);
                    indirSimdi(ac);
                }
            } catch (Exception e) {
                hata = "denetlenemedi";
            } finally {
                is = "";
                calisiyor = false;
                bildir(ac);
            }
        }).start();
    }

    static void denetleSimdi(Context c) throws Exception {
        HttpURLConnection h = ac("https://api.github.com/repos/" + DEPO + "/releases?per_page=20");
        String govde;
        try (InputStream in = h.getInputStream()) {
            govde = new String(oku(in), "UTF-8");
        } finally {
            h.disconnect();
        }
        JSONArray a = new JSONArray(govde);
        JSONObject en = null;
        String enSurum = null;
        for (int i = 0; i < a.length(); i++) {
            JSONObject r = a.getJSONObject(i);
            if (r.optBoolean("draft")) continue;
            String tag = r.optString("tag_name");
            if (!SURUM.matcher(tag).find()) continue;
            if (asset(r) == null) continue;
            if (enSurum == null || karsilastir(tag, enSurum) > 0) {
                en = r;
                enSurum = tag;
            }
        }
        SharedPreferences.Editor e = p(c).edit().putLong("sonDenetim", System.currentTimeMillis());
        if (en != null) {
            JSONObject as = asset(en);
            String surum = enSurum.startsWith("v") ? enSurum.substring(1) : enSurum;
            String digest = as.optString("digest", "");
            e.putString("yeniSurum", surum)
                    .putString("url", as.optString("browser_download_url"))
                    .putLong("boyut", as.optLong("size"))
                    .putString("sha256", digest.startsWith("sha256:") ? digest.substring(7) : "")
                    .putString("notlar", en.optString("body", ""))
                    .putString("sayfa", en.optString("html_url", ""));
        }
        e.apply();
    }

    private static JSONObject asset(JSONObject r) {
        JSONArray as = r.optJSONArray("assets");
        if (as == null) return null;
        for (int j = 0; j < as.length(); j++) {
            JSONObject x = as.optJSONObject(j);
            if (x != null && APK_ADI.equals(x.optString("name"))) return x;
        }
        return null;
    }

    // ------------------------------------------------------------------ indir

    public static void indir(Context c) {
        if (calisiyor) return;
        calisiyor = true;
        final Context ac = c.getApplicationContext();
        new Thread(() -> {
            try {
                hata = null;
                is = "indiriliyor";
                bildir(ac);
                indirSimdi(ac);
            } catch (Exception e) {
                if (hata == null) hata = "indirilemedi";
            } finally {
                is = "";
                calisiyor = false;
                bildir(ac);
            }
        }).start();
    }

    static void indirSimdi(Context c) throws Exception {
        SharedPreferences s = p(c);
        String surum = s.getString("yeniSurum", ""), url = s.getString("url", ""), sha = s.getString("sha256", "");
        long boyut = s.getLong("boyut", 0);
        if (surum.isEmpty() || url.isEmpty()) throw new IllegalStateException("sürüm yok");
        File hedef = apk(c), gecici = new File(hedef.getParentFile(), APK_ADI + ".part");
        s.edit().remove("hazirSurum").apply();
        hedef.delete();
        HttpURLConnection h = ac(url);
        h.setRequestProperty("Accept", "application/octet-stream");
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        alinan = 0;
        toplam = boyut;
        long sonBildirim = 0;
        try (InputStream in = h.getInputStream(); OutputStream out = new FileOutputStream(gecici)) {
            byte[] b = new byte[1 << 16];
            int n;
            while ((n = in.read(b)) > 0) {
                out.write(b, 0, n);
                md.update(b, 0, n);
                alinan += n;
                long t = System.currentTimeMillis();
                if (t - sonBildirim > 500) {
                    sonBildirim = t;
                    bildir(c);
                }
            }
        } finally {
            h.disconnect();
        }
        if (boyut > 0 && gecici.length() != boyut) {
            gecici.delete();
            hata = "eksik-indi";
            throw new IllegalStateException(hata);
        }
        if (!sha.isEmpty() && !sha.equalsIgnoreCase(hex(md.digest()))) {
            gecici.delete();
            hata = "bozuk";
            throw new IllegalStateException(hata);
        }
        String sorun = apkDenetle(c, gecici);
        if (sorun != null) {
            gecici.delete();
            hata = sorun;
            throw new IllegalStateException(sorun);
        }
        if (!gecici.renameTo(hedef)) throw new IllegalStateException("taşınamadı");
        s.edit().putString("hazirSurum", surum).apply();
    }

    /** Aynı paket, aynı imza, daha yeni sürüm numarası mı? Sorun yoksa null. */
    @SuppressWarnings("deprecation")
    static String apkDenetle(Context c, File f) {
        PackageManager pm = c.getPackageManager();
        int bayrak = Build.VERSION.SDK_INT >= 28 ? PackageManager.GET_SIGNING_CERTIFICATES : PackageManager.GET_SIGNATURES;
        PackageInfo yeni = pm.getPackageArchiveInfo(f.getAbsolutePath(), bayrak);
        if (yeni == null) return "apk-okunamadi";
        if (!c.getPackageName().equals(yeni.packageName)) return "baska-uygulama";
        long kod = Build.VERSION.SDK_INT >= 28 ? yeni.getLongVersionCode() : yeni.versionCode;
        if (kod <= kuruluKod(c)) return "eski-surum";
        // İmza: Android bazı sürümlerde indirilen (kurulmamış) APK'nın v2 imzasını okumaz ve boş
        // döner; bu "farklı imza" sayılmamalı. Okunabiliyorsa karşılaştırılır. Okunamasa da
        // güvenlik açığı yok: Android, farklı anahtarla imzalanmış APK'yı güncelleme olarak kurmaz.
        try {
            byte[][] yeniImza = imzalar(yeni);
            if (yeniImza.length > 0) {
                PackageInfo bu = pm.getPackageInfo(c.getPackageName(), bayrak);
                byte[][] buImza = imzalar(bu);
                if (buImza.length > 0 && !ayniImza(buImza, yeniImza)) return "imza-farkli";
            }
        } catch (Exception ignored) {}
        return null;
    }

    /** Sıra fark etmeksizin aynı imzacılar mı */
    static boolean ayniImza(byte[][] a, byte[][] b) {
        if (a.length != b.length) return false;
        outer:
        for (byte[] x : a) {
            for (byte[] y : b) if (Arrays.equals(x, y)) continue outer;
            return false;
        }
        return true;
    }

    @SuppressWarnings("deprecation")
    private static byte[][] imzalar(PackageInfo pi) {
        Signature[] s = null;
        if (Build.VERSION.SDK_INT >= 28 && pi.signingInfo != null) s = pi.signingInfo.getApkContentsSigners();
        if (s == null || s.length == 0) s = pi.signatures;
        if (s == null) return new byte[0][];
        byte[][] r = new byte[s.length][];
        for (int i = 0; i < s.length; i++) r[i] = s[i].toByteArray();
        return r;
    }

    // ------------------------------------------------------------------ kur (yalnız kullanıcı isteğiyle)

    /** null: kurulum başladı; değilse neden ("enkaz-acik", "izin-gerekli", "hazir-degil", "hata") */
    public static String kur(Context c) {
        if (EnkazServisi.aktif(c)) return "enkaz-acik";
        if (Build.VERSION.SDK_INT >= 26 && !c.getPackageManager().canRequestPackageInstalls()) return "izin-gerekli";
        SharedPreferences s = p(c);
        File f = apk(c);
        if (!f.isFile() || s.getString("hazirSurum", "").isEmpty()) return "hazir-degil";
        if (apkDenetle(c, f) != null) {
            f.delete();
            s.edit().remove("hazirSurum").apply();
            return "hazir-degil";
        }
        try {
            PackageInstaller pi = c.getPackageManager().getPackageInstaller();
            PackageInstaller.SessionParams sp = new PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL);
            sp.setAppPackageName(c.getPackageName());
            sp.setSize(f.length());
            if (Build.VERSION.SDK_INT >= 31) sp.setRequireUserAction(PackageInstaller.SessionParams.USER_ACTION_NOT_REQUIRED);
            int id = pi.createSession(sp);
            try (PackageInstaller.Session ss = pi.openSession(id)) {
                try (InputStream in = new FileInputStream(f); OutputStream out = ss.openWrite("base.apk", 0, f.length())) {
                    byte[] b = new byte[1 << 16];
                    int n;
                    while ((n = in.read(b)) > 0) out.write(b, 0, n);
                    ss.fsync(out);
                }
                Intent i = new Intent(c, Sonuc.class).setAction(EYLEM_SONUC);
                int fl = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
                ss.commit(PendingIntent.getBroadcast(c, 31, i, fl).getIntentSender());
            }
            is = "kuruluyor";
            kurZamani = System.currentTimeMillis();
            hata = null;
            bildir(c);
            return null;
        } catch (Exception e) {
            hata = "kurulamadi";
            bildir(c);
            return "hata";
        }
    }

    /** Kurulum sonucu; sistem onay isterse onay penceresini açar */
    public static class Sonuc extends BroadcastReceiver {
        @Override
        public void onReceive(Context c, Intent i) {
            int st = i.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE);
            if (st == PackageInstaller.STATUS_PENDING_USER_ACTION) {
                Intent onay = i.getParcelableExtra(Intent.EXTRA_INTENT);
                if (onay != null && onayAc(c, onay)) return;
                // Onay penceresi açılamadı (Android'in arka plan kısıtları): kullanıcı "Sistem
                // yükleyicisiyle kur" düğmesine basabilsin
                is = "";
                hata = "onay-acilamadi";
                bildir(c);
                return;
            }
            is = "";
            // Başarılıysa uygulama zaten yeniden başlar; buraya genelde hata durumunda gelinir
            if (st != PackageInstaller.STATUS_SUCCESS) hata = st == PackageInstaller.STATUS_FAILURE_ABORTED ? "iptal" : "kurulamadi";
            bildir(c);
        }
    }

    /**
     * Sistemin onay penceresini açar. Önce öndeki etkinlikten (alıcının bağlamından açmak yeni
     * Android'lerde arka plan kısıtına takılabilir), olmazsa uygulama bağlamından.
     */
    static boolean onayAc(Context c, Intent onay) {
        Activity a = onde.get();
        if (a != null && !a.isFinishing()) {
            try {
                a.startActivity(onay);
                return true;
            } catch (Exception ignored) {}
        }
        try {
            onay.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(onay);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Yedek yol: indirilen APK'yı Android'in kendi yükleyicisiyle açar (her zamanki "Yükle"
     * ekranı). Yalnız kullanıcı düğmeye basınca çağrılır; APK aynı denetimlerden geçer.
     */
    public static String sistemleKur(Activity a) {
        Context c = a.getApplicationContext();
        if (EnkazServisi.aktif(c)) return "enkaz-acik";
        if (Build.VERSION.SDK_INT >= 26 && !c.getPackageManager().canRequestPackageInstalls()) return "izin-gerekli";
        File f = apk(c);
        if (!f.isFile() || p(c).getString("hazirSurum", "").isEmpty()) return "hazir-degil";
        if (apkDenetle(c, f) != null) {
            f.delete();
            p(c).edit().remove("hazirSurum").apply();
            return "hazir-degil";
        }
        try {
            Uri u = FileProvider.getUriForFile(c, c.getPackageName() + ".fileprovider", f);
            Intent i = new Intent(Intent.ACTION_VIEW).setDataAndType(u, "application/vnd.android.package-archive");
            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            a.startActivity(i);
            hata = null;
            bildir(c);
            return null;
        } catch (Exception e) {
            return "kurulamadi";
        }
    }

    // ------------------------------------------------------------------ yardımcılar

    private static byte[] oku(InputStream in) throws Exception {
        java.io.ByteArrayOutputStream o = new java.io.ByteArrayOutputStream();
        byte[] b = new byte[16384];
        int n;
        while ((n = in.read(b)) > 0) o.write(b, 0, n);
        return o.toByteArray();
    }

    private static String hex(byte[] b) {
        StringBuilder s = new StringBuilder();
        for (byte x : b) s.append(String.format("%02x", x));
        return s.toString();
    }

    /** Kurulan sürüm artık güncel olduysa önbellekteki APK'yı siler */
    static void temizle(Context c) {
        SharedPreferences s = p(c);
        Integer k = karsilastir(s.getString("yeniSurum", ""), kurulu(c));
        if (k == null || k <= 0) {
            apk(c).delete();
            s.edit().remove("hazirSurum").apply();
        }
    }
}
