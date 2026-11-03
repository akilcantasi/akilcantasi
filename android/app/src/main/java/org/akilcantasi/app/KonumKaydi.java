package org.akilcantasi.app;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Build;
import android.os.HandlerThread;
import android.os.SystemClock;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.work.ExistingWorkPolicy;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;

/**
 * Son bilinen konum kaydı. Yalnız bu telefonda (SharedPreferences) tutulur, hiçbir yere gönderilmez.
 *
 *  • Uygulama konum bulduğunda (harita, enkaz modu) ekle() ile yazılır.
 *  • İsteğe bağlı arka plan kaydı (varsayılan kapalı): "saatlik" ya da "hareketli"
 *    (son kayıttan bu yana 200 m'den çok yer değiştirdiyse sonraki deneme 15 dk sonra).
 *    WorkManager ile zincirlenen tek seferlik görevler; telefon yeniden başlasa da sürer.
 *    Her görev önce telefonun elindeki son konuma bakar (başka uygulamaların bulduğu konum
 *    bedavadır); taze değilse en çok 60 sn GPS dener.
 *
 * Arka planda konum için "Her zaman izin ver" (ACCESS_BACKGROUND_LOCATION) gerekir.
 */
public final class KonumKaydi {

    static final String PREFS = "konum_kaydi";
    static final String IS = "konum-kaydi";
    static final int EN_COK = 24;
    /** Bu kadar yakın ve yeni bir kayıt varsa yenisi eklenmez (aynı yerde saatte bir kayıt yeter) */
    static final float AYNI_YER_M = 50f;
    static final long AYNI_SURE_MS = 50 * 60 * 1000L;
    static final long SAATLIK_DK = 60, SIK_DK = 15;
    static final float HAREKET_M = 200f;

    private KonumKaydi() {}

    private static SharedPreferences p(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    /** "kapali" | "saatlik" | "hareketli" */
    public static String mod(Context c) {
        return p(c).getString("mod", "kapali");
    }

    public static synchronized JSONArray liste(Context c) {
        try {
            return new JSONArray(p(c).getString("liste", "[]"));
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    public static JSONObject son(Context c) {
        JSONArray a = liste(c);
        return a.length() > 0 ? a.optJSONObject(0) : null;
    }

    /** En yeni başta. kaynak: "gps" | "ag" | "uygulama" | "arka-plan" | "pasif" */
    public static synchronized boolean ekle(Context c, double lat, double lon, float dogruluk, long zaman, String kaynak) {
        if (Double.isNaN(lat) || Double.isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return false;
        JSONArray a = liste(c);
        JSONObject s = a.length() > 0 ? a.optJSONObject(0) : null;
        if (s != null) {
            float[] d = new float[1];
            Location.distanceBetween(s.optDouble("lat"), s.optDouble("lon"), lat, lon, d);
            long fark = zaman - s.optLong("zaman");
            // Eskiyse yazma; ama telefon saati geri gittiyse (şebekesiz saat kayması) kayıt
            // tamamen durmasın: 10 dakikadan fazla "geçmişe" düşen yeni konum yine yazılır
            if (fark < 0 && fark > -10 * 60_000L) return false;
            if (d[0] < AYNI_YER_M && fark < AYNI_SURE_MS) {
                if (dogruluk > 0 && dogruluk < s.optDouble("dogruluk", 1e9)) {
                    try {
                        s.put("lat", lat).put("lon", lon).put("dogruluk", dogruluk).put("zaman", zaman).put("kaynak", kaynak);
                    } catch (Exception ignored) {}
                    kaydet(c, a);
                    return true;
                }
                return false;
            }
        }
        try {
            JSONObject o = new JSONObject();
            o.put("lat", lat).put("lon", lon).put("dogruluk", dogruluk).put("zaman", zaman).put("kaynak", kaynak);
            JSONArray yeni = new JSONArray();
            yeni.put(o);
            for (int i = 0; i < a.length() && yeni.length() < EN_COK; i++) yeni.put(a.get(i));
            kaydet(c, yeni);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Konumun zamanı telefon saatine göre yazılır (GPS'in kendi saati değil): şebekesiz telefonun
     * saati yanlışsa iki saat karışır, yaş hesabı ve "eskiyse yazma" denetimi bozulur.
     */
    public static void ekle(Context c, Location l, String kaynak) {
        if (l == null) return;
        ekle(c, l.getLatitude(), l.getLongitude(), l.hasAccuracy() ? l.getAccuracy() : 0, System.currentTimeMillis() - yasMs(l), kaynak);
    }

    /** Konumun yaşı (ms), işlemcinin açılıştan beri saatine göre */
    static long yasMs(Location l) {
        long n = l.getElapsedRealtimeNanos();
        if (n <= 0) return Math.max(0, System.currentTimeMillis() - l.getTime());
        return Math.max(0, (SystemClock.elapsedRealtimeNanos() - n) / 1_000_000L);
    }

    public static synchronized void temizle(Context c) {
        kaydet(c, new JSONArray());
    }

    private static void kaydet(Context c, JSONArray a) {
        p(c).edit().putString("liste", a.toString()).apply();
    }

    // ------------------------------------------------------------------ arka plan planı

    public static boolean arkaPlanIzni(Context c) {
        if (ContextCompat.checkSelfPermission(c, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED
                && ContextCompat.checkSelfPermission(c, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) return false;
        return Build.VERSION.SDK_INT < 29
                || ContextCompat.checkSelfPermission(c, Manifest.permission.ACCESS_BACKGROUND_LOCATION) == PackageManager.PERMISSION_GRANTED;
    }

    public static void modAyarla(Context c, String mod) {
        if (!"saatlik".equals(mod) && !"hareketli".equals(mod)) mod = "kapali";
        p(c).edit().putString("mod", mod).apply();
        if ("kapali".equals(mod)) WorkManager.getInstance(c).cancelUniqueWork(IS);
        else planla(c, 1, ExistingWorkPolicy.REPLACE);
    }

    static void planla(Context c, long dk, ExistingWorkPolicy pol) {
        OneTimeWorkRequest r = new OneTimeWorkRequest.Builder(Isci.class).setInitialDelay(dk, TimeUnit.MINUTES).build();
        WorkManager.getInstance(c).enqueueUniqueWork(IS, pol, r);
    }

    /** Arka plan görevi: bir konum dener, kaydeder, bir sonrakini planlar */
    public static class Isci extends Worker {
        public Isci(@NonNull Context c, @NonNull WorkerParameters p) {
            super(c, p);
        }

        @NonNull
        @Override
        public Result doWork() {
            Context c = getApplicationContext();
            String mod = mod(c);
            if ("kapali".equals(mod)) return Result.success();
            JSONObject once = son(c);
            Location l = null;
            if (arkaPlanIzni(c)) {
                try {
                    l = konumAl(c);
                } catch (Exception ignored) {}
            }
            if (l != null) ekle(c, l, "arka-plan");
            long sonraki = SAATLIK_DK;
            if ("hareketli".equals(mod) && l != null && once != null) {
                float[] d = new float[1];
                Location.distanceBetween(once.optDouble("lat"), once.optDouble("lon"), l.getLatitude(), l.getLongitude(), d);
                if (d[0] > HAREKET_M) sonraki = SIK_DK;
            }
            // Görevin içinden kendini yeniden planlarken APPEND_OR_REPLACE: çalışan görev iptal edilmez
            planla(c, sonraki, ExistingWorkPolicy.APPEND_OR_REPLACE);
            return Result.success();
        }
    }

    /**
     * Taze (10 dk) bilinen konum; yoksa en çok 75 sn içinde yeni konum. İnternetsiz soğuk GPS
     * 30 sn'den uzun sürebildiği için getCurrentLocation (30 sn sınırlı) yerine kendi süremiz.
     * İzin yoksa SecurityException.
     */
    @SuppressWarnings("MissingPermission")
    static Location konumAl(Context c) throws InterruptedException {
        LocationManager lm = (LocationManager) c.getSystemService(Context.LOCATION_SERVICE);
        if (lm == null) return null;
        Location en = null;
        for (String pr : lm.getProviders(true)) {
            Location l = lm.getLastKnownLocation(pr);
            if (l == null || yasMs(l) > 10 * 60 * 1000L) continue;
            if (en == null || (l.hasAccuracy() && l.getAccuracy() < en.getAccuracy())) en = l;
        }
        if (en != null && en.hasAccuracy() && en.getAccuracy() <= 100) return en;
        String pr = lm.isProviderEnabled(LocationManager.GPS_PROVIDER) ? LocationManager.GPS_PROVIDER
                : lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER) ? LocationManager.NETWORK_PROVIDER : null;
        if (pr == null) return en;
        final Location[] sonuc = { null };
        final CountDownLatch bitti = new CountDownLatch(1);
        HandlerThread is = new HandlerThread("konum-kaydi");
        is.start();
        // Lambda değil: Android 10 öncesinde diğer yöntemler soyut (varsayılan yok), çağrılınca çöker
        android.location.LocationListener dl = new android.location.LocationListener() {
            @Override
            public void onLocationChanged(Location l) {
                // Yeterince doğruysa bitir; değilse daha iyisini bekle
                if (sonuc[0] == null || (l.hasAccuracy() && l.getAccuracy() < sonuc[0].getAccuracy())) sonuc[0] = l;
                if (l.hasAccuracy() && l.getAccuracy() <= 50) bitti.countDown();
            }

            @Override
            public void onProviderEnabled(String p) {}

            @Override
            public void onProviderDisabled(String p) {}

            @Override
            public void onStatusChanged(String p, int st, android.os.Bundle b) {}
        };
        try {
            lm.requestLocationUpdates(pr, 1000, 0, dl, is.getLooper());
            bitti.await(75, TimeUnit.SECONDS);
        } finally {
            lm.removeUpdates(dl);
            is.quitSafely();
        }
        return sonuc[0] != null ? sonuc[0] : en;
    }
}
