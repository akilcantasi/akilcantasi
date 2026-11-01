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
  // Her açılışta yeni anahtar: aynı adlı paket değişirse eski karolar karışmaz
  const adapter = new RandomAccessPmtilesSource(src, `ac${++seq}-${src.name.replace(/[^A-Za-z0-9._-]/g, '_')}`);
  const pm = new PMTiles(adapter);
  p.add(pm);
  return { url: 'pmtiles://' + adapter.getKey(), pmtiles: pm };
}

export { PMTiles };
