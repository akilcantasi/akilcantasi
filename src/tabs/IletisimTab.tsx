// İletişim sekmesi: mobil şebeke yokken haberleşme.
//  • Bilgi noktası panosu (aynı Wi-Fi/erişim noktası): mesaj, iyiyim, kayıp, duyuru
//  • Şebekesiz araçlar: SOS ışık/ses/fener, Mors, hazır SMS
// Bölümler: go.comm(id) ya da ?comm=<id>
import { go, useAppState } from '../lib/store';
import { useBoard } from '../iletisim/client';
import { CSS, ConnCard } from '../iletisim/common';
import { Baglan, Duyurular, Iyiyim, Kayip, Pano } from '../iletisim/BoardSections';
import { Mors, Sms, Sos } from '../iletisim/OfflineTools';
import { QuickHelp, Yakinlar } from '../iletisim/HizliSms';

const SECTIONS = {
  pano: Pano,
  iyiyim: Iyiyim,
  kayip: Kayip,
  duyuru: Duyurular,
  sos: Sos,
  mors: Mors,
  sms: Sms,
  yakinlar: Yakinlar,
  baglan: Baglan,
} as const;

type SectionId = keyof typeof SECTIONS;

/** Kart simgeleri (24×24, çizgi) */
const ICONS: Record<SectionId, string> = {
  sos: '<path d="M7 18v-6a5 5 0 0 1 10 0v6"/><path d="M5 18h14v3H5z"/><path d="M12 2v2M4.2 5.2l1.4 1.4M19.8 5.2l-1.4 1.4"/>',
  sms: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M9.5 8h5M9.5 11.5h5M9.5 15h3"/>',
  pano: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
  iyiyim: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/><path d="M9.5 11l2 2 3.5-3.5"/>',
  kayip: '<circle cx="11" cy="9" r="3.5"/><path d="M4.5 20a6.5 6.5 0 0 1 9.6-5.7"/><circle cx="17.5" cy="17.5" r="2.5"/><path d="M19.4 19.4L21 21"/>',
  duyuru: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a7.5 7.5 0 0 1 0 11"/>',
  mors: '<circle cx="5" cy="12" r="1.6"/><path d="M9.5 12h4.5"/><circle cx="18.5" cy="12" r="1.6"/><path d="M4 6h16M4 18h16"/>',
  yakinlar: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18.5 20a6.5 6.5 0 0 0-3-5.5"/>',
  baglan: '<path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.2a9.5 9.5 0 0 1 13 0M8.6 15.4a5 5 0 0 1 6.8 0"/><circle cx="12" cy="18.6" r="1.2"/>',
};

function Ic({ id }: { id: SectionId }) {
  return (
    <span class="cm-ic" aria-hidden="true">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" dangerouslySetInnerHTML={{ __html: ICONS[id] }} />
    </span>
  );
}

function Home() {
  const s = useBoard();
  const count = (k: string) => s.items.filter((i) => i.kind === k && (k !== 'kayip' || i.status === 'araniyor')).length;
  const row = (id: SectionId, title: string, desc: string, n?: number, extra = '') => (
    <button class={'cm-card cm-row' + extra} data-testid={'comm-card-' + id} onClick={() => go.comm(id)}>
      <Ic id={id} />
      <span class="cm-row-text">
        <b>{title}</b>
        <span>{desc}</span>
      </span>
      {n ? (
        <span class="cm-count" aria-label={n + ' kayıt'}>
          {n > 99 ? '99+' : n}
        </span>
      ) : null}
      <span class="cm-chev" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </span>
    </button>
  );
  return (
    <div class="pad" data-testid="comm-home">
      <h2 class="cm-group">Hemen yardım</h2>
      <QuickHelp />
      <div class="cm-rows">{row('sos', 'SOS ışık ve ses', 'Yanıp sönen ekran, flaş, düdük ve siren', undefined, ' cm-sos-card')}</div>

      <h2 class="cm-group">Yakındakilerle haberleş</h2>
      <p class="cm-group-sub">Aynı bilgi noktasına (Wi-Fi) bağlı herkesle, internet olmadan.</p>
      <ConnCard s={s} />
      <div class="cm-rows">
        {row('iyiyim', 'İyiyim bildir', 'Durumunuzu herkese duyurun: iyiyim, yardım lazım, yaralıyım', count('iyiyim'))}
        {row('pano', 'Mesaj panosu', 'Bağlı herkesle yazışın', s.items.length)}
        {row('kayip', 'Kayıp kişi', 'İlan verin, bulunanı işaretleyin', count('kayip'))}
        {row('duyuru', 'Duyurular', 'Toplanma alanı, su ve sağlık noktaları', count('duyuru'))}
      </div>

      <h2 class="cm-group">Diğer araçlar</h2>
      <div class="cm-rows">
        {row('sms', 'Ayrıntılı SMS yaz', 'Adres, kişi sayısı ve not ekleyerek iyiyim / 112 / yardım mesajı')}
        {row('yakinlar', 'Yakınlarım', 'Hızlı SMS gidecek kişileri düzenleyin')}
        {row('mors', 'Mors çevirici', 'Yazıyı ışık ve sesle Mors olarak gönderin, Mors okuyun')}
        {row('baglan', 'Bilgi noktasına bağlan', 'Adım adım bağlantı ve yakın cihaz ağı')}
      </div>
    </div>
  );
}

export function IletisimTab() {
  const st = useAppState();
  const id = st.openComm as SectionId | null;
  const C = id && Object.prototype.hasOwnProperty.call(SECTIONS, id) ? SECTIONS[id] : null;
  return (
    <>
      <style>{CSS}</style>
      {C ? <C /> : <Home />}
    </>
  );
}
