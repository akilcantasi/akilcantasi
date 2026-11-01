package org.akilcantasi.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

/**
 * Paket indirilirken çalışan ön plan servisi. Bildirimde ilerlemeyi gösterir ve
 * ekran kapansa ya da uygulamadan çıkılsa da indirmenin sürmesini sağlar.
 * Etkin indirme kalmayınca kendini kapatır.
 */
public class IndirmeServisi extends Service {

    static final String CHANNEL = "indirme";
    static final int NOTIF_ID = 4211;

    private final Handler handler = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;
    private boolean foreground;

    /** İndirme başlarken çağrılır (uygulama ön plandayken). */
    public static void ensureRunning(Context ctx) {
        try {
            Intent i = new Intent(ctx, IndirmeServisi.class);
            if (Build.VERSION.SDK_INT >= 26) ctx.startForegroundService(i);
            else ctx.startService(i);
        } catch (Exception ignored) {
            // Arka plandan başlatma kısıtı vb.: indirme yine sürer, yalnız bildirim olmaz
        }
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createChannel();
        Notification n = build();
        try {
            ServiceCompat.startForeground(this, NOTIF_ID, n,
                Build.VERSION.SDK_INT >= 29 ? ServiceInfo.FOREGROUND_SERVICE_TYPE_DATA_SYNC : 0);
            foreground = true;
        } catch (Exception e) {
            stopSelf();
            return START_NOT_STICKY;
        }
        try {
            if (wakeLock == null) {
                PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "AkilCantasi:Indirme");
                wakeLock.setReferenceCounted(false);
            }
            wakeLock.acquire(12 * 60 * 60 * 1000L);
        } catch (Exception ignored) {}
        handler.removeCallbacks(tick);
        handler.postDelayed(tick, 1000);
        return START_NOT_STICKY;
    }

    private final Runnable tick = new Runnable() {
        @Override
        public void run() {
            PaketIndirici d = PaketIndirici.get(IndirmeServisi.this);
            if (!d.hasActive()) {
                finish();
                return;
            }
            NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
            try { nm.notify(NOTIF_ID, build()); } catch (Exception ignored) {}
            handler.postDelayed(this, 1000);
        }
    };

    private void finish() {
        handler.removeCallbacks(tick);
        try { if (wakeLock != null && wakeLock.isHeld()) wakeLock.release(); } catch (Exception ignored) {}
        if (foreground) ServiceCompat.stopForeground(this, ServiceCompat.STOP_FOREGROUND_REMOVE);
        foreground = false;
        stopSelf();
    }

    /** Android 15+: veri eşitleme servislerinin günlük süresi dolunca. İndirme uygulama açıkken sürer. */
    @Override
    public void onTimeout(int startId, int fgsType) {
        finish();
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacks(tick);
        try { if (wakeLock != null && wakeLock.isHeld()) wakeLock.release(); } catch (Exception ignored) {}
        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    private void createChannel() {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm.getNotificationChannel(CHANNEL) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, "Paket indirme", NotificationManager.IMPORTANCE_LOW);
        ch.setDescription("Çevrimdışı paketler indirilirken ilerlemeyi gösterir");
        ch.setShowBadge(false);
        nm.createNotificationChannel(ch);
    }

    private Notification build() {
        PaketIndirici d = PaketIndirici.get(this);
        long[] s = d.summary(); // [sayı, alınan, toplam, hız]
        String name = d.activeName();
        String title = s[0] > 1 ? s[0] + " paket indiriliyor" : (name != null ? name : "Paket indiriliyor");
        StringBuilder text = new StringBuilder();
        if (s[2] > 0) text.append(PaketIndirici.fmt(s[1])).append(" / ").append(PaketIndirici.fmt(s[2]));
        if (s[3] > 0) text.append(text.length() > 0 ? " · " : "").append(PaketIndirici.fmt(s[3])).append("/sn");
        if (text.length() == 0) text.append("En hızlı kaynak aranıyor…");

        Intent open = getPackageManager().getLaunchIntentForPackage(getPackageName());
        PendingIntent pi = open == null ? null : PendingIntent.getActivity(this, 0, open,
            PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0));

        NotificationCompat.Builder b = new NotificationCompat.Builder(this, CHANNEL)
            .setSmallIcon(android.R.drawable.stat_sys_download)
            .setContentTitle(title)
            .setContentText(text.toString())
            .setOnlyAlertOnce(true)
            .setOngoing(true)
            .setSilent(true)
            .setCategory(NotificationCompat.CATEGORY_PROGRESS);
        if (pi != null) b.setContentIntent(pi);
        if (s[2] > 0) b.setProgress(1000, (int) Math.min(1000, s[1] * 1000 / s[2]), false);
        else b.setProgress(0, 0, true);
        return b.build();
    }
}
