package org.akilcantasi.app;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.GnssStatus;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.SystemClock;

import androidx.core.content.ContextCompat;
import androidx.core.location.LocationManagerCompat;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Konum aramasını görünür kılan yerel izleyici.
 *
 * Tarayıcı konum arayüzü yalnızca "bulundu / bulunamadı" der; burada ise
 * GnssStatus ile görülen uydular (sinyal gücü, gökyüzündeki yeri, yörünge
 * verisinin inip inmediği, konum hesabında kullanılıp kullanılmadığı) ve
 * GPS/ağ sağlayıcılarının açık olup olmadığı saniyede bir JS'e iletilir.
 * Bulunan konum da aynı olayla gönderilir; harita onu doğrudan kullanır.
 *
 * Tüm çağrılar ana iş parçacığında yapılır (Handler ana Looper'a bağlı).
 */
public class KonumIzleyici {

    public interface Dinleyici {
        void durum(JSONObject d);
    }

    private static final long TAZE_MS = 30_000;

    private final Context ctx;
    private final LocationManager lm;
    private final Handler h = new Handler(Looper.getMainLooper());
    private final Dinleyici dinleyici;

    private boolean calisiyor = false;
    private long baslangic = 0;
    private long ilkKonumMs = -1;
    private JSONArray uydular = new JSONArray();
    private Location gpsKonum = null;
    private Location agKonum = null;
    private GnssStatus.Callback gnssCb = null;
    private LocationListener gpsL = null;
    private LocationListener agL = null;

    private final Runnable tik = new Runnable() {
        @Override
        public void run() {
            if (!calisiyor) return;
            gonder();
            h.postDelayed(this, 1000);
        }
    };

    public KonumIzleyici(Context ctx, Dinleyici dinleyici) {
        this.ctx = ctx.getApplicationContext();
        this.lm = (LocationManager) this.ctx.getSystemService(Context.LOCATION_SERVICE);
        this.dinleyici = dinleyici;
    }

    public boolean calisiyorMu() {
        return calisiyor;
    }

    private boolean izin(String p) {
        return ContextCompat.checkSelfPermission(ctx, p) == PackageManager.PERMISSION_GRANTED;
    }

    /** "tam" (GPS kullanılabilir), "yaklasik" (yalnız ağ konumu), "yok" */
    public String izinDurumu() {
        if (izin(Manifest.permission.ACCESS_FINE_LOCATION)) return "tam";
        if (izin(Manifest.permission.ACCESS_COARSE_LOCATION)) return "yaklasik";
        return "yok";
    }

    public void baslat() {
        h.post(this::baslatAna);
    }

    public void durdur() {
        h.post(this::durdurAna);
    }

    private void baslatAna() {
        if (calisiyor || lm == null) {
            if (lm == null) gonder();
            return;
        }
        calisiyor = true;
        baslangic = SystemClock.elapsedRealtime();
        ilkKonumMs = -1;
        uydular = new JSONArray();
        gpsKonum = null;
        agKonum = null;
        boolean tam = izin(Manifest.permission.ACCESS_FINE_LOCATION);
        boolean yaklasik = tam || izin(Manifest.permission.ACCESS_COARSE_LOCATION);
        try {
            if (tam && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                gnssCb = new GnssStatus.Callback() {
                    @Override
                    public void onSatelliteStatusChanged(GnssStatus s) {
                        uydular = uyduListesi(s);
                    }

                    @Override
                    public void onFirstFix(int ttffMillis) {
                        if (ilkKonumMs < 0) ilkKonumMs = ttffMillis;
                    }

                    @Override
                    public void onStopped() {
                        uydular = new JSONArray();
                    }
                };
                lm.registerGnssStatusCallback(gnssCb, h);
            }
            if (tam && lm.getAllProviders().contains(LocationManager.GPS_PROVIDER)) {
                gpsL = dinleyiciYap(true);
                lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 1000, 0, gpsL, Looper.getMainLooper());
            }
            if (yaklasik && lm.getAllProviders().contains(LocationManager.NETWORK_PROVIDER)) {
                agL = dinleyiciYap(false);
                lm.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 2000, 0, agL, Looper.getMainLooper());
            }
        } catch (SecurityException | IllegalArgumentException ignored) {
            // İzin yarıda geri alındıysa ya da sağlayıcı yoksa durum yine bildirilir
        }
        h.removeCallbacks(tik);
        h.post(tik);
    }

    private LocationListener dinleyiciYap(final boolean gps) {
        return new LocationListener() {
            @Override
            public void onLocationChanged(Location l) {
                if (gps) gpsKonum = l;
                else agKonum = l;
                if (ilkKonumMs < 0) ilkKonumMs = SystemClock.elapsedRealtime() - baslangic;
                gonder();
            }

            @Override
            public void onProviderEnabled(String p) {
                gonder();
            }

            @Override
            public void onProviderDisabled(String p) {
                gonder();
            }

            // API 24–29'da soyut; boş bırakılır
            @Override
            public void onStatusChanged(String p, int st, Bundle b) {}
        };
    }

    private void durdurAna() {
        calisiyor = false;
        h.removeCallbacks(tik);
        if (lm == null) return;
        try {
            if (gnssCb != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) lm.unregisterGnssStatusCallback(gnssCb);
            if (gpsL != null) lm.removeUpdates(gpsL);
            if (agL != null) lm.removeUpdates(agL);
        } catch (Exception ignored) {
        }
        gnssCb = null;
        gpsL = null;
        agL = null;
    }

    private static JSONArray uyduListesi(GnssStatus s) {
        JSONArray a = new JSONArray();
        int n = s.getSatelliteCount();
        for (int i = 0; i < n; i++) {
            try {
                JSONObject o = new JSONObject();
                o.put("id", s.getSvid(i));
                o.put("tur", turAdi(s.getConstellationType(i)));
                o.put("sinyal", Math.round(s.getCn0DbHz(i) * 10) / 10.0);
                o.put("kullanilan", s.usedInFix(i));
                // Yörünge verisi (API 26+): yoksa uydu görünür ama konumda kullanılamaz
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) o.put("yorunge", s.hasEphemerisData(i));
                o.put("az", Math.round(s.getAzimuthDegrees(i)));
                o.put("yukseklik", Math.round(s.getElevationDegrees(i)));
                a.put(o);
            } catch (Exception ignored) {
            }
        }
        return a;
    }

    private static String turAdi(int t) {
        switch (t) {
            case GnssStatus.CONSTELLATION_GPS: return "GPS";
            case GnssStatus.CONSTELLATION_GLONASS: return "GLONASS";
            case GnssStatus.CONSTELLATION_GALILEO: return "Galileo";
            case GnssStatus.CONSTELLATION_BEIDOU: return "BeiDou";
            case GnssStatus.CONSTELLATION_QZSS: return "QZSS";
            case GnssStatus.CONSTELLATION_SBAS: return "SBAS";
            default: return "Diğer";
        }
    }

    private static boolean taze(Location l) {
        if (l == null) return false;
        long yas = (SystemClock.elapsedRealtimeNanos() - l.getElapsedRealtimeNanos()) / 1_000_000L;
        return yas >= 0 && yas < TAZE_MS;
    }

    private void gonder() {
        try {
            JSONObject d = new JSONObject();
            d.put("izin", izinDurumu());
            boolean gpsVar = lm != null && lm.getAllProviders().contains(LocationManager.GPS_PROVIDER);
            d.put("gpsVar", gpsVar);
            d.put("konumAcik", lm != null && LocationManagerCompat.isLocationEnabled(lm));
            d.put("gpsAcik", gpsVar && lm.isProviderEnabled(LocationManager.GPS_PROVIDER));
            d.put("agAcik", lm != null && lm.getAllProviders().contains(LocationManager.NETWORK_PROVIDER)
                    && lm.isProviderEnabled(LocationManager.NETWORK_PROVIDER));
            d.put("gecenMs", calisiyor ? SystemClock.elapsedRealtime() - baslangic : 0);
            d.put("ilkKonumMs", ilkKonumMs);
            d.put("uydular", uydular);
            // GPS konumu tazeyse o; değilse taze ağ konumu
            Location l = taze(gpsKonum) ? gpsKonum : taze(agKonum) ? agKonum : null;
            if (l != null) {
                JSONObject k = new JSONObject();
                k.put("lat", l.getLatitude());
                k.put("lon", l.getLongitude());
                k.put("dogruluk", l.hasAccuracy() ? l.getAccuracy() : 0);
                k.put("zaman", l.getTime());
                k.put("kaynak", l == gpsKonum ? "gps" : "ag");
                d.put("konum", k);
            }
            dinleyici.durum(d);
        } catch (Exception ignored) {
        }
    }
}
