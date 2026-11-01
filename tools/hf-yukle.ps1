# Akıl Çantası — içerik paketlerini Hugging Face'e yansılar (geliştirici aracı).
#
#  1) Genel Türkiye haritasını (z0–10) mevcut data\maps\turkiye.pmtiles'tan üretir.
#  2) Afet noktaları dosyası yoksa OpenStreetMap'ten toplar.
#  3) tools\hf\paketler.json'daki paketleri (yoksa önce en hızlı Kiwix aynasından
#     indirip) Hugging Face'e yükler; katalogdaki ilk adresi Hugging Face yapar.
#
# Token: "Write" yetkili Hugging Face erişim anahtarı. Bir kez sorulur; isterseniz
# Windows'un kullanıcıya özel şifrelemesiyle (DPAPI) bu bilgisayarda saklanır.
param(
  [string]$Sadece = '',
  [switch]$Deneme,
  [switch]$TokenSil
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot
$work = Join-Path $env:LOCALAPPDATA 'AkilCantasi-build'
$maps = Join-Path $root 'data\maps'
$tar = Join-Path $env:SystemRoot 'System32\tar.exe'
$tokenFile = Join-Path $work 'hf-token.dat'

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


function Token-Al {
  if ($env:HF_TOKEN) { return $env:HF_TOKEN }
  if (Test-Path $tokenFile) {
    try {
      $sec = Get-Content $tokenFile -Raw | ConvertTo-SecureString
      return [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
    } catch { Bilgi 'Kayıtlı token okunamadı; yeniden sorulacak.' }
  }
  Write-Host ''
  Bilgi 'Hugging Face erişim anahtarı (token) gerekli.'
  Bilgi 'huggingface.co → Settings → Access Tokens → Create new token → "Write" seçin.'
  $sec = Read-Host '  Token (yazdığınız görünmez)' -AsSecureString
  $plain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sec))
  if (-not $plain) { throw 'Token girilmedi.' }
  $c = Read-Host '  Bu bilgisayarda şifreli saklansın mı? Bir dahaki sefere sorulmaz (E/H)'
  if ($c -match '^[eEyY]') {
    New-Item -ItemType Directory -Force -Path $work | Out-Null
    $sec | ConvertFrom-SecureString | Set-Content -Path $tokenFile -Encoding ASCII
    Bilgi "Saklandı (yalnız bu Windows kullanıcısı açabilir). Silmek için: hf-yukle.cmd -TokenSil"
  }
  return $plain
}

try {
  Baslik 'Akıl Çantası — Hugging Face yansısı'
  if ($TokenSil) {
    if (Test-Path $tokenFile) { Remove-Item -Force $tokenFile; Bilgi 'Kayıtlı token silindi.' } else { Bilgi 'Kayıtlı token yok.' }
    exit 0
  }
  $node = Node-Bul
  Bilgi "Node.js: $(& $node -v)"

  # 1) Genel harita (z0–10), sokak ayrıntılı haritadan
  $detay = Join-Path $maps 'turkiye.pmtiles'
  $genel = Join-Path $maps 'turkiye-genel-z10.pmtiles'
  if ((Test-Path $detay) -and -not (Test-Path $genel) -and -not $Deneme) {
    Baslik 'Genel harita (z0–10) üretiliyor'
    $pm = Pmtiles-Bul
    & $pm extract $detay $genel --maxzoom=10
    if ($LASTEXITCODE -ne 0 -or -not (Test-Path $genel)) { throw 'Genel harita üretilemedi.' }
    Bilgi ("Hazır: data\maps\turkiye-genel-z10.pmtiles ({0:N0} MB)" -f ((Get-Item $genel).Length / 1MB))
  }

  # 2) Afet noktaları
  $noktalar = Join-Path $maps 'turkiye-afet-noktalari.geojson'
  if (-not (Test-Path $noktalar) -and -not $Deneme) {
    Baslik "Afet noktaları OpenStreetMap'ten toplanıyor (birkaç dakika)"
    New-Item -ItemType Directory -Force -Path $maps | Out-Null
    & $node (Join-Path $PSScriptRoot 'pi\afet-noktalari.mjs') $noktalar
    if ($LASTEXITCODE -ne 0) { Bilgi 'Afet noktaları tamamlanamadı; diğer paketlerle devam ediliyor. Sonra yeniden çalıştırın.' }
  }

  # 3) Yükleme
  $argsList = @((Join-Path $PSScriptRoot 'hf\hf-yukle.mjs'), '--kok', $root)
  if ($Sadece) { $argsList += @('--sadece', $Sadece) }
  if ($Deneme) { $argsList += '--deneme' } else { $env:HF_TOKEN = Token-Al }
  & $node @argsList
  $kod = $LASTEXITCODE
  Remove-Item Env:\HF_TOKEN -ErrorAction SilentlyContinue
  if ($kod -ne 0) { exit $kod }
  if (-not $Deneme) {
    Write-Host ''
    Bilgi 'Katalog güncellendi. Önizleme açıksa sayfayı yenileyin; telefona geçmesi için APK yeniden derlenmeli.'
  }
} catch {
  Write-Host ''
  Write-Host "  HATA: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
