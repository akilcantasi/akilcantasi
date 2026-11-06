#!/bin/sh
# Enkaz işaretinin (EnkazIsareti.java) Bluetooth içerik kodlamasını, sarsıntı ölçütünü
# (SarsintiDedektoru.java) ve mesh komşusunun güvenilmez girdi kurallarını (MeshPeer.java: ad
# temizliği, gelen çerçeve sınırı) ve kurtarıcı mesajı uyarı sınırını (MesajUyariSiniri.java)
# Android SDK olmadan sınar. taklit/: Capacitor JSObject taklidi.
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
A=../../android/app/src/main/java/org/akilcantasi/app
javac -d "$OUT" $A/EnkazIsareti.java $A/SarsintiDedektoru.java $A/Mesajlar.java $A/MesajUyariSiniri.java $A/MeshPeer.java taklit/com/getcapacitor/JSObject.java erisim/MeshSinama.java Test.java
java -Dstdout.encoding=UTF-8 -cp "$OUT" Test
