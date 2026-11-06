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
 *  • Kurtarıcı mesajları kaydedilir ve gösterilir; titreşim/ses/okuma uyarısı sınırlıdır
 *    (MesajUyariSiniri: 20 sn arayla, aynı mesaj 1 dk'da bir, 10 dk'da en çok 6).
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
        // Yeni oturum: önceki mesajlaşma silinir (enkaz modu zaten açıksa sürer)
        SharedPreferences.Editor e = prefs(c).edit();
        if (!aktif(c)) e.remove("mesajlar").remove("sonMesajNo").remove("yanit").remove("yanitSayac").remove("yanitZaman");
        e.putBoolean("aktif", true).putString("etiket", etiket == null ? "" : etiket).putInt("kat", kat)
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
        // Servis çalışmıyorsa (ör. ilk açılışta izin pencereleri sırasında başlayamadıysa) başlatılır;
        // başlarken zaten 3 sn sonra ses çalar
        else if (aktif(c)) yenile(c);
    }

    /**
     * İzin verildi, Bluetooth açıldı ya da uygulama öne geldi: servis çalışmıyorsa başlatır,
     * çalışıyorsa işareti hemen yeniden dener.
     */
    public static void yenile(Context c) {
        EnkazServisi s = calisan;
        if (s != null) {
            s.h.post(() -> {
                s.reklamBaslat();
                bildir(s);
            });
            return;
        }
        if (!aktif(c)) return;
        try {
            calistir(c);
        } catch (Exception ignored) {
            // Arka plandan başlatılamadı; uygulama öne gelince EnkazPlugin yeniden dener
        }
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
            d.put("kod", EnkazIsareti.kod(kimlik(c)));
            d.put("mesajlar", new org.json.JSONArray(p.getString("mesajlar", "[]")));
            if (p.getInt("yanit", 0) > 0) {
                JSONObject y = new JSONObject();
                y.put("kod", p.getInt("yanit", 0));
                y.put("zaman", p.getLong("yanitZaman", 0));
                d.put("yanit", y);
            }
            if (s != null) {
                d.put("reklam", s.reklamDurum);
                d.put("sonSes", s.sonSes);
                d.put("sesSayisi", s.sesSayisi);
                d.put("sesDuraklatBitis", s.sesDuraklatBitis);
                d.put("sonGps", s.sonGps);
                d.put("gpsDeneniyor", s.gpsDeneniyor);
                d.put("mesajDinleme", s.taramaCb != null);
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
        btDinleyiciKaydet();
        reklamBaslat();
        mesajTaramaBaslat();
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
        try {
            if (btAlici != null) unregisterReceiver(btAlici);
        } catch (Exception ignored) {}
        btAlici = null;
        mesajTaramaDurdur();
        if (tts != null) try { tts.shutdown(); } catch (Exception ignored) {}
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
            // İşaret yayılmıyorsa (Bluetooth kapalı, izin yeni verildi…) her turda yeniden dene
            if (simdi - sonReklam >= 5 * 60_000L || !"yayiliyor".equals(reklamDurum)) reklamBaslat();
            gorunurlukDenetle(simdi);
            mesajTaramaAyarla(simdi, pil);
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
    private android.content.BroadcastReceiver btAlici;

    /** Bluetooth açılınca işaret beklemeden başlasın */
    private void btDinleyiciKaydet() {
        if (btAlici != null) return;
        btAlici = new android.content.BroadcastReceiver() {
            @Override
            public void onReceive(Context c, Intent i) {
                int st = i.getIntExtra(BluetoothAdapter.EXTRA_STATE, -1);
                if (st == BluetoothAdapter.STATE_ON) {
                    h.postDelayed(EnkazServisi.this::reklamBaslat, 500);
                    h.postDelayed(EnkazServisi.this::mesajTaramaBaslat, 800);
                }
                else if (st == BluetoothAdapter.STATE_OFF) {
                    reklamDurum = "bluetooth-kapali";
                    bildir(EnkazServisi.this);
                }
            }
        };
        try {
            registerReceiver(btAlici, new android.content.IntentFilter(BluetoothAdapter.ACTION_STATE_CHANGED));
        } catch (Exception ignored) {
            btAlici = null;
        }
    }

    @SuppressLint("MissingPermission")
    private void reklamBaslat() {
        sonReklam = System.currentTimeMillis();
        reklamDurdur();
        if (Build.VERSION.SDK_INT >= 31 && !izin(Manifest.permission.BLUETOOTH_ADVERTISE)) {
            reklamDurum = "izin-yok";
            bildir(this);
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
            bildir(this);
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
        e.onay = p.getInt("sonMesajNo", 0);
        e.yanit = p.getInt("yanit", 0);
        e.yanitSayac = p.getInt("yanitSayac", 0);
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

    // ------------------------------------------------------------------ kurtarıcı mesajları

    android.bluetooth.le.ScanCallback taramaCb;
    /** Sahte mesaj yağmuru pili bitirmesin: titreşim/ses/okuma sıklık sınırı (MesajUyariSiniri) */
    private final MesajUyariSiniri uyariSiniri = new MesajUyariSiniri();
    private android.speech.tts.TextToSpeech tts;
    private boolean ttsHazir;

    /** Enkazdaki kişi hazır bir yanıt verir: işarete eklenir (kurtarıcının telefonunda görünür) */
    public static void yanitVer(Context c, int kod) {
        SharedPreferences p = prefs(c);
        p.edit().putInt("yanit", kod).putInt("yanitSayac", (p.getInt("yanitSayac", 0) + 1) & 0xFF)
                .putLong("yanitZaman", System.currentTimeMillis()).apply();
        yenile(c);
    }

    /**
     * Pil %20'nin üstündeyse sürekli düşük güçte dinler; altında 2 dakikada bir 20 sn.
     * (Kurtarıcı mesajı 3 dakika yayıldığı için kaçmaz.)
     */
    private void mesajTaramaAyarla(long simdi, int pil) {
        boolean surekli = pil < 0 || pil >= 20;
        boolean acik = surekli || (simdi / 1000) % 120 < 20;
        if (acik && taramaCb == null) mesajTaramaBaslat();
        else if (!acik && taramaCb != null) mesajTaramaDurdur();
    }

    @SuppressLint("MissingPermission")
    private void mesajTaramaBaslat() {
        if (taramaCb != null || !EnkazTarayici.izin(this)) return;
        android.bluetooth.le.BluetoothLeScanner t = EnkazTarayici.tarayici(this);
        if (t == null) return;
        final int ben = kimlik(this);
        taramaCb = new android.bluetooth.le.ScanCallback() {
            @Override
            public void onScanResult(int tip, android.bluetooth.le.ScanResult r) {
                if (r.getScanRecord() == null) return;
                int[] m = EnkazIsareti.mesajCoz(EnkazIsareti.hamdanAyikla(r.getScanRecord().getBytes(), EnkazIsareti.SIRKET)[2]);
                if (m == null || m[0] != ben) return;
                h.post(() -> mesajGeldi(m[1], m[2], r.getRssi()));
            }
        };
        try {
            t.startScan(EnkazTarayici.suzgec(), new android.bluetooth.le.ScanSettings.Builder()
                    .setScanMode(android.bluetooth.le.ScanSettings.SCAN_MODE_LOW_POWER).build(), taramaCb);
        } catch (Exception e) {
            taramaCb = null;
        }
    }

    @SuppressLint("MissingPermission")
    private void mesajTaramaDurdur() {
        if (taramaCb == null) return;
        try {
            android.bluetooth.le.BluetoothLeScanner t = EnkazTarayici.tarayici(this);
            if (t != null) t.stopScan(taramaCb);
        } catch (Exception ignored) {}
        taramaCb = null;
    }

    private void mesajGeldi(int no, int kod, int rssi) {
        SharedPreferences p = prefs(this);
        if (p.getInt("sonMesajNo", 0) == no) return; // aynı mesaj tekrar duyuldu
        String metin = Mesajlar.mesaj(kod);
        if (metin.isEmpty()) return;
        try {
            org.json.JSONArray eski = new org.json.JSONArray(p.getString("mesajlar", "[]"));
            org.json.JSONArray yeni = new org.json.JSONArray();
            JSONObject o = new JSONObject();
            o.put("no", no).put("kod", kod).put("zaman", System.currentTimeMillis()).put("rssi", rssi);
            yeni.put(o);
            for (int i = 0; i < eski.length() && yeni.length() < 10; i++) yeni.put(eski.get(i));
            p.edit().putString("mesajlar", yeni.toString()).putInt("sonMesajNo", no).apply();
        } catch (Exception ignored) {}
        // Onay hemen işarete girsin: kurtarıcı "ulaştı" görsün
        reklamBaslat();
        // Mesaj her durumda kaydedildi ve ekranda görünür; yalnız sesli/titreşimli uyarı sınırlı
        // (saat değişse de doğru çalışsın diye açılıştan beri geçen süre kullanılır)
        mesajDuyur(metin, uyariSiniri.izinVer(android.os.SystemClock.elapsedRealtime(), kod));
        bildir(this);
    }

    /**
     * Titreşim, kısa uyarı sesi, sesli okuma (Türkçe ses varsa) ve bildirim. uyar=false ise
     * (sıklık sınırı) yalnız bildirim sessizce güncellenir.
     */
    private void mesajDuyur(String metin, boolean uyar) {
        if (uyar) uyariVer(metin);
        NotificationManager nm = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        NotificationCompat.Builder b = new NotificationCompat.Builder(this, KANAL_UYARI)
                .setSmallIcon(android.R.drawable.stat_notify_chat)
                .setContentTitle("Kurtarıcılardan mesaj")
                .setContentText(metin)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .setCategory(NotificationCompat.CATEGORY_MESSAGE)
                .setSilent(!uyar)
                .setAutoCancel(true)
                .setContentIntent(uygulamayaAc(this, "enkaz", 5));
        try {
            nm.notify(4313, b.build());
        } catch (Exception ignored) {}
    }

    private void uyariVer(String metin) {
        try {
            android.os.Vibrator v = (android.os.Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
            if (v != null) {
                long[] desen = { 0, 400, 200, 400, 200, 800 };
                if (Build.VERSION.SDK_INT >= 26) v.vibrate(android.os.VibrationEffect.createWaveform(desen, -1));
                else v.vibrate(desen, -1);
            }
        } catch (Exception ignored) {}
        try {
            android.media.ToneGenerator tg = new android.media.ToneGenerator(AudioManager.STREAM_ALARM, 100);
            tg.startTone(android.media.ToneGenerator.TONE_PROP_ACK, 600);
            h.postDelayed(tg::release, 900);
        } catch (Exception ignored) {}
        konus("Kurtarıcılardan mesaj. " + metin, 1200);
    }

    /** Çevrimdışı Türkçe ses yüklüyse metni alarm sesi düzeyinde okur */
    private void konus(String metin, long gecikme) {
        h.postDelayed(() -> {
            try {
                if (tts == null) {
                    tts = new android.speech.tts.TextToSpeech(this, st -> {
                        ttsHazir = st == android.speech.tts.TextToSpeech.SUCCESS
                                && tts.setLanguage(new java.util.Locale("tr", "TR")) >= android.speech.tts.TextToSpeech.LANG_AVAILABLE;
                        if (ttsHazir) oku(metin);
                    });
                    tts.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ALARM)
                            .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());
                } else if (ttsHazir) oku(metin);
            } catch (Exception ignored) {}
        }, gecikme);
    }

    private void oku(String metin) {
        try {
            tts.speak(metin, android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, "enkaz-mesaj");
        } catch (Exception ignored) {}
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
