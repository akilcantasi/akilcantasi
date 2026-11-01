// Rastgele erişimli veri kaynağı. ZIM okuyucu ve harita (PMTiles) büyük
// dosyaların tamamını belleğe almadan sadece gereken baytları okur.

export interface RandomAccessSource {
  readonly size: number;
  readonly name: string;
  read(offset: number, length: number): Promise<Uint8Array>;
}

/** Tarayıcıdaki File/Blob (kullanıcının seçtiği dosya ya da OPFS dosyası). */
export class BlobSource implements RandomAccessSource {
  constructor(private blob: Blob, readonly name = (blob as File).name ?? 'blob') {}
  get size() {
    return this.blob.size;
  }
  async read(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(offset + length, this.blob.size);
    const buf = await this.blob.slice(offset, end).arrayBuffer();
    return new Uint8Array(buf);
  }
  get rawBlob() {
    return this.blob;
  }
}

/** HTTP Range destekli sunucudaki dosya (masaüstü sunucusu / bilgi noktası). */
export class HttpRangeSource implements RandomAccessSource {
  private constructor(private url: string, readonly size: number, readonly name: string) {}

  static async open(url: string): Promise<HttpRangeSource> {
    const head = await fetch(url, { method: 'HEAD' });
    if (!head.ok) throw new Error(`Dosya açılamadı: ${url} (${head.status})`);
    const size = Number(head.headers.get('content-length') ?? '0');
    if (!size) throw new Error(`Dosya boyutu okunamadı: ${url}`);
    return new HttpRangeSource(url, size, url.split('/').pop() ?? url);
  }

  /** Boyutu bilinen dosya (HEAD isteği gerekmez) */
  static withSize(url: string, size: number, name?: string): HttpRangeSource {
    return new HttpRangeSource(url, size, name ?? url.split('/').pop() ?? url);
  }

  async read(offset: number, length: number): Promise<Uint8Array> {
    const end = Math.min(offset + length, this.size) - 1;
    const res = await fetch(this.url, { headers: { Range: `bytes=${offset}-${end}` } });
    if (res.status !== 206 && res.status !== 200) throw new Error(`Okuma hatası ${res.status}`);
    const buf = new Uint8Array(await res.arrayBuffer());
    if (res.status === 200) return buf.subarray(offset, end + 1);
    return buf;
  }
}

/** Node testleri için: bellekteki bayt dizisi. */
export class BytesSource implements RandomAccessSource {
  constructor(private bytes: Uint8Array, readonly name = 'bytes') {}
  get size() {
    return this.bytes.length;
  }
  async read(offset: number, length: number) {
    return this.bytes.subarray(offset, Math.min(offset + length, this.bytes.length));
  }
}
