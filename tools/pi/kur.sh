#!/usr/bin/env bash
# Akıl Çantası — Raspberry Pi bilgi noktası kurulumu
# Raspberry Pi OS Bookworm (Debian 12, 64 bit önerilir) için yazıldı.
# DONANIMDA TEST EDİLMEDİ: önce bir yedek SD kartta deneyin.
#
# Ne yapar:
#   1) Node.js LTS kurar (NodeSource apt deposu; --node debian ile Debian'ın kendi paketi)
#   2) Uygulamayı (dist/ + server/ + data/) /opt/akilcantasi altına kopyalar
#   3) Açılışta başlayan bir systemd hizmeti oluşturur: server/server.mjs, port 80 (ya da 8080)
#   4) İsteğe bağlı: Wi-Fi erişim noktası (--hotspot) ve captive portal yönlendirmesi (--captive)
#
# Kullanım (projenin kök klasöründe, dist/ hazır olmalı: "npm run build"):
#   sudo bash tools/pi/kur.sh
#   sudo bash tools/pi/kur.sh --port 8080
#   sudo bash tools/pi/kur.sh --hotspot --captive
#   sudo bash tools/pi/kur.sh --data /media/pi/USB/paketler --hotspot --password 12345678
#   sudo bash tools/pi/kur.sh --uninstall
#
# Seçenekler:
#   --port 80|8080     Sunucu portu (varsayılan 80; --captive ile asıl sunucu 8080'e, ön sunucu 80'e geçer)
#   --src KLASÖR       Uygulama kaynağı (varsayılan: bu betiğin iki üst klasörü)
#   --data KLASÖR      Paketlerin kopyalanacağı kaynak (varsayılan: <src>/data)
#   --no-copy-data     Paketleri kopyalama; hizmet --data-dir klasörünü doğrudan kullanır
#   --data-dir KLASÖR  Hizmetin paket klasörü (varsayılan /opt/akilcantasi/data; ör. USB bellek)
#   --dest KLASÖR      Kurulum yeri (varsayılan /opt/akilcantasi)
#   --node nodesource|debian   Node.js kaynağı (varsayılan nodesource)
#   --node-major N     NodeSource ana sürümü (varsayılan 24, LTS)
#   --hotspot          erisim-noktasi.sh ile "AkilCantasi" Wi-Fi ağı aç
#   --ssid AD / --password PAROLA   erişim noktası için
#   --captive          captive portal: tüm alan adları Pi'ye, telefonlar "ağda oturum aç" ile uygulamayı görür
#   --uninstall        Hizmetleri durdur ve kaldır (paketler silinmez)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC="$(cd "$SCRIPT_DIR/../.." && pwd)"
DEST="/opt/akilcantasi"
DATA_SRC=""
DATA_DIR=""
COPY_DATA=1
PORT=80
NODE_FROM="nodesource"
NODE_MAJOR="24"
HOTSPOT=0
CAPTIVE=0
SSID="AkilCantasi"
PASSWORD=""
UNINSTALL=0
SVC_USER="akilcantasi"
SVC="akilcantasi"
SVC_CAPTIVE="akilcantasi-captive"

while [ $# -gt 0 ]; do
  case "$1" in
    --port) PORT="${2:?--port değer ister}"; shift 2 ;;
    --src) SRC="${2:?--src değer ister}"; shift 2 ;;
    --data) DATA_SRC="${2:?--data değer ister}"; shift 2 ;;
    --data-dir) DATA_DIR="${2:?--data-dir değer ister}"; shift 2 ;;
    --no-copy-data) COPY_DATA=0; shift ;;
    --dest) DEST="${2:?--dest değer ister}"; shift 2 ;;
    --node) NODE_FROM="${2:?--node değer ister}"; shift 2 ;;
    --node-major) NODE_MAJOR="${2:?--node-major değer ister}"; shift 2 ;;
    --hotspot) HOTSPOT=1; shift ;;
    --captive) CAPTIVE=1; shift ;;
    --ssid) SSID="${2:?--ssid değer ister}"; shift 2 ;;
    --password) PASSWORD="${2:?--password değer ister}"; shift 2 ;;
    --uninstall) UNINSTALL=1; shift ;;
    -h|--help) sed -n '2,36p' "$0"; exit 0 ;;
    *) echo "Bilinmeyen seçenek: $1 (yardım: --help)" >&2; exit 2 ;;
  esac
done

say() { printf '\n==> %s\n' "$*"; }
die() { printf 'HATA: %s\n' "$*" >&2; exit 1; }

[ "$(id -u)" -eq 0 ] || die "root yetkisi gerekir: sudo bash $0"
case "$PORT" in 80|8080) ;; *) die "--port yalnızca 80 ya da 8080 olabilir" ;; esac
case "$NODE_FROM" in nodesource|debian) ;; *) die "--node nodesource ya da debian olmalı" ;; esac
[ -n "$DATA_SRC" ] || DATA_SRC="$SRC/data"
[ -n "$DATA_DIR" ] || DATA_DIR="$DEST/data"

if [ "$UNINSTALL" -eq 1 ]; then
  say "Hizmetler kaldırılıyor"
  systemctl disable --now "$SVC_CAPTIVE" 2>/dev/null || true
  systemctl disable --now "$SVC" 2>/dev/null || true
  rm -f "/etc/systemd/system/$SVC.service" "/etc/systemd/system/$SVC_CAPTIVE.service"
  systemctl daemon-reload
  echo "Uygulama dosyaları $DEST içinde kaldı. Silmek için: sudo rm -rf $DEST"
  echo "Erişim noktasını kapatmak için: sudo bash $SCRIPT_DIR/erisim-noktasi.sh --off"
  exit 0
fi

# ---- 0) Ön kontroller ----
if [ -r /etc/os-release ]; then
  # shellcheck disable=SC1091
  . /etc/os-release
  case "${VERSION_CODENAME:-}" in
    bookworm|trixie) ;;
    *) echo "UYARI: Bu betik Raspberry Pi OS Bookworm için yazıldı (bulunan: ${PRETTY_NAME:-bilinmiyor}). Devam ediliyor." ;;
  esac
fi
[ -f "$SRC/dist/index.html" ] || die "$SRC/dist/index.html yok. Uygulamayı bir bilgisayarda derleyin (npm run build) ve dist/ klasörünü buraya kopyalayın."
[ -f "$SRC/server/server.mjs" ] || die "$SRC/server/server.mjs yok. --src ile proje klasörünü gösterin."

# ---- 1) Node.js ----
node_major() { node -v 2>/dev/null | sed -E 's/^v([0-9]+).*/\1/' || true; }
HAVE="$(node_major)"
if [ -n "$HAVE" ] && [ "$HAVE" -ge 18 ]; then
  say "Node.js zaten kurulu: $(node -v)"
else
  say "Node.js kuruluyor ($NODE_FROM)"
  export DEBIAN_FRONTEND=noninteractive
  apt-get update
  if [ "$NODE_FROM" = "debian" ]; then
    # Bookworm deposundaki nodejs 18.x; sunucu için yeterli (>= 18).
    apt-get install -y nodejs
  else
    # NodeSource resmi apt deposu (imzalı). Belgeler: https://github.com/nodesource/distributions
    apt-get install -y ca-certificates curl gnupg
    install -d -m 0755 /etc/apt/keyrings
    curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
      | gpg --dearmor --yes -o /etc/apt/keyrings/nodesource.gpg
    chmod 0644 /etc/apt/keyrings/nodesource.gpg
    echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
      > /etc/apt/sources.list.d/nodesource.list
    apt-get update
    apt-get install -y nodejs
  fi
  HAVE="$(node_major)"
  [ -n "$HAVE" ] && [ "$HAVE" -ge 18 ] || die "Node.js 18+ kurulamadı."
  echo "Node.js $(node -v) kuruldu."
fi
NODE_BIN="$(command -v node)"

# ---- 2) Kullanıcı ve dosyalar ----
say "Hizmet kullanıcısı: $SVC_USER"
if ! id "$SVC_USER" >/dev/null 2>&1; then
  useradd --system --home-dir "$DEST" --no-create-home --shell /usr/sbin/nologin "$SVC_USER"
fi

say "Uygulama kopyalanıyor → $DEST"
install -d -m 0755 "$DEST" "$DEST/tools/pi"
copy_dir() { # kaynak hedef
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --delete "$1/" "$2/"
  else
    rm -rf "$2"
    cp -a "$1" "$2"
  fi
}
copy_dir "$SRC/dist" "$DEST/dist"
copy_dir "$SRC/server" "$DEST/server"
install -m 0644 "$SCRIPT_DIR/captive.mjs" "$DEST/tools/pi/captive.mjs"
install -m 0755 "$SCRIPT_DIR/erisim-noktasi.sh" "$DEST/tools/pi/erisim-noktasi.sh"

install -d -m 0755 "$DATA_DIR"
if [ "$COPY_DATA" -eq 1 ] && [ -d "$DATA_SRC" ] && [ "$(cd "$DATA_SRC" && pwd)" != "$(cd "$DATA_DIR" && pwd)" ]; then
  say "Paketler kopyalanıyor: $DATA_SRC → $DATA_DIR (büyük dosyalarda uzun sürebilir)"
  if command -v rsync >/dev/null 2>&1; then
    rsync -a --info=progress2 "$DATA_SRC/" "$DATA_DIR/"
  else
    cp -a "$DATA_SRC/." "$DATA_DIR/"
  fi
fi
chown -R root:root "$DEST/dist" "$DEST/server" "$DEST/tools"
# Sunucu yalnızca paket klasörüne yazar (board.json: ortak duyuru panosu)
chown -R "$SVC_USER:$SVC_USER" "$DATA_DIR"

# ---- 3) systemd hizmeti ----
if [ "$CAPTIVE" -eq 1 ]; then
  APP_PORT=8080
else
  APP_PORT="$PORT"
fi
say "systemd hizmeti: $SVC (port $APP_PORT)"
cat > "/etc/systemd/system/$SVC.service" <<EOF
[Unit]
Description=Akıl Çantası bilgi noktası (çevrimdışı afet bilgisi)
After=network.target
Wants=network.target

[Service]
Type=simple
User=$SVC_USER
Group=$SVC_USER
WorkingDirectory=$DEST
ExecStart=$NODE_BIN $DEST/server/server.mjs --port $APP_PORT --host 0.0.0.0 --data $DATA_DIR --dist $DEST/dist
Restart=always
RestartSec=3
Environment=NODE_ENV=production
# 1024 altındaki portu (80) root olmadan dinleyebilsin
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=read-only
PrivateTmp=true
ReadWritePaths=$DATA_DIR
# Az bellekli Pi'lerde (1 GB) taşmayı önle
MemoryMax=512M

[Install]
WantedBy=multi-user.target
EOF

if [ "$CAPTIVE" -eq 1 ]; then
  say "captive ön sunucusu: $SVC_CAPTIVE (port 80 → 127.0.0.1:8080)"
  cat > "/etc/systemd/system/$SVC_CAPTIVE.service" <<EOF
[Unit]
Description=Akıl Çantası captive portal ön sunucusu
After=$SVC.service
Requires=$SVC.service

[Service]
Type=simple
User=$SVC_USER
Group=$SVC_USER
ExecStart=$NODE_BIN $DEST/tools/pi/captive.mjs --port 80 --target 127.0.0.1:8080 --host 10.42.0.1
Restart=always
RestartSec=3
AmbientCapabilities=CAP_NET_BIND_SERVICE
CapabilityBoundingSet=CAP_NET_BIND_SERVICE
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
MemoryMax=128M

[Install]
WantedBy=multi-user.target
EOF
else
  systemctl disable --now "$SVC_CAPTIVE" 2>/dev/null || true
  rm -f "/etc/systemd/system/$SVC_CAPTIVE.service"
fi

systemctl daemon-reload
systemctl enable "$SVC" >/dev/null
systemctl restart "$SVC"
if [ "$CAPTIVE" -eq 1 ]; then
  systemctl enable "$SVC_CAPTIVE" >/dev/null
  systemctl restart "$SVC_CAPTIVE"
fi

# ---- 4) Erişim noktası (isteğe bağlı) ----
if [ "$HOTSPOT" -eq 1 ]; then
  say "Wi-Fi erişim noktası açılıyor (SSID: $SSID)"
  AP_ARGS=(--ssid "$SSID")
  [ -n "$PASSWORD" ] && AP_ARGS+=(--password "$PASSWORD")
  [ "$CAPTIVE" -eq 1 ] && AP_ARGS+=(--captive)
  bash "$SCRIPT_DIR/erisim-noktasi.sh" "${AP_ARGS[@]}" || echo "UYARI: Erişim noktası açılamadı; README'deki 'Sorun giderme' bölümüne bakın."
elif [ "$CAPTIVE" -eq 1 ]; then
  echo "UYARI: --captive yalnızca Pi'nin kendi erişim noktasında çalışır. --hotspot ile birlikte kullanın."
fi

# ---- 5) Sağlık kontrolü ----
say "Kontrol ediliyor"
OK=0
for _ in $(seq 1 15); do
  if curl -fsS "http://127.0.0.1:$APP_PORT/api/status" >/dev/null 2>&1; then OK=1; break; fi
  sleep 1
done
if [ "$OK" -eq 1 ]; then
  echo "Sunucu çalışıyor."
else
  echo "UYARI: Sunucu yanıt vermedi. Günlük: journalctl -u $SVC -n 50"
fi

URL_PORT=""
[ "$PORT" = "80" ] || [ "$CAPTIVE" -eq 1 ] || URL_PORT=":$PORT"
echo
echo "  Akıl Çantası bilgi noktası kuruldu."
for ip in $(hostname -I 2>/dev/null); do
  case "$ip" in *:*) continue ;; esac
  echo "    http://$ip$URL_PORT/"
done
echo "  Durum   : systemctl status $SVC"
echo "  Günlük  : journalctl -u $SVC -f"
echo "  Paketler: $DATA_DIR  (dosya ekledikten sonra yeniden başlatmak gerekmez)"
echo "  Not: Bu betik gerçek bir Raspberry Pi'de test edilmedi; sorun olursa README'ye bakın."
