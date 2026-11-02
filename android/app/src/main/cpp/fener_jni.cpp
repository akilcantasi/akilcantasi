// Fener yerel motoru: llama.cpp'yi JNI ile Java'ya (FenerMotoru.java) açar.
//
// WebView'daki WebAssembly motoruna (wllama) göre çok daha hızlıdır: işlemcinin ARM
// vektör komutlarını (NEON, dotprod, i8mm, SVE — GGML_CPU_ALL_VARIANTS ile çalışırken
// seçilir) ve varsa Adreno GPU'yu (OpenCL arka ucu) kullanır.
//
// Aynı dosya, sınama için masaüstü Linux'ta da derlenir (tools/fener-sinama).
#include <jni.h>

#include <atomic>
#include <chrono>
#include <cstring>
#include <mutex>
#include <random>
#include <string>
#include <vector>

#include "chat.h"
#include "llama.h"
#include "ggml-backend.h"

#ifdef __ANDROID__
#include <android/log.h>
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, "fener", __VA_ARGS__)
#define LOGW(...) __android_log_print(ANDROID_LOG_WARN, "fener", __VA_ARGS__)
#else
#include <cstdio>
#define LOGI(...) (fprintf(stderr, "[fener] " __VA_ARGS__), fputc('\n', stderr))
#define LOGW(...) (fprintf(stderr, "[fener] " __VA_ARGS__), fputc('\n', stderr))
#endif

namespace {

struct Motor {
    llama_model *model = nullptr;
    llama_context *ctx = nullptr;
    common_chat_templates_ptr tmpls;
    std::atomic<bool> stop{false};
    std::mutex mu;  // aynı anda tek üretim
    int n_gpu_layers = 0;
    int n_threads = 1;
};

std::string g_error;
std::mutex g_error_mu;
bool g_started = false;

void set_error(const std::string &e) {
    std::lock_guard<std::mutex> l(g_error_mu);
    g_error = e;
    LOGW("%s", e.c_str());
}

std::string jstr(JNIEnv *env, jstring s) {
    if (!s) return "";
    const char *c = env->GetStringUTFChars(s, nullptr);
    std::string out(c ? c : "");
    if (c) env->ReleaseStringUTFChars(s, c);
    return out;
}

/** Java String → UTF-8 (4 baytlık karakterler/emoji dahil doğru) */
std::string jstr_utf8(JNIEnv *env, jstring s) {
    if (!s) return "";
    jclass sc = env->FindClass("java/lang/String");
    jmethodID gb = env->GetMethodID(sc, "getBytes", "(Ljava/lang/String;)[B");
    jstring enc = env->NewStringUTF("UTF-8");
    auto arr = (jbyteArray) env->CallObjectMethod(s, gb, enc);
    env->DeleteLocalRef(enc);
    env->DeleteLocalRef(sc);
    if (!arr) return "";
    jsize n = env->GetArrayLength(arr);
    std::string out((size_t) n, '\0');
    env->GetByteArrayRegion(arr, 0, n, reinterpret_cast<jbyte *>(&out[0]));
    env->DeleteLocalRef(arr);
    return out;
}

std::string json_escape(const std::string &s) {
    std::string o;
    for (unsigned char c : s) {
        switch (c) {
            case '"': o += "\\\""; break;
            case '\\': o += "\\\\"; break;
            case '\n': o += "\\n"; break;
            case '\r': o += "\\r"; break;
            case '\t': o += "\\t"; break;
            default:
                if (c < 0x20) {
                    char b[8];
                    snprintf(b, sizeof b, "\\u%04x", c);
                    o += b;
                } else {
                    o += (char) c;
                }
        }
    }
    return o;
}

/** Baştaki tam UTF-8 karakterlerin bayt uzunluğu (yarım kalan çok baytlı karakter sonraya kalır) */
size_t utf8_complete_prefix(const std::string &s) {
    size_t i = s.size();
    // Sondan en çok 3 bayt geriye bakıp yarım karakteri bul
    for (size_t k = 1; k <= 4 && k <= s.size(); k++) {
        unsigned char c = (unsigned char) s[s.size() - k];
        if ((c & 0xC0) == 0x80) continue;  // devam baytı
        size_t need = (c & 0x80) == 0 ? 1 : (c & 0xE0) == 0xC0 ? 2 : (c & 0xF0) == 0xE0 ? 3 : (c & 0xF8) == 0xF0 ? 4 : 1;
        if (k < need) i = s.size() - k;
        break;
    }
    return i;
}

bool abort_cb(void *data) {
    return static_cast<Motor *>(data)->stop.load();
}

std::string backend_names() {
    std::string out;
    for (size_t i = 0; i < ggml_backend_dev_count(); i++) {
        ggml_backend_dev_t d = ggml_backend_dev_get(i);
        if (!out.empty()) out += ",";
        out += ggml_backend_dev_name(d);
    }
    return out;
}

bool has_gpu() {
    for (size_t i = 0; i < ggml_backend_dev_count(); i++) {
        auto t = ggml_backend_dev_type(ggml_backend_dev_get(i));
        if (t == GGML_BACKEND_DEVICE_TYPE_GPU || t == GGML_BACKEND_DEVICE_TYPE_IGPU) return true;
    }
    return false;
}

}  // namespace

extern "C" {

JNIEXPORT void JNICALL Java_org_akilcantasi_app_FenerMotoru_baslat(JNIEnv *env, jclass, jstring jdir) {
    if (g_started) return;
    std::string dir = jstr(env, jdir);
    llama_log_set(
        [](ggml_log_level level, const char *text, void *) {
            if (level == GGML_LOG_LEVEL_WARN || level == GGML_LOG_LEVEL_ERROR) LOGW("%s", text);
        },
        nullptr);
    // Ayrı kütüphane olarak derlenen arka uçlar (işlemci türevleri, GPU) buradan yüklenir
    if (!dir.empty()) ggml_backend_load_all_from_path(dir.c_str());
    else ggml_backend_load_all();
    llama_backend_init();
    g_started = true;
    LOGI("arka uçlar: %s", backend_names().c_str());
}

JNIEXPORT jstring JNICALL Java_org_akilcantasi_app_FenerMotoru_arkaUclar(JNIEnv *env, jclass) {
    std::string s = "{\"devices\":\"" + json_escape(backend_names()) + "\",\"gpu\":" + (has_gpu() ? "true" : "false") +
                    ",\"system\":\"" + json_escape(llama_print_system_info()) + "\"}";
    return env->NewStringUTF(s.c_str());
}

JNIEXPORT jstring JNICALL Java_org_akilcantasi_app_FenerMotoru_sonHata(JNIEnv *env, jclass) {
    std::lock_guard<std::mutex> l(g_error_mu);
    return env->NewStringUTF(g_error.c_str());
}

JNIEXPORT jlong JNICALL Java_org_akilcantasi_app_FenerMotoru_yukle(JNIEnv *env, jclass, jstring jpath, jint n_ctx, jint n_threads, jint n_gpu_layers) {
    set_error("");
    std::string path = jstr(env, jpath);
    llama_model_params mp = llama_model_default_params();
    mp.n_gpu_layers = has_gpu() ? n_gpu_layers : 0;
    llama_model *model = llama_model_load_from_file(path.c_str(), mp);
    if (!model) {
        set_error("Model dosyası açılamadı: " + path);
        return 0;
    }
    llama_context_params cp = llama_context_default_params();
    int train = llama_model_n_ctx_train(model);
    cp.n_ctx = (uint32_t) (train > 0 && n_ctx > train ? train : n_ctx);
    cp.n_batch = 512;
    cp.n_ubatch = 512;
    cp.n_threads = n_threads;
    cp.n_threads_batch = n_threads;
    llama_context *ctx = llama_init_from_model(model, cp);
    if (!ctx) {
        llama_model_free(model);
        set_error("Model belleğe sığmadı (bağlam oluşturulamadı)");
        return 0;
    }
    auto *m = new Motor();
    m->model = model;
    m->ctx = ctx;
    m->n_gpu_layers = mp.n_gpu_layers;
    m->n_threads = n_threads;
    try {
        m->tmpls = common_chat_templates_init(model, "");
    } catch (const std::exception &e) {
        LOGW("sohbet şablonu: %s", e.what());
    }
    llama_set_abort_callback(ctx, abort_cb, m);
    LOGI("model yüklendi: ctx=%u threads=%d gpu_layers=%d", llama_n_ctx(ctx), n_threads, mp.n_gpu_layers);
    return reinterpret_cast<jlong>(m);
}

JNIEXPORT jstring JNICALL Java_org_akilcantasi_app_FenerMotoru_bilgi(JNIEnv *env, jclass, jlong h) {
    auto *m = reinterpret_cast<Motor *>(h);
    if (!m) return env->NewStringUTF("{}");
    char desc[256] = {0};
    llama_model_desc(m->model, desc, sizeof desc);
    std::string s = std::string("{\"desc\":\"") + json_escape(desc) + "\",\"params\":" + std::to_string((double) llama_model_n_params(m->model)) +
                    ",\"size\":" + std::to_string((double) llama_model_size(m->model)) + ",\"nCtx\":" + std::to_string(llama_n_ctx(m->ctx)) +
                    ",\"threads\":" + std::to_string(m->n_threads) + ",\"gpuLayers\":" + std::to_string(m->n_gpu_layers) +
                    ",\"layers\":" + std::to_string(llama_model_n_layer(m->model)) + ",\"devices\":\"" + json_escape(backend_names()) + "\"}";
    return env->NewStringUTF(s.c_str());
}

JNIEXPORT void JNICALL Java_org_akilcantasi_app_FenerMotoru_durdur(JNIEnv *, jclass, jlong h) {
    auto *m = reinterpret_cast<Motor *>(h);
    if (m) m->stop = true;
}

JNIEXPORT void JNICALL Java_org_akilcantasi_app_FenerMotoru_bosalt(JNIEnv *, jclass, jlong h) {
    auto *m = reinterpret_cast<Motor *>(h);
    if (!m) return;
    m->stop = true;
    std::lock_guard<std::mutex> l(m->mu);  // süren üretimin bitmesini bekle
    m->tmpls.reset();
    if (m->ctx) llama_free(m->ctx);
    if (m->model) llama_model_free(m->model);
    delete m;
}

/**
 * Sohbet tamamlaması. roller/icerikler: mesajlar. Her yeni metin parçası akis.parca(byte[]) ile
 * (tam UTF-8 karakterler olarak) verilir; false dönerse üretim durur.
 * Dönen JSON: {"tokens":n,"promptTokens":n,"promptMs":x,"genMs":x,"aborted":b,"error":"..."}
 */
JNIEXPORT jstring JNICALL Java_org_akilcantasi_app_FenerMotoru_sohbet(JNIEnv *env, jclass, jlong h, jobjectArray jroles, jobjectArray jcontents, jint max_tokens,
                                                                      jfloat temp, jint top_k, jfloat top_p, jfloat repeat, jobject akis) {
    auto *m = reinterpret_cast<Motor *>(h);
    auto fail = [&](const std::string &e) {
        std::string s = "{\"tokens\":0,\"aborted\":false,\"error\":\"" + json_escape(e) + "\"}";
        return env->NewStringUTF(s.c_str());
    };
    if (!m) return fail("Model yüklü değil");
    std::lock_guard<std::mutex> lock(m->mu);
    m->stop = false;

    jclass ak = env->GetObjectClass(akis);
    jmethodID parca = env->GetMethodID(ak, "parca", "([B)Z");
    if (!parca) return fail("akış geri çağrısı yok");

    // 1) Sohbet şablonu (Jinja; "düşünme" kapalı). Olmazsa yerleşik şablon.
    std::vector<common_chat_msg> msgs;
    jsize n = env->GetArrayLength(jroles);
    for (jsize i = 0; i < n; i++) {
        common_chat_msg cm;
        auto r = (jstring) env->GetObjectArrayElement(jroles, i);
        auto c = (jstring) env->GetObjectArrayElement(jcontents, i);
        cm.role = jstr(env, r);
        cm.content = jstr_utf8(env, c);
        env->DeleteLocalRef(r);
        env->DeleteLocalRef(c);
        msgs.push_back(cm);
    }
    std::vector<std::pair<std::string, bool>> parts;  // metin, kullanıcı girdisi mi
    if (m->tmpls) {
        common_chat_templates_inputs in;
        in.messages = msgs;
        in.add_generation_prompt = true;
        in.enable_thinking = false;
        in.chat_template_kwargs["enable_thinking"] = "false";
        for (int jinja = 1; jinja >= 0 && parts.empty(); jinja--) {
            in.use_jinja = jinja == 1;
            try {
                common_chat_params p = common_chat_templates_apply(m->tmpls.get(), in);
                for (auto &pp : p.prompt.parts) parts.emplace_back(pp.text, pp.is_input);
            } catch (const std::exception &e) {
                LOGW("şablon (jinja=%d): %s", jinja, e.what());
            }
        }
    }
    if (parts.empty()) {
        // Son çare: düz metin
        std::string s;
        for (auto &cm : msgs) s += cm.role + ": " + cm.content + "\n";
        s += "assistant: ";
        parts.emplace_back(s, false);
    }

    // 2) Belirteçlere çevir (şablon kısımlarında özel belirteçler çözülür, kullanıcı metninde çözülmez)
    const llama_vocab *vocab = llama_model_get_vocab(m->model);
    std::vector<llama_token> toks;
    bool first = true;
    for (auto &pp : parts) {
        if (pp.first.empty()) continue;
        int need = -llama_tokenize(vocab, pp.first.c_str(), (int32_t) pp.first.size(), nullptr, 0, first, !pp.second);
        if (need <= 0) continue;
        size_t at = toks.size();
        toks.resize(at + need);
        int got = llama_tokenize(vocab, pp.first.c_str(), (int32_t) pp.first.size(), toks.data() + at, need, first, !pp.second);
        toks.resize(at + (got > 0 ? got : 0));
        first = false;
    }
    const int n_ctx = (int) llama_n_ctx(m->ctx);
    if ((int) toks.size() + 8 > n_ctx) {
        return fail("exceed_context_size: istem " + std::to_string(toks.size()) + " belirteç, bağlam " + std::to_string(n_ctx));
    }

    // 3) İstemi işle
    llama_memory_clear(llama_get_memory(m->ctx), true);
    auto t0 = std::chrono::steady_clock::now();
    const int nb = (int) llama_n_batch(m->ctx);
    for (size_t i = 0; i < toks.size(); i += nb) {
        int cnt = (int) std::min<size_t>(nb, toks.size() - i);
        int rc = llama_decode(m->ctx, llama_batch_get_one(toks.data() + i, cnt));
        if (rc == 2 || m->stop) {
            std::string s = "{\"tokens\":0,\"promptTokens\":" + std::to_string(toks.size()) + ",\"aborted\":true}";
            return env->NewStringUTF(s.c_str());
        }
        if (rc != 0) return fail("İstem işlenemedi (kod " + std::to_string(rc) + ")");
    }
    auto t1 = std::chrono::steady_clock::now();

    // 4) Örnekleyici: tekrar cezası → top-k → top-p → sıcaklık → zar
    llama_sampler *smpl = llama_sampler_chain_init(llama_sampler_chain_default_params());
    llama_sampler_chain_add(smpl, llama_sampler_init_penalties(llama_vocab_n_tokens(vocab), 64, repeat, 0.0f, 0.0f));
    if (top_k > 0) llama_sampler_chain_add(smpl, llama_sampler_init_top_k(top_k));
    llama_sampler_chain_add(smpl, llama_sampler_init_top_p(top_p, 1));
    if (temp <= 0.0f) {
        llama_sampler_chain_add(smpl, llama_sampler_init_greedy());
    } else {
        llama_sampler_chain_add(smpl, llama_sampler_init_temp(temp));
        llama_sampler_chain_add(smpl, llama_sampler_init_dist((uint32_t) std::random_device{}()));
    }

    // 5) Üret
    int produced = 0;
    bool aborted = false;
    std::string pending, err;
    int pos = (int) toks.size();
    char buf[256];
    while (produced < max_tokens) {
        if (m->stop) {
            aborted = true;
            break;
        }
        llama_token tok = llama_sampler_sample(smpl, m->ctx, -1);
        if (llama_vocab_is_eog(vocab, tok)) break;
        int len = llama_token_to_piece(vocab, tok, buf, sizeof buf, 0, false);
        if (len > 0) pending.append(buf, (size_t) len);
        produced++;
        size_t ok = utf8_complete_prefix(pending);
        if (ok > 0) {
            jbyteArray arr = env->NewByteArray((jsize) ok);
            env->SetByteArrayRegion(arr, 0, (jsize) ok, reinterpret_cast<const jbyte *>(pending.data()));
            jboolean go = env->CallBooleanMethod(akis, parca, arr);
            env->DeleteLocalRef(arr);
            pending.erase(0, ok);
            if (env->ExceptionCheck()) {
                env->ExceptionClear();
                go = JNI_FALSE;
            }
            if (!go) {
                aborted = true;
                break;
            }
        }
        if (pos + 1 >= n_ctx) break;  // bağlam doldu: burada kes
        int rc = llama_decode(m->ctx, llama_batch_get_one(&tok, 1));
        pos++;
        if (rc == 2) {
            aborted = true;
            break;
        }
        if (rc != 0) {
            err = "Üretim sırasında hata (kod " + std::to_string(rc) + ")";
            break;
        }
    }
    llama_sampler_free(smpl);
    auto t2 = std::chrono::steady_clock::now();
    double pms = std::chrono::duration<double, std::milli>(t1 - t0).count();
    double gms = std::chrono::duration<double, std::milli>(t2 - t1).count();
    std::string s = "{\"tokens\":" + std::to_string(produced) + ",\"promptTokens\":" + std::to_string(toks.size()) + ",\"promptMs\":" + std::to_string(pms) +
                    ",\"genMs\":" + std::to_string(gms) + ",\"aborted\":" + (aborted ? "true" : "false") + ",\"error\":\"" + json_escape(err) + "\"}";
    return env->NewStringUTF(s.c_str());
}

}  // extern "C"
