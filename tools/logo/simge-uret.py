#!/usr/bin/env python3
"""Akıl Çantası — uygulama simgesi ve açılış ekranı dosyalarını tek kaynaktan üretir.

Logo: kitap oyuklu çanta, Şafak gradyanı (src/Logo.tsx ile aynı geometri, 1024 birim).

Üretilenler:
  public/icon.svg                     tarayıcı/PWA simgesi (yuvarlatılmış kare)
  public/icon-maskable.svg            PWA maskelenebilir simge (tam kare, güvenli alanda çanta)
  public/icon-192.png, icon-512.png   PWA PNG simgeleri
  android/.../drawable/ic_launcher_bg.xml       uyarlanabilir simge arka planı (gradyan vektör)
  android/.../drawable/ic_launcher_fg.xml       uyarlanabilir simge ön planı (beyaz çanta)
  android/.../drawable/ic_launcher_mono.xml     tek renkli tema simgesi (Android 13+)
  android/.../mipmap-anydpi-v26/ic_launcher(.xml|_round.xml)
  android/.../mipmap-*/ic_launcher.png, ic_launcher_round.png   eski Android sürümleri için
  android/.../drawable*/splash.png    açılış ekranı (lacivert zemin, ortada logo)

Kullanım: python3 tools/logo/simge-uret.py   (Pillow ve Playwright gerekir)
"""
import os, re, io
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RES = os.path.join(ROOT, 'android/app/src/main/res')

STOPS = ['#FDE047', '#FB923C', '#F43F5E']
NAVY = '#0E1B2C'
BODY = 'M352 296H672C732 296 762 326 770 386C782 476 804 610 812 694C818 764 784 810 722 810H302C240 810 206 764 212 694C220 610 242 476 254 386C262 326 292 296 352 296Z'
HANDLE = 'M393 330V313A118 118 0 0 1 629 313V330'
LPAGE = 'M370 424H474Q500 424 500 450V682C470 652 420 640 370 640Q344 640 344 614V450Q344 424 370 424Z'
RPAGE = 'M654 424H550Q524 424 524 450V682C554 652 604 640 654 640Q680 640 680 614V450Q680 424 654 424Z'
# Çantanın sınırları (sap dahil): x 206..818, y 167..810
BAG_CX, BAG_CY, BAG_H = 512, 488, 643


def offsets():
    n = len(STOPS) - 1
    return [0.05 + 0.85 * i / n for i in range(len(STOPS))]


def stops_svg():
    return ''.join(f'<stop offset="{o:.2f}" stop-color="{c}"/>' for o, c in zip(offsets(), STOPS))


def bag_svg(fill='#fff'):
    return (f'<path d="{HANDLE}" fill="none" stroke="{fill}" stroke-width="56" stroke-linecap="round"/>'
            f'<path d="{BODY}{LPAGE}{RPAGE}" fill="{fill}" fill-rule="evenodd"/>')


def icon_svg(rounded=True, bag_scale=1.0):
    rx = ' rx="230"' if rounded else ''
    t = '' if bag_scale == 1 else f' transform="translate({512 - 512 * bag_scale} {512 - 512 * bag_scale}) scale({bag_scale})"'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">'
            f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">{stops_svg()}</linearGradient></defs>'
            f'<rect width="1024" height="1024"{rx} fill="url(#g)"/><g{t}>{bag_svg()}</g></svg>')


def splash_svg(w, h, logo):
    # Lacivert zemin, ortada simge (yuvarlatılmış kare)
    x, y = (w - logo) / 2, (h - logo) / 2 - h * 0.03
    s = logo / 1024
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">'
            f'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">{stops_svg()}</linearGradient></defs>'
            f'<rect width="{w}" height="{h}" fill="{NAVY}"/>'
            f'<g transform="translate({x} {y}) scale({s})"><rect width="1024" height="1024" rx="230" fill="url(#g)"/>{bag_svg()}</g></svg>')


def render(svg, w, h, transparent=True):
    from playwright.sync_api import sync_playwright
    html = ('<html><head><style>html,body{margin:0;background:transparent}svg{display:block;width:100%;height:100%}</style></head>'
            f'<body><div style="width:{w}px;height:{h}px">{svg}</div></body></html>')
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={'width': w, 'height': h})
        pg.set_content(html)
        png = pg.screenshot(omit_background=transparent, clip={'x': 0, 'y': 0, 'width': w, 'height': h})
        b.close()
    return Image.open(io.BytesIO(png)).convert('RGBA')


# ---------------------------------------------------------------- Android vektörleri

def vector_group(scale_to=58.0, vp=108):
    # Çantayı 108 birimlik tuvalin ortasına, güvenli alan (66) içinde kalacak boyda yerleştir
    s = scale_to / BAG_H
    tx, ty = vp / 2 - BAG_CX * s, vp / 2 - BAG_CY * s
    return s, tx, ty


def fg_xml(color='#FFFFFFFF'):
    s, tx, ty = vector_group()
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Uygulama simgesi ön planı: kitap oyuklu çanta (tools/logo/simge-uret.py üretir) -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <group android:scaleX="{s:.6f}" android:scaleY="{s:.6f}" android:translateX="{tx:.4f}" android:translateY="{ty:.4f}">
        <path android:pathData="{HANDLE}" android:strokeColor="{color}" android:strokeWidth="56" android:strokeLineCap="round" />
        <path android:pathData="{BODY}{LPAGE}{RPAGE}" android:fillColor="{color}" android:fillType="evenOdd" />
    </group>
</vector>
'''


def bg_xml():
    items = '\n'.join(f'                    <item android:offset="{o:.2f}" android:color="#FF{c[1:]}" />' for o, c in zip(offsets(), STOPS))
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Uygulama simgesi arka planı: Şafak gradyanı (tools/logo/simge-uret.py üretir) -->
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:aapt="http://schemas.android.com/aapt"
    android:width="108dp" android:height="108dp"
    android:viewportWidth="108" android:viewportHeight="108">
    <path android:pathData="M0,0h108v108h-108z">
        <aapt:attr name="android:fillColor">
            <gradient android:type="linear" android:startX="0" android:startY="0" android:endX="108" android:endY="108">
{items}
            </gradient>
        </aapt:attr>
    </path>
</vector>
'''


ADAPTIVE = '''<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/ic_launcher_bg" />
    <foreground android:drawable="@drawable/ic_launcher_fg" />
    <monochrome android:drawable="@drawable/ic_launcher_mono" />
</adaptive-icon>
'''

DENS = {'ldpi': 0.75, 'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}


def main():
    pub = os.path.join(ROOT, 'public')
    open(os.path.join(pub, 'icon.svg'), 'w').write(icon_svg())
    # Maskelenebilir: tam kare zemin; çanta güvenli alana (%80 daire) sığsın diye küçültülür
    open(os.path.join(pub, 'icon-maskable.svg'), 'w').write(icon_svg(rounded=False, bag_scale=0.78))
    big = render(icon_svg(), 512, 512)
    big.save(os.path.join(pub, 'icon-512.png'))
    big.resize((192, 192), Image.LANCZOS).save(os.path.join(pub, 'icon-192.png'))

    # Android uyarlanabilir simge (vektör)
    os.makedirs(os.path.join(RES, 'drawable'), exist_ok=True)
    open(os.path.join(RES, 'drawable/ic_launcher_bg.xml'), 'w').write(bg_xml())
    open(os.path.join(RES, 'drawable/ic_launcher_fg.xml'), 'w').write(fg_xml())
    open(os.path.join(RES, 'drawable/ic_launcher_mono.xml'), 'w').write(fg_xml('#FF000000'))
    for name in ('ic_launcher.xml', 'ic_launcher_round.xml'):
        open(os.path.join(RES, 'mipmap-anydpi-v26', name), 'w').write(ADAPTIVE)

    # Eski sürümler: PNG (kare ve yuvarlak)
    sq = render(icon_svg(), 768, 768)
    full = render(icon_svg(rounded=False, bag_scale=0.86), 768, 768)
    mask = Image.new('L', (768, 768), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(mask).ellipse((0, 0, 767, 767), fill=255)
    rnd = Image.new('RGBA', (768, 768), (0, 0, 0, 0))
    rnd.paste(full, (0, 0), mask)
    for d, k in DENS.items():
        px = round(48 * k)
        folder = os.path.join(RES, f'mipmap-{d}')
        os.makedirs(folder, exist_ok=True)
        sq.resize((px, px), Image.LANCZOS).save(os.path.join(folder, 'ic_launcher.png'))
        rnd.resize((px, px), Image.LANCZOS).save(os.path.join(folder, 'ic_launcher_round.png'))
        for old in ('ic_launcher_foreground.png', 'ic_launcher_background.png'):
            if os.path.exists(os.path.join(folder, old)):
                os.remove(os.path.join(folder, old))

    # Açılış ekranı: mevcut her splash.png aynı boyutta yeniden üretilir
    cache = {}
    for dp, _, files in os.walk(RES):
        if 'splash.png' not in files:
            continue
        f = os.path.join(dp, 'splash.png')
        w, h = Image.open(f).size
        if (w, h) not in cache:
            logo = round(min(w, h) * 0.30)
            cache[(w, h)] = render(splash_svg(w, h, logo), w, h, transparent=False).convert('RGB')
        cache[(w, h)].save(f, optimize=True)
    print('Simgeler ve açılış ekranları üretildi:', len(cache), 'farklı açılış boyutu')


if __name__ == '__main__':
    main()
