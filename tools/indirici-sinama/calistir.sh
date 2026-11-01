#!/bin/sh
# Android yerel indiricisinin (PaketIndirici.java) mantığını Android SDK olmadan sınar:
# android.* ve org.json için küçük taklitlerle derlenir, yerel bir HTTP sunucusuna karşı
# paralel bölümlü indirme, duraklat/sürdür, yeniden açılışta kurtarma, SHA-256 ve iptal denenir.
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
javac -d "$OUT" $(find android org -name '*.java') ../../android/app/src/main/java/org/akilcantasi/app/PaketIndirici.java Test.java
java -Dstdout.encoding=UTF-8 -cp "$OUT" Test
