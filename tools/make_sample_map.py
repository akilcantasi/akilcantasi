#!/usr/bin/env python3
"""Akıl Çantası — örnek (SENTETİK) harita ve nokta paketi üretici.

Üretilenler:
  testdata/sample_ornek.pmtiles       Protomaps basemap şemasında küçük vektör karo seti
  testdata/sample_poi_ornek.geojson   Her türden 12 adet "Örnek ..." noktası

UYARI: Buradaki geometri tamamen uydurmadır (Ankara/Kızılay civarına
yerleştirilmiş hayali bir göl kıyısı, birkaç yol, birkaç park). Gerçek konum
doğruluğu iddia etmez; yalnızca arayüz ve okuyucu testleri içindir. Gerçek
paket üretimi için tools/osm_poi_export.md belgesine bakın.

Gereksinimler: pip install pmtiles mapbox-vector-tile shapely
Kullanım:      python3 tools/make_sample_map.py [çıktı_klasörü]
"""
import gzip
import json
import math
import os
import random
import sys

import mapbox_vector_tile
import numpy as np
import shapely
from pmtiles.tile import Compression, TileType, zxy_to_tileid
from pmtiles.writer import Writer
from shapely.geometry import LineString, Point, Polygon, box, mapping

BBOX = (32.64, 39.87, 32.89, 39.97)  # min_lon, min_lat, max_lon, max_lat
MINZ, MAXZ = 10, 15
EXTENT = 4096
R = 6378137.0


def merc(lon, lat):
    x = math.radians(lon) * R
    y = math.log(math.tan(math.pi / 4 + math.radians(lat) / 2)) * R
    return x, y


def to_merc(geom):
    return shapely.transform(geom, lambda arr: np.array([merc(x, y) for x, y in arr]))


def tile_bounds_merc(z, x, y):
    n = 2 ** z
    size = 2 * math.pi * R / n
    minx = -math.pi * R + x * size
    maxy = math.pi * R - y * size
    return minx, maxy - size, minx + size, maxy


def lonlat_to_tile(lon, lat, z):
    n = 2 ** z
    x = int((lon + 180) / 360 * n)
    lat_r = math.radians(lat)
    y = int((1 - math.log(math.tan(lat_r) + 1 / math.cos(lat_r)) / math.pi) / 2 * n)
    return x, y


# ---- Sentetik geometri (lon/lat) ----
WATER = Polygon([
    (32.59, 40.01), (32.815, 40.01), (32.82, 39.96), (32.832, 39.938), (32.848, 39.925),
    (32.838, 39.914), (32.81, 39.908), (32.78, 39.898), (32.75, 39.89), (32.72, 39.886),
    (32.69, 39.882), (32.66, 39.878), (32.59, 39.876),
])
WORLD = box(32.59, 39.83, 32.94, 40.01)
EARTH = WORLD.difference(WATER)

ROADS = [
    # (kind, min_zoom, koordinatlar)
    ('highway', 10, [(32.65, 39.862), (32.71, 39.871), (32.77, 39.882), (32.82, 39.895), (32.855, 39.914), (32.89, 39.93)]),
    ('major_road', 10, [(32.855, 39.914), (32.865, 39.94), (32.88, 39.97)]),
    ('major_road', 11, [(32.73, 39.888), (32.74, 39.875), (32.75, 39.85)]),
    ('medium_road', 12, [(32.79, 39.902), (32.805, 39.89), (32.82, 39.875)]),
    ('minor_road', 13, [(32.84, 39.92), (32.85, 39.918), (32.86, 39.922), (32.87, 39.92)]),
    ('minor_road', 13, [(32.845, 39.91), (32.85, 39.918), (32.853, 39.93)]),
    ('minor_road', 13, [(32.72, 39.886), (32.725, 39.88), (32.735, 39.878)]),
    ('path', 14, [(32.75, 39.891), (32.76, 39.887), (32.77, 39.886)]),
]
ROADS = [(k, mz, LineString(c)) for k, mz, c in ROADS]

PARKS = [
    ('park', Polygon([(32.858, 39.922), (32.868, 39.922), (32.868, 39.928), (32.858, 39.928)])),
    ('park', Polygon([(32.730, 39.878), (32.738, 39.878), (32.738, 39.883), (32.730, 39.883)])),
    ('forest', Polygon([(32.77, 39.85), (32.83, 39.85), (32.83, 39.875), (32.77, 39.87)])),
]

random.seed(42)
BUILDINGS = []
for cx, cy, n in [(32.852, 39.918, 40), (32.728, 39.882, 25)]:
    for _ in range(n):
        x = cx + random.uniform(-0.008, 0.008)
        y = cy + random.uniform(-0.004, 0.004)
        w = random.uniform(0.0002, 0.0004)
        h = random.uniform(0.00015, 0.0003)
        b = box(x, y, x + w, y + h)
        if not b.intersects(WATER):
            BUILDINGS.append(b)

M_EARTH = to_merc(EARTH)
M_WATER = to_merc(WATER)
M_ROADS = [(k, mz, to_merc(g)) for k, mz, g in ROADS]
M_PARKS = [(k, to_merc(g)) for k, g in PARKS]
M_BUILD = [to_merc(g) for g in BUILDINGS]


def clip(geom, tb):
    buf = (tb[2] - tb[0]) * 64 / EXTENT
    c = geom.intersection(box(tb[0] - buf, tb[1] - buf, tb[2] + buf, tb[3] + buf))
    return None if c.is_empty else c


def make_tile(z, x, y):
    tb = tile_bounds_merc(z, x, y)
    layers = []

    def add(name, feats):
        if feats:
            layers.append({'name': name, 'features': feats})

    e = clip(M_EARTH, tb)
    add('earth', [{'geometry': e, 'properties': {'kind': 'earth'}}] if e else [])
    w = clip(M_WATER, tb)
    add('water', [{'geometry': w, 'properties': {'kind': 'water'}}] if w else [])
    lu = []
    for k, g in M_PARKS:
        c = clip(g, tb)
        if c:
            lu.append({'geometry': c, 'properties': {'kind': k}})
    add('landuse', lu)
    rd = []
    for k, mz, g in M_ROADS:
        if z < mz:
            continue
        c = clip(g, tb)
        if c:
            rd.append({'geometry': c, 'properties': {'kind': k}})
    add('roads', rd)
    if z >= 14:
        bl = []
        for g in M_BUILD:
            c = clip(g, tb)
            if c:
                bl.append({'geometry': c, 'properties': {'kind': 'building'}})
        add('buildings', bl)
    if not layers:
        return None
    data = mapbox_vector_tile.encode(
        layers,
        default_options={'quantize_bounds': tb, 'extents': EXTENT, 'y_coord_down': False},
    )
    return gzip.compress(data, mtime=0)


def build_pmtiles(path):
    tiles = []
    for z in range(MINZ, MAXZ + 1):
        x0, y0 = lonlat_to_tile(BBOX[0], BBOX[3], z)
        x1, y1 = lonlat_to_tile(BBOX[2], BBOX[1], z)
        for x in range(x0, x1 + 1):
            for y in range(y0, y1 + 1):
                t = make_tile(z, x, y)
                if t:
                    tiles.append((zxy_to_tileid(z, x, y), t))
    tiles.sort()
    with open(path, 'wb') as f:
        wr = Writer(f)
        for tid, data in tiles:
            wr.write_tile(tid, data)
        e7 = lambda v: int(round(v * 1e7))
        wr.finalize(
            {
                'tile_type': TileType.MVT,
                'tile_compression': Compression.GZIP,
                'min_lon_e7': e7(BBOX[0]),
                'min_lat_e7': e7(BBOX[1]),
                'max_lon_e7': e7(BBOX[2]),
                'max_lat_e7': e7(BBOX[3]),
                'center_zoom': 12,
                'center_lon_e7': e7(32.79),
                'center_lat_e7': e7(39.91),
            },
            {
                'name': 'Akıl Çantası örnek harita (sentetik)',
                'description': 'SENTETIK test geometrisi - gercek konum dogrulugu yoktur',
                'attribution': '© OpenStreetMap katkıcıları (şema) · sentetik test verisi',
                'vector_layers': [
                    {'id': n, 'fields': {'kind': 'String'}}
                    for n in ['earth', 'water', 'landuse', 'roads', 'buildings']
                ],
            },
        )
    return len(tiles)


TYPES = [
    ('toplanma', 'Örnek toplanma alanı', 'Açık alan — sentetik test noktası'),
    ('saglik', 'Örnek sağlık noktası', 'Sentetik test noktası'),
    ('eczane', 'Örnek eczane', None),
    ('su', 'Örnek su noktası', 'Sentetik — içme suyu olduğu varsayılır'),
    ('barinma', 'Örnek barınma noktası', None),
]


def build_poi(path):
    rnd = random.Random(7)
    feats = []
    land = EARTH.intersection(box(*BBOX))
    for t, label, note in TYPES:
        i = 0
        while i < 12:
            lon = rnd.uniform(BBOX[0] + 0.01, BBOX[2] - 0.01)
            lat = rnd.uniform(BBOX[1] + 0.004, BBOX[3] - 0.01)
            p = Point(lon, lat)
            if not land.contains(p) or WATER.distance(p) < 0.002:
                continue
            i += 1
            props = {'name': f'{label} {i}', 'type': t}
            if note:
                props['note'] = note
            feats.append({'type': 'Feature', 'geometry': {'type': 'Point', 'coordinates': [round(lon, 6), round(lat, 6)]}, 'properties': props})
    fc = {'type': 'FeatureCollection', 'name': 'Örnek noktalar (sentetik)', 'features': feats}
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(fc, f, ensure_ascii=False, indent=1)
    return len(feats)


if __name__ == '__main__':
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(__file__), '..', 'testdata')
    os.makedirs(out, exist_ok=True)
    n = build_pmtiles(os.path.join(out, 'sample_ornek.pmtiles'))
    m = build_poi(os.path.join(out, 'sample_poi_ornek.geojson'))
    print(f'{n} karo, {m} nokta yazıldı -> {os.path.abspath(out)}')
