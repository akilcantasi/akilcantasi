#!/usr/bin/env python3
"""Fener tesisat testleri için minik bir GGUF modeli üretir.

Kullanım:
    pip install gguf numpy
    python3 tools/make_tiny_gguf.py testdata/tiny-test.gguf

Çıktı: rastgele ağırlıklı, ~1-3 MB'lık bir "llama" mimarili model. Kalite
önemsizdir (anlamsız Türkçe sözcükler üretir); amaç wllama/llama.cpp'nin
dosyayı yükleyip akış (stream) halinde token üretebildiğini doğrulamaktır.

Notlar:
- huggingface.co erişimi olmadığı ve torch/transformers + convert_hf_to_gguf.py
  zinciri yüzlerce MB bağımlılık gerektirdiği için GGUF doğrudan gguf-py'nin
  GGUFWriter'ı ile yazılır. Bu, convert_hf_to_gguf.py'nin sonunda yaptığı
  işin aynısıdır (aynı anahtar adları, aynı tensör adları).
- Sözlük SentencePiece ("llama") türündedir: özel tokenlar + 256 bayt tokenı
  (<0xNN>, bayt geri dönüşü için) + Türkçe harfler ve sözcükler. SPM birleştirme
  algoritması yalnızca sözlükte bulunan ara parçalar üzerinden ilerlediği için
  her sözcüğün tüm önekleri de sözlüğe eklenir.
- Sohbet şablonu ChatML'dir (<|im_start|>/<|im_end|>); wllama v3 Jinja ile işler.
- Tüm tensörler f32'dir (minik boyutta nicemleme gereksiz).
"""
import sys

import numpy as np
import gguf

OUT = sys.argv[1] if len(sys.argv) > 1 else "testdata/tiny-test.gguf"
SEED = 1234

HIDDEN = 128
LAYERS = 2
HEADS = 4
KV_HEADS = 4
FF = 256
CTX = 2048

TEXT = """
deprem sırasında çök kapan tutun. enkaz altındaysanız sakin kalın, borulara vurarak ses çıkarın.
kanama varsa temiz bir bezle yaraya doğrudan baskı uygulayın. suyu kaynatın ya da klor tableti kullanın.
artçı depremde binadan uzak durun, toplanma alanına gidin. yardım için 112 acil çağrı merkezini arayın.
fener akıl çantası rehber vikipedi kaynak bilmiyorum lütfen önce güvenli bir yere geçin ve bekleyin.
su yemek battaniye ilk yardım çantası el feneri düdük pil radyo ilaç belge nakit telefon şarj
"""

SPECIALS = ["<unk>", "<s>", "</s>", "<|im_start|>", "<|im_end|>"]

CHAT_TEMPLATE = (
    "{% for message in messages %}"
    "{{ '<|im_start|>' + message['role'] + '\\n' + message['content'] + '<|im_end|>' + '\\n' }}"
    "{% endfor %}"
    "{% if add_generation_prompt %}{{ '<|im_start|>assistant\\n' }}{% endif %}"
)


def build_vocab():
    tokens, scores, types = [], [], []

    def add(tok, score, typ):
        if tok in seen:
            return
        seen.add(tok)
        tokens.append(tok)
        scores.append(float(score))
        types.append(typ)

    seen = set()
    T = gguf.TokenType
    for s in SPECIALS:
        add(s, 0.0, T.UNKNOWN if s == "<unk>" else T.CONTROL)
    for b in range(256):
        add(f"<0x{b:02X}>", 0.0, T.BYTE)

    words = sorted(set(w for w in TEXT.replace(".", " . ").replace(",", " , ").split()))
    chars = sorted(set("".join(words)) | set("abcçdefgğhıijklmnoöprsştuüvyzABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789.,!?:-"))
    add("▁", -1.0, T.NORMAL)
    for c in chars:
        add(c, -2.0, T.NORMAL)
        add("▁" + c, -2.0, T.NORMAL)
    # Önekler: daha uzun parça = daha yüksek skor (önce birleşir)
    for w in words:
        for piece in (w, "▁" + w):
            for i in range(2, len(piece) + 1):
                add(piece[:i], -10.0 + i, T.NORMAL)
    return tokens, scores, types


def main():
    rng = np.random.default_rng(SEED)
    tokens, scores, types = build_vocab()
    n_vocab = len(tokens)
    head_dim = HIDDEN // HEADS

    w = gguf.GGUFWriter(OUT, "llama")
    w.add_name("akilcantasi-tiny-test")
    w.add_context_length(CTX)
    w.add_embedding_length(HIDDEN)
    w.add_block_count(LAYERS)
    w.add_feed_forward_length(FF)
    w.add_head_count(HEADS)
    w.add_head_count_kv(KV_HEADS)
    w.add_rope_dimension_count(head_dim)
    w.add_rope_freq_base(10000.0)
    w.add_layer_norm_rms_eps(1e-5)
    w.add_vocab_size(n_vocab)
    w.add_file_type(gguf.LlamaFileType.ALL_F32)

    w.add_tokenizer_model("llama")
    w.add_tokenizer_pre("default")
    w.add_token_list(tokens)
    w.add_token_scores(scores)
    w.add_token_types(types)
    w.add_unk_token_id(0)
    w.add_bos_token_id(1)
    w.add_eos_token_id(4)  # <|im_end|> = sohbet turu sonu
    w.add_add_bos_token(True)
    w.add_add_eos_token(False)
    w.add_chat_template(CHAT_TEMPLATE)

    def t(name, *shape, scale=0.08):
        w.add_tensor(name, (rng.standard_normal(shape) * scale).astype(np.float32))

    def ones(name, n):
        w.add_tensor(name, np.ones((n,), dtype=np.float32))

    t("token_embd.weight", n_vocab, HIDDEN, scale=0.5)
    for i in range(LAYERS):
        p = f"blk.{i}."
        ones(p + "attn_norm.weight", HIDDEN)
        t(p + "attn_q.weight", HIDDEN, HIDDEN)
        t(p + "attn_k.weight", KV_HEADS * head_dim, HIDDEN)
        t(p + "attn_v.weight", KV_HEADS * head_dim, HIDDEN)
        t(p + "attn_output.weight", HIDDEN, HIDDEN)
        ones(p + "ffn_norm.weight", HIDDEN)
        t(p + "ffn_gate.weight", FF, HIDDEN)
        t(p + "ffn_up.weight", FF, HIDDEN)
        t(p + "ffn_down.weight", HIDDEN, FF)
    ones("output_norm.weight", HIDDEN)
    out = rng.standard_normal((n_vocab, HIDDEN)).astype(np.float32) * 0.5
    # Özel/bayt tokenlarının olasılığını düşür: çıktı okunur sözcüklerden oluşsun
    # ve model hemen <|im_end|> üretip susmasın.
    out[: len(SPECIALS) + 256] *= 0.0
    w.add_tensor("output.weight", out)

    w.write_header_to_file()
    w.write_kv_data_to_file()
    w.write_tensors_to_file()
    w.close()
    print(f"yazıldı: {OUT} (sözlük {n_vocab} token)")


if __name__ == "__main__":
    main()
