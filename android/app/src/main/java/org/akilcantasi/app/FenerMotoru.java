package org.akilcantasi.app;

/**
 * Fener yerel motoru (llama.cpp, fener_jni.cpp). Android'e bağımlı değildir; masaüstünde de
 * sınanır (tools/fener-sinama). Kütüphane yüklenemezse (eski/32 bit cihaz, derlemede yok)
 * var() false döner ve uygulama WebView'daki motoru kullanır.
 */
public final class FenerMotoru {

    /** Üretilen her metin parçası (tam UTF-8). false dönerse üretim durur. */
    public interface Akis {
        boolean parca(byte[] utf8);
    }

    private static Boolean var;
    private static String yuklemeHatasi = "";

    private FenerMotoru() {}

    /** Yerel kütüphane yüklü mü (ilk çağrıda yüklemeyi dener) */
    public static synchronized boolean var(String arkaUcKlasoru) {
        if (var != null) return var;
        try {
            System.loadLibrary("fener");
            baslat(arkaUcKlasoru == null ? "" : arkaUcKlasoru);
            var = true;
        } catch (Throwable t) {
            yuklemeHatasi = t.getClass().getSimpleName() + ": " + t.getMessage();
            var = false;
        }
        return var;
    }

    public static String yuklemeHatasi() {
        return yuklemeHatasi;
    }

    static native void baslat(String arkaUcKlasoru);

    /** {"devices":"CPU,GPUOpenCL","gpu":true,"system":"..."} */
    public static native String arkaUclar();

    public static native String sonHata();

    /** 0 = başarısız (sonHata()) */
    public static native long yukle(String yol, int nCtx, int nThreads, int nGpuLayers);

    public static native String bilgi(long h);

    public static native String sohbet(long h, String[] roller, String[] icerikler, int maxTokens, float temp, int topK, float topP, float repeat, Akis akis);

    public static native void durdur(long h);

    public static native void bosalt(long h);
}
