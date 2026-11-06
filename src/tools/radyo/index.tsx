// Radyo rehberi: internet yokken afette nasıl haber alınır.
// Kaynaklar: TRT Radyo frekans sayfaları (radyo.trt.net.tr/frekanslar), AFAD eğitmeninin pilli radyo
// ve yedek pil önerisi (karar.com, "AFAD eğitmeni deprem çantasında pilli radyonun önemine dikkat çekti").
import { useState } from 'preact/hooks';
import { CITY_FREQS, FREQ_SOURCE, fmt } from './frekanslar';

const CSS = `
.rd-hero { background: linear-gradient(135deg, rgba(245,165,36,0.16), rgba(245,165,36,0.04)); border: 1px solid rgba(245,165,36,0.4); border-radius: 16px; padding: 14px; display: flex; flex-direction: column; gap: 8px; }
.rd-hero h2 { margin: 0; font-size: 18px; }
.rd-hero ol { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; font-size: 15px; line-height: 1.45; }
.rd-sec { background: var(--card); border: 1px solid var(--line2); border-radius: 14px; overflow: hidden; }
.rd-sec > button { width: 100%; min-height: 56px; display: flex; align-items: center; justify-content: space-between; gap: 10px; background: transparent; border: none; color: var(--text); font-size: 16px; font-weight: 600; padding: 10px 14px; text-align: left; }
.rd-sec > button span { color: var(--muted); font-size: 20px; }
.rd-body { padding: 0 14px 14px; font-size: 15px; line-height: 1.5; color: var(--text2); display: flex; flex-direction: column; gap: 8px; }
.rd-body ul { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 6px; }
.rd-body p { margin: 0; }
.rd-body b { color: var(--text); }
.rd-ann { border-left: 3px solid var(--accent); background: var(--bg2); border-radius: 8px; padding: 10px 12px; font-size: 14px; font-style: italic; color: var(--text); }
.rd-sel { height: 48px; width: 100%; background: var(--bg2); border: 1px solid var(--line3); border-radius: 12px; color: var(--text); padding: 0 12px; font-size: 16px; }
.rd-table { width: 100%; border-collapse: collapse; font-size: 15px; }
.rd-table td { padding: 9px 4px; border-bottom: 1px solid var(--line2); }
.rd-table td:last-child { text-align: right; font-family: var(--mono); font-weight: 600; color: var(--text); white-space: nowrap; }
.rd-table tr.hl td { color: var(--accent); }
.rd-table tr.hl td:last-child { color: var(--accent); }
.rd-src { font-size: 12px; color: var(--muted); line-height: 1.4; }
`;

function Sec({ id, title, open, onToggle, children }: { id: string; title: string; open: boolean; onToggle: () => void; children: any }) {
  return (
    <section class="rd-sec">
      <button aria-expanded={open} data-testid={'rd-sec-' + id} onClick={onToggle}>
        {title}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div class="rd-body" data-testid={'rd-body-' + id}>
          {children}
        </div>
      )}
    </section>
  );
}

function FreqTable() {
  const [city, setCity] = useState(() => {
    try {
      return localStorage.getItem('akil.radyo.city') || 'istanbul';
    } catch {
      return 'istanbul';
    }
  });
  const c = CITY_FREQS.find((x) => x.id === city) ?? CITY_FREQS[0];
  const rows: [string, number[] | undefined, boolean][] = [
    ['TRT Radyo 1', c.radyo1, true],
    ['TRT Radyo Haber', c.haber, true],
    ['TRT FM', c.trtfm, false],
    ['TRT Radyo 3', c.radyo3, false],
    ['TRT Türkü', c.turku, false],
    ['TRT Nağme', c.nagme, false],
    ['TRT Kurdî', c.kurdi, false],
  ];
  return (
    <>
      <label class="label" for="rd-city">
        İl
      </label>
      <select
        id="rd-city"
        class="rd-sel"
        value={city}
        data-testid="rd-city"
        onChange={(e) => {
          const v = (e.target as HTMLSelectElement).value;
          setCity(v);
          try {
            localStorage.setItem('akil.radyo.city', v);
          } catch {
            /* yok say */
          }
        }}
      >
        {CITY_FREQS.map((x) => (
          <option key={x.id} value={x.id}>
            {x.city}
          </option>
        ))}
      </select>
      <table class="rd-table" data-testid="rd-freq-table">
        <tbody>
          {rows
            .filter(([, f]) => f && f.length)
            .map(([n, f, hl]) => (
              <tr key={n} class={hl ? 'hl' : ''}>
                <td>{n}</td>
                <td data-testid={'rd-f-' + n.replace(/\s+/g, '-').toLowerCase()}>{fmt(f)} FM</td>
              </tr>
            ))}
        </tbody>
      </table>
      <p class="rd-src">
        {c.city} / {c.district} vericileri. İlçenizde frekans farklı olabilir; duyamazsanız tarama yapın. Listede olmayan iller için
        “Nasıl ayar yapılır” bölümüne bakın.
      </p>
      <p class="rd-src" data-testid="rd-source">
        Kaynak: {FREQ_SOURCE}.
      </p>
    </>
  );
}

export default function Radyo() {
  const [open, setOpen] = useState<string | null>('neden');
  const t = (id: string) => () => setOpen(open === id ? null : id);
  return (
    <div style="display:flex;flex-direction:column;gap:12px" data-testid="radyo">
      <style>{CSS}</style>
      <div class="rd-hero" data-testid="rd-hero">
        <h2>Şimdi ne yapmalı?</h2>
        <ol>
          <li>Pilli, kurmalı (dinamolu) ya da araç radyosunu açın, FM bandına geçin.</li>
          <li>
            Aşağıdaki tablodan ilinizdeki <b>TRT Radyo 1</b> veya <b>TRT Radyo Haber</b> frekansını bulun; yoksa tarama yapın.
          </li>
          <li>Saat başlarındaki haberleri dinleyin, duyuruları (yer, saat, ne yapılacak) not alın, sonra kapatıp pil saklayın.</li>
        </ol>
      </div>

      <Sec id="neden" title="Neden radyo?" open={open === 'neden'} onToggle={t('neden')}>
        <p>
          Büyük afetlerde elektrik, cep telefonu şebekesi ve internet kesilebilir ya da aşırı yoğunluktan çalışmaz. Radyo yayını
          ise uzaktaki vericilerden gelir ve alıcı çok az enerji harcar.
        </p>
        <ul>
          <li>
            AFAD eğitmenleri afet çantasında <b>pilli bir radyo ve yedek pil</b> bulundurmayı önerir: deprem sonrası dışarıda geçen
            süreçte güvenli haber almanın yolu budur.
          </li>
          <li>Kurmalı (dinamolu) ya da güneş panelli radyolar pil bitince de çalışır; bazıları telefon da şarj eder.</li>
          <li>Telefonunuzdaki FM radyo özelliği (varsa) internetsiz çalışır; çoğu model kulaklık kablosunu anten olarak kullanır.</li>
        </ul>
      </Sec>

      <Sec id="ne" title="Hangi yayını dinlemeli?" open={open === 'ne'} onToggle={t('ne')}>
        <ul>
          <li>
            <b>TRT Radyo 1</b> ve <b>TRT Radyo Haber</b>: kamu yayıncısının haber ve duyuru kanalları. Resmî açıklamaları ilk
            buralarda arayın.
          </li>
          <li>
            <b>TRT FM</b>: ülke genelinde geniş verici ağı; birçok yerde birden fazla frekansı var. Diğerleri çekmezse deneyin.
          </li>
          <li>
            <b>TRT bölge radyoları</b> (ör. TRT Çukurova, TRT Antalya, TRT Trabzon, TRT Erzurum, TRT GAP Diyarbakır) ve
            <b> yerel radyolar</b>: mahalle düzeyinde bilgi (dağıtım noktası, toplanma alanı) için faydalıdır.
          </li>
          <li>
            <b>TRT Kurdî</b> bazı illerde FM'den yayın yapar (tabloya bakın).
          </li>
        </ul>
      </Sec>

      <Sec id="duyuru" title="Resmî duyurular nasıl olur?" open={open === 'duyuru'} onToggle={t('duyuru')}>
        <p>
          Resmî duyurular <b>kimin yaptığını</b> açıkça söyler: AFAD Başkanlığı, Valilik, Kaymakamlık, belediye, Kızılay ya da
          sağlık müdürlüğü. Genellikle yer, saat ve yapılacak şey bellidir. Örnek biçim:
        </p>
        <div class="rd-ann">“… Valiliğinden duyurulur: … mahallesindeki vatandaşlarımızın … parkındaki toplanma alanına gitmeleri…”</div>
        <div class="rd-ann">“AFAD Başkanlığı açıklaması: … ilçesinde çadır ve gıda dağıtımı … noktasında yapılmaktadır.”</div>
        <p>Sık duyulan konular:</p>
        <ul>
          <li>toplanma alanları, çadır kent ve barınma yerleri;</li>
          <li>su, gıda, battaniye dağıtım noktaları ve saatleri;</li>
          <li>sahra hastanesi, sağlık noktası, eczane;</li>
          <li>“hasarlı binalara girmeyin”, “şebeke suyunu kaynatarak için” gibi güvenlik uyarıları;</li>
          <li>kayıp ve aranan kişiler için başvuru yerleri.</li>
        </ul>
        <p>
          <b>Söylentiye dikkat:</b> “Kim söyledi? Ne zaman? Nerede?” sorularına cevap yoksa güvenmeyin ve yaymayın. Aynı bilgiyi
          ikinci bir resmî yayında duymaya çalışın.
        </p>
        <p>Telefonunuz çalışıyorsa AFAD ve valilik kısa mesaj ya da “hayati uyarı” bildirimi de gönderebilir.</p>
      </Sec>

      <Sec id="ayar" title="Nasıl ayar yapılır?" open={open === 'ayar'} onToggle={t('ayar')}>
        <ul>
          <li>
            Bandı <b>FM</b>'e alın (87,5–108 MHz). FM yakındaki vericiler için en temiz sesi verir.
          </li>
          <li>
            Radyoda <b>SCAN / SEEK / TUNE</b> tuşu varsa basın: radyo bir sonraki güçlü istasyona kendisi durur. Her istasyonda
            birkaç saniye bekleyip ne yayınladığını dinleyin.
          </li>
          <li>Düğmeli (analog) radyoda düğmeyi çok yavaş çevirin; cızırtı azaldığı noktada durun.</li>
          <li>Bulduğunuz istasyonların frekansını kâğıda yazın; sonra hemen geri dönebilirsiniz.</li>
          <li>
            FM'de hiçbir şey yoksa <b>AM / MW</b> (orta dalga) bandını deneyin. Orta dalga yayınları geceleri çok daha uzaklardan
            alınabilir.
          </li>
          <li>Haberler genellikle saat başlarında verilir; pili korumak için radyoyu o saatlerde açın.</li>
        </ul>
      </Sec>

      <Sec id="anten" title="Anten ve çekim ipuçları" open={open === 'anten'} onToggle={t('anten')}>
        <ul>
          <li>Teleskopik anteni sonuna kadar çekin; dik ve yatay açılarla deneyin.</li>
          <li>Pencere kenarına, yüksek bir yere ya da açık alana çıkın. Betonarme bina, bodrum ve araç içi çekimi zayıflatır.</li>
          <li>
            AM/MW için anten radyonun içindedir ve yöne duyarlıdır: radyoyu yavaşça kendi etrafında çevirin, sesin en net olduğu
            yönde bırakın.
          </li>
          <li>Şarj aletleri, LED lambalar ve inverterler parazit yapar; radyoyu bunlardan uzak tutun.</li>
          <li>FM anteninin ucuna birkaç metre yalıtımlı tel bağlayıp yükseğe asmak zayıf istasyonları güçlendirebilir.</li>
          <li>Telefonun FM radyosu için kablolu kulaklığı takın ve kabloyu düz uzatın.</li>
        </ul>
      </Sec>

      <Sec id="arac" title="Araç radyosunu kullanmak" open={open === 'arac'} onToggle={t('arac')}>
        <ul>
          <li>Araç radyosu genellikle güçlü bir anten kullanır; evdeki küçük radyo çekmezse araçta deneyin.</li>
          <li>
            Kontağı yalnızca <b>aksesuar (ACC)</b> konumuna getirin. Motor kapalıyken uzun süre dinlemek aküyü bitirir ve araç
            çalışmayabilir. Kısa dinleyin, sesi kısık tutun, farları ve iç aydınlatmayı kapatın.
          </li>
          <li>
            Aküyü şarj etmek için motoru çalıştıracaksanız <b>yalnızca açık havada</b> çalıştırın. Kapalı garajda, çadır yanında
            ya da egzozu kar/enkazla tıkalıyken motor çalıştırmak <b>karbon monoksit zehirlenmesine</b> yol açar.
          </li>
          <li>Yakıtınızı tahliye ve ısınma için saklayın; radyo için motoru boşta uzun süre çalıştırmayın.</li>
        </ul>
      </Sec>

      <Sec id="pil" title="Pil ve enerji tasarrufu" open={open === 'pil'} onToggle={t('pil')}>
        <ul>
          <li>Radyoyu sürekli açık bırakmayın; haber saatlerinde açıp kapatın.</li>
          <li>Ses yüksekliği arttıkça pil daha hızlı biter; kulaklık daha az harcar.</li>
          <li>Yedek pilleri radyonun içinde değil, ayrı ve kuru bir poşette saklayın; uzun süre kullanılmayacaksa pilleri çıkarın.</li>
          <li>Kurmalı radyoyu, pil bitmeden düzenli olarak kurun.</li>
        </ul>
      </Sec>

      <Sec id="frekans" title="TRT frekansları (il merkezleri)" open={open === 'frekans'} onToggle={t('frekans')}>
        <FreqTable />
      </Sec>
    </div>
  );
}
