#!/usr/bin/env bash
# Akıl Çantası — içerik paketlerini Pi'ye internetten indirir.
# DONANIMDA TEST EDİLMEDİ.
#
# tools/pi/icerik.conf listesindeki her ZIM'in en yeni sürümünü Kiwix aynasından bulur,
# indirir ve aynı paketin eski sürümünü siler. Yarıda kalırsa (elektrik, bağlantı) aynı
# komutu tekrar çalıştırın: inen kısım korunur, kaldığı yerden sürer.
#
# Kullanım:
#   sudo bash tools/pi/icerik-indir.sh                          # /opt/akilcantasi/data
#   sudo bash tools/pi/icerik-indir.sh --hedef /srv/akilcantasi/data
#   sudo bash tools/pi/icerik-indir.sh --liste benim-listem.conf
#   sudo bash tools/pi/icerik-indir.sh --deneme                 # indirmeden ne yapılacağını göster
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LISTE="$SCRIPT_DIR/icerik.conf"
HEDEF="/opt/akilcantasi/data"
DENEME=0
SVC_USER="akilcantasi"
# CORS ve Range destekleyen ayna önce; ana adres yönlendirir
AYNALAR=("https://mirror.download.kiwix.org/zim" "https://download.kiwix.org/zim")
# Test ya da yerel ayna için: AKIL_AYNA=http://192.168.1.10:8000/zim
[ -n "${AKIL_AYNA:-}" ] && AYNALAR=("$AKIL_AYNA")

while [ $# -gt 0 ]; do
  case "$1" in
    --hedef) HEDEF="${2:?--hedef klasör ister}"; shift 2 ;;
    --liste) LISTE="${2:?--liste dosya ister}"; shift 2 ;;
    --deneme) DENEME=1; shift ;;
    -h|--help) sed -n '2,16p' "$0"; exit 0 ;;
    *) echo "Bilinmeyen seçenek: $1" >&2; exit 2 ;;
  esac
done

say() { printf '\n== %s\n' "$*"; }
[ -f "$LISTE" ] || { echo "Liste yok: $LISTE" >&2; exit 2; }
command -v wget >/dev/null || { echo "wget gerekli: sudo apt install -y wget" >&2; exit 2; }
command -v curl >/dev/null || { echo "curl gerekli: sudo apt install -y curl" >&2; exit 2; }

mkdir -p "$HEDEF/zim" "$HEDEF/models" "$HEDEF/maps" "$HEDEF/ses"
if [ "$(df --output=target "$HEDEF" | tail -1 | tr -d ' ')" = "/" ]; then
  echo "Uyarı: $HEDEF sistem diskinde (SD kart dolabilir). SSD için: sudo bash tools/pi/ssd-hazirla.sh /dev/nvme0n1"
fi

bos_alan() { df -B1 --output=avail "$HEDEF" | tail -1 | tr -d ' '; }
insan() { numfmt --to=iec --suffix=B "$1" 2>/dev/null || echo "$1 B"; }

# Uzaktaki dosyanın boyutu (bayt); bilinmiyorsa boş
uzak_boyut() {
  curl -fsSIL --max-time 30 "$1" 2>/dev/null | tr -d '\r' | awk 'tolower($1)=="content-length:"{n=$2} END{print n}'
}

# Ayna klasöründen bir önekin en yeni sürüm adı: wikipedia_tr_all_nopic_2026-09.zim
en_yeni() {
  local klasor="$1" onek="$2" ayna liste
  for ayna in "${AYNALAR[@]}"; do
    liste="$(curl -fsSL --max-time 60 "$ayna/$klasor/" 2>/dev/null)" || continue
    printf '%s' "$liste" | grep -oE "\"${onek//./\\.}_[0-9]{4}-[0-9]{2}[a-z]?\.zim\"" | tr -d '"' | sort -u | tail -1
    return 0
  done
  return 1
}

# Sürdürülebilir indirme: .part dosyasına yazar, bitince yerine taşır
indir() {
  local url="$1" hedef="$2" boyut bos
  boyut="$(uzak_boyut "$url")"
  bos="$(bos_alan)"
  if [ -n "$boyut" ] && [ -n "$bos" ]; then
    local kalan=$((boyut - $(stat -c %s "$hedef.part" 2>/dev/null || echo 0)))
    if [ "$kalan" -gt "$bos" ]; then
      echo "!! Yer yetersiz: $(insan "$kalan") gerekli, $(insan "$bos") boş"
      return 1
    fi
  fi
  echo ">> $(basename "$hedef") ${boyut:+($(insan "$boyut"))}"
  [ "$DENEME" -eq 1 ] && return 0
  if wget -c --tries=20 --waitretry=10 --read-timeout=60 --progress=dot:giga -O "$hedef.part" "$url" </dev/null; then
    if [ -n "$boyut" ] && [ "$(stat -c %s "$hedef.part")" != "$boyut" ]; then
      echo "!! Boyut tutmuyor, tekrar çalıştırın"
      return 1
    fi
    mv -f "$hedef.part" "$hedef"
    echo "OK $(basename "$hedef")"
    return 0
  fi
  echo "!! İndirilemedi (tekrar çalıştırınca kaldığı yerden sürer)"
  return 1
}

hata=0
satir_no=0
while IFS= read -r satir || [ -n "$satir" ]; do
  satir_no=$((satir_no + 1))
  satir="${satir%%#*}"
  read -r tur a b _ <<<"$satir"
  [ -z "${tur:-}" ] && continue
  case "$tur" in
    zim)
      [ -n "${a:-}" ] && [ -n "${b:-}" ] || { echo "!! satır $satir_no: 'zim <klasör> <önek>' bekleniyor"; hata=1; continue; }
      say "$b"
      ad="$(en_yeni "$a" "$b")" || { echo "!! Kiwix listesine ulaşılamadı ($a)"; hata=1; continue; }
      [ -n "$ad" ] || { echo "!! $b bulunamadı (klasör: $a)"; hata=1; continue; }
      if [ -f "$HEDEF/zim/$ad" ]; then
        echo "== $ad zaten var"
      else
        ok=1
        for ayna in "${AYNALAR[@]}"; do
          if indir "$ayna/$a/$ad" "$HEDEF/zim/$ad"; then ok=0; break; fi
        done
        [ "$ok" -eq 0 ] || { hata=1; continue; }
      fi
      # Aynı paketin eski sürümlerini sil (yeni sürüm tamamsa)
      if [ "$DENEME" -eq 0 ] && [ -f "$HEDEF/zim/$ad" ]; then
        for eski in "$HEDEF/zim/${b}"_*.zim; do
          [ -f "$eski" ] && [ "$eski" != "$HEDEF/zim/$ad" ] && { echo "-- eski sürüm siliniyor: $(basename "$eski")"; rm -f "$eski"; }
        done
      fi
      ;;
    dosya)
      [ -n "${a:-}" ] && [ -n "${b:-}" ] || { echo "!! satır $satir_no: 'dosya <alt-klasör> <adres>' bekleniyor"; hata=1; continue; }
      ad="$(basename "${b%%\?*}")"
      say "$ad"
      mkdir -p "$HEDEF/$a"
      if [ -f "$HEDEF/$a/$ad" ]; then echo "== zaten var"; else indir "$b" "$HEDEF/$a/$ad" || hata=1; fi
      ;;
    noktalar)
      say "Afet noktaları (OpenStreetMap)"
      if ! command -v node >/dev/null; then echo "!! Node.js yok; önce tools/pi/kur.sh çalıştırın"; hata=1; continue; fi
      [ "$DENEME" -eq 1 ] && { echo ">> turkiye-afet-noktalari.geojson oluşturulacak"; continue; }
      node "$SCRIPT_DIR/afet-noktalari.mjs" "$HEDEF/turkiye-afet-noktalari.geojson" || hata=1
      ;;
    *) echo "!! satır $satir_no: bilinmeyen tür '$tur'"; hata=1 ;;
  esac
done < "$LISTE"

if [ "$DENEME" -eq 0 ] && id "$SVC_USER" >/dev/null 2>&1; then
  chown -R "$SVC_USER:$SVC_USER" "$HEDEF" 2>/dev/null || true
fi

say "Bitti"
du -sh "$HEDEF"/* 2>/dev/null
echo "Boş alan: $(insan "$(bos_alan)")"
[ "$hata" -eq 0 ] || echo "Bazı adımlar tamamlanamadı; komutu tekrar çalıştırın."
echo "Yeni paketler uygulamada sayfayı yenileyince görünür."
exit $hata
