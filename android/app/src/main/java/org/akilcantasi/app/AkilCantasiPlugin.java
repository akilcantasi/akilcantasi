package org.akilcantasi.app;

import android.content.ActivityNotFoundException;
import android.content.ComponentName;
import android.content.Intent;
import android.content.Context;
import android.content.pm.PackageInfo;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraManager;
import android.net.Uri;
import android.net.wifi.WifiManager;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.core.content.FileProvider;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.ArrayList;
import java.util.List;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import org.json.JSONArray;

/**
 * Web tarafındaki src/lib/native.ts ile konuşan yerel köprü.
 * JS adı: "AkilCantasi" (window.Capacitor.Plugins.AkilCantasi)
 */
@CapacitorPlugin(name = "AkilCantasi")
public class AkilCantasiPlugin extends Plugin {

    private InfoPointServer server;
    private PowerManager.WakeLock wakeLock;
    private WifiManager.WifiLock wifiLock;
    private String torchCameraId;
    private boolean torchOn;

    @PluginMethod
    public void openHotspotSettings(PluginCall call) {
        JSObject ret = new JSObject();
        boolean ok = tryStart(new Intent("android.settings.TETHER_SETTINGS"));
        if (!ok) {
            Intent tether = new Intent(Intent.ACTION_MAIN);
            tether.setComponent(new ComponentName("com.android.settings", "com.android.settings.TetherSettings"));
            ok = tryStart(tether);
        }
        if (!ok) ok = tryStart(new Intent(Settings.ACTION_WIRELESS_SETTINGS));
        ret.put("opened", ok);
        call.resolve(ret);
    }

    private boolean tryStart(Intent i) {
        try {
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(i);
            return true;
        } catch (ActivityNotFoundException | SecurityException e) {
            return false;
        }
    }

    @PluginMethod
    public void shareApk(PluginCall call) {
        JSObject ret = new JSObject();
        try {
            File out = apkCopy();
            Uri uri = FileProvider.getUriForFile(getContext(), getContext().getPackageName() + ".fileprovider", out);
            Intent send = new Intent(Intent.ACTION_SEND);
            send.setType("application/vnd.android.package-archive");
            send.putExtra(Intent.EXTRA_STREAM, uri);
            send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            Intent chooser = Intent.createChooser(send, "Akıl Çantası'nı paylaş");
            chooser.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(chooser);
            ret.put("shared", true);
        } catch (Exception e) {
            ret.put("shared", false);
            ret.put("error", String.valueOf(e.getMessage()));
        }
        call.resolve(ret);
    }

    /**
     * Kurulu APK'nın paylaşılabilir kopyası (cache/share/akil-cantasi.apk).
     * Uygulama güncellenince yenilenir; geçici dosyaya yazılıp yeniden
     * adlandırılır, böylece o an sunulmakta olan indirme bozulmaz.
     */
    private synchronized File apkCopy() throws Exception {
        File src = new File(getContext().getApplicationInfo().sourceDir);
        File outDir = new File(getContext().getCacheDir(), "share");
        if (!outDir.exists()) outDir.mkdirs();
        File out = new File(outDir, "akil-cantasi.apk");
        long stamp = src.lastModified();
        try {
            PackageInfo pi = getContext().getPackageManager().getPackageInfo(getContext().getPackageName(), 0);
            stamp = pi.lastUpdateTime;
        } catch (Exception ignored) {}
        if (!out.exists() || out.length() != src.length() || out.lastModified() != stamp) {
            File tmp = new File(outDir, "akil-cantasi.apk.tmp");
            copy(src, tmp);
            tmp.setLastModified(stamp);
            if (!tmp.renameTo(out)) {
                out.delete();
                if (!tmp.renameTo(out)) throw new Exception("APK kopyalanamadı");
            }
        }
        return out;
    }

    /** Ekran kapanınca da sunucu ve Wi-Fi çalışmaya devam etsin. */
    private void acquireLocks() {
        try {
            if (wakeLock == null) {
                PowerManager pm = (PowerManager) getContext().getSystemService(android.content.Context.POWER_SERVICE);
                wakeLock = pm.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "AkilCantasi:BilgiNoktasi");
                wakeLock.setReferenceCounted(false);
            }
            wakeLock.acquire(6 * 60 * 60 * 1000L);
            if (wifiLock == null) {
                WifiManager wm = (WifiManager) getContext().getApplicationContext().getSystemService(android.content.Context.WIFI_SERVICE);
                wifiLock = wm.createWifiLock(WifiManager.WIFI_MODE_FULL_HIGH_PERF, "AkilCantasi:BilgiNoktasi");
                wifiLock.setReferenceCounted(false);
            }
            wifiLock.acquire();
        } catch (Exception ignored) {}
    }

    private void releaseLocks() {
        try { if (wakeLock != null && wakeLock.isHeld()) wakeLock.release(); } catch (Exception ignored) {}
        try { if (wifiLock != null && wifiLock.isHeld()) wifiLock.release(); } catch (Exception ignored) {}
    }

    /**
     * Telefonu bilgi noktası yapar: aynı Wi-Fi / erişim noktasındaki cihazlar
     * http://<telefon-ip>:<port> adresinden uygulamayı tarayıcıda açar.
     * Paketler: Android/data/org.akilcantasi.app/files/packs klasöründeki dosyalar.
     */
    @PluginMethod
    public void startInfoPoint(PluginCall call) {
        int port = call.getInt("port", 8080);
        try {
            if (server == null || !server.isRunning()) {
                File packs = PaketIndirici.packsDir(getContext());
                File apk = null;
                try { apk = apkCopy(); } catch (Exception ignored) {}
                // Mesaj panosu kayıtları: files/board.json (uygulama kaldırılana dek kalır)
                File boardFile = new File(getContext().getFilesDir(), "board.json");
                server = new InfoPointServer(getContext().getAssets(), packs, apk, port, boardFile);
                server.start();
            }
            acquireLocks();
            call.resolve(status());
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("running", false);
            ret.put("error", String.valueOf(e.getMessage()));
            call.resolve(ret);
        }
    }

    @PluginMethod
    public void stopInfoPoint(PluginCall call) {
        if (server != null) server.stop();
        server = null;
        releaseLocks();
        JSObject ret = new JSObject();
        ret.put("running", false);
        call.resolve(ret);
    }

    @PluginMethod
    public void getInfoPointStatus(PluginCall call) {
        call.resolve(status());
    }

    private JSObject status() {
        JSObject ret = new JSObject();
        boolean running = server != null && server.isRunning();
        ret.put("running", running);
        if (running) {
            ret.put("port", server.getPort());
            JSArray arr = new JSArray();
            for (String a : InfoPointServer.lanAddresses()) arr.put(a);
            ret.put("addresses", arr);
            ret.put("clients", server.clientCount());
        }
        return ret;
    }

    /**
     * Telefon flaşını el feneri olarak açar/kapatır (SOS ışığı, Mors).
     * CameraManager.setTorchMode API 23+; CAMERA izni gerekmez.
     * Dönüş: { on, available, error? }
     */
    @PluginMethod
    public void setTorch(PluginCall call) {
        boolean on = Boolean.TRUE.equals(call.getBoolean("on", false));
        JSObject ret = new JSObject();
        try {
            CameraManager cm = (CameraManager) getContext().getSystemService(Context.CAMERA_SERVICE);
            String id = cm == null ? null : torchId(cm);
            if (id == null) {
                ret.put("available", false);
                ret.put("on", false);
            } else {
                cm.setTorchMode(id, on);
                torchOn = on;
                ret.put("available", true);
                ret.put("on", on);
            }
        } catch (Exception e) {
            // Kamera başka uygulamada açık olabilir (CameraAccessException)
            ret.put("available", false);
            ret.put("on", false);
            ret.put("error", String.valueOf(e.getMessage()));
        }
        call.resolve(ret);
    }

    /** Flaşı olan kamera; önce arka kamera */
    private String torchId(CameraManager cm) throws Exception {
        if (torchCameraId != null) return torchCameraId;
        String any = null;
        for (String id : cm.getCameraIdList()) {
            CameraCharacteristics c = cm.getCameraCharacteristics(id);
            Boolean flash = c.get(CameraCharacteristics.FLASH_INFO_AVAILABLE);
            if (!Boolean.TRUE.equals(flash)) continue;
            Integer facing = c.get(CameraCharacteristics.LENS_FACING);
            if (facing != null && facing == CameraCharacteristics.LENS_FACING_BACK) return torchCameraId = id;
            if (any == null) any = id;
        }
        return torchCameraId = any;
    }

    @Override
    protected void handleOnPause() {
        // Uygulama arka plana geçince fener açık kalmasın (SOS ekranı da kapanır)
        turnOffTorch();
        super.handleOnPause();
    }

    private void turnOffTorch() {
        if (!torchOn || torchCameraId == null) return;
        try {
            CameraManager cm = (CameraManager) getContext().getSystemService(Context.CAMERA_SERVICE);
            if (cm != null) cm.setTorchMode(torchCameraId, false);
        } catch (Exception ignored) {}
        torchOn = false;
    }

    @Override
    protected void handleOnDestroy() {
        turnOffTorch();
        if (server != null) server.stop();
        releaseLocks();
        super.handleOnDestroy();
    }

    private static void copy(File src, File dst) throws Exception {
        try (InputStream in = new FileInputStream(src); OutputStream out = new FileOutputStream(dst)) {
            byte[] buf = new byte[1 << 16];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
        }
    }
    /**
     * Seçili noktayı cihazdaki harita uygulamasında açar (geo: bağlantısı).
     * Birden çok harita uygulaması varsa seçim menüsü çıkar. { lat, lon, label } → { opened }
     */
    @PluginMethod
    public void haritadaAc(PluginCall call) {
        Double lat = call.getDouble("lat");
        Double lon = call.getDouble("lon");
        String label = call.getString("label", "");
        JSObject ret = new JSObject();
        if (lat == null || lon == null) {
            ret.put("opened", false);
            call.resolve(ret);
            return;
        }
        String c = String.format(java.util.Locale.ROOT, "%.6f,%.6f", lat, lon);
        String q = label.replace("(", " ").replace(")", " ").trim();
        Uri uri = Uri.parse("geo:" + c + "?q=" + c + (q.isEmpty() ? "" : "(" + Uri.encode(q) + ")"));
        Intent view = new Intent(Intent.ACTION_VIEW, uri);
        boolean ok = view.resolveActivity(getContext().getPackageManager()) != null
            && tryStart(Intent.createChooser(view, "Yol tarifi için harita uygulaması"));
        if (!ok) {
            // Harita uygulaması yoksa tarayıcıda Google Haritalar yol tarifi
            ok = tryStart(new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/dir/?api=1&destination=" + c)));
        }
        ret.put("opened", ok);
        call.resolve(ret);
    }

    // ---- Paket indirme ve paket klasörü (src/lib/native.ts → paketler) -------------------

    /** İndirici var mı, işler ve boş yer. */
    @PluginMethod
    public void paketDurumu(PluginCall call) {
        PaketIndirici d = PaketIndirici.get(getContext());
        JSObject ret = new JSObject();
        ret.put("available", true);
        ret.put("allowed", true);
        ret.put("free", d.freeBytes());
        ret.put("jobs", toJsArray(d.jobsJson()));
        call.resolve(ret);
    }

    /** { file, urls[], size?, sha256? } */
    @PluginMethod
    public void paketIndir(PluginCall call) {
        String file = call.getString("file");
        List<String> urls = new ArrayList<>();
        try {
            JSArray a = call.getArray("urls");
            if (a != null) for (int i = 0; i < a.length(); i++) urls.add(a.getString(i));
        } catch (Exception ignored) {}
        long size = 0;
        try { Double sz = call.getDouble("size"); if (sz != null) size = sz.longValue(); } catch (Exception ignored) {}
        JSObject ret = new JSObject();
        try {
            PaketIndirici.Job j = PaketIndirici.get(getContext()).start(file, urls, size, call.getString("sha256"));
            askNotificationPermission();
            IndirmeServisi.ensureRunning(getContext());
            ret.put("ok", true);
            ret.put("job", JSObject.fromJSONObject(j.toJson()));
        } catch (Exception e) {
            ret.put("ok", false);
            ret.put("error", String.valueOf(e.getMessage()));
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void paketDuraklat(PluginCall call) {
        PaketIndirici.get(getContext()).pause(call.getString("file", ""));
        JSObject ret = new JSObject();
        ret.put("ok", true);
        call.resolve(ret);
    }

    @PluginMethod
    public void paketIptal(PluginCall call) {
        final String file = call.getString("file", "");
        new Thread(() -> {
            PaketIndirici.get(getContext()).cancel(file);
            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        }).start();
    }

    /** Paket klasöründeki dosyalar: { files: [{name, size}] } */
    @PluginMethod
    public void paketListesi(PluginCall call) {
        JSArray arr = new JSArray();
        File[] fs = PaketIndirici.packsDir(getContext()).listFiles();
        if (fs != null) for (File f : fs) {
            if (!f.isFile() || !PaketIndirici.isPackName(f.getName())) continue;
            JSObject o = new JSObject();
            o.put("name", f.getName());
            o.put("size", f.length());
            arr.put(o);
        }
        JSObject ret = new JSObject();
        ret.put("files", arr);
        call.resolve(ret);
    }

    @PluginMethod
    public void paketSil(PluginCall call) {
        String name = call.getString("file", "");
        boolean ok = false;
        if (PaketIndirici.isPackName(name)) ok = new File(PaketIndirici.packsDir(getContext()), name).delete();
        JSObject ret = new JSObject();
        ret.put("ok", ok);
        call.resolve(ret);
    }

    private static JSArray toJsArray(JSONArray a) {
        JSArray out = new JSArray();
        for (int i = 0; i < a.length(); i++) {
            try { out.put(JSObject.fromJSONObject(a.getJSONObject(i))); } catch (Exception ignored) {}
        }
        return out;
    }

    /** Android 13+: indirme bildirimi için izin (verilmezse indirme yine sürer). */
    private void askNotificationPermission() {
        if (Build.VERSION.SDK_INT < 33 || getActivity() == null) return;
        if (ContextCompat.checkSelfPermission(getContext(), Manifest.permission.POST_NOTIFICATIONS) == PackageManager.PERMISSION_GRANTED) return;
        try {
            ActivityCompat.requestPermissions(getActivity(), new String[] {Manifest.permission.POST_NOTIFICATIONS}, 4212);
        } catch (Exception ignored) {}
    }
}
