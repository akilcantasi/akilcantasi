#!/bin/sh
# Enkaz işaretinin (EnkazIsareti.java) Bluetooth içerik kodlamasını ve sarsıntı ölçütünü
# (SarsintiDedektoru.java) Android SDK olmadan sınar.
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
javac -d "$OUT" ../../android/app/src/main/java/org/akilcantasi/app/EnkazIsareti.java ../../android/app/src/main/java/org/akilcantasi/app/SarsintiDedektoru.java ../../android/app/src/main/java/org/akilcantasi/app/Mesajlar.java Test.java
java -Dstdout.encoding=UTF-8 -cp "$OUT" Test
