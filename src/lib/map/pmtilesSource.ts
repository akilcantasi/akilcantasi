// PMTiles ↔ RandomAccessSource köprüsü. Harita paketi cihazın deposunda
// (OPFS/File) ya da yerel sunucuda dursa da aynı okuyucu kullanılır; pmtiles
// kütüphanesi asla kendi başına ağa çıkmaz (FetchSource kullanılmaz).
import { PMTiles, Protocol, type RangeResponse, type Source } from 'pmtiles';
import type { RandomAccessSource } from '../source';

export class RandomAccessPmtilesSource implements Source {
  constructor(private src: RandomAccessSource, private key = 'ac-' + src.name.replace(/[^A-Za-z0-9._-]/g, '_')) {}

  getKey(): string {
    return this.key;
  }

  /** Aynı paketin yeniden açılmış kaynağına geç (önbellekler korunur) */
  setSource(src: RandomAccessSource) {
    this.src = src;
  }

  async getBytes(offset: number, length: number, signal?: AbortSignal): Promise<RangeResponse> {
    if (signal?.aborted) throw new DOMException('İptal edildi', 'AbortError');
    const u8 = await this.src.read(offset, length);
    // pmtiles tam bir ArrayBuffer bekler; alt-dizi görünümü ise kopyala
    const data =
      u8.byteOffset === 0 && u8.byteLength === u8.buffer.byteLength
        ? (u8.buffer as ArrayBuffer)
        : (u8.slice().buffer as ArrayBuffer);
    return { data };
  }
}

let protocol: Protocol | null = null;
let seq = 0;
let registered = false;
/** Açık harita paketleri: ad + boyut → PMTiles */
const live = new Map<string, { adapter: RandomAccessPmtilesSource; pm: PMTiles }>();

/** maplibre-gl modülüne 'pmtiles' protokolünü bir kez kaydeder. */
export function ensurePmtilesProtocol(maplibre: { addProtocol: (name: string, fn: any) => void }): Protocol {
  if (!protocol) protocol = new Protocol();
  if (!registered) {
    maplibre.addProtocol('pmtiles', protocol.tile);
    registered = true;
  }
  return protocol;
}

/**
 * Kaynağı protokole ekler ve stilde kullanılacak "pmtiles://<anahtar>" adresini döndürür.
 * Anahtar protokolde kayıtlı olduğu sürece pmtiles hiçbir HTTP isteği yapmaz.
 */
export function addPmtilesSource(
  maplibre: { addProtocol: (name: string, fn: any) => void },
  src: RandomAccessSource,
): { url: string; pmtiles: PMTiles } {
  const p = ensurePmtilesProtocol(maplibre);
  // Harita sekmesi her girişte yeniden kurulur. Aynı paket (ad + boyut) için aynı PMTiles
  // nesnesi kullanılır: protokolde her girişte yeni nesne (dizin önbelleği ve dosya
  // tutamağıyla) birikmez, başlık ve dizinler yeniden okunmaz. Paket değişirse (güncelleme,
  // başka dosya) yeni anahtar alınır, eskiler bırakılır; eski karolar karışmaz.
  const id = `${src.name}\u0000${src.size}`;
  let e = live.get(id);
  if (e) e.adapter.setSource(src);
  else {
    for (const [k, old] of live) {
      live.delete(k);
      // Kapanan haritanın yoldaki son karo istekleri bitsin diye biraz sonra
      setTimeout(() => p.tiles.delete(old.adapter.getKey()), 15_000);
    }
    const adapter = new RandomAccessPmtilesSource(src, `ac${++seq}-${src.name.replace(/[^A-Za-z0-9._-]/g, '_')}`);
    e = { adapter, pm: new PMTiles(adapter) };
    live.set(id, e);
    p.add(e.pm);
  }
  return { url: 'pmtiles://' + e.adapter.getKey(), pmtiles: e.pm };
}

/** Okunamayan kaynağı unutur: bir sonraki açılış yeniden dener (hata önbellekte kalmaz). */
export function dropPmtilesSource(url: string) {
  const key = url.replace(/^pmtiles:\/\//, '');
  for (const [k, e] of live) if (e.adapter.getKey() === key) live.delete(k);
  protocol?.tiles.delete(key);
}

/** Protokolde kayıtlı harita kaynağı sayısı (testler: sekme değişiminde birikmemeli) */
export function pmtilesSourceCount(): number {
  return protocol ? protocol.tiles.size : 0;
}

export { PMTiles };
