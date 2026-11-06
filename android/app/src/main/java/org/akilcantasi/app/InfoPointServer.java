package org.akilcantasi.app;

import android.content.res.AssetManager;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.RandomAccessFile;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.NetworkInterface;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.SynchronousQueue;
import java.util.concurrent.ThreadPoolExecutor;
import java.util.concurrent.TimeUnit;

/**
 * Bağımlılıksız küçük HTTP sunucusu. server/server.mjs ile aynı uç noktalar:
 *   /                      uygulama (assets/public)
 *   /api/status            bilgi noktası durumu
 *   /api/packs             paket listesi
 *   /data/<dosya>          paket dosyaları (Range destekli)
 *   /download/akil-cantasi.apk
 *   GET  /api/board?since=ms  mesaj panosu ({items:[…], now})
 *   POST /api/board           {id,kind,from,text,lat?,lon?,status?}
 * Pano bellekte tutulur ve uygulamanın files/ klasöründeki board.json'a yazılır.
 */
public class InfoPointServer {
    private static final String[] PACK_EXT = {".zim", ".gguf", ".pmtiles", ".geojson", ".json", ".tar"};

    private final AssetManager assets;
    private final File packsDir;
    private final File apk;
    private final int port;
    private ServerSocket socket;
    private ThreadPoolExecutor pool;
    private static final int MAX_LINE = 8192;
    private static final int MAX_HEADERS = 64;
    private volatile boolean running;
    private final Map<String, Long> clients = new ConcurrentHashMap<>();
    private final Board board;

    public InfoPointServer(AssetManager assets, File packsDir, File apk, int port) {
        this(assets, packsDir, apk, port, null);
    }

    /** boardFile: pano kayıtlarının saklandığı dosya (null → yalnızca bellekte) */
    /**
     * Bu telefondaki uygulamanın kendi gönderilerini ("bilgi noktasından") tanımak için her
     * başlatmada üretilen gizli anahtar. Yalnız loopback'ten gelmek yetmez: telefondaki başka
     * bir uygulama da 127.0.0.1'e bağlanabilir.
     */
    private final String anahtar;
    /** Canlı bağlantılar: yavaş istek/okumayan istemci bekçisi */
    private final java.util.concurrent.ConcurrentHashMap<Socket, Izlenen> canli = new java.util.concurrent.ConcurrentHashMap<>();
    private final java.util.concurrent.ConcurrentHashMap<String, java.util.concurrent.atomic.AtomicInteger> ipBaglanti = new java.util.concurrent.ConcurrentHashMap<>();
    private java.util.concurrent.ScheduledExecutorService bekci;
    static final int IP_EN_COK_BAGLANTI = 24;
    static final long BASLIK_SURESI_MS = 15_000, YAZMA_DURGUN_MS = 60_000;

    static final class Izlenen {
        final long baslangic = System.currentTimeMillis();
        volatile long son = baslangic;
        volatile boolean yaziyor;
    }

    /** Yazdıkça bekçiye "ilerliyor" bildiren akış */
    static final class IzlenenAkis extends java.io.FilterOutputStream {
        private final Izlenen iz;
        IzlenenAkis(OutputStream o, Izlenen iz) { super(o); this.iz = iz; }
        @Override public void write(byte[] b, int off, int len) throws IOException {
            iz.yaziyor = true;
            out.write(b, off, len);
            iz.son = System.currentTimeMillis();
        }
        @Override public void write(int b) throws IOException {
            iz.yaziyor = true;
            out.write(b);
            iz.son = System.currentTimeMillis();
        }
    }

    public String anahtar() { return anahtar; }

    /** Yalnız yerel ağlardan (ve bu telefondan) bağlantı kabul edilir */
    static boolean yerelAg(InetAddress a) {
        if (a == null) return false;
        if (a.isLoopbackAddress() || a.isSiteLocalAddress() || a.isLinkLocalAddress()) return true;
        byte[] b = a.getAddress();
        if (b.length == 4) return (b[0] & 0xFF) == 100 && (b[1] & 0xC0) == 64; // 100.64.0.0/10
        return (b[0] & 0xFE) == 0xFC; // IPv6 fc00::/7
    }

    public InfoPointServer(AssetManager assets, File packsDir, File apk, int port, File boardFile) {
        byte[] r = new byte[16];
        new java.security.SecureRandom().nextBytes(r);
        StringBuilder hx = new StringBuilder();
        for (byte x : r) hx.append(String.format("%02x", x));
        this.anahtar = hx.toString();
        this.assets = assets;
        this.packsDir = packsDir;
        this.apk = apk;
        this.port = port;
        this.board = new Board(boardFile, Board.MAX_ITEMS, Board.RATE_PER_MIN);
    }

    public void start() throws IOException {
        socket = new ServerSocket(port);
        // Büyük indirmeler uzun sürer: iş parçacığı sayısı ihtiyaca göre artar (en çok 160; ~20 telefon × 6 bağlantı)
        pool = new ThreadPoolExecutor(2, 160, 30, TimeUnit.SECONDS, new SynchronousQueue<>());
        running = true;
        Thread t = new Thread(() -> {
            while (running) {
                try {
                    Socket s = socket.accept();
                    // Yerel ağ dışından (telefon herkese açık bir ağa ya da mobil IPv6'ya bağlıysa) red
                    if (!yerelAg(s.getInetAddress())) {
                        try { s.close(); } catch (IOException ignored) {}
                        continue;
                    }
                    // Tek cihaz bütün iş parçacıklarını tutamasın
                    String ip = s.getInetAddress().getHostAddress();
                    java.util.concurrent.atomic.AtomicInteger say = ipBaglanti.computeIfAbsent(ip, k -> new java.util.concurrent.atomic.AtomicInteger());
                    if (!s.getInetAddress().isLoopbackAddress() && say.incrementAndGet() > IP_EN_COK_BAGLANTI) {
                        say.decrementAndGet();
                        try { s.close(); } catch (IOException ignored) {}
                        continue;
                    }
                    if (s.getInetAddress().isLoopbackAddress()) say.incrementAndGet();
                    try {
                        pool.execute(() -> {
                            try {
                                handle(s);
                            } finally {
                                if (say.decrementAndGet() <= 0) ipBaglanti.remove(ip, say);
                            }
                        });
                    } catch (java.util.concurrent.RejectedExecutionException busy) {
                        say.decrementAndGet();
                        try { s.close(); } catch (IOException ignored) {}
                    }
                } catch (IOException e) {
                    if (!running) break;
                }
            }
        }, "akil-infopoint");
        t.setDaemon(true);
        t.start();
        // Bekçi: başlıklarını 15 sn'de bitirmeyen ya da 60 sn'dir okumayan bağlantıyı kapatır
        bekci = java.util.concurrent.Executors.newSingleThreadScheduledExecutor();
        bekci.scheduleWithFixedDelay(() -> {
            long simdi = System.currentTimeMillis();
            for (Map.Entry<Socket, Izlenen> e : canli.entrySet()) {
                Izlenen iz = e.getValue();
                boolean kapat = iz.yaziyor ? simdi - iz.son > YAZMA_DURGUN_MS : simdi - iz.baslangic > BASLIK_SURESI_MS;
                if (kapat) {
                    try { e.getKey().close(); } catch (IOException ignored) {}
                    canli.remove(e.getKey());
                }
            }
        }, 5, 5, TimeUnit.SECONDS);
    }

    public void stop() {
        running = false;
        try { if (socket != null) socket.close(); } catch (IOException ignored) {}
        if (pool != null) pool.shutdownNow();
        if (bekci != null) bekci.shutdownNow();
        board.flush();
        board.kapat();
    }

    public boolean isRunning() { return running; }
    public int getPort() { return port; }

    public int clientCount() {
        long now = System.currentTimeMillis();
        int n = 0;
        Iterator<Map.Entry<String, Long>> it = clients.entrySet().iterator();
        while (it.hasNext()) {
            Map.Entry<String, Long> e = it.next();
            if (now - e.getValue() > 120_000) it.remove(); else n++;
        }
        return n;
    }

    public static List<String> lanAddresses() {
        List<String> out = new ArrayList<>();
        try {
            for (NetworkInterface ni : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!ni.isUp() || ni.isLoopback()) continue;
                for (InetAddress a : Collections.list(ni.getInetAddresses())) {
                    if (a instanceof Inet4Address && !a.isLoopbackAddress()) out.add(a.getHostAddress());
                }
            }
        } catch (Exception ignored) {}
        return out;
    }

    /** CRLF ile biten bir satırı okur; MAX_LINE'ı aşarsa IOException. */
    private static String readLine(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream(128);
        int c;
        while ((c = in.read()) != -1) {
            if (c == '\n') break;
            if (c != '\r') b.write(c);
            if (b.size() > MAX_LINE) throw new IOException("satır çok uzun");
        }
        if (c == -1 && b.size() == 0) return null;
        return new String(b.toByteArray(), StandardCharsets.ISO_8859_1);
    }

    /** Yüzde kodlamasını çözer ('+' boşluk sayılmaz). Hatalı kodlamada null. */
    static String percentDecode(String s) {
        ByteArrayOutputStream b = new ByteArrayOutputStream(s.length());
        for (int i = 0; i < s.length(); i++) {
            char ch = s.charAt(i);
            if (ch == '%') {
                if (i + 2 >= s.length()) return null;
                int hi = Character.digit(s.charAt(i + 1), 16), lo = Character.digit(s.charAt(i + 2), 16);
                if (hi < 0 || lo < 0) return null;
                b.write((hi << 4) | lo);
                i += 2;
            } else {
                byte[] bs = String.valueOf(ch).getBytes(StandardCharsets.UTF_8);
                b.write(bs, 0, bs.length);
            }
        }
        String out = new String(b.toByteArray(), StandardCharsets.UTF_8);
        return out.indexOf('\0') >= 0 ? null : out;
    }

    /** JavaScript encodeURIComponent ile aynı. */
    static String encodeComponent(String s) {
        StringBuilder sb = new StringBuilder();
        for (byte bt : s.getBytes(StandardCharsets.UTF_8)) {
            int c = bt & 0xff;
            if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || "-_.!~*'()".indexOf(c) >= 0) sb.append((char) c);
            else sb.append('%').append(Character.toUpperCase(Character.forDigit(c >> 4, 16))).append(Character.toUpperCase(Character.forDigit(c & 15, 16)));
        }
        return sb.toString();
    }

    private void handle(Socket s) {
        Izlenen iz = new Izlenen();
        canli.put(s, iz);
        try (Socket sock = s) {
            sock.setSoTimeout(5_000); // yalnızca istek okuma; yanıt yazmayı etkilemez
            InputStream in = new BufferedInputStream(sock.getInputStream());
            OutputStream out = new IzlenenAkis(sock.getOutputStream(), iz);
            try {
                String line = readLine(in);
                if (line == null) return;
                String[] parts = line.split(" ");
                if (parts.length < 3) { send(out, 400, "text/plain; charset=utf-8", "Hatalı istek".getBytes(StandardCharsets.UTF_8), null, false); return; }
                String method = parts[0];
                String rawPath = parts[1];
                Map<String, String> headers = new HashMap<>();
                String h;
                int count = 0;
                while ((h = readLine(in)) != null && !h.isEmpty()) {
                    if (++count > MAX_HEADERS) throw new IOException("çok fazla başlık");
                    int i = h.indexOf(':');
                    if (i > 0) headers.put(h.substring(0, i).trim().toLowerCase(Locale.ROOT), h.substring(i + 1).trim());
                }
                String ip = sock.getInetAddress().getHostAddress();
                boolean loopback = sock.getInetAddress().isLoopbackAddress();
                if (!loopback) clients.put(ip, System.currentTimeMillis());
                int qi = rawPath.indexOf('?');
                if ((qi >= 0 ? rawPath.substring(0, qi) : rawPath).equals("/api/board")) {
                    // "bilgi noktasından" yalnız bu telefondaki uygulama (gizli anahtarla)
                    boolean yerel = loopback && anahtar.equals(headers.get("x-akil-anahtar"));
                    handleBoard(out, in, method, rawPath, headers, ip, yerel);
                } else {
                    route(out, method, rawPath, headers);
                }
            } catch (RuntimeException e) {
                send(out, 400, "text/plain; charset=utf-8", "Hatalı istek".getBytes(StandardCharsets.UTF_8), null, false);
            }
            out.flush();
        } catch (Exception ignored) {
        } finally {
            canli.remove(s);
        }
    }

    private void route(OutputStream out, String method, String rawPath, Map<String, String> headers) throws IOException {
        if (method.equals("OPTIONS")) {
            send(out, 204, "text/plain", new byte[0], "Access-Control-Max-Age: 86400\r\n", false);
            return;
        }
        if (!method.equals("GET") && !method.equals("HEAD")) {
            send(out, 405, "text/plain; charset=utf-8", "İzin verilmeyen yöntem".getBytes(StandardCharsets.UTF_8), "Allow: GET, HEAD, OPTIONS\r\n", false);
            return;
        }
        boolean head = method.equals("HEAD");
        int q = rawPath.indexOf('?');
        String path = percentDecode(q >= 0 ? rawPath.substring(0, q) : rawPath);
        if (path == null || !path.startsWith("/")) {
            send(out, 400, "text/plain; charset=utf-8", "Hatalı istek".getBytes(StandardCharsets.UTF_8), null, head);
            return;
        }

        if (path.equals("/api/status")) {
            String json = "{\"server\":true,\"name\":\"Akıl Çantası Bilgi Noktası (telefon)\",\"addresses\":" +
                    jsonArray(lanAddresses()) + ",\"port\":" + port + ",\"clients\":" + clientCount() +
                    ",\"apk\":" + (apk != null && apk.exists()) + "}";
            send(out, 200, "application/json; charset=utf-8", json.getBytes(StandardCharsets.UTF_8), null, head);
        } else if (path.equals("/api/packs")) {
            StringBuilder sb = new StringBuilder("{\"files\":[");
            boolean first = true;
            File[] files = packsDir == null ? null : packsDir.listFiles();
            if (files != null) {
                java.util.Arrays.sort(files);
                for (File f : files) {
                    if (!f.isFile() || f.getName().startsWith(".") || !isPack(f.getName())) continue;
                    if (!first) sb.append(',');
                    first = false;
                    sb.append("{\"name\":").append(quote(f.getName())).append(",\"size\":").append(f.length())
                      .append(",\"url\":").append(quote("./data/" + encodeComponent(f.getName()))).append('}');
                }
            }
            sb.append("]}");
            send(out, 200, "application/json; charset=utf-8", sb.toString().getBytes(StandardCharsets.UTF_8), null, head);
        } else if (path.startsWith("/data/")) {
            String name = path.substring(6);
            // Yol çözülmüş haliyle denetlenir (%2F, %2E… percentDecode'dan geçti): gizli dosya, NUL ve
            // klasör ayırıcı yasak; yalnız listede de görünen paket dosyaları sunulur.
            if (packsDir == null || name.isEmpty() || name.startsWith(".") || name.indexOf('\0') >= 0
                    || name.contains("/") || name.contains("\\") || name.contains("..") || !isPack(name)) {
                notFound(out, head);
            } else {
                sendFile(out, new File(packsDir, name), headers.get("range"), head);
            }
        } else if (path.equals("/download/akil-cantasi.apk")) {
            if (apk == null || !apk.exists()) notFound(out, head);
            else sendFile(out, apk, headers.get("range"), head);
        } else {
            sendAsset(out, path, head);
        }
    }

    // ---- Mesaj panosu ----

    private void handleBoard(OutputStream out, InputStream in, String method, String rawPath, Map<String, String> headers, String ip, boolean loopback) throws IOException {
        String json = "application/json; charset=utf-8";
        if (method.equals("OPTIONS")) {
            send(out, 204, "text/plain", new byte[0], "Access-Control-Max-Age: 86400\r\n", false);
            return;
        }
        if (method.equals("GET") || method.equals("HEAD")) {
            long since = 0;
            int q = rawPath.indexOf('?');
            if (q >= 0) {
                for (String kv : rawPath.substring(q + 1).split("&")) {
                    if (kv.startsWith("since=")) {
                        try { since = (long) Double.parseDouble(kv.substring(6)); } catch (NumberFormatException ignored) {}
                    }
                }
            }
            send(out, 200, json, board.listJson(since).getBytes(StandardCharsets.UTF_8), null, method.equals("HEAD"));
            return;
        }
        if (!method.equals("POST")) {
            send(out, 405, "text/plain; charset=utf-8", "İzin verilmeyen yöntem".getBytes(StandardCharsets.UTF_8), "Allow: GET, HEAD, POST, OPTIONS\r\n", false);
            return;
        }
        String ct = headers.get("content-type");
        if (ct == null || !ct.toLowerCase(Locale.ROOT).startsWith("application/json")) {
            send(out, 415, json, Board.errorJson("JSON bekleniyor"), null, false);
            return;
        }
        int wait = board.rateWait(ip);
        if (wait > 0) {
            send(out, 429, json, ("{\"error\":\"Çok sık gönderim. Biraz bekleyin.\",\"retryAfter\":" + wait + "}").getBytes(StandardCharsets.UTF_8), "Retry-After: " + wait + "\r\n", false);
            return;
        }
        long len;
        try { len = Long.parseLong(headers.getOrDefault("content-length", "-1").trim()); } catch (NumberFormatException e) { len = -1; }
        if (len < 0) {
            send(out, 411, json, Board.errorJson("Content-Length gerekli"), null, false);
            return;
        }
        if (len > Board.MAX_BODY) {
            send(out, 413, json, Board.errorJson("Kayıt çok büyük"), null, false);
            return;
        }
        byte[] body = new byte[(int) len];
        int off = 0;
        while (off < len) {
            int n = in.read(body, off, (int) len - off);
            if (n < 0) break;
            off += n;
        }
        if (off < len) {
            send(out, 400, json, Board.errorJson("Eksik gövde"), null, false);
            return;
        }
        Object raw;
        try {
            raw = new Json(new String(body, StandardCharsets.UTF_8)).parseTop();
        } catch (RuntimeException e) {
            send(out, 400, json, Board.errorJson("Geçersiz JSON"), null, false);
            return;
        }
        Object v = Board.validate(raw);
        if (v instanceof String) {
            send(out, 400, json, Board.errorJson((String) v), null, false);
            return;
        }
        Board.Result r = board.add((Board.Item) v, loopback);
        String res = "{\"ok\":true,\"item\":" + r.item.toJson() + ",\"duplicate\":" + r.duplicate + "}";
        send(out, r.status, json, res.getBytes(StandardCharsets.UTF_8), null, false);
    }

    private static boolean isPack(String name) {
        String n = name.toLowerCase(Locale.ROOT);
        for (String e : PACK_EXT) if (n.endsWith(e)) return true;
        return false;
    }

    private void sendAsset(OutputStream out, String path, boolean head) throws IOException {
        if (path.contains("..")) { notFound(out, head); return; }
        String p = path.equals("/") || path.isEmpty() ? "/index.html" : path;
        byte[] data;
        try {
            data = readAsset("public" + p);
        } catch (FileNotFoundException e) {
            // Tek sayfa uygulama: bilinmeyen yollar index.html'e
            if (p.contains(".")) { notFound(out, head); return; }
            data = readAsset("public/index.html");
            p = "/index.html";
        }
        send(out, 200, mime(p), data, null, head);
    }

    private byte[] readAsset(String name) throws IOException {
        try (InputStream in = assets.open(name)) {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            byte[] buf = new byte[1 << 16];
            int n;
            while ((n = in.read(buf)) > 0) bos.write(buf, 0, n);
            return bos.toByteArray();
        }
    }

    private void sendFile(OutputStream out, File f, String range, boolean head) throws IOException {
        if (!f.isFile()) { notFound(out, head); return; }
        long size = f.length();
        long start = 0, end = size - 1;
        int status = 200;
        if (range != null && range.startsWith("bytes=")) {
            String spec = range.substring(6).split(",")[0].trim();
            int dash = spec.indexOf('-');
            try {
                if (dash < 0) throw new NumberFormatException("tire yok");
                if (dash == 0) {
                    long suffix = Long.parseLong(spec.substring(1));
                    start = Math.max(0, size - suffix);
                } else {
                    start = Long.parseLong(spec.substring(0, dash));
                    String e = spec.substring(dash + 1);
                    if (!e.isEmpty()) end = Math.min(size - 1, Long.parseLong(e));
                }
                if (start > end || start >= size) {
                    String hdr = "HTTP/1.1 416 Range Not Satisfiable\r\nContent-Range: bytes */" + size + "\r\n" + common() + "Content-Length: 0\r\n\r\n";
                    out.write(hdr.getBytes(StandardCharsets.ISO_8859_1));
                    return;
                }
                status = 206;
            } catch (RuntimeException ignored) {
                start = 0; end = size - 1; status = 200;
            }
        }
        long len = end - start + 1;
        StringBuilder hdr = new StringBuilder();
        hdr.append("HTTP/1.1 ").append(status).append(status == 206 ? " Partial Content" : " OK").append("\r\n");
        hdr.append("Content-Type: ").append(mime(f.getName())).append("\r\n");
        hdr.append("Content-Length: ").append(len).append("\r\n");
        hdr.append("Accept-Ranges: bytes\r\n");
        if (status == 206) hdr.append("Content-Range: bytes ").append(start).append('-').append(end).append('/').append(size).append("\r\n");
        hdr.append(common()).append("\r\n");
        out.write(hdr.toString().getBytes(StandardCharsets.ISO_8859_1));
        if (head) return;
        try (RandomAccessFile raf = new RandomAccessFile(f, "r")) {
            raf.seek(start);
            byte[] buf = new byte[1 << 16];
            long left = len;
            while (left > 0) {
                int n = raf.read(buf, 0, (int) Math.min(buf.length, left));
                if (n < 0) break;
                out.write(buf, 0, n);
                left -= n;
            }
        }
    }

    private static String common() {
        return "Cross-Origin-Opener-Policy: same-origin\r\n" +
               "Cross-Origin-Embedder-Policy: require-corp\r\n" +
               "Cross-Origin-Resource-Policy: cross-origin\r\n" +
               "Access-Control-Allow-Origin: *\r\n" +
               "Access-Control-Allow-Headers: Range, If-Range, Content-Type, X-Akil-Anahtar\r\n" +
               "Access-Control-Allow-Methods: GET, HEAD, POST, OPTIONS\r\n" +
               "X-Content-Type-Options: nosniff\r\n" +
               // server/server.mjs CSP ile aynı: arşivden gelen içerik betik çalıştıramasın
               "Content-Security-Policy: default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; " +
               "img-src 'self' blob: data:; font-src 'self' data:; connect-src 'self' blob: data: http: https:; media-src 'self' blob:; " +
               "object-src 'none'; base-uri 'none'; frame-src 'none'; form-action 'none'\r\n" +
               "Access-Control-Expose-Headers: Content-Length, Content-Range, Accept-Ranges\r\n" +
               "Cache-Control: no-cache\r\n" +
               "Connection: close\r\n";
    }

    private static void send(OutputStream out, int status, String type, byte[] body, String extra, boolean head) throws IOException {
        String reason = status == 200 ? "OK" : status == 201 ? "Created" : status == 204 ? "No Content" : status == 400 ? "Bad Request" : status == 404 ? "Not Found" : status == 405 ? "Method Not Allowed"
                : status == 411 ? "Length Required" : status == 413 ? "Payload Too Large" : status == 415 ? "Unsupported Media Type" : status == 429 ? "Too Many Requests" : "Error";
        String hdr = "HTTP/1.1 " + status + " " + reason + "\r\nContent-Type: " + type + "\r\nContent-Length: " + body.length + "\r\n" +
                common() + (extra != null ? extra : "") + "\r\n";
        out.write(hdr.getBytes(StandardCharsets.ISO_8859_1));
        if (!head) out.write(body);
    }

    private static void notFound(OutputStream out, boolean head) throws IOException {
        send(out, 404, "text/plain; charset=utf-8", "Bulunamadı".getBytes(StandardCharsets.UTF_8), null, head);
    }

    private static String mime(String name) {
        String n = name.toLowerCase(Locale.ROOT);
        if (n.endsWith(".html")) return "text/html; charset=utf-8";
        if (n.endsWith(".js") || n.endsWith(".mjs")) return "text/javascript; charset=utf-8";
        if (n.endsWith(".css")) return "text/css; charset=utf-8";
        if (n.endsWith(".json") || n.endsWith(".webmanifest")) return "application/json; charset=utf-8";
        if (n.endsWith(".geojson")) return "application/geo+json";
        if (n.endsWith(".wasm")) return "application/wasm";
        if (n.endsWith(".svg")) return "image/svg+xml";
        if (n.endsWith(".png")) return "image/png";
        if (n.endsWith(".woff2")) return "font/woff2";
        if (n.endsWith(".woff")) return "font/woff";
        if (n.endsWith(".apk")) return "application/vnd.android.package-archive";
        if (n.endsWith(".tar")) return "application/x-tar";
        return "application/octet-stream";
    }

    private static String quote(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private static String jsonArray(List<String> list) {
        StringBuilder sb = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            if (i > 0) sb.append(',');
            sb.append(quote(list.get(i)));
        }
        return sb.append(']').toString();
    }

    /**
     * Pano deposu. Kurallar server/server.mjs ve src/iletisim/board.ts ile aynı:
     * düz metin (denetim/yön karakterleri atılır), uzunluk sınırları, kimliğe göre
     * tekilleştirme, toplam kayıt sınırı, IP başına dakikada en çok RATE_PER_MIN gönderim.
     */
    static final class Board {
        static final int MAX_ITEMS = 2000, PAGE = 500, RATE_PER_MIN = 20, MAX_BODY = 4096, MAX_FROM = 40, MAX_TEXT = 600;
        static final List<String> KINDS = java.util.Arrays.asList("mesaj", "iyiyim", "kayip", "duyuru");
        static final List<String> CHECKIN = java.util.Arrays.asList("iyiyim", "yardim", "yarali");
        static final List<String> MISSING = java.util.Arrays.asList("araniyor", "bulundu");
        private static final java.util.regex.Pattern ID_RE = java.util.regex.Pattern.compile("^[A-Za-z0-9_-]{6,64}$");
        private static final java.util.regex.Pattern CTRL = java.util.regex.Pattern.compile("[\\u0000-\\u0009\\u000B-\\u001F\\u007F-\\u009F]");
        private static final java.util.regex.Pattern INVIS = java.util.regex.Pattern.compile("[\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2069\\uFEFF]");

        static final class Item {
            String id, kind, from, text, status;
            Double lat, lon;
            long time, rev;
            boolean local;

            String toJson() {
                StringBuilder sb = new StringBuilder("{");
                sb.append("\"id\":").append(str(id)).append(",\"kind\":").append(str(kind))
                  .append(",\"from\":").append(str(from)).append(",\"text\":").append(str(text));
                if (lat != null && lon != null) sb.append(",\"lat\":").append(num(lat)).append(",\"lon\":").append(num(lon));
                if (status != null) sb.append(",\"status\":").append(str(status));
                sb.append(",\"time\":").append(time).append(",\"rev\":").append(rev);
                if (local) sb.append(",\"local\":true");
                return sb.append('}').toString();
            }
        }

        static final class Result {
            final int status; final Item item; final boolean duplicate;
            Result(int status, Item item, boolean duplicate) { this.status = status; this.item = item; this.duplicate = duplicate; }
        }

        private final File file;
        private final int maxItems, ratePerMin;
        private final java.util.LinkedHashMap<String, Item> items = new java.util.LinkedHashMap<>();
        private final Map<String, java.util.ArrayDeque<Long>> hits = new HashMap<>();
        private long lastRev = 0;
        private boolean dirty = false;
        private final java.util.concurrent.ScheduledExecutorService saver;

        Board(File file, int maxItems, int ratePerMin) {
            this.file = file;
            this.maxItems = maxItems;
            this.ratePerMin = ratePerMin;
            this.saver = java.util.concurrent.Executors.newSingleThreadScheduledExecutor(r -> {
                Thread t = new Thread(r, "akil-board-save");
                t.setDaemon(true);
                return t;
            });
            load();
        }

        private void load() {
            if (file == null || !file.isFile()) return;
            try {
                byte[] data = java.nio.file.Files.readAllBytes(file.toPath());
                Object top = new Json(new String(data, StandardCharsets.UTF_8)).parseTop();
                if (!(top instanceof Map)) return;
                Object arr = ((Map<?, ?>) top).get("items");
                if (!(arr instanceof List)) return;
                for (Object o : (List<?>) arr) {
                    Object v = validate(o);
                    if (!(v instanceof Item)) continue;
                    Item it = (Item) v;
                    Map<?, ?> m = (Map<?, ?>) o;
                    it.time = m.get("time") instanceof Double ? ((Double) m.get("time")).longValue() : System.currentTimeMillis();
                    it.rev = m.get("rev") instanceof Double ? ((Double) m.get("rev")).longValue() : it.time;
                    it.local = Boolean.TRUE.equals(m.get("local"));
                    items.put(it.id, it);
                    lastRev = Math.max(lastRev, it.rev);
                }
            } catch (Exception ignored) {
                // bozuk dosya: boş pano
            }
        }

        private long nextRev() {
            lastRev = Math.max(System.currentTimeMillis(), lastRev + 1);
            return lastRev;
        }

        /**
         * since'tan sonraki kayıtlar, ESKİDEN YENİYE en çok PAGE tane; fazlası varsa "more":true.
         * (Yeniden eskiye verilince istemci en yeni rev'i alıp eskileri hiç göremiyordu.)
         */
        synchronized String listJson(long since) {
            List<Item> out = new ArrayList<>();
            for (Item it : items.values()) if (it.rev > since) out.add(it);
            out.sort((a, b) -> Long.compare(a.rev, b.rev));
            StringBuilder sb = new StringBuilder("{\"items\":[");
            for (int i = 0; i < out.size() && i < PAGE; i++) {
                if (i > 0) sb.append(',');
                sb.append(out.get(i).toJson());
            }
            sb.append(']');
            if (out.size() > PAGE) sb.append(",\"more\":true");
            return sb.append(",\"now\":").append(System.currentTimeMillis()).append('}').toString();
        }

        /** Herkesin toplamı: dakikada en çok bu kadar yeni kayıt (IP değiştirerek doldurmaya karşı) */
        static final int GENEL_DAKIKA = 120;
        private final java.util.ArrayDeque<Long> genel = new java.util.ArrayDeque<>();

        void kapat() {
            saver.shutdownNow();
        }

        /** 0 → izin var; aksi halde beklenecek saniye */
        synchronized int rateWait(String ip) {
            long now = System.currentTimeMillis();
            java.util.ArrayDeque<Long> q = hits.computeIfAbsent(ip == null ? "?" : ip, k -> new java.util.ArrayDeque<>());
            while (!q.isEmpty() && now - q.peekFirst() >= 60_000) q.pollFirst();
            if (q.size() >= ratePerMin) return (int) Math.max(1, (60_000 - (now - q.peekFirst()) + 999) / 1000);
            while (!genel.isEmpty() && now - genel.peekFirst() >= 60_000) genel.pollFirst();
            if (genel.size() >= GENEL_DAKIKA) return (int) Math.max(1, (60_000 - (now - genel.peekFirst()) + 999) / 1000);
            q.addLast(now);
            genel.addLast(now);
            // Hepsini silmek yerine eskiyenleri ayıkla (silmek herkesin sınırını sıfırlıyordu)
            if (hits.size() > 5000) hits.values().removeIf(d -> d.isEmpty() || now - d.peekLast() >= 60_000);
            return 0;
        }

        synchronized Result add(Item item, boolean local) {
            Item cur = items.get(item.id);
            if (cur != null) {
                if ("kayip".equals(cur.kind) && "kayip".equals(item.kind) && "araniyor".equals(cur.status) && "bulundu".equals(item.status)) {
                    cur.status = "bulundu";
                    cur.rev = nextRev();
                    scheduleSave();
                    return new Result(200, cur, false);
                }
                return new Result(200, cur, true);
            }
            long rev = nextRev();
            item.time = rev;
            item.rev = rev;
            item.local = local;
            items.put(item.id, item);
            if (items.size() > maxItems) {
                // Önce sıradan mesajlar silinir; kayıp ilanları ve bilgi noktası duyuruları en son
                // (biri panoyu doldurarak kayıp ilanlarını silemesin)
                List<Item> old = new ArrayList<>(items.values());
                old.sort((a, b) -> {
                    int pa = korunur(a) ? 1 : 0, pb = korunur(b) ? 1 : 0;
                    return pa != pb ? Integer.compare(pa, pb) : Long.compare(a.time, b.time);
                });
                for (int i = 0; i < old.size() - maxItems; i++) items.remove(old.get(i).id);
            }
            scheduleSave();
            return new Result(201, item, false);
        }

        static boolean korunur(Item it) {
            return it.local || "kayip".equals(it.kind);
        }

        private void scheduleSave() {
            if (file == null || dirty) return;
            dirty = true;
            try {
                saver.schedule(this::save, 250, TimeUnit.MILLISECONDS);
            } catch (java.util.concurrent.RejectedExecutionException ignored) {}
        }

        private void save() {
            String body;
            synchronized (this) {
                if (!dirty) return;
                dirty = false;
                StringBuilder sb = new StringBuilder("{\"version\":1,\"items\":[");
                boolean first = true;
                for (Item it : items.values()) {
                    if (!first) sb.append(',');
                    first = false;
                    sb.append(it.toJson());
                }
                body = sb.append("]}").toString();
            }
            synchronized (file) {
                File tmp = new File(file.getPath() + ".tmp");
                try (OutputStream o = new java.io.FileOutputStream(tmp)) {
                    o.write(body.getBytes(StandardCharsets.UTF_8));
                } catch (IOException e) {
                    return;
                }
                if (!tmp.renameTo(file)) {
                    file.delete();
                    tmp.renameTo(file);
                }
            }
        }

        void flush() {
            if (file != null) save();
        }

        static byte[] errorJson(String msg) {
            return ("{\"error\":" + str(msg) + "}").getBytes(StandardCharsets.UTF_8);
        }

        /** Doğrulanmış Item ya da hata metni (String) döner */
        static Object validate(Object raw) {
            if (!(raw instanceof Map)) return "Geçersiz kayıt";
            Map<?, ?> m = (Map<?, ?>) raw;
            Object idO = m.get("id");
            String id = idO instanceof String ? (String) idO : "";
            if (!ID_RE.matcher(id).matches()) return "Geçersiz kimlik";
            Object kindO = m.get("kind");
            if (!(kindO instanceof String) || !KINDS.contains(kindO)) return "Geçersiz tür";
            String kind = (String) kindO;
            String from = clean(m.get("from"), MAX_FROM, false);
            if (from.isEmpty()) return "Ad gerekli";
            String text = clean(m.get("text"), MAX_TEXT, true);
            if (text.isEmpty() && !kind.equals("iyiyim")) return "Metin gerekli";
            Item it = new Item();
            it.id = id; it.kind = kind; it.from = from; it.text = text;
            Object latO = m.get("lat"), lonO = m.get("lon");
            if (latO != null || lonO != null) {
                double lat = toNumber(latO), lon = toNumber(lonO);
                if (Double.isNaN(lat) || Double.isNaN(lon) || Double.isInfinite(lat) || Double.isInfinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return "Geçersiz konum";
                it.lat = Math.round(lat * 1e5) / 1e5;
                it.lon = Math.round(lon * 1e5) / 1e5;
            }
            Object stO = m.get("status");
            if (kind.equals("iyiyim")) {
                Object st = stO == null ? "iyiyim" : stO;
                if (!CHECKIN.contains(st)) return "Geçersiz durum";
                it.status = (String) st;
            } else if (kind.equals("kayip")) {
                Object st = stO == null ? "araniyor" : stO;
                if (!MISSING.contains(st)) return "Geçersiz durum";
                it.status = (String) st;
            } else if (stO != null && !"".equals(stO)) {
                return "Bu türde durum olmaz";
            }
            return it;
        }

        /** JavaScript Number() benzeri: sayı ya da sayısal metin; aksi halde NaN */
        private static double toNumber(Object o) {
            if (o instanceof Double) return (Double) o;
            if (o instanceof String) {
                String t = jsTrim((String) o);
                if (t.isEmpty()) return 0;
                try { return Double.parseDouble(t); } catch (NumberFormatException e) { return Double.NaN; }
            }
            if (o == null) return 0;
            if (o instanceof Boolean) return ((Boolean) o) ? 1 : 0;
            return Double.NaN;
        }

        static String clean(Object o, int max, boolean multiline) {
            String t = o == null ? "" : (o instanceof Double ? num((Double) o) : String.valueOf(o));
            if (o instanceof Map || o instanceof List) t = o instanceof List ? "" : "[object Object]";
            t = java.text.Normalizer.normalize(t, java.text.Normalizer.Form.NFC);
            t = t.replaceAll("\r\n?", "\n").replace('\t', ' ');
            t = CTRL.matcher(t).replaceAll("");
            t = INVIS.matcher(t).replaceAll("");
            if (!multiline) t = t.replaceAll("\n+", " ");
            else t = t.replaceAll(" +\n", "\n").replaceAll("\n{3,}", "\n\n");
            t = jsTrim(t.replaceAll(" {2,}", " "));
            if (t.codePointCount(0, t.length()) > max) t = jsTrim(t.substring(0, t.offsetByCodePoints(0, max)));
            return t;
        }

        /** JavaScript String.prototype.trim ile aynı boşluk kümesi */
        static String jsTrim(String s) {
            int a = 0, b = s.length();
            while (a < b && isJsSpace(s.charAt(a))) a++;
            while (b > a && isJsSpace(s.charAt(b - 1))) b--;
            return s.substring(a, b);
        }

        private static boolean isJsSpace(char c) {
            return c == ' ' || c == '\t' || c == '\n' || c == '\u000B' || c == '\f' || c == '\r' || c == ' ' || c == ' '
                    || (c >= ' ' && c <= ' ') || c == ' ' || c == ' ' || c == ' ' || c == ' ' || c == '　' || c == '﻿';
        }

        static String num(double d) {
            if (d == Math.rint(d) && Math.abs(d) < 1e15) return Long.toString((long) d);
            return Double.toString(d);
        }

        static String str(String s) {
            StringBuilder sb = new StringBuilder(s.length() + 2).append('"');
            for (int i = 0; i < s.length(); i++) {
                char c = s.charAt(i);
                switch (c) {
                    case '"': sb.append("\\\""); break;
                    case '\\': sb.append("\\\\"); break;
                    case '\n': sb.append("\\n"); break;
                    case '\r': sb.append("\\r"); break;
                    case '\t': sb.append("\\t"); break;
                    default:
                        if (c < 0x20 || c == ' ' || c == ' ') sb.append(String.format("\\u%04x", (int) c));
                        else sb.append(c);
                }
            }
            return sb.append('"').toString();
        }
    }

    /** Küçük JSON çözücü (nesne → Map, dizi → List, sayı → Double). */
    static final class Json {
        private final String s;
        private int i = 0, depth = 0;

        Json(String s) { this.s = s; }

        Object parseTop() {
            Object v = value();
            ws();
            if (i != s.length()) throw new IllegalArgumentException("fazla veri");
            return v;
        }

        private void ws() {
            while (i < s.length()) {
                char c = s.charAt(i);
                if (c == ' ' || c == '\t' || c == '\n' || c == '\r') i++; else break;
            }
        }

        private Object value() {
            ws();
            if (i >= s.length()) throw new IllegalArgumentException("beklenmeyen son");
            char c = s.charAt(i);
            if (c == '{') return object();
            if (c == '[') return array();
            if (c == '"') return string();
            if (s.startsWith("true", i)) { i += 4; return Boolean.TRUE; }
            if (s.startsWith("false", i)) { i += 5; return Boolean.FALSE; }
            if (s.startsWith("null", i)) { i += 4; return null; }
            return number();
        }

        private Map<String, Object> object() {
            if (++depth > 32) throw new IllegalArgumentException("çok derin");
            Map<String, Object> m = new HashMap<>();
            i++;
            ws();
            if (i < s.length() && s.charAt(i) == '}') { i++; depth--; return m; }
            while (true) {
                ws();
                if (i >= s.length() || s.charAt(i) != '"') throw new IllegalArgumentException("anahtar");
                String k = string();
                ws();
                expect(':');
                m.put(k, value());
                ws();
                if (i < s.length() && s.charAt(i) == ',') { i++; continue; }
                expect('}');
                depth--;
                return m;
            }
        }

        private List<Object> array() {
            if (++depth > 32) throw new IllegalArgumentException("çok derin");
            List<Object> l = new ArrayList<>();
            i++;
            ws();
            if (i < s.length() && s.charAt(i) == ']') { i++; depth--; return l; }
            while (true) {
                l.add(value());
                ws();
                if (i < s.length() && s.charAt(i) == ',') { i++; continue; }
                expect(']');
                depth--;
                return l;
            }
        }

        private void expect(char c) {
            if (i >= s.length() || s.charAt(i) != c) throw new IllegalArgumentException("beklenen " + c);
            i++;
        }

        private String string() {
            i++;
            StringBuilder sb = new StringBuilder();
            while (true) {
                if (i >= s.length()) throw new IllegalArgumentException("bitmemiş metin");
                char c = s.charAt(i++);
                if (c == '"') return sb.toString();
                if (c != '\\') { sb.append(c); continue; }
                if (i >= s.length()) throw new IllegalArgumentException("kaçış");
                char e = s.charAt(i++);
                switch (e) {
                    case '"': sb.append('"'); break;
                    case '\\': sb.append('\\'); break;
                    case '/': sb.append('/'); break;
                    case 'b': sb.append('\b'); break;
                    case 'f': sb.append('\f'); break;
                    case 'n': sb.append('\n'); break;
                    case 'r': sb.append('\r'); break;
                    case 't': sb.append('\t'); break;
                    case 'u':
                        if (i + 4 > s.length()) throw new IllegalArgumentException("kaçış");
                        sb.append((char) Integer.parseInt(s.substring(i, i + 4), 16));
                        i += 4;
                        break;
                    default: throw new IllegalArgumentException("kaçış");
                }
            }
        }

        private Double number() {
            int a = i;
            while (i < s.length() && "+-0123456789.eE".indexOf(s.charAt(i)) >= 0) i++;
            if (a == i) throw new IllegalArgumentException("değer");
            return Double.parseDouble(s.substring(a, i));
        }
    }
}
