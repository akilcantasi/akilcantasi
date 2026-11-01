# Akıl Çantası — Android APK'yı Android Studio olmadan derler (Windows 10/11).
# Çalıştırma: proje klasöründeki apk-derle.cmd dosyasına çift tıklayın.
#
# Gerekenleri yönetici izni istemeden kullanıcı klasörüne indirir:
#   %LOCALAPPDATA%\AkilCantasi-build\jdk   (Temurin JDK 21)
#   %LOCALAPPDATA%\AkilCantasi-build\node  (Node.js 22 LTS, kurulu değilse)
#   %LOCALAPPDATA%\AkilCantasi-build\sdk   (Android komut satırı araçları + SDK 36)
# Projeyi %LOCALAPPDATA%\AkilCantasi-build\src içine kopyalayıp orada derler
# (Gradle, Türkçe karakterli yollarda hata verebildiği için).
# Sonuç: data\akil-cantasi.apk  (bilgi noktası bunu telefonlara da sunar)
# İlk çalıştırma ~1,5 GB indirir ve 10-20 dakika sürer; sonrakiler birkaç dakika.

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot
$work = Join-Path $env:LOCALAPPDATA 'AkilCantasi-build'
$dl   = Join-Path $work 'indirilenler'
$log  = Join-Path $root 'apk-derle.log'
New-Item -ItemType Directory -Force -Path $work, $dl | Out-Null
try { Start-Transcript -Path $log -Force | Out-Null } catch {}

function Adim($t) { Write-Host ''; Write-Host "==> $t" -ForegroundColor Yellow }
function Bilgi($t) { Write-Host "    $t" }

function Indir($url, $dest, [long]$enAz = 1MB) {
  if ((Test-Path $dest) -and (Get-Item $dest).Length -ge $enAz) { Bilgi "zaten var: $(Split-Path -Leaf $dest)"; return }
  if (Test-Path $dest) { Remove-Item -Force $dest }
  Bilgi "indiriliyor: $url"
  $tmp = "$dest.part"
  if (Test-Path $tmp) { Remove-Item -Force $tmp }
  # curl.exe (Windows 10+) büyük dosyada Invoke-WebRequest'ten çok daha hızlı ve yönlendirmeleri izler
  $curl = Join-Path $env:SystemRoot 'System32\curl.exe'
  if (Test-Path $curl) {
    & $curl -fL --retry 3 --retry-delay 3 -o $tmp $url
    if ($LASTEXITCODE -ne 0) { throw "İndirilemedi (curl $LASTEXITCODE): $url" }
  } else {
    Invoke-WebRequest -Uri $url -OutFile $tmp -UseBasicParsing
  }
  $len = (Get-Item $tmp).Length
  Bilgi ("indi: {0:N1} MB" -f ($len / 1MB))
  if ($len -lt $enAz) { throw "İndirilen dosya beklenenden küçük ($len bayt): $url" }
  Move-Item -Force $tmp $dest
}

function ArsivAc($zip, $dest) {
  New-Item -ItemType Directory -Force -Path $dest | Out-Null
  Bilgi "açılıyor: $(Split-Path -Leaf $zip) -> $dest"
  $tar = Join-Path $env:SystemRoot 'System32\tar.exe'
  $ok = $false
  if (Test-Path $tar) {
    & $tar -xf $zip -C $dest
    $ok = ($LASTEXITCODE -eq 0)
    if (-not $ok) { Bilgi "tar açamadı ($LASTEXITCODE), Expand-Archive deneniyor" }
  }
  if (-not $ok) { Expand-Archive -Path $zip -DestinationPath $dest -Force }
  $icerik = @(Get-ChildItem -LiteralPath $dest -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name)
  Bilgi ("içerik: " + ($icerik -join ', '))
  if (-not $icerik.Count) { throw "Arşiv açıldı ama klasör boş: $dest" }
}

# Bir klasörde (alt klasörler dahil bir düzey) belirli dosyayı içeren ilk klasör
function KlasorBul($kok, $dosya) {
  if (-not (Test-Path -LiteralPath $kok)) { return $null }
  if (Test-Path -LiteralPath (Join-Path $kok $dosya)) { return Get-Item -LiteralPath $kok }
  return Get-ChildItem -LiteralPath $kok -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName $dosya) } | Select-Object -First 1
}

function Calistir($exe, [string[]]$argv) {
  # Komut çıktısı günlüğe de yazılsın (hata ayıklamak için); stderr burada hata sayılmaz,
  # yalnızca çıkış kodu belirleyicidir.
  $eski = $ErrorActionPreference
  $ErrorActionPreference = 'Continue'
  try {
    & $exe @argv 2>&1 | ForEach-Object { Write-Host "    $_" }
    $kod = $LASTEXITCODE
  } finally { $ErrorActionPreference = $eski }
  if ($kod -ne 0) { throw "Komut başarısız ($kod): $exe $($argv -join ' ')" }
}

try {
  Write-Host 'Akıl Çantası — APK derleme' -ForegroundColor Cyan
  Bilgi "Proje: $root"
  Bilgi "Çalışma klasörü: $work"
  if ($work -match '[^\x00-\x7F]') {
    Write-Host '    UYARI: Kullanıcı klasörünüzün yolunda Türkçe karakter var; derleme hata verebilir.' -ForegroundColor Red
  }

  # ---- 1) JDK 21 ----
  Adim 'Java (JDK 21)'
  $jdkDir = Join-Path $work 'jdk'
  $jdkHome = KlasorBul $jdkDir 'bin\java.exe'
  if (-not $jdkHome) {
    $zip = Join-Path $dl 'temurin-jdk21.zip'
    Indir 'https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk' $zip 100MB
    ArsivAc $zip $jdkDir
    $jdkHome = KlasorBul $jdkDir 'bin\java.exe'
    if (-not $jdkHome) { throw 'JDK açıldı ama java.exe bulunamadı.' }
  }
  $env:JAVA_HOME = $jdkHome.FullName
  $env:PATH = "$($env:JAVA_HOME)\bin;$env:PATH"
  Bilgi "JAVA_HOME = $env:JAVA_HOME"

  # ---- 2) Node.js ----
  Adim 'Node.js'
  $nodeOk = $false
  try { $v = (& node -v) 2>$null; if ($v -match '^v(\d+)\.' -and [int]$Matches[1] -ge 22) { $nodeOk = $true; Bilgi "kurulu: $v" } } catch {}
  if (-not $nodeOk) {
    $nodeDir = Join-Path $work 'node'
    $nodeHome = KlasorBul $nodeDir 'node.exe'
    if (-not $nodeHome) {
      $idx = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json' -UseBasicParsing
      $rel = $idx | Where-Object { $_.lts -and $_.version -like 'v22.*' } | Select-Object -First 1
      if (-not $rel) { throw 'Node.js sürüm listesi okunamadı.' }
      $name = "node-$($rel.version)-win-x64"
      $zip = Join-Path $dl "$name.zip"
      Indir "https://nodejs.org/dist/$($rel.version)/$name.zip" $zip 10MB
      ArsivAc $zip $nodeDir
      $nodeHome = KlasorBul $nodeDir 'node.exe'
      if (-not $nodeHome) { throw 'Node.js açıldı ama node.exe bulunamadı.' }
    }
    $env:PATH = "$($nodeHome.FullName);$env:PATH"
    Bilgi "taşınabilir Node: $(& node -v)"
  }

  # ---- 3) Android SDK ----
  Adim 'Android SDK'
  $sdk = Join-Path $work 'sdk'
  $sdkmanager = Join-Path $sdk 'cmdline-tools\latest\bin\sdkmanager.bat'
  if (-not (Test-Path $sdkmanager)) {
    $zip = Join-Path $dl 'cmdline-tools.zip'
    $ok = $false
    foreach ($ver in '13114758', '11076708') {
      try { Indir "https://dl.google.com/android/repository/commandlinetools-win-${ver}_latest.zip" $zip 50MB; $ok = $true; break } catch { Bilgi "olmadı ($ver): $($_.Exception.Message)" }
    }
    if (-not $ok) { throw 'Android komut satırı araçları indirilemedi.' }
    $tmp = Join-Path $sdk '_tmp'
    if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
    ArsivAc $zip $tmp
    $dest = Join-Path $sdk 'cmdline-tools\latest'
    if (Test-Path $dest) { Remove-Item -Recurse -Force $dest }
    New-Item -ItemType Directory -Force -Path (Split-Path $dest) | Out-Null
    Move-Item (Join-Path $tmp 'cmdline-tools') $dest
    Remove-Item -Recurse -Force $tmp
  }
  $env:ANDROID_HOME = $sdk
  $env:ANDROID_SDK_ROOT = $sdk
  # sdkmanager.bat, SDK kökünü kendi konumundan (cmdline-tools\latest\..\..) bulur.
  # Paket adlarındaki ';' cmd.exe'de bölünmesin diye paketler dosyadan verilir.
  Bilgi 'lisanslar kabul ediliyor'
  ("y`n" * 40) | & $sdkmanager --licenses | Out-Null
  Bilgi 'SDK bileşenleri (ilk seferde birkaç dakika)'
  $pk = Join-Path $work 'sdk-paketleri.txt'
  Set-Content -Path $pk -Value @('platform-tools', 'platforms;android-36', 'build-tools;35.0.0') -Encoding ASCII
  Calistir $sdkmanager @("--package_file=$pk")

  # ---- 4) Projeyi ASCII yola kopyala ----
  Adim 'Proje kopyalanıyor'
  $src = Join-Path $work 'src'
  & robocopy $root $src /MIR /NFL /NDL /NJH /NJS /NP /R:1 /W:1 /XD node_modules data .git testdata build .gradle _gecici dist /XF apk-derle.log | Out-Null
  if ($LASTEXITCODE -ge 8) { throw "robocopy hatası ($LASTEXITCODE)" }
  $global:LASTEXITCODE = 0

  # ---- 5) Web uygulaması + Capacitor ----
  Adim 'Bağımlılıklar (npm)'
  Push-Location $src
  try {
    Calistir 'npm.cmd' @('ci', '--no-audit', '--no-fund', '--loglevel=error')
    Adim 'Web uygulaması derleniyor'
    Calistir 'npm.cmd' @('run', 'build')
    Calistir 'npx.cmd' @('cap', 'sync', 'android')
  } finally { Pop-Location }

  # ---- 6) Gradle ----
  Adim 'APK derleniyor (Gradle; ilk seferde uzun sürer)'
  $android = Join-Path $src 'android'
  Set-Content -Path (Join-Path $android 'local.properties') -Value ("sdk.dir=" + ($sdk -replace '\\', '/')) -Encoding ASCII
  Push-Location $android
  try { Calistir '.\gradlew.bat' @('assembleDebug', '--no-daemon', '--console=plain') } finally { Pop-Location }

  $apk = Join-Path $android 'app\build\outputs\apk\debug\app-debug.apk'
  if (-not (Test-Path $apk)) { throw 'Derleme bitti ama APK bulunamadı.' }
  $outDir = Join-Path $root 'data'
  New-Item -ItemType Directory -Force -Path $outDir | Out-Null
  $out = Join-Path $outDir 'akil-cantasi.apk'
  Copy-Item -Force $apk $out
  $mb = [math]::Round((Get-Item $out).Length / 1MB, 1)

  Write-Host ''
  Write-Host "TAMAM: $out ($mb MB)" -ForegroundColor Green
  Write-Host '    Telefona kurmak için: APK''yı telefona kopyalayıp açın (bilinmeyen kaynaklara izin verin),'
  Write-Host '    ya da bilgi noktasını başlatıp telefondan "APK''yı indir" düğmesini kullanın.'
  $code = 0
} catch {
  Write-Host ''
  Write-Host "HATA: $($_.Exception.Message)" -ForegroundColor Red
  Write-Host "    Ayrıntılar: $log"
  $code = 1
} finally {
  try { Stop-Transcript | Out-Null } catch {}
}
exit $code
