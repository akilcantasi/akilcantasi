package org.akilcantasi.app;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.BridgeWebViewClient;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends BridgeActivity {

    /** Uygulamanın paket klasöründeki dosyalar bu yoldan okunur (src/lib/native.ts NATIVE_PACK_PATH). */
    static final String PACK_PATH = "/_paket/";
    /** Bildirimden açılınca gidilecek araç (örn. "enkaz-arama"); EnkazPlugin.acilisHedefi okur */
    static final String EKSTRA_ARAC = "ac_arac";
    private static String bekleyenHedef;

    static synchronized String hedefAl() {
        String h = bekleyenHedef;
        bekleyenHedef = null;
        return h;
    }

    private static synchronized void hedefKoy(Intent i) {
        String a = i == null ? null : i.getStringExtra(EKSTRA_ARAC);
        if (a == null || !a.matches("[a-z-]{1,24}")) return;
        bekleyenHedef = a;
        i.removeExtra(EKSTRA_ARAC);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        hedefKoy(intent);
        String h = bekleyenHedef;
        if (h != null) EnkazPlugin.hedefGeldi(h);
    }
    private static final Pattern RANGE = Pattern.compile("bytes=(\\d*)-(\\d*)");

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Eklentiler super.onCreate'ten ÖNCE kaydedilmeli
        registerPlugin(AkilCantasiPlugin.class);
        registerPlugin(AkilMeshPlugin.class);
        registerPlugin(EnkazPlugin.class);
        registerPlugin(GuncellemePlugin.class);
        hedefKoy(getIntent());
        super.onCreate(savedInstanceState);

        // Android 12+ esneme (stretch) / parıltı efekti kapalı: içerik sonuna gelince bütün WebView
        // (alttaki menüyle birlikte) yukarı esnemesin. Kaydırma yalnız sayfanın içinde olur (app.css).
        WebView wv = bridge == null ? null : bridge.getWebView();
        if (wv != null) wv.setOverScrollMode(View.OVER_SCROLL_NEVER);

        // Geri tuşu: uygulama içi geçmişte bir adım geri (src/gecmis.ts her ekranı history'ye yazar).
        // Geçmiş bitince Android'in olağan davranışı (uygulamadan çık / arka plana al).
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView w = bridge == null ? null : bridge.getWebView();
                if (w != null && w.canGoBack()) {
                    w.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                }
            }
        });

        // Fener (llama.cpp WASM) çok iş parçacıklı çalışabilsin diye
        // uygulamanın kendi dosyalarına COOP/COEP başlıkları eklenir.
        // Böylece WebView'da crossOriginIsolated = true olur.
        this.bridge.setWebViewClient(new BridgeWebViewClient(this.bridge) {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                WebResourceResponse res = null;
                String path = request.getUrl().getPath();
                // Yalnız uygulamanın kendi adresi (https://localhost/_paket/…): başka bir sunucunun
                // /_paket/ yolu yerel paketlerden yanıtlanmasın
                String host = request.getUrl().getHost();
                if (path != null && path.startsWith(PACK_PATH) && "localhost".equals(host)) {
                    try {
                        res = packResponse(request, path.substring(PACK_PATH.length()));
                    } catch (RuntimeException e) {
                        // Bozuk aralık (ör. çok büyük sayı) uygulamayı çökertmesin
                        res = new WebResourceResponse("text/plain", null, 416, "Range Not Satisfiable", new HashMap<>(), empty());
                    }
                }
                if (res == null) res = super.shouldInterceptRequest(view, request);
                if (res == null) return null;
                Map<String, String> headers = res.getResponseHeaders();
                Map<String, String> copy = headers == null ? new HashMap<>() : new HashMap<>(headers);
                copy.put("Cross-Origin-Opener-Policy", "same-origin");
                copy.put("Cross-Origin-Embedder-Policy", "require-corp");
                copy.put("Cross-Origin-Resource-Policy", "cross-origin");
                res.setResponseHeaders(copy);
                return res;
            }
        });
    }

    /**
     * Paket dosyasını Range isteğiyle parça parça sunar (ZIM, PMTiles ve model dosyaları
     * GB boyutundadır; WebView'a bütünüyle verilemez). Capacitor'ün kendi dosya sunucusu
     * Range başlığını doğru işlemediği için ayrı yazıldı.
     */
    private WebResourceResponse packResponse(WebResourceRequest request, String name) {
        Map<String, String> h = new HashMap<>();
        h.put("Accept-Ranges", "bytes");
        h.put("Cache-Control", "no-store");
        if (!PaketIndirici.isPackName(name)) return new WebResourceResponse("text/plain", null, 404, "Not Found", h, empty());
        File f = new File(PaketIndirici.packsDir(this), name);
        if (!f.isFile()) return new WebResourceResponse("text/plain", null, 404, "Not Found", h, empty());
        long size = f.length();
        String mime = name.endsWith(".json") || name.endsWith(".geojson") ? "application/json" : "application/octet-stream";
        boolean head = "HEAD".equalsIgnoreCase(request.getMethod());
        // Aralık adreste gelir (?aralik=bas-son): WebView, Range başlıklı isteklerde araya girip
        // yanıtı kendi de kaydırabiliyor; adresteki aralıkta yanıt düz 200 ve tam o baytlardır.
        String q = request.getUrl().getQueryParameter("aralik");
        if (q != null) {
            Matcher qm = Pattern.compile("^(\\d+)-(\\d+)$").matcher(q);
            if (!qm.find()) return rangeError(h, size);
            long start = Long.parseLong(qm.group(1));
            long end = Math.min(size - 1, Long.parseLong(qm.group(2)));
            if (start >= size || start > end) return rangeError(h, size);
            long len = end - start + 1;
            h.put("Content-Length", String.valueOf(len));
            h.put("X-Aralik", start + "-" + end + "/" + size);
            try {
                return new WebResourceResponse(mime, null, 200, "OK", h, head ? empty() : new RangeStream(f, start, len));
            } catch (IOException e) {
                return new WebResourceResponse("text/plain", null, 500, "Error", h, empty());
            }
        }
        String range = null;
        Map<String, String> rh = request.getRequestHeaders();
        if (rh != null) for (Map.Entry<String, String> e : rh.entrySet()) if ("range".equalsIgnoreCase(e.getKey())) range = e.getValue();
        try {
            if (range == null) {
                h.put("Content-Length", String.valueOf(size));
                return new WebResourceResponse(mime, null, 200, "OK", h, head ? empty() : new FileInputStream(f));
            }
            Matcher m = RANGE.matcher(range);
            if (!m.find()) return rangeError(h, size);
            long start, end;
            if (m.group(1).isEmpty()) {
                // bytes=-N: son N bayt
                long n = m.group(2).isEmpty() ? 0 : Long.parseLong(m.group(2));
                start = Math.max(0, size - n);
                end = size - 1;
            } else {
                start = Long.parseLong(m.group(1));
                end = m.group(2).isEmpty() ? size - 1 : Math.min(size - 1, Long.parseLong(m.group(2)));
            }
            if (start >= size || start > end) return rangeError(h, size);
            long len = end - start + 1;
            h.put("Content-Range", "bytes " + start + "-" + end + "/" + size);
            h.put("Content-Length", String.valueOf(len));
            InputStream in = head ? empty() : new RangeStream(f, start, len);
            return new WebResourceResponse(mime, null, 206, "Partial Content", h, in);
        } catch (IOException | NumberFormatException e) {
            return new WebResourceResponse("text/plain", null, 500, "Error", h, empty());
        }
    }

    private static WebResourceResponse rangeError(Map<String, String> h, long size) {
        h.put("Content-Range", "bytes */" + size);
        return new WebResourceResponse("text/plain", null, 416, "Range Not Satisfiable", h, empty());
    }

    private static InputStream empty() {
        return new ByteArrayInputStream(new byte[0]);
    }

    /** Dosyanın [start, start+len) aralığını okuyan akış. */
    static final class RangeStream extends InputStream {
        private final FileInputStream in;
        private long left;

        RangeStream(File f, long start, long len) throws IOException {
            in = new FileInputStream(f);
            in.getChannel().position(start);
            left = len;
        }

        @Override
        public int read() throws IOException {
            if (left <= 0) return -1;
            int b = in.read();
            if (b >= 0) left--;
            return b;
        }

        @Override
        public int read(byte[] b, int off, int len) throws IOException {
            if (left <= 0) return -1;
            int n = in.read(b, off, (int) Math.min(len, left));
            if (n > 0) left -= n;
            return n;
        }

        @Override
        public int available() throws IOException {
            return (int) Math.min(Integer.MAX_VALUE, Math.min(left, in.available()));
        }

        @Override
        public void close() throws IOException {
            in.close();
        }
    }
}
