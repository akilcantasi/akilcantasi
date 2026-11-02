package org.akilcantasi.app;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.NotificationManagerCompat;

import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

/**
 * Deneysel, isteğe bağlı (varsayılan kapalı): güçlü sarsıntıdan sonra telefon hareketsiz
 * kalırsa "Enkaz altında mısınız?" diye sorar; 3 dakika yanıt gelmezse enkaz modunu
 * otomatik açar (yalnız işaret, ses ve ışık; SMS kullanıcı onayı olmadan gitmez).
 *
 * Sarsıntı ölçütü (yürüme ve taşımayla karışmasın diye), SarsintiDedektoru:
 *   önce en az 30 sn sakin → yönü değişmeden (≤25°) en az 4 sn güçlü titreşim →
 *   ardından 2 dk hareketsizlik. Telefon bu sırada belirgin hareket ederse soru iptal edilir.
 */
public class SarsintiServisi extends Service implements SensorEventListener {

    static final int BILDIRIM = 4321;
    static final int BILDIRIM_SORU = 4322;
    static final String EYLEM_IYIYIM = "org.akilcantasi.app.SARSINTI_IYIYIM";
    static final String EYLEM_AC = "org.akilcantasi.app.SARSINTI_AC";
    static final long SORU_SURESI_MS = 3 * 60_000L;

    private final Handler h = new Handler(Looper.getMainLooper());
    private final SarsintiDedektoru d = new SarsintiDedektoru();
    private SensorManager sm;
    private long soruZamani;
    /** Uyandıran ivmeölçer yoksa sürekli; varsa yalnız soru süresince */
    private PowerManager.WakeLock kilit;

    public static boolean acik(Context c) {
        return EnkazServisi.prefs(c).getBoolean("sarsinti", false);
    }

    public static void ayarla(Context c, boolean ac) {
        EnkazServisi.prefs(c).edit().putBoolean("sarsinti", ac).apply();
        Intent i = new Intent(c, SarsintiServisi.class);
        if (!ac) {
            c.stopService(i);
            return;
        }
        if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i);
        else c.startService(i);
    }

    @Override
    public IBinder onBind(Intent i) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        String a = intent == null ? null : intent.getAction();
        if (EYLEM_IYIYIM.equals(a)) {
            soruIptal();
            return START_STICKY;
        }
        if (EYLEM_AC.equals(a)) {
            soruIptal();
            enkazAc(false);
            return START_STICKY;
        }
        if (!acik(this)) {
            stopSelf();
            return START_NOT_STICKY;
        }
        EnkazServisi.kanallar(this);
        try {
            ServiceCompat.startForeground(this, BILDIRIM, kalici(),
                    Build.VERSION.SDK_INT >= 34 ? ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE : 0);
        } catch (Exception e) {
            stopSelf();
            return START_NOT_STICKY;
        }
        if (sm == null) {
            sm = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
            // Uyandıran sensör varsa o: telefon uykudayken de örnekler kaybolmaz
            Sensor s = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER, true);
            boolean uyandiran = s != null;
            if (s == null) s = sm.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
            // Uyandıran sensör yoksa işlemci uyuduğunda örnekler kaybolur: kısmi uyanıklık kilidi
            // (pili biraz daha çok kullanır; ayarda belirtiliyor)
            if (!uyandiran) kilitAl(0);
            if (s != null) sm.registerListener(this, s, 40_000, uyandiran ? 5_000_000 : 0);
        }
        return START_STICKY;
    }

    private void kilitAl(long ms) {
        try {
            if (kilit == null) {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                kilit = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "AkilCantasi:Sarsinti");
                kilit.setReferenceCounted(false);
            }
            if (ms > 0) kilit.acquire(ms);
            else kilit.acquire();
        } catch (Exception ignored) {}
    }

    @Override
    public void onDestroy() {
        try {
            if (kilit != null && kilit.isHeld()) kilit.release();
        } catch (Exception ignored) {}
        if (sm != null) sm.unregisterListener(this);
        h.removeCallbacksAndMessages(null);
        super.onDestroy();
    }

    @Override
    public void onSensorChanged(SensorEvent e) {
        int sonuc = d.ornek(e.timestamp / 1_000_000L, e.values[0], e.values[1], e.values[2]);
        if (sonuc == SarsintiDedektoru.SOR && soruZamani == 0 && !EnkazServisi.aktif(this)) soruGoster();
        else if (sonuc == SarsintiDedektoru.HAREKET && soruZamani != 0) soruIptal();
    }

    @Override
    public void onAccuracyChanged(Sensor s, int a) {}

    private final Runnable otomatik = () -> {
        if (soruZamani == 0) return;
        soruIptal();
        enkazAc(true);
    };

    private void soruGoster() {
        // Bildirim kapalıysa soru görünmez, iptal edilemez: kendiliğinden açma yapılmaz
        if (!NotificationManagerCompat.from(this).areNotificationsEnabled()) return;
        soruZamani = System.currentTimeMillis();
        // 3 dakikalık süre ekran kapalıyken de işlesin
        if (kilit == null || !kilit.isHeld()) kilitAl(SORU_SURESI_MS + 60_000L);
        PendingIntent iyi = PendingIntent.getService(this, 21, new Intent(this, SarsintiServisi.class).setAction(EYLEM_IYIYIM),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        PendingIntent ac = PendingIntent.getService(this, 22, new Intent(this, SarsintiServisi.class).setAction(EYLEM_AC),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        Notification n = new NotificationCompat.Builder(this, EnkazServisi.KANAL_UYARI)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Sarsıntı algılandı. İyi misiniz?")
                .setContentText("3 dakika içinde yanıt yoksa enkaz modu açılacak (işaret, ses, ışık).")
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setOngoing(true)
                .setTimeoutAfter(SORU_SURESI_MS)
                .setContentIntent(EnkazServisi.uygulamayaAc(this, "enkaz", 23))
                .addAction(0, "İyiyim", iyi)
                .addAction(0, "Enkaz modunu aç", ac)
                .build();
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        try {
            nm.notify(BILDIRIM_SORU, n);
        } catch (Exception ignored) {}
        h.postDelayed(otomatik, SORU_SURESI_MS);
    }

    private void soruIptal() {
        soruZamani = 0;
        h.removeCallbacks(otomatik);
        d.sifirla();
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(BILDIRIM_SORU);
    }

    private void enkazAc(boolean oto) {
        String et = EnkazServisi.prefs(this).getString("hazirEtiket", "");
        int kat = EnkazServisi.prefs(this).getInt("hazirKat", EnkazIsareti.KAT_YOK);
        try {
            EnkazServisi.baslat(this, et, kat, oto);
        } catch (Exception ignored) {}
    }

    private Notification kalici() {
        return new NotificationCompat.Builder(this, EnkazServisi.KANAL)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Sarsıntı nöbeti açık")
                .setContentText("Güçlü sarsıntıdan sonra iyi olup olmadığınız sorulur.")
                .setOngoing(true)
                .setContentIntent(EnkazServisi.uygulamayaAc(this, "enkaz", 24))
                .build();
    }
}
