// Uygulama güncellemesi kartı: üst bant (yeni sürüm varsa) ve Ayarlar'daki bölüm.
// Kurulum yalnız "Kur" düğmesiyle başlar.
import { useState } from 'preact/hooks';
import { HATA_YAZI, guncelleme, mb, type GuncellemeDurum } from './lib/guncelleme';

const CSS = `
.gn { display: flex; flex-direction: column; gap: 8px; border-color: var(--accent); }
.gn-h { display: flex; align-items: center; gap: 8px; font-size: 15px; }
.gn p { margin: 0; font-size: 13px; color: var(--text2); line-height: 1.45; }
.gn p.bad { color: var(--danger); }
.gn-bar { height: 8px; border-radius: 4px; background: var(--line2); overflow: hidden; }
.gn-bar > div { height: 100%; background: var(--accent); transition: width 0.4s; }
.gn-btns { display: flex; gap: 8px; flex-wrap: wrap; }
.gn-btns .btn { flex: 1 1 120px; }
`;

const ERTELE_KEY = 'ac.guncelleme.ertele';

function ertelendi(surum: string): boolean {
  try {
    const o = JSON.parse(localStorage.getItem(ERTELE_KEY) || 'null');
    return !!o && o.surum === surum && Date.now() - o.t < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

/** bant: üstteki kısa sürüm ("Sonra" ile 24 saat gizlenir); değilse Ayarlar'daki tam sürüm */
export function GuncellemeKarti({ d, bant = false }: { d: GuncellemeDurum; bant?: boolean }) {
  const [msg, setMsg] = useState<{ t: string; bad?: boolean } | null>(null);
  const [gizlendi, setGizli] = useState(false);
  // Çift dokunuşta iki kurulum oturumu açılmasın (durum "kuruluyor"a geçene kadar)
  const [basildi, setBasildi] = useState(false);
  // "Kur"dan sonra bir şey olmazsa (onay penceresi açılmadı) yedek yol görünür
  const [yedek, setYedek] = useState(false);
  const y = d.yeni;
  // Sürüm bilgisi sonradan gelebilir: erteleme her çizimde denetlenir
  if (!y || (bant && (gizlendi || ertelendi(y.surum)))) return null;
  const iniyor = d.is === 'indiriliyor';

  const kur = async () => {
    if (basildi) return;
    setMsg(null);
    if (!d.kurulumIzni) {
      await guncelleme.kurulumIzni();
      setMsg({ t: 'Açılan sayfada "Bu kaynaktan izin ver"i açıp geri dönün, sonra yeniden "Kur"a basın. Bu yalnız bir kez sorulur.' });
      return;
    }
    setBasildi(true);
    try {
      const r = await guncelleme.kur();
      if (r?.hata) {
        setMsg({ t: HATA_YAZI[r.hata] ?? 'Kurulamadı.', bad: true });
        if (r.hata !== 'enkaz-acik' && r.hata !== 'hazir-degil') setYedek(true);
      } else {
        setMsg({ t: 'Kuruluyor… Bir onay ekranı çıkarsa "Güncelle"ye basın. Uygulama kapanıp yeni sürümle açılır.' });
        // Birkaç saniye içinde ne onay ekranı ne de kapanma olduysa yedek yolu göster
        setTimeout(() => setYedek(true), 8000);
      }
    } finally {
      setBasildi(false);
    }
  };

  const kurSistem = async () => {
    setMsg(null);
    const r = await guncelleme.kurSistem();
    if (r?.hata) setMsg({ t: HATA_YAZI[r.hata] ?? 'Kurulamadı.', bad: true });
    else setMsg({ t: 'Android\'in yükleme ekranında "Güncelle"ye basın.' });
  };

  return (
    <section class="card gn" data-testid={bant ? 'gn-bant' : 'gn-kart'} role="status">
      <style>{CSS}</style>
      <div class="gn-h">
        <b class="grow">{y.hazir ? `Akıl Çantası ${y.surum} kurulmaya hazır` : `Yeni sürüm: ${y.surum}`}</b>
        <span class="muted mono" style="font-size:12px">şu an {d.kurulu}</span>
      </div>
      {iniyor ? (
        <>
          <p>
            İndiriliyor… {mb(d.alinan)} / {mb(d.toplam || y.boyut)}
          </p>
          <div class="gn-bar">
            <div style={{ width: `${Math.round((100 * d.alinan) / (d.toplam || y.boyut || 1))}%` }} />
          </div>
        </>
      ) : y.hazir ? (
        <p>{d.enkazAcik ? 'Enkaz modu açıkken kurulmaz; kapattıktan sonra kurabilirsiniz.' : 'İndirildi ve doğrulandı. Kurulum yalnız siz "Kur"a basınca başlar; birkaç saniye sürer, verileriniz ve paketleriniz yerinde kalır.'}</p>
      ) : (
        <p>
          {mb(y.boyut)}. {d.olculuAg ? 'Mobil veride olduğunuz için kendiliğinden indirilmedi.' : 'İndirip doğruladıktan sonra "Kur" düğmesi çıkar.'}
        </p>
      )}
      {d.hata && !msg && <p class="bad">{HATA_YAZI[d.hata] ?? d.hata}</p>}
      {y.hazir && d.samsung && (yedek || d.hata) && (
        <p data-testid="gn-samsung">
          Samsung telefonlarda <b>Otomatik Engelleyici</b> açıksa kurulum sessizce engellenir. Ayarlar → Güvenlik ve gizlilik →
          Otomatik Engelleyici'yi kurulum için kapatın, "Kur"a yeniden basın, sonra isterseniz yeniden açın.
        </p>
      )}
      {msg && <p class={msg.bad ? 'bad' : ''}>{msg.t}</p>}
      <div class="gn-btns">
        {y.hazir ? (
          <>
            <button class="btn primary" data-testid="gn-kur" disabled={d.enkazAcik || (d.is === 'kuruluyor' && !yedek) || basildi} onClick={kur}>
              {(d.is === 'kuruluyor' && !yedek) || basildi ? 'Kuruluyor…' : 'Kur'}
            </button>
            {(yedek || d.hata === 'onay-acilamadi' || d.hata === 'kurulamadi') && !d.enkazAcik && (
              <button class="btn" data-testid="gn-kur-sistem" onClick={kurSistem}>
                Sistem yükleyicisiyle kur
              </button>
            )}
          </>
        ) : (
          !iniyor && (
            <button class="btn primary" data-testid="gn-indir" onClick={() => guncelleme.indir()}>
              İndir ({mb(y.boyut)})
            </button>
          )
        )}
        {bant && (
          <button
            class="btn"
            data-testid="gn-sonra"
            onClick={() => {
              try {
                localStorage.setItem(ERTELE_KEY, JSON.stringify({ surum: y.surum, t: Date.now() }));
              } catch {}
              setGizli(true);
            }}
          >
            Sonra
          </button>
        )}
      </div>
    </section>
  );
}
