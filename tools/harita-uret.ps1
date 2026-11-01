# Akıl Çantası — Türkiye haritasını ve afet noktalarını bu bilgisayarda hazırlar.
#
#  1) Harita: Protomaps'in her gün yayınladığı dünya haritasından (OpenStreetMap)
#     yalnızca Türkiye + KKTC sınırı içini, sokak ve bina ayrıntısıyla (z15) çeker:
#     data\maps\turkiye.pmtiles. Eski dosya data\maps\_eski\ içine taşınır.
#  2) Afet noktaları: toplanma alanı, hastane/sağlık, eczane, içme suyu, barınak
#     noktalarını OpenStreetMap'ten (Overpass) toplar:
#     data\maps\turkiye-afet-noktalari.geojson. Yarıda kalırsa tekrar çalıştırın,
#     kaldığı yerden sürer.
#
# Gerekenler internetten bir kez indirilir: taşınabilir Node.js (~30 MB) ve
# go-pmtiles (~10 MB) — %LOCALAPPDATA%\AkilCantasi-build içine.
param(
  [switch]$SadeceHarita,
  [switch]$SadeceNoktalar,
  [int]$MaxZoom = 15
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot
$work = Join-Path $env:LOCALAPPDATA 'AkilCantasi-build'
$maps = Join-Path $root 'data\maps'
$tar = Join-Path $env:SystemRoot 'System32\tar.exe'

function Bilgi($t) { Write-Host "  $t" }
function Baslik($t) { Write-Host ''; Write-Host "  $t" -ForegroundColor Cyan }

function Ac-Zip($zip, $hedef) {
  if (Test-Path $tar) { & $tar -xf $zip -C $hedef } else { Expand-Archive -Path $zip -DestinationPath $hedef -Force }
}

function Node-Bul {
  try { $v = (& node -v) 2>$null; if ($v -match '^v(\d+)\.' -and [int]$Matches[1] -ge 18) { return 'node' } } catch {}
  $nodeDir = Join-Path $work 'node'
  $h = Get-ChildItem $nodeDir -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
  if (-not $h) {
    Bilgi 'Node.js bulunamadı; taşınabilir sürüm indiriliyor (bir kereye mahsus, ~30 MB)...'
    $idx = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json' -UseBasicParsing
    $rel = $idx | Where-Object { $_.lts -and $_.version -like 'v22.*' } | Select-Object -First 1
    if (-not $rel) { throw 'Node.js sürüm listesi okunamadı (internet bağlantısını kontrol edin).' }
    $name = "node-$($rel.version)-win-x64"
    New-Item -ItemType Directory -Force -Path $nodeDir | Out-Null
    $zip = Join-Path $nodeDir "$name.zip"
    Invoke-WebRequest -Uri "https://nodejs.org/dist/$($rel.version)/$name.zip" -OutFile $zip -UseBasicParsing
    Ac-Zip $zip $nodeDir
    Remove-Item -Force $zip
    $h = Get-ChildItem $nodeDir -Directory | Where-Object { Test-Path (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
    if (-not $h) { throw 'Node.js açıldı ama node.exe bulunamadı.' }
  }
  return (Join-Path $h.FullName 'node.exe')
}

function Pmtiles-Bul {
  $dir = Join-Path $work 'pmtiles'
  $exe = Join-Path $dir 'pmtiles.exe'
  if (Test-Path $exe) { return $exe }
  Bilgi 'go-pmtiles indiriliyor (bir kereye mahsus, ~10 MB)...'
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  $arch = if ($env:PROCESSOR_ARCHITECTURE -eq 'ARM64') { 'arm64' } else { 'x86_64' }
  $url = $null
  try {
    $rel = Invoke-RestMethod -Uri 'https://api.github.com/repos/protomaps/go-pmtiles/releases/latest' -UseBasicParsing -Headers @{ 'User-Agent' = 'AkilCantasi' }
    $url = ($rel.assets | Where-Object { $_.name -like "*Windows_$arch.zip" } | Select-Object -First 1).browser_download_url
  } catch {}
  if (-not $url) { $url = "https://github.com/protomaps/go-pmtiles/releases/download/v1.31.2/go-pmtiles_1.31.2_Windows_$arch.zip" }
  $zip = Join-Path $dir 'pmtiles.zip'
  Invoke-WebRequest -Uri $url -OutFile $zip -UseBasicParsing
  Ac-Zip $zip $dir
  Remove-Item -Force $zip
  if (-not (Test-Path $exe)) { throw 'go-pmtiles açıldı ama pmtiles.exe bulunamadı.' }
  return $exe
}

# Protomaps günlük derlemeleri: https://build.protomaps.com/YYYYMMDD.pmtiles
# Bugünden geriye doğru ilk erişilebilen gün kullanılır.
function Son-Derleme {
  for ($i = 0; $i -lt 21; $i++) {
    $d = (Get-Date).ToUniversalTime().AddDays(-$i).ToString('yyyyMMdd')
    $u = "https://build.protomaps.com/$d.pmtiles"
    try {
      $r = Invoke-WebRequest -Uri $u -Method Head -UseBasicParsing -TimeoutSec 20
      if ($r.StatusCode -eq 200) { return @{ Url = $u; Gun = $d } }
    } catch {}
  }
  throw 'Protomaps derlemesine ulaşılamadı (build.protomaps.com). İnternet bağlantısını kontrol edip tekrar deneyin.'
}

try {
  Write-Host ''
  Write-Host '  Akıl Çantası — harita ve afet noktaları hazırlama' -ForegroundColor Cyan
  New-Item -ItemType Directory -Force -Path $maps | Out-Null

  # ---------------- 1) Harita ----------------
  if (-not $SadeceNoktalar) {
    Baslik "1/2  Türkiye haritası (sokak ayrıntılı, z0–$MaxZoom)"
    $pm = Pmtiles-Bul
    $b = Son-Derleme
    Bilgi "Kaynak: Protomaps $($b.Gun) (OpenStreetMap verisi)"
    $sinir = Join-Path $PSScriptRoot 'turkiye-sinir.geojson'
    $yeni = Join-Path $maps 'turkiye.pmtiles.yeni'
    if (Test-Path $yeni) { Remove-Item -Force $yeni }
    $free = (Get-PSDrive -Name ($maps.Substring(0, 1))).Free
    if ($free -lt 4GB) { throw "Diskte yer az ($([math]::Round($free / 1GB, 1)) GB). En az 4 GB boş yer gerekli." }
    Bilgi 'Yalnızca Türkiye ve KKTC sınırı içi indiriliyor (~1,5–2,5 GB, bağlantıya göre 5–30 dk)...'
    & $pm extract $b.Url $yeni "--region=$sinir" "--maxzoom=$MaxZoom" '--download-threads=8'
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $yeni) -or (Get-Item $yeni).Length -lt 100MB) {
      throw 'Harita indirilemedi ya da eksik kaldı. Tekrar çalıştırın (eski harita yerinde duruyor).'
    }
    $eski = Join-Path $maps 'turkiye.pmtiles'
    if (Test-Path $eski) {
      $arsiv = Join-Path $maps '_eski'
      New-Item -ItemType Directory -Force -Path $arsiv | Out-Null
      $ad = 'turkiye-' + (Get-Item $eski).LastWriteTime.ToString('yyyyMMdd') + '.pmtiles'
      Move-Item -Force $eski (Join-Path $arsiv $ad)
      Bilgi "Eski harita taşındı: data\maps\_eski\$ad (gerekmiyorsa silebilirsiniz)"
    }
    Move-Item -Force $yeni $eski
    Bilgi ("Hazır: data\maps\turkiye.pmtiles ({0:N1} GB)" -f ((Get-Item $eski).Length / 1GB))
  }

  # ---------------- 2) Afet noktaları ----------------
  if (-not $SadeceHarita) {
    Baslik '2/2  Afet noktaları (toplanma alanı, sağlık, eczane, su, barınak)'
    $node = Node-Bul
    $out = Join-Path $maps 'turkiye-afet-noktalari.geojson'
    Bilgi 'Türkiye 24 bölgede sorgulanıyor (~10–20 dk). Yarıda kalırsa bu betiği tekrar çalıştırın; kaldığı yerden sürer.'
    & $node (Join-Path $PSScriptRoot 'pi\afet-noktalari.mjs') $out
    if ($LASTEXITCODE -ne 0) { throw 'Afet noktaları tamamlanamadı (OpenStreetMap sunucuları meşgul olabilir). Birkaç dakika sonra tekrar çalıştırın; alınan bölgeler saklandı.' }
  }

  Write-Host ''
  Write-Host '  Tamamlandı.' -ForegroundColor Green
  Bilgi 'Önizleme: onizle.cmd   ·   Telefona: Araçlar → Paketler ve paylaşım (bilgi noktası ya da içe aktarma)'
} catch {
  Write-Host ''
  Write-Host "  HATA: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
