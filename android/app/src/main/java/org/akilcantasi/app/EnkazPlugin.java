package org.akilcantasi.app;

import android.Manifest;
import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.app.NotificationManagerCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Enkaz modu, enkaz arama, son konum kaydı ve sarsıntı nöbeti. JS adı: "AkilEnkaz".
 * Sözleşme: src/lib/enkaz/native.ts ve docs/ENKAZ.md.
 *
 * Olaylar: enkazDurum (EnkazServisi durumu), enkazDuyuldu (arama modunda her duyuluş),
 *          acilisHedefi (bildirimden açılınca gidilecek araç).
 */
@CapacitorPlugin(
    name = "AkilEnkaz",
    permissions = {
        @Permission(alias = "konum", strings = { Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION }),
        @Permission(alias = "arkaKonum", strings = { Manifest.permission.ACCESS_BACKGROUND_LOCATION }),
        @Permission(alias = "bluetooth", strings = { Manifest.permission.BLUETOOTH_ADVERTISE, Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT }),
        @Permission(alias = "bildirim", strings = { Manifest.permission.POST_NOTIFICATIONS })
    }
)
public class EnkazPlugin extends Plugin {

    private EnkazServisi.Dinleyici durumDinleyici;
    private static EnkazPlugin son;

    @Override
    public void load() {
        super.load();
        son = this;
        durumDinleyici = d -> {
            try {
                notifyListeners("enkazDurum", JSObject.fromJSONObject(d));
            } catch (Exception ignored) {}
        };
        EnkazServisi.dinleyiciler.add(durumDinleyici);
        // Uygulama açılınca açık olması gerekenler sürsün (güncelleme sonrası vb.)
        Context c = getContext();
        if (EnkazServisi.aktif(c)) try { EnkazServisi.calistir(c); } catch (Exception ignored) {}
        if (EnkazTarayici.nobetAcik(c)) EnkazTarayici.nobet(c, true);
    }

    /** Uygulama öne gelince: enkaz modu açık olması gerekirken servis çalışmıyorsa başlat */
    @Override
    protected void handleOnResume() {
        super.handleOnResume();
        if (EnkazServisi.aktif(getContext())) EnkazServisi.yenile(getContext());
    }

    @Override
    protected void handleOnDestroy() {
        EnkazServisi.dinleyiciler.remove(durumDinleyici);
        EnkazTarayici.aramaDurdur(getContext());
        if (son == this) son = null;
        super.handleOnDestroy();
    }

    /** MainActivity yeni bir bildirim hedefiyle açılınca */
    static void hedefGeldi(String arac) {
        EnkazPlugin p = son;
        if (p == null) return;
        JSObject o = new JSObject();
        o.put("arac", arac);
        p.notifyListeners("acilisHedefi", o, true);
    }

    private boolean izin(String p) {
        return ContextCompat.checkSelfPermission(getContext(), p) == PackageManager.PERMISSION_GRANTED;
    }

    private JSObject izinler() {
        Context c = getContext();
        JSObject o = new JSObject();
        boolean ince = izin(Manifest.permission.ACCESS_FINE_LOCATION);
        o.put("konum", ince ? "tam" : izin(Manifest.permission.ACCESS_COARSE_LOCATION) ? "yaklasik" : "yok");
        o.put("arkaPlanKonum", KonumKaydi.arkaPlanIzni(c));
        o.put("bluetooth", Build.VERSION.SDK_INT < 31
                || (izin(Manifest.permission.BLUETOOTH_ADVERTISE) && izin(Manifest.permission.BLUETOOTH_SCAN) && izin(Manifest.permission.BLUETOOTH_CONNECT)));
        BluetoothAdapter a = EnkazBluetoothAdi.adaptor(c);
        o.put("bluetoothVar", a != null);
        o.put("bluetoothAcik", a != null && a.isEnabled());
        o.put("bildirim", NotificationManagerCompat.from(c).areNotificationsEnabled());
        PowerManager pm = (PowerManager) c.getSystemService(Context.POWER_SERVICE);
        o.put("pilMuaf", pm != null && pm.isIgnoringBatteryOptimizations(c.getPackageName()));
        o.put("sdk", Build.VERSION.SDK_INT);
        return o;
    }

    @PluginMethod
    public void durum(PluginCall call) {
        Context c = getContext();
        try {
            JSObject r = JSObject.fromJSONObject(EnkazServisi.durum(c));
            r.put("izinler", izinler());
            r.put("nobet", EnkazTarayici.nobetAcik(c));
            r.put("sarsinti", SarsintiServisi.acik(c));
            r.put("konumKaydiModu", KonumKaydi.mod(c));
            call.resolve(r);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    // ------------------------------------------------------------------ izin akışı

    /** Eksik izinler (bu Android sürümünde var olanlar) */
    private String[] eksik(boolean bluetooth, boolean konum, boolean bildirim) {
        List<String> l = new ArrayList<>();
        if (konum && !izin(Manifest.permission.ACCESS_FINE_LOCATION)) l.add("konum");
        if (bluetooth && Build.VERSION.SDK_INT >= 31
                && !(izin(Manifest.permission.BLUETOOTH_ADVERTISE) && izin(Manifest.permission.BLUETOOTH_SCAN) && izin(Manifest.permission.BLUETOOTH_CONNECT)))
            l.add("bluetooth");
        if (bildirim && Build.VERSION.SDK_INT >= 33 && !izin(Manifest.permission.POST_NOTIFICATIONS)) l.add("bildirim");
        return l.toArray(new String[0]);
    }

    /** Enkaz modu, arama ve nöbet için gereken izinleri ister → { izinler } */
    @PluginMethod
    public void izinIste(PluginCall call) {
        String[] e = eksik(true, true, true);
        if (e.length == 0) {
            JSObject r = new JSObject();
            r.put("izinler", izinler());
            call.resolve(r);
            return;
        }
        requestPermissionForAliases(e, call, "izinSonucu");
    }

    @PermissionCallback
    private void izinSonucu(PluginCall call) {
        // İzin yeni verildiyse açık enkaz modunun işareti hemen denensin
        EnkazServisi.yenile(getContext());
        JSObject r = new JSObject();
        r.put("izinler", izinler());
        call.resolve(r);
    }

    /** "Her zaman izin ver": Android 11+ ayarlar sayfası açılır */
    @PluginMethod
    public void arkaPlanKonumIzni(PluginCall call) {
        if (!izin(Manifest.permission.ACCESS_FINE_LOCATION)) {
            requestPermissionForAlias("konum", call, "arkaKonumAdim2");
            return;
        }
        arkaKonumAdim2(call);
    }

    @PermissionCallback
    private void arkaKonumAdim2(PluginCall call) {
        if (Build.VERSION.SDK_INT < 29 || KonumKaydi.arkaPlanIzni(getContext()) || !izin(Manifest.permission.ACCESS_FINE_LOCATION)) {
            izinSonucu(call);
            return;
        }
        requestPermissionForAlias("arkaKonum", call, "izinSonucu");
    }

    /** Pil optimizasyonundan muafiyet penceresi (bazı markalar arka plan işlerini öldürür) */
    @PluginMethod
    public void pilMuafiyeti(PluginCall call) {
        Context c = getContext();
        JSObject r = new JSObject();
        try {
            PowerManager pm = (PowerManager) c.getSystemService(Context.POWER_SERVICE);
            if (pm != null && !pm.isIgnoringBatteryOptimizations(c.getPackageName())) {
                Intent i = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + c.getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                c.startActivity(i);
                r.put("acildi", true);
            } else r.put("acildi", false);
        } catch (Exception e) {
            r.put("acildi", false);
        }
        call.resolve(r);
    }

    @PluginMethod
    public void bluetoothAc(PluginCall call) {
        // Android 12+: açma isteği için önce Bluetooth izni gerekir
        if (Build.VERSION.SDK_INT >= 31 && !izin(Manifest.permission.BLUETOOTH_CONNECT)) {
            requestPermissionForAlias("bluetooth", call, "bluetoothIzinli");
            return;
        }
        bluetoothIzinli(call);
    }

    @PermissionCallback
    private void bluetoothIzinli(PluginCall call) {
        BluetoothAdapter a = EnkazBluetoothAdi.adaptor(getContext());
        if (a == null || a.isEnabled() || (Build.VERSION.SDK_INT >= 31 && !izin(Manifest.permission.BLUETOOTH_CONNECT))) {
            izinSonucu(call);
            return;
        }
        try {
            Intent i = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
            startActivityForResult(call, i, "bluetoothSonuc");
        } catch (Exception e) {
            izinSonucu(call);
        }
    }

    @ActivityCallback
    private void bluetoothSonuc(PluginCall call, ActivityResult r) {
        izinSonucu(call);
    }

    // ------------------------------------------------------------------ enkaz modu

    /** { etiket, kat? } → { izinler } ; izinleri ister, sonra servisi başlatır */
    @PluginMethod
    public void baslat(PluginCall call) {
        String[] e = eksik(true, true, true);
        if (e.length > 0) {
            requestPermissionForAliases(e, call, "baslatIzinli");
            return;
        }
        baslatIzinli(call);
    }

    @PermissionCallback
    private void baslatIzinli(PluginCall call) {
        Context c = getContext();
        String etiket = call.getString("etiket", "");
        Integer kat = call.getInt("kat");
        try {
            EnkazServisi.baslat(c, etiket, kat == null ? EnkazIsareti.KAT_YOK : kat, false);
        } catch (Exception ex) {
            // İzin pencereleri kapanırken uygulama henüz "önde" sayılmayabilir (Android 12+ arka
            // plandan ön plan servisi başlatılamaz): kısa süre sonra yeniden denenir; olmazsa
            // uygulama öne geldiğinde (handleOnResume) başlar
            getBridge().getActivity().getWindow().getDecorView().postDelayed(() -> EnkazServisi.yenile(c), 800);
        }
        izinSonucu(call);
    }

    @PluginMethod
    public void durdur(PluginCall call) {
        EnkazServisi.durdur(getContext());
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void sesCal(PluginCall call) {
        EnkazServisi.sesCal(getContext());
        call.resolve(new JSObject());
    }

    /** { dk } 0: sesi yeniden aç */
    @PluginMethod
    public void sesDuraklat(PluginCall call) {
        EnkazServisi.sesDuraklat(getContext(), call.getInt("dk", 10));
        call.resolve(new JSObject());
    }

    /** { etiket } → Bluetooth adını "ENKAZ · …" yapar ve 1 saatlik görünürlük ister → { sn, ad } */
    @PluginMethod
    public void gorunurOl(PluginCall call) {
        Context c = getContext();
        if (!EnkazBluetoothAdi.izin(c)) {
            requestPermissionForAlias("bluetooth", call, "gorunurIzinli");
            return;
        }
        gorunurIzinli(call);
    }

    @PermissionCallback
    private void gorunurIzinli(PluginCall call) {
        Context c = getContext();
        if (!EnkazBluetoothAdi.izin(c)) {
            JSObject r = new JSObject();
            r.put("sn", 0);
            r.put("hata", "izin-yok");
            call.resolve(r);
            return;
        }
        if (EnkazBluetoothAdi.adaptor(c) == null) {
            JSObject r = new JSObject();
            r.put("sn", 0);
            r.put("hata", "bluetooth-yok");
            call.resolve(r);
            return;
        }
        EnkazBluetoothAdi.ayarla(c, call.getString("etiket", ""));
        try {
            Intent i = new Intent(BluetoothAdapter.ACTION_REQUEST_DISCOVERABLE);
            i.putExtra(BluetoothAdapter.EXTRA_DISCOVERABLE_DURATION, 3600);
            startActivityForResult(call, i, "gorunurSonuc");
        } catch (Exception e) {
            EnkazBluetoothAdi.geriAl(c);
            JSObject r = new JSObject();
            r.put("sn", 0);
            r.put("hata", "acilamadi");
            call.resolve(r);
        }
    }

    @ActivityCallback
    private void gorunurSonuc(PluginCall call, ActivityResult r) {
        Context c = getContext();
        int sn = r.getResultCode() == Activity.RESULT_CANCELED ? 0 : Math.max(0, r.getResultCode());
        if (sn > 0) EnkazServisi.prefs(c).edit().putLong("gorunurBitis", System.currentTimeMillis() + sn * 1000L).apply();
        else EnkazBluetoothAdi.geriAl(c);
        JSObject o = new JSObject();
        o.put("sn", sn);
        o.put("ad", EnkazBluetoothAdi.yap(call.getString("etiket", "")));
        EnkazServisi.bildir(c);
        call.resolve(o);
    }

    /** Sarsıntıdan sonra otomatik açılışta kullanılacak etiket ve kat */
    @PluginMethod
    public void hazirlik(PluginCall call) {
        Integer kat = call.getInt("kat");
        EnkazServisi.prefs(getContext()).edit().putString("hazirEtiket", call.getString("etiket", ""))
                .putInt("hazirKat", kat == null ? EnkazIsareti.KAT_YOK : kat).apply();
        call.resolve(new JSObject());
    }

    // ------------------------------------------------------------------ arama ve nöbet

    @PluginMethod
    public void aramaBaslat(PluginCall call) {
        Context c = getContext();
        if (!EnkazTarayici.izin(c)) {
            String[] e = eksik(true, true, false);
            if (e.length > 0) {
                requestPermissionForAliases(e, call, "aramaIzinli");
                return;
            }
        }
        aramaIzinli(call);
    }

    @PermissionCallback
    private void aramaIzinli(PluginCall call) {
        String hata = EnkazTarayici.aramaBaslat(getContext(), o -> {
            try {
                notifyListeners("enkazDuyuldu", JSObject.fromJSONObject(o));
            } catch (Exception ignored) {}
        });
        JSObject r = new JSObject();
        r.put("basladi", hata == null);
        if (hata != null) r.put("hata", hata);
        r.put("izinler", izinler());
        call.resolve(r);
    }

    @PluginMethod
    public void aramaDurdur(PluginCall call) {
        EnkazTarayici.aramaDurdur(getContext());
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void duyulanlar(PluginCall call) {
        JSObject r = new JSObject();
        r.put("liste", toJs(EnkazTarayici.duyulanlar(getContext())));
        call.resolve(r);
    }

    @PluginMethod
    public void duyulanlariTemizle(PluginCall call) {
        EnkazTarayici.temizle(getContext());
        call.resolve(new JSObject());
    }

    /** { ac } → { acik, hata? } Arka planda dinleme; arka plan konum izni gerekir */
    @PluginMethod
    public void nobet(PluginCall call) {
        boolean ac = Boolean.TRUE.equals(call.getBoolean("ac", false));
        String hata = EnkazTarayici.nobet(getContext(), ac);
        if (hata != null) EnkazTarayici.nobet(getContext(), false);
        JSObject r = new JSObject();
        r.put("acik", ac && hata == null);
        if (hata != null) r.put("hata", hata);
        call.resolve(r);
    }

    @PluginMethod
    public void sarsinti(PluginCall call) {
        boolean ac = Boolean.TRUE.equals(call.getBoolean("ac", false));
        JSObject r = new JSObject();
        if (ac && !NotificationManagerCompat.from(getContext()).areNotificationsEnabled()) {
            // "İyi misiniz?" sorusu görünmezse yüksek sesli enkaz modu iptal edilemeden açılır
            r.put("acik", false);
            r.put("hata", "bildirim-kapali");
            call.resolve(r);
            return;
        }
        try {
            SarsintiServisi.ayarla(getContext(), ac);
            r.put("acik", ac);
        } catch (Exception e) {
            SarsintiServisi.ayarla(getContext(), false);
            r.put("acik", false);
            r.put("hata", "baslatilamadi");
        }
        call.resolve(r);
    }

    // ------------------------------------------------------------------ son konum kaydı

    @PluginMethod
    public void konumKaydi(PluginCall call) {
        Context c = getContext();
        JSObject r = new JSObject();
        r.put("mod", KonumKaydi.mod(c));
        r.put("liste", toJs(KonumKaydi.liste(c)));
        r.put("arkaPlanIzni", KonumKaydi.arkaPlanIzni(c));
        call.resolve(r);
    }

    /** { mod: "kapali" | "saatlik" | "hareketli" } */
    @PluginMethod
    public void konumKaydiModu(PluginCall call) {
        KonumKaydi.modAyarla(getContext(), call.getString("mod", "kapali"));
        konumKaydi(call);
    }

    /** Uygulamanın bulduğu konum: { lat, lon, dogruluk, zaman, kaynak } */
    @PluginMethod
    public void konumEkle(PluginCall call) {
        Double lat = call.getDouble("lat"), lon = call.getDouble("lon");
        if (lat == null || lon == null) {
            call.reject("lat/lon yok");
            return;
        }
        Double d = call.getDouble("dogruluk");
        Long z = call.getLong("zaman");
        KonumKaydi.ekle(getContext(), lat, lon, d == null ? 0f : d.floatValue(), z == null ? System.currentTimeMillis() : z,
                call.getString("kaynak", "uygulama"));
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void konumKaydiTemizle(PluginCall call) {
        KonumKaydi.temizle(getContext());
        call.resolve(new JSObject());
    }

    // ------------------------------------------------------------------ bildirimden açılış

    @PluginMethod
    public void acilisHedefi(PluginCall call) {
        JSObject r = new JSObject();
        String h = MainActivity.hedefAl();
        if (h != null) r.put("arac", h);
        call.resolve(r);
    }

    private static JSArray toJs(JSONArray a) {
        JSArray r = new JSArray();
        for (int i = 0; i < a.length(); i++) {
            Object o = a.opt(i);
            if (o instanceof JSONObject) {
                try {
                    r.put(JSObject.fromJSONObject((JSONObject) o));
                } catch (Exception ignored) {}
            } else r.put(o);
        }
        return r;
    }
}
