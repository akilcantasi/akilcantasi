#!/usr/bin/env bash
# Akıl Çantası — Raspberry Pi Wi-Fi erişim noktası (NetworkManager / nmcli)
# Raspberry Pi OS Bookworm için yazıldı. DONANIMDA TEST EDİLMEDİ.
#
# Kullanım (root):
#   sudo bash tools/pi/erisim-noktasi.sh                     # açık ağ "AkilCantasi"
#   sudo bash tools/pi/erisim-noktasi.sh --password 12345678 # WPA2 parolalı
#   sudo bash tools/pi/erisim-noktasi.sh --captive           # + tüm alan adlarını Pi'ye yönlendir
#   sudo bash tools/pi/erisim-noktasi.sh --off               # erişim noktasını kapat ve sil
#
# Seçenekler:
#   --ssid AD          Ağ adı (varsayılan AkilCantasi)
#   --password PAROLA  En az 8 karakter. Verilmezse ağ AÇIK olur (afette kolaylık için).
#   --ifname wlan0     Kablosuz arayüz
#   --country TR       Wi-Fi ülke kodu (Bookworm'da ayarlanmazsa Wi-Fi kapalı kalabilir)
#   --channel 6        2,4 GHz kanal (1, 6 ya da 11 önerilir)
#   --captive          dnsmasq ile her alan adını 10.42.0.1'e çöz (captive.mjs ile birlikte)
#   --off              Bağlantıyı kapat ve sil
set -euo pipefail

SSID="AkilCantasi"
PASSWORD=""
IFNAME="wlan0"
COUNTRY="TR"
CHANNEL="6"
CAPTIVE=0
OFF=0
CON="AkilCantasi-AP"
DNSMASQ_DIR="/etc/NetworkManager/dnsmasq-shared.d"
DNSMASQ_CONF="$DNSMASQ_DIR/akilcantasi.conf"
AP_IP="10.42.0.1"

while [ $# -gt 0 ]; do
  case "$1" in
    --ssid) SSID="${2:?--ssid değer ister}"; shift 2 ;;
    --password) PASSWORD="${2:?--password değer ister}"; shift 2 ;;
    --ifname) IFNAME="${2:?--ifname değer ister}"; shift 2 ;;
    --country) COUNTRY="${2:?--country değer ister}"; shift 2 ;;
    --channel) CHANNEL="${2:?--channel değer ister}"; shift 2 ;;
    --captive) CAPTIVE=1; shift ;;
    --off) OFF=1; shift ;;
    -h|--help) sed -n '2,22p' "$0"; exit 0 ;;
    *) echo "Bilinmeyen seçenek: $1" >&2; exit 2 ;;
  esac
done

if [ "$(id -u)" -ne 0 ]; then
  echo "Bu betik root yetkisi ister: sudo bash $0 $*" >&2
  exit 1
fi
if ! command -v nmcli >/dev/null 2>&1; then
  echo "nmcli bulunamadı. Raspberry Pi OS Bookworm NetworkManager ile gelir; eski sürümde: sudo apt install network-manager" >&2
  exit 1
fi

if [ "$OFF" -eq 1 ]; then
  nmcli connection down "$CON" >/dev/null 2>&1 || true
  nmcli connection delete "$CON" >/dev/null 2>&1 || true
  rm -f "$DNSMASQ_CONF"
  echo "Erişim noktası kapatıldı ve silindi."
  exit 0
fi

if [ -n "$PASSWORD" ] && [ "${#PASSWORD}" -lt 8 ]; then
  echo "WPA2 parolası en az 8 karakter olmalı." >&2
  exit 2
fi

# Wi-Fi ülke kodu ve rfkill (Bookworm'da ülke ayarlanmamışsa Wi-Fi engelli gelebilir)
if command -v raspi-config >/dev/null 2>&1; then
  raspi-config nonint do_wifi_country "$COUNTRY" || echo "UYARI: Wi-Fi ülke kodu ayarlanamadı."
fi
command -v rfkill >/dev/null 2>&1 && rfkill unblock wifi || true
nmcli radio wifi on || true

if ! nmcli -t -f DEVICE,TYPE device | grep -q "^${IFNAME}:wifi$"; then
  echo "Kablosuz arayüz '$IFNAME' bulunamadı. Mevcut aygıtlar:" >&2
  nmcli device status >&2
  exit 1
fi

# Eski tanımı temizle, yenisini oluştur
nmcli connection delete "$CON" >/dev/null 2>&1 || true
nmcli connection add type wifi ifname "$IFNAME" con-name "$CON" autoconnect yes ssid "$SSID" \
  802-11-wireless.mode ap 802-11-wireless.band bg 802-11-wireless.channel "$CHANNEL" \
  ipv4.method shared ipv4.addresses "$AP_IP/24" ipv6.method disabled \
  connection.autoconnect-priority 100 >/dev/null
if [ -n "$PASSWORD" ]; then
  # WPA2 (CCMP). Bazı Pi sürücüleri WPA3/SAE erişim noktasını desteklemez.
  nmcli connection modify "$CON" wifi-sec.key-mgmt wpa-psk wifi-sec.proto rsn \
    wifi-sec.pairwise ccmp wifi-sec.group ccmp wifi-sec.psk "$PASSWORD"
fi
# Güç tasarrufu kapalı: erişim noktası modunda bağlantı kopmalarını azaltır
nmcli connection modify "$CON" 802-11-wireless.powersave 2 || true

# NetworkManager'ın paylaşımlı ağ için başlattığı dnsmasq'a ek ayar
mkdir -p "$DNSMASQ_DIR"
{
  echo "# Akıl Çantası (tools/pi/erisim-noktasi.sh tarafından yazıldı)"
  echo "address=/akilcantasi.lan/$AP_IP"
  echo "address=/akilcantasi/$AP_IP"
  if [ "$CAPTIVE" -eq 1 ]; then
    echo "# captive portal: bütün alan adları Pi'ye çözülür"
    echo "address=/#/$AP_IP"
  fi
} > "$DNSMASQ_CONF"

nmcli connection up "$CON"

echo
echo "  Erişim noktası açık: SSID \"$SSID\" $( [ -n "$PASSWORD" ] && echo "(parolalı)" || echo "(açık ağ, parola yok)" )"
echo "  Telefonlar bu ağa bağlanıp şu adresi açsın: http://$AP_IP/  ya da  http://akilcantasi.lan/"
[ "$CAPTIVE" -eq 1 ] && echo "  Captive mod açık: tüm alan adları $AP_IP adresine yönlendirilir."
echo "  Kapatmak için: sudo bash $0 --off"
