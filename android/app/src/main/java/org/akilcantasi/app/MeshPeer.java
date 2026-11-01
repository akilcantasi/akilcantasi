package org.akilcantasi.app;

import com.getcapacitor.JSObject;

/** AkilMeshPlugin'in bildiği bir Nearby uç noktası (komşu telefon). */
final class MeshPeer {
    /** Reklam adı biçimi: "<düğümKimliği>|<görünenAd>" */
    static final char NAME_SEP = '|';

    final String endpointId;
    String node = "";
    String name = "";
    boolean discovered;
    boolean pending;
    boolean connected;
    long lastSeen;
    long foundAt;

    MeshPeer(String endpointId) {
        this.endpointId = endpointId;
    }

    void setEndpointName(String endpointName) {
        if (endpointName == null) return;
        int i = endpointName.indexOf(NAME_SEP);
        if (i > 0) {
            node = endpointName.substring(0, i);
            name = endpointName.substring(i + 1);
        } else {
            name = endpointName;
        }
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
