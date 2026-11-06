package org.akilcantasi.app;

import java.util.Map;

/** InfoPointServer.Board paket içi olduğu için sınama aynı pakette. Çıkış kodu: hata sayısı */
public final class PanoSinama {
    private PanoSinama() {}
    static int hata = 0;
    static void ok(boolean c, String m) { System.out.println((c ? "OK   " : "HATA ") + m); if (!c) hata++; }

    // Node crypto ile üretilmiş vektörler (tohum 7 = ilan sahibi, tohum 9 = yabancı)
    static final String P = "6kpsY-KcUgq-9VB7Ey7F-ZVHdq6-vnuSQh7qaRRG0iw";
    static final String SIG = "YfAFq8kC-xahuj_IhEa6jBz_FbzOmBw_ekmHscpNnlxikWaSLTzix-iOA8ogVPajdi_NYK_yOdckpByouFK_DQ";
    static final String U1 = "cbEyQeoESvHVGamWcxp7EDZIShNW5FtxN2i7NAptB50ZKUg6xlpGA3JRNgBoLHg9Ig0rUtLyVjRAyALMX46dBQ";
    static final String U2 = "LxJxCqBWExWir-fmNsv_1snl-Yh6t-cZtyOL_LBfxoOtXXlix3paSKPWcXVOqB71rjfop7afWKskUZZb78ptBw";
    static final String SAHTE = "cWfR28d9u8ZvUOHpvq7fXcQGzjiCl7uCwlPGuCkXxFtRdchzLGs8hhN_EEEtKGwz3GA273fFXRoerDK69pmMBw";
    static final long T = 1767225600000L;
    static final String ID = "6kpsY-KcUg-imzali-0001";

    static InfoPointServer.Board.Item item(String json) {
        Object v = InfoPointServer.Board.validate(new InfoPointServer.Json(json).parseTop());
        if (!(v instanceof InfoPointServer.Board.Item)) throw new IllegalStateException(String.valueOf(v));
        return (InfoPointServer.Board.Item) v;
    }

    static String ilan(String ek) {
        return "{\"id\":\"" + ID + "\",\"kind\":\"kayip\",\"from\":\"Ayşe\",\"text\":\"Ad: Mehmet\",\"pub\":\"" + P + "\",\"sig\":\"" + SIG + "\",\"ts\":" + T + ek + "}";
    }

    static String upd(String st, long ts, String sig) {
        return ",\"status\":\"" + st + "\",\"upd\":{\"st\":\"" + st + "\",\"ts\":" + ts + ",\"sig\":\"" + sig + "\"}";
    }

    static void senaryo(boolean edVar) throws Exception {
        InfoPointServer.Board.ed25519Kapali = !edVar;
        String k = edVar ? "[Ed25519 var] " : "[Ed25519 yok] ";
        InfoPointServer.Board b = new InfoPointServer.Board(null, 100, 100);
        InfoPointServer.Board.Result r = b.add(item(ilan("")), false);
        ok(r.status == 201 && "araniyor".equals(r.item.status), k + "imzalı ilan eklenir");
        ok(r.item.toJson().contains("\"pub\":\"" + P + "\"") && r.item.toJson().contains("\"ts\":" + T), k + "imza alanları JSON'da");
        r = b.add(item("{\"id\":\"" + ID + "\",\"kind\":\"kayip\",\"from\":\"Kötü\",\"text\":\"x\",\"status\":\"bulundu\"}"), false);
        ok(r.status == 403 && r.error.contains("yalnızca ilanı veren"), k + "imzasız bulundu 403");
        r = b.add(item(ilan(",\"status\":\"bulundu\"")), false);
        ok(r.status == 403, k + "güncellemesiz bulundu 403");
        r = b.add(item(ilan(upd("bulundu", T + 30, SAHTE))), false);
        if (edVar) ok(r.status == 403, k + "yabancı anahtarla imzalı bulundu 403");
        else {
            ok(r.status == 403 && r.error.contains("doğrulayamıyor"), k + "doğrulanamayan durum güncellemesi saklanmaz (403)");
            // ileri tarihli sahte güncelleme sahibini kilitleyemez: durum "aranıyor" kalır
            r = b.add(item(ilan(upd("bulundu", T + 23L * 3600_000L, SAHTE))), false);
            ok(r.status == 403, k + "ileri tarihli sahte güncelleme saklanmaz");
        }
        // kimlik bağlama: aynı imza, öneksiz kimlik → 403
        InfoPointServer.Board.Result rk = b.add(item(ilan("").replace(ID, "baska-kimlik-01")), false);
        ok(rk.status == 403 && rk.error.contains("kimliği"), k + "kimliği anahtarına bağlı olmayan imzalı kayıt 403");
        if (!edVar) return;
        // ilanın kendi imzası API 33+'ta denetlenir: metni değiştirilmiş kopya 403
        InfoPointServer.Board b2 = new InfoPointServer.Board(null, 100, 100);
        rk = b2.add(item(ilan("").replace("Ad: Mehmet", "Ad: Sahte")), false);
        ok(rk.status == 403 && rk.error.contains("İmza"), k + "metni değiştirilmiş imzalı ilan 403");
        r = b.add(item(ilan(upd("bulundu", T + 10, U1))), false);
        ok(r.status == 200 && !r.duplicate && "bulundu".equals(r.item.status), k + "sahibin bulundu güncellemesi kabul");
        r = b.add(item(ilan(upd("bulundu", T + 10, U1))), false);
        ok(r.status == 200 && r.duplicate, k + "aynı güncelleme yinelenince tekrar");
        r = b.add(item(ilan(upd("araniyor", T + 20, U2))), false);
        ok(r.status == 200 && "araniyor".equals(r.item.status), k + "sahibi yeniden aranıyor yapar");
        r = b.add(item(ilan(upd("bulundu", T + 10, U1))), false);
        ok(r.status == 200 && "araniyor".equals(r.item.status), k + "eski gerçek güncelleme yenisini ezmez");
        // bozuk biçim
        Object v = InfoPointServer.Board.validate(new InfoPointServer.Json(ilan("").replace(SIG, "kisa")).parseTop());
        ok("Geçersiz imza".equals(v), k + "bozuk imza biçimi reddedilir");
        // eski davranış
        b.add(item("{\"id\":\"eski-0001\",\"kind\":\"kayip\",\"from\":\"Ali\",\"text\":\"Ad: Veli\"}"), false);
        r = b.add(item("{\"id\":\"eski-0001\",\"kind\":\"kayip\",\"from\":\"Başka\",\"text\":\"x\",\"status\":\"bulundu\"}"), false);
        ok(r.status == 200 && "bulundu".equals(r.item.status), k + "imzasız eski ilan herkesçe bulundu yapılabilir");
    }

    public static void main(String[] a) throws Exception {
        Boolean dene = InfoPointServer.Board.ed25519Dogrula(P, InfoPointServer.Board.kanonikDurum(ID, "bulundu", T + 10, P), U1);
        ok(Boolean.TRUE.equals(dene), "Ed25519: Node'da üretilen imza Java'da doğrulanır");
        ok(Boolean.FALSE.equals(InfoPointServer.Board.ed25519Dogrula(P, InfoPointServer.Board.kanonikDurum(ID, "bulundu", T + 11, P), U1)), "Ed25519: içerik değişince tutmaz");
        ok(InfoPointServer.Board.b64uCoz(P).length == 32 && InfoPointServer.Board.b64uCoz("a=b") == null, "base64url çözücü");
        senaryo(true);
        senaryo(false);
        System.out.println(hata == 0 ? "Tümü geçti." : hata + " hata");
        System.exit(hata);
    }
}
