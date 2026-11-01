// Rehber araması için kalite testi: telaşlı birinin yazacağı gerçekçi Türkçe sorgular
// (Türkçe harfli/harfsiz, yazım hatalı) ve beklenen ilk rehber. Aynı sorgular Fener'in
// bağlam araması (retrieve + isRelevantGuide) için de denetlenir.
import { describe, expect, it } from 'vitest';
import { searchGuides, guideToText, getGuide } from '../src/lib/guides-search';
import { retrieve, isRelevantGuide, type RagDeps } from '../src/lib/fener/rag';

/** [sorgu, beklenen ilk rehber] */
const CASES: [string, string][] = [
  // Deprem
  ['deprem oluyor', 'deprem-aninda'],
  ['her yer sallaniyor', 'deprem-aninda'],
  ['deprm oluyo ne yapim', 'deprem-aninda'],
  ['depremde nereye saklanmalıyım', 'deprem-aninda'],
  ['deprem bitti şimdi ne yapacağım', 'deprem-sonrasi'],
  ['artci deprem', 'deprem-sonrasi'],
  ['enkaz altindayim', 'enkaz-altinda'],
  ['göçük altında kaldım', 'enkaz-altinda'],
  ['komşum enkaz altında sesi geliyor', 'enkaz-kurtarma'],
  ["avm'de deprem", 'deprem-kalabalik-alan'],
  ['metroda deprem olursa', 'deprem-kalabalik-alan'],
  ['evime geri girebilir miyim', 'deprem-hasarli-bina'],
  ['kolonda çatlak var', 'deprem-hasarli-bina'],
  ['bebeğimi depremde nasıl korurum', 'deprem-cocuklar'],
  ['12. kattayım deprem', 'deprem-yuksek-bina'],
  ['asansordeyken deprem oldu', 'deprem-yuksek-bina'],

  // Hayati ilk yardım
  ['yerde yatan biri var', 'ilk-yardim-ilk-degerlendirme'],
  ['kan durmuyor', 'kanama'],
  ['bacağı kesildi çok kan akıyor', 'kanama'],
  ['turnike nasil yapilir', 'kanama'],
  ['kanma durmuyo', 'kanama'],
  ['nefes almıyor', 'temel-yasam-destegi'],
  ['kalp masajı nasıl yapılır', 'temel-yasam-destegi'],
  ['kalp masji', 'temel-yasam-destegi'],
  ['bayıldı nefes almıyo', 'temel-yasam-destegi'],
  ['cocugum nefes almiyor', 'ilk-yardim-cocuk-kpr'],
  ['bebek nefes almıyor', 'ilk-yardim-bebek-kpr'],
  ['aed nasil kullanilir', 'ilk-yardim-oed'],
  ['baygın ama nefes alıyor', 'derlenme-pozisyonu'],
  ['koma pozisyonu', 'derlenme-pozisyonu'],
  ['boğazına yemek kaçtı', 'hava-yolu-tikanmasi'],
  ['heimlich', 'hava-yolu-tikanmasi'],
  ['boguluyo', 'hava-yolu-tikanmasi'],
  ['bebeğin boğazına bir şey kaçtı', 'ilk-yardim-bebek-bogulma'],
  ['havuzda boğuldu', 'ilk-yardim-suda-bogulma'],
  ['denizde bogulan cocuk', 'ilk-yardim-suda-bogulma'],
  ['elektrik carpti', 'ilk-yardim-elektrik-carpmasi'],
  ['soka girdi rengi soldu', 'ilk-yardim-sok'],
  ['epipen', 'ilk-yardim-anafilaksi'],
  ['alerjiden dili şişti', 'ilk-yardim-anafilaksi'],
  ['astim krizi', 'ilk-yardim-astim'],
  ['ventolin yok nefes darlığı', 'ilk-yardim-astim'],
  ['göğsüm sıkışıyor sol kolum ağrıyor', 'ilk-yardim-kalp-krizi'],
  ['kalp krizi geciriyor', 'ilk-yardim-kalp-krizi'],
  ['ağzı kaydı konuşamıyor', 'ilk-yardim-inme'],
  ['felc geciriyor', 'ilk-yardim-inme'],
  ['şekeri düştü titriyor', 'ilk-yardim-seker-dusmesi'],
  ['sara krizi geçiriyor', 'nobet'],
  ['ateşli havale', 'nobet'],
  ['bayılacak gibiyim', 'ilk-yardim-bayilma'],
  ['gözüm kararıyo', 'ilk-yardim-bayilma'],

  // Yaralanma ve hastalık
  ['burnum kaniyor', 'burun-kanamasi'],
  ['elime kaynar su döküldü', 'yanik'],
  ['elim yandi', 'yanik'],
  ['ayak bileğim burkuldu', 'kirik-burkulma'],
  ['kolu kirildi', 'kirik-burkulma'],
  ['bacağı saatlerce sıkıştı', 'ezilme-yaralanmasi'],
  ['kafasini carpti kusuyor', 'yaralanma-bas-travmasi'],
  ['yüksekten düştü bacaklarını hissetmiyor', 'yaralanma-omurga'],
  ['gözüme çamaşır suyu kaçtı', 'yaralanma-goz'],
  ['dişi kırıldı', 'yaralanma-dis'],
  ['kaburgam kırıldı', 'yaralanma-gogus'],
  ['karnindan bicaklandi', 'yaralanma-karin'],
  ['parmağı koptu', 'yaralanma-uzuv-kopmasi'],
  ['bıçak saplandı çıkarayım mı', 'yaralanma-saplanan-cisim'],
  ['yara iltihaplandi', 'yaralanma-yara-temizleme'],
  ['parmaklarim dondu', 'yaralanma-soguk-isirigi'],
  ['güneşte yandım', 'yaralanma-gunes-yanigi'],
  ['ishal oldum', 'yaralanma-ishal'],
  ['ateşi 39 düşmüyor', 'yaralanma-yuksek-ates'],
  ['çocuğun ateşi var', 'yaralanma-yuksek-ates'],
  ['köpek ısırdı', 'yaralanma-kuduz-isirik'],
  ['kopek isirdi', 'yaralanma-kuduz-isirik'],
  ['sokak köpeği ısırdı kuduz olur mu', 'yaralanma-kuduz-isirik'],
  ['kedi tırmaladı', 'yaralanma-kuduz-isirik'],
  ['kene', 'yaralanma-kene'],
  ['kene yapisti nasil cikaririm', 'yaralanma-kene'],
  ['ayağım su topladı', 'yaralanma-su-toplama'],
  ['bacagima kramp girdi', 'yaralanma-kramp-zorlanma'],

  // Yangın
  ['yangın var', 'yangin'],
  ['evde yangin cikti', 'yangin'],
  ['yangn', 'yangin'],
  ['orman yaniyor', 'orman-yangini'],
  ['yangin tupu nasil kullanilir', 'yangin-sondurucu'],
  ['tavadaki yağ alev aldı', 'yangin-yag'],
  ['priz yaniyor', 'yangin-elektrik'],
  ['araba yanıyor', 'yangin-arac'],
  ['apartmanda yangın merdiven duman dolu', 'yangin-yuksek-bina'],
  ['duman soludu öksürüyor', 'yangin-duman-solunmasi'],
  ['üstüm alev aldı', 'yangin-giysi-tutustu'],
  ['duman dedektörü', 'yangin-kacis-plani'],

  // Orman ve doğa
  ['üşüyor titriyor', 'hipotermi'],
  ['hipotermı', 'hipotermi'],
  ['ormanda kayboldum', 'doga-kaybolma'],
  ['yolumu kaybettim dağdayım', 'doga-kaybolma'],
  ['yilan soktu', 'hayvan-isirigi'],
  ['akrep soktu', 'hayvan-isirigi'],
  ['dağda sis bastı', 'doga-hava-degisimi'],
  ['yürüyüşte düştüm yalnızım', 'doga-yalniz-yaralanma'],

  // Doğada hayatta kalma
  ['ormanda su nerden bulurum', 'hayatta-kalma-su-bulma'],
  ['dere suyu içilir mi', 'hayatta-kalma-su-aritma'],
  ['pusulasız yön bulma', 'hayatta-kalma-yon-gunes'],
  ['kutup yildizi', 'hayatta-kalma-yon-yildiz'],
  ['saatle yön bulma', 'hayatta-kalma-yon-saat'],
  ['pusula nasil kullanilir', 'hayatta-kalma-pusula-harita'],
  ['ates nasil yakilir', 'hayatta-kalma-ates'],
  ['ormanda barınak yapmak', 'hayatta-kalma-barinak'],
  ['helikoptere nasıl işaret veririm', 'hayatta-kalma-isaret'],
  ['ormanda ne yenir', 'hayatta-kalma-yabani-yiyecek'],
  ['dışarıda gece geçirmek zorundayım', 'hayatta-kalma-soguk-gece'],
  ['güneşte susuz kaldım gölge yok', 'hayatta-kalma-sicak'],
  ['dereyi nasil gecerim', 'hayatta-kalma-dere-gecme'],
  ['ayı gördüm', 'hayatta-kalma-vahsi-hayvan'],
  ['düğüm nasıl atılır', 'hayatta-kalma-dugumler'],

  // Nükleer ve kimyasal
  ['radyasyon sizintisi', 'nukleer-radyasyon'],
  ['radyason', 'nukleer-radyasyon'],
  ['nükleer santral patladı', 'nukleer-radyasyon'],
  ['klor gazı kokusu', 'kimyasal-sizinti'],
  ['karantina', 'nukleer-salgin'],
  ['pencereleri naylonla kapatma', 'nukleer-korunma-odasi'],
  ['bomba patladı', 'nukleer-patlama-sonrasi'],
  ['n95 maske nasıl takılır', 'nukleer-maske-kullanimi'],

  // Zehirlenme
  ['sobadan zehirlendik', 'karbonmonoksit'],
  ['karbon monoksit', 'karbonmonoksit'],
  ['çok ilaç içti', 'zehirlenme'],
  ['zehırlendım', 'zehirlenme'],
  ['mantar yedik kusuyoruz', 'zehirlenme-mantar'],
  ['yemekten zehirlendim', 'zehirlenme-gida'],
  ['çocuk çamaşır suyu içti', 'zehirlenme-cocuk-yutma'],
  ['cocuk pil yuttu', 'zehirlenme-cocuk-yutma'],
  ['sahte icki', 'zehirlenme-metanol'],
  ['böcek ilacı içti', 'zehirlenme-tarim-ilaci'],

  // Sel ve heyelan
  ['sel', 'sel'],
  ['sel geldi', 'sel'],
  ['evi su bastı', 'sel'],
  ['dere tasti', 'sel'],
  ['heyelan', 'heyelan'],
  ['toprak kayıyor', 'heyelan'],
  ['deniz çekildi', 'sel-tsunami'],
  ['sunami', 'sel-tsunami'],
  ['sele kapıldım', 'sel-akintiya-kapilma'],
  ['sel sonrasi temizlik', 'sel-sonrasi-temizlik'],
  ['camur akisi', 'sel-camur-akisi'],
  ['arabayla sele kapıldım', 'sel-arac'],
  ['alt geçit su doldu', 'sel-arac'],
  ['sel uyarisi geldi', 'sel-uyarisi'],

  // Fırtına, sıcak, soğuk
  ['sıcak çarpması', 'sicak-carpmasi'],
  ['gunes carpti', 'sicak-carpmasi'],
  ['yıldırım', 'firtina-yildirim'],
  ['kar firtinasi', 'hava-kar-firtinasi'],
  ['çığ düştü', 'hava-cig'],
  ['toz firtinasi', 'hava-toz-firtinasi'],
  ['hortum geliyor', 'hava-hortum'],
  ['aşırı sıcaklar', 'hava-sicak-dalgasi'],
  ['dolu yağıyor', 'hava-dolu'],
  ['dolu arabada', 'hava-dolu'],

  // Su ve gıda
  ['çamaşır suyu kaç damla', 'su-aritma'],
  ['musluk suyu icilir mi', 'su-aritma'],
  ['buzdolabi calismiyor yemekler', 'gida-guvenligi'],
  ['kaç litre su stoklamalıyım', 'su-gida-su-depolama'],
  ['sular kesildi', 'su-gida-evdeki-gizli-su'],
  ['ocak yok ne yiyeceğiz', 'su-gida-pisirmeden-beslenme'],
  ['tavuk dışarıda kaldı', 'su-gida-sicakta-gida'],
  ['asevi hijyeni', 'su-gida-toplu-mutfak'],

  // Barınma
  ['cadir nereye kurulur', 'cadir-barinma'],
  ['toplanma alani nerede', 'toplanma-alani'],
  ['tuvalet yok', 'barinma-acil-tuvalet'],
  ['çadırda soba güvenli mi', 'barinma-guvenli-isitma'],
  ['kışın çadırda donuyoruz', 'barinma-kis-cadir'],
  ['kampta bit', 'barinma-kamp-hijyen'],
  ['kalorifer yok ev buz gibi', 'barinma-sicak-kalma'],

  // Hazırlık ve iletişim
  ['deprem çantasında ne olmalı', 'afet-cantasi'],
  ['telefon cekmiyor', 'iletisim'],
  ['dolabi duvara sabitleme', 'hazirlik-ev-sabitleme'],
  ['aile afet plani', 'hazirlik-aile-afet-plani'],
  ['bagajda ne olmali', 'hazirlik-arac-kiti'],
  ['kimlik fotokopisi', 'hazirlik-belgeler'],
  ['ilk yardim cantasi', 'hazirlik-ilk-yardim-cantasi'],
  ['çocuğum okuldayken deprem olursa', 'hazirlik-is-okul'],
  ['kedi köpek için afet çantası', 'hazirlik-evcil-hayvan'],

  // Bebek, yaşlı ve özel ihtiyaç
  ['bebek bezi yok', 'ozel-gruplar-bebek-bakimi'],
  ['sütüm kesildi', 'ozel-gruplar-bebek-beslenme'],
  ['hamileyim kanama var', 'ozel-gruplar-hamile'],
  ['doğum başladı', 'ozel-gruplar-acil-dogum'],
  ['yaşlı annem', 'ozel-gruplar-yasli'],
  ['tekerlekli sandalye', 'ozel-gruplar-engelli-hareket'],
  ['işitme engelli', 'ozel-gruplar-engelli-gorme-isitme'],
  ['otizmli cocugum', 'ozel-gruplar-engelli-zihinsel'],
  ['insülin', 'ozel-gruplar-kronik-hastalik'],
  ['insulin buzdolabi yok', 'ozel-gruplar-kronik-hastalik'],
  ['ilacım bitti', 'ozel-gruplar-kronik-hastalik'],
  ['kedim kayboldu', 'ozel-gruplar-evcil-hayvan'],

  // Psikoloji
  ['panik atak geciriyorum', 'psikoloji-panik-atak'],
  ['çocuğa depremi nasıl anlatırım', 'psikoloji-cocukla-konusma'],
  ['cocugum altini islatiyor', 'psikoloji-cocuk-stres-belirtileri'],
  ['annemi kaybettim', 'psikoloji-yas'],
  ['uyuyamiyorum', 'psikoloji-uyku-stres'],
  ['tükendim', 'psikoloji-gonullu-tukenmislik'],
  ['aklımdan çıkmıyor', 'psikoloji-travma-tepkileri'],
  ['ölmek istiyorum', 'psikoloji-intihar-dusuncesi'],

  // Elektrik, gaz ve su
  ['gaz kokuyor', 'tesisat-gaz-kacagi'],
  ['dogalgaz kokusu', 'tesisat-gaz-kacagi'],
  ['elektrikler gitti', 'tesisat-elektrik-kesintisi'],
  ['elktrik kesildi', 'tesisat-elektrik-kesintisi'],
  ['jenaratör içeride çalışır mı', 'tesisat-jenerator'],
  ['boru patladi', 'tesisat-boru-patlamasi'],
  ['arabadan telefon şarj etmek', 'tesisat-arabada-sarj'],
  ['şarj', 'tesisat-gunes-powerbank'],
  ['sarjim bitiyor', 'tesisat-gunes-powerbank'],
  ['powerbank', 'tesisat-gunes-powerbank'],
  ['powerbank şişti', 'tesisat-gunes-powerbank'],
  ['tüp', 'tesisat-tup-guvenligi'],
  ['tup kokuyor', 'tesisat-tup-guvenligi'],
  ['tüp gaz kaçırıyor', 'tesisat-tup-guvenligi'],
  ['priz ıslandı', 'tesisat-hasarli-elektrik'],

  // Güvenlik ve düzen
  ['cocugum kayboldu', 'guvenlik-kayip-cocuk'],
  ['sahte bağış', 'guvenlik-yardim-dolandiriciligi'],
  ['çadır kentte taciz', 'guvenlik-cadir-kent'],
  ['yağmacı', 'guvenlik-bos-ev'],
  ['büyük deprem geliyor mu', 'guvenlik-yanlis-bilgi'],

  // Araç ve yolda
  ['kaza yaptim', 'ulasim-trafik-kazasi'],
  ['motosiklet kazası kask çıkarılır mı', 'ulasim-trafik-kazasi'],
  ['tipide arabada kaldık', 'ulasim-karda-mahsur'],
  ['araba suya düştü', 'ulasim-suya-dusen-arac'],
  ['aku bitti', 'ulasim-ariza-aku'],
  ['tahliyede araba kullanma', 'ulasim-tahliye-surus'],
  ['tunelde yangin', 'ulasim-tunel-kopru'],
];

/** Hiçbir rehberle eşleşmemesi gereken sorgular */
const NO_MATCH: string[] = [
  'bugün hava nasıl',
  'maç kaç kaç bitti',
  'en yakın pizzacı nerede',
  'bana bir şiir yaz',
  'dolar kaç tl',
  'qwerty',
  'asdfgh jkl',
  'merhaba',
];

/** Hiçbir rehberle (gövde metni dahil) eşleşmemesi gereken anlamsız girdiler */
const GIBBERISH = ['qwerty', 'asdfgh jkl', 'zxcvbn'];

const deps: RagDeps = { searchGuides, guideToText: guideToText as RagDeps['guideToText'], searchLibraryForContext: async () => [] };

function top3(q: string): string {
  return searchGuides(q, 3)
    .map((h) => `${h.guide.id}=${h.score}`)
    .join(', ');
}

describe('arama kalitesi: sorgu kümesi', () => {
  it('en az 150 sorgu, tüm beklenen rehberler mevcut', () => {
    expect(CASES.length).toBeGreaterThanOrEqual(150);
    for (const [, id] of CASES) expect(getGuide(id), id).toBeDefined();
  });

  it.each(CASES)('Rehber: "%s" → %s', (q, id) => {
    const top = searchGuides(q, 3)[0];
    expect(top?.guide.id, `"${q}" → ${top3(q)}`).toBe(id);
  });

  it.each(CASES)('Fener: "%s" → %s', async (q, id) => {
    const r = await retrieve(q, { deps });
    expect(r.topGuideId, `"${q}" → ${top3(q)}`).toBe(id);
    expect(isRelevantGuide(r.guides[0])).toBe(true);
  });

  it.each(NO_MATCH)('eşleşmemeli: "%s"', async (q) => {
    const r = await retrieve(q, { deps });
    expect(r.guides.map((h) => h.guide.id), `"${q}" → ${top3(q)}`).toEqual([]);
  });

  it.each(GIBBERISH)('anlamsız girdi sonuç vermez: "%s"', (q) => {
    expect(searchGuides(q)).toEqual([]);
  });
});
