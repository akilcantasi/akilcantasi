// Geri tuşu: uygulama içi gezinme tarayıcı geçmişine işlenir.
//
// Sekme, açık araç/bölüm/rehber/kategori/makale ve kurulum ekranı değişince geçmişe bir
// kayıt eklenir (history.pushState; adres değişmez). Geri (tarayıcı geri düğmesi, Android
// geri tuşu → WebView.goBack → popstate) bir önceki ekrana döner; uygulama birden kapanmaz.
// Uygulama içindeki "← Araçlar" gibi düğmeler bir önceki ekrana dönüyorsa yeni kayıt
// eklenmez, geçmişte bir adım geri gidilir: böylece geri tuşu "aşağı" inmez.
import { useEffect, useRef } from 'preact/hooks';
import { getState, setState, subscribe, TAB_IDS, type AppState } from './lib/store';

const ALANLAR = ['tab', 'openTool', 'openComm', 'openGuideId', 'openCategoryId', 'openArticlePath', 'kurulum'] as const;
export type Ekran = Pick<AppState, (typeof ALANLAR)[number]>;

export function ekranOf(s: AppState | Ekran): Ekran {
  return {
    tab: s.tab,
    openTool: s.openTool,
    openComm: s.openComm,
    openGuideId: s.openGuideId,
    openCategoryId: s.openCategoryId,
    openArticlePath: s.openArticlePath,
    kurulum: s.kurulum,
  };
}

export function ayniEkran(a: Ekran, b: Ekran): boolean {
  return ALANLAR.every((k) => a[k] === b[k]);
}

const strOrNull = (v: unknown) => v === null || (typeof v === 'string' && v.length <= 512);

/** history.state'ten gelen kaydı doğrular (başka kodun ya da eski sürümün bıraktığı veri olabilir) */
export function gecerliEkran(v: unknown): Ekran | null {
  if (!v || typeof v !== 'object') return null;
  const o = v as Record<string, unknown>;
  if (typeof o.tab !== 'string' || !(TAB_IDS as readonly string[]).includes(o.tab)) return null;
  if (!['openTool', 'openComm', 'openGuideId', 'openCategoryId', 'openArticlePath'].every((k) => strOrNull(o[k]))) return null;
  return ekranOf({ ...(o as unknown as Ekran), kurulum: o.kurulum === true });
}

let kurulu = false;

// ---- Katmanlar: ekranın üstünde açılan pencereler (PDF okuyucu, harita kartı, model paneli…) ----
// Geçmişe ayrı kayıt eklemezler. Biri açıkken geri tuşuna basılırsa ekran değişmez: en üstteki
// katman kapanır ve geri gidilen kayıt yeniden yazılır. İlk ekranda (geride kayıt yokken) katman
// açılınca bir "koruma" kaydı eklenir; yoksa Android geri tuşu uygulamadan çıkardı. Koruma,
// katmanlar kapanınca ya da başka ekrana geçilince kaldırılır (boşa basılan geri olmasın).
type Katman = { jeton: number; kapat: () => void };
let katmanlar: Katman[] = [];
let sonJeton = 0;
/** initGecmis içinde atanır: ilk ekranda koruma kaydı ekle / gereksizse kaldır */
let korumaEkle: () => void = () => {};
let korumaKaldir: () => void = () => {};

/** Katman açıldı: geri tuşu önce onu kapatsın. Dönen işlev katman kapanınca çağrılır. */
export function katmanAc(kapat: () => void): () => void {
  const jeton = ++sonJeton;
  katmanlar.push({ jeton, kapat });
  korumaEkle();
  return () => {
    const vardi = katmanlar.length;
    katmanlar = katmanlar.filter((k) => k.jeton !== jeton);
    if (vardi && !katmanlar.length) korumaKaldir();
  };
}

/** Preact: `acik` iken geri tuşu `kapat`ı çağırır */
export function useGeriKapat(acik: boolean, kapat: () => void) {
  const ref = useRef(kapat);
  ref.current = kapat;
  useEffect(() => {
    if (!acik) return;
    return katmanAc(() => ref.current());
  }, [acik]);
}

export function initGecmis() {
  if (kurulu || typeof window === 'undefined' || typeof history === 'undefined') return;
  kurulu = true;
  const oturum = Math.random().toString(36).slice(2);
  let yigin: Ekran[] = [ekranOf(getState())];
  let i = 0;
  let geriBekleniyor = false;
  let bekleZaman = 0;
  let planli = false;
  /** Yığının tepesi, ilk ekranın kopyası olan koruma kaydı mı */
  let koruma = false;
  /** Kendi history.back() çağrımızın popstate'i yutulacak */
  let yut = false;

  korumaEkle = () => {
    if (i !== 0 || koruma) return;
    yigin = [yigin[0], yigin[0]];
    i = 1;
    koruma = true;
    yaz(true);
  };
  korumaKaldir = () => {
    if (!koruma || i !== 1) return;
    koruma = false;
    yigin = [yigin[0]];
    i = 0;
    yut = true;
    // popstate gelmezse (geçmiş başka biçimde değişti) sonraki gerçek geri yutulmasın
    window.setTimeout(() => (yut = false), 800);
    try {
      history.back();
    } catch {
      yut = false;
    }
  };

  const yaz = (yeni: boolean) => {
    const kayit = { ac: i, oturum, ekran: yigin[i] };
    try {
      if (yeni) history.pushState(kayit, '');
      else history.replaceState(kayit, '');
    } catch {
      /* bazı gömülü tarayıcılarda geçmiş kısıtlı olabilir */
    }
  };
  yaz(false);

  const esitle = () => {
    planli = false;
    if (geriBekleniyor) return;
    const simdi = ekranOf(getState());
    if (ayniEkran(simdi, yigin[i])) return;
    if (i > 0 && ayniEkran(simdi, yigin[i - 1])) {
      // Uygulama içi "geri" düğmesi: geçmişte de bir adım geri
      i--;
      geriBekleniyor = true;
      clearTimeout(bekleZaman);
      bekleZaman = window.setTimeout(() => {
        // popstate gelmediyse (geçmiş başka biçimde değişti) takılı kalma
        if (!geriBekleniyor) return;
        geriBekleniyor = false;
        esitle();
      }, 800);
      history.back();
      return;
    }
    if (koruma && i === 1) {
      // Koruma kaydı yeni ekranın kaydı olur (aynı ekranın iki kaydı kalmasın)
      koruma = false;
      yigin = [yigin[0], simdi];
      yaz(false);
      return;
    }
    yigin = yigin.slice(0, i + 1);
    yigin.push(simdi);
    i++;
    yaz(true);
  };

  // Aynı olay içindeki ardışık setState çağrıları tek kayıt olsun
  subscribe(() => {
    if (planli) return;
    planli = true;
    queueMicrotask(esitle);
  });

  window.addEventListener('popstate', (e) => {
    const st = e.state as { ac?: unknown; oturum?: unknown; ekran?: unknown } | null;
    const bekleniyordu = geriBekleniyor;
    geriBekleniyor = false;
    clearTimeout(bekleZaman);
    if (yut) {
      // Koruma kaydını kaldırmak için yapılan geri: ekran zaten doğru
      yut = false;
      return;
    }
    // Açık bir katman varken geri: ekran yerinde kalır, en üstteki katman kapanır
    if (!bekleniyordu && katmanlar.length) {
      const ust = katmanlar.pop()!;
      try {
        ust.kapat();
      } catch {
        /* kapatma hatası gezinmeyi bozmasın */
      }
      if (koruma && !katmanlar.length) {
        // Koruma kaydı tüketildi: ilk ekrana dönüldü
        koruma = false;
        yigin = [yigin[0]];
        i = 0;
        return;
      }
      yaz(true);
      return;
    }
    const ekran = gecerliEkran(st?.ekran);
    if (!ekran) {
      // Bu uygulamanın kaydı değil (ör. adres çubuğunda #bağlantı): bulunduğu yer kalır
      yigin = [ekranOf(getState())];
      i = 0;
      yaz(false);
      return;
    }
    if (st?.oturum === oturum && typeof st.ac === 'number' && st.ac >= 0 && st.ac < yigin.length) {
      i = st.ac;
      yigin[i] = ekran;
    } else {
      // Önceki bir sayfa yüklemesinden kalan kayıt: oradan yeni bir yığın başlar
      yigin = [ekran];
      i = 0;
      yaz(false);
    }
    // Uygulama içi geri bekleniyordu: ekran zaten doğru; bu arada başka bir yere gidildiyse
    // (geri tamamlanmadan sekmeye dokunuldu) o gezinme geri alınmaz, yeni kayıt olarak eklenir.
    if (bekleniyordu) esitle();
    else if (!ayniEkran(ekranOf(getState()), ekran)) setState(ekran);
  });
}
