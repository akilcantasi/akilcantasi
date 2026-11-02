package org.akilcantasi.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanFilter;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.bluetooth.le.ScanSettings;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;

import androidx.core.app.NotificationCompat;
import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.work.ExistingPeriodicWorkPolicy;
import androidx.work.PeriodicWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * Enkaz işaretlerini dinler.
 *
 *  • Arama modu (kurtarıcı): uygulama açıkken hızlı tarama; her duyuluş JS'e gider
 *    (sinyal gücü → sıcak-soğuk göstergesi).
 *  • Nöbet (isteğe bağlı, varsayılan kapalı): uygulama kapalıyken bile sistemin düşük güçlü
 *    taraması (PendingIntent). Bir işaret duyulunca bildirim çıkar ("Arama modunu aç",
 *    "112'yi ara") ve duyuluş kaydedilir. Kendiliğinden kimseye bir şey gönderilmez:
 *    aynı işareti duyan çok sayıda telefon 112'yi mesajla boğmasın diye iletme kullanıcıya bırakılır.
 *
 * Duyulanlar (son 72 saat, en çok 50 işaret) yalnız bu telefonda tutulur.
 */
public final class EnkazTarayici {

    public interface Dinleyici {
        void duyuldu(JSONObject d);
    }

    static final String PREFS = "enkaz_duyulan";
    static final int EN_COK = 50;
    static final long OMUR_MS = 72 * 60 * 60_000L;
    static final long BILDIRIM_ARASI_MS = 30 * 60_000L;

    private static ScanCallback aramaCb;

    private EnkazTarayici() {}

    static boolean izin(Context c) {
        boolean konum = ContextCompat.checkSelfPermission(c, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED;
        if (Build.VERSION.SDK_INT >= 31)
            return konum && ContextCompat.checkSelfPermission(c, Manifest.permission.BLUETOOTH_SCAN) == PackageManager.PERMISSION_GRANTED;
        return konum;
    }

    static BluetoothLeScanner tarayici(Context c) {
        BluetoothAdapter a = EnkazBluetoothAdi.adaptor(c);
        if (a == null || !a.isEnabled()) return null;
        return a.getBluetoothLeScanner();
    }

    static List<ScanFilter> suzgec() {
        // İlk iki bayt 'A' 'K'; geri kalanı serbest
        byte[] veri = { 'A', 'K' };
        byte[] maske = { (byte) 0xFF, (byte) 0xFF };
        return Collections.singletonList(new ScanFilter.Builder().setManufacturerData(EnkazIsareti.SIRKET, veri, maske).build());
    }

    /** null: başladı; değilse neden ("izin-yok", "bluetooth-kapali", "hata") */
    @SuppressLint("MissingPermission")
    static synchronized String aramaBaslat(Context c, Dinleyici d) {
        if (!izin(c)) return "izin-yok";
        BluetoothLeScanner t = tarayici(c);
        if (t == null) return "bluetooth-kapali";
        aramaDurdur(c);
        final Context ac = c.getApplicationContext();
        aramaCb = new ScanCallback() {
            @Override
            public void onScanResult(int tip, ScanResult r) {
                JSONObject o = coz(r);
                if (o == null) return;
                kaydet(ac, o, false);
                d.duyuldu(o);
            }
        };
        ScanSettings ayar = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build();
        try {
            t.startScan(suzgec(), ayar, aramaCb);
            return null;
        } catch (Exception e) {
            aramaCb = null;
            return "hata";
        }
    }

    @SuppressLint("MissingPermission")
    static synchronized void aramaDurdur(Context c) {
        if (aramaCb == null) return;
        try {
            BluetoothLeScanner t = tarayici(c);
            if (t != null) t.stopScan(aramaCb);
        } catch (Exception ignored) {}
        aramaCb = null;
    }

    /** Duyuluşu JSON'a çevirir; enkaz işareti değilse null */
    static JSONObject coz(ScanResult r) {
        ScanRecord rec = r.getScanRecord();
        if (rec == null) return null;
        byte[][] ay = EnkazIsareti.hamdanAyikla(rec.getBytes(), EnkazIsareti.SIRKET);
        EnkazIsareti e = EnkazIsareti.coz(ay[0]);
        if (e == null) return null;
        try {
            JSONObject o = new JSONObject();
            o.put("kimlik", e.kimlik);
            o.put("rssi", r.getRssi());
            o.put("zaman", System.currentTimeMillis());
            o.put("enkaz", e.enkaz);
            o.put("otomatik", e.otomatik);
            if (e.konumVar()) {
                o.put("lat", e.lat);
                o.put("lon", e.lon);
            }
            o.put("yasDk", e.yasDk);
            o.put("pil", e.pil);
            if (e.kat != EnkazIsareti.KAT_YOK) o.put("kat", e.kat);
            o.put("dogruluk", e.dogruluk);
            o.put("guc", e.guc);
            String et = EnkazIsareti.etiketCoz(ay[1]);
            if (et != null) o.put("etiket", et);
            return o;
        } catch (Exception ex) {
            return null;
        }
    }

    // ------------------------------------------------------------------ duyulanlar deposu

    private static SharedPreferences p(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    public static synchronized JSONArray duyulanlar(Context c) {
        try {
            return new JSONArray(p(c).getString("liste", "[]"));
        } catch (Exception e) {
            return new JSONArray();
        }
    }

    public static synchronized void temizle(Context c) {
        p(c).edit().putString("liste", "[]").apply();
    }

    /**
     * Duyuluşu kimliğe göre birleştirir: ilk/son duyuluş, en güçlü sinyal, duyulduğu yer
     * (dinleyen telefonun son konumu). Yeni işaretse true.
     */
    static synchronized boolean kaydet(Context c, JSONObject o, boolean arkaPlan) {
        int kendi = EnkazServisi.kimlik(c);
        int k = o.optInt("kimlik");
        if (k == kendi) return false;
        long simdi = System.currentTimeMillis();
        JSONArray a = duyulanlar(c);
        JSONArray yeni = new JSONArray();
        JSONObject eski = null;
        for (int i = 0; i < a.length(); i++) {
            JSONObject x = a.optJSONObject(i);
            if (x == null || simdi - x.optLong("son") > OMUR_MS) continue;
            if (x.optInt("kimlik") == k) eski = x;
            else yeni.put(x);
        }
        try {
            JSONObject b = new JSONObject(o.toString());
            b.remove("zaman");
            b.put("son", simdi);
            b.put("ilk", eski != null ? eski.optLong("ilk", simdi) : simdi);
            b.put("enIyiRssi", Math.max(o.optInt("rssi", -127), eski != null ? eski.optInt("enIyiRssi", -127) : -127));
            b.put("sayi", (eski != null ? eski.optInt("sayi") : 0) + 1);
            if (eski != null && eski.has("bildirim")) b.put("bildirim", eski.optLong("bildirim"));
            JSONObject benim = KonumKaydi.son(c);
            if (benim != null) b.put("duyulanYer", benim);
            else if (eski != null && eski.has("duyulanYer")) b.put("duyulanYer", eski.optJSONObject("duyulanYer"));
            if (arkaPlan && simdi - b.optLong("bildirim") > BILDIRIM_ARASI_MS) {
                b.put("bildirim", simdi);
                bildirimGoster(c, b);
            }
            JSONArray son = new JSONArray();
            son.put(b);
            for (int i = 0; i < yeni.length() && son.length() < EN_COK; i++) son.put(yeni.get(i));
            p(c).edit().putString("liste", son.toString()).apply();
        } catch (Exception ignored) {}
        return eski == null;
    }

    static String sinyalYazi(int rssi) {
        if (rssi >= -65) return "çok yakın";
        if (rssi >= -80) return "yakın";
        return "uzakta ya da engel arkasında";
    }

    static void bildirimGoster(Context c, JSONObject b) {
        EnkazServisi.kanallar(c);
        NotificationManager nm = (NotificationManager) c.getSystemService(Context.NOTIFICATION_SERVICE);
        if (nm == null) return;
        String et = b.optString("etiket", "");
        String kim = et.isEmpty() ? "Kimliksiz enkaz işareti" : et;
        StringBuilder m = new StringBuilder("Sinyal: ").append(sinyalYazi(b.optInt("rssi", -127)));
        if (b.has("kat")) m.append(" · ").append(b.optInt("kat")).append(". kat");
        if (b.optInt("pil", -1) >= 0) m.append(" · pil %").append(b.optInt("pil"));
        Intent ara = new Intent(Intent.ACTION_DIAL, Uri.parse("tel:112"));
        ara.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        PendingIntent araPi = PendingIntent.getActivity(c, 7, ara, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        NotificationCompat.Builder n = new NotificationCompat.Builder(c, EnkazServisi.KANAL_UYARI)
                .setSmallIcon(android.R.drawable.stat_sys_warning)
                .setContentTitle("Yakında enkaz işareti: " + kim)
                .setContentText(m.toString())
                .setStyle(new NotificationCompat.BigTextStyle().bigText(m + "\nYakınınızda enkaz altında biri olabilir. Arama modunu açıp yaklaşın; 112'ye bildirin."))
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .setContentIntent(EnkazServisi.uygulamayaAc(c, "enkaz-arama", 3))
                .addAction(0, "112'yi ara", araPi);
        try {
            nm.notify(4400 + (b.optInt("kimlik") & 0xFF), n.build());
        } catch (Exception ignored) {}
    }

    // ------------------------------------------------------------------ nöbet (arka plan)

    static boolean nobetAcik(Context c) {
        return p(c).getBoolean("nobet", false);
    }

    private static PendingIntent nobetPi(Context c) {
        Intent i = new Intent(c, Alici.class).setAction("org.akilcantasi.app.ENKAZ_DUYULDU");
        int f = PendingIntent.FLAG_UPDATE_CURRENT | (Build.VERSION.SDK_INT >= 31 ? PendingIntent.FLAG_MUTABLE : 0);
        return PendingIntent.getBroadcast(c, 11, i, f);
    }

    static final String TAZELE = "enkaz-nobet-tazele";

    /** null: açıldı/kapandı; değilse neden */
    static String nobet(Context c, boolean ac) {
        p(c).edit().putBoolean("nobet", ac).apply();
        WorkManager wm = WorkManager.getInstance(c);
        if (!ac) wm.cancelUniqueWork(TAZELE);
        else
            wm.enqueueUniquePeriodicWork(TAZELE, ExistingPeriodicWorkPolicy.KEEP,
                    new PeriodicWorkRequest.Builder(Tazele.class, 30, TimeUnit.MINUTES).build());
        return kaydet(c, ac);
    }

    /**
     * Sistem taramasını (yeniden) kaydeder. Aynı PendingIntent'le yeniden kayıt öncekinin yerini
     * alır. Bluetooth kapanıp açılınca sistem kaydı düşürdüğü için Tazele bunu düzenli çağırır.
     */
    @SuppressLint("MissingPermission")
    static String kaydet(Context c, boolean ac) {
        BluetoothLeScanner t = tarayici(c);
        if (!ac) {
            try {
                if (t != null && izin(c)) t.stopScan(nobetPi(c));
            } catch (Exception ignored) {}
            return null;
        }
        if (!izin(c) || !KonumKaydi.arkaPlanIzni(c)) return "izin-yok";
        if (t == null || Build.VERSION.SDK_INT < 26) return t == null ? "bluetooth-kapali" : "desteklenmiyor";
        ScanSettings ayar = new ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_POWER).build();
        try {
            int r = t.startScan(suzgec(), ayar, nobetPi(c));
            return r == 0 ? null : "hata-" + r;
        } catch (Exception e) {
            return "hata";
        }
    }

    /** 30 dakikada bir: nöbet açıksa sistem taramasını tazeler (Bluetooth sonradan açıldıysa da başlar) */
    public static class Tazele extends Worker {
        public Tazele(@NonNull Context c, @NonNull WorkerParameters p) {
            super(c, p);
        }

        @NonNull
        @Override
        public Result doWork() {
            Context c = getApplicationContext();
            if (nobetAcik(c)) kaydet(c, true);
            return Result.success();
        }
    }

    /** Sistem taramasının sonuçları (uygulama kapalıyken de) */
    public static class Alici extends BroadcastReceiver {
        @Override
        public void onReceive(Context c, Intent i) {
            if (Build.VERSION.SDK_INT < 26) return;
            ArrayList<ScanResult> l = i.getParcelableArrayListExtra(BluetoothLeScanner.EXTRA_LIST_SCAN_RESULT);
            if (l == null) return;
            for (ScanResult r : l) {
                JSONObject o = coz(r);
                if (o != null) kaydet(c, o, true);
            }
        }
    }
}
