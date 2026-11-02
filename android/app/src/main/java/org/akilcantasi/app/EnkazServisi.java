package org.akilcantasi.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.AdvertiseCallback;
import android.bluetooth.le.AdvertiseData;
import android.bluetooth.le.AdvertiseSettings;
import android.bluetooth.le.BluetoothLeAdvertiser;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.pm.ServiceInfo;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.location.Location;
import android.media.AudioAttributes;
import android.media.AudioFormat;
import android.media.AudioManager;
import android.media.AudioTrack;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.Looper;
import android.os.PowerManager;

import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONObject;

import java.util.Random;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Enkaz modu: telefon günlerce kendini bulunur kılar. Ön plan servisi; uygulama kapansa da sürer.
 *
 *  • Bluetooth (BLE) işareti: kimlik, son konum ve yaşı, kat, pil (EnkazIsareti). Sürekli,
 *    düşük güçte; içerik 5 dakikada bir tazelenir. Uygulama yüklü telefonlar duyar.
 *  • SOS ses (~3 kHz düdük, alarm sesi düzeyinde) ve flaş: pile göre 1–10 dakikada bir.
 *  • GPS: 30 dakikada bir en çok 60 sn denenir; bulunursa kayda ve işarete girer.
 *  • Bluetooth adı "ENKAZ · …" yapılabilir (uygulamasız telefonların eşleştirme listesinde
 *    görünür); görünürlük Android'de en çok 1 saattir, bitince hatırlatma bildirimi çıkar.
 *
 * Durum her değişimde dinleyicilere (EnkazPlugin → JS "enkazDurum") iletilir.
 */
public class EnkazServisi extends Service {

    static final String KANAL = "enkaz";
    static final String KANAL_UYARI = "enkaz-uyari";
    static final int BILDIRIM = 4311;
    static final int BILDIRIM_GORUNUR = 4312;
    static final String PREFS = "enkaz";
    static final String EYLEM_SES = "org.akilcantasi.app.ENKAZ_SES";
    static final String EYLEM_DURDUR = "org.akilcantasi.app.ENKAZ_DURDUR";

    public interface Dinleyici {
        void durum(JSONObject d);
    }

    static final CopyOnWriteArrayList<Dinleyici> dinleyiciler = new CopyOnWriteArrayList<>();
    private static volatile EnkazServisi calisan;

    private final Handler h = new Handler(Looper.getMainLooper());
    private PowerManager.WakeLock wakeLock;
    private BluetoothLeAdvertiser reklamci;
    private AdvertiseCallback reklamCb;
    private String reklamDurum = "baslamadi";
    private long baslangic, sonSes, sonGps, sesDuraklatBitis;
    private int sesSayisi;
    private boolean sesCaliyor;
    private String torchId;
    private volatile boolean gpsDeneniyor;

    // ------------------------------------------------------------------ dışarıdan

    static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    /** Cihaz başına sabit, rastgele işaret kimliği */
    static int kimlik(Context c) {
        SharedPreferences p = prefs(c);
        int k = p.getInt("kimlik", 0);
        if (k == 0) {
            k = new Random().nextInt() | 1;
            p.edit().putInt("kimlik", k).apply();
        }
        return k;
    }

    public static boolean aktif(Context c) {
        return prefs(c).getBoolean("aktif", false);
    }

    /** etiket: "Ayşe · B blok 3. kat"; kat: KAT_YOK olabilir; otomatik: sarsıntıdan sonra kendiliğinden */
    public static void baslat(Context c, String etiket, int kat, boolean otomatik) {
        prefs(c).edit().putBoolean("aktif", true).putString("etiket", etiket == null ? "" : etiket).putInt("kat", kat)
                .putBoolean("otomatik", otomatik).putLong("baslangic", System.currentTimeMillis()).apply();
        calistir(c);
    }

    static void calistir(Context c) {
        Intent i = new Intent(c, EnkazServisi.class);
        if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i);
        else c.startService(i);
    }

    public static void durdur(Context c) {
        prefs(c).edit().putBoolean("aktif", false).apply();
        c.stopService(new Intent(c, EnkazServisi.class));
        EnkazBluetoothAdi.geriAl(c);
        bildir(c);
    }

    public static void sesCal(Context c) {
        EnkazServisi s = calisan;
        if (s != null) s.h.post(() -> s.sesCalSimdi(true));
    }

    /** dk = 0: sesi yeniden aç */
    public static void sesDuraklat(Context c, int dk) {
        EnkazServisi s = calisan;
        if (s == null) return;
        s.sesDuraklatBitis = dk <= 0 ? 0 : System.currentTimeMillis() + dk * 60_000L;
        bildir(c);
    }

    public static JSONObject durum(Context c) {
        JSONObject d = new JSONObject();
        SharedPreferences p = prefs(c);
        EnkazServisi s = calisan;
        try {
            d.put("aktif", p.getBoolean("aktif", false) && s != null);
            d.put("istenen", p.getBoolean("aktif", false));
            d.put("otomatik", p.getBoolean("otomatik", false));
            d.put("etiket", p.getString("etiket", ""));
            d.put("kat", p.getInt("kat", EnkazIsareti.KAT_YOK));
            d.put("kimlik", kimlik(c));
            d.put("baslangic", p.getLong("baslangic", 0));
            d.put("pil", pilYuzde(c));
            d.put("sesAraligiSn", sesAraligi(pilYuzde(c)) / 1000);
            d.put("bluetoothAdi", EnkazBluetoothAdi.aktif(c));
            d.put("gorunurBitis", p.getLong("gorunurBitis", 0));
            if (s != null) {
                d.put("reklam", s.reklamDurum);
                d.put("sonSes", s.sonSes);
                d.put("sesSayisi", s.sesSayisi);
                d.put("sesDuraklatBitis", s.sesDuraklatBitis);
                d.put("sonGps", s.sonGps);
                d.put("gpsDeneniyor", s.gpsDeneniyor);
            }
            JSONObject k = KonumKaydi.son(c);
            if (k != null) d.put("sonKonum", k);
        } catch (Exception ignored) {}
        return d;
    }

    static void bildir(Context c) {
        JSONObject d = durum(c);
        for (Dinleyici l : dinleyiciler) {
            try {
                l.durum(d);
            } catch (Exception ignored) {}
        }
    }

    // ------------------------------------------------------------------ servis

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        // Bildirim eylemleri startService ile gelir (ön plan zorunluluğu yok)
        if (intent != null && EYLEM_SES.equals(intent.getAction())) {
            if (calisan == null) {
                stopSelf();
                return START_NOT_STICKY;
            }
            h.post(() -> sesCalSimdi(true));
            return START_STICKY;
        }
        kanallar(this);
        // startForegroundService ile başlatıldıysa 5 sn içinde startForeground şart; kapanacak
        // olsak bile önce çağrılır (yoksa uygulama çöker)
        boolean on = onPlanaGec();
        if (intent != null && EYLEM_DURDUR.equals(intent.getAction())) {
            durdur(this);
            return START_NOT_STICKY;
        }
        if (!aktif(this) || !on) {
            stopSelf();
            return START_NOT_STICKY;
        }
        if (calisan == this) return START_STICKY;
        calisan = this;
        baslangic = System.currentTimeMillis();
        try {
            PowerManager pm = (PowerManager) getSystemService(Context.POWER_SERVICE);
            wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "AkilCantasi:Enkaz");
            wakeLock.setReferenceCounted(false);
            wakeLock.acquire();
        } catch (Exception ignored) {}
        alarmSesiniAc();
        reklamBaslat();
        h.post(dongu);
        // İlk ses birkaç saniye sonra (kullanıcı ekranı görsün)
        h.postDelayed(() -> sesCalSimdi(false), 3000);
        h.postDelayed(this::gpsDene, 5000);
        bildir(this);
        return START_STICKY;
    }

    /**
     * Ön plana geçer. Android 14+ arka plandan (açılış, sarsıntı, sistemin yeniden başlatması)
     * "konum" türüne, 15+ açılışta "medya" türüne izin vermeyebilir: türler azaltılarak denenir.
     * İşaret ve ses türden bağımsız çalışır; GPS arka plan konum izni varsa yine çalışır.
     */
    private boolean onPlanaGec() {
        if (Build.VERSION.SDK_INT < 29) {
            try {
                startForeground(BILDIRIM, bildirim());
                return true;
            } catch (Exception e) {
                return false;
            }
        }
        boolean konum = izin(Manifest.permission.ACCESS_FINE_LOCATION) || izin(Manifest.permission.ACCESS_COARSE_LOCATION);
        boolean bt = Build.VERSION.SDK_INT < 31 || izin(Manifest.permission.BLUETOOTH_ADVERTISE);
        int L = ServiceInfo.FOREGROUND_SERVICE_TYPE_LOCATION, C = ServiceInfo.FOREGROUND_SERVICE_TYPE_CONNECTED_DEVICE,
                M = ServiceInfo.FOREGROUND_SERVICE_TYPE_MEDIA_PLAYBACK;
        int[] denemeler = {
            (konum ? L : 0) | (bt ? C : 0) | M,
            (bt ? C : 0) | M,
            bt ? C : M,
            M,
        };
        Notification n = bildirim();
        for (int t : denemeler) {
            try {
                ServiceCompat.startForeground(this, BILDIRIM, n, t);
                return true;
            } catch (Exception ignored) {}
        }
        return false;
    }

    private boolean izin(String p) {
        return ContextCompat.checkSelfPermission(this, p) == PackageManager.PERMISSION_GRANTED;
    }

    @Override
    public void onDestroy() {
        if (calisan == this) calisan = null;
        h.removeCallbacksAndMessages(null);
        reklamDurdur();
        torch(false);
        alarmSesiniGeriAl();
        try {
            if (wakeLock != null && wakeLock.isHeld()) wakeLock.release();
        } catch (Exception ignored) {}
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm != null) nm.cancel(BILDIRIM_GORUNUR);
        bildir(this);
        super.onDestroy();
    }

    /** Her 15 sn: zamanı gelen işleri yapar */
    private final Runnable dongu = new Runnable() {
        @Override
        public void run() {
            long simdi = System.currentTimeMillis();
            int pil = pilYuzde(EnkazServisi.this);
            if (simdi - sonSes >= sesAraligi(pil) && simdi >= sesDuraklatBitis) sesCalSimdi(false);
            if (simdi - sonGps >= 30 * 60_000L) gpsDene();
            // İşaret içeriği (pil, konum yaşı) 5 dakikada bir tazelenir
            if (simdi - sonReklam >= 5 * 60_000L) reklamBaslat();
            gorunurlukDenetle(simdi);
            guncelleBildirim();
            h.postDelayed(this, 15_000);
        }
    };

    /** Pil azaldıkça ses seyrekleşir; hedef birkaç gün dayanmak */
    static long sesAraligi(int pil) {
        if (pil < 0 || pil >= 50) return 60_000;
        if (pil >= 20) return 120_000;
        if (pil >= 10) return 300_000;
        return 600_000;
    }

    static int pilYuzde(Context c) {
        try {
            BatteryManager bm = (BatteryManager) c.getSystemService(Context.BATTERY_SERVICE);
            int v = bm.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
            return v > 0 && v <= 100 ? v : -1;
        } catch (Exception e) {
            return -1;
        }
    }

    // ------------------------------------------------------------------ BLE işareti

    private long sonReklam;

    @SuppressLint("MissingPermission")
    private void reklamBaslat() {
        sonReklam = System.currentTimeMillis();
        reklamDurdur();
        if (Build.VERSION.SDK_INT >= 31 && !izin(Manifest.permission.BLUETOOTH_ADVERTISE)) {
            reklamDurum = "izin-yok";
            return;
        }
        BluetoothManager bm = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
        BluetoothAdapter ad = bm == null ? null : bm.getAdapter();
        if (ad == null) {
            reklamDurum = "bluetooth-yok";
            return;
        }
        if (!ad.isEnabled()) {
            reklamDurum = "bluetooth-kapali";
            return;
        }
        reklamci = ad.getBluetoothLeAdvertiser();
        if (reklamci == null) {
            reklamDurum = "desteklenmiyor";
            return;
        }
        int pil = pilYuzde(this);
        EnkazIsareti e = isaret(this, pil);
        AdvertiseSettings ayar = new AdvertiseSettings.Builder()
                .setAdvertiseMode(pil >= 0 && pil < 20 ? AdvertiseSettings.ADVERTISE_MODE_LOW_POWER : AdvertiseSettings.ADVERTISE_MODE_BALANCED)
                .setTxPowerLevel(AdvertiseSettings.ADVERTISE_TX_POWER_HIGH)
                .setConnectable(false)
                .setTimeout(0)
                .build();
        AdvertiseData veri = new AdvertiseData.Builder().addManufacturerData(EnkazIsareti.SIRKET, e.kodla()).build();
        AdvertiseData yanit = new AdvertiseData.Builder()
                .addManufacturerData(EnkazIsareti.SIRKET, EnkazIsareti.etiketKodla(prefs(this).getString("etiket", ""))).build();
        reklamCb = new AdvertiseCallback() {
            @Override
            public void onStartSuccess(AdvertiseSettings s) {
                reklamDurum = "yayiliyor";
                bildir(EnkazServisi.this);
            }

            @Override
            public void onStartFailure(int kod) {
                reklamDurum = "hata-" + kod;
                bildir(EnkazServisi.this);
            }
        };
        try {
            reklamci.startAdvertising(ayar, veri, yanit, reklamCb);
        } catch (Exception ex) {
            reklamDurum = "hata";
        }
    }

    @SuppressLint("MissingPermission")
    private void reklamDurdur() {
        try {
            if (reklamci != null && reklamCb != null) reklamci.stopAdvertising(reklamCb);
        } catch (Exception ignored) {}
        reklamCb = null;
    }

    static EnkazIsareti isaret(Context c, int pil) {
        SharedPreferences p = prefs(c);
        EnkazIsareti e = new EnkazIsareti();
        e.kimlik = kimlik(c);
        e.otomatik = p.getBoolean("otomatik", false);
        e.kat = p.getInt("kat", EnkazIsareti.KAT_YOK);
        e.pil = pil;
        e.guc = 3;
        JSONObject k = KonumKaydi.son(c);
        if (k != null) {
            e.lat = k.optDouble("lat");
            e.lon = k.optDouble("lon");
            e.dogruluk = (int) Math.round(k.optDouble("dogruluk", -1));
            e.yasDk = (int) Math.max(0, (System.currentTimeMillis() - k.optLong("zaman")) / 60_000L);
            // (kayıttaki zaman telefon saatiyle yazılır; bkz. KonumKaydi.ekle)
        }
        return e;
    }

    // ------------------------------------------------------------------ SOS ses ve ışık

    /** Mors birimi 120 ms: ··· ——— ··· */
    static final int BIRIM_MS = 120;
    static final int[][] SOS = { {1, 1}, {1, 1}, {1, 3}, {3, 1}, {3, 1}, {3, 3}, {1, 1}, {1, 1}, {1, 7} };

    private void sesCalSimdi(boolean elle) {
        if (sesCaliyor) return;
        sonSes = System.currentTimeMillis();
        sesSayisi++;
        sesCaliyor = true;
        final int tekrar = 2;
        int toplam = 0;
        for (int[] s : SOS) toplam += (s[0] + s[1]) * BIRIM_MS;
        final int sure = toplam * tekrar;
        new Thread(() -> {
            try {
                caldir(tekrar);
            } catch (Exception ignored) {}
        }).start();
        // Flaş aynı çizelgeyle
        int t = 0;
        for (int r = 0; r < tekrar; r++) {
            for (int[] s : SOS) {
                h.postDelayed(() -> torch(true), t);
                t += s[0] * BIRIM_MS;
                h.postDelayed(() -> torch(false), t);
                t += s[1] * BIRIM_MS;
            }
        }
        h.postDelayed(() -> {
            sesCaliyor = false;
            torch(false);
            bildir(this);
        }, sure + 200);
        bildir(this);
    }

    /** 2,9 + 3,15 kHz kare dalga karışımı (düdük gibi; insan kulağının en duyarlı olduğu bölge) */
    private void caldir(int tekrar) {
        int hz = 22050;
        int uz = 0;
        for (int[] s : SOS) uz += (s[0] + s[1]) * BIRIM_MS;
        int n = hz * uz / 1000 * tekrar;
        short[] pcm = new short[n];
        int i = 0;
        for (int r = 0; r < tekrar; r++) {
            for (int[] s : SOS) {
                int on = hz * s[0] * BIRIM_MS / 1000, off = hz * s[1] * BIRIM_MS / 1000;
                for (int k = 0; k < on && i < n; k++, i++) {
                    double t = (double) k / hz;
                    double a = Math.signum(Math.sin(2 * Math.PI * 2900 * t)) + Math.signum(Math.sin(2 * Math.PI * 3150 * t));
                    // Yumuşak giriş/çıkış (tık sesi olmasın)
                    double zarf = Math.min(1, Math.min(k, on - k) / (hz * 0.004));
                    pcm[i] = (short) (a * 0.5 * zarf * 30000);
                }
                i += off;
            }
        }
        AudioTrack tr = new AudioTrack.Builder()
                .setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
                .setAudioFormat(new AudioFormat.Builder().setEncoding(AudioFormat.ENCODING_PCM_16BIT).setSampleRate(hz)
                        .setChannelMask(AudioFormat.CHANNEL_OUT_MONO).build())
                .setBufferSizeInBytes(n * 2)
                .setTransferMode(AudioTrack.MODE_STATIC)
                .build();
        try {
            if (tr.getState() != AudioTrack.STATE_INITIALIZED) return;
            tr.write(pcm, 0, n);
            tr.play();
            Thread.sleep((long) n * 1000 / hz + 300);
        } catch (Exception ignored) {
        } finally {
            tr.release();
        }
    }

    private void alarmSesiniAc() {
        try {
            AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            SharedPreferences p = prefs(this);
            // Yeniden başlatmada zaten en yüksekteki düzeyi "eski" sanmamak için yalnız ilk kez saklanır
            if (!p.contains("eskiAlarm")) p.edit().putInt("eskiAlarm", am.getStreamVolume(AudioManager.STREAM_ALARM)).apply();
            am.setStreamVolume(AudioManager.STREAM_ALARM, am.getStreamMaxVolume(AudioManager.STREAM_ALARM), 0);
        } catch (Exception ignored) {}
    }

    private void alarmSesiniGeriAl() {
        // Yalnız enkaz modu gerçekten kapatıldıysa (sistem servisi yeniden başlatacaksa değil)
        if (aktif(this)) return;
        try {
            SharedPreferences p = prefs(this);
            if (!p.contains("eskiAlarm")) return;
            AudioManager am = (AudioManager) getSystemService(Context.AUDIO_SERVICE);
            am.setStreamVolume(AudioManager.STREAM_ALARM, p.getInt("eskiAlarm", 0), 0);
            p.edit().remove("eskiAlarm").apply();
        } catch (Exception ignored) {}
    }

    private void torch(boolean on) {
        try {
            CameraManager cm = (CameraManager) getSystemService(Context.CAMERA_SERVICE);
            if (torchId == null) {
                for (String id : cm.getCameraIdList()) {
                    CameraCharacteristics ch = cm.getCameraCharacteristics(id);
                    Boolean fl = ch.get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
                    if (fl != null && fl) {
                        torchId = id;
                        break;
                    }
                }
            }
            if (torchId != null) cm.setTorchMode(torchId, on);
        } catch (Exception ignored) {}
    }

    // ------------------------------------------------------------------ GPS

    private void gpsDene() {
        if (gpsDeneniyor) return;
        sonGps = System.currentTimeMillis();
        gpsDeneniyor = true;
        bildir(this);
        new Thread(() -> {
            try {
                Location l = KonumKaydi.konumAl(this);
                if (l != null) KonumKaydi.ekle(this, l, "enkaz");
            } catch (Exception ignored) {}
            gpsDeneniyor = false;
            h.post(() -> {
                reklamBaslat();
                bildir(this);
            });
        }).start();
    }

    // ------------------------------------------------------------------ Bluetooth görünürlüğü

    private long sonGorunurUyari;

    private void gorunurlukDenetle(long simdi) {
        if (!EnkazBluetoothAdi.aktif(this)) return;
        long bitis = prefs(this).getLong("gorunurBitis", 0);
        if (bitis == 0 || simdi < bitis || simdi - sonGorunurUyari < 60 * 60_000L) return;
        sonGorunurUyari = simdi;
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(this, KANAL_UYARI)
                .setSmallIcon(android.R.drawable.stat_sys_data_bluetooth)
                .setContentTitle("Bluetooth görünürlüğü bitti")
                .setContentText("Uygulamasız telefonlar sizi görsün diye yenilemek için dokunun.")
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(uygulamayaAc(this, "enkaz", 1));
        try {
            nm.notify(BILDIRIM_GORUNUR, b.build());
        } catch (Exception ignored) {}
    }

    // ------------------------------------------------------------------ bildirim

    static void kanallar(Context c) {
        if (Build.VERSION.SDK_INT < 26) return;
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        if (nm.getNotificationChannel(KANAL) == null) {
            NotificationChannel ch = new NotificationChannel(KANAL, "Enkaz modu", NotificationManager.IMPORTANCE_LOW);
            ch.setDescription("Enkaz modu açıkken kalıcı durum bildirimi");
            nm.createNotificationChannel(ch);
        }
        if (nm.getNotificationChannel(KANAL_UYARI) == null) {
            NotificationChannel ch = new NotificationChannel(KANAL_UYARI, "Enkaz uyarıları", NotificationManager.IMPORTANCE_HIGH);
            ch.setDescription("Yakında duyulan enkaz işaretleri, sarsıntı sorusu, görünürlük hatırlatması");
            nm.createNotificationChannel(ch);
        }
    }

    /** Uygulamayı belirli bir araçta açan bildirim eylemi */
    static PendingIntent uygulamayaAc(Context c, String arac, int istek) {
        Intent i = new Intent(c, MainActivity.class);
        i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        i.putExtra(MainActivity.EKSTRA_ARAC, arac);
        return PendingIntent.getActivity(c, istek, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    private Notification bildirim() {
        int pil = pilYuzde(this);
        long sn = sesAraligi(pil) / 1000;
        String ses = System.currentTimeMillis() < sesDuraklatBitis ? "SOS sesi duraklatıldı"
                : "SOS sesi " + (sn >= 60 ? (sn / 60) + " dakikada bir" : sn + " saniyede bir");
        String isaret = "yayiliyor".equals(reklamDurum) ? "Bluetooth işareti yayılıyor" : "Bluetooth işareti yok";
        Intent ses1 = new Intent(this, EnkazServisi.class).setAction(EYLEM_SES);
        PendingIntent sesPi = PendingIntent.getService(this, 2, ses1, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return new NotificationCompat.Builder(this, KANAL)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Enkaz modu açık")
                .setContentText(isaret + " · " + ses + (pil >= 0 ? " · pil %" + pil : ""))
                .setOngoing(true)
                .setOnlyAlertOnce(true)
                .setCategory(NotificationCompat.CATEGORY_ALARM)
                .setContentIntent(uygulamayaAc(this, "enkaz", 0))
                .addAction(0, "Şimdi ses çal", sesPi)
                .build();
    }

    private void guncelleBildirim() {
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        try {
            nm.notify(BILDIRIM, bildirim());
        } catch (Exception ignored) {}
    }
}
