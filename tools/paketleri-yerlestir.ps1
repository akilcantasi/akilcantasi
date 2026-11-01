# Akıl Çantası — İndirilen paketleri data\ klasörüne yerleştirir (Windows 10/11).
# Çalıştırma: proje klasöründeki paketleri-yerlestir.cmd dosyasına çift tıklayın.
#
# İndirilenler klasöründe (varsayılan: Windows'un "İndirilenler" klasörü) bilinen
# paket dosyalarını arar ve taşır:
#   *.zim   → data\zim\
#   *.gguf  → data\models\
#   Whisper (base/small) dosyaları → data\ses\whisper-<boyut>-ses.tar
# Ses paketi: 7 dosya (config.json, generation_config.json, preprocessor_config.json,
# tokenizer.json, tokenizer_config.json, encoder_model_quantized.onnx,
# decoder_model_merged_quantized.onnx) Windows'un tar.exe aracıyla tek .tar yapılır;
# düzen src/lib/voice/whisper-pack.ts'in beklediği gibidir (kökte json'lar, onnx\ altında modeller).
# Bkz. docs/FENER_MODELLER.md
#
# Güvenlik: Yalnızca taşıdığı dosyalara dokunur. Hedefte aynı adlı dosya varsa
# üzerine yazmaz, kaynağı yerinde bırakır. Başka hiçbir şeyi silmez.
#
# Seçenekler:
#   -Kaynak <klasör>   indirilenler yerine başka bir klasörde ara
#   -Hedef  <klasör>   data\ yerine başka bir paket klasörü (ör. D:\paketler)
#   -Deneme            hiçbir şeyi taşımadan ne yapılacağını göster
param(
  [string]$Kaynak = '',
  [string]$Hedef = '',
  [switch]$Deneme
)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try { [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12 } catch {}

$root = Split-Path -Parent $PSScriptRoot

# Bilinen paketler: dosya adı → data\ altındaki klasör
$bilinen = [ordered]@{
  'qwen2.5-3b-instruct-q4_k_m.gguf'           = 'models'
  'Qwen3.5-2B-Q4_K_M.gguf'                    = 'models'
  'wiktionary_tr_all_nopic_2026-10.zim'       = 'zim'
  'mdwiki_en_all_maxi_2025-11.zim'            = 'zim'
  'zimgit-post-disaster_en_2024-05.zim'       = 'zim'
  'zimgit-water_en_2024-08.zim'               = 'zim'
  'zimgit-medicine_en_2024-08.zim'            = 'zim'
  'zimgit-knots_en_2024-08.zim'               = 'zim'
  'zimgit-food-preparation_en_2025-04.zim'    = 'zim'
  'wikibooks_tr_all_maxi_2026-09.zim'         = 'zim'
  'wikisource_tr_all_nopic_2026-10.zim'       = 'zim'
}

# Whisper ses paketi: dosya adı → tar içindeki yol
$whisper = [ordered]@{
  'config.json'                         = 'config.json'
  'generation_config.json'              = 'generation_config.json'
  'preprocessor_config.json'            = 'preprocessor_config.json'
  'tokenizer.json'                      = 'tokenizer.json'
  'tokenizer_config.json'               = 'tokenizer_config.json'
  'encoder_model_quantized.onnx'        = 'onnx/encoder_model_quantized.onnx'
  'decoder_model_merged_quantized.onnx' = 'onnx/decoder_model_merged_quantized.onnx'
}

$ozet = New-Object System.Collections.Generic.List[string]
function Bilgi($t) { Write-Host "  $t" }
function Ozet($t) { $ozet.Add($t); Write-Host "  $t" }
function Boyut([long]$n) {
  if ($n -ge 1GB) { return ('{0:N2} GB' -f ($n / 1GB)) }
  if ($n -ge 1MB) { return ('{0:N1} MB' -f ($n / 1MB)) }
  return "$n B"
}

# Windows'un gerçek "İndirilenler" klasörü (taşınmış olabilir); bulunamazsa %USERPROFILE%\Downloads
function IndirilenlerKlasoru {
  try {
    $k = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\User Shell Folders'
    $v = (Get-ItemProperty -Path $k -Name '{374DE290-123F-4565-9164-39C4925E467B}' -ErrorAction Stop).'{374DE290-123F-4565-9164-39C4925E467B}'
    if ($v) {
      $p = [Environment]::ExpandEnvironmentVariables($v)
      if (Test-Path -LiteralPath $p -PathType Container) { return $p }
    }
  } catch {}
  return (Join-Path $env:USERPROFILE 'Downloads')
}

$tasinan = 0
$atlanan = 0
$hata = 0

try {
  Write-Host ''
  Write-Host '  Akıl Çantası — paketleri yerleştir' -ForegroundColor Cyan

  if (-not $Kaynak) { $Kaynak = IndirilenlerKlasoru }
  if (-not $Hedef) { $Hedef = Join-Path $root 'data' }
  if (-not (Test-Path -LiteralPath $Kaynak -PathType Container)) { throw "Kaynak klasör bulunamadı: $Kaynak" }
  $Kaynak = (Resolve-Path -LiteralPath $Kaynak).ProviderPath
  Bilgi "Aranan klasör : $Kaynak"
  Bilgi "Paket klasörü : $Hedef"
  if ($Deneme) { Write-Host '  DENEME: hiçbir dosya taşınmayacak.' -ForegroundColor Yellow }
  Write-Host ''

  # ---- 1) ZIM ve GGUF dosyaları ----
  foreach ($ad in $bilinen.Keys) {
    $src = Join-Path $Kaynak $ad
    if (-not (Test-Path -LiteralPath $src -PathType Leaf)) { continue }
    $klasor = Join-Path $Hedef $bilinen[$ad]
    $dst = Join-Path $klasor $ad
    $boy = (Get-Item -LiteralPath $src).Length
    if (Test-Path -LiteralPath $dst) {
      $var = (Get-Item -LiteralPath $dst).Length
      if ($var -eq $boy) { Ozet "ATLANDI  $ad — data\$($bilinen[$ad])\ içinde zaten var (aynı boyut); indirilen kopya yerinde bırakıldı." }
      else { Ozet "ATLANDI  $ad — data\$($bilinen[$ad])\ içinde farklı boyutta bir dosya var ($(Boyut $var)); elle kontrol edin." }
      $atlanan++
      continue
    }
    if ($Deneme) { Ozet "TAŞINIR  $ad ($(Boyut $boy)) → data\$($bilinen[$ad])\"; $tasinan++; continue }
    try {
      Bilgi "taşınıyor: $ad ($(Boyut $boy))..."
      New-Item -ItemType Directory -Force -Path $klasor | Out-Null
      Move-Item -LiteralPath $src -Destination $dst
      Ozet "TAŞINDI  $ad ($(Boyut $boy)) → data\$($bilinen[$ad])\"
      if ($ad -like 'qwen2.5-3b*') {
        Ozet '         Not: Qwen2.5-3B "Qwen Research" lisanslıdır (ticari olmayan kullanım). Bkz. README.md.'
      }
      $tasinan++
    } catch {
      Ozet "HATA     $ad taşınamadı: $($_.Exception.Message)"
      $hata++
    }
  }

  # ---- 2) Whisper ses paketi ----
  $bulunan = @($whisper.Keys | Where-Object { Test-Path -LiteralPath (Join-Path $Kaynak $_) -PathType Leaf })
  if ($bulunan.Count -gt 0) {
    $eksik = @($whisper.Keys | Where-Object { $bulunan -notcontains $_ })
    # Chrome küçük .json dosyalarını indirmek yerine sekmede açabiliyor: .onnx dosyaları
    # indirilmiş ama .json'lar eksikse onları doğrudan HuggingFace'ten tamamla (internet gerekir).
    $onnxIndi = $bulunan -contains 'encoder_model_quantized.onnx' -and $bulunan -contains 'decoder_model_merged_quantized.onnx'
    $jsonEksik = @($eksik | Where-Object { $_ -like '*.json' })
    if ($onnxIndi -and $jsonEksik.Count -gt 0 -and -not $Deneme) {
      $R = 'https://huggingface.co/onnx-community/whisper-base/resolve/main'
      foreach ($f in $jsonEksik) {
        try {
          Invoke-WebRequest -Uri "$R/$f" -OutFile (Join-Path $Kaynak $f) -UseBasicParsing
          Bilgi "indirildi (eksikti): $f"
        } catch { Bilgi "indirilemedi: $f ($($_.Exception.Message))" }
      }
      $bulunan = @($whisper.Keys | Where-Object { Test-Path -LiteralPath (Join-Path $Kaynak $_) -PathType Leaf })
      $eksik = @($whisper.Keys | Where-Object { $bulunan -notcontains $_ })
    }
    $cfgYol = Join-Path $Kaynak 'config.json'
    $cfg = $null
    if (Test-Path -LiteralPath $cfgYol -PathType Leaf) {
      try { $cfg = Get-Content -LiteralPath $cfgYol -Raw -Encoding UTF8 | ConvertFrom-Json } catch { $cfg = $null }
    }
    $onnxVar = $bulunan -contains 'encoder_model_quantized.onnx' -or $bulunan -contains 'decoder_model_merged_quantized.onnx'
    if ($cfg -and $cfg.model_type -ne 'whisper') {
      # İndirilenler'deki config.json başka bir şeye ait: dokunma
      if ($onnxVar) { Ozet 'ATLANDI  Whisper: config.json bir Whisper modeline ait değil; ses paketi hazırlanmadı.'; $atlanan++ }
    } elseif ($eksik.Count -gt 0) {
      if ($onnxVar) {
        Ozet "ATLANDI  Whisper ses paketi: eksik dosya(lar): $($eksik -join ', ')"
        $atlanan++
      }
    } else {
      # Boyut: config.json'daki d_model (384 tiny, 512 base, 768 small, 1024 medium)
      $boyAd = switch ([int]$cfg.d_model) { 384 { 'tiny' } 512 { 'base' } 768 { 'small' } 1024 { 'medium' } default { 'base' } }
      $sesKlasor = Join-Path $Hedef 'ses'
      $tarAd = "whisper-$boyAd-ses.tar"
      $tarHedef = Join-Path $sesKlasor $tarAd
      $topBoy = 0
      foreach ($f in $whisper.Keys) { $topBoy += (Get-Item -LiteralPath (Join-Path $Kaynak $f)).Length }
      if (Test-Path -LiteralPath $tarHedef) {
        Ozet "ATLANDI  Whisper: data\ses\$tarAd zaten var; indirilen 7 dosya yerinde bırakıldı."
        $atlanan++
      } elseif ($Deneme) {
        Ozet "PAKETLENİR  Whisper $boyAd (7 dosya, $(Boyut $topBoy)) → data\ses\$tarAd"
        $tasinan += 7
      } else {
        $tarExe = Join-Path $env:SystemRoot 'System32\tar.exe'
        if (-not (Test-Path -LiteralPath $tarExe)) { throw 'tar.exe bulunamadı (Windows 10 1803 ve üstü gerekir).' }
        # Hazırlık klasörü (alt çizgili: bilgi noktası listelemez). Dosyalar buraya TAŞINIR.
        $hazir = Join-Path $sesKlasor "_whisper-$boyAd-hazirlik"
        if (Test-Path -LiteralPath $hazir) { throw "Hazırlık klasörü zaten var (önceki yarım kalmış çalıştırma?): $hazir — içindekileri kontrol edip klasörü kaldırın." }
        New-Item -ItemType Directory -Force -Path (Join-Path $hazir 'onnx') | Out-Null
        Bilgi "Whisper $boyAd ses paketi hazırlanıyor (7 dosya, $(Boyut $topBoy))..."
        try {
          foreach ($f in $whisper.Keys) {
            Move-Item -LiteralPath (Join-Path $Kaynak $f) -Destination (Join-Path $hazir ($whisper[$f] -replace '/', '\'))
          }
        } catch {
          throw "Whisper dosyaları taşınırken hata: $($_.Exception.Message). Taşınanlar burada: $hazir"
        }
        # tar.exe Türkçe karakterli mutlak yollarla sorun çıkarabildiği için hazırlık
        # klasöründe, yalnızca göreli ASCII adlarla çalıştırılır.
        $tarGecici = "$tarAd.part"
        $tarYol = Join-Path $hazir $tarGecici
        $kod = -1
        $liste = @()
        Push-Location -LiteralPath $hazir
        try {
          & $tarExe --format ustar -cf $tarGecici @($whisper.Values)
          $kod = $LASTEXITCODE
          if ($kod -eq 0) { $liste = @(& $tarExe -tf $tarGecici) }
        } finally { Pop-Location }
        $beklenen = @($whisper.Values)
        $tamam = ($kod -eq 0) -and ($liste.Count -eq $beklenen.Count) -and -not ($beklenen | Where-Object { $liste -notcontains $_ })
        if (-not $tamam) {
          Ozet "HATA     Whisper ses paketi oluşturulamadı (tar çıkış kodu $kod). Dosyalar burada duruyor: $hazir"
          $hata++
        } else {
          Move-Item -LiteralPath $tarYol -Destination $tarHedef
          $tarBoy = (Get-Item -LiteralPath $tarHedef).Length
          # Hazırlık klasöründe yalnızca az önce taşıdığımız 7 dosya var; arşiv doğrulandı, kaldırılır.
          foreach ($f in $whisper.Keys) { Remove-Item -LiteralPath (Join-Path $hazir ($whisper[$f] -replace '/', '\')) }
          Remove-Item -LiteralPath (Join-Path $hazir 'onnx')
          Remove-Item -LiteralPath $hazir
          Ozet "TAŞINDI  Whisper ${boyAd}: 7 dosya → data\ses\$tarAd ($(Boyut $tarBoy))"
          $tasinan += 7
        }
      }
    }
  }

  # ---- Özet ----
  Write-Host ''
  Write-Host '  ---------------------------------------------------' -ForegroundColor DarkGray
  Write-Host '  ÖZET' -ForegroundColor Cyan
  if ($ozet.Count -eq 0) {
    Bilgi "Bilinen paket dosyası bulunamadı: $Kaynak"
    Bilgi 'Aranan adlar README.md içindeki "Paketleri yerleştirme" bölümünde.'
  } else {
    foreach ($s in $ozet) { Write-Host "  $s" }
  }
  Write-Host ''
  Bilgi ("Taşınan: {0}   Atlanan: {1}   Hata: {2}" -f $tasinan, $atlanan, $hata)
  if ($tasinan -gt 0 -and -not $Deneme) { Bilgi 'Bilgi noktası çalışıyorsa yeniden başlatmanız gerekmez; uygulamada sayfayı yenilemeniz yeterli.' }
  if ($hata -gt 0) { exit 1 }
  exit 0
} catch {
  Write-Host ''
  Write-Host "  HATA: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}
