#!/bin/sh
# Android yerel indiricisinin (PaketIndirici.java) mantığını Android SDK olmadan sınar:
# android.* ve org.json için küçük taklitlerle derlenir, yerel bir HTTPS sunucusuna karşı
# paralel bölümlü indirme, duraklat/sürdür, yeniden açılışta kurtarma, SHA-256, iptal ve
# paket bütünlük kaydı (PaketButunlugu: boyut, zaman, kısmi özet; model açılmadan önce denetim) denenir.
#
# İndirici yalnız https ve izinli alan adlarına gider (PaketIndirici.izinliAdres). Sınama bu yüzden
# izinli bir adı (akilcantasi.com) bir hosts dosyasıyla 127.0.0.1'e yönlendirir ve bu ad için
# kendinden imzalı bir sertifika üretir; gerçek siteye hiç bağlanılmaz (vekil sunucu da kapatılır).
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
# erisim/: paket içi yöntemlere erişim (org/ altında değil; sms-sinama org/ taklitlerini paylaşır)
javac -d "$OUT" $(find android org -name '*.java') erisim/SinamaErisim.java ../../android/app/src/main/java/org/akilcantasi/app/PaketIndirici.java ../../android/app/src/main/java/org/akilcantasi/app/PaketButunlugu.java Test.java
keytool -genkeypair -alias sinama -keyalg RSA -keysize 2048 -validity 2 -dname "CN=akilcantasi.com" \
  -ext "SAN=dns:akilcantasi.com" -storetype PKCS12 -keystore "$OUT/sunucu.p12" -storepass sinama -keypass sinama >/dev/null 2>&1
keytool -exportcert -alias sinama -keystore "$OUT/sunucu.p12" -storepass sinama -file "$OUT/sunucu.cer" >/dev/null 2>&1
keytool -importcert -noprompt -alias sinama -file "$OUT/sunucu.cer" -storetype PKCS12 -keystore "$OUT/guven.p12" -storepass sinama >/dev/null 2>&1
printf '127.0.0.1 akilcantasi.com\n' > "$OUT/hosts"
java -Dstdout.encoding=UTF-8 -Djdk.net.hosts.file="$OUT/hosts" \
  -Dhttps.proxyHost= -Dhttp.proxyHost= \
  -Djavax.net.ssl.trustStore="$OUT/guven.p12" -Djavax.net.ssl.trustStorePassword=sinama -Djavax.net.ssl.trustStoreType=PKCS12 \
  -Dsinama.anahtar="$OUT/sunucu.p12" -cp "$OUT" Test
