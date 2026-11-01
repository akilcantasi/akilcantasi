// Rehber kategorisi: Hazırlık ve iletişim
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "hazirlik",
  "title": "Hazırlık ve iletişim",
  "hint": "Afet çantası, buluşma planı",
  "art": "cat-hazirlik",
  "color": "#3ecf8e",
  "order": 11
};

export const GUIDES: Guide[] = [
  {
    "id": "afet-cantasi",
    "title": "Afet çantası hazırlığı",
    "tag": "HAZIRLIK",
    "summary": "İlk 72 saat yetecek su, yiyecek, ilaç, ışık ve belgeleri kapının yakınındaki bir sırt çantasında hazır tutun.",
    "steps": [
      "Bir sırt çantası hazırlayın. Kapıya yakın, evdeki herkesin bildiği bir yerde tutun.",
      "Su ve yiyecek koyun: kişi başı günde yaklaşık 4 litre hesabıyla en az 3 gün yetecek kapalı şişe su; konserve, kuru meyve, bisküvi, tahin-pekmez gibi bozulmayan gıdalar ve konserve açacağı.",
      "Düzenli kullandığınız ilaçları, reçete fotokopisini ve yedek gözlüğü koyun.",
      "Küçük bir ilk yardım çantası ekleyin.",
      "Işık ve haber için el feneri, pilli radyo, yedek pil, dolu powerbank ve şarj kablosu koyun.",
      "Korunma için düdük, toz maskesi, iş eldiveni, çakı, küçük makas, yağmurluk ve battaniye ya da uyku tulumu ekleyin.",
      "Hijyen için sabun, dezenfektan, ıslak mendil, diş fırçası ve macun, hijyenik ped, tuvalet kâğıdı ve çöp poşeti koyun.",
      "Kimlik, tapu, DASK ve sigorta poliçesi fotokopilerini su geçirmez poşete koyun. Kâğıt, kalem ve biraz nakit para ekleyin.",
      "Mevsime uygun yedek kıyafet, iç çamaşırı, çorap ve sağlam ayakkabı koyun. Bebek, yaşlı, engelli ve evcil hayvan ihtiyaçlarını unutmayın.",
      "Çantayı 6 ayda bir açın. Tarihi geçen su, gıda ve ilaçları, biten pilleri yenileyin."
    ],
    "dont": [
      "Çantayı taşıyamayacağınız kadar ağır yapmayın.",
      "Çantayı bodrum, depo gibi ulaşması zor yerlerde saklamayın.",
      "İlaç ve gıdaları koyup unutmayın; son kullanma tarihlerini düzenli kontrol edin."
    ],
    "keywords": [
      "afet çantası",
      "deprem çantası",
      "acil durum çantası",
      "acil çanta",
      "deprem çantasında ne olmalı",
      "çantaya ne koymalı",
      "afet çantası listesi",
      "deprem çantası listesi",
      "kaçış çantası",
      "72 saat",
      "erzak",
      "deprem cantasi",
      "afet cantasi"
    ],
    "sources": [
      "AFAD — Afet ve Acil Durum Çantası",
      "AFAD — Aile Afet Planı ve 72 saat çantası duyurusu",
      "Ready.gov — Build a Kit",
      "Amerikan Kızılhaçı — Survival Kit Supplies"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD afet ve acil durum çantası listesi (haber alıntıları: İstiklal, DonanımHaber — ilk 72 saat, her aile üyesine yetecek su, konserve/kuru meyve/tahin-pekmez, kimlik-tapu-sigorta-ruhsat ve Zorunlu Deprem Poliçesi fotokopileri, iç çamaşırı, çorap, yağmurluk, ilk yardım çantası, hijyen malzemesi, uyku tulumu/battaniye, çakı, düdük, makas, kâğıt-kalem, pilli radyo, fener, yedek pil; çanta iş yeri ve okulda da olmalı). Değişiklik yok; AFAD su miktarı vermiyor, 4 L/gün Ready.gov'dan. Önceki tur: Ready.gov Build a Kit (kişi başı günde 1 galon su, düdük, toz maskesi, fener, radyo, konserve açacağı), Amerikan Kızılhaçı Survival Kit (3 günlük tahliye stoku, belge kopyaları, nakit, battaniye). AFAD sayfası açılamadı."
    },
    "art": [
      "hazirlik-canta-kapi",
      "hazirlik-canta-su-gida",
      null,
      "first-aid-kit",
      null,
      "hazirlik-canta-koruma",
      null,
      "hazirlik-belge-posette",
      null,
      "hazirlik-tarih-kontrol"
    ]
  },
  {
    "id": "iletisim",
    "title": "Afette iletişim: telefon ve şebeke",
    "tag": "İLETİŞİM",
    "summary": "Hayati durum yoksa aramayın, kısa mesaj gönderin; hayati tehlikede 112'yi arayın.",
    "steps": [
      "Hayati bir durum yoksa telefonla aramayın. Kısa mesaj (SMS) ya da internetli mesajlaşma uygulaması kullanın.",
      "Ailenize kısa bir mesaj atın: \"İyiyim, şu an … yerindeyim.\"",
      "Hayati tehlikede 112'yi arayın. Ambulans, itfaiye, polis ve jandarma için 112 yeterlidir.",
      "Kendi şebekeniz çekmese ya da kontörünüz bitse bile 112'yi deneyin. Telefon başka bir operatörün şebekesinden bağlanabilir.",
      "112'ye sakin konuşun: ne oldu, kaç kişi yaralı, durumları nasıl, tam adres. Görevli bitti demeden kapatmayın.",
      "Konuşmanız gerekirse kısa tutun. Hatları acil çağrılara bırakın.",
      "Pili koruyun: ekran parlaklığını kısın, düşük güç modunu açın, gereksiz uygulamaları kapatın.",
      "Enkaz altındaysanız ya da kaybolduysanız bağırmak yerine düdük çalın. Kısa düdükleri aralıklarla tekrarlayın.",
      "Şebeke yoksa pilli radyodan resmi duyuruları dinleyin. Yalnızca AFAD, valilik ve Kızılay gibi resmi kaynaklara güvenin."
    ],
    "dont": [
      "Doğrulanmamış haberleri ve yardım çağrılarını kontrol etmeden paylaşmayın.",
      "112'yi acil olmayan işler, telefon denemesi ya da şaka için aramayın; gerçek çağrıları geciktirir.",
      "Telefonunuzu oyun ve video için kullanıp pilini bitirmeyin."
    ],
    "keywords": [
      "afette iletişim",
      "iletişim",
      "şebeke yok",
      "telefon çekmiyor",
      "hat yok",
      "hatlar meşgul",
      "sms",
      "kısa mesaj",
      "112 nasıl aranır",
      "112 aranmıyor",
      "112 ye ne söylenir",
      "telefon şarjı bitiyor",
      "internet yok",
      "haberleşme",
      "sebeke yok",
      "telefon cekmiyor"
    ],
    "sources": [
      "AFAD — Deprem sonrası haberleşme duyurusu (SMS ve mesajlaşma)",
      "İçişleri Bakanlığı — 112 Acil Çağrı Merkezleri",
      "MEB — Genel İlk Yardım Bilgileri (112'ye bilgi verme)",
      "Ready.gov — Earthquakes (mesaj atma, bağırmak yerine düdük)",
      "Amerikan Kızılhaçı — Make a Plan (arama yerine mesaj)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Ready.gov Earthquakes (mesaj, bağırmak yerine düdük), Amerikan Kızılhaçı Make a Plan (hatlar yoğunken mesaj), Wikipedia 112 (Türkiye'de 112 tüm acil durumlar). 112.gov.tr ve AFAD açılamadı."
    },
    "art": [
      "sms-send",
      null,
      "call-112",
      "hazirlik-112-baska-sebeke",
      null,
      null,
      "hazirlik-pil-tasarruf",
      "whistle-signal",
      "battery-radio"
    ]
  },
  {
    "id": "hazirlik-ev-sabitleme",
    "title": "Evde eşyaları depreme karşı sabitleme",
    "tag": "HAZIRLIK",
    "summary": "Devrilebilecek dolapları duvara sabitleyin, ağır eşyaları alta indirin, yatakları dolap ve pencereden uzaklaştırın.",
    "steps": [
      "Devrilebilecek dolap, kitaplık ve gardırobu L demir ya da kayışla sağlam duvara sabitleyin.",
      "Yatak, koltuk ve bebek karyolasını pencereden ve devrilebilecek dolaplardan uzağa koyun.",
      "Yatağın üstüne raf, ağır tablo ya da ayna asmayın.",
      "Ağır ve kırılacak eşyaları alt raflara koyun. Rafların önüne bant ya da tel gerin.",
      "Mutfak dolaplarının kapaklarına emniyet mandalı ya da kilit takın.",
      "Televizyonu, bilgisayarı ve tezgâh üstü cihazları kayışla ya da kaydırmaz pedle sabitleyin.",
      "Avize, ayna ve tabloları kapalı kancayla asın. Şofben ve kombinin duvara sağlam bağlı olduğunu kontrol ettirin.",
      "Yanıcı ve zehirli maddeleri kırılmayacak kaplarda, etiketli olarak alt rafta saklayın.",
      "Kapı önlerini, koridoru ve merdiveni boş tutun. Kaçış yolu kapanmasın.",
      "Doğalgaz şirketine ya da yetkili ustaya deprem anında gazı ve elektriği kendiliğinden kesen vana ve sigorta taktırın."
    ],
    "dont": [
      "Dolabı alçıpan ya da ince bölme duvara vidalayıp güvende sanmayın; sağlam duvara ya da taşıyıcıya dübelleyin.",
      "Dolapların üstüne ağır kutu, valiz ya da cam eşya koymayın.",
      "Yatağı pencerenin altına ya da yüksek dolabın yanına koymayın."
    ],
    "keywords": [
      "eşya sabitleme",
      "dolap sabitleme",
      "dolabı duvara sabitleme",
      "mobilya sabitleme",
      "kitaplık sabitleme",
      "l demir",
      "dolap devrilmesin",
      "deprem öncesi ev hazırlığı",
      "evi depreme hazırlama",
      "yapısal olmayan tehlike",
      "yatak nereye konmalı",
      "esya sabitleme",
      "dolap sabitleme nasil"
    ],
    "sources": [
      "AFAD — Deprem öncesi alınacak önlemler",
      "Earthquake Country Alliance — Secure Your Space",
      "Ready.gov — Earthquakes"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Earthquake Country Alliance Step 1 (dolap ve TV kayışı, yatak çevresi, ağır eşya alt rafa, mutfak mandalı, kapalı kanca, su ısıtıcısı, kaçış yolu), Ready.gov Earthquakes. Kimyasal saklama ve otomatik gaz/elektrik kesici bu kaynaklarda yok."
    },
    "art": [
      "hazirlik-dolap-sabitleme",
      "hazirlik-yatak-yeri",
      null,
      "hazirlik-agir-alt-raf",
      "hazirlik-dolap-mandal",
      "hazirlik-tv-kayis",
      null,
      null,
      null,
      null
    ]
  },
  {
    "id": "hazirlik-aile-afet-plani",
    "title": "Aile afet planı",
    "tag": "HAZIRLIK",
    "summary": "Evdeki herkesle görevleri, çıkış yollarını, buluşma yerlerini ve şehir dışındaki irtibat kişisini önceden belirleyin.",
    "steps": [
      "Evdeki herkesle oturun ve bir afet planı yapın. Planı yazın, herkese bir kopya verin.",
      "Görev dağıtın: çantayı kim alacak, gazı ve elektriği kim kapatacak, çocuklara ve yaşlılara kim yardım edecek.",
      "Evden çıkış yolunu ve bir yedek yolu belirleyin.",
      "İki buluşma yeri seçin: biri evin yakınında, biri mahalle dışında. En yakın toplanma alanını e-Devlet'ten öğrenin.",
      "Şehir dışında yaşayan bir yakınınızı irtibat kişisi seçin. Herkes ona haber versin.",
      "Önemli telefon numaralarını kâğıda yazın. Herkesin cüzdanında ve çantasında dursun.",
      "Okul ve iş yerlerinin afet planını öğrenin. Çocukları kimin alacağını belirleyin.",
      "Bebek, yaşlı, engelli ve evcil hayvanların özel ihtiyaçlarını plana ekleyin.",
      "Planı en az 6 ayda bir gözden geçirin ve evde tatbikat yapın."
    ],
    "dont": [
      "Planı ve numaraları yalnızca telefonda saklamayın; pil biterse ulaşamazsınız.",
      "Tek bir buluşma yerine güvenmeyin; evin çevresi kapanabilir.",
      "Çocukları plan dışında bırakmayın; onlar da buluşma yerini ve irtibat kişisini bilmeli."
    ],
    "keywords": [
      "aile afet planı",
      "afet planı nasıl yapılır",
      "aile acil durum planı",
      "acil durum planı ev",
      "irtibat kişisi",
      "şehir dışı irtibat",
      "görev dağılımı",
      "deprem planı",
      "aile tatbikatı",
      "evde tatbikat",
      "aile afet plani",
      "afet plani hazirlama"
    ],
    "sources": [
      "AFAD — Aile Afet ve Acil Durum Planı",
      "AFAD — Deprem öncesi alınacak önlemler (bölge dışı bağlantı kişisi)",
      "AFAD — e-Devlet Afet ve Acil Durum Toplanma Alanı Sorgulama",
      "Amerikan Kızılhaçı — Make a Plan"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: e-Devlet AFAD hizmet listesinde 'Afet ve Acil Durum Toplanma Alanı Sorgulama' hizmeti mevcut (turkiye.gov.tr). Değişiklik yok. Önceki tur: Amerikan Kızılhaçı Make a Plan (bölge dışı irtibat kişisi, iki buluşma yeri, yılda iki tatbikat, kâğıt kopya, okul planı), e-Devlet AFAD Toplanma Alanı Sorgulama hizmeti, Ready.gov Earthquakes."
    },
    "art": [
      "hazirlik-plan-masa",
      null,
      null,
      "go-assembly-area",
      "hazirlik-irtibat-kisi",
      "hazirlik-numara-kart",
      null,
      null,
      "hazirlik-tatbikat"
    ]
  },
  {
    "id": "hazirlik-arac-kiti",
    "title": "Araç için hazırlık: bagajda bulunacaklar",
    "tag": "HAZIRLIK",
    "summary": "Araçta zorunlu ekipmanı ve kış, arıza ve bekleme için gereken malzemeyi hazır ve kolay ulaşılır tutun.",
    "steps": [
      "Yasal zorunlu ekipmanı araçta tutun: ilk yardım çantası, en az 1 kg kuru tozlu yangın söndürücü ve 2 reflektör. Aşağıdaki stepne, kriko, bijon anahtarı, el feneri, pense, tornavida, yedek ampul, çekme halatı ve kar zinciri de yasal listede yer alır.",
      "Lastik için stepne ya da geçici lastik, kriko ve bijon anahtarı bulundurun. Stepnenin havasını kontrol edin.",
      "El feneri, pense, tornavida, yedek ampul ve çekme halatı bulundurun.",
      "Kışın kış lastiği taktırın. Kar zinciri, küçük kürek, buz kazıyıcı, battaniye, bere ve eldiven ekleyin.",
      "Su ve bozulmayan atıştırmalık koyun. Mevsim değişince yenileyin.",
      "Akü takviye kablosu, araç şarj kablosu ve dolu bir powerbank bulundurun.",
      "Reflektörlü yelek, düdük, ıslak mendil ve çöp poşeti ekleyin.",
      "Kışın ve afet riski varken yakıt deposunu dolu tutun, yarının altına düşürmeyin.",
      "Ayda bir kontrol edin: söndürücünün göstergesi yeşilde mi, ilk yardım malzemesi tam mı."
    ],
    "dont": [
      "Ekipmanı bagajda yükün altına gömmeyin; hemen ulaşabilmelisiniz.",
      "Yangın söndürücüyü yolcu bölmesinde boşta bırakmayın; frende fırlayabilir.",
      "Suyu ve yiyeceği sıcak arabada aylarca bırakmayın; yenileyin."
    ],
    "keywords": [
      "araç kiti",
      "araba çantası",
      "bagajda ne olmalı",
      "araçta bulunması zorunlu",
      "araç zorunlu ekipman",
      "araca ne koymalı",
      "araç yangın tüpü",
      "araç ilk yardım çantası",
      "kar zinciri",
      "kriko",
      "bagajda olmasi gerekenler",
      "arac kiti",
      "araba kiti"
    ],
    "sources": [
      "Karayolları Trafik Yönetmeliği — Araçlarda bulundurulması zorunlu gereçler (2026)",
      "Ready.gov — Car Safety (araç acil durum kiti)",
      "Alomaliye / Araclo — Karayolları Trafik Yönetmeliği 1 sayılı cetvel özeti (2026)",
      "UAB açıklaması — Ticari araçlarda zorunlu kış lastiği (2025-2026)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: KTY 1 sayılı cetvel özeti (ilk yardım çantası, en az 1 kg kuru tozlu söndürücü, 2 reflektör ECE R27, kriko ve bijon anahtarı, yedek ampul, pense, tornavida, seyyar lamba/fener, çekme halatı, bir çift patinaj zinciri, stepne ya da geçici lastik; eksikte KTK 31/1-a cezası; reflektörlü yelek listede yok), kış lastiği haberleri (şehirlerarası yolda ticari yolcu/yük araçlarına zorunlu, Bakan açıklamasına göre 15 Kasım–15 Nisan; hususi otomobilde zorunlu değil, tavsiye ediliyor). 1. adıma yasal listenin geri kalanı, 4. adıma kış lastiği eklendi. Önceki tur: Ready.gov Car Safety (akü takviye kablosu, reflektör üçgen, buz kazıyıcı, şarj kablosu, battaniye, depoyu dolu tutma, kış lastiği/zincir). Karayolları Trafik Yönetmeliği metni (mevzuat.gov.tr) açılamadı; zorunlu liste yeniden doğrulanamadı."
    },
    "art": [
      "hazirlik-arac-zorunlu",
      "hazirlik-arac-stepne",
      null,
      "hazirlik-arac-kis",
      null,
      "hazirlik-arac-aku-kablo",
      null,
      null,
      "hazirlik-arac-sondurucu-kontrol"
    ]
  },
  {
    "id": "hazirlik-belgeler",
    "title": "Önemli belgeleri koruma",
    "tag": "HAZIRLIK",
    "summary": "Önemli belgelerin fotokopisini su geçirmez poşette, dijital kopyasını güvenli bir yerde ve bir takımını şehir dışındaki bir yakında tutun.",
    "steps": [
      "Önemli belgelerin fotokopisini çekin: kimlik, pasaport, tapu, DASK ve sigorta poliçesi, araç ruhsatı, diploma, sağlık raporları.",
      "Fotokopileri ağzı kapanan, su geçirmez bir poşete ya da dosyaya koyun. Afet çantanızda tutun.",
      "Belgelerin fotoğrafını çekin. Şifreli bir bulut hesabına ya da bir USB belleğe kaydedin.",
      "Bir kopya takımını şehir dışında yaşayan, güvendiğiniz bir yakınınıza verin.",
      "Asıllarını evde kolay alınacak, sudan ve ateşten uzak bir yerde saklayın.",
      "Kan grubu, kronik hastalık ve kullandığınız ilaçların adlarını bir kâğıda yazıp poşete ekleyin.",
      "e-Devlet'e girebildiğinizden emin olun. Birçok belgeyi oradan yeniden alabilirsiniz.",
      "Belgeleri yılda bir kontrol edin. Değişenlerin yeni kopyasını koyun."
    ],
    "dont": [
      "Belgelerin tek kopyasını evde bırakmayın.",
      "Kimlik ve banka kartı fotoğraflarını sosyal medyada ya da herkese açık yerde paylaşmayın.",
      "Asıl belgeleri bodrumda ya da ıslanabilecek yerde saklamayın."
    ],
    "keywords": [
      "önemli belgeler",
      "belgeleri koruma",
      "evrak saklama",
      "evrakları nerede saklamalı",
      "tapu fotokopisi",
      "kimlik fotokopisi",
      "pasaport",
      "dask poliçesi",
      "belge yedekleme",
      "su geçirmez dosya",
      "belgeleri kaybettim",
      "onemli belgeler",
      "evrak"
    ],
    "sources": [
      "AFAD — Deprem öncesi alınacak önlemler (belgelerin su geçirmez kopyası)",
      "AFAD — Afet ve Acil Durum Çantası (belge fotokopileri)",
      "Ready.gov — Financial Preparedness",
      "Amerikan Kızılhaçı — Survival Kit Supplies (belge kopyaları)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Ready.gov Financial Preparedness (çanta için kopya, asılları evden uzakta güvenli yerde), Amerikan Kızılhaçı Survival Kit (pasaport, tapu/kira, sigorta, ilaç listesi kopyaları). Dijital yedek ve şehir dışı kopya bu kaynaklarda yok; AFAD açılamadı."
    },
    "art": [
      "hazirlik-belge-fotokopi",
      "hazirlik-belge-posette",
      "hazirlik-belge-dijital",
      "hazirlik-belge-yakina",
      null,
      null,
      null,
      null
    ]
  },
  {
    "id": "hazirlik-ilk-yardim-cantasi",
    "title": "Evde ilk yardım çantası hazırlama",
    "tag": "HAZIRLIK",
    "summary": "Sargı, eldiven, temizlik malzemesi ve temel aletleri kapaklı bir kutuda toplayın, 6 ayda bir kontrol edin.",
    "steps": [
      "Kapaklı, su geçirmez bir kutu seçin. Yetişkinlerin hemen alabileceği, çocukların ulaşamayacağı bir yerde tutun.",
      "Sargı malzemesi koyun: farklı boyda yara bandı, steril gazlı bez, rulo sargı bezi, flaster ve 2 üçgen sargı.",
      "Koruma için en az 2 çift tek kullanımlık eldiven ve tek yönlü valfli suni solunum maskesi koyun.",
      "Temizlik için antiseptik mendil, serum fizyolojik ve el dezenfektanı ekleyin.",
      "Makas, cımbız, çengelli iğne ve camsız dijital termometre koyun.",
      "Folyo battaniye ve anında soğuyan soğuk kompres ekleyin.",
      "Ailenizin düzenli ilaçlarından birkaç günlük yedek ve reçete fotokopisi koyun. Doktorunuzun önerdiği başka malzeme varsa ekleyin.",
      "Bir ilk yardım kitapçığı ve 112, 114 numaralarının yazılı olduğu bir kâğıt ekleyin.",
      "6 ayda bir kontrol edin. Kullanılanları ve tarihi geçenleri yenileyin."
    ],
    "dont": [
      "Çantayı sıcak arabada ya da nemli banyoda saklamayın; malzeme bozulur.",
      "Başkasına yazılmış reçeteli ilacı çantaya koyup kullanmayın.",
      "Cıvalı cam termometre koymayın."
    ],
    "keywords": [
      "ilk yardım çantası",
      "ev ilk yardım çantası",
      "ilk yardım çantasında ne olmalı",
      "ilk yardım malzemeleri",
      "ilk yardım kiti",
      "ecza dolabı",
      "ecza kutusu",
      "yara bandı",
      "sargı bezi",
      "gazlı bez",
      "ilk yardim cantasi",
      "ilkyardim cantasi"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Anatomy of a First Aid Kit",
      "AFAD — Afet ve Acil Durum Çantası"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Bağımsız doğrulama: Amerikan Kızılhaçı Anatomy of a First Aid Kit (yara bandı, gazlı bez, rulo sargı, flaster, 2 üçgen sargı, 2 çift eldiven, valfli solunum maskesi, antiseptik mendil, folyo battaniye, soğuk kompres, cımbız, camsız termometre, talimat; düzenli kontrol). Kızılhaç listesindeki aspirin ve merhemler bilinçli olarak yazılmadı."
    },
    "art": [
      "hazirlik-ilkyardim-kutu-yer",
      "first-aid-kit",
      "hazirlik-ilkyardim-eldiven",
      null,
      "hazirlik-ilkyardim-aletler",
      null,
      null,
      null,
      "hazirlik-tarih-kontrol"
    ]
  },
  {
    "id": "hazirlik-is-okul",
    "title": "İş yerinde ve okulda afet hazırlığı",
    "tag": "HAZIRLIK",
    "summary": "İş yerinizin ve çocuğunuzun okulunun acil durum planını, çıkış yollarını ve çocuğu kimin alacağını önceden öğrenin.",
    "steps": [
      "İş yerinizin ve çocuğunuzun okulunun acil durum planını öğrenin.",
      "Çıkış yollarını, merdivenleri ve toplanma alanını yerinde görün.",
      "Çalıştığınız yerin çevresini düzenleyin: dolap ve rafları sabitletin, ağır eşyaları alta koyun.",
      "Masanızda ya da dolabınızda küçük bir çanta tutun: su, atıştırmalık, fener, düdük, toz maskesi, ilaçlarınız ve rahat ayakkabı.",
      "Deprem olursa sağlam bir sıra ya da masanın altına veya yanına çökün ve Çök-Kapan-Tutun yapın. Koridordaysanız duvar dibine çökün. Pencerelerden ve camlı eşyalardan uzak durun.",
      "Mutfak, atölye ya da laboratuvardaysanız ocak ve makine elinizin altındaysa kapatın. Dökülebilecek şeylerden uzaklaşın.",
      "Okulun çocuğu kime teslim edeceğini öğrenin. Yetkili kişi listesini güncel tutun.",
      "Tatbikatlara katılın. İlk yardım, yangın ve tahliye ekiplerinde kimlerin olduğunu öğrenin.",
      "Ailenizle iş ya da okul saatinde afet olursa nerede buluşacağınızı önceden konuşun."
    ],
    "dont": [
      "Sarsıntı sırasında merdivene, asansöre ya da kapıya koşmayın.",
      "Çıkış kapılarını ve koridorları dolap, koli ya da malzemeyle kapatmayın.",
      "Acil çıkış kapılarını kilitli tutmayın."
    ],
    "keywords": [
      "iş yerinde afet",
      "işyerinde deprem",
      "iş yeri acil durum planı",
      "ofiste deprem",
      "okulda deprem",
      "okul afet planı",
      "okul tatbikatı",
      "çocuğum okuldayken",
      "okuldan çocuk teslim",
      "masa çantası",
      "isyerinde deprem",
      "okulda deprem olursa"
    ],
    "sources": [
      "AFAD — Deprem anında yapılması gerekenler (okul, büro, atölye)",
      "AFAD — Deprem öncesi alınacak önlemler (çıkış yolları, acil çıkış)",
      "MEB okul yayını — AFAD 'Deprem anında yapılması gerekenler' metni",
      "ShakeOut — Drop, Cover, and Hold On",
      "Earthquake Country Alliance — Step 5",
      "Amerikan Kızılhaçı — Make a Plan (okul planı)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: AFAD 'deprem anında' metni (MEB okul PDF'i, Webtekno alıntısı): okul, sınıf, büroda sağlam sıra/masanın altına ya da yanına çömel, koridorda duvar dibine geç, Çök-Kapan-Tutun, pencere ve camlı eşyalardan uzak dur; mutfak, imalathane, laboratuvarda ocak-fırını kapat, dökülebilecek malzemeden uzaklaş. 5. adım AFAD'a uyduruldu ('masa yoksa iç duvar dibi' → 'masanın altına veya yanına; koridorda duvar dibi'). Önceki tur: ShakeOut (kapı eşiği yok), ECA Step 5 (asansör yok, laboratuvar özel önlem), Ready.gov Earthquakes (iş arkadaşlarıyla tatbikat), Kızılhaç Make a Plan. AFAD okul/büro metni açılamadı."
    },
    "art": [
      null,
      "hazirlik-is-cikis-yolu",
      null,
      "hazirlik-is-masa-cantasi",
      "hazirlik-is-cok-kapan",
      null,
      "hazirlik-okul-teslim",
      null,
      null
    ]
  },
  {
    "id": "hazirlik-evcil-hayvan",
    "title": "Evcil hayvanlar için afet hazırlığı",
    "tag": "HAZIRLIK",
    "summary": "Evcil hayvanınızı afet planına ekleyin; ona mama, su, kafes, kimlik ve sağlık kayıtlarıyla bir çanta hazırlayın.",
    "steps": [
      "Evcil hayvanınızı afet planınıza ekleyin. Tahliyede onu geride bırakmayın.",
      "Ona da bir çanta hazırlayın: mama, su ve kap. Konserve mama ise açacak ekleyin.",
      "Sağlam bir taşıma kafesi, tasma ve gezdirme kayışı hazır tutun.",
      "Tasmasına adınızı ve telefonunuzu yazdırın. Kedi ve köpeklere mikroçip taktırmak ve PETVET'e kaydettirmek zorunludur; kayıttaki telefonunuzu güncel tutun.",
      "Aşı karnesini, sağlık kayıtlarını ve kullandığı ilaçları su geçirmez poşete koyun.",
      "Onunla birlikte çekilmiş güncel bir fotoğrafınızı saklayın. Kaybolursa sahibi olduğunuzu gösterir.",
      "Beslenme düzenini ve veterinerin telefonunu bir kâğıda yazıp çantaya koyun.",
      "Barınma yerlerinin hayvan kabul edip etmediğini önceden öğrenin. Kabul edenleri not alın.",
      "Afetten sonra hayvanınızı tasmalı ya da kafeste tutun. Korkup kaçabilir."
    ],
    "dont": [
      "Hayvanınızı evde bağlı ya da kapalı bırakıp gitmeyin.",
      "Korkmuş hayvanı serbest bırakmayın; kaybolabilir ya da yaralanabilir.",
      "Sağlık kayıtlarını unutmayın; barınma yerleri aşı karnesi isteyebilir."
    ],
    "keywords": [
      "evcil hayvan hazırlık",
      "evcil hayvan için hazırlık",
      "evcil hayvan afet çantası",
      "evcil hayvan çantası",
      "kedi köpek için afet hazırlığı",
      "kedi köpek çantası",
      "hayvan mama çantası",
      "evcil hayvan acil durum planı",
      "evcil hayvan kimlik künye",
      "evcil hayvan icin hazirlik"
    ],
    "sources": [
      "Amerikan Kızılhaçı — Pet Disaster Preparedness",
      "AFAD — Afet ve Acil Durum Çantası (evcil hayvan sağlık karnesi)",
      "CDC — Pet Emergency Preparedness",
      "Amerikan Kızılhaçı — Survival Kit Supplies (evcil hayvan malzemesi)",
      "T.C. Tarım ve Orman Bakanlığı — Ev hayvanlarının kayıt altına alınması (PETVET)"
    ],
    "reviewed": false,
    "checked": {
      "date": "2026-11-01",
      "note": "Türkiye kaynaklı teyit: Tarım ve Orman Bakanlığı (5199 sayılı Kanun ve yönetmelik gereği kedi, köpek ve gelinciklerin mikroçiplenip PETVET'e kaydı zorunlu). 4. adımda mikroçipin Türkiye'de zorunlu olduğu belirtildi. Önceki tur: CDC Pet Emergency Preparedness (künye, mikroçip ve kayıt güncelliği, aşı kayıtları, ilaçlar, veteriner numarası, barınakların çoğu hayvan almaz, geride bırakmayın, bağlı bırakmayın, sonra tasmalı/kafeste tutun), Kızılhaç Survival Kit (tasma, kayış, kimlik, mama, kafes, kap). Hayvanla fotoğraf bu kaynaklarda yok."
    },
    "art": [
      null,
      "hazirlik-evcil-canta",
      "hazirlik-evcil-kafes",
      "hazirlik-evcil-kunye",
      null,
      "hazirlik-evcil-foto",
      null,
      null,
      null
    ]
  }
];
