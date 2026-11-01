#!/usr/bin/env python3
"""Akıl Çantası — örnek test ZIM arşivleri üretir.

Çıktılar (testdata/):
  sample_tr.zim        python-libzim ile (yeni ad alanı 'C', zstd sıkıştırma)
  sample_xz_oldns.zim  bu betikteki küçük saf-Python yazıcı ile (eski ad alanları
                       A/I/M, ZIM v5.0, xz sıkıştırma + 64 bit ofsetli "extended"
                       küme). python-libzim artık xz yazamadığı için okuyucunun
                       xz ve eski ad alanı desteğini test etmekte kullanılır.

  sample_med_en.zim    python-libzim ile, Xapian başlık + tam metin dizinli küçük
                       İngilizce tıbbi arşiv (WikiMed benzeri). Çoklu kaynak ve
                       saf-TS Xapian okuyucusunun testleri için.

Kullanım:  pip install libzim && python3 tools/make_sample_zim.py [all|tr|xz|med]
İçerik yalnızca test amaçlı, kısa ve genel ansiklopedik metinlerdir.
"""
import hashlib
import lzma
import os
import struct
import sys
import zlib

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(ROOT, "testdata")

# ---------------------------------------------------------------------------
# İçerik
# ---------------------------------------------------------------------------

ARTICLES = [
    ("Deprem", "Deprem", """
<p><b>Deprem</b>, yer kabuğunda biriken gerilimin aniden boşalmasıyla oluşan ve
dalgalar hâlinde yayılarak yeryüzünü sarsan doğa olayıdır. Depremlerin büyük
çoğunluğu levha sınırlarındaki <a href="Kuzey_Anadolu_Fay_Hattı">fay hatları</a>
boyunca meydana gelir.</p>
<figure><img src="img/deprem_diyagram.png" alt="Sismik dalga şeması" width="64" height="64"/>
<figcaption>Sismik dalgaların basit şeması</figcaption></figure>
<h2>Büyüklük ve şiddet</h2>
<p>Depremin büyüklüğü (magnitüd) açığa çıkan enerjiyi, şiddeti ise belirli bir
noktada hissedilen sarsıntının etkisini ifade eder. Günümüzde büyüklük çoğunlukla
moment büyüklüğü ölçeğiyle verilir.<sup class="reference"><a href="#cite_note-1">[1]</a></sup></p>
<h2>Deprem sırasında</h2>
<p>Sarsıntı sırasında "çök, kapan, tutun" hareketi önerilir. Deprem sonrasında
binalar terk edilerek önceden belirlenmiş <a href="Toplanma_alanı">toplanma alanlarına</a>
gidilmelidir. Kıyı bölgelerinde güçlü bir sarsıntının ardından
<a href="Tsunami">tsunami</a> riski göz önünde bulundurulmalıdır.</p>
<script>alert('kötü');</script>
<h2>Kaynakça</h2>
<ol class="references"><li id="cite_note-1">Örnek kaynak.</li></ol>
"""),
    ("Kuzey_Anadolu_Fay_Hattı", "Kuzey Anadolu Fay Hattı", """
<p><b>Kuzey Anadolu Fay Hattı</b> (KAF), Türkiye'nin kuzeyinde doğu-batı
doğrultusunda yaklaşık 1500 km uzanan, sağ yönlü doğrultu atımlı bir faydır.
Anadolu levhası ile Avrasya levhası arasındaki sınırın önemli bir bölümünü oluşturur.</p>
<p>Fay hattı boyunca 20. yüzyılda çok sayıda büyük <a href="Deprem">deprem</a>
meydana gelmiştir. Batı ucu Marmara Denizi altında kollara ayrılır; ana kol
<a href="Ankara">Ankara</a>'nın kuzeyinden geçer.</p>
"""),
    ("Hipotermi", "Hipotermi", """
<p><b>Hipotermi</b>, vücut iç sıcaklığının 35 °C'nin altına düşmesidir. Soğuk
ve ıslak ortamda uzun süre kalmak, rüzgâr ve yetersiz giysi başlıca nedenlerdir.</p>
<h2>Belirtiler</h2>
<ul><li>Titreme</li><li>Konuşma bozukluğu ve bilinç bulanıklığı</li><li>Koordinasyon kaybı</li></ul>
<h2>İlk yardım</h2>
<p>Kişi soğuktan korunaklı bir yere alınmalı, ıslak giysiler çıkarılmalı ve vücut
battaniye ile yavaşça ısıtılmalıdır. Bilinç kaybı varsa <a href="Temel_yaşam_desteği">temel yaşam desteği</a>
gerekebilir. Ayrıca bakınız: <a href="Çadır">çadır</a>.</p>
"""),
    ("Su_arıtma", "Su arıtma", """
<p><b>Su arıtma</b>, suyun içme ve kullanma amacına uygun hâle getirilmesi için
uygulanan işlemlerin bütünüdür. Afet durumlarında en basit yöntem suyu en az bir
dakika kaynatmaktır.</p>
<p>Kaynatma mümkün değilse uygun dozda klor tableti ya da kokusuz çamaşır suyu
kullanılabilir. Bulanık su önce temiz bir bezden süzülmelidir.</p>
"""),
    ("Temel_yaşam_desteği", "Temel yaşam desteği", """
<p><b>Temel yaşam desteği</b>, solunumu ya da dolaşımı durmuş bir kişide hiçbir
araç kullanmadan yapılan göğüs basısı ve suni solunum uygulamalarını kapsar.</p>
<p>Yetişkinlerde göğüs basısı dakikada 100–120 hızında ve yaklaşık 5–6 cm
derinlikte yapılır. Profesyonel yardım gelene kadar uygulamaya devam edilir.
Ağır <a href="Kanama">kanama</a> varsa önce kanama kontrol altına alınmalıdır.</p>
"""),
    ("Kanama", "Kanama", """
<p><b>Kanama</b>, damar bütünlüğünün bozulması sonucu kanın damar dışına
çıkmasıdır. Dış kanamalarda ilk yapılacak işlem yara üzerine temiz bir bezle
doğrudan baskı uygulamaktır.</p>
<p>Uzuvlardaki hayatı tehdit eden kanamalarda turnike son çare olarak
kullanılabilir. Turnikenin uygulandığı saat not edilmelidir.</p>
"""),
    ("Yanık", "Yanık", """
<p><b>Yanık</b>, ısı, kimyasal madde, elektrik ya da radyasyon nedeniyle doku
hasarıdır. Derinliğine göre birinci, ikinci ve üçüncü derece olarak sınıflandırılır.</p>
<p>İlk yardımda yanan bölge 10–20 dakika boyunca ılık akan suyla soğutulur; buz
uygulanmaz, su kabarcıkları patlatılmaz. Ayrıca bakınız: <a href="Yangın">Yangın</a>.</p>
"""),
    ("Çadır", "Çadır", """
<p><b>Çadır</b>, kumaş ya da benzeri esnek bir örtünün direkler ve iplerle
gerilmesiyle kurulan taşınabilir barınaktır. Afetlerden sonra geçici barınma
için yaygın olarak kullanılır.</p>
<p>Çadır kurulacak yer düz, su baskınına ve <a href="Heyelan">heyelana</a> açık
olmayan bir alan olmalıdır. Soğuk havada zemin yalıtımı <a href="Hipotermi">hipotermiyi</a>
önlemede önemlidir.</p>
"""),
    ("Toplanma_alanı", "Toplanma alanı", """
<p><b>Toplanma alanı</b>, afet ve acil durumlarda halkın güvenli bir şekilde
bir araya gelmesi için önceden belirlenen açık alandır. Türkiye'de bu alanlar
AFAD ve belediyeler tarafından belirlenir ve tabelalarla işaretlenir.</p>
<p>Toplanma alanları bina, elektrik hattı ve ağaç gibi düşebilecek nesnelerden
uzak, kolay ulaşılabilir yerler olarak seçilir.</p>
"""),
    ("Ankara", "Ankara", """
<p><b>Ankara</b>, Türkiye'nin başkenti ve İç Anadolu Bölgesi'nde yer alan aynı adlı
ilin merkezidir. İlçeleri arasında <a href="Çankaya">Çankaya</a> bulunur.</p>
<p>Kent, <a href="Kuzey_Anadolu_Fay_Hattı">Kuzey Anadolu Fay Hattı</a>'na görece
uzak olsa da çevresindeki faylar nedeniyle deprem hazırlığı önemini korur.</p>
"""),
    ("Çankaya", "Çankaya", """
<p><b>Çankaya</b>, <a href="Ankara">Ankara</a> iline bağlı, kentin merkezinde
yer alan bir ilçedir. Örnek Mahallesi gibi merkezi semtleri gün içinde kalabalıklaşır.</p>
<p>İlçe, kamu binaları ve yoğun yerleşimiyle bilinir. Yapı yoğunluğu nedeniyle deprem
sonrası <a href="Toplanma_alanı">toplanma alanları</a> afet planlarında dikkate alınır.</p>
"""),
    ("Tsunami", "Tsunami", """
<p><b>Tsunami</b>, genellikle deniz tabanındaki depremler, heyelanlar ya da
volkanik patlamalar sonucu oluşan, çok uzun dalga boylu deniz dalgalarıdır.</p>
<p>Kıyıda güçlü bir sarsıntı hissedildiğinde ya da deniz aniden çekildiğinde
hemen yüksek yerlere çıkılmalıdır.</p>
"""),
    ("Sel", "Sel", """
<p><b>Sel</b>, aşırı yağış ya da kar erimesi sonucu akarsuların taşarak çevresini
su altında bırakmasıdır. Ani seller birkaç dakika içinde gelişebilir.</p>
<p>Sel sırasında akan suya girilmemeli, araçla geçilmemeli ve yüksek yerlere
çıkılmalıdır. Sel sonrası içme suyu <a href="Su_arıtma">arıtılmadan</a> kullanılmamalıdır.</p>
"""),
    ("Heyelan", "Heyelan", """
<p><b>Heyelan</b>, toprak ya da kaya kütlesinin yer çekimi etkisiyle yamaç aşağı
kaymasıdır. Yoğun yağış, <a href="Deprem">deprem</a> ve yamaç kazıları heyelanı tetikleyebilir.</p>
<p>Yamaçlardaki çatlaklar, eğilen ağaç ve direkler heyelan belirtisi olabilir.</p>
"""),
    ("Yangın", "Yangın", """
<p><b>Yangın</b>, kontrol dışı gelişen ve can ile mal kaybına yol açabilen yanma
olayıdır. Yanma için yakıt, oksijen ve ısıdan oluşan yangın üçgeni gereklidir.</p>
<p>Küçük yangınlar uygun yangın söndürücüyle söndürülebilir. Dumanlı ortamda
yere yakın hareket edilmelidir. Bkz. <a href="Yanık">Yanık</a>.</p>
"""),
    ("Isı_çarpması", "Isı çarpması", """
<p><b>Isı çarpması</b>, vücudun aşırı sıcakta ısısını düzenleyememesi sonucu
iç sıcaklığın 40 °C'nin üzerine çıkmasıdır. Acil tıbbi durumdur.</p>
<p>Kişi serin bir yere alınmalı, vücudu ıslak bezlerle soğutulmalıdır.</p>
"""),
]

REDIRECTS = [
    # (yol, başlık, hedef)
    ("Zelzele", "Zelzele", "Deprem"),
    ("KAF", "KAF", "Kuzey_Anadolu_Fay_Hattı"),
]

IMAGE_PATH = "img/deprem_diyagram.png"


def make_png(w=64, h=64):
    """Basit bir PNG: koyu zemin üzerinde turuncu sinüs dalgası."""
    import math

    rows = []
    for y in range(h):
        row = bytearray([0])  # filtre: yok
        for x in range(w):
            wave = h / 2 + math.sin(x / w * 4 * math.pi) * (h / 4)
            if abs(y - wave) < 2.5:
                row += bytes([245, 165, 36])
            elif y == h // 2:
                row += bytes([80, 90, 100])
            else:
                row += bytes([22, 27, 34])
        rows.append(bytes(row))
    raw = b"".join(rows)

    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)

    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")


def page(title, body):
    return (
        '<!DOCTYPE html><html><head><meta charset="utf-8"><title>%s</title>'
        '<link rel="stylesheet" href="-/style.css"></head>'
        '<body onload="x()"><h1>%s</h1>%s</body></html>' % (title, title, body.strip())
    )


METADATA = {
    "Name": "akilcantasi_ornek_tr",
    "Title": "Örnek Vikipedi",
    "Creator": "Akıl Çantası",
    "Publisher": "Akıl Çantası",
    "Date": "2026-11-01",
    "Description": "Örnek test arşivi",
    "Language": "tur",
}


# ---------------------------------------------------------------------------
# 3) python-libzim, İngilizce tıbbi örnek (Xapian dizinli)
# ---------------------------------------------------------------------------
# Kısa, genel tanımlar; yalnızca test amaçlıdır (tedavi rehberi değildir).
# Sayısal eşikler: hipotermi < 35 °C, sıcak çarpması > 40 °C (WHO / MedlinePlus
# tanımlarıyla uyumlu; Türkçe örnekteki maddelerle aynı).

MED_ARTICLES = [
    ("Bleeding", "Bleeding", """
<p><b>Bleeding</b>, also called haemorrhage, is the loss of blood from the circulatory system.
External bleeding is usually controlled by applying firm, direct pressure to the wound.</p>
<h2>First aid</h2>
<p>Press on the wound with a clean cloth and keep the pressure. A <a href="Tourniquet">tourniquet</a>
may be used for life-threatening bleeding from a limb. Watch for signs of <a href="Shock_(circulatory)">shock</a>.</p>
"""),
    ("Burn", "Burn", """
<p>A <b>burn</b> is an injury to skin or other tissue caused by heat, cold, electricity,
chemicals, friction or radiation. Burns are classified by depth as superficial, partial-thickness
or full-thickness.</p>
<p>Cooling a burn with clean running water as soon as possible reduces tissue damage.
Blisters should not be popped.</p>
"""),
    ("Hypothermia", "Hypothermia", """
<p><b>Hypothermia</b> is a core body temperature below 35 °C. Symptoms include shivering,
confusion and drowsiness. Wet clothing and wind increase heat loss.</p>
<p>A person with hypothermia should be moved to a warm, dry place and rewarmed gradually.</p>
"""),
    ("Heat_stroke", "Heat stroke", """
<p><b>Heat stroke</b> is a severe heat illness with a core body temperature above 40 °C and
confusion. It is a medical emergency. Related conditions include <a href="Dehydration">dehydration</a>.</p>
"""),
    ("Cardiopulmonary_resuscitation", "Cardiopulmonary resuscitation", """
<p><b>Cardiopulmonary resuscitation</b> (CPR) is an emergency procedure of chest compressions,
often combined with artificial ventilation, used for people in cardiac arrest.</p>
"""),
    ("Bone_fracture", "Bone fracture", """
<p>A <b>bone fracture</b> is a break in the continuity of a bone. Typical signs are pain,
swelling and deformity. A suspected fracture should be immobilised with a splint.</p>
"""),
    ("Dehydration", "Dehydration", """
<p><b>Dehydration</b> is a deficit of total body water. It may be caused by
<a href="Diarrhea">diarrhea</a>, vomiting, heat or not drinking enough. Oral rehydration solution
is used to treat mild to moderate dehydration.</p>
"""),
    ("Diarrhea", "Diarrhea", """
<p><b>Diarrhea</b> is the condition of having loose or liquid bowel movements several times a day.
The main danger is <a href="Dehydration">dehydration</a>. Contaminated drinking water is a common cause.</p>
"""),
    ("Shock_(circulatory)", "Shock (circulatory)", """
<p><b>Circulatory shock</b> is a life-threatening condition of low blood perfusion to tissues.
Causes include severe <a href="Bleeding">bleeding</a>, dehydration and severe allergic reactions.</p>
"""),
    ("Tourniquet", "Tourniquet", """
<p>A <b>tourniquet</b> is a device that applies pressure to a limb to stop arterial blood flow.
The time it was applied should be noted.</p>
"""),
    ("Snakebite", "Snakebite", """
<p>A <b>snakebite</b> is an injury caused by the bite of a snake. The bitten limb should be kept
still and the person taken to medical care quickly.</p>
"""),
    ("Fever", "Fever", """
<p><b>Fever</b> is a body temperature above the normal range due to an increase in the body's
temperature set point. It is commonly a sign of infection.</p>
"""),
]

MED_REDIRECTS = [
    ("Haemorrhage", "Haemorrhage", "Bleeding"),
    ("CPR", "CPR", "Cardiopulmonary_resuscitation"),
]

MED_METADATA = {
    "Name": "mdwiki_en_sample",
    "Title": "WikiMed örnek",
    "Creator": "Akıl Çantası",
    "Publisher": "Akıl Çantası",
    "Date": "2026-11-01",
    "Description": "Sample medical test archive",
    "Language": "eng",
}


# ---------------------------------------------------------------------------
# 1) python-libzim (yeni ad alanı, zstd)
# ---------------------------------------------------------------------------

def build_libzim(path, articles=None, redirects=None, metadata=None, main="Deprem", index_lang=None, image=True):
    articles = ARTICLES if articles is None else articles
    redirects = REDIRECTS if redirects is None else redirects
    metadata = METADATA if metadata is None else metadata
    from libzim.writer import Creator, Item, StringProvider, Hint, Compression

    class HtmlItem(Item):
        def __init__(self, p, t, html, mime="text/html", front=True):
            super().__init__()
            self.p, self.t, self.html, self.mime, self.front = p, t, html, mime, front

        def get_path(self):
            return self.p

        def get_title(self):
            return self.t

        def get_mimetype(self):
            return self.mime

        def get_contentprovider(self):
            return StringProvider(self.html)

        def get_hints(self):
            return {Hint.FRONT_ARTICLE: self.front}

    if os.path.exists(path):
        os.remove(path)
    creator = Creator(path).config_indexing(bool(index_lang), index_lang or "tur").config_compression(Compression.zstd)
    with creator as c:
        c.set_mainpath(main)
        for k, v in metadata.items():
            c.add_metadata(k, v)
        for p, t, body in articles:
            c.add_item(HtmlItem(p, t, page(t, body)))
        if image:
            c.add_item(HtmlItem(IMAGE_PATH, "", make_png(), mime="image/png", front=False))
        c.add_item(HtmlItem("-/style.css", "", "body{font-family:serif}", mime="text/css", front=False))
        for p, t, target in redirects:
            c.add_redirection(p, t, target, {Hint.FRONT_ARTICLE: True})
    print("yazıldı:", path, os.path.getsize(path), "bayt")


# ---------------------------------------------------------------------------
# 2) Saf-Python mini yazıcı (eski ad alanı, ZIM 5.0, xz + extended küme)
# ---------------------------------------------------------------------------

def build_oldns_xz(path):
    # Eski düzende makaleler A/, görseller I/, stil -/, üstveri M/ ad alanında.
    # Makale içi bağlantılar aynı ad alanında göreli; görseller "../I/..".
    def oldify(body):
        return body.replace('src="img/', 'src="../I/')

    entries = []  # dict(ns, url, title, mime|None, data|None, redirect|None, cluster)
    mimes = ["text/html", "image/png", "text/plain", "text/css"]
    for k, v in METADATA.items():
        entries.append(dict(ns="M", url=k, title="", mime="text/plain", data=v.encode(), cl=0))
    for p, t, body in ARTICLES:
        entries.append(dict(ns="A", url=p, title=t, mime="text/html", data=page(t, oldify(body)).encode(), cl=0))
    # Görsel ve CSS: sıkıştırılmamış, 64 bit ofsetli (extended) kümeye
    entries.append(dict(ns="I", url="deprem_diyagram.png", title="", mime="image/png", data=make_png(), cl=1))
    entries.append(dict(ns="-", url="style.css", title="", mime="text/css", data=b"body{}", cl=1))
    for p, t, target in REDIRECTS:
        entries.append(dict(ns="A", url=p, title=t, mime=None, data=None, redirect=("A", target)))

    entries.sort(key=lambda e: (e["ns"] + "/" + e["url"]).encode())
    index_of = {(e["ns"], e["url"]): i for i, e in enumerate(entries)}

    # Kümeleri oluştur
    blobs = {0: [], 1: []}
    for e in entries:
        if e["data"] is not None:
            e["blob"] = len(blobs[e["cl"]])
            blobs[e["cl"]].append(e["data"])

    def cluster_payload(items, osz):
        n = len(items)
        offs = []
        pos = (n + 1) * osz
        for b in items:
            offs.append(pos)
            pos += len(b)
        offs.append(pos)
        fmt = "<Q" if osz == 8 else "<I"
        return b"".join(struct.pack(fmt, o) for o in offs) + b"".join(items)

    c0 = bytes([4]) + lzma.compress(cluster_payload(blobs[0], 4), format=lzma.FORMAT_XZ, check=lzma.CHECK_CRC32)
    c1 = bytes([0x10 | 1]) + cluster_payload(blobs[1], 8)
    clusters = [c0, c1]

    def dirent(e):
        name = e["url"].encode() + b"\0" + (e["title"].encode() if e["title"] != e["url"] else b"") + b"\0"
        if e["mime"] is None:
            tns, turl = e["redirect"]
            return struct.pack("<HBcI", 0xFFFF, 0, b"A", 0) + struct.pack("<I", index_of[(tns, turl)]) + name
        return (
            struct.pack("<HBcI", mimes.index(e["mime"]), 0, e["ns"].encode(), 0)
            + struct.pack("<II", e["cl"], e["blob"])
            + name
        )

    HEADER = 80
    mime_bytes = b"".join(m.encode() + b"\0" for m in mimes) + b"\0"
    mime_pos = HEADER
    dir_bytes = [dirent(e) for e in entries]
    url_ptr_pos = mime_pos + len(mime_bytes)
    title_ptr_pos = url_ptr_pos + 8 * len(entries)
    dirents_pos = title_ptr_pos + 4 * len(entries)
    pos = dirents_pos
    url_ptrs = []
    for d in dir_bytes:
        url_ptrs.append(pos)
        pos += len(d)
    cluster_ptr_pos = pos
    pos += 8 * len(clusters)
    cluster_ptrs = []
    for c in clusters:
        cluster_ptrs.append(pos)
        pos += len(c)
    checksum_pos = pos

    def tkey(i):
        e = entries[i]
        return (e["ns"] + "/" + (e["title"] or e["url"])).encode()

    title_order = sorted(range(len(entries)), key=tkey)
    main = index_of[("A", "Deprem")]
    header = struct.pack(
        "<IHH16sIIQQQQIIQ",
        72173914, 5, 0, b"akilcantasi-xz!!",
        len(entries), len(clusters),
        url_ptr_pos, title_ptr_pos, cluster_ptr_pos, mime_pos,
        main, 0xFFFFFFFF, checksum_pos,
    )
    assert len(header) == HEADER
    body = (
        header + mime_bytes
        + b"".join(struct.pack("<Q", p) for p in url_ptrs)
        + b"".join(struct.pack("<I", i) for i in title_order)
        + b"".join(dir_bytes)
        + b"".join(struct.pack("<Q", p) for p in cluster_ptrs)
        + b"".join(clusters)
    )
    assert len(body) == checksum_pos
    body += hashlib.md5(body).digest()
    with open(path, "wb") as f:
        f.write(body)
    print("yazıldı:", path, len(body), "bayt")


if __name__ == "__main__":
    os.makedirs(OUT_DIR, exist_ok=True)
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("all", "tr"):
        build_libzim(os.path.join(OUT_DIR, "sample_tr.zim"))
    if what in ("all", "xz"):
        build_oldns_xz(os.path.join(OUT_DIR, "sample_xz_oldns.zim"))
    if what in ("all", "med"):
        build_libzim(os.path.join(OUT_DIR, "sample_med_en.zim"), MED_ARTICLES, MED_REDIRECTS, MED_METADATA,
                     main="Bleeding", index_lang="eng", image=False)
    # Doğrulama: libzim ile geri oku
    try:
        from libzim.reader import Archive

        for n in ("sample_tr.zim", "sample_xz_oldns.zim", "sample_med_en.zim"):
            if not os.path.exists(os.path.join(OUT_DIR, n)):
                continue
            a = Archive(os.path.join(OUT_DIR, n))
            print(n, "entry_count", a.entry_count, "all", a.all_entry_count, "main", a.main_entry.path,
                  "checksum", a.check())
    except Exception as ex:  # noqa
        print("doğrulama atlandı:", ex, file=sys.stderr)
