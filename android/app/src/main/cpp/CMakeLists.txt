# Fener yerel motoru: llama.cpp + JNI köprüsü (libfener.so).
#
# llama.cpp kaynakları bu klasörde "llama.cpp/" altında beklenir. Depoda yoktur; APK derlemesinde
# (.github/workflows/apk.yml) sabitlenmiş sürümü indirilir. Klasör yoksa app/build.gradle yerel
# derlemeyi hiç başlatmaz ve uygulama yalnızca WebView'daki motorla çalışır.
#
# Masaüstü sınaması: tools/fener-sinama/calistir.sh (aynı dosyalar, Linux'ta).
cmake_minimum_required(VERSION 3.22)
project(fener C CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

if(NOT DEFINED LLAMA_DIR)
    set(LLAMA_DIR ${CMAKE_CURRENT_LIST_DIR}/llama.cpp)
endif()

# Yalnız kütüphane ve ortak yardımcılar; araçlar, sunucu, örnekler, testler yok
set(LLAMA_BUILD_COMMON ON CACHE BOOL "" FORCE)
set(LLAMA_BUILD_TESTS OFF CACHE BOOL "" FORCE)
set(LLAMA_BUILD_TOOLS OFF CACHE BOOL "" FORCE)
set(LLAMA_BUILD_EXAMPLES OFF CACHE BOOL "" FORCE)
set(LLAMA_BUILD_SERVER OFF CACHE BOOL "" FORCE)
set(LLAMA_BUILD_APP OFF CACHE BOOL "" FORCE)
set(LLAMA_OPENSSL OFF CACHE BOOL "" FORCE)
set(GGML_NATIVE OFF CACHE BOOL "" FORCE)
set(GGML_LLAMAFILE OFF CACHE BOOL "" FORCE)

if(ANDROID)
    if(ANDROID_ABI STREQUAL "arm64-v8a")
        # İşlemciye göre en iyi türev çalışırken seçilir (dotprod, i8mm, SVE…); arka uçlar ayrı .so
        set(BUILD_SHARED_LIBS ON CACHE BOOL "" FORCE)
        set(GGML_BACKEND_DL ON CACHE BOOL "" FORCE)
        set(GGML_CPU_ALL_VARIANTS ON CACHE BOOL "" FORCE)
        set(GGML_CPU_KLEIDIAI ON CACHE BOOL "" FORCE)
        set(GGML_OPENMP ON CACHE BOOL "" FORCE)
        # Adreno GPU (OpenCL). Başlıklar ve bağlama kütüphanesi derlemede verilirse açılır;
        # telefonda üreticinin libOpenCL.so'su yoksa bu arka uç yüklenmez, işlemci kullanılır.
        if(DEFINED FENER_OPENCL_DIR AND EXISTS "${FENER_OPENCL_DIR}/include/CL/cl.h")
            set(GGML_OPENCL ON CACHE BOOL "" FORCE)
            set(GGML_OPENCL_EMBED_KERNELS ON CACHE BOOL "" FORCE)
            set(GGML_OPENCL_USE_ADRENO_KERNELS ON CACHE BOOL "" FORCE)
            set(OpenCL_INCLUDE_DIR "${FENER_OPENCL_DIR}/include" CACHE PATH "" FORCE)
            set(OpenCL_LIBRARY "${FENER_OPENCL_DIR}/lib/libOpenCL.so" CACHE FILEPATH "" FORCE)
            message(STATUS "Fener: OpenCL (Adreno GPU) arka ucu açık")
        endif()
    else()
        # 32 bit ARM ve x86: tek kütüphane, yalnız işlemci
        set(BUILD_SHARED_LIBS OFF CACHE BOOL "" FORCE)
        set(GGML_BACKEND_DL OFF CACHE BOOL "" FORCE)
        set(GGML_OPENMP OFF CACHE BOOL "" FORCE)
    endif()
endif()

add_subdirectory(${LLAMA_DIR} build-llama)

add_library(fener SHARED fener_jni.cpp)
target_include_directories(fener PRIVATE ${LLAMA_DIR}/include ${LLAMA_DIR}/common ${LLAMA_DIR}/ggml/include)
target_link_libraries(fener PRIVATE llama llama-common)
if(ANDROID)
    target_link_libraries(fener PRIVATE log android)
endif()
