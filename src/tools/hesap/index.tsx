// Su ve yiyecek hesabı: kişi sayısı, gün ve iklime göre temkinli ihtiyaç.
// Rakamlar ve kaynaklar src/tools/_kaynak/hesap.ts içinde.
import { useEffect, useState } from 'preact/hooks';
import { go } from '../../lib/store';
import { calculate, fmt, KCAL, sanitizeInput, SOURCES, WATER, type HesapInput } from '../_kaynak/hesap';
import { loadHousehold } from '../_kaynak/stok';
import { KEYS, saveJSON } from '../_kaynak/storage';
import { KAYNAK_CSS } from '../_kaynak/ui';

const FIELDS: { k: keyof Omit<HesapInput, 'days' | 'climate'>; title: string; hint: string }[] = [
  { k: 'adults', title: 'Yetişkin', hint: '18–64 yaş' },
  { k: 'children', title: 'Çocuk', hint: '1–17 yaş' },
  { k: 'babies', title: 'Bebek', hint: '0–1 yaş' },
  { k: 'elderly', title: 'Yaşlı', hint: '65 yaş ve üstü' },
  { k: 'pets', title: 'Evcil hayvan', hint: 'Kedi veya köpek' },
];

const DAY_PRESETS = [3, 7, 14];

function Stepper({ id, title, hint, value, max, onChange }: { id: string; title: string; hint: string; value: number; max: number; onChange: (v: number) => void }) {
  return (
    <div class="kn-stepper">
      <label class="lbl" for={'h-' + id}>
        <b>{title}</b>
        <small>{hint}</small>
      </label>
      <div class="ctl">
        <button type="button" aria-label={`${title} azalt`} data-testid={`hesap-${id}-dec`} disabled={value <= 0} onClick={() => onChange(Math.max(0, value - 1))}>−</button>
        <input
          id={'h-' + id}
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={value}
          data-testid={`hesap-${id}`}
          onInput={(e) => onChange(Number((e.target as HTMLInputElement).value) || 0)}
        />
        <button type="button" aria-label={`${title} artır`} data-testid={`hesap-${id}-inc`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>+</button>
      </div>
    </div>
  );
}

export default function Hesap() {
  const [inp, setInp] = useState<HesapInput>(() => loadHousehold().input);
  useEffect(() => {
    saveJSON(KEYS.hesap, inp);
  }, [inp]);
  const set = (p: Partial<HesapInput>) => setInp(sanitizeInput({ ...inp, ...p }));
  const r = calculate(inp);
  const hot = inp.climate === 'sicak';
  const drinkAdult = WATER.drinkAdult * (hot ? WATER.hotFactor : 1);

  return (
    <div class="kn" data-testid="hesap">
      <style>{KAYNAK_CSS}</style>
      <p class="kn-sub">Evde kalacak herkesi girin. Sonuçlar temkinlidir: ihtiyacın altında kalmamak için kaynakların üst değerlerine yakın seçilmiştir.</p>

      <div class="kn-form">
        {FIELDS.map((f) => (
          <Stepper key={f.k} id={f.k} title={f.title} hint={f.hint} value={inp[f.k]} max={100} onChange={(v) => set({ [f.k]: v })} />
        ))}
        <Stepper id="days" title="Gün" hint="AFAD: en az 72 saat (3 gün)" value={inp.days} max={365} onChange={(v) => set({ days: v })} />
        <div class="kn-seg" role="group" aria-label="Gün hazır seçimleri">
          {DAY_PRESETS.map((d) => (
            <button key={d} class="chip" aria-pressed={inp.days === d} data-testid={'hesap-days-' + d} onClick={() => set({ days: d })}>
              {d} gün
            </button>
          ))}
        </div>
        <div>
          <span class="label">İklim</span>
          <div class="kn-seg" role="group" aria-label="İklim" style="margin-top:6px">
            <button class="chip" aria-pressed={!hot} data-testid="hesap-climate-normal" onClick={() => set({ climate: 'normal' })}>Normal</button>
            <button class="chip" aria-pressed={hot} data-testid="hesap-climate-sicak" onClick={() => set({ climate: 'sicak' })}>Sıcak (yaz, 30 °C üstü)</button>
          </div>
        </div>
      </div>

      {r.warnings.map((w) => (
        <p key={w} class="warn kn-amber" data-testid="hesap-warning">{w}</p>
      ))}

      {r.people + inp.pets > 0 && (
        <>
          <section class="card" style="display:flex;flex-direction:column;gap:12px" data-testid="hesap-water">
            <h2 class="kn-h">Su — {inp.days} gün</h2>
            <div class="kn-stats">
              <div class="kn-stat">
                <span class="label">İçme suyu</span>
                <span class="kn-big" data-testid="hesap-drink-total">{fmt(r.drinkTotal)} L</span>
                <small>Günde {fmt(r.drinkPerDay)} L</small>
              </div>
              <div class="kn-stat">
                <span class="label">Toplam su</span>
                <span class="kn-big" data-testid="hesap-water-total">{fmt(r.total)} L</span>
                <small>Günde {fmt(r.totalPerDay)} L (içme + hijyen{inp.pets ? ' + hayvan' : ''})</small>
              </div>
            </div>
            <p class="kn-sub" data-testid="hesap-bottles">
              ≈ <b>{r.bottles15}</b> adet 1,5 L şişe veya <b>{r.damacana19}</b> damacana (19 L)
            </p>
            <ul class="kn-tips" style="font-size:13px;color:var(--text2)">
              <li>Yetişkin, çocuk ve yaşlı başına günde <b>{fmt(drinkAdult)} L içme</b>{hot ? ' (sıcakta ×1,5)' : ''}. Çocuklar ve hastalar daha fazla içer; azaltmayın.</li>
              <li>Kişi başı günde <b>{WATER.hygiene} L hijyen</b>: el yıkama, diş, temel temizlik. Bulaşık ve yıkama için ek su gerekir.</li>
              {inp.babies > 0 && <li>Bebek başına günde <b>{WATER.drinkBaby} L</b> mama hazırlama suyu (formül süt ~150 ml/kg/gün). Anne sütüyle besleniyorsa emziren anneye ek su ayırın.</li>}
              {inp.pets > 0 && <li>Kedi veya köpek başına günde <b>~{fmt(WATER.pet * (hot ? WATER.hotFactor : 1))} L</b> su.</li>}
              <li>Suyu kapalı, serin ve karanlık yerde saklayın; ambalaj suyunu son kullanma tarihinde, kendi doldurduğunuzu 6 ayda bir yenileyin.</li>
            </ul>
          </section>

          <section class="card" style="display:flex;flex-direction:column;gap:12px" data-testid="hesap-food">
            <h2 class="kn-h">Yiyecek — {inp.days} gün</h2>
            <div class="kn-stats">
              <div class="kn-stat">
                <span class="label">Enerji</span>
                <span class="kn-big" data-testid="hesap-kcal-total">{fmt(r.kcalTotal, 0)}</span>
                <small>kcal toplam · günde {fmt(r.kcalPerDay, 0)}</small>
              </div>
              <div class="kn-stat">
                <span class="label">Yaklaşık ağırlık</span>
                <span class="kn-big" data-testid="hesap-food-kg">{fmt(r.foodKgTotal)} kg</span>
                <small>Aşağıdaki karışımla</small>
              </div>
            </div>
            {r.kcalTotal > 0 ? (
              <table class="kn-table" data-testid="hesap-food-table">
                <tbody>
                  {r.food.map((f) => (
                    <tr key={f.id} data-testid={'hesap-food-' + f.id}>
                      <td>
                        {f.name}
                        <small>{f.note} · ~{f.kcal100} kcal/100 g</small>
                      </td>
                      <td class="num">{f.grams >= 1000 ? `${fmt(f.grams / 1000)} kg` : `${f.grams} g`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p class="kn-sub">Yalnız bebek veya evcil hayvan girdiniz; aşağıdaki notlara bakın.</p>
            )}
            <ul class="kn-tips" style="font-size:13px;color:var(--text2)">
              <li>Kişi başı günde <b>{fmt(KCAL.adult, 0)} kcal</b> (Sphere planlama değeri). Pişirme ve ek su gerektirmeyen, tanıdık gıdalar seçin.</li>
              <li>Ağırlıklar yaklaşıktır; etiketteki kaloriye bakın. Tuzlu ve çok baharatlı yiyecekler susatır.</li>
              {r.babyNote && <li data-testid="hesap-baby-note"><b>Bebek:</b> formül mama, biberon ve uygun ek gıda ayrıca; yetişkin gıdası yerine geçmez.</li>}
              {r.petFoodNote && <li data-testid="hesap-pet-note"><b>Evcil hayvan:</b> her gün için normal mama porsiyonu ayrıca.</li>}
              <li>Su kısılmaz; yiyecek gerekirse kısılabilir, ama çocuklar ve hamileler için kısmayın (FEMA).</li>
            </ul>
          </section>
        </>
      )}

      <div class="row" style="flex-wrap:wrap">
        <button class="btn" data-testid="hesap-to-stok" onClick={() => go.tool('stok')}>Stoğum kaç gün yeter?</button>
        <button class="btn" data-testid="hesap-to-canta" onClick={() => go.tool('canta')}>Afet çantası</button>
      </div>

      <div class="kn-src" data-testid="hesap-sources">
        <b>Kaynaklar</b>
        <ul>
          {SOURCES.map((s) => (
            <li key={s.id} data-testid={'hesap-src-' + s.id}>
              <b>{s.label}:</b> {s.note}.
            </li>
          ))}
        </ul>
        <span>Bu uygulamada: içme 3 L (Sphere üst sınırı), hijyen 2 L (Sphere alt sınırı), sıcakta içme ×1,5. Toplam 5 L/kişi/gün, Ready.gov'un 3,8 L'sinden fazladır. Hasta, hamile, emziren veya ağır iş yapanlar için daha fazla ayırın.</span>
      </div>
    </div>
  );
}
