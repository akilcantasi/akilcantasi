# Akıl Çantası — Windows'ta önizleme.
# Node.js yoksa taşınabilir sürümünü (~30 MB) %LOCALAPPDATA%\AkilCantasi-build\node
# içine indirir, bilgi noktası sunucusunu data\ klasörüyle başlatır ve tarayıcıyı açar.
param([int]$Port = 8080)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot
$work = Join-Path $env:LOCALAPPDATA 'AkilCantasi-build'

function Bilgi($t) { Write-Host "  $t" }

try {
  Write-Host ''
  Write-Host '  Akıl Çantası — önizleme' -ForegroundColor Cyan

  if (-not (Test-Path (Join-Path $root 'dist\index.html'))) { throw 'dist\index.html yok. Uygulama dosyaları eksik.' }

  # ---- Node.js ----
  $node = $null
  try { $v = (& node -v) 2>$null; if ($v -match '^v(\d+)\.' -and [int]$Matches[1] -ge 18) { $node = 'node' } } catch {}
  if (-not $node) {
    $nodeDir = Join-Path $work 'node'
    $home2 = Get-ChildItem $nodeDir -Directory -ErrorAction SilentlyContinue | Where-Object { Test-Path (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
    if (-not $home2) {
      Bilgi 'Node.js bulunamadı; taşınabilir sürüm indiriliyor (bir kereye mahsus, ~30 MB)...'
      $idx = Invoke-RestMethod -Uri 'https://nodejs.org/dist/index.json' -UseBasicParsing
      $rel = $idx | Where-Object { $_.lts -and $_.version -like 'v22.*' } | Select-Object -First 1
      if (-not $rel) { throw 'Node.js sürüm listesi okunamadı (internet bağlantısını kontrol edin).' }
      $name = "node-$($rel.version)-win-x64"
      New-Item -ItemType Directory -Force -Path $nodeDir | Out-Null
      $zip = Join-Path $nodeDir "$name.zip"
      Invoke-WebRequest -Uri "https://nodejs.org/dist/$($rel.version)/$name.zip" -OutFile $zip -UseBasicParsing
      $tar = Join-Path $env:SystemRoot 'System32\tar.exe'
      if (Test-Path $tar) { & $tar -xf $zip -C $nodeDir } else { Expand-Archive -Path $zip -DestinationPath $nodeDir -Force }
      Remove-Item -Force $zip
      $home2 = Get-ChildItem $nodeDir -Directory | Where-Object { Test-Path (Join-Path $_.FullName 'node.exe') } | Select-Object -First 1
      if (-not $home2) { throw 'Node.js açıldı ama node.exe bulunamadı.' }
    }
    $node = Join-Path $home2.FullName 'node.exe'
  }
  Bilgi "Node.js: $(& $node -v)"

  # ---- Sunucu ----
  $server = Join-Path $root 'server\server.mjs'
  $data = Join-Path $root 'data'
  $p = Start-Process -FilePath $node -ArgumentList @("`"$server`"", '--port', "$Port", '--data', "`"$data`"") -NoNewWindow -PassThru

  # Sunucu hazır olunca tarayıcıyı aç
  $url = "http://localhost:$Port/"
  $ready = $false
  for ($i = 0; $i -lt 40 -and -not $p.HasExited; $i++) {
    Start-Sleep -Milliseconds 250
    try { Invoke-WebRequest -Uri "${url}api/status" -UseBasicParsing -TimeoutSec 2 | Out-Null; $ready = $true; break } catch {}
  }
  if ($ready) {
    Start-Process $url
    Write-Host ''
    Bilgi "Tarayıcıda açıldı: $url"
    Bilgi 'Telefon ekranı gibi görmek için tarayıcıda F12, ardından Ctrl+Shift+M.'
    Bilgi 'Kapatmak için bu pencereyi kapatın ya da Ctrl+C.'
  } elseif ($p.HasExited) {
    throw "Sunucu başlamadı. Port $Port kullanımda olabilir: onizle.cmd 8081"
  } else {
    # Sunucu çalışıyor ama 10 sn içinde yanıt vermedi (ör. güvenlik duvarı sorusu açık)
    Write-Host ''
    Bilgi "Sunucu yanıt vermekte gecikiyor. Tarayıcıda elle açın: $url"
  }
  $p.WaitForExit()
} catch {
  Write-Host ''
  Write-Host "  HATA: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
