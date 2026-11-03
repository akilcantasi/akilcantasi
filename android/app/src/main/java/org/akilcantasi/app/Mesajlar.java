package org.akilcantasi.app;

/**
 * Kurtarıcı ile enkazdaki kişi arasındaki hazır kısa mesajlar. Bluetooth işaretine yalnız
 * numarası sığar (bkz. EnkazIsareti). Aynı liste src/lib/enkaz/mesajlar.ts'de; sıra ve
 * metinler aynı olmalı (tests/enkaz-mesaj.test.ts denetler). Yeni mesaj sona eklenir,
 * var olanın numarası değiştirilmez (eski sürümlerle uyum).
 */
public final class Mesajlar {
    private Mesajlar() {}

    /** Kurtarıcıdan enkazdaki kişiye (1'den başlar) */
    public static final String[] MESAJLAR = {
        "",
        "Sesini duyduk, geliyoruz.",
        "Yerini bulduk, sabret.",
        "Duvara ya da boruya vur.",
        "Sessiz ol, dinliyoruz.",
        "Hareket etme, enerjini koru.",
        "Seslen, sesini duyalım.",
        "Işığın varsa yak.",
        "Ağzını bezle kapat, toz var.",
        "Kaç kişisiniz? Yanıt ver.",
        "Yaralı mısın? Yanıt ver.",
    };

    /** Enkazdaki kişiden kurtarıcıya (1'den başlar) */
    public static final String[] YANITLAR = {
        "",
        "Duydum.",
        "İyiyim, yaralı değilim.",
        "Yaralıyım.",
        "Ağır yaralıyım.",
        "Nefes almakta zorlanıyorum.",
        "Yalnızım.",
        "İki kişiyiz.",
        "Üç ya da daha çok kişiyiz.",
        "Yanımda çocuk var.",
        "Su lazım.",
    };

    static String mesaj(int k) {
        return k > 0 && k < MESAJLAR.length ? MESAJLAR[k] : "";
    }

    static String yanit(int k) {
        return k > 0 && k < YANITLAR.length ? YANITLAR[k] : "";
    }
}
