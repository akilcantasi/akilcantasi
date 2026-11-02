package org.akilcantasi.app;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Uygulama güncellemesi. JS adı: "AkilGuncelleme" (src/lib/guncelleme.ts).
 * Kurulum yalnız kur() ile, yani kullanıcı düğmeye basınca başlar.
 * Olay: guncellemeDurum.
 */
@CapacitorPlugin(name = "AkilGuncelleme")
public class GuncellemePlugin extends Plugin {

    private Guncelleyici.Dinleyici dinleyici;

    @Override
    public void load() {
        super.load();
        dinleyici = d -> {
            try {
                notifyListeners("guncellemeDurum", JSObject.fromJSONObject(d));
            } catch (Exception ignored) {}
        };
        Guncelleyici.dinleyiciler.add(dinleyici);
        Guncelleyici.temizle(getContext());
    }

    @Override
    protected void handleOnDestroy() {
        Guncelleyici.dinleyiciler.remove(dinleyici);
        super.handleOnDestroy();
    }

    private void durumla(PluginCall call) {
        try {
            call.resolve(JSObject.fromJSONObject(Guncelleyici.durum(getContext())));
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void durum(PluginCall call) {
        durumla(call);
    }

    /** { kendiliginden } true: ölçülmeyen ağda yeni sürümü indirir de (kurmaz) */
    @PluginMethod
    public void denetle(PluginCall call) {
        Guncelleyici.denetle(getContext(), Boolean.TRUE.equals(call.getBoolean("kendiliginden", false)));
        durumla(call);
    }

    @PluginMethod
    public void indir(PluginCall call) {
        Guncelleyici.indir(getContext());
        durumla(call);
    }

    /** Kullanıcı "Kur"a bastı → { hata? } */
    @PluginMethod
    public void kur(PluginCall call) {
        String h = Guncelleyici.kur(getContext());
        JSObject r = new JSObject();
        if (h != null) r.put("hata", h);
        call.resolve(r);
    }

    /** "Bu kaynaktan uygulama yükle" izni ekranı (Android 8+) */
    @PluginMethod
    public void kurulumIzni(PluginCall call) {
        Context c = getContext();
        JSObject r = new JSObject();
        try {
            if (Build.VERSION.SDK_INT >= 26) {
                Intent i = new Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES, Uri.parse("package:" + c.getPackageName()));
                i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                c.startActivity(i);
                r.put("acildi", true);
            } else r.put("acildi", false);
        } catch (Exception e) {
            r.put("acildi", false);
        }
        call.resolve(r);
    }
}
