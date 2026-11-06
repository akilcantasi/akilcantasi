package org.akilcantasi.app;

import android.content.Context;
import android.os.StatFs;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.RandomAccessFile;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Telefonda paket indirici (server/fetcher.mjs'nin Android karşılığı).
 *
 * WebView'daki indirici CORS yüzünden yalnızca tek (çoğu zaman yavaş) aynayı kullanabilir;
 * uygulama kapanınca ya da ekran kilitlenince de durur. Bu sınıf indirmeyi uygulamanın kendisinde yapar:
 *   1) Kiwix adreslerinde bilinen bütün aynaları kısa bir ölçümle dener, en hızlılarını seçer
 *   2) Dosyayı birkaç paralel bağlantıyla (bölüm bölüm) indirir
 *   3) Takılan bağlantıyı yeniler, gerekirse başka aynaya geçer
 *   4) Yarım kalan indirme kaldığı yerden sürer (.part + .durum dosyaları)
 *   5) Bitince boyut (ve varsa SHA-256) doğrulanır, dosya paket klasörüne taşınır ve bütünlük
 *      kaydı (boyut, zaman, kısmi özet) iç depoya yazılır (PaketButunlugu)
 * İndirme sürerken IndirmeServisi bildirim göstererek işlemin arka planda da sürmesini sağlar.
 */
public final class PaketIndirici {

    static final String[] KIWIX_MIRRORS = {
        "https://ftp.fau.de/kiwix/zim",
        "https://ftp.nluug.nl/pub/kiwix/zim",
        "https://mirrors.dotsrc.org/kiwix/zim",
        "https://mirror.accum.se/mirror/kiwix.org/zim",
        "https://dumps.wikimedia.org/kiwix/zim",
        "https://wi.mirror.driftle.ss/kiwix/zim",
        "https://mirror.download.kiwix.org/zim",
        "https://download.kiwix.org/zim",
    };
    static final String PART_DIR = "_indiriliyor";
    static final String[] PACK_EXT = {".zim", ".gguf", ".pmtiles", ".geojson", ".json", ".tar"};

    private static final int SEGMENTS = 4;
    private static final long MIN_SEGMENT = 16L * 1024 * 1024;
    private static final int PROBE_BYTES = 2 * 1024 * 1024;
    private static final int PROBE_MS = 7000;
    private static final int STALL_MS = 25000;
    private static final int MAX_TRIES = 8;
    private static final String UA = "AkilCantasi-Android/1.0";
    /** İndirme bittiğinde telefonda en az bu kadar boş yer kalmalı */
    static final long YEDEK_ALAN = 64L * 1024 * 1024;

    private static PaketIndirici instance;

    public static synchronized PaketIndirici get(Context ctx) {
        if (instance == null) instance = new PaketIndirici(ctx.getApplicationContext());
        return instance;
    }

    /** Paketlerin durduğu klasör: Android/data/org.akilcantasi.app/files/packs (yoksa iç depo). */
    public static File packsDir(Context ctx) {
        File d = ctx.getExternalFilesDir("packs");
        if (d == null) d = new File(ctx.getFilesDir(), "packs");
        if (!d.exists()) d.mkdirs();
        return d;
    }

    public static boolean isPackName(String name) {
        if (name == null || name.isEmpty() || name.startsWith(".") || name.contains("/") || name.contains("\\") || name.contains("..")) return false;
        if (!name.matches("[A-Za-z0-9][A-Za-z0-9._-]*")) return false;
        String n = name.toLowerCase(Locale.ROOT);
        for (String e : PACK_EXT) if (n.endsWith(e)) return true;
        return false;
    }

    // ---------------------------------------------------------------------------------

    public static final class Job {
        final String file;
        final List<String> urls;
        final long size;
        final String sha256;
        volatile String status = "checking"; // checking | downloading | verifying | paused | error | done
        final AtomicLong received = new AtomicLong();
        volatile long total;
        volatile double speed;
        volatile String mirror;
        volatile String error;
        volatile boolean stop;
        volatile boolean remove;
        Thread thread;
        final List<HttpURLConnection> open = Collections.synchronizedList(new ArrayList<>());

        Job(String file, List<String> urls, long size, String sha256) {
            this.file = file;
            this.urls = urls;
            this.size = size;
            this.sha256 = sha256 == null || sha256.isEmpty() ? null : sha256.toLowerCase(Locale.ROOT);
            this.total = size;
        }

        JSONObject toJson() {
            JSONObject o = new JSONObject();
            try {
                o.put("file", file);
                o.put("status", status);
                o.put("received", received.get());
                o.put("total", total);
                o.put("speed", Math.round(speed));
                o.put("mirror", mirror == null ? JSONObject.NULL : host(mirror));
                o.put("error", error == null ? JSONObject.NULL : error);
            } catch (Exception ignored) {}
            return o;
        }

        boolean active() {
            return "checking".equals(status) || "downloading".equals(status) || "verifying".equals(status);
        }
    }

    private final Context ctx;
    private final Map<String, Job> jobs = new LinkedHashMap<>();
    private Runnable onChange;

    private PaketIndirici(Context ctx) {
        this.ctx = ctx;
        restore();
    }

    public void setOnChange(Runnable r) {
        onChange = r;
    }

    private void changed() {
        Runnable r = onChange;
        if (r != null) try { r.run(); } catch (Exception ignored) {}
    }

    File partDir() {
        File d = new File(packsDir(ctx), PART_DIR);
        if (!d.exists()) d.mkdirs();
        return d;
    }

    public long freeBytes() {
        try {
            StatFs s = new StatFs(packsDir(ctx).getAbsolutePath());
            return s.getAvailableBytes();
        } catch (Exception e) {
            return -1;
        }
    }

    public synchronized JSONArray jobsJson() {
        JSONArray a = new JSONArray();
        for (Job j : jobs.values()) a.put(j.toJson());
        return a;
    }

    public synchronized boolean hasActive() {
        for (Job j : jobs.values()) if (j.active()) return true;
        return false;
    }

    /** Bildirim için özet: [etkin iş sayısı, alınan, toplam, hız] */
    public synchronized long[] summary() {
        long n = 0, rec = 0, tot = 0, sp = 0;
        for (Job j : jobs.values()) {
            if (!j.active()) continue;
            n++;
            rec += j.received.get();
            tot += j.total;
            sp += (long) j.speed;
        }
        return new long[] {n, rec, tot, sp};
    }

    public synchronized String activeName() {
        for (Job j : jobs.values()) if (j.active()) return j.file;
        return null;
    }

    /** Uygulama yeniden açılınca yarım kalan indirmeleri duraklatılmış olarak listeler. */
    private void restore() {
        File[] fs = partDir().listFiles();
        if (fs == null) return;
        for (File f : fs) {
            String n = f.getName();
            if (!n.endsWith(".durum")) continue;
            try {
                JSONObject st = new JSONObject(readText(f));
                String file = st.getString("file");
                if (!isPackName(file)) continue;
                List<String> urls = new ArrayList<>();
                JSONArray ua = st.optJSONArray("urls");
                if (ua != null) for (int i = 0; i < ua.length(); i++) urls.add(ua.getString(i));
                Job j = new Job(file, urls, st.optLong("size", 0), st.optString("sha256", null));
                j.total = st.optLong("total", j.size);
                j.received.set(st.optLong("received", 0));
                j.status = "paused";
                jobs.put(file, j);
            } catch (Exception ignored) {}
        }
    }

    // ---- komutlar ---------------------------------------------------------------------

    public synchronized Job start(String file, List<String> urls, long size, String sha256) throws IOException {
        if (!isPackName(file)) throw new IOException("Geçersiz dosya adı");
        Job old = jobs.get(file);
        if (old != null && old.active()) return old;
        // Duraklatılan eski iş parçacığı bitmeden yenisi başlamasın (aynı .part dosyası)
        if (old != null && old.thread != null && old.thread.isAlive()) {
            try { old.thread.join(5000); } catch (InterruptedException ignored) {}
        }
        if (urls == null || urls.isEmpty()) {
            if (old == null) throw new IOException("İndirme adresi yok");
            urls = old.urls;
        }
        long free = freeBytes();
        long have = old != null ? old.received.get() : 0;
        if (size > 0 && free >= 0 && size - have + YEDEK_ALAN > free) {
            throw new IOException("Yer yetersiz: yaklaşık " + fmt(size - have) + " gerekli, " + fmt(free) + " boş");
        }
        Job j = new Job(file, new ArrayList<>(urls), size > 0 ? size : (old != null ? old.size : 0), sha256 != null ? sha256 : (old != null ? old.sha256 : null));
        if (old != null) {
            j.received.set(old.received.get());
            j.total = old.total;
        }
        jobs.put(file, j);
        j.thread = new Thread(() -> run(j), "indir-" + file);
        j.thread.start();
        changed();
        return j;
    }

    public synchronized void pause(String file) {
        Job j = jobs.get(file);
        if (j == null) return;
        if (j.active()) {
            j.stop = true;
            abortConnections(j);
            j.status = "paused";
            j.speed = 0;
        } else if ("error".equals(j.status)) {
            j.status = "paused";
        }
        changed();
    }

    public void cancel(String file) {
        // Ad sayfadan gelir: "../" ile paket klasörü dışındaki .part/.durum dosyaları silinmesin
        if (!isPackName(file)) return;
        Job j;
        synchronized (this) {
            j = jobs.remove(file);
        }
        if (j != null) {
            j.stop = true;
            j.remove = true;
            abortConnections(j);
            if (j.thread != null) try { j.thread.join(3000); } catch (InterruptedException ignored) {}
        }
        new File(partDir(), file + ".part").delete();
        new File(partDir(), file + ".durum").delete();
        changed();
    }

    private void abortConnections(Job j) {
        synchronized (j.open) {
            for (HttpURLConnection c : j.open) try { c.disconnect(); } catch (Exception ignored) {}
        }
    }

    // ---- iş --------------------------------------------------------------------------

    private static final class Probe {
        final String url;
        final double speed;
        final long total;
        Probe(String url, double speed, long total) {
            this.url = url;
            this.speed = speed;
            this.total = total;
        }
    }

    private static final class Seg {
        final long start, end;
        volatile long pos;
        Seg(long start, long end, long pos) {
            this.start = start;
            this.end = end;
            this.pos = pos;
        }
        long left() {
            return Math.max(0, end - pos + 1);
        }
    }

    private void run(Job j) {
        File part = new File(partDir(), j.file + ".part");
        File durum = new File(partDir(), j.file + ".durum");
        try {
            j.status = "checking";
            changed();
            List<Probe> mirrors = probe(j);
            if (j.stop) return;
            if (mirrors.isEmpty()) throw new IOException("Hiçbir kaynağa ulaşılamadı — internet bağlantısını kontrol edin");
            long total = j.size > 0 ? j.size : mirrors.get(0).total;
            j.total = total;

            // Kayıtlı durum: aynı toplam boyuttaysa bölümler kaldığı yerden sürer
            List<Seg> segs = null;
            if (durum.exists() && part.exists()) {
                try {
                    JSONObject st = new JSONObject(readText(durum));
                    if (st.optLong("total") == total) {
                        JSONArray a = st.getJSONArray("segs");
                        segs = new ArrayList<>();
                        for (int i = 0; i < a.length(); i++) {
                            JSONArray s = a.getJSONArray(i);
                            segs.add(new Seg(s.getLong(0), s.getLong(1), s.getLong(2)));
                        }
                    }
                } catch (Exception ignored) {
                    segs = null;
                }
            }
            if (segs == null) {
                part.delete();
                segs = plan(total);
            }
            final List<Seg> fsegs = segs;
            long done = 0;
            for (Seg s : segs) done += s.pos - s.start;
            // Boyut önceden bilinmiyorsa (katalogda yaklaşık boyut) yer denetimi burada: telefonun
            // belleği sıfıra kadar dolmasın (SMS kuyruğu, konum kaydı da yazılamaz olur)
            long bos = freeBytes();
            if (bos >= 0 && total - done + YEDEK_ALAN > bos) {
                throw new IOException("Yer yetersiz: yaklaşık " + fmt(total - done) + " gerekli, " + fmt(bos) + " boş");
            }
            j.received.set(done);
            j.status = "downloading";
            changed();

            try (RandomAccessFile raf = new RandomAccessFile(part, "rw")) {
                if (raf.length() != total) raf.setLength(total);
                FileChannel ch = raf.getChannel();
                ExecutorService pool = Executors.newFixedThreadPool(fsegs.size());
                List<Future<?>> fut = new ArrayList<>();
                final int[] errors = {0};
                final String[] lastErr = {null};
                for (int i = 0; i < fsegs.size(); i++) {
                    final Seg s = fsegs.get(i);
                    final int idx = i;
                    fut.add(pool.submit(() -> {
                        int tries = 0;
                        int m = idx % Math.min(2, mirrors.size());
                        while (!j.stop && s.left() > 0) {
                            String url = mirrors.get(m % mirrors.size()).url;
                            try {
                                fetchRange(j, url, s, ch);
                                tries = 0;
                            } catch (IOException e) {
                                if (j.stop) break;
                                synchronized (errors) {
                                    errors[0]++;
                                    lastErr[0] = e.getMessage();
                                }
                                tries++;
                                m++;
                                if (tries > MAX_TRIES) break;
                                sleep(Math.min(8000, 1000L * tries));
                            }
                        }
                    }));
                }
                pool.shutdown();
                long lastBytes = j.received.get();
                long lastT = System.currentTimeMillis();
                while (!pool.awaitTermination(1, TimeUnit.SECONDS)) {
                    long now = System.currentTimeMillis();
                    long b = j.received.get();
                    double inst = (b - lastBytes) * 1000.0 / Math.max(1, now - lastT);
                    j.speed = j.speed == 0 ? inst : j.speed * 0.7 + inst * 0.3;
                    lastBytes = b;
                    lastT = now;
                    saveState(durum, j, total, fsegs);
                }
                for (Future<?> f : fut) try { f.get(); } catch (Exception ignored) {}
                saveState(durum, j, total, fsegs);
                if (j.stop) return;
                long left = 0;
                for (Seg s : fsegs) left += s.left();
                if (left > 0) throw new IOException("İndirme tamamlanamadı" + (lastErr[0] != null ? ": " + lastErr[0] : ""));
                ch.force(true);
            }

            // Doğrulama
            j.status = "verifying";
            j.speed = 0;
            changed();
            if (part.length() != total) throw new IOException("Boyut tutmadı (" + part.length() + " ≠ " + total + ")");
            if (j.sha256 != null) {
                String h = sha256(part, j);
                if (j.stop) return;
                if (!j.sha256.equals(h)) {
                    part.delete();
                    durum.delete();
                    throw new IOException("Dosya doğrulanamadı (SHA-256 farklı); yeniden indirin");
                }
            }
            File target = new File(packsDir(ctx), j.file);
            if (target.exists()) target.delete();
            if (!part.renameTo(target)) throw new IOException("Dosya paket klasörüne taşınamadı");
            durum.delete();
            // Bütünlük kaydı (iç depoda): açılmadan önce dosyanın başka bir uygulamaca
            // değiştirilmediği denetlenir (PaketButunlugu). Kayıt yazılamazsa indirme yine biter.
            try {
                new PaketButunlugu(ctx.getFilesDir()).kaydet(target, j.sha256);
            } catch (Exception ignored) {}
            j.received.set(total);
            j.status = "done";
            changed();
            // Bitmiş iş bir süre listede kalır ki arayüz "tamamlandı"yı görsün
            sleep(15000);
            synchronized (this) {
                if (jobs.get(j.file) == j) jobs.remove(j.file);
            }
            changed();
        } catch (Exception e) {
            if (j.stop) return;
            j.status = "error";
            j.speed = 0;
            j.error = e.getMessage() != null ? e.getMessage() : "bağlantı kurulamadı";
            changed();
        }
    }

    private static List<Seg> plan(long total) {
        List<Seg> out = new ArrayList<>();
        int count = (int) Math.max(1, Math.min(SEGMENTS, total / MIN_SEGMENT));
        long size = (total + count - 1) / count;
        for (int i = 0; i < count; i++) {
            long start = i * size;
            long end = Math.min(total, start + size) - 1;
            if (start <= end) out.add(new Seg(start, end, start));
        }
        return out;
    }

    private void saveState(File durum, Job j, long total, List<Seg> segs) {
        try {
            JSONObject st = new JSONObject();
            st.put("file", j.file);
            st.put("size", j.size);
            st.put("total", total);
            st.put("received", j.received.get());
            if (j.sha256 != null) st.put("sha256", j.sha256);
            JSONArray ua = new JSONArray();
            for (String u : j.urls) ua.put(u);
            st.put("urls", ua);
            JSONArray a = new JSONArray();
            for (Seg s : segs) a.put(new JSONArray().put(s.start).put(s.end).put(s.pos));
            st.put("segs", a);
            File tmp = new File(durum.getPath() + ".tmp");
            java.io.FileOutputStream o = new java.io.FileOutputStream(tmp);
            o.write(st.toString().getBytes(StandardCharsets.UTF_8));
            o.close();
            if (!tmp.renameTo(durum)) {
                durum.delete();
                tmp.renameTo(durum);
            }
        } catch (Exception ignored) {}
        changed();
    }

    /** Bölümün kalanını indirir; bağlantı koparsa ya da takılırsa IOException. */
    private void fetchRange(Job j, String url, Seg s, FileChannel ch) throws IOException {
        HttpURLConnection c = open(url, s.pos, s.end, STALL_MS);
        j.open.add(c);
        try {
            int code = c.getResponseCode();
            if (code != 206) throw new IOException(host(url) + ": yanıt " + code);
            // Sunucu istenen yerden başlamalı ve aynı dosyayı vermeli (aksi halde dosya bozulur)
            String cr = c.getHeaderField("Content-Range");
            Matcher crm = cr == null ? null : Pattern.compile("bytes\\s+(\\d+)-\\d+/(\\d+)").matcher(cr);
            if (crm == null || !crm.find() || Long.parseLong(crm.group(1)) != s.pos || (j.total > 0 && Long.parseLong(crm.group(2)) != j.total))
                throw new IOException(host(url) + ": beklenmeyen aralık " + cr);
            j.mirror = url;
            InputStream in = c.getInputStream();
            byte[] buf = new byte[256 * 1024];
            while (!j.stop && s.left() > 0) {
                int want = (int) Math.min(buf.length, s.left());
                int n = in.read(buf, 0, want);
                if (n < 0) break;
                ByteBuffer bb = ByteBuffer.wrap(buf, 0, n);
                long p = s.pos;
                while (bb.hasRemaining()) p += ch.write(bb, p);
                s.pos += n;
                j.received.addAndGet(n);
            }
            if (!j.stop && s.left() > 0) throw new IOException(host(url) + ": bağlantı erken kapandı");
        } finally {
            j.open.remove(c);
            c.disconnect();
        }
    }

    /** Aynaları paralel ölçer; Range destekleyen ve boyutu tutanlar hıza göre sıralanır. */
    private List<Probe> probe(Job j) {
        List<String> cands = expandMirrors(j.urls);
        List<Probe> out = Collections.synchronizedList(new ArrayList<>());
        ExecutorService pool = Executors.newFixedThreadPool(Math.max(1, Math.min(8, cands.size())));
        for (String u : cands) {
            pool.submit(() -> {
                HttpURLConnection c = null;
                try {
                    long t0 = System.currentTimeMillis();
                    c = open(u, 0, PROBE_BYTES - 1, PROBE_MS);
                    j.open.add(c);
                    if (c.getResponseCode() != 206) return;
                    long total = parseTotal(c.getHeaderField("Content-Range"));
                    if (total <= 0 || (j.size > 0 && total != j.size)) return;
                    InputStream in = c.getInputStream();
                    byte[] buf = new byte[64 * 1024];
                    long got = 0;
                    while (got < PROBE_BYTES && System.currentTimeMillis() - t0 < PROBE_MS) {
                        int n = in.read(buf);
                        if (n < 0) break;
                        got += n;
                    }
                    double sp = got * 1000.0 / Math.max(1, System.currentTimeMillis() - t0);
                    out.add(new Probe(u, sp, total));
                } catch (Exception ignored) {
                } finally {
                    if (c != null) {
                        j.open.remove(c);
                        c.disconnect();
                    }
                }
            });
        }
        pool.shutdown();
        try { pool.awaitTermination(PROBE_MS + 4000, TimeUnit.MILLISECONDS); } catch (InterruptedException ignored) {}
        pool.shutdownNow();
        List<Probe> res = new ArrayList<>(out);
        // Boyut bilinmiyorsa aynalar farklı sürümler sunabilir: parçalar karışmasın diye yalnız
        // en çok aynada görülen toplam boyuttakiler kullanılır
        if (j.size <= 0 && !res.isEmpty()) {
            java.util.Map<Long, Integer> say = new java.util.HashMap<>();
            for (Probe p : res) say.merge(p.total, 1, Integer::sum);
            long cogu = res.get(0).total;
            for (java.util.Map.Entry<Long, Integer> e : say.entrySet()) if (e.getValue() > say.get(cogu)) cogu = e.getKey();
            final long secilen = cogu;
            res.removeIf(p -> p.total != secilen);
        }
        Collections.sort(res, (a, b) -> Double.compare(b.speed, a.speed));
        return res;
    }

    private static HttpURLConnection open(String url, long from, long to, int readTimeout) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(15000);
        c.setReadTimeout(readTimeout);
        c.setInstanceFollowRedirects(true);
        c.setRequestProperty("User-Agent", UA);
        c.setRequestProperty("Accept-Encoding", "identity");
        c.setRequestProperty("Range", "bytes=" + from + "-" + (to >= 0 ? to : ""));
        return c;
    }

    static long parseTotal(String contentRange) {
        if (contentRange == null) return -1;
        Matcher m = Pattern.compile("/(\\d+)\\s*$").matcher(contentRange);
        return m.find() ? Long.parseLong(m.group(1)) : -1;
    }

    private static final Pattern KIWIX1 = Pattern.compile("^https?://[^/]*kiwix\\.org/zim/(.+)$");
    private static final Pattern KIWIX2 = Pattern.compile("^https?://[^/]+/(?:.*/)?kiwix(?:\\.org)?(?:-md)?/zim/(.+)$");

    /**
     * İndirme yalnız https üzerinden ve bilinen kaynaklardan yapılır (Kiwix ve aynaları, Hugging
     * Face, proje sitesi, GitHub). Sayfaya sızan bir betik paketleri rastgele bir adresten gelen
     * dosyayla değiştiremesin; düz http'de araya giren de içeriği değiştiremesin.
     */
    static final String[] IZINLI_ALANLAR = {
        "kiwix.org", "ftp.fau.de", "ftp.nluug.nl", "mirrors.dotsrc.org", "mirror.accum.se", "dumps.wikimedia.org",
        "wi.mirror.driftle.ss", "huggingface.co", "hf.co", "akilcantasi.com", "github.com", "githubusercontent.com",
    };

    static boolean izinliAdres(String u) {
        if (u == null) return false;
        try {
            URL x = new URL(u);
            if (!"https".equals(x.getProtocol())) return false;
            String h = x.getHost().toLowerCase(java.util.Locale.ROOT);
            for (String a : IZINLI_ALANLAR) if (h.equals(a) || h.endsWith("." + a)) return true;
        } catch (Exception ignored) {}
        return false;
    }

    /** server/fetcher.mjs expandMirrors ile aynı kural. */
    static List<String> expandMirrors(List<String> urls) {
        List<String> out = new ArrayList<>();
        for (String u : urls) {
            if (!izinliAdres(u)) continue;
            Matcher m = KIWIX1.matcher(u);
            boolean ok = m.find();
            if (!ok) {
                m = KIWIX2.matcher(u);
                ok = m.find();
            }
            if (ok) for (String b : KIWIX_MIRRORS) addOnce(out, b + "/" + m.group(1));
            addOnce(out, u);
        }
        return out;
    }

    private static void addOnce(List<String> l, String u) {
        if (!l.contains(u)) l.add(u);
    }

    private static String sha256(File f, Job j) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        try (FileInputStream in = new FileInputStream(f)) {
            byte[] buf = new byte[1024 * 1024];
            int n;
            while (!j.stop && (n = in.read(buf)) > 0) md.update(buf, 0, n);
        }
        StringBuilder sb = new StringBuilder();
        for (byte b : md.digest()) sb.append(String.format(Locale.ROOT, "%02x", b));
        return sb.toString();
    }

    static String host(String u) {
        try {
            return new URL(u).getHost();
        } catch (Exception e) {
            return u;
        }
    }

    private static String readText(File f) throws IOException {
        try (FileInputStream in = new FileInputStream(f)) {
            byte[] b = new byte[(int) f.length()];
            int off = 0;
            while (off < b.length) {
                int n = in.read(b, off, b.length - off);
                if (n < 0) break;
                off += n;
            }
            return new String(b, 0, off, StandardCharsets.UTF_8);
        }
    }

    static String fmt(long n) {
        if (n >= 1_000_000_000L) return String.format(Locale.ROOT, "%.1f GB", n / 1e9).replace('.', ',');
        return Math.round(n / 1e6) + " MB";
    }

    private static void sleep(long ms) {
        try { Thread.sleep(ms); } catch (InterruptedException ignored) {}
    }
}
