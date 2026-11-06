// Tarayıcı depolaması kullanılamıyorsa uygulamanın üstünde gösterilen uyarı.
import { useEffect, useState } from 'preact/hooks';
import { checkStorage, type StorageProblem } from './lib/storage-check';
import { depoEngelli } from './depolama-koruma';

const TEXT: Record<Exclude<StorageProblem, null>, { title: string; body: string }> = {
  captive: {
    title: 'Bu, Wi-Fi giriş penceresi',
    body: 'Bu pencere uygulamanın verilerini saklayamaz; kapanınca her şey silinir. Rehberleri buradan okuyabilirsiniz ama paket indirmek, liste tutmak ve Fener modelini kullanmak için tarayıcıyı (Safari ya da Chrome) açıp şu adrese gidin:',
  },
  private: {
    title: 'Gizli sekmedesiniz',
    body: 'Gizli sekmede uygulama paketleri kaydedemez ve sekme kapanınca listeleriniz silinir. Rehberler çalışır; paket indirmek, liste tutmak ve Fener modelini kullanmak için adresi normal (gizli olmayan) bir sekmede açın:',
  },
  blocked: {
    title: 'Tarayıcı veri saklamaya izin vermiyor',
    body: 'Site verileri engellenmiş. Rehberler çalışır ama listeleriniz ve ayarlarınız saklanmaz. Tarayıcı ayarlarında bu siteye izin verin ya da adresi başka bir tarayıcıda açın:',
  },
};

export function StorageWarning({ inert }: { inert?: boolean }) {
  const [problem, setProblem] = useState<StorageProblem>(null);
  const [closed, setClosed] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    // Gerçek localStorage engelliyse (depolama-koruma.ts bellek deposu koydu) denetim yanılır:
    // bellek deposu çalışır, OPFS de reddedilir ve "gizli sekme" sanılır. Doğru uyarı "engelli".
    void checkStorage()
      .then((c) => setProblem(depoEngelli && c.problem !== 'captive' ? 'blocked' : c.problem))
      .catch(() => setProblem(depoEngelli ? 'blocked' : null));
  }, []);
  if (!problem || closed) return null;
  const t = TEXT[problem];
  const addr = location.origin + location.pathname;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(addr);
      setCopied(true);
    } catch {
      // Pano yoksa adresi seçili göster
      const el = document.querySelector<HTMLElement>('[data-testid="storage-warning-addr"]');
      if (el) {
        const r = document.createRange();
        r.selectNodeContents(el);
        const sel = getSelection();
        sel?.removeAllRanges();
        sel?.addRange(r);
      }
    }
  };
  return (
    <div class="storage-warn" role="alert" data-testid="storage-warning" data-problem={problem} inert={inert}>
      <strong>{t.title}</strong>
      <p>{t.body}</p>
      <div class="storage-warn-row">
        <code data-testid="storage-warning-addr">{addr}</code>
        <button type="button" class="btn" data-testid="storage-warning-copy" onClick={copy}>
          {copied ? 'Kopyalandı' : 'Adresi kopyala'}
        </button>
        <button type="button" class="link-btn" data-testid="storage-warning-close" onClick={() => setClosed(true)}>
          Kapat
        </button>
      </div>
    </div>
  );
}
