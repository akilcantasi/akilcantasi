// ZIM makale HTML'i için izin listesi tabanlı temizleyici.
import type { ZimArchive } from './zim';

// İçeriğiyle birlikte atılan öğeler
const DROP = new Set(
  'script,iframe,frame,frameset,object,embed,applet,style,link,meta,base,form,input,button,select,textarea,noscript,template,audio,video,source,track,portal,svg,math,map,area,canvas,dialog,slot'.split(','),
);
// İzin verilen öğeler; listede olmayanlar kaldırılır ama içerikleri (metin) korunur
const ALLOW_TAGS = new Set(
  'a,abbr,b,bdi,bdo,blockquote,br,caption,cite,code,col,colgroup,dd,del,details,dfn,div,dl,dt,em,figcaption,figure,h1,h2,h3,h4,h5,h6,hr,i,img,ins,kbd,li,mark,ol,p,pre,q,rp,rt,ruby,s,samp,section,small,span,strong,sub,summary,sup,table,tbody,td,tfoot,th,thead,time,tr,u,ul,var,wbr,header,footer,article,aside,main,nav'.split(','),
);
const ALLOW_ATTRS = new Set('id,class,title,lang,dir,alt,colspan,rowspan,scope,headers,start,reversed,type,width,height,datetime,cite,open,href,src,data-src'.split(','));

/** Yalnızca #çapa, göreli yol ya da http(s) bağlantılarına izin verir (tarayıcının yok saydığı boşluk/kontrol karakterleri dahil denetlenir). */
function safeUrl(v: string): boolean {
  const clean = v.replace(/[\u0000-\u0020\u007f-\u009f]/g, '');
  const m = /^([a-z][a-z0-9+.-]*):/i.exec(clean);
  return !m || /^https?$/i.test(m[1]);
}

/**
 * ZIM'den gelen makale HTML'ini güvenli hâle getirir (izin listesi): betik,
 * SVG/MathML, olay işleyicileri ve http(s) dışı bağlantılar atılır; iç
 * bağlantılar data-zim-path ile işaretlenir; görseller src'siz bırakılıp
 * sonradan arşivden blob URL ile yüklenir.
 */
export function sanitize(html: string, lib: Pick<ZimArchive, 'resolveLink'>, path: string, title: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const body = doc.body;
  const walk = (parent: Element) => {
    for (const el of Array.from(parent.children)) {
      const tag = el.tagName.toLowerCase();
      if (DROP.has(tag) || el.namespaceURI !== 'http://www.w3.org/1999/xhtml') {
        el.remove();
        continue;
      }
      walk(el);
      if (!ALLOW_TAGS.has(tag)) {
        el.replaceWith(...Array.from(el.childNodes));
        continue;
      }
      for (const a of Array.from(el.attributes)) {
        const n = a.name.toLowerCase();
        if (!ALLOW_ATTRS.has(n)) el.removeAttribute(a.name);
        else if ((n === 'href' || n === 'src' || n === 'data-src' || n === 'cite') && !safeUrl(a.value)) {
          if (!(tag === 'img' && /^data:image\//i.test(a.value.trim()))) el.removeAttribute(a.name);
        }
      }
    }
  };
  walk(body);
  // Başlıkla aynı ilk h1 zaten üstte gösteriliyor
  body.querySelectorAll('h1').forEach((h) => {
    if (h.textContent?.trim() === title) h.remove();
  });
  body.querySelectorAll('a').forEach((a) => {
    const href = a.getAttribute('href');
    if (!href) return;
    if (href.startsWith('#')) {
      // Hedefi olmayan çapalar (mini ZIM'lerde kaynakça geri bağlantıları) tıklanabilir görünmesin
      let id = href.slice(1);
      try {
        id = decodeURIComponent(id);
      } catch {
        /* olduğu gibi */
      }
      if (!id || !doc.getElementById(id)) a.removeAttribute('href');
      return;
    }
    const target = lib.resolveLink(path, href);
    if (target) {
      a.setAttribute('data-zim-path', target);
      a.setAttribute('href', '#');
    } else if (/^(https?:)?\/\//i.test(href)) {
      a.setAttribute('data-ext', '');
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
    } else {
      a.removeAttribute('href');
    }
  });
  body.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src') ?? img.getAttribute('data-src') ?? '';
    img.removeAttribute('src');
    img.removeAttribute('data-src');
    img.setAttribute('hidden', '');
    const target = /^data:image\//i.test(src) ? null : lib.resolveLink(path, src);
    if (target) img.setAttribute('data-zim-src', target);
  });
  // Geniş tablolar yatay kaydırılsın
  body.querySelectorAll('table').forEach((t) => {
    const w = doc.createElement('div');
    w.className = 'kt-table';
    t.replaceWith(w);
    w.appendChild(t);
  });
  return body.innerHTML;
}
