// Koleksiyon dizini: giriş sayfası JavaScript ile çizilen koleksiyonlarda (Project Gutenberg,
// bazı tek sayfalık uygulama paketleri) uygulamanın kendi alfabetik listesi. Betik
// çalıştırılmadığı için o giriş sayfaları boş kalır, yalnız dönen bir "yükleniyor" GIF'i görünürdü.
// Liste başlık dizininden parça parça okunur (kaydırdıkça devamı gelir), harfe atlanabilir,
// isteğe bağlı olarak süzülebilir. Kurallar: src/lib/zim/dizin.ts
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { makeRef, type LibrarySource } from '../../lib/library';
import { DizinOkuyucu, dizinGirdisiMi, type DizinGirdisi, type DizinTuru } from '../../lib/zim/dizin';
import { foldCharwise } from '../../lib/zim';
import { acMakale } from './gezinme';
import { AramaKutusu } from './Arama';

const HARFLER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const PARCA = 60;

/** Kaynak başına son liste (kitaptan dönünce aynı yerden devam edilsin, yeniden okunmasın) */
const onbellek = new Map<string, { girdiler: DizinGirdisi[]; konum: number; harf: string; okuyucu: DizinOkuyucu }>();

export function dizinTuru(src: Pick<LibrarySource, 'kind'>): DizinTuru {
  return src.kind === 'gutenberg' ? 'gutenberg' : 'genel';
}

export function KoleksiyonDizini({ src, anaYol, ara = false }: { src: LibrarySource; anaYol: string | null; ara?: boolean }) {
  const tur = dizinTuru(src);
  const gut = tur === 'gutenberg';
  const kayit = onbellek.get(src.id);
  const okuyucu = useMemo(() => kayit?.okuyucu ?? new DizinOkuyucu(src.zim, tur, anaYol), [src]);
  const [girdiler, setGirdiler] = useState<DizinGirdisi[]>(kayit?.girdiler ?? []);
  const [harf, setHarf] = useState(kayit?.harf ?? '');
  const [yukleniyor, setYukleniyor] = useState(false);
  const [bitti, setBitti] = useState(okuyucu.bitti);
  const [q, setQ] = useState('');
  const [sonuc, setSonuc] = useState<DizinGirdisi[] | null>(null);
  const harfRef = useRef(harf);
  /** Okuyucuya erişim sırayla: harfe atlarken süren okuma bitsin (konum karışmasın) */
  const zincir = useRef<Promise<void>>(Promise.resolve());
  const mesgul = useRef(false);
  const sentinel = useRef<HTMLDivElement>(null);

  const yaz = (g: DizinGirdisi[], h: string) => onbellek.set(src.id, { girdiler: g, konum: okuyucu.konum, harf: h, okuyucu });

  const oku = async () => {
    // Az girdi gelen parçalarda (kapaklar, görseller) bir parça daha: liste boş görünmesin
    let yeni: DizinGirdisi[] = [];
    for (let k = 0; k < 4 && yeni.length < PARCA && !okuyucu.bitti; k++) yeni = yeni.concat(await okuyucu.sonraki(PARCA - yeni.length));
    setGirdiler((g) => {
      const t = g.concat(yeni);
      yaz(t, harfRef.current);
      return t;
    });
  };

  const sirayla = (is: () => Promise<void>) => {
    mesgul.current = true;
    setYukleniyor(true);
    zincir.current = zincir.current
      .then(is)
      .catch((e) => console.warn('Koleksiyon dizini okunamadı', e))
      .finally(() => {
        mesgul.current = false;
        setYukleniyor(false);
        setBitti(okuyucu.bitti);
      });
  };

  const devam = () => {
    if (mesgul.current || okuyucu.bitti) return;
    sirayla(oku);
  };

  // İlk parça
  useEffect(() => {
    if (!girdiler.length && !okuyucu.bitti) devam();
  }, [okuyucu]);

  // Liste sonuna yaklaşınca devamı (kaydırma kabı #main)
  useEffect(() => {
    const el = sentinel.current;
    if (!el || bitti || sonuc) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) devam();
      },
      { root: document.getElementById('main'), rootMargin: '0px 0px 900px 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [bitti, sonuc, girdiler.length, yukleniyor]);

  const harfeGit = (h: string) => {
    harfRef.current = h;
    setHarf(h);
    setGirdiler([]);
    yaz([], h);
    sirayla(async () => {
      await okuyucu.atla(h);
      setGirdiler([]);
      await oku();
    });
  };

  // Süzme (okuyucuda: koleksiyon ekranının arama kutusu yokken)
  useEffect(() => {
    const t = q.trim();
    if (!t) return setSonuc(null);
    let alive = true;
    const z = setTimeout(async () => {
      const hits = await src.zim.searchTitles(t, 120, true).catch(() => []);
      const out: DizinGirdisi[] = [];
      for (const h of hits) if (dizinGirdisiMi(tur, h, anaYol)) out.push(await okuyucu.tamamla(h));
      // Yazar adıyla da (yüklenmiş liste içinde): "austen" → Jane Austen'in kitapları
      const fq = foldCharwise(t);
      const var_ = new Set(out.map((g) => g.path));
      for (const g of onbellek.get(src.id)?.girdiler ?? []) {
        if (g.author && !var_.has(g.path) && foldCharwise(g.author).includes(fq)) out.push(g);
      }
      if (alive) setSonuc(out);
    }, 250);
    return () => {
      alive = false;
      clearTimeout(z);
    };
  }, [q]);

  const liste = sonuc ?? girdiler;
  const ad = gut ? 'kitap' : 'sayfa';
  return (
    <section class="kt kt-dizin" style="gap:10px" aria-labelledby="kt-dizin-h" data-testid="lib-dizin" data-tur={tur}>
      <h2 class="kt-h2" id="kt-dizin-h">
        {gut ? 'Kitaplar' : 'Sayfalar'} <small>A’dan Z’ye</small>
      </h2>
      <p class="kt-note" data-testid="lib-dizin-not">
        {gut
          ? 'Kitaplar adlarına göre sıralı. Bir kitaba dokunun; bu cihazdan, internetsiz açılır.'
          : 'Bu koleksiyonun giriş sayfası tarayıcı betikleriyle çalışıyor; Akıl Çantası güvenlik için betik çalıştırmaz. Sayfalar aşağıda alfabetik sırayla.'}
      </p>
      {ara && <AramaKutusu value={q} placeholder={gut ? 'Kitap adıyla ara' : 'Sayfa adıyla ara'} onInput={setQ} onCancel={q ? () => setQ('') : undefined} />}
      {!sonuc && (
        <div class="kt-chips kt-harfler" role="group" aria-label="Harfe atla" data-testid="lib-dizin-harfler">
          <button class="chip" aria-pressed={harf === ''} onClick={() => harfeGit('')}>
            Tümü
          </button>
          {HARFLER.map((h) => (
            <button key={h} class="chip" aria-pressed={harf === h} aria-label={`${h} harfi`} data-testid="lib-dizin-harf" onClick={() => harfeGit(h)}>
              {h}
            </button>
          ))}
        </div>
      )}
      <ul class="kt-list" data-testid="lib-dizin-liste" aria-busy={yukleniyor}>
        {liste.map((g) => (
          <li key={g.path}>
            <button class="kt-row" data-testid="lib-dizin-item" data-path={g.path} onClick={() => acMakale(makeRef(src.id, g.path), { yeni: true })}>
              <span class="kt-row-t">
                <b>{g.title}</b>
                {g.author && <span>{g.author}</span>}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {sonuc && !sonuc.length && <p class="empty">Bu adla bir {ad} bulunamadı.</p>}
      {!sonuc && !yukleniyor && bitti && !girdiler.length && <p class="empty">{harf ? `“${harf}” ile başlayan bir ${ad} yok.` : `Bu koleksiyonda listelenecek bir ${ad} bulunamadı.`}</p>}
      {!sonuc && !bitti && (
        <div ref={sentinel} class="kt-dizin-alt">
          <button class="btn kt-more" data-testid="lib-dizin-more" disabled={yukleniyor} onClick={devam}>
            {yukleniyor ? 'Yükleniyor…' : 'Devamını göster'}
          </button>
        </div>
      )}
    </section>
  );
}
