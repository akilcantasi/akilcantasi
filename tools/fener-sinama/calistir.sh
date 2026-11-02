#!/bin/sh
# Fener yerel motorunu (android/app/src/main/cpp/fener_jni.cpp) Android SDK olmadan sınar:
# llama.cpp masaüstü için derlenir, JNI kütüphanesi Java'dan gerçek bir GGUF modelle çağrılır.
#   tools/fener-sinama/calistir.sh <llama.cpp-klasörü> <model.gguf> [derleme-klasörü]
set -e
cd "$(dirname "$0")"
LLAMA=${1:?llama.cpp klasörü}
MODEL=${2:?model.gguf}
B=${3:-/tmp/fener-sinama}
JH=$(dirname "$(dirname "$(readlink -f "$(which javac)")")")
cmake -G Ninja -S ../../android/app/src/main/cpp -B "$B" -DLLAMA_DIR="$LLAMA" -DCMAKE_BUILD_TYPE=Release \
  -DBUILD_SHARED_LIBS=ON -DCMAKE_CXX_FLAGS="-I$JH/include -I$JH/include/linux" >/dev/null
ninja -C "$B" fener >/dev/null
OUT=$(mktemp -d)
javac -d "$OUT" ../../android/app/src/main/java/org/akilcantasi/app/FenerMotoru.java Test.java
LD_LIBRARY_PATH="$B:$B/bin" java -Dstdout.encoding=UTF-8 -Djava.library.path="$B" -Darkauc="$B/bin" -cp "$OUT" Test "$MODEL"
