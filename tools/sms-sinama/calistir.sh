#!/bin/sh
# SMS giden kutusunun (SmsKuyrugu.java) kurallarını Android SDK olmadan sınar:
# org.json taklitleri indirici-sinama'dan alınır.
set -e
cd "$(dirname "$0")"
OUT=$(mktemp -d)
javac -d "$OUT" $(find ../indirici-sinama/org -name '*.java') ../../android/app/src/main/java/org/akilcantasi/app/SmsKuyrugu.java Test.java
java -Dstdout.encoding=UTF-8 -cp "$OUT" Test
