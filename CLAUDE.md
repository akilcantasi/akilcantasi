# Akıl Çantası — çalışma kuralları

Bu dosya projede çalışan herkes (insan ya da yapay zekâ) için bağlayıcıdır.

## 1. Kişisel bilgi yasağı (genel kural)

Uygulamanın hiçbir yerinde proje sahibinin ya da herhangi bir gerçek kişinin kişisel bilgisi yer almaz.

- Ad, soyad, kullanıcı adı, e-posta, telefon numarası yazılmaz.
- Ev/iş adresi, yaşanılan ilçe, köy, mahalle, site adı ve bunlara ait koordinatlar yazılmaz.
- Örnekler (yer tutucu metinler, ipuçları, hazır mesaj şablonları, rehber örnekleri, test verileri, belgeler) proje sahibinin hayatı üzerinden verilmez.
- Örnek gerekiyorsa genel ifadeler kullanılır: "okul bahçesi", "toplanma alanı", "Örnek Mahallesi", "Ayşe", "Mehmet". Şehir gerekiyorsa genel ve kişisel bağı olmayan bir yer seçilir (ör. Ankara, Kızılay 39.9208, 32.8541).
- Gerçek veri listeleri (81 ilin radyo frekansları gibi) bu yasağa girmez; bunlar herkese eşit hizmet eden kamu verisidir.
- Test, örnek harita, örnek ZIM ve e2e betikleri de bu kurala uyar.

`tests/kisisel-bilgi.test.ts` bu kuralı otomatik denetler; yasaklı bir ifade eklenirse test kırılır. Listeyi genişletmek serbesttir, daraltmak değildir.

## 2. Dil

Arayüz metinleri, belgeler ve kod yorumları Türkçedir.

## 3. İçerik

Rehberler elle hazırlanır, çalışma anında yapay zekâ tarafından üretilmez. `reviewed: false` olan rehberler arayüzde "henüz incelenmedi" uyarısıyla gösterilir.
