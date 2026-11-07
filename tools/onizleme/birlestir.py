#!/usr/bin/env python3
"""README önizlemeleri — 3. adım: kareleri küçültüp hareketli WebP ve PNG yapar.

Kullanım: python3 tools/onizleme/birlestir.py [kare-klasörü] [çıktı-klasörü]
  varsayılan: /tmp/akil-onizleme/kare → docs/images
Gereksinim: Pillow (WebP destekli).
"""
import json
import os
import sys
import tempfile

from PIL import Image

KOK = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
KARE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(tempfile.gettempdir(), "akil-onizleme", "kare"))
CIKTI = os.path.abspath(sys.argv[2] if len(sys.argv) > 2 else os.path.join(KOK, "docs", "images"))
BOYUT = (1200, 750)        # hareketli önizleme
TEK_GEN = 480              # tablo görüntüleri (2× çekilmiş, küçültülür)
SINIR = 2.5 * 1024 * 1024  # dosya başına üst sınır

os.makedirs(CIKTI, exist_ok=True)
with open(os.path.join(KARE, "kareler.json"), encoding="utf-8") as f:
    ozet = json.load(f)


def webp_yaz(ad, liste):
    kareler = [Image.open(os.path.join(KARE, k["dosya"])).convert("RGB").resize(BOYUT, Image.LANCZOS) for k in liste]
    sureler = [k["sure"] for k in liste]
    hedef = os.path.join(CIKTI, ad + ".webp")
    for kalite in (92, 86, 80, 74, 68):
        kareler[0].save(hedef, save_all=True, append_images=kareler[1:], duration=sureler, loop=0,
                        quality=kalite, method=6, lossless=False)
        if os.path.getsize(hedef) <= SINIR:
            break
    print(f"  {ad}.webp: {len(kareler)} kare, {os.path.getsize(hedef) / 1024:.0f} KB (kalite {kalite})")


for ad, liste in ozet["dosyalar"].items():
    webp_yaz(ad, liste)

for ad, dosya in ozet["tekler"].items():
    im = Image.open(os.path.join(KARE, dosya)).convert("RGBA")
    h = round(im.height * TEK_GEN / im.width)
    im = im.resize((TEK_GEN, h), Image.LANCZOS)
    hedef = os.path.join(CIKTI, ad + ".png")
    im.save(hedef, optimize=True)
    print(f"  {ad}.png: {im.width}×{im.height}, {os.path.getsize(hedef) / 1024:.0f} KB")

print("Bitti →", CIKTI)
