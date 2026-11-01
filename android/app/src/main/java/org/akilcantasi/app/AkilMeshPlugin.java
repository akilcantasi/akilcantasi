package org.akilcantasi.app;

import android.os.Build;
import android.util.Log;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.nearby.Nearby;
import com.google.android.gms.nearby.connection.AdvertisingOptions;
import com.google.android.gms.nearby.connection.ConnectionInfo;
import com.google.android.gms.nearby.connection.ConnectionLifecycleCallback;
import com.google.android.gms.nearby.connection.ConnectionResolution;
import com.google.android.gms.nearby.connection.ConnectionsClient;
import com.google.android.gms.nearby.connection.ConnectionsStatusCodes;
import com.google.android.gms.nearby.connection.DiscoveredEndpointInfo;
import com.google.android.gms.nearby.connection.DiscoveryOptions;
import com.google.android.gms.nearby.connection.EndpointDiscoveryCallback;
import com.google.android.gms.nearby.connection.Payload;
import com.google.android.gms.nearby.connection.PayloadCallback;
import com.google.android.gms.nearby.connection.PayloadTransferUpdate;
import com.google.android.gms.nearby.connection.Strategy;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Şebekesiz cihazdan cihaza mesajlaşma: Google Nearby Connections (P2P_CLUSTER).
 *
 * Bu sınıf yalnızca bayt taşır: reklam + keşif yapar, bağlantıları otomatik
 * kabul eder, BYTES yüklerini gönderir/alır, komşu listesini bildirir.
 * Biriktir-ve-ilet / dedikodu protokolü JS tarafındadır (src/lib/mesh/).
 *
 * JS adı: "AkilMesh". Sözleşme: docs/MESH.md
 *   isAvailable() -> { available, gms, maxBytes, sdk }
 *   start({ nodeId, name }) -> { started, error? }
 *   stop() -> {}
 *   send({ to?, data }) -> { sent }   (data: UTF-8 metin; to yoksa tüm bağlılar)
 *   getPeers() -> { peers: [{ id, node, name, connected }] }
 * Olaylar:
 *   meshMessage { from, data }   meshPeers { peers }   meshState { running, error? }
 *
 * UYARI: Gerçek cihazlarda henüz denenmedi (bkz. docs/MESH.md test planı).
 */
@CapacitorPlugin(
    name = "AkilMesh",
    permissions = {
        // Android 6–12 (API 23–32): BLE/Wi-Fi taraması konum izni ister
        @Permission(alias = "location", strings = { "android.permission.ACCESS_FINE_LOCATION", "android.permission.ACCESS_COARSE_LOCATION" }),
        // Android 12+ (API 31+)
        @Permission(
            alias = "bluetooth",
            strings = { "android.permission.BLUETOOTH_SCAN", "android.permission.BLUETOOTH_ADVERTISE", "android.permission.BLUETOOTH_CONNECT" }
        ),
        // Android 13+ (API 33+)
        @Permission(alias = "nearbyWifi", strings = { "android.permission.NEARBY_WIFI_DEVICES" })
    }
)
public class AkilMeshPlugin extends Plugin {

    private static final String TAG = "AkilMesh";
    /** Tüm Akıl Çantası telefonları aynı hizmet kimliğini kullanır. */
    static final String SERVICE_ID = "org.akilcantasi.mesh.v1";
    private static final Strategy STRATEGY = Strategy.P2P_CLUSTER;
    /** Pil ve bant genişliği için aynı anda en fazla bağlı komşu */
    private static final int MAX_CONNECTED = 6;
    /** Kimliği büyük olan taraf, küçük taraf bu süre içinde bağlanmazsa kendisi ister */
    private static final long FALLBACK_REQUEST_MS = 8_000;
    /** Bekleyen isteği bu süre sonra unut (yanıt gelmediyse) */
    private static final long PENDING_TIMEOUT_MS = 30_000;
    /** Hiç komşu yoksa keşfi tazeleme aralığı */
    private static final long WATCHDOG_MS = 45_000;

    private final Object lock = new Object();
    private final Map<String, MeshPeer> peers = new HashMap<>();
    private ConnectionsClient client;
    private ScheduledExecutorService timer;
    private boolean running;
    private String nodeId = "";
    private String endpointName = "";
    private long lastRestart;

    // ------------------------------------------------------------------ JS yöntemleri

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject r = new JSObject();
        boolean gms = hasPlayServices();
        r.put("available", gms);
        r.put("gms", gms);
        r.put("maxBytes", ConnectionsClient.MAX_BYTES_DATA_SIZE);
        r.put("sdk", Build.VERSION.SDK_INT);
        call.resolve(r);
    }

    @PluginMethod
    public void start(PluginCall call) {
        String nid = call.getString("nodeId", "");
        String name = call.getString("name", "");
        if (nid == null || !nid.matches("[A-Za-z0-9_-]{4,32}")) {
            call.reject("nodeId geçersiz");
            return;
        }
        if (!hasPlayServices()) {
            resolveStart(call, false, "gms");
            return;
        }
        synchronized (lock) {
            nodeId = nid;
            endpointName = MeshPeer.encodeName(nid, name);
        }
        String[] needed = neededAliases();
        if (!allGranted(needed)) {
            requestPermissionForAliases(needed, call, "startPermsCallback");
            return;
        }
        doStart(call);
    }

    @PermissionCallback
    private void startPermsCallback(PluginCall call) {
        if (call == null) return;
        if (allGranted(neededAliases())) doStart(call);
        else resolveStart(call, false, "permission");
    }

    @PluginMethod
    public void stop(PluginCall call) {
        stopAll();
        call.resolve(new JSObject());
    }

    @PluginMethod
    public void send(PluginCall call) {
        String data = call.getString("data");
        String to = call.getString("to");
        if (data == null) {
            call.reject("data gerekli");
            return;
        }
        byte[] bytes = data.getBytes(StandardCharsets.UTF_8);
        if (bytes.length > ConnectionsClient.MAX_BYTES_DATA_SIZE) {
            call.reject("çerçeve çok büyük: " + bytes.length);
            return;
        }
        List<String> targets = new ArrayList<>();
        ConnectionsClient c;
        synchronized (lock) {
            c = client;
            if (to != null && !to.isEmpty()) {
                MeshPeer p = peers.get(to);
                if (p != null && p.connected) targets.add(to);
            } else {
                for (MeshPeer p : peers.values()) if (p.connected) targets.add(p.endpointId);
            }
        }
        JSObject r = new JSObject();
        if (c == null || targets.isEmpty()) {
            r.put("sent", 0);
            call.resolve(r);
            return;
        }
        final int n = targets.size();
        c.sendPayload(targets, Payload.fromBytes(bytes))
            .addOnSuccessListener(unused -> {
                JSObject ok = new JSObject();
                ok.put("sent", n);
                call.resolve(ok);
            })
            .addOnFailureListener(e -> {
                Log.w(TAG, "sendPayload başarısız: " + statusOf(e));
                JSObject fail = new JSObject();
                fail.put("sent", 0);
                fail.put("error", "nearby:" + statusOf(e));
                call.resolve(fail);
            });
    }

    @PluginMethod
    public void getPeers(PluginCall call) {
        JSObject r = new JSObject();
        r.put("peers", peersJS());
        call.resolve(r);
    }

    @Override
    protected void handleOnDestroy() {
        stopAll();
    }

    // ------------------------------------------------------------------ başlat / durdur

    private void doStart(final PluginCall call) {
        final ConnectionsClient c;
        final String name;
        synchronized (lock) {
            if (running && client != null) {
                resolveStart(call, true, null);
                return;
            }
            client = Nearby.getConnectionsClient(getContext());
            c = client;
            name = endpointName;
            peers.clear();
        }
        AdvertisingOptions adv = new AdvertisingOptions.Builder().setStrategy(STRATEGY).build();
        c.startAdvertising(name, SERVICE_ID, lifecycle, adv)
            .addOnSuccessListener(unused -> startDiscovery(c, call))
            .addOnFailureListener(e -> {
                int code = statusOf(e);
                if (code == ConnectionsStatusCodes.STATUS_ALREADY_ADVERTISING) {
                    startDiscovery(c, call);
                } else {
                    Log.w(TAG, "startAdvertising başarısız: " + code);
                    c.stopAllEndpoints();
                    synchronized (lock) {
                        if (client == c) client = null;
                    }
                    resolveStart(call, false, "nearby:" + code);
                }
            });
    }

    private void startDiscovery(final ConnectionsClient c, final PluginCall call) {
        DiscoveryOptions disc = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
        c.startDiscovery(SERVICE_ID, discovery, disc)
            .addOnSuccessListener(unused -> onStarted(call))
            .addOnFailureListener(e -> {
                int code = statusOf(e);
                if (code == ConnectionsStatusCodes.STATUS_ALREADY_DISCOVERING) {
                    onStarted(call);
                } else {
                    Log.w(TAG, "startDiscovery başarısız: " + code);
                    c.stopAdvertising();
                    c.stopAllEndpoints();
                    synchronized (lock) {
                        if (client == c) client = null;
                    }
                    resolveStart(call, false, "nearby:" + code);
                }
            });
    }

    private void onStarted(PluginCall call) {
        synchronized (lock) {
            running = true;
            lastRestart = System.currentTimeMillis();
            if (timer == null) {
                timer = Executors.newSingleThreadScheduledExecutor();
                timer.scheduleWithFixedDelay(this::tick, 2, 2, TimeUnit.SECONDS);
            }
        }
        resolveStart(call, true, null);
        emitState(null);
    }

    private void stopAll() {
        ConnectionsClient c;
        ScheduledExecutorService t;
        synchronized (lock) {
            c = client;
            t = timer;
            client = null;
            timer = null;
            running = false;
            peers.clear();
        }
        if (t != null) t.shutdownNow();
        if (c != null) {
            try {
                c.stopAdvertising();
                c.stopDiscovery();
                c.stopAllEndpoints();
            } catch (Exception e) {
                Log.w(TAG, "durdurma hatası", e);
            }
        }
        emitPeers();
        emitState(null);
    }

    private void resolveStart(PluginCall call, boolean started, String error) {
        JSObject r = new JSObject();
        r.put("started", started);
        if (error != null) r.put("error", error);
        call.resolve(r);
    }

    // ------------------------------------------------------------------ zamanlayıcı

    /** 2 sn'de bir: gecikmeli bağlantı istekleri, zaman aşımları, keşif tazeleme */
    private void tick() {
        try {
            long now = System.currentTimeMillis();
            List<String> toRequest = new ArrayList<>();
            boolean restart = false;
            ConnectionsClient c;
            synchronized (lock) {
                c = client;
                if (!running || c == null) return;
                int connected = 0;
                for (MeshPeer p : peers.values()) {
                    if (p.connected) connected++;
                    if (p.pending && now - p.lastSeen > PENDING_TIMEOUT_MS) p.pending = false;
                    if (p.discovered && !p.connected && !p.pending && now - p.foundAt > FALLBACK_REQUEST_MS) {
                        toRequest.add(p.endpointId);
                    }
                }
                if (connected >= MAX_CONNECTED) toRequest.clear();
                if (connected == 0 && now - lastRestart > WATCHDOG_MS) {
                    restart = true;
                    lastRestart = now;
                }
            }
            for (String id : toRequest) request(c, id);
            if (restart) {
                // Bazı cihazlarda keşif bir süre sonra yeni uç noktaları bildirmeyi
                // keser; komşu yokken keşfi yeniden başlatmak bunu giderir.
                c.stopDiscovery();
                DiscoveryOptions disc = new DiscoveryOptions.Builder().setStrategy(STRATEGY).build();
                c.startDiscovery(SERVICE_ID, discovery, disc)
                    .addOnFailureListener(e -> Log.w(TAG, "keşif tazeleme: " + statusOf(e)));
            }
        } catch (Exception e) {
            Log.w(TAG, "tick", e);
        }
    }

    private void request(ConnectionsClient c, final String endpointId) {
        String name;
        synchronized (lock) {
            MeshPeer p = peers.get(endpointId);
            if (p == null || p.connected || p.pending) return;
            p.pending = true;
            p.lastSeen = System.currentTimeMillis();
            name = endpointName;
        }
        c.requestConnection(name, endpointId, lifecycle)
            .addOnFailureListener(e -> {
                int code = statusOf(e);
                Log.i(TAG, "requestConnection " + endpointId + ": " + code);
                synchronized (lock) {
                    MeshPeer p = peers.get(endpointId);
                    if (p != null) {
                        p.pending = false;
                        // tekrar denemeden önce bir süre bekle
                        p.foundAt = System.currentTimeMillis();
                    }
                }
            });
    }

    // ------------------------------------------------------------------ Nearby geri çağrıları

    private final EndpointDiscoveryCallback discovery = new EndpointDiscoveryCallback() {
        @Override
        public void onEndpointFound(String endpointId, DiscoveredEndpointInfo info) {
            if (!SERVICE_ID.equals(info.getServiceId())) return;
            boolean requestNow = false;
            ConnectionsClient c;
            synchronized (lock) {
                c = client;
                MeshPeer p = peers.get(endpointId);
                if (p == null) {
                    p = new MeshPeer(endpointId);
                    peers.put(endpointId, p);
                }
                p.setEndpointName(info.getEndpointName());
                p.discovered = true;
                p.lastSeen = System.currentTimeMillis();
                p.foundAt = p.lastSeen;
                // Çift bağlantı çakışmasını önle: düğüm kimliği küçük olan ister.
                // Diğer taraf FALLBACK_REQUEST_MS sonra tick() ile ister.
                requestNow = !p.connected && !p.pending && connectedCount() < MAX_CONNECTED
                    && (p.node.isEmpty() || nodeId.compareTo(p.node) < 0);
            }
            if (requestNow && c != null) request(c, endpointId);
            emitPeers();
        }

        @Override
        public void onEndpointLost(String endpointId) {
            synchronized (lock) {
                MeshPeer p = peers.get(endpointId);
                if (p == null) return;
                p.discovered = false;
                if (!p.connected && !p.pending) peers.remove(endpointId);
            }
            emitPeers();
        }
    };

    private final ConnectionLifecycleCallback lifecycle = new ConnectionLifecycleCallback() {
        @Override
        public void onConnectionInitiated(String endpointId, ConnectionInfo info) {
            ConnectionsClient c;
            boolean accept;
            synchronized (lock) {
                c = client;
                MeshPeer p = peers.get(endpointId);
                if (p == null) {
                    p = new MeshPeer(endpointId);
                    peers.put(endpointId, p);
                }
                p.setEndpointName(info.getEndpointName());
                p.pending = true;
                p.lastSeen = System.currentTimeMillis();
                accept = connectedCount() < MAX_CONNECTED;
            }
            if (c == null) return;
            // Kimlik doğrulama yok: afet anında herkes herkesle konuşabilmeli.
            // Mesajlar açık metin; gizli bilgi için uygun değildir (docs/MESH.md).
            if (accept) c.acceptConnection(endpointId, payloads);
            else c.rejectConnection(endpointId);
        }

        @Override
        public void onConnectionResult(String endpointId, ConnectionResolution result) {
            int code = result.getStatus().getStatusCode();
            synchronized (lock) {
                MeshPeer p = peers.get(endpointId);
                if (p == null) {
                    p = new MeshPeer(endpointId);
                    peers.put(endpointId, p);
                }
                p.pending = false;
                p.lastSeen = System.currentTimeMillis();
                if (code == ConnectionsStatusCodes.STATUS_OK) {
                    p.connected = true;
                } else {
                    Log.i(TAG, "bağlantı sonucu " + endpointId + ": " + code);
                    p.foundAt = p.lastSeen;
                    if (!p.discovered && !p.connected) peers.remove(endpointId);
                }
            }
            emitPeers();
        }

        @Override
        public void onDisconnected(String endpointId) {
            synchronized (lock) {
                MeshPeer p = peers.get(endpointId);
                if (p != null) {
                    p.connected = false;
                    p.pending = false;
                    p.foundAt = System.currentTimeMillis();
                    if (!p.discovered) peers.remove(endpointId);
                }
            }
            emitPeers();
        }
    };

    private final PayloadCallback payloads = new PayloadCallback() {
        @Override
        public void onPayloadReceived(String endpointId, Payload payload) {
            if (payload.getType() != Payload.Type.BYTES) return;
            byte[] b = payload.asBytes();
            if (b == null || b.length == 0 || b.length > ConnectionsClient.MAX_BYTES_DATA_SIZE) return;
            synchronized (lock) {
                MeshPeer p = peers.get(endpointId);
                if (p != null) p.lastSeen = System.currentTimeMillis();
            }
            JSObject ev = new JSObject();
            ev.put("from", endpointId);
            ev.put("data", new String(b, StandardCharsets.UTF_8));
            notifyListeners("meshMessage", ev);
        }

        @Override
        public void onPayloadTransferUpdate(String endpointId, PayloadTransferUpdate update) {
            // BYTES yükleri tek parça gelir; ilerleme takibi gerekmez.
        }
    };

    // ------------------------------------------------------------------ yardımcılar

    private int connectedCount() {
        int n = 0;
        for (MeshPeer p : peers.values()) if (p.connected) n++;
        return n;
    }

    private JSArray peersJS() {
        JSArray arr = new JSArray();
        synchronized (lock) {
            Iterator<MeshPeer> it = peers.values().iterator();
            while (it.hasNext()) {
                MeshPeer p = it.next();
                if (p.connected || p.discovered || p.pending) arr.put(p.toJS());
            }
        }
        return arr;
    }

    private void emitPeers() {
        JSObject ev = new JSObject();
        ev.put("peers", peersJS());
        notifyListeners("meshPeers", ev);
    }

    private void emitState(String error) {
        JSObject ev = new JSObject();
        synchronized (lock) {
            ev.put("running", running);
        }
        if (error != null) ev.put("error", error);
        notifyListeners("meshState", ev);
    }

    /** Çalışan Android sürümü için gereken izin takma adları (Nearby belgeleri) */
    private static String[] neededAliases() {
        int sdk = Build.VERSION.SDK_INT;
        if (sdk >= 33) return new String[] { "bluetooth", "nearbyWifi" };
        if (sdk >= 31) return new String[] { "bluetooth", "location" };
        return new String[] { "location" };
    }

    private boolean allGranted(String[] aliases) {
        for (String a : aliases) {
            if (getPermissionState(a) != PermissionState.GRANTED) return false;
        }
        return true;
    }

    private boolean hasPlayServices() {
        try {
            return GoogleApiAvailability.getInstance().isGooglePlayServicesAvailable(getContext()) == ConnectionResult.SUCCESS;
        } catch (Exception e) {
            return false;
        }
    }

    private static int statusOf(Exception e) {
        if (e instanceof ApiException) return ((ApiException) e).getStatusCode();
        return ConnectionsStatusCodes.STATUS_ERROR;
    }
}
