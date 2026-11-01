// Rehber kategorisi: Psikolojik ilk yardım
// Bu dosya tek bir kategorinin rehberlerini içerir. Rehber biçimi: src/content/types.ts
import type { CategoryMeta, Guide } from '../types';

export const CATEGORY: CategoryMeta = {
  "id": "psikoloji",
  "title": "Psikolojik ilk yardım",
  "hint": "Panik, şok, çocuklar, yas",
  "art": "cat-psikoloji",
  "color": "#c4b5fd",
  "order": 13
};

export const GUIDES: Guide[] = [
  {
    "id": "psikoloji-ilk-yardim",
    "title": "Psikolojik ilk yardım: Bak, Dinle, Bağlantı kur",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Ortamı ve ihtiyaçları görün, kişiyi zorlamadan dinleyin, onu temel hizmetlere ve yakınlarına bağlayın.",
    "steps": [
      "BAK: Ortam güvenli mi bakın. Yaralı, çok sarsılmış ya da yalnız kalmış kişileri fark edin.",
      "Ağır yaralı varsa ya da kişi kendine veya başkasına zarar verebilecek durumdaysa 112'yi arayın.",
      "Yaklaşın, kendinizi tanıtın ve izin isteyin: \"Ben Ayşe. Yanınızda biraz durabilir miyim?\"",
      "DİNLE: Sakin bir köşede, göz hizasında oturun. Su ya da battaniye önerin.",
      "Ne istediğini sorun: \"Şu an en çok neye ihtiyacınız var?\" Ne istediğini tahmin etmeyin.",
      "Anlatmak isterse dinleyin, araya girmeyin. Anlatmak istemezse zorlamayın; sessizlik de olur.",
      "Çok panik içindeyse onunla birlikte yavaşça nefes alın. Ayaklarının yere bastığını hissetmesini isteyin.",
      "BAĞLANTI KUR: Su, yemek, barınak ve sağlık hizmetine ulaşmasına yardım edin.",
      "Ailesine ve yakınlarına ulaşmasına yardım edin. Çocukları aileleriyle bir arada tutun.",
      "Bildiğinizi doğru söyleyin, bilmediğinize \"bilmiyorum\" deyin. Tutamayacağınız söz vermeyin."
    ],
    "art": [
      "psikoloji-bak",
      "call-112",
      null,
      "psikoloji-dinle",
      null,
      null,
      "psikoloji-piy-nefes",
      "psikoloji-baglanti",
      null,
      null
    ],
    "dont": [
      "Kişiyi yaşadıklarını anlatmaya zorlamayın.",
      "\"Her şey yoluna girecek\" gibi boş teselli ya da doğrulanmamış bilgi vermeyin.",
      "\"Abartıyorsun\", \"deli gibi davranıyorsun\" gibi yargılayan sözler söylemeyin.",
      "Kendi dertlerinizi anlatmayın; başkalarının hikayesini yaymayın.",
      "İzin almadan dokunmayın, sarılmayın; özellikle karşı cinsten biriyse."
    ],
    "keywords": [
      "psikolojik ilk yardım",
      "psikolojik destek",
      "şoktaki kişiye nasıl davranılır",
      "şoktaki birine destek olmak",
      "teselli etmek",
      "sarsılmış kişi",
      "afetzede ile konuşmak",
      "moral vermek",
      "bak dinle bağlantı kur",
      "psikososyal destek",
      "psikolojik ilkyardim",
      "travma yaşayan kişiye destek",
      "izle dinle bağ kur",
      "bak dinle bağ kur"
    ],
    "sources": [
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "IFRC Psikososyal Destek Merkezi — Psikolojik ilk yardım",
      "Türk Kızılay — Psikolojik ilk yardım rehber kitabı (İzle, Dinle, Bağ Kur; İstiklal haberi)",
      "MEB / UNICEF ZOYOP — Okul temelli psikolojik ilk yardım öğretmen broşürü",
      "Türkiye Psikiyatri Derneği (Dr. İlker Küçükparlak) — Bak-Dinle-Bağ kur (bianet, Medikal Akademi)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türk Kızılay PİY rehberi (İzle-Dinle-Bağ Kur; ayrıntı sorgulama, duygu paylaşmaya zorlama ve gerçekçi olmayan vaat yok), MEB ZOYOP broşürü, TPD açıklamaları (ihtiyacı tahmin etmeme, kültüre duyarlı temas). Uyumlu; Kızılay/MEB adlandırması anahtar kelimelere, izinsiz dokunmama 'dont'a eklendi." }
  },
  {
    "id": "psikoloji-panik-atak",
    "title": "Panik atak (kendiniz ya da başkası)",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Panik atak korkutucudur ama genellikle 5–20 dakikada geçer; oturun ve yavaş, sayarak nefes alın.",
    "steps": [
      "Kendinize söyleyin: \"Bu bir panik atak. Korkutucu ama geçecek.\" Çoğu atak 5–20 dakikada geçer.",
      "Güvenli bir yere oturun ya da bir yere dayanın.",
      "Burnunuzdan 1'den 5'e kadar sayarak yavaşça nefes alın. Ağzınızdan 1'den 5'e kadar sayarak verin.",
      "Bu nefesi en az 5 dakika sürdürün.",
      "Ayaklarınızın yere bastığını hissedin. Çevrenizde gördüğünüz 5 şeyin adını sesli söyleyin.",
      "Başkası panik yaşıyorsa yanında kalın. Yavaş ve sakin konuşun: \"Buradayım. Bu geçecek.\"",
      "Onunla birlikte sayarak nefes alın; size bakarak nefesini yavaşlatsın.",
      "Etrafındaki kalabalığı uzaklaştırın, sıkan yakasını ya da kemerini gevşetin.",
      "Göğüs ağrısı ilk kez oluyorsa, kişinin kalp hastalığı varsa, bayılırsa ya da belirtiler geçmiyorsa 112'yi arayın."
    ],
    "art": [
      null,
      "psikoloji-oturma",
      "psikoloji-nefes",
      null,
      "psikoloji-ayak-yere",
      "psikoloji-panik-yaninda",
      null,
      null,
      "call-112"
    ],
    "dont": [
      "Kese kağıdına nefes aldırmayın.",
      "\"Sakin ol, abartıyorsun\" demeyin.",
      "Kişiyi yalnız bırakmayın.",
      "Başkasının sakinleştirici ilacını vermeyin."
    ],
    "keywords": [
      "panik atak",
      "panik atak geçiriyorum",
      "panik oldum",
      "panik krizi",
      "kaygı krizi",
      "anksiyete atağı",
      "ölecekmişim gibi hissediyorum",
      "kalbim hızlı çarpıyor korkuyorum",
      "kontrolü kaybediyorum",
      "panik atak nasil gecer",
      "panikatak"
    ],
    "sources": [
      "NHS — Panic disorder",
      "NHS — Breathing exercises for stress",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde yetişkinlerin tepkileri' broşürü (gevşeme ve nefes egzersizi, ilaç için önce hekime başvurma) ile uyumlu; panik atağa özel Türk resmi metin bulunamadı. Önceki NHS kontrolü geçerli. Değişiklik yok." }
  },
  {
    "id": "psikoloji-cocukla-konusma",
    "title": "Çocukla afet hakkında konuşmak",
    "tag": "ÇOCUK",
    "summary": "Çocuğa sakin, kısa ve doğru bilgi verin; duygularını kabul edin ve güvende olduğunu hissettirin.",
    "steps": [
      "Önce kendiniz sakinleşin. Çocuk güveni sizin sesinizden ve yüzünüzden alır.",
      "Göz hizasına inin. Ne duyduğunu ve ne hissettiğini sorun.",
      "Kısa, basit ve doğru anlatın: \"Deprem oldu. Bazı evler yıkıldı. Biz şimdi güvendeyiz.\"",
      "Bilmediğinizi uydurmayın: \"Bilmiyorum, öğrenince sana söyleyeceğim.\"",
      "Duygularını kabul edin: \"Korkman çok normal. Ben de korktum.\" Olanların onun suçu olmadığını söyleyin.",
      "Ona sarılın. Onu koruyacağınızı ve yanında olacağınızı söyleyin.",
      "Aynı soruları tekrar tekrar sorabilir. Her seferinde sabırla yanıtlayın.",
      "Oyun oynayarak ya da resim çizerek anlatmasına izin verin.",
      "Haberleri ve yıkım görüntülerini çocuğun yanında açmayın.",
      "Küçük bir görev verin: su dağıtmaya yardım etmek ya da küçük kardeşe masal okumak gibi."
    ],
    "art": [
      null,
      "psikoloji-cocuk-goz-hizasi",
      null,
      null,
      null,
      "psikoloji-cocuk-sarilma",
      null,
      "psikoloji-cocuk-resim",
      "psikoloji-cocuk-haber",
      null
    ],
    "dont": [
      "\"Ağlama\", \"Büyük çocuklar korkmaz\" demeyin.",
      "Çocuğu konuşmaya zorlamayın.",
      "Olmayacak sözler vermeyin: \"Bir daha asla deprem olmayacak.\"",
      "Büyüklerin korkulu konuşmalarını çocuğun yanında yapmayın."
    ],
    "keywords": [
      "çocuğa depremi nasıl anlatırım",
      "çocuğa afeti anlatmak",
      "çocukla konuşmak",
      "çocuğum soruyor",
      "çocuğum çok korkuyor",
      "cocuga deprem nasil anlatilir",
      "çocuğu sakinleştirmek",
      "çocuk deprem korkusu",
      "çocuklara ne söylemeli",
      "çocuğa açıklamak"
    ],
    "sources": [
      "UNICEF — Çocuklarla afetler hakkında konuşmak",
      "NCTSN — Psychological First Aid: Parent tips",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "Aile ve Sosyal Hizmetler Bakanlığı — Afetlerde çocukların tepkileri ve baş etme önerileri (broşür)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde çocukların tepkileri' broşürü (açık, net, yaşa uygun cevap; bilmediğini öğrenip söyleme; konuşmaya zorlamama; küçük çocuğa olayın onun suçu olmadığını tekrar söyleme). #5'e 'onun suçu değil' eklendi." }
  },
  {
    "id": "psikoloji-cocuk-stres-belirtileri",
    "title": "Çocuklarda yaşa göre stres belirtileri",
    "tag": "ÇOCUK",
    "summary": "Afetten sonra çocukların davranışı değişebilir; yaşına uygun destek verin, belirtiler sürerse yardım isteyin.",
    "steps": [
      "Afetten sonra çocuğun davranışının değişmesi normaldir. Çoğu çocukta birkaç hafta içinde azalır.",
      "0–5 yaş: size yapışma, ayrılamama, altını yeniden ıslatma, parmak emme, gece uyanma, aynı oyunu tekrar tekrar oynama görülebilir.",
      "Küçük çocukta: sık sarılın, kucaklayın. Uyku ve yemek saatlerini koruyun. Nereye gittiğinizi hep söyleyin.",
      "6–12 yaş: güvenlik kaygısı, olayı tekrar tekrar anlatma, karın ya da baş ağrısı, dikkat dağınıklığı, öfke ve uyku sorunu görülebilir.",
      "Okul çağında: duygularını anlatmasını isteyin, bunların normal olduğunu söyleyin. Yanlış anladıklarını nazikçe düzeltin.",
      "13–18 yaş: içine kapanma, aileden ve arkadaşlardan uzaklaşma, suçluluk, öfke ve riskli davranışlar görülebilir.",
      "Ergende: yargılamadan dinleyin, ona sorumluluk verin, arkadaşlarıyla görüşmesine fırsat verin.",
      "Belirtiler haftalar geçtikçe azalmıyor ya da artıyorsa, evde ve okulda günlük hayatı bozuyorsa sağlık ekibinden, okul rehber öğretmeninden ya da Aile ve Sosyal Hizmetler psikososyal destek ekibinden destek isteyin.",
      "Çocuk kendine zarar vermekten söz ederse onu yalnız bırakmayın ve 112'yi arayın."
    ],
    "art": [
      null,
      "psikoloji-cocuk-yapisma",
      null,
      "psikoloji-cocuk-karin-agrisi",
      "psikoloji-stres-okul-konusma",
      "psikoloji-genc-icine-kapanma",
      null,
      "psikoloji-stres-destek",
      null
    ],
    "dont": [
      "Altını ıslatma ya da parmak emme gibi gerilemeleri cezalandırmayın.",
      "\"Artık büyüdün\", \"Bebek gibi davranma\" demeyin.",
      "Ergenin öfkesini ya da içine kapanmasını \"şımarıklık\" sanmayın."
    ],
    "keywords": [
      "çocuğum altını ıslatıyor",
      "çocukta stres belirtileri",
      "çocuğum değişti",
      "çocuk kabus görüyor",
      "çocuğum benden ayrılmıyor",
      "çocuk travma belirtileri",
      "ergen içine kapandı",
      "çocuğum çok sinirli",
      "cocukta travma",
      "yaşa göre çocuk tepkileri",
      "çocuğum konuşmuyor"
    ],
    "sources": [
      "NCTSN — Age-related reactions to a traumatic event",
      "NCTSN — Psychological First Aid: Parent tips",
      "Aile ve Sosyal Hizmetler Bakanlığı — Afetlerde çocukların tepkileri ve baş etme önerileri (broşür)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde çocukların tepkileri' broşürü (yaşa göre tepkiler uyumlu; uzmana yönlendirme: birkaç ay değişmeden ya da artarak sürme, gelişimi bozma, farklı ortamlarda görülme; kendine zarar verme ifadesinde hemen yardım). #8'deki tartışmalı '4 hafta' eşiği kaldırılıp Bakanlık ölçütleriyle birleştirildi." }
  },
  {
    "id": "psikoloji-yas",
    "title": "Yas ve kayıp",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Yasın acısı normaldir; kendinize zaman tanıyın, yalnız kalmayın, yas tutan birine yanında olduğunuzu gösterin.",
    "steps": [
      "Yas üzüntü, öfke, suçluluk, boşluk ve hissizlik getirebilir. Bunların hepsi normaldir.",
      "Ağlamak istiyorsanız ağlayın. Güldüğünüz anlar olursa kendinizi suçlamayın.",
      "Güvendiğiniz biriyle konuşun: aileniz, bir arkadaşınız ya da din görevlisi.",
      "Az da olsa yemek yiyin, su için ve dinlenmeye çalışın.",
      "Kaybınızı anmanın bir yolunu bulun: dua etmek, bir fotoğrafa bakmak, bir anı yazmak.",
      "Yas tutan birine \"Başın sağ olsun. Buradayım\" demek yeter. Dinleyin, akıl vermeyin.",
      "Somut yardım önerin: yemek getirmek, çocuklara bakmak, resmi işlerde eşlik etmek.",
      "Çocuğa ölümü açık ve basit sözlerle anlatın: \"Öldü. Vücudu artık çalışmıyor.\" \"Uyudu\" demeyin.",
      "Zaman geçtikçe acınız hiç hafiflemiyorsa ya da yemek, uyku, yıkanma gibi günlük işleri yapamıyorsanız sağlık ekibinden destek isteyin. Yaşamak istemediğinizi düşünüyorsanız beklemeyin; hemen birine söyleyin ya da 112'yi arayın."
    ],
    "art": [
      null,
      null,
      "psikoloji-yas-konusma",
      null,
      "psikoloji-yas-anma",
      "psikoloji-yas-basin-sagolsun",
      "psikoloji-yas-yemek",
      null,
      "psikoloji-yas-destek"
    ],
    "dont": [
      "\"Güçlü ol, ağlama\", \"Zamanla unutursun\" demeyin.",
      "Yas tutan kişiyi acele ettirmeyin; herkesin yası farklı sürer.",
      "Acıyı alkol ya da başkasının ilacıyla bastırmaya çalışmayın."
    ],
    "keywords": [
      "yas",
      "yas tutmak",
      "kayıp acısı",
      "yakınımı kaybettim",
      "annemi kaybettim",
      "babamı kaybettim",
      "çocuğumu kaybettim",
      "yakınım öldü",
      "ölüm acısı",
      "başsağlığı",
      "taziye",
      "evimi kaybettim",
      "yakinimi kaybettim"
    ],
    "sources": [
      "NHS — Grief, bereavement and loss",
      "SAMHSA — Tips for survivors: coping with grief after a disaster or traumatic event",
      "NCTSN — Çocuklarda travmatik yas",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "Aile ve Sosyal Hizmetler Bakanlığı — Yetişkinlerde kayıp ve yas süreci (broşür)",
      "Aile ve Sosyal Hizmetler Bakanlığı — Çocuklarda kayıp ve yas süreci (broşür)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB yetişkin ve çocuk yas broşürleri (herkes yasını farklı yaşar; dinleyin, yanında olun; çocuğa 'uyudu, yolculuğa çıktı' denmez, kısa açık cümle; uzmana yönlendirme: tepkiler azalmıyorsa, temel ihtiyaçlar karşılanamıyorsa, zarar verme düşüncesi). #9'daki 'aylar geçmesine rağmen' bekleme ifadesi Bakanlık ölçütüne çevrildi." }
  },
  {
    "id": "psikoloji-uyku-stres",
    "title": "Uyku sorunu ve stres",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Afetten sonra uykusuzluk yaygındır; düzenli saatler, kafeinsiz akşamlar ve yavaş nefesle uykuya yardım edin.",
    "steps": [
      "Afetten sonra uykusuzluk, kabus ve sık uyanma çok yaygındır. Çoğu kişide haftalar içinde düzelir.",
      "Her gün aynı saatte yatıp aynı saatte kalkmaya çalışın.",
      "Yatmadan en az 6 saat önce çay, kahve, kola ve enerji içeceğini bırakın.",
      "Yatmadan 1 saat önce haberlere ve sosyal medyaya bakmayı bırakın.",
      "Çadırda ya da kalabalık yerde göz bandı, kulak tıkacı ve kalın bir battaniye kullanın.",
      "Yatakta yavaş nefes alın: burnunuzdan 1'den 5'e kadar sayarak alın, ağzınızdan 1'den 5'e kadar sayarak verin.",
      "Uyuyamazsanız kalkıp sakin bir iş yapın. Uykunuz gelince yeniden yatın.",
      "Gündüz biraz yürüyün ve gün ışığına çıkın.",
      "Uyku sorunu haftalarca sürer ya da günlük işlerinizi engellerse sağlık ekibine danışın."
    ],
    "art": [
      null,
      null,
      "psikoloji-kafein-yok",
      "psikoloji-haber-kapat",
      "psikoloji-goz-bandi",
      "psikoloji-uyku-nefes",
      null,
      null,
      null
    ],
    "dont": [
      "Uyumak için alkol kullanmayın; uykuyu bozar.",
      "Başkasının uyku ilacını kullanmayın.",
      "Saatlerce yatakta dönüp kendinizi uyumaya zorlamayın."
    ],
    "keywords": [
      "uyuyamıyorum",
      "uykusuzluk",
      "kabus görüyorum",
      "geceleri uyanıyorum",
      "uyku sorunu",
      "stres",
      "stresliyim",
      "gerginim",
      "uyuyamiyorum",
      "çadırda uyuyamıyorum",
      "kafam durmuyor"
    ],
    "sources": [
      "NHS — Insomnia",
      "NHS — Breathing exercises for stress",
      "CDC — Coping with stress after a disaster",
      "IFRC Psikososyal Destek Merkezi — Gönüllülere öz bakım"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde yetişkinlerin tepkileri' broşürü (düzenli uyku, rutin, nefes/gevşeme, kısa yürüyüş, uykusuzluk sürerse uzman) ile uyumlu; sayısal eşikler (6 saat, 1 saat) Türk kaynağında yok, önceki NHS kontrolüne dayanıyor. Değişiklik yok." }
  },
  {
    "id": "psikoloji-gonullu-tukenmislik",
    "title": "Gönüllü ve yardımcılarda tükenmişlik",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Yardım edenlerin de dinlenmesi gerekir; belirtileri tanıyın, mola verin, yaşadıklarınızı paylaşın.",
    "steps": [
      "Belirtileri tanıyın: sürekli yorgunluk, uykusuzluk, baş ağrısı, sinirlilik, dikkat dağınıklığı, umutsuzluk, insanlardan uzaklaşma.",
      "Düzenli mola verin. Birkaç saatte bir oturun, su için, bir şeyler yiyin.",
      "Her gün uyumaya zaman ayırın. Vardiya bitince görev alanından uzaklaşın.",
      "Alkol, sigara ve fazla kahveden uzak durun.",
      "Ekipte bir \"eş\" seçin. Birbirinizin yorgunluğunu izleyin, gerekince mola önerin.",
      "Yaşadıklarınızı güvendiğiniz bir arkadaşla ya da ekip sorumlusuyla konuşun.",
      "Her şeyi çözmek zorunda değilsiniz. Yapabildiğinizi yapmak yeterlidir.",
      "Ailenizle ve sevdiklerinizle her gün iletişim kurun.",
      "Sıkıntınız geçmiyorsa ya da gördükleriniz aklınızdan çıkmıyorsa profesyonel destek isteyin. Yaşamak istemediğinizi düşünüyorsanız hemen birine söyleyin ya da 112'yi arayın."
    ],
    "art": [
      "psikoloji-gonullu-yorgun",
      "psikoloji-gonullu-mola",
      null,
      null,
      "psikoloji-gonullu-es",
      null,
      null,
      null,
      "psikoloji-gonullu-destek"
    ],
    "dont": [
      "\"Ben dayanırım\" deyip dinlenmeyi ertelemeyin.",
      "Çok yorgunken enkaz gibi tehlikeli işlere girmeyin.",
      "Yardım ettiğiniz kişilerin hikayelerini başkalarına anlatmayın."
    ],
    "keywords": [
      "tükenmişlik",
      "gönüllü yorgunluğu",
      "gönüllüyüm",
      "arama kurtarma ekibi stres",
      "yardım ederken yoruldum",
      "tükendim",
      "gonullu tukenmislik",
      "yardımcı yorgunluğu",
      "ikincil travma",
      "sağlık çalışanı stres",
      "burnout"
    ],
    "sources": [
      "IFRC Psikososyal Destek Merkezi — Caring for volunteers",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "NHS — Help for suicidal thoughts",
      "Aile ve Sosyal Hizmetler Bakanlığı — Afetlerde çalışana destek (broşür)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde çalışana destek' broşürü (belirtiler, mola, beslenme/uyku, aileyle iletişim, ekiple paylaşım, kendinize yüklenmeyin, zarar verme düşüncesinde gecikmeden uzman) — mevcut metinle uyumlu. Değişiklik yok." }
  },
  {
    "id": "psikoloji-travma-tepkileri",
    "title": "Afetten sonra normal tepkiler ve ne zaman yardım almalı",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Korku, şok ve uykusuzluk afetten sonra normal tepkilerdir; günlük hayatınızı günlerce bozarsa yardım alın.",
    "steps": [
      "Afetten sonra şok, hissizlik, korku, öfke, suçluluk ve ağlama krizleri normaldir.",
      "Bedende de belirtiler olur: çarpıntı, baş ve mide ağrısı, iştahsızlık, yorgunluk, uykusuzluk.",
      "Olay aklınıza istemeden gelebilir, küçük seslerde irkilebilirsiniz. Çoğu kişide bu haftalar içinde azalır.",
      "Bedeninize iyi bakın: düzenli yiyin, su için, dinlenin, biraz yürüyün.",
      "Yakınlarınızla konuşun, yalnız kalmayın.",
      "Haberlere ve yıkım görüntülerine sınır koyun. Resmi kaynaklardan günde birkaç kez bakmak yeter.",
      "Kendinize küçük günlük işler belirleyin. Bir rutin kurmak iyi gelir.",
      "Tepkileriniz zamanla azalmıyorsa ya da günlük işlerinizi engelliyorsa sağlık ekibine, aile hekimine ya da psikososyal destek ekibine başvurun.",
      "Kendinize ya da başkasına zarar verme düşüncesi varsa hemen 112'yi arayın."
    ],
    "art": [
      null,
      null,
      "psikoloji-irkilme",
      null,
      "psikoloji-travma-konusma",
      "psikoloji-travma-haber",
      null,
      "psikoloji-travma-destek",
      "call-112"
    ],
    "dont": [
      "Kendinizi \"zayıf\" ya da \"delirdim\" diye suçlamayın; bunlar ağır bir olaya normal tepkilerdir.",
      "Duyguları alkol, sigara ya da başkasının ilacıyla bastırmaya çalışmayın.",
      "Yardım istemeyi utanç saymayın."
    ],
    "keywords": [
      "travma",
      "travma sonrası",
      "şok oldum",
      "aklımdan çıkmıyor",
      "sürekli irkiliyorum",
      "deprem korkusu",
      "sallanıyor gibi hissediyorum",
      "psikolojim bozuldu",
      "travma sonrasi stres",
      "psikolog",
      "ruh sağlığı",
      "hissizlik"
    ],
    "sources": [
      "CDC — Coping with stress after a disaster",
      "CDC — Living with mental health: managing stress",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "SAMHSA — Tips for survivors of a disaster",
      "Aile ve Sosyal Hizmetler Bakanlığı — Afetlerde yetişkinlerin tepkileri ve baş etme önerileri (broşür)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: ASHB 'Afetlerde yetişkinlerin tepkileri' broşürü (duygusal/zihinsel/bedensel tepkiler normaldir; yakınlarla paylaşım, rutin, yürüyüş, güvenilir kaynak; uzman: tepkiler zamanla azalmıyor ve günlük hayatı etkiliyorsa, zarar verme düşüncesi). #8'deki kaynaksız 'birkaç gün üst üste' ölçütü Bakanlık ifadesine çevrildi." }
  },
  {
    "id": "psikoloji-intihar-dusuncesi",
    "title": "İntihar düşüncesi: kişinin yanında olmak",
    "tag": "PSİKOLOJİK İLK YARDIM",
    "summary": "Ciddiye alın, yalnız bırakmayın, açıkça sorup yargılamadan dinleyin; tehlike varsa hemen 112'yi arayın.",
    "steps": [
      "Kendini öldürmekten ya da ölmek istemekten söz eden herkesi ciddiye alın.",
      "Kişiyi yalnız bırakmayın. Yanında kalın ya da güvendiğiniz birinin kalmasını sağlayın.",
      "Sakin ve açıkça sorun: \"Kendini öldürmeyi düşünüyor musun?\" Sormak bu düşünceyi artırmaz.",
      "Yargılamadan dinleyin: \"Bana anlattığın iyi oldu. Seni dinliyorum.\"",
      "Hemen tehlike varsa ya da kendine zarar verdiyse 112'yi arayın.",
      "Kendinizi tehlikeye atmadan, kendine zarar verebileceği ilaçları, kesici aletleri ve silahları ortamdan uzaklaştırın.",
      "Bunu gizli tutma sözü vermeyin. Yardım için başkalarına söyleyeceğinizi nazikçe anlatın.",
      "Birlikte bir sağlık kuruluşuna ya da sağlık ekibine gidin.",
      "Kriz geçtikten sonra da arayın, nasıl olduğunu sorun.",
      "Siz de böyle düşünüyorsanız güvendiğiniz birine şimdi söyleyin ya da 112'yi arayın. Bu duygular geçebilir; yardım var."
    ],
    "art": [
      null,
      "psikoloji-yaninda-kal",
      null,
      "psikoloji-intihar-dinle",
      "call-112",
      null,
      null,
      "psikoloji-intihar-destek",
      null,
      null
    ],
    "dont": [
      "Tartışmayın, nasihat etmeyin, sorunlarını küçümsemeyin.",
      "\"Yapamazsın\" gibi meydan okuyan sözler söylemeyin.",
      "Sır tutma sözü vermeyin.",
      "Kişiyi bir an bile yalnız bırakmayın."
    ],
    "callEmergency": true,
    "keywords": [
      "intihar",
      "intihar düşüncesi",
      "kendini öldürmek istiyor",
      "ölmek istiyorum",
      "yaşamak istemiyorum",
      "canıma kıymak",
      "intihar edecek",
      "kendine zarar veriyor",
      "intihar etmek istiyorum",
      "yasamak istemiyorum",
      "kendimi oldurmek"
    ],
    "sources": [
      "WHO — Suicide: questions and answers",
      "WHO — Suicide fact sheet (LIVE LIFE)",
      "WHO — Psikolojik İlk Yardım: Saha Çalışanları İçin Rehber (2011)",
      "AFSP — What to do when someone is at risk",
      "#BeThe1To — 5 adım ve kanıtları",
      "NHS — Help for suicidal thoughts",
      "TherapyRoute — Suicide hotlines and crisis lines in Türkiye",
      "Hacettepe Üniv. Halk Sağlığı AD — İntiharı önleme bilgi notu (2023)"
    ],
    "reviewed": false,
    "checked": { "date": "2026-11-01", "note": "Türkiye kaynaklı teyit: Türkiye'de 112 dışında resmi ulusal intihar kriz hattı yok (TherapyRoute Türkiye kriz hatları derlemesi: ALO 183 ve ALO 191 intihar hattı değil; 182 MHRS randevu hattıdır, krizde kullanılmamalı); ASHB broşürleri kendine zarar verme düşüncesinde hemen ruh sağlığı uzmanı diyor; Hacettepe intiharı önleme notu araçlara erişimi kısıtlamayı destekliyor. 112 yönlendirmesi doğru. Değişiklik yok." }
  }
];
