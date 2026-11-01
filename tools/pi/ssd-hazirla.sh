#!/usr/bin/env bash
# Akıl Çantası — SSD/USB diski paket klasörü olarak hazırlar.
# DONANIMDA TEST EDİLMEDİ: önce boş bir diskle deneyin.
#
# Vikipedi, harita ve modeller onlarca GB tutar; SD kart hem küçük hem yavaştır.
# Bu betik bir NVMe SSD'yi (Pi 5 + M.2 HAT) ya da USB diski kalıcı olarak bağlar ve
# paket klasörlerini oluşturur. Pi her açıldığında disk kendiliğinden bağlanır; disk
# takılı değilse açılış takılmaz (nofail).
#
# Kullanım:
#   lsblk                                     # diskin adını bulun (genelde nvme0n1 ya da sda)
#   sudo bash tools/pi/ssd-hazirla.sh /dev/nvme0n1
#   sudo bash tools/pi/ssd-hazirla.sh /dev/sda --yer /srv/akilcantasi
# Sonra:
#   sudo bash tools/pi/kur.sh --no-copy-data --data-dir /srv/akilcantasi/data
#
# Disk ext4 değilse BİÇİMLENİR (üzerindeki her şey silinir); betik önce onay ister.
set -euo pipefail

DEV=""
MP="/srv/akilcantasi"
SVC_USER="akilcantasi"

while [ $# -gt 0 ]; do
  case "$1" in
    --yer) MP="${2:?--yer klasör ister}"; shift 2 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) DEV="$1"; shift ;;
  esac
done

die() { echo "HATA: $*" >&2; exit 1; }
say() { printf '\n== %s\n' "$*"; }

[ "$(id -u)" -eq 0 ] || die "sudo ile çalıştırın: sudo bash $0 /dev/nvme0n1"
if [ -z "$DEV" ]; then
  lsblk -o NAME,SIZE,FSTYPE,LABEL,MOUNTPOINTS
  die "disk belirtin, ör. /dev/nvme0n1"
fi
[ -b "$DEV" ] || die "$DEV bulunamadı (lsblk ile bakın)"

# Sistem diskini (SD kart ya da SSD'den açılış) asla biçimleme
ROOT_SRC="$(findmnt -no SOURCE /)"
ROOT_DISK="/dev/$(lsblk -no PKNAME "$ROOT_SRC" 2>/dev/null || true)"
case "$ROOT_SRC" in "$DEV"*) die "$DEV sistem diski; başka bir disk seçin" ;; esac
[ "$ROOT_DISK" = "$DEV" ] && die "$DEV sistem diski; başka bir disk seçin"

# Bölüm yoksa tüm disk kullanılır (tek dosya sistemi, en basit kurulum)
PART="$DEV"
if mountpoint -q "$MP" && [ "$(findmnt -no SOURCE "$MP")" = "$PART" ]; then
  say "$PART zaten $MP altında bağlı"
else
  # Başka yere bağlıysa ayır
  for m in $(lsblk -nro MOUNTPOINTS "$PART" | grep -v '^$' || true); do umount "$m"; done

  FSTYPE="$(lsblk -dno FSTYPE "$PART" || true)"
  if [ "$FSTYPE" != "ext4" ]; then
    SIZE="$(lsblk -dno SIZE "$DEV")"
    echo
    echo "!!! $DEV ($SIZE) ext4 değil (${FSTYPE:-boş})."
    echo "!!! Biçimlenecek ve ÜZERİNDEKİ HER ŞEY SİLİNECEK."
    read -rp "Devam etmek için EVET yazın: " ans
    [ "$ans" = "EVET" ] || die "iptal edildi"
    wipefs -a "$DEV"
    mkfs.ext4 -F -L akilcantasi "$PART"
  fi

  UUID="$(blkid -s UUID -o value "$PART")"
  [ -n "$UUID" ] || die "diskin UUID'si okunamadı"

  cp /etc/fstab "/etc/fstab.yedek.$(date +%Y%m%d%H%M%S)"
  # Bu disk ya da bu bağlama yeri için eski satırları kaldır
  sed -i "/$UUID/d" /etc/fstab
  sed -i "\\#[[:space:]]${MP}[[:space:]]#d" /etc/fstab
  echo "UUID=$UUID  $MP  ext4  defaults,noatime,nofail,x-systemd.device-timeout=10s  0  2" >> /etc/fstab

  mkdir -p "$MP"
  systemctl daemon-reload
  mount "$MP"
fi

say "Paket klasörleri"
mkdir -p "$MP/data/zim" "$MP/data/models" "$MP/data/maps" "$MP/data/ses"
if id "$SVC_USER" >/dev/null 2>&1; then
  chown -R "$SVC_USER:$SVC_USER" "$MP/data"
fi
df -h "$MP" | tail -1

cat <<EOF

Tamam: $DEV -> $MP
Paket klasörü: $MP/data  (zim/, models/, maps/, ses/)

Sıradaki adımlar:
  1) Hizmeti bu klasörü kullanacak şekilde kurun (ya da yeniden kurun):
       sudo bash tools/pi/kur.sh --no-copy-data --data-dir $MP/data
  2) İçerikleri internetten indirin (yarıda kalırsa tekrar çalıştırın, kaldığı yerden sürer):
       sudo bash tools/pi/icerik-indir.sh --hedef $MP/data
EOF
