// Depolama koruması: main.tsx'in İLK içe aktarımıdır, başka hiçbir modülden önce çalışır.
//
// Tarayıcı site verilerini engellediğinde (Chrome "tüm çerezleri engelle", bazı kiosk/
// gizlilik ayarları) `localStorage`'a erişmek bile SecurityError fırlatır. Pek çok modül
// açılışta ayarlarını okuduğu için uygulama hiç açılmıyor, boş ekran kalıyordu; kullanıcıyı
// uyaracak StorageWarning bile görünmüyordu. Bu durumda yerine bellekte tutulan bir depo
// konur: uygulama çalışır, kayıtlar yalnız sayfa açıkken yaşar ve StorageWarning
// "Tarayıcı veri saklamaya izin vermiyor" uyarısını gösterir.

/** Gerçek localStorage kullanılamadı, yerine bellek deposu kondu */
export let depoEngelli = false;

function bellekDepo(): Storage {
  const m = new Map<string, string>();
  const depo = {
    get length() {
      return m.size;
    },
    key: (i: number) => [...m.keys()][i] ?? null,
    getItem: (k: string) => (m.has(String(k)) ? m.get(String(k))! : null),
    setItem: (k: string, v: string) => void m.set(String(k), String(v)),
    removeItem: (k: string) => void m.delete(String(k)),
    clear: () => m.clear(),
  };
  return depo as Storage;
}

if (typeof window !== 'undefined') {
  for (const ad of ['localStorage', 'sessionStorage'] as const) {
    try {
      // Erişim (getter) ya da ilk okuma atarsa depo kullanılamıyor demektir
      void window[ad].length;
    } catch {
      if (ad === 'localStorage') depoEngelli = true;
      try {
        Object.defineProperty(window, ad, { value: bellekDepo(), configurable: true, writable: true });
      } catch {
        /* tanımlanamadı: modüllerin kendi try/catch'leri kalır */
      }
    }
  }
}
