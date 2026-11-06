package org.akilcantasi.app;

import com.getcapacitor.JSObject;

/** AkilMeshPlugin'in bildiği bir Nearby uç noktası (komşu telefon). */
final class MeshPeer {
    /** Reklam adı biçimi: "<düğümKimliği>|<görünenAd>" */
    static final char NAME_SEP = '|';
    /** Karşı tarafın verdiği adın en çok uzunluğu (JS tarafındaki MAX_FROM ile aynı) */
    static final int AD_EN_COK = 40;
    /**
     * Gelen yük sınırı (komşu başına jeton kovası): bir anda en çok KOVA çerçeve, sonra saniyede
     * HIZ çerçeve. 500 mesajlık tam eşitleme ~30 çerçevedir; sınırı yalnız sel gibi gönderen aşar.
     */
    static final int KOVA = 120, HIZ = 20;

    final String endpointId;
    String node = "";
    String name = "";
    boolean discovered;
    boolean pending;
    boolean connected;
    long lastSeen;
    long foundAt;
    private double jeton = KOVA;
    private long jetonZamani = -1;
    /** Sınırı aştığı için atılan çerçeve sayısı */
    long atilan;

    MeshPeer(String endpointId) {
        this.endpointId = endpointId;
    }

    /** Uzaktan gelen ad güvenilmez: düğüm kimliği biçime uymazsa boş, ad denetim/yön karakterlerinden arınır ve kısaltılır */
    void setEndpointName(String endpointName) {
        if (endpointName == null) return;
        int i = endpointName.indexOf(NAME_SEP);
        String n = i > 0 ? endpointName.substring(0, i) : "";
        node = n.matches("[A-Za-z0-9_-]{4,32}") ? n : "";
        name = temizAd(i > 0 ? endpointName.substring(i + 1) : endpointName);
    }

    static String temizAd(String s) {
        StringBuilder b = new StringBuilder();
        for (int k = 0; k < s.length() && b.length() < AD_EN_COK; k++) {
            char c = s.charAt(k);
            int t = Character.getType(c);
            // Denetim (Cc) ve biçim (Cf: yön çevirme, sıfır genişlik) karakterleri atılır
            if (t == Character.CONTROL || t == Character.FORMAT) continue;
            b.append(c);
        }
        // Kısaltma bir vekil çiftini ortadan bölmesin
        int n = b.length();
        if (n > 0 && Character.isHighSurrogate(b.charAt(n - 1))) b.setLength(n - 1);
        return b.toString().trim();
    }

    /** Bu komşudan bir çerçeve daha kabul edilir mi (jeton kovası). simdi: tekdüze saat, ms */
    boolean jetonAl(long simdi) {
        if (jetonZamani < 0 || simdi < jetonZamani) jetonZamani = simdi;
        jeton = Math.min(KOVA, jeton + (simdi - jetonZamani) * HIZ / 1000.0);
        jetonZamani = simdi;
        if (jeton < 1) {
            atilan++;
            return false;
        }
        jeton -= 1;
        return true;
    }

    /** Reklam adı üretir; Nearby uç nokta adı kısa olmalı (BLE reklamı küçük). */
    static String encodeName(String nodeId, String displayName) {
        String n = displayName == null ? "" : displayName.replace(NAME_SEP, ' ').trim();
        if (n.length() > 20) n = n.substring(0, 20);
        return nodeId + NAME_SEP + n;
    }

    JSObject toJS() {
        JSObject o = new JSObject();
        o.put("id", endpointId);
        o.put("node", node);
        o.put("name", name);
        o.put("connected", connected);
        return o;
    }
}
