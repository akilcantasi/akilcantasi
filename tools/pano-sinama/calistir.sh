#!/bin/sh
# Bilgi noktası panosunun (InfoPointServer.Board) imzalı kayıp ilanı kurallarını Android SDK
# olmadan sınar: durum güncellemesi yalnız ilanın anahtarıyla, Ed25519 yoksa sakla-ve-aktar.
# Sınama vektörleri Node crypto ile üretildi (server/imza-kanonik.mjs kanonikDurum).
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
A=../../android/app/src/main/java/org/akilcantasi/app
javac -encoding UTF-8 -d "$OUT" $A/InfoPointServer.java taklit/android/content/res/AssetManager.java erisim/PanoSinama.java
java -Dstdout.encoding=UTF-8 -cp "$OUT" org.akilcantasi.app.PanoSinama
