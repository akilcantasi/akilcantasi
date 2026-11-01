# Bağımsız doğrulama: sözlük (acil durum cümleleri)

Tarih: 2026-11-01. Dosya: src/tools/sozluk/phrases.ts (65 cümle, 7 dil).

WebSearch kotası dolu olduğu için WebFetch kullanıldı. Erişilen kaynaklar: Glosbe (tr→kmr, en→ar, en→fa, uk→en, kmr→tr), Wiktionary (حامل), omniglot Arapça ve Farsça sayfaları. Erişilemeyenler: omniglot Kurmancî (robots), Wiktionary'nin çoğu sayfası ve çeviri tabloları (url_not_found), ku.wiktionary, TermQuake.

Kural: `verified` yalnızca anahtar kelime bu kaynaklardan biriyle teyit edildiyse ve dilbilgisi standartsa açıldı.

## Doğrulanan sayılar (65 üzerinden)
- İngilizce, Rusça, Ukraynaca, Almanca: 65 (zaten işaretliydi; ders kitabı kalıpları, gözden geçirildi)
- Arapça: 22
- Farsça: 21
- Kürtçe (Kurmancî): 23
- Tüm dilleri doğrulanmış cümle: 18

## Değişiklikler
Çeviri düzeltmeleri:
- t03 ku: "Kê der diêşe?" → "Ku derê te diêşe?" (standart Hawar; êşîn Glosbe'de var)
- t06 ku: özne eklendi, "Ew nikare bêhnê bistîne." (bêhn stendin = nefes almak, Glosbe)
- t08 ar: "أنا مريض بالسكري" → "عندي مرض السكري" (cinsiyetten bağımsız). fa: "(مرض قند)" eklendi (Dari'de yaygın). ku: "Nexweşiya şekir li min heye" (doğal değil) → "Ez nexweşê şekir im. / Ez nexweşa şekir im."
- t09 ku: aynı yapıyla "Ez nexweşê dil im. / Ez nexweşa dil im."
- t11 fa: Dari için "(حامله)" eklendi.
- t13 ar: "بالإسعاف" → "بسيارة الإسعاف" (Glosbe: ambulans = سيارة إسعاف).
- k01 ar: "النجدة!" eklendi.
- k03 ku: "Kes li wir e?" (yanlış yapı) → "Li wir kes heye?"
- k05 ar: "الركام" → "الأنقاض" (en yaygın; Glosbe birinci karşılık; deprem haberlerindeki kalıp "تحت الأنقاض").
- k08 en: "How many people are you?" → "How many of you are there?"
- k14 ku: "erdheja paşîn" → "Dibe ku erd dîsa biheje (erdheja peyhatî)." (Glosbe terimi: erdheja peyhatî).
- i05 ku: "Me sar e" (doğal değil) → "Em diqerisin, ..." (qerisîn = üşümek/donmak, Glosbe; betanî teyitli).
- i06 fa: Dari "(تشناب)" eklendi.
- i07 ku: "pelan" (yaprak) yanlıştı → "pêçekan (pampers)" (pêçek, Glosbe "kundak / bebekler için").
- i08 ku: "Êwirgeh" → "Hêwirgeh" (Glosbe yazımı; TermQuake'te h'siz biçim de var).
- i13 fa: "بلدید" → "بلد هستید" (Dari'ye de uygun).
- a03 ku: "Dayîka" → "Dayika" (dayik). a04 ku: "Xwîşka" → "Xwişka" (Hawar standardı).
- Arapça kadın biçimleri eklendi: t02 مصابة، i03 جائعة، i04 عطشانة; y08 çoğul اتبعوني; a05 okunuşa kadın hitabı.

Okunuş düzeltmeleri: fa بچه "bacce" → "baççe" (i07, a02, a11), fa بیهوش "Bihûş" → "Bihuş", ru "bolnoye syerdtse" → "bolnaye syertse".

Not: hitap tekil eril (هل تسمعني، لا تتحرك…); kadına söylendiğinde de anlaşılır. Başlık yorumuna yazıldı.

## Hâlâ belirsiz (verified:false kalanlar)
- Arapça/Farsça: kelimeleri büyük olasılıkla doğru ama bu oturumda kaynağa ulaşılamayan temel kelimeler (يستطيع التنفس، دواء، حساسية، ماء، طعام، بطانيات، مستشفى; دکتر، دارو، آب، غذا vb.). Wiktionary çeviri tabloları alınamadı; bir anadil konuşanı birkaç dakikada onaylayabilir.
- Arapça k05 "عالق" (mahsur): yaygın ama Glosbe محصور/محاصر veriyor; k14 "هزات ارتدادية" yaygın, Glosbe "توابع/هزة لاحقة" veriyor.
- Farsça t02 "زخمی": Glosbe "مجروح" veriyor; زخمی İran ve Dari'de günlük kullanım, bırakıldı.
- Kurmancî: t08/t09 "nexweşê şekir/dil" yapısı, k04 "lê xin", k05 "asê maye", i07 bebek maması/bez, k14 cümlesi, t13 "Gazî ambulansê bikin". Kurmancî anadil konuşanı kontrol etmeli.
- Rusça i08 "пункт временного размещения" resmi dil; günlük kullanımda "Где убежище?" de anlaşılır ama sığınak (bomba) çağrışımı var, değiştirilmedi.

Test: `npx vitest run tests/eglence.test.ts` → 21/21 geçti.
