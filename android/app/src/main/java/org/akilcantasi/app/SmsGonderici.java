package org.akilcantasi.app;

import android.Manifest;
import android.app.AlarmManager;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Handler;
import android.os.Looper;
import android.telephony.PhoneStateListener;
import android.telephony.ServiceState;
import android.telephony.SmsManager;
import android.telephony.TelephonyCallback;
import android.telephony.TelephonyManager;

import androidx.annotation.RequiresApi;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

/**
 * SMS giden kutusunun Android tarafı: SmsKuyrugu'ndaki mesajları SmsManager ile gönderir,
 * sonuçları (SmsAlici) kuyruğa işler ve mesaj gidene kadar yeniden denemeyi sürdürür:
 *   • AlarmManager ile sıradaki deneme zamanında uyanır (uygulama kapalıyken de, cihaz uykudayken de)
 *   • uygulama açıkken şebeke geri geldiği anda (ServiceState) bekleyenleri hemen dener
 *   • telefon yeniden başlarsa (AcilisAlici) kuyruk kaldığı yerden sürer
 *   • bekleyen mesaj varken kalıcı bir bildirim durumu gösterir
 */
public final class SmsGonderici {

    public static final String ACTION_SENT = "org.akilcantasi.app.SMS_SENT";
    public static final String ACTION_DELIVERED = "org.akilcantasi.app.SMS_DELIVERED";
    public static final String ACTION_TEKRAR = "org.akilcantasi.app.SMS_TEKRAR";
    private static final String CHANNEL = "sms";
    private static final int NOTIF_BEKLIYOR = 4301;
    private static final int NOTIF_SONUC = 4302;

    private static SmsKuyrugu kuyruk;
    private static Runnable dinleyici;
    private static Object servisDinleyici;

    private SmsGonderici() {}

    public static synchronized SmsKuyrugu kuyruk(Context ctx) {
        if (kuyruk == null) kuyruk = new SmsKuyrugu(new File(ctx.getApplicationContext().getFilesDir(), "sms-kutusu.json"));
        return kuyruk;
    }

    /** Eklenti (JS) değişiklikleri dinler */
    public static void dinle(Runnable r) {
        dinleyici = r;
    }

    static void degisti() {
        Runnable r = dinleyici;
        if (r != null) {
            try {
                r.run();
            } catch (Exception ignored) {
            }
        }
    }

    public static boolean izinVar(Context ctx) {
        return ContextCompat.checkSelfPermission(ctx, Manifest.permission.SEND_SMS) == PackageManager.PERMISSION_GRANTED;
    }

    /** Hazır olan her mesajı gönderir, sonra bir sonraki uyanmayı planlar. */
    public static synchronized void isle(Context c) {
        Context ctx = c.getApplicationContext();
        SmsKuyrugu q = kuyruk(ctx);
        long now = System.currentTimeMillis();
        List<SmsKuyrugu.Mesaj> hazir = q.hazirOlanlar(now);
        for (SmsKuyrugu.Mesaj m : hazir) {
            if (!izinVar(ctx)) {
                q.baslatilamadi(m.id, "SMS izni yok", now);
                continue;
            }
            try {
                SmsManager sm = smsManager(ctx);
                ArrayList<String> parts = sm.divideMessage(m.body);
                int attempt = q.basladi(m.id, parts.size(), now);
                ArrayList<PendingIntent> sent = new ArrayList<>();
                ArrayList<PendingIntent> delivered = new ArrayList<>();
                for (int i = 0; i < parts.size(); i++) {
                    sent.add(sonucNiyeti(ctx, ACTION_SENT, m.id, attempt, i));
                    delivered.add(sonucNiyeti(ctx, ACTION_DELIVERED, m.id, attempt, i));
                }
                if (parts.size() == 1) sm.sendTextMessage(m.to, null, parts.get(0), sent.get(0), delivered.get(0));
                else sm.sendMultipartTextMessage(m.to, null, parts, sent, delivered);
            } catch (Exception e) {
                SmsKuyrugu.Mesaj cur = q.bul(m.id);
                if (cur != null && "gonderiliyor".equals(cur.state)) q.gonderimSonucu(m.id, cur.attempts, "Gönderilemedi: " + e.getClass().getSimpleName(), now);
                else q.baslatilamadi(m.id, "Gönderilemedi: " + e.getClass().getSimpleName(), now);
            }
        }
        planla(ctx);
        bildirimGuncelle(ctx);
        degisti();
    }

    @SuppressWarnings("deprecation")
    private static SmsManager smsManager(Context ctx) {
        if (Build.VERSION.SDK_INT >= 31) {
            SmsManager sm = ctx.getSystemService(SmsManager.class);
            if (sm != null) return sm;
        }
        return SmsManager.getDefault();
    }

    private static PendingIntent sonucNiyeti(Context ctx, String action, String id, int attempt, int part) {
        Intent i = new Intent(ctx, SmsAlici.class).setAction(action);
        i.putExtra("id", id).putExtra("attempt", attempt).putExtra("part", part);
        int code = (action + id + ":" + attempt + ":" + part).hashCode();
        // Sistem sonuç koduna ek bilgi (errorCode, pdu) yazar: Android 12+ için değiştirilebilir niyet gerekir
        int flags = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
        return PendingIntent.getBroadcast(ctx, code, i, flags);
    }

    /** Sıradaki denemeye alarm kurar; bekleyen yoksa alarmı ve şebeke dinleyicisini kaldırır. */
    static void planla(Context ctx) {
        SmsKuyrugu q = kuyruk(ctx);
        AlarmManager am = (AlarmManager) ctx.getSystemService(Context.ALARM_SERVICE);
        Intent i = new Intent(ctx, SmsAlici.class).setAction(ACTION_TEKRAR);
        PendingIntent pi = PendingIntent.getBroadcast(ctx, 4300, i, PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0));
        long at = q.sonrakiUyanma();
        if (am != null) {
            am.cancel(pi);
            if (at > 0) {
                long when = Math.max(at, System.currentTimeMillis() + 1000);
                if (Build.VERSION.SDK_INT >= 23) am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, when, pi);
                else am.set(AlarmManager.RTC_WAKEUP, when, pi);
            }
        }
        if (q.acikSayisi() > 0) servisiDinle(ctx);
        else servisiBirak(ctx);
    }

    // ------------------------------------------------------------------ şebeke geri gelince

    private static void servisGeldi(Context ctx) {
        if (kuyruk(ctx).servisGeldi(System.currentTimeMillis())) isle(ctx);
    }

    private static void servisiDinle(Context c) {
        if (servisDinleyici != null) return;
        Context ctx = c.getApplicationContext();
        TelephonyManager tm = (TelephonyManager) ctx.getSystemService(Context.TELEPHONY_SERVICE);
        if (tm == null) return;
        new Handler(Looper.getMainLooper()).post(() -> {
            if (servisDinleyici != null) return;
            try {
                if (Build.VERSION.SDK_INT >= 31) {
                    ServisCagrisi cb = new ServisCagrisi(ctx);
                    tm.registerTelephonyCallback(ctx.getMainExecutor(), cb);
                    servisDinleyici = cb;
                } else {
                    PhoneStateListener l = new PhoneStateListener() {
                        @Override
                        public void onServiceStateChanged(ServiceState s) {
                            if (s != null && s.getState() == ServiceState.STATE_IN_SERVICE) servisGeldi(ctx);
                        }
                    };
                    tm.listen(l, PhoneStateListener.LISTEN_SERVICE_STATE);
                    servisDinleyici = l;
                }
            } catch (Exception ignored) {
                // Bazı cihazlar izin ister; alarm yine de yeniden dener
            }
        });
    }

    private static void servisiBirak(Context c) {
        Object l = servisDinleyici;
        if (l == null) return;
        servisDinleyici = null;
        TelephonyManager tm = (TelephonyManager) c.getApplicationContext().getSystemService(Context.TELEPHONY_SERVICE);
        if (tm == null) return;
        try {
            if (Build.VERSION.SDK_INT >= 31 && l instanceof TelephonyCallback) tm.unregisterTelephonyCallback((TelephonyCallback) l);
            else if (l instanceof PhoneStateListener) tm.listen((PhoneStateListener) l, PhoneStateListener.LISTEN_NONE);
        } catch (Exception ignored) {
        }
    }

    @RequiresApi(31)
    private static final class ServisCagrisi extends TelephonyCallback implements TelephonyCallback.ServiceStateListener {
        private final Context ctx;

        ServisCagrisi(Context ctx) {
            this.ctx = ctx;
        }

        @Override
        public void onServiceStateChanged(ServiceState s) {
            if (s != null && s.getState() == ServiceState.STATE_IN_SERVICE) servisGeldi(ctx);
        }
    }

    // ------------------------------------------------------------------ bildirim

    private static boolean bildirimIzni(Context ctx) {
        if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(ctx, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return false;
        return NotificationManagerCompat.from(ctx).areNotificationsEnabled();
    }

    private static void kanal(Context ctx) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null || nm.getNotificationChannel(CHANNEL) != null) return;
        NotificationChannel ch = new NotificationChannel(CHANNEL, "SMS giden kutusu", NotificationManager.IMPORTANCE_DEFAULT);
        ch.setDescription("Şebeke beklenen ve gönderilen acil SMS'ler");
        nm.createNotificationChannel(ch);
    }

    private static PendingIntent acilis(Context ctx) {
        Intent open = ctx.getPackageManager().getLaunchIntentForPackage(ctx.getPackageName());
        if (open == null) return null;
        return PendingIntent.getActivity(ctx, 4303, open, PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 23 ? PendingIntent.FLAG_IMMUTABLE : 0));
    }

    /** Bekleyen varsa kalıcı "N SMS bekliyor" bildirimi; yoksa kaldırılır. */
    static void bildirimGuncelle(Context ctx) {
        if (!bildirimIzni(ctx)) return;
        kanal(ctx);
        NotificationManagerCompat nm = NotificationManagerCompat.from(ctx);
        int n = kuyruk(ctx).acikSayisi();
        try {
            if (n == 0) {
                nm.cancel(NOTIF_BEKLIYOR);
                return;
            }
            NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL)
                .setSmallIcon(android.R.drawable.sym_action_email)
                .setContentTitle(n == 1 ? "1 SMS gönderilmeyi bekliyor" : n + " SMS gönderilmeyi bekliyor")
                .setContentText("Şebeke gelince otomatik gönderilecek. Telefonu kapatmayın.")
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setSilent(true)
                .setCategory(NotificationCompat.CATEGORY_STATUS);
            PendingIntent pi = acilis(ctx);
            if (pi != null) b.setContentIntent(pi);
            nm.notify(NOTIF_BEKLIYOR, b.build());
        } catch (SecurityException ignored) {
        }
    }

    /** Bir mesaj sonuçlandığında (gitti, ulaştı, vazgeçildi) kısa bildirim. */
    static void sonucBildir(Context ctx, SmsKuyrugu.Mesaj m) {
        if (m == null || !bildirimIzni(ctx)) return;
        kanal(ctx);
        String kime = m.name != null && !m.name.isEmpty() ? m.name : m.to;
        String title;
        switch (m.state) {
            case "gitti": title = "SMS gönderildi: " + kime; break;
            case "ulasti": title = "SMS ulaştı: " + kime; break;
            case "hata": title = "SMS gönderilemedi: " + kime; break;
            default: return;
        }
        NotificationCompat.Builder b = new NotificationCompat.Builder(ctx, CHANNEL)
            .setSmallIcon(android.R.drawable.sym_action_email)
            .setContentTitle(title)
            .setContentText("hata".equals(m.state) ? "3 gün boyunca denendi. Uygulamadan yeniden deneyebilirsiniz." : m.attempts > 1 ? m.attempts + ". denemede gitti." : m.body)
            .setAutoCancel(true)
            .setOnlyAlertOnce(true);
        PendingIntent pi = acilis(ctx);
        if (pi != null) b.setContentIntent(pi);
        try {
            NotificationManagerCompat.from(ctx).notify(NOTIF_SONUC + Math.abs(m.id.hashCode() % 1000), b.build());
        } catch (SecurityException ignored) {
        }
    }
}
