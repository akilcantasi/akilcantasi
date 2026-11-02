package org.akilcantasi.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.content.ContextCompat;

/**
 * Uygulamasız görünürlük: telefonun Bluetooth adı "ENKAZ · …" yapılır; görünür olunca
 * herhangi bir telefonun Bluetooth eşleştirme listesinde bu ad çıkar. Eski ad saklanır ve
 * enkaz modu kapanınca geri yüklenir.
 */
final class EnkazBluetoothAdi {

    private EnkazBluetoothAdi() {}

    /** Ad değiştirme (CONNECT) ve görünürlük isteği (ADVERTISE) için */
    static boolean izin(Context c) {
        return Build.VERSION.SDK_INT < 31
                || (ContextCompat.checkSelfPermission(c, Manifest.permission.BLUETOOTH_CONNECT) == PackageManager.PERMISSION_GRANTED
                    && ContextCompat.checkSelfPermission(c, Manifest.permission.BLUETOOTH_ADVERTISE) == PackageManager.PERMISSION_GRANTED);
    }

    static BluetoothAdapter adaptor(Context c) {
        BluetoothManager bm = (BluetoothManager) c.getSystemService(Context.BLUETOOTH_SERVICE);
        return bm == null ? null : bm.getAdapter();
    }

    static boolean aktif(Context c) {
        return EnkazServisi.prefs(c).contains("btAdEski");
    }

    /** Bluetooth adı en çok 248 bayt olabilir; eşleştirme listesinde kısa ad okunur */
    static String yap(String etiket) {
        String e = etiket == null ? "" : etiket.trim();
        String ad = "ENKAZ" + (e.isEmpty() ? "" : " · " + e);
        return ad.length() > 40 ? ad.substring(0, 40) : ad;
    }

    @SuppressLint("MissingPermission")
    static boolean ayarla(Context c, String etiket) {
        if (!izin(c)) return false;
        BluetoothAdapter a = adaptor(c);
        if (a == null) return false;
        try {
            SharedPreferences p = EnkazServisi.prefs(c);
            if (!p.contains("btAdEski")) p.edit().putString("btAdEski", a.getName() == null ? "" : a.getName()).apply();
            return a.setName(yap(etiket));
        } catch (Exception e) {
            return false;
        }
    }

    @SuppressLint("MissingPermission")
    static void geriAl(Context c) {
        SharedPreferences p = EnkazServisi.prefs(c);
        if (!p.contains("btAdEski")) return;
        String eski = p.getString("btAdEski", "");
        BluetoothAdapter a = adaptor(c);
        try {
            if (a != null && izin(c) && !eski.isEmpty()) a.setName(eski);
        } catch (Exception ignored) {}
        p.edit().remove("btAdEski").putLong("gorunurBitis", 0).apply();
    }
}
