// "Afete hazır mıyım?" çocuk bilgi yarışması.
// Doğru cevaplar AFAD'ın kamuya açık afet bilinci eğitimlerindeki temel öğütlerle uyumludur:
// Çök-Kapan-Tutun, asansör kullanmamak, enkazda düdük/vurarak ses vermek, 112 Acil Çağrı,
// toplanma alanı, aile afet planı; yangında "dur-yat-yuvarlan" ve dumanda eğilerek ilerlemek
// (itfaiye eğitimleri), gaz kokusunda elektrik düğmelerine dokunmamak, sel suyundan uzak durmak.

export interface QuizQ {
  id: string;
  q: string;
  /** kısa resim kimliği (pictures.ts) — isteğe bağlı */
  pic?: string;
  options: string[];
  answer: number;
  /** cevaptan sonra gösterilen kısa, cesaretlendirici açıklama */
  why: string;
}

export const QUIZ: QuizQ[] = [
  {
    id: 'q1',
    q: 'Yer sallanmaya başladı. Ne yaparız?',
    options: ['Çök, kapan, tutun', 'Koşarak merdivene gideriz', 'Pencereye bakarız'],
    answer: 0,
    why: 'Yere çöker, başımızı ve ensemizi kollarımızla kapatır, sağlam bir şeye tutunuruz.',
  },
  {
    id: 'q2',
    q: 'Deprem olurken asansöre biner miyiz?',
    options: ['Evet, daha hızlı', 'Hayır, asla binmeyiz'],
    answer: 1,
    why: 'Asansör durabilir ve içinde kalabiliriz. Sallantı bitince merdivenden ineriz.',
  },
  {
    id: 'q3',
    q: 'Afet çantasına hangisini koyarız?',
    options: ['Su ve el feneri', 'Sadece oyuncak araba', 'Dondurma'],
    answer: 0,
    why: 'Su, el feneri, düdük ve atıştırmalık çok işe yarar. Bir sevdiğin küçük oyuncak da olabilir!',
  },
  {
    id: 'q4',
    q: 'Bir yerde sıkışıp kaldık. Bizi duymaları için ne yaparız?',
    options: ['Düdük çalarız ya da bir şeye vururuz', 'Hiç ses çıkarmayız', 'Hep bağırırız'],
    answer: 0,
    why: 'Düdük ve vurma sesi uzağa gider, hem de bizi yormaz. Ara ara ses verip dinleriz.',
  },
  {
    id: 'q5',
    q: 'Acil durumda hangi numarayı ararız?',
    options: ['112', '123', '999'],
    answer: 0,
    why: '112 Acil Çağrı Merkezi’dir. Ambulans, itfaiye ve polis için 112’yi ararız.',
  },
  {
    id: 'q6',
    q: 'Toplanma alanı ne demek?',
    options: ['Ailece buluştuğumuz güvenli açık yer', 'Oyun salonu', 'Alışveriş merkezi'],
    answer: 0,
    why: 'Afetten sonra ailemizle buluşacağımız, binalardan uzak, açık ve güvenli bir yerdir.',
  },
  {
    id: 'q7',
    q: 'Deprem olduğunda dışarıdayız. Nereye gideriz?',
    options: ['Binalardan ve direklerden uzak açık bir yere', 'Bir duvarın dibine', 'Bir ağacın altına'],
    answer: 0,
    why: 'Üstümüze bir şey düşmesin diye açık alanda çöker, kapanır ve sallantının bitmesini bekleriz.',
  },
  {
    id: 'q8',
    q: 'Bir odada duman var. Nasıl çıkarız?',
    options: ['Eğilerek, ağzımızı bir bezle kapatarak', 'Ayakta koşarak', 'Yatağın altına saklanarak'],
    answer: 0,
    why: 'Duman yukarıda toplanır. Yere yakın, eğilerek ya da emekleyerek ilerleriz.',
  },
  {
    id: 'q9',
    q: 'Giysimiz alev aldı! Ne yaparız?',
    options: ['Dur, yat, yuvarlan', 'Koşarız', 'El sallarız'],
    answer: 0,
    why: 'Koşmak ateşi büyütür. Durur, yere yatar, yüzümüzü kapatıp yuvarlanırız.',
  },
  {
    id: 'q10',
    q: 'Sokağı sel suyu bastı. Ne yaparız?',
    options: ['Sudan uzak durur, yükseğe çıkarız', 'Suda oynarız', 'Suyun içinden yürürüz'],
    answer: 0,
    why: 'Sel suyu çok hızlı akabilir ve kirli olabilir. Yüksek ve güvenli bir yerde bekleriz.',
  },
  {
    id: 'q11',
    q: 'Kalabalıkta ailemizi kaybettik. Ne yaparız?',
    options: ['Olduğumuz yerde kalır, bir görevliden yardım isteriz', 'Tek başımıza eve yürürüz', 'Saklanırız'],
    answer: 0,
    why: 'Polis, itfaiyeci ya da AFAD görevlisi gibi üniformalı birinden yardım isteriz. Ailemiz bizi bulur.',
  },
  {
    id: 'q12',
    q: 'Evde gaz kokusu var. Ne yaparız?',
    options: ['Işık düğmesine dokunmaz, büyüklere söyler, dışarı çıkarız', 'Işığı açıp bakarız', 'Mum yakarız'],
    answer: 0,
    why: 'Kıvılcım tehlikelidir. Hiçbir düğmeye dokunmadan bir büyüğe haber verir, dışarı çıkarız.',
  },
  {
    id: 'q13',
    q: 'Annemizin ya da babamızın telefon numarasını bilmek…',
    options: ['Çok önemlidir, ezberleriz', 'Gereksizdir'],
    answer: 0,
    why: 'Numarayı bilirsek bir görevli ailemizi hemen arayabilir. Birlikte ezberleyelim!',
  },
];

export const PRAISE = ['Harika!', 'Süpersin!', 'Aferin sana!', 'Bravo!', 'Çok doğru!'];
export const TRY_AGAIN = ['Neredeyse!', 'Güzel deneme!', 'Bir dahakine!'];

/** Sonuca göre cesaretlendirici kapanış mesajı. */
export function finalMessage(score: number, total: number): string {
  const r = total ? score / total : 0;
  if (r >= 0.9) return 'Afete çok hazırsın! Bildiklerini ailene de anlat.';
  if (r >= 0.6) return 'Çok iyi gidiyorsun! Birkaç şeyi birlikte tekrar edelim.';
  return 'Her yeni bilgi seni daha hazır yapar. Bir kez daha oynayalım mı?';
}
