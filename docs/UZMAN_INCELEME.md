# Uzman incelemesi gereken noktalar

Güncelleme: 2026-11-01. Bu belge eski yazar notlarını ve docs/dogrulama/*.md raporlarındaki
"belirsiz", "uzman gerekli" ve "doğrulanamadı" maddelerini tek listede toplar. Her madde
rehberlerin GÜNCEL metnine (src/content/guides/*.ts) göre kontrol edildi. Sonradan düzeltilmiş
olanlar en sondaki "Çözüldü" listesine alındı.

Okuyucu: ilk yardım eğitmeni, acil tıp uzmanı, AFAD tarzı afet uzmanı.

## Giriş

- Uygulamada 168 rehber var. Hepsi hâlâ `reviewed: false`; hiçbiri bir insan uzman tarafından onaylanmadı.
- Her rehber kaynaklarla bağımsız olarak bir kez daha kontrol edildi. Ancak ortak web arama kotası
  dolduğu için bazı kontroller yalnızca doğrudan açılabilen sayfalarla yapıldı. Bazı iddialar hiç
  kaynakla karşılaştırılamadı; aşağıda "doğrulanamadı" diye geçer.
- AFAD (afad.gov.tr), Türk Kızılay, Sağlık Bakanlığı / HSGM, MEB, Kandilli, OGM ve mevzuat.gov.tr
  sayfaları otomatik erişimi çoğu zaman reddetti. Bu yüzden doğrulama büyük ölçüde RCUK/ERC 2025,
  AHA 2025, NHS, St John Ambulance, American Red Cross, CDC, Ready.gov gibi yabancı kaynaklarla
  yapıldı. Türkiye'ye özgü resmi metinlerle karşılaştırma elle yapılmalı.
- Sabit kural: rehberlerde ilaç dozu yazılmaz. Bazı maddeler bu kural yüzünden açık kalıyor.

Biçim: `rehber-id` (başlık) #adım: "güncel metin" — neden inceleme gerekiyor; çelişen kaynaklar.
Öncelik: [Y] yüksek risk, [O] orta, [D] düşük.

## Yalnızca bir insanın kontrol edebileceği şeyler

1. Çeviriler (src/tools/sozluk/phrases.ts, 65 cümle, 7 dil). Ayrıntı: docs/dogrulama/sozluk.md.
   - Anadil konuşanı gerekli: Arapça (22/65 doğrulandı), Farsça (21/65), Kürtçe Kurmancî (23/65).
     Bütün dillerde doğrulanmış cümle sayısı yalnızca 18.
   - Arapça/Farsça: temel kelimeler (يستطيع التنفس، دواء، حساسية، ماء، طعام، بطانيات، مستشفى;
     دکتر، دارو، آب، غذا) büyük olasılıkla doğru ama kaynakla görülmedi.
   - Arapça k05 "عالق" (mahsur; Glosbe محصور/محاصر veriyor), k14 "هزات ارتدادية" (Glosbe توابع).
   - Farsça t02 "زخمی" (Glosbe مجروح veriyor; günlük kullanım diye bırakıldı).
   - Kurmancî: t08/t09 "Ez nexweşê şekir/dil im", k04 "lê xin", k05 "asê maye", i07 bebek maması ve
     bez, k14 "Dibe ku erd dîsa biheje (erdheja peyhatî)", t13 "Gazî ambulansê bikin".
   - Rusça i08 "пункт временного размещения" resmî bir dil; "убежище" sığınak (bomba) çağrışımı yapıyor.
   - Arapça hitaplar tekil eril; kadına söylenince de anlaşılır ama anadil konuşanı onaylamalı.
2. Türkiye'deki telefon numaraları. Hepsi aranarak ya da resmî sayfadan teyit edilmeli:
   112 (tek acil numara; 177 orman yangını ihbarının 112'ye bağlandığı), 114 (Zehir Danışma),
   186 (elektrik arızası; ev içi şalter için değil, dağıtım şirketi), 187 (doğalgaz acil; LPG
   kaçağında 187 değil 112), 185 (su arızası, İSU/SASKİ), ALO 183 (ASHB), ALO 174 (sahte içki
   bildirimi için önerildi, rehberde yok). Kontörsüz ya da başka operatörden 112 araması (112.gov.tr açılamadı).
3. Uygulama içi yollar: doga-kaybolma #3'teki "Harita → Konumumu söyle" menüsü gerçekte var mı.
4. siviltoplum.gov.tr'deki yardım toplama izni sorgu ekranı ve EGM KADES uygulamasının güncel adı.
5. Resmî metinler: Karayolları Trafik Yönetmeliği (reflektör mesafesi, zorunlu araç gereçleri),
   6831 sayılı Orman Kanunu md. 76, AFAD 2023 hasarlı binadan eşya alma genelgesi, Bakanlık hasar sınıfları.

---

## 1. Hayati ilk yardım (yüksek risk) — 9 açık madde

- [Y] `kanama` (Ciddi kanama) #3: "Kan bezden sızarsa bezi kaldırmayın. Üzerine yeni bez ekleyip
  daha sert bastırın." — St John Ambulance ıslanan bezi kaldırıp yenisiyle yeniden bastırmayı
  öneriyor; Türkiye'deki eğitimler ve Amerikan Kızılhaçı üstüne eklemeyi öğretiyor; RCUK 2025'te
  konu yok. Aynı ifade `doga-yalniz-yaralanma` "yapmayın" listesinde de var. Eğitmen kararı gerekli.
- [Y] `ilk-yardim-kalp-krizi` (Kalp krizi) #7: "Kişi yetişkinse, aspirin alerjisi yoksa ve
  yutabiliyorsa aspirini çiğneyerek almasına yardım edin. Kaç tane alacağını 112 görevlisine sorun."
  — Metin RCUK/ERC 2025'e göre değiştirildi (artık 112 onayına bağlı değil). Sorular: Türkiye'de
  112 KKM uygulamasıyla uyumlu mu? Kan sulandırıcı kullananlar için ayrı uyarı gerekir mi?
  #6 dil altı nitrogliserin için düşük tansiyon / cinsel güç ilacı uyarısı kaynaklarda yok, eklenmedi.
- [O] `ilk-yardim-seker-dusmesi` (Şeker düşmesi): NHS, eğitimli bir yakının glukagon kalemi
  kullanmasından söz ediyor. İlaç kuralı nedeniyle eklenmedi. "Evde glukagon kalemi varsa ve
  kullanmayı biliyorsanız" gibi bir ifade eklenmeli mi?
- [O] `ilk-yardim-astim` (Astım krizi) #7: "Fısfısı kullandığı hâlde kötüleşiyor ya da 5 dakika
  içinde düzelmiyorsa 112'yi arayın." — NHS süreye değil "en yüksek doza ulaşınca" ölçütüne bakıyor
  (puf sayısı doz kuralı yüzünden yazılmadı). "5 dakika" Türk temel ilk yardım eğitiminden; doğrulanamadı.
- [O] `ilk-yardim-anafilaksi`: NHS hamileyi sol yana yatırmayı ve arı iğnesini çıkarmayı da
  öneriyor; rehberde yok. Eklenmeli mi?
- [O] `hava-yolu-tikanmasi` (Boğulma) #8: bilinç kaybında yalnızca "kalp masajı" diyor. RCUK
  çocukta önce 5 kurtarıcı nefesi öneriyor. Çocuk için ayrı not gerekir mi? ERC 2025 tam metni açılamadı.
- [O] `ilk-yardim-sok` (Şok): bacakları "yaklaşık 30 cm" kaldırma. Red Cross 15–30 cm; ERC 2025'in
  şokta bacak kaldırma tutumu okunamadı (2021: "geçici olarak düşünülebilir"); MEB/Sağlık Bakanlığı
  "30 cm" kaynağı açılamadı. Not: `ilk-yardim-bayilma` #5 "biraz yükseltin" olarak değiştirildi;
  iki rehber arasında ifade birliği istenebilir.
- [D] `ilk-yardim-suda-bogulma` #10: "...saatler sonra nefes sorunu çıkabilir." — açılan
  kaynaklarda doğrudan geçmiyor; klinik olarak bilinen bir durum, onay istenir.
- [D] `ilk-yardim-oed` / `temel-yasam-destegi`: kalp pili üstüne ped koymama, ilaç bandını
  çıkarma, ıslak zemin uyarısı ve "2 dakikada bir yer değiştirin" doğrulanamadı (AHA 2025 yetişkin
  sayfası 2020 metnini gösteriyordu). `nobet` #9'daki "hamile" ve "6 aylıktan küçük bebek"
  112 ölçütleri de açılan sayfalarda yok (AHA 2024'e dayandığı belirtilmiş).

## 2. Yaralanma — 10 açık madde

- [Y] `ezilme-yaralanmasi` (Ezilme yaralanması) #4: "Sağlık ekibine ulaşmak mümkünse, uzun süre
  ezilmiş uzvun üzerindeki yükü onlar gelmeden kaldırmayın." — Kızılay, UMKE, ISN önerilerine
  erişilemedi. Güncel İngiltere ön-hastane uzlaşısı (Faculty of Pre-Hospital Care) "kurtarmayı
  geciktirmeyin, yükü erken kaldırın" yönünde; eski "15 dakika kuralı" ile çelişebilir. Turnike ve
  bilinci açık kişiye ağızdan sıvı verme konusu da rehberde yok. Acil tıp uzmanı karar vermeli.
- [Y] `yaralanma-gogus` (Göğüs yaralanması) #3: "Göğüste açık yara varsa açık bırakın. Üstünü
  naylon ya da bantla hava geçirmez şekilde kapatmayın." — ERC 2025 "kapatmayın" diyor; ICRC üç
  kenarı bantlı pansuman öneriyor. ERC 2021/2025 ve IFRC metinleri bu turda açılamadı; karar önceki
  bilgiye dayanıyor.
- [O] `yanik` (Yanık) #9: kimyasal yanıkta "en az 20 dakika, yardım gelene kadar" yıkama. NHS
  yaklaşık 1 saat öneriyor. Süre uzatılmalı mı?
- [O] `yaralanma-omurga`: Mayo, kalp masajında başı geriye yatırmadan çene itmeyi öneriyor; rehber
  yalnızca kalp masajı diyor. Sıradan kişi için kabul edilebilir mi? #8'e "mümkünse yardımcıyla" eklenebilir.
- [O] `yaralanma-ishal` #3: "1 litre temiz içme suyuna 6 silme çay kaşığı şeker ve yarım silme çay
  kaşığı tuz" — WHO "teaspoon" 5 mL; Türk çay kaşığı 2,5–3,5 mL, karışım seyreltik olur (zararsız,
  daha az etkili). HSGM tarifinde hangi kaşık kullanılıyor?
- [O] `yaralanma-kuduz-isirik` #3 ve #7: "varsa alkol ya da iyotlu antiseptik sürün", "Kedi ve
  köpekler 10 gün gözlenir" — HSGM Kuduz Profilaksi Rehberi açılamadı; yeniden teyit edilmeli.
  #9 bildirim yeri (tarım ve orman müdürlüğü; belediye/veteriner de anılabilir).
- [O] `yaralanma-kene` #8–9: "10 gün içinde ... belirti" ve kanamada 112 — HSGM KKKA sayfası açılamadı.
- [O] `yaralanma-dis` #7: "Dişin ağız dışında geçen ilk 30–60 dakikası çok önemlidir." — IADT'nin
  60 dakikalık kuru süre eşiğine dayanıyor; doğrulanamadı. Diş hekimi onayı. #8'deki "10 dakika
  bastırın" da doğrulanamadı.
- [D] `yaralanma-karin` (karın yaralanması) ve kopma/turnike rehberi ("5–7 cm", ERC 2021'den):
  bu oturumda birincil kaynakla doğrulanmadı. Donmada 37–39 °C su değeri WMS'den; WMS açılamadı.
- [D] Küçük eksikler (eklenip eklenmeyeceği uzman kararı): burun kanamasında NHS ölçütleri (2 yaş
  altı, sık tekrar, kan sulandırıcı, kan yutup kusma); kırıkta yiyip içmeme (afette saatlerce yardım
  gelmeyebilir); `yaralanma-goz` #7 "sağlam gözü de kapalı tutun" NHS'te yok; ishal ve kramp
  rehberlerindeki genel öneriler (su toplamada bantlama, diyabette ayak kontrolü).

## 3. Zehirlenme — 5 açık madde

- [Y] `zehirlenme-cocuk-yutma` #4 (düğme pil): NCPC, 12 aydan büyük çocukta son 12 saatte lityum
  düğme pil yutulduysa yolda bal verilmesini öneriyor; doz içerdiği için eklenmedi. Doz yazmadan
  ("bal verin, 114'e sorun") eklenmeli mi? Ayrıca pil sonrası ağızdan alım: NCPC "röntgene kadar
  hiçbir şey" diyor, BfR çay/su/meyve suyu öneriyor. Çocuk acil hekimi / toksikolog kararı.
- [O] `zehirlenme` (genel): yakıcı madde yutmada az su içirme. BfR çay/su/meyve suyu öneriyor, NHS
  hiçbir şey vermeyin diyor. Rehber güvenli taraf olarak 114'e yönlendiriyor; onay istenir.
- [O] `zehirlenme-metanol` #3: "Belirtiler içtikten 12–24 saat sonra başlayabilir." — MSF/WHO
  sayfaları açılamadı. Sahte içki bildirim kanalı (ALO 174 / Jandarma / Emniyet) eklenmeli mi?
- [O] `zehirlenme-mantar` #6 ve `hayatta-kalma-yabani-yiyecek` #7: "6 saat ya da daha sonra" eşiği
  toksikolog ya da UZEM metniyle teyit edilmeli. Sağlık Bakanlığı açıklaması açılamadı.
- [D] `zehirlenme-gida` #6: "39 dereceye yakın ya da daha yüksek ateş" — CDC'nin 102 °F (38,9 °C)
  değerinin çevirisi. "Şişmiş konserveyi açmadan atın" CDC'nin ilgili sayfasında doğrudan görülmedi.

## 4. Anne, bebek ve özel gruplar — 8 açık madde

- [Y] Rehberler arası çelişki, bebek maması suyu: `ozel-gruplar-bebek-beslenme` #6 WHO'ya göre
  düzeltildi: "1 dakika fokurdayarak kaynatıp en çok 30 dakika beklettiğiniz sıcak suyla
  hazırlayın" (≥70 °C, Cronobacter). Ama `gida-guvenligi` #10 ve `su-gida-pisirmeden-beslenme` #7
  hâlâ "Toz mamayı yalnızca şişe suyla ya da kaynatılıp soğutulmuş suyla hazırlayın" diyor.
  Ayrıca WHO şişe suyunun steril olmadığını ve kaynatılmasını öneriyor; CDC afette şişe suyunu
  kabul ediyor. Üç rehber tek ifadede birleşmeli. → 1 Kasım: üçü de WHO ifadesine (kaynatılmış ≥70 °C su, şişe suyu da kaynatılır) birleştirildi; CDC farkı uzman kararına bırakıldı.
- [Y] `ozel-gruplar-acil-dogum` (Yardım gelmeden doğum başlarsa) — ebe / kadın doğum uzmanı görmeli:
  - #8: "Bebek ağlamıyor ya da nefes almıyorsa sırtını ve ayak tabanlarını ovun." (ERC 2025
    yenidoğan: kurulama ve uyarma; kontrol edilmeli).
  - #9: "Kordonu kesmeyin, bağlamayın, çekmeyin. Eş (plasenta) kendiliğinden gelirse bir poşete
    koyun, bebeğin yanında tutun." Plasenta bebekle aynı seviyede ya da yukarıda mı tutulmalı?
  - #5 (yeni): "Kordon bebeğin boynuna dolanmışsa parmağınızla gevşetip başının üstünden kaydırın."
  - Eksik: kordon sarkması (diz-göğüs pozisyonu?), makat geliş, doğum sonrası ağır kanamada rahim masajı.
- [O] `ozel-gruplar-hamile` #2 ve #4: tehlike işaretleri CDC Hear Her'den; Sağlık Bakanlığı
  "Gebelikte tehlike işaretleri" listesi açılamadı, karşılaştırılmalı. #2'deki "düzenli kasılmalar"
  37. haftadan önce ve sonra ayrımı yapılmamış (112 yönlendirmesi güvenli tarafta).
- [O] `ozel-gruplar` (Bebek bakımı) #9: "günde 6'dan az ıslak bez" — bazı kaynaklar "3 saattir ıslak
  bez yok" ölçütünü kullanıyor; AAP metniyle karşılaştırılmalı. Anahtar kelimelerde "bebek ishal
  oldu" var ama ishal adımı yok.
- [O] `ozel-gruplar-kronik-hastalik` #7–8: "Son seansınızdan sonra en geç 3 gün içinde diyalize
  girmeye çalışın" ve "muz, portakal, patates, domates gibi potasyumlu yiyecekleri azaltın" —
  genel öneri; nefrolog onayı.
- [O] `ozel-gruplar-kronik-hastalik` #6: "kesme şeker ya da meyve suyu alın; 15 dakika sonra
  yeniden ölçün" — `ilk-yardim-seker-dusmesi` artık miktar veriyor (3–4 küp şeker, ~150 ml); ifade birliği.
- [O] `ozel-gruplar-engelli-hareket` #5–6: sandalyeyi kolçak ya da ayaklıktan kaldırmama ve
  merdivende en az 2 kişi. Fizyoterapist ya da AKUT/itfaiye tahliye eğitmeni kontrol etmeli.
- [D] Kayıp çocuk ve şiddet rehberleri: refakatsiz çocuğun ALO 183'e teslimi ve UNICEF Türkiye
  adımları önceki kontrole dayanıyor; IASC/UNFPA ve KADES sayfaları açılamadı.

## 5. Psikolojik ilk yardım — 4 açık madde

- [Y] `psikoloji-intihar-dusuncesi` #5 ve #10: yalnızca 112 öneriliyor ("Siz de böyle
  düşünüyorsanız güvendiğiniz birine şimdi söyleyin ya da 112'yi arayın."). Türkiye'de 112
  dışında doğrulanmış bir kriz hattı bulunamadı. Varsa resmî bir hat eklenmeli.
- [O] `psikoloji-cocuk-stres-belirtileri` #8: "Belirtiler 4 haftadan uzun sürerse ya da günlük
  hayatı bozarsa ... destek isteyin." — akut stres / TSSB ayrımına dayanan temkinli eşik; çocuk
  psikiyatristi onayı.
- [D] WHO PFA (Türkçe), SAMHSA, NCTSN ve CDC afet sonrası stres sayfaları açılamadı; PFA metniyle
  satır satır karşılaştırma yapılmadı. "Birkaç gün üst üste günlük işleri engelliyorsa" ölçütü eski
  CDC metnine dayanıyor.
- [D] `psikoloji-panik-atak`: kese kâğıdı yasağı, #5 "5 şeyin adını sesli söyleyin" ve 112 ölçütleri
  (ilk kez göğüs ağrısı, kalp hastalığı, bayılma) kaynakla eşleşmedi. `psikoloji-uyku-stres` #7 ve
  #9 ("haftalarca"; NHS "aylar" diyor) da öyle. Hepsi zararsız, güvenli tarafta.

## 6. Hava olayları, KBRN — 8 açık madde

- [Y] `sicak-carpmasi` (Sıcak çarpması) #4: "mümkünse boynuna kadar soğuk suya sokun, başını dışarıda
  tutun" — ERC 2021'e dayanıyor; ERC 2025 First Aid açılamadı. NHS ve NWS daldırmadan değil "cool
  bath"tan söz ediyor. "Ateş düşürücü vermeyin" kaynakta yok.
- [O] `hava-cig` (Çığ): yakalanınca yana kaçma, ekipmanı bırakma, yüzme hareketi, yüz önünde hava
  boşluğu, "önce yüzü/ağzı açın". SLF/KAT açılamadı. Dağ kurtarma uzmanı (AFAD/JAK) bakmalı.
- [O] `hava-toz-firtinasi` #7: "Yol dışında durunca tüm ışıkları kapatın" — NWS "dörtlüler dahil"
  diyor; Türkiye'deki dörtlü yakma alışkanlığıyla çelişebilir. #3'teki "ıslak bez" maske kadar
  korumaz; FFP2, astım planı ve devridaim NSW Health'ten doğrulanamadı.
- [O] `hava-sicak-dalgasi` #1 ve `hayatta-kalma-sicak` #1: "10.00–16.00". NHS 11.00–15.00 diyor;
  Sağlık Bakanlığı'nın değeri yalnızca haberlerden alındı. Bakanlık metniyle eşleştirilmeli.
- [O] `nukleer` / `nukleer-korunma-odasi`: uzun süre sıkıca kapatılmış küçük odada hava yetersizliği
  uyarısı yok (yetkililer genelde kısa süreli kapatma önerir). Türkiye'de satılan FFP2'lerin çoğu
  kulak askılı; maske adımı yalnız kafa bantlı modeli anlatıyor.
- [O] `kimyasal-sizinti` #5: "Mümkün olan en üst kattaki ... iç odaya geçin" ve şüpheli paket adımı
  (dokunma, sallama, odadan çık, el yıka, 112) kaynakla okunamadı (FBI/CDC 2001 önerileriyle uyumlu bilinir).
- [D] `firtina-yildirim` #8: "Yıldırım çarpan kişiye dokunmak güvenlidir" (NWS'de bilinir, sayfa açılmadı).
- [D] `hava-hortum` #3 (şilte, kask; köprü altına sığınmama), dolu güvenliği maddeleri, buz sarkıtı
  uyarısı: kaynaklarda doğrudan görülmedi, mantıklı ve tehlikesiz.

## 7. Deprem, yangın, sel — 11 açık madde

- [Y] `deprem-sonrasi` #4: "Güvenliyse doğalgaz vanasını, elektrik şalterini ve su vanasını
  kapatın." — AFAD önerisi olduğu söyleniyor ama sayfa açılamadı. ABD'de kural "gazı yalnızca koku
  ya da tıslama varsa kapatın". AFAD ve İGDAŞ/BOTAŞ metniyle karşılaştırılmalı. Kapatılan gazı yalnız
  yetkilinin açması uyarısı rehberde yok.
- [O] `deprem-yuksek-bina` #6: "Asansördeyseniz bütün kat düğmelerine basın ve ilk açılan katta
  inin." — açılan hiçbir kaynakta yok (Japonya'da yaygın). AFAD'ın asansör önerisiyle karşılaştırılmalı.
- [O] `deprem-kalabalik-alan` #6–7: toplu taşıma adımları ve metroda acil kol yasağı için kaynak yok.
  Metro İstanbul ve TCDD/Marmaray yönergeleriyle karşılaştırılmalı.
- [O] `enkaz-kurtarma` #9 işaretleme biçimi INSARAG/AFAD işaretlemesine uymayabilir; adımlar CERT Unit 5
  ve AFAD gönüllü eğitimiyle karşılaştırılmalı. `enkaz-altinda` #5 "Kurtarıcılar sessizlik
  istediğinde ses verin" (sessizlik saati) ve "suyunuz varsa az az için" kaynaksız.
- [O] `deprem-hasarli-bina`: hasar sınıfları, "orta hasarlıda onarım yapılmadan oturmayın" ve 2023
  genelgesindeki "görevli eşliğinde eşya alma" doğrulanamadı. `deprem-cocuklar`: bebeği göğse alma,
  emzirirken yerinde kalma, "60'a kadar sayma" ShakeOut notuna dayanıyor, belge açılamadı.
  `deprem` "masa yoksa" ifadesi AFAD'la karşılaştırılmadı (CDC: devrilmeyecek alçak eşyanın yanı).
- [O] `yangin-yuksek-bina` #6 ve kaçış adımları: başka katta yangında "koridor ve merdiven dumansızsa
  çıkın" (NFPA) ile Toronto'nun "yanmaz binada dairede kalın" yaklaşımı farklı. Türkiye'deki eski,
  yangın bölmesi olmayan apartmanlar için itfaiye uzmanı karar vermeli. "Camı kırmayın" kaynaksız.
- [O] `orman-yangini` #7: "Farları açık bırakıp motoru kapatın" — CAL FIRE'ın güncel sayfasında
  yok; Avustralya CFA motoru çalışır, klimayı iç devrede tutmayı öneriyor. OGM sayfası açılamadı.
- [O] `yangin-duman-solunmasi` #9: "24–36 saat bu belirtileri izleyin" — süre kaynakla doğrulanamadı.
- [D] `yangin-sondurucu` #3: "Ateşe 2–3 metre uzakta durun." USFA'da yok; OSHA eğitimleri 2–2,5 m.
  USFA'nın "küçük çocuklar ve yaşlılar söndürücü kullanmasın" önerisi eklenmedi. Mutfak ve elektrik
  yangını adımları NFPA/LFB ile birebir eşleşmedi.
- [O] `sel-arac` #5–7: batan araçtan çıkış sırası (kemer → cam → çocuklar → siz), "kapıyı açmaya
  uğraşmayın". `ulasim-suya-dusen-arac` "önce büyük çocuk", "bir dakikadan kısa süre su üstünde
  kalır". Giesbrecht önerisiyle uyumlu ama kaynak açılamadı; soğuk su / su kurtarma uzmanı bakmalı.
- [D] `sel-akintiya-kapilma` #3 "Ayaklarınız önde ve akıntı yönünde olsun" ve akarsu öz-kurtarma
  ayrıntıları; tsunami rehberinde "Marmara ve Ege'de dalga birkaç dakikada gelebilir", 1999 İzmit
  tsunamisi (Kandilli açılamadı), "üst katlara çıkma"; heyelanda "top gibi kıvrılın". Kaynaksız.

## 8. Doğada hayatta kalma — 6 açık madde

- [O] `doga` (Hipotermi) #5: "boyun, göğüs ve kasığa beze sarılı ılık termofor ya da ılık su şişesi
  koyun" — NHS sıcak su torbasını hiç önermiyor, Mayo gövdeye sarılı ılık şişeye izin veriyor.
- [O] Düdük işareti, `doga-kaybolma` #5: "1 dakika boyunca 10 saniyede bir düdük çalın (6 ses)".
  Alp sistemi (MREW) dakikada 6; 3 ses başka yerlerde çağrı, Alp sisteminde yanıt. MREW sayfası
  ve ICAO sembol boyutu açılamadı.
- [O] Yön bulma: saatle yön bulmada Türkiye UTC+3 için "1'i kullanın" kuralı ajanın kendi hesabı
  (Malatya/Elazığ gibi doğu illerinde öğle ~12:30). Pusulada sapma düzeltmesinin yönü bilerek
  yazılmadı; Türkiye için basit bir kural eklenmeli mi? Dağ arama-kurtarma (JAK) uzmanı tüm rehberi görmeli.
- [O] Ateş yakma: `hayatta-kalma-ates` #1 "orman içinde ve yakınında izinsiz ateş yasaktır" —
  6831 sayılı Kanun md. 76 ve dönemsel il yasakları kontrol edilmeli.
- [D] Akarsu geçişi (diz derinliği, sabah geçişi, kemerleri açma, sırtüstü ve ayaklar akıntı
  yönünde), "birkaç saatte ya da bir günde iner" süresi; köpek sürüsü ve yaban domuzu adımları;
  akrep/engerek için UZEM teyidi; böcek sokmasında sabunlu suyla yıkama eksik.
- [D] Su arıtma değerleri: 2000 m üstü 3 dk, SODIS 6 saat / bulutluda 2 gün / ≤2 L PET, klor ve
  iyotun Cryptosporidium'a zayıflığı, bekleme süresi 15–20 dk (FM 21-76: 10–15 dk). CDC açılamadı;
  değerler bilinen CDC/Eawag değerleriyle uyumlu.

## 9. Su, gıda, barınma, tesisat — 9 açık madde

- [O] Rehberler arası çelişki, düşmüş elektrik teli mesafesi: `ilk-yardim-elektrik-carpmasi` #3
  "En az 20 metre" ama `tesisat-elektrik-kesintisi` #10 ve `tesisat-hasarli-elektrik` #5 "en az 12
  metre" (Kızılhaç 35 ft ≈ 11 m'den). Kaynaklar 8–18 m arası. Tek değer seçilmeli. → 1 Kasım: ihtiyatlı olarak üçü (ve çizim) "en az 20 metre" yapıldı; uzman onaylamalı.
- [O] `su-gida` #5: "Berrak suya 1 litre için 2 damla ... Etikette %1 gibi düşük oran yazıyorsa 1
  litreye 10 damla" — oran %5–9 sodyum hipoklorit için. Türkiye'deki ürünlerin oranları ve 10 damla
  değeri kontrol edilmeli. "Sıfır klor" ürünler dezenfekte etmez (rehberde var).
- [O] `barinma-acil-tuvalet` #7: "su kaynaklarından en az 30 metre" — NPS/Leave No Trace en az
  ~60 m (200 ft) öneriyor; 30 m büyük olasılıkla Sphere değeri. "En az 30 m, mümkünse 60 m" denebilir.
  #1 "sifon çekmeyin" ve #2 kova tuvalet yöntemi doğrulanamadı.
- [O] `barinma` #3: "Çadırlar arasında en az 2 metre ... binalardan en az 6 metre" — HSGM ve
  Sphere açılamadı. `su-gida-toplu-mutfak` #9'daki 6 m de aynı kaynağa dayanıyor.
- [O] Soba ve ısıtma: uyumadan önce sobayı söndürme, soba borusunun çadırdan geçtiği yerde yanmaz
  koruma, çadırda kar yükü, yatağı yerden yükseltme. Kaynaksız; itfaiye/barınma uzmanı.
- [O] Tesisat: ana vana (sayaç yanı, kolu boruya dik, saat yönünde), boşaltma sırası, kombi/termosifon
  (`su-gida-evdeki-gizli-su` #4 "Kombi ve şofbenin deposu yoktur"; bazı kombilerde küçük boyler
  olabilir), LPG hortum kuralları, sabunlu su testi, merdiven altı yasağı. Yetkili kaynak bulunamadı.
- [O] Şarj: araç aküsünden takviye ve şarj, güneş paneli / powerbank, lityum pil uyarıları
  (`tesisat-gunes-powerbank`). CPSC, NFPA, LFB vb. açılmadı; itfaiye / pil güvenliği uzmanı.
- [D] `su-gida-su-depolama` #1: "4–5 litre" (CDC 3,8 L; HSGM'nin 5 L değeri doğrulanamadı).
  Araçlar sekmesindeki su hesabı: kişi başı 3 L içme + 2 L hijyen = 5 L (Sphere aralığının üstü);
  bebek mama suyu 1 L/gün tahmini.
- [D] `su-gida-pisirmeden-beslenme` #6 "tuzlu yiyeceklerden kaçının" (FEMA broşürü); 5 °C (WHO)
  ile 4 °C (ABD) farkı; `barinma-sicak-kalma` rehberinde hipotermi belirtileri ve 112 ölçütü yok
  (`barinma-kis-cadir`'da var). Bit için dikiş yerlerini ütüleme kaynaksız.

## 10. Hazırlık, güvenlik, ulaşım — 6 açık madde

- [O] Reflektör üçgeni, `ulasim-trafik-kazasi`: MEB "şehir içinde en az 30 m, şehirlerarası 150 m";
  sürücü kursu metni "150 m'den görünür, en az 30 m". "Çift yönlü yolda önüne de koyun" ifadesi
  Karayolları Trafik Yönetmeliği'yle karşılaştırılmalı (mevzuat.gov.tr açılamadı).
- [O] `ulasim` #8: "Motosikletlinin kaskını çıkarmayın. Yalnızca nefes almıyorsa ya da hava yolu
  tıkalıysa iki kişi çıkarsın" — uluslararası uygulamayla uyumlu, NSW kaynağı açılamadı.
- [O] `ulasim-tunel-kopru` #8 ve `deprem` #9: depremde köprüde aracı durdurup sarsıntıdan sonra
  yürüyerek çıkma; tünelde araçta beklememe (KGM, PIARC açılamadı). AFAD "araçtaysanız" metniyle
  karşılaştırılmalı. `ulasim-tahliye-surus` #8 "anahtarı üstünde bırakın" Ready.gov'dan doğrulanamadı.
- [O] `hazirlik-arac-kiti`: yönetmelikteki zorunlu gereç listesi (ilk yardım çantası, 1 kg KKT'li
  söndürücü, 2 reflektör). `hazirlik` afet çantası listesi AFAD'ın kendi listesiyle karşılaştırılmadı
  (haberlerdeki alıntılara dayanıyor).
- [D] `hazirlik-ev-sabitleme` #10: deprem anında gazı kesen sismik vana (İGDAŞ/EPDK açılamadı);
  okul/büro rehberinde adım 6'nın AFAD'daki zamanlaması; evcil hayvanda mikroçip zorunluluğu.
- [D] Kaynaksız genel ifadeler: "kar yemeyin", "deprem önceden tahmin edilemez", eş sistemi (buddy),
  "şehir dışı haber kişisi" ve "iki buluşma yeri", `tesisat-elektrik-kesintisi` "bir lambayı açık
  bırakın". Pil tasarrufu ipuçları genel FCC/Ready.gov bilgisine dayanıyor.

## 11. Yazılım ve donanım (uzman dışı, test gerekli) — 2 açık madde

- Android şebekesiz mesh: Java/Nearby kısmı hiçbir cihazda çalıştırılmadı (Android SDK yok);
  docs/MESH.md'deki iki telefonlu test planı uygulanmalı.
- tools/pi betikleri gerçek bir Raspberry Pi'de çalıştırılmadı; README'deki güç ve güneş paneli
  değerleri tahmindir.

Resimler bu belgenin konusu değil: yanlış teknik gösteren 107 çizim (39 yüksek öncelikli) için
docs/dogrulama/YENIDEN_CIZIM.md'ye bakın. En önemlileri `cpr-adult` (kollar bükük, 17 kullanım)
ve `recovery-position` (üst bacak bükülü değil, 14 kullanım).

---

## Çözüldü (sonraki doğrulamada kaynakla teyit edildi ya da metin düzeltildi)

- Bebek KPR: iki başparmakla sarma, saramıyorsa tek el topuğu (RCUK 2025, AHA 2025; iki parmak kaldırıldı).
- Çocuk KPR: 30:2, yalnızca eğitimliyse 15:2; telefonsuz önce 1 dakika; <25 kg (≈8 yaş) eşiği (RCUK PBLS).
- TYD sırası: hoparlörle 112, bağlanırken nefes kontrolü; 5–6 cm, 100–120/dk (RCUK Adult BLS).
- Turnike yaranın 5–7 cm üstü, eklem üstüne değil (RCUK 2025 First Aid). Hemostatik gazlı bez ve
  112 görevlisinin istediği doğaçlama turnike eklendi; yara paketleme RCUK ile uyumlu.
- İlk değerlendirme sırası: güvenlik → yanıt → hayati kanama → 112 → nefes (RCUK 2025).
- Derlenme pozisyonu: 30 dakikada bir öbür yana çevirme eklendi (St John).
- Anafilaksi: 5 dakika sonra öbür uyluğa ikinci kalem (RCUK 2025); kalem yoksa hemen 112 eklendi.
- Astım: inhaler yoksa 112 ölçütü eklendi (NHS).
- Elektrik çarpması: düşmüş tele en az 20 m (St John WA 8 m, UK 18 m); "ev elektriğinde" ayrımı eklendi.
- Kalp krizi: aspirin artık 112 onayına bağlı değil (RCUK/ERC 2025); nitrogliserin ifadesi netleşti.
  (KKM uyumu sorusu yukarıda açık.)
- Hipoglisemi: 3–4 küp şeker / ~150 ml meyve suyu, 15 dakikada düzelmezse tekrar ve 112 (RCUK, SJA).
- Bayılma: "1 dakikada kendine gelmezse 112" (NHS); "30 cm" yerine "biraz yükseltin"; hamilede yan yatırma.
- İnme: "10 saniye kol tutma" ve "başı yüksekte yatırın" çıkarıldı; bilinç bulanıklığında yan yatırma (Red Cross).
- Nöbet: "10 dakikada kendine gelmiyorsa 112" (SJA).
- Boğulma: hamile/iri kişide göğüs basısı ölçütü AHA 2025'e göre; bebekte boğulma RCUK ile uyumlu.
- Bebek maması: `ozel-gruplar-bebek-beslenme` #6 WHO ≥70 °C kuralına göre düzeltildi (diğer iki rehber açık).
- Hamile: CDC Hear Her'deki bacakta ağrılı şişlik ve durmayan kusma eklendi; hareketsizlik yerine yürüme önerisi.
- Acil doğum: kordonu kesmeme bilerek yazıldı ve kaynaklarla (St John / Kızılhaç kartları) uyumlu.
- Yıldırım: çömelme pozisyonu yalnızca açıkta kalanlar için son çare; NWS ile çelişmiyor.
- Sözlük: 20'den fazla çeviri düzeltmesi yapıldı (docs/dogrulama/sozluk.md, "Değişiklikler").
