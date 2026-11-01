// OTOMATİK ÜRETİLDİ (npm run pi:noktalar) — elle düzenlemeyin. Kaynak: tools/pi/_src/afet-noktalari.ts

// tools/pi/_src/afet-noktalari.ts
import { writeFileSync, renameSync, existsSync, readFileSync, unlinkSync } from "node:fs";

// node_modules/preact/dist/preact.mjs
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var a;
var s;
var h;
var p;
var v;
var y;
var d = {};
var w = [];
var _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var g = Array.isArray;
function m(n2, l3) {
  for (var u3 in l3) n2[u3] = l3[u3];
  return n2;
}
function b(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function x(n2, t3, i3, r3, o2) {
  var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o2 ? ++u : o2, __i: -1, __u: 0 };
  return null == o2 && null != l.vnode && l.vnode(e3), e3;
}
function S(n2) {
  return n2.children;
}
function C(n2, l3) {
  this.props = n2, this.context = l3;
}
function $(n2, l3) {
  if (null == l3) return n2.__ ? $(n2.__, n2.__i + 1) : null;
  for (var u3; l3 < n2.__k.length; l3++) if (null != (u3 = n2.__k[l3]) && null != u3.__e) return u3.__e;
  return "function" == typeof n2.type ? $(n2) : null;
}
function I(n2) {
  if (n2.__P && n2.__d) {
    var u3 = n2.__v, t3 = u3.__e, i3 = [], r3 = [], o2 = m({}, u3);
    o2.__v = u3.__v + 1, l.vnode && l.vnode(o2), q(n2.__P, o2, u3, n2.__n, n2.__P.namespaceURI, 32 & u3.__u ? [t3] : null, i3, null == t3 ? $(u3) : t3, !!(32 & u3.__u), r3), o2.__v = u3.__v, o2.__.__k[o2.__i] = o2, D(i3, o2, r3), u3.__e = u3.__ = null, o2.__e != t3 && P(o2);
  }
}
function P(n2) {
  if (null != (n2 = n2.__) && null != n2.__c) return n2.__e = n2.__c.base = null, n2.__k.some(function(l3) {
    if (null != l3 && null != l3.__e) return n2.__e = n2.__c.base = l3.__e;
  }), P(n2);
}
function A(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n2, l3 = 1; i.length; ) i.length > l3 && i.sort(e), n2 = i.shift(), l3 = i.length, I(n2);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n2, l3, u3, t3, i3, r3, o2, e3, f3, c3, a3) {
  var s2, h3, p3, v3, y2, _2, g2 = t3 && t3.__k || w, m3 = l3.length;
  for (f3 = T(u3, l3, g2, f3, m3), s2 = 0; s2 < m3; s2++) null != (p3 = u3.__k[s2]) && (h3 = -1 != p3.__i && g2[p3.__i] || d, p3.__i = s2, _2 = q(n2, p3, h3, i3, r3, o2, e3, f3, c3, a3), v3 = p3.__e, p3.ref && h3.ref != p3.ref && (h3.ref && J(h3.ref, null, p3), a3.push(p3.ref, p3.__c || v3, p3)), null == y2 && null != v3 && (y2 = v3), 4 & p3.__u ? (f3 = j(p3, f3, n2), h3.__e && (h3.__e = null)) : "function" == typeof p3.type && void 0 !== _2 ? f3 = _2 : v3 && (f3 = v3.nextSibling), p3.__u &= -7);
  return u3.__e = y2, f3;
}
function T(n2, l3, u3, t3, i3) {
  var r3, o2, e3, f3, c3, a3 = u3.length, s2 = a3, h3 = 0;
  for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o2 = l3[r3]) && "boolean" != typeof o2 && "function" != typeof o2 ? ("string" == typeof o2 || "number" == typeof o2 || "bigint" == typeof o2 || o2.constructor == String ? o2 = n2.__k[r3] = x(null, o2, null, null, null) : g(o2) ? o2 = n2.__k[r3] = x(S, { children: o2 }, null, null, null) : void 0 === o2.constructor && o2.__b > 0 ? o2 = n2.__k[r3] = x(o2.type, o2.props, o2.key, o2.ref ? o2.ref : null, o2.__v) : n2.__k[r3] = o2, f3 = r3 + h3, o2.__ = n2, o2.__b = n2.__b + 1, e3 = null, -1 != (c3 = o2.__i = O(o2, u3, f3, s2)) && (s2--, (e3 = u3[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > a3 ? h3-- : i3 < a3 && h3++), "function" != typeof o2.type && (o2.__u |= 4)) : c3 != f3 && (c3 == f3 - 1 ? h3-- : c3 == f3 + 1 ? h3++ : (c3 > f3 ? h3-- : h3++, o2.__u |= 4))) : n2.__k[r3] = null;
  if (s2) for (r3 = 0; r3 < a3; r3++) null != (e3 = u3[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = $(e3)), K(e3, e3));
  return t3;
}
function j(n2, l3, u3) {
  var t3, i3;
  if ("function" == typeof n2.type) {
    for (t3 = n2.__k, i3 = 0; t3 && i3 < t3.length; i3++) t3[i3] && (t3[i3].__ = n2, l3 = j(t3[i3], l3, u3));
    return l3;
  }
  n2.__e != l3 && (l3 && n2.type && !l3.parentNode && (l3 = $(n2)), l3 = u3.insertBefore(n2.__e, l3 || null));
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function O(n2, l3, u3, t3) {
  var i3, r3, o2, e3 = n2.key, f3 = n2.type, c3 = l3[u3], a3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == e3 || a3 && e3 == c3.key && f3 == c3.type) return u3;
  if (t3 > (a3 ? 1 : 0)) {
    for (i3 = u3 - 1, r3 = u3 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o2 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f3 == c3.type) return o2;
  }
  return -1;
}
function z(n2, l3, u3) {
  "-" == l3[0] ? n2.setProperty(l3, null == u3 ? "" : u3) : n2[l3] = null == u3 ? "" : "number" != typeof u3 || _.test(l3) ? u3 : u3 + "px";
}
function N(n2, l3, u3, t3, i3) {
  var r3, o2;
  n: if ("style" == l3) if ("string" == typeof u3) n2.style.cssText = u3;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u3 && l3 in u3 || z(n2.style, l3, "");
    if (u3) for (l3 in u3) t3 && u3[l3] == t3[l3] || z(n2.style, l3, u3[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(s, "$1")), o2 = l3.toLowerCase(), l3 = o2 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o2.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u3, u3 ? t3 ? u3[a] = t3[a] : (u3[a] = h, n2.addEventListener(l3, r3 ? v : p, r3)) : n2.removeEventListener(l3, r3 ? v : p, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u3 ? "" : u3;
      break n;
    } catch (n3) {
    }
    "function" == typeof u3 || (null == u3 || false === u3 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u3 ? "" : u3));
  }
}
function V(n2) {
  return function(u3) {
    if (this.l) {
      var t3 = this.l[u3.type + n2];
      if (null == u3[c]) u3[c] = h++;
      else if (u3[c] < t3[a]) return;
      return t3(l.event ? l.event(u3) : u3);
    }
  };
}
function q(n2, u3, t3, i3, r3, o2, e3, f3, c3, a3) {
  var s2, h3, p3, v3, y2, d3, _2, k2, x2, M, I2, P2, A2, H2, T2, j3, F = u3.type;
  if (void 0 !== u3.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o2 = [f3 = u3.__e = t3.__e]), (s2 = l.__b) && s2(u3);
  n: if ("function" == typeof F) {
    h3 = e3.length;
    try {
      if (x2 = u3.props, M = F.prototype && F.prototype.render, I2 = (s2 = F.contextType) && i3[s2.__c], P2 = s2 ? I2 ? I2.props.value : s2.__ : i3, t3.__c ? k2 = (p3 = u3.__c = t3.__c).__ = p3.__E : (M ? u3.__c = p3 = new F(x2, P2) : (u3.__c = p3 = new C(x2, P2), p3.constructor = F, p3.render = Q), I2 && I2.sub(p3), p3.state || (p3.state = {}), p3.__n = i3, v3 = p3.__d = true, p3.__h = [], p3._sb = []), M && null == p3.__s && (p3.__s = p3.state), M && null != F.getDerivedStateFromProps && (p3.__s == p3.state && (p3.__s = m({}, p3.__s)), m(p3.__s, F.getDerivedStateFromProps(x2, p3.__s))), y2 = p3.props, d3 = p3.state, p3.__v = u3, v3) M && null == F.getDerivedStateFromProps && null != p3.componentWillMount && p3.componentWillMount(), M && null != p3.componentDidMount && p3.__h.push(p3.componentDidMount);
      else {
        if (M && null == F.getDerivedStateFromProps && x2 !== y2 && null != p3.componentWillReceiveProps && p3.componentWillReceiveProps(x2, P2), u3.__v == t3.__v || !p3.__e && null != p3.shouldComponentUpdate && false === p3.shouldComponentUpdate(x2, p3.__s, P2)) {
          u3.__v != t3.__v && (p3.props = x2, p3.state = p3.__s, p3.__d = false), u3.__e = t3.__e, u3.__k = t3.__k, u3.__k.some(function(n3) {
            n3 && (n3.__ = u3);
          }), w.push.apply(p3.__h, p3._sb), p3._sb = [], p3.__h.length && e3.push(p3), f3 = $(t3);
          break n;
        }
        null != p3.componentWillUpdate && p3.componentWillUpdate(x2, p3.__s, P2), M && null != p3.componentDidUpdate && p3.__h.push(function() {
          p3.componentDidUpdate(y2, d3, _2);
        });
      }
      if (p3.context = P2, p3.props = x2, p3.__P = n2, p3.__e = false, A2 = l.__r, H2 = 0, M) p3.state = p3.__s, p3.__d = false, A2 && A2(u3), s2 = p3.render(p3.props, p3.state, p3.context), w.push.apply(p3.__h, p3._sb), p3._sb = [];
      else do {
        p3.__d = false, A2 && A2(u3), s2 = p3.render(p3.props, p3.state, p3.context), p3.state = p3.__s;
      } while (p3.__d && ++H2 < 25);
      p3.state = p3.__s, null != p3.getChildContext && (i3 = m(m({}, i3), p3.getChildContext())), M && !v3 && null != p3.getSnapshotBeforeUpdate && (_2 = p3.getSnapshotBeforeUpdate(y2, d3)), T2 = null != s2 && s2.type === S && null == s2.key ? E(s2.props.children) : s2, f3 = L(n2, g(T2) ? T2 : [T2], u3, t3, i3, r3, o2, e3, f3, c3, a3), p3.base = u3.__e, u3.__u &= -161, p3.__h.length && e3.push(p3), k2 && (p3.__E = p3.__ = null);
    } catch (n3) {
      if (e3.length = h3, u3.__v = null, c3 || null != o2) {
        if (n3.then) {
          for (u3.__u |= c3 ? 160 : 128; f3 && 8 == f3.nodeType && f3.nextSibling; ) f3 = f3.nextSibling;
          null != o2 && (o2[o2.indexOf(f3)] = null), u3.__e = f3;
        } else if (null != o2) for (j3 = o2.length; j3--; ) b(o2[j3]);
      } else u3.__e = t3.__e;
      null == u3.__k && (u3.__k = t3.__k || []), n3.then || B(u3), l.__e(n3, u3, t3);
    }
  } else null == o2 && u3.__v == t3.__v ? (u3.__k = t3.__k, u3.__e = t3.__e) : f3 = u3.__e = G(t3.__e, u3, t3, i3, r3, o2, e3, c3, a3);
  return (s2 = l.diffed) && s2(u3), 128 & u3.__u ? void 0 : f3;
}
function B(n2) {
  n2 && (n2.__c && (n2.__c.__e = true), n2.__k && n2.__k.some(B));
}
function D(n2, u3, t3) {
  for (var i3 = 0; i3 < t3.length; i3++) J(t3[i3], t3[++i3], t3[++i3]);
  l.__c && l.__c(u3, n2), n2.some(function(u4) {
    try {
      n2 = u4.__h, u4.__h = [], n2.some(function(n3) {
        n3.call(u4);
      });
    } catch (n3) {
      l.__e(n3, u4.__v);
    }
  });
}
function E(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b > 0 ? n2 : g(n2) ? n2.map(E) : void 0 !== n2.constructor ? null : m({}, n2);
}
function G(u3, t3, i3, r3, o2, e3, f3, c3, a3) {
  var s2, h3, p3, v3, y2, w3, _2, m3 = i3.props || d, k2 = t3.props, x2 = t3.type;
  if ("svg" == x2 ? o2 = "http://www.w3.org/2000/svg" : "math" == x2 ? o2 = "http://www.w3.org/1998/Math/MathML" : o2 || (o2 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (s2 = 0; s2 < e3.length; s2++) if ((y2 = e3[s2]) && "setAttribute" in y2 == !!x2 && (x2 ? y2.localName == x2 : 3 == y2.nodeType)) {
      u3 = y2, e3[s2] = null;
      break;
    }
  }
  if (null == u3) {
    if (null == x2) return document.createTextNode(k2);
    u3 = document.createElementNS(o2, x2, k2.is && k2), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x2) m3 === k2 || c3 && u3.data == k2 || (u3.data = k2);
  else {
    if (e3 = "textarea" == x2 && null != k2.defaultValue ? null : e3 && n.call(u3.childNodes), !c3 && null != e3) for (m3 = {}, s2 = 0; s2 < u3.attributes.length; s2++) m3[(y2 = u3.attributes[s2]).name] = y2.value;
    for (s2 in m3) y2 = m3[s2], "dangerouslySetInnerHTML" == s2 ? p3 = y2 : "children" == s2 || s2 in k2 || "value" == s2 && "defaultValue" in k2 || "checked" == s2 && "defaultChecked" in k2 || N(u3, s2, null, y2, o2);
    for (s2 in k2) y2 = k2[s2], "children" == s2 ? v3 = y2 : "dangerouslySetInnerHTML" == s2 ? h3 = y2 : "value" == s2 ? w3 = y2 : "checked" == s2 ? _2 = y2 : c3 && "function" != typeof y2 || m3[s2] === y2 || N(u3, s2, y2, m3[s2], o2);
    if (h3) c3 || p3 && (h3.__html == p3.__html || h3.__html == u3.innerHTML) || (u3.innerHTML = h3.__html), t3.__k = [];
    else if (p3 && (u3.innerHTML = ""), L("template" == t3.type ? u3.content : u3, g(v3) ? v3 : [v3], t3, i3, r3, "foreignObject" == x2 ? "http://www.w3.org/1999/xhtml" : o2, e3, f3, e3 ? e3[0] : i3.__k && $(i3, 0), c3, a3), null != e3) for (s2 = e3.length; s2--; ) b(e3[s2]);
    c3 && "textarea" != x2 || (s2 = "value", "progress" == x2 && null == w3 ? u3.removeAttribute("value") : null != w3 && (w3 !== u3[s2] || "progress" == x2 && !w3 || "option" == x2 && w3 != m3[s2]) && N(u3, s2, w3, m3[s2], o2), s2 = "checked", null != _2 && _2 != u3[s2] && N(u3, s2, _2, m3[s2], o2));
  }
  return u3;
}
function J(n2, u3, t3) {
  try {
    if ("function" == typeof n2) {
      var i3 = "function" == typeof n2.__u;
      i3 && n2.__u(), i3 && null == u3 || (n2.__u = n2(u3));
    } else n2.current = u3;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function K(n2, u3, t3) {
  var i3, r3;
  if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || J(i3, null, u3)), null != (i3 = n2.__c)) {
    if (i3.componentWillUnmount) try {
      i3.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u3);
    }
    i3.base = i3.__P = i3.__n = null;
  }
  if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && K(i3[r3], u3, t3 || "function" != typeof n2.type);
  t3 || b(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function Q(n2, l3, u3) {
  return this.constructor(n2, u3);
}
n = w.slice, l = { __e: function(n2, l3, u3, t3) {
  for (var i3, r3, o2; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
    if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o2 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o2 = i3.__d), o2) return i3.__E = i3;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && void 0 === n2.constructor;
}, C.prototype.setState = function(n2, l3) {
  var u3;
  u3 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n2 && (n2 = n2(m({}, u3), this.props)), n2 && m(u3, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), A(this));
}, C.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), A(this));
}, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;

// node_modules/preact/hooks/dist/hooks.mjs
var t2;
var r2;
var u2;
var i2;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var p2 = c2.__;
function j2() {
  for (var n2; n2 = f2.shift(); ) {
    var t3 = n2.__H;
    if (n2.__P && t3) try {
      t3.__h.some(z2), t3.__h.some(B2), t3.__h = [];
    } catch (r3) {
      t3.__h = [], c2.__e(r3, n2.__v);
    }
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), p2 && p2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.some(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i3.__h.some(z2), i3.__h.some(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.some(function(n3) {
    n3.u && (n3.__H = n3.u, n3.u = void 0);
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.some(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.some(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u3), k && cancelAnimationFrame(t3), setTimeout(n2);
  }, u3 = setTimeout(r3, 35);
  k && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u3 = n2.__c;
  "function" == typeof u3 && (n2.__c = void 0, u3()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}

// src/lib/store.ts
function loadBool(key, def) {
  try {
    const v3 = localStorage.getItem(key);
    return v3 === null ? def : v3 === "1";
  } catch {
    return def;
  }
}
var state = {
  tab: "fener",
  online: typeof navigator !== "undefined" ? navigator.onLine : false,
  batterySaver: typeof localStorage !== "undefined" ? loadBool("ac.batterySaver", false) : false,
  openGuideId: null,
  openCategoryId: null,
  openTool: null,
  openComm: null,
  openArticlePath: null,
  pendingQuestion: null,
  packsVersion: 0
};
var listeners = /* @__PURE__ */ new Set();
function setState(patch) {
  state = { ...state, ...patch };
  if ("batterySaver" in patch) {
    try {
      localStorage.setItem("ac.batterySaver", state.batterySaver ? "1" : "0");
    } catch {
    }
  }
  listeners.forEach((l3) => l3(state));
}
if (typeof window !== "undefined") {
  window.addEventListener("online", () => setState({ online: true }));
  window.addEventListener("offline", () => setState({ online: false }));
}

// src/lib/map/poi.ts
function inferPoiType(props) {
  const raw = props?.tags && typeof props.tags === "object" ? { ...props.tags, ...props } : props;
  const t3 = (k2) => typeof raw?.[k2] === "string" ? raw[k2] : void 0;
  const dw = t3("drinking_water");
  if (t3("emergency") === "assembly_point") return "toplanma";
  if (t3("amenity") === "pharmacy" || t3("healthcare") === "pharmacy") return "eczane";
  if (["hospital", "clinic", "doctors"].includes(t3("amenity") ?? "") || ["hospital", "clinic", "doctor"].includes(t3("healthcare") ?? "")) return "saglik";
  if (dw !== "no") {
    if (t3("amenity") === "drinking_water" || t3("amenity") === "water_point") return "su";
    if (t3("natural") === "spring" || t3("man_made") === "water_tap") return "su";
  }
  if (dw === "yes" && (t3("amenity") === "fountain" || t3("man_made") === "water_well")) return "su";
  if (t3("amenity") === "shelter" && t3("shelter_type") !== "public_transport" || t3("social_facility") === "shelter" || t3("emergency") === "shelter") return "barinma";
  return null;
}

// src/lib/map/poi-build.ts
var OVERPASS_MIRRORS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
];
var NODE_HEADERS = typeof window === "undefined" ? { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "AkilCantasi/0.1 (cevrimdisi afet uygulamasi)" } : { "Content-Type": "application/x-www-form-urlencoded" };
var POI_BUILD_TUNING = { retryPauseMs: 3e4, backoffMs: 1500 };
var REQUEST_TIMEOUT_MS = 15e4;
var TURKIYE_BBOX = [35.8, 25.6, 42.15, 44.85];
function tileBbox(b2, rows, cols) {
  const [s2, w3, n2, e3] = b2;
  const out2 = [];
  const dy = (n2 - s2) / rows;
  const dx = (e3 - w3) / cols;
  for (let r3 = 0; r3 < rows; r3++)
    for (let c3 = 0; c3 < cols; c3++) out2.push([+(s2 + r3 * dy).toFixed(4), +(w3 + c3 * dx).toFixed(4), +(s2 + (r3 + 1) * dy).toFixed(4), +(w3 + (c3 + 1) * dx).toFixed(4)]);
  return out2;
}
function overpassQuery(bb) {
  const b2 = bb.join(",");
  return `[out:json][timeout:180];
(
  nwr["emergency"="assembly_point"](${b2});
  nwr["emergency"="shelter"](${b2});
  nwr["amenity"~"^(hospital|clinic|doctors|pharmacy|drinking_water|water_point|shelter)$"](${b2});
  nwr["healthcare"~"^(hospital|clinic|doctor|pharmacy)$"](${b2});
  nwr["social_facility"="shelter"](${b2});
  nwr["natural"="spring"](${b2});
  nwr["man_made"="water_tap"](${b2});
  nwr["amenity"="fountain"]["drinking_water"="yes"](${b2});
  nwr["man_made"="water_well"]["drinking_water"="yes"](${b2});
);
out center tags qt;`;
}
function toFeatures(els, seen = /* @__PURE__ */ new Set()) {
  const out2 = [];
  for (const el of els) {
    const key = el.type[0] + el.id;
    if (seen.has(key)) continue;
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;
    const tags = el.tags ?? {};
    const type = inferPoiType(tags);
    if (!type) continue;
    seen.add(key);
    const props = { type };
    const name = tags["name:tr"] || tags.name;
    if (name) props.name = name;
    const note = [tags["addr:street"] && [tags["addr:street"], tags["addr:housenumber"]].filter(Boolean).join(" "), tags["addr:district"] || tags["addr:city"], tags.phone, tags.opening_hours].filter(Boolean).join(" \xB7 ");
    if (note) props.note = note;
    out2.push({ type: "Feature", id: key, geometry: { type: "Point", coordinates: [+lon.toFixed(6), +lat.toFixed(6)] }, properties: props });
  }
  return out2;
}
var sleep = (ms, signal) => new Promise((res, rej) => {
  const t3 = setTimeout(res, ms);
  signal?.addEventListener("abort", () => (clearTimeout(t3), rej(new DOMException("\u0130ptal", "AbortError"))), { once: true });
});
async function fetchTile(bb, signal, onRetry, startMirror = 0) {
  let lastErr = null;
  let allBusy = true;
  const attempts = OVERPASS_MIRRORS.length;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const url = OVERPASS_MIRRORS[(startMirror + attempt) % OVERPASS_MIRRORS.length];
    const host = new URL(url).host;
    const ctrl = new AbortController();
    const onAbort = () => ctrl.abort();
    signal?.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(() => ctrl.abort(), REQUEST_TIMEOUT_MS);
    try {
      const res = await fetch(url, {
        method: "POST",
        body: "data=" + encodeURIComponent(overpassQuery(bb)),
        headers: NODE_HEADERS,
        signal: ctrl.signal
      });
      if (res.status === 429 || res.status === 503 || res.status === 502) throw Object.assign(new Error("sunucu me\u015Fgul (" + res.status + ")"), { busy: true });
      if (res.status >= 500) throw new Error("sunucu me\u015Fgul (" + res.status + ")");
      if (!res.ok) throw new Error("sorgu reddedildi (" + res.status + ")");
      const j3 = await res.json();
      if (j3.remark && /runtime error|timed out|out of memory/i.test(j3.remark)) throw new Error("sunucu sorguyu bitiremedi");
      return j3.elements ?? [];
    } catch (e3) {
      if (signal?.aborted) throw new DOMException("\u0130ptal", "AbortError");
      lastErr = e3?.name === "AbortError" ? new Error("sunucu yan\u0131t vermedi") : e3;
      if (!lastErr?.busy) allBusy = false;
      onRetry(`${host}: ${lastErr.message || "ba\u011Flant\u0131 hatas\u0131"} \u2014 ba\u015Fka sunucu deneniyor`);
      await sleep(POI_BUILD_TUNING.backoffMs * (attempt + 1), signal);
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }
  const err = lastErr instanceof Error ? lastErr : new Error("ba\u011Flant\u0131 kurulamad\u0131");
  if (allBusy) err.busy = true;
  throw err;
}
async function buildPoiGeoJSON(onProgress, signal, checkpoint2) {
  const tiles = tileBbox(TURKIYE_BBOX, 4, 6);
  const seen = /* @__PURE__ */ new Set();
  const feats = [];
  const finished = /* @__PURE__ */ new Set();
  const prev = await checkpoint2?.load().catch(() => null);
  if (prev && Array.isArray(prev.done) && Array.isArray(prev.features)) {
    prev.done.forEach((i3) => finished.add(i3));
    for (const f3 of prev.features) {
      if (f3?.id && !seen.has(f3.id)) {
        seen.add(f3.id);
        feats.push(f3);
      }
    }
  }
  let saving = Promise.resolve();
  const persist = () => {
    if (!checkpoint2) return;
    const snap = { done: [...finished], features: feats.slice() };
    saving = saving.then(() => checkpoint2.save(snap)).catch(() => {
    });
  };
  onProgress({ done: finished.size, total: tiles.length, points: feats.length });
  let done = finished.size;
  const report = (note) => onProgress({ done, total: tiles.length, points: feats.length, note });
  const fetchArea = async (bb, lane, depth) => {
    try {
      return await fetchTile(bb, signal, (note) => report(note), lane);
    } catch (e3) {
      if (e3?.name === "AbortError" || e3?.busy || depth >= 2) throw e3;
      report("yo\u011Fun b\xF6lge, k\xFC\xE7\xFCk par\xE7alara b\xF6l\xFCn\xFCyor");
      const all = [];
      for (const sub of tileBbox(bb, 2, 2)) all.push(...await fetchArea(sub, lane, depth + 1));
      return all;
    }
  };
  const runQueue = async (queue, lanes) => {
    const failed2 = [];
    const lane = async (id) => {
      while (queue.length) {
        if (signal?.aborted) throw new DOMException("\u0130ptal", "AbortError");
        const i3 = queue.shift();
        try {
          const els = await fetchArea(tiles[i3], id, 0);
          feats.push(...toFeatures(els, seen));
        } catch (e3) {
          if (e3?.name === "AbortError") throw e3;
          failed2.push(i3);
          report(`b\xF6lge ${i3 + 1} al\u0131namad\u0131, sonra yeniden denenecek`);
          continue;
        }
        finished.add(i3);
        done++;
        report();
        persist();
      }
    };
    await Promise.all(Array.from({ length: lanes }, (_2, id) => lane(id)));
    return failed2;
  };
  let failed = await runQueue(tiles.map((_2, i3) => i3).filter((i3) => !finished.has(i3)), 2);
  for (let pass = 1; failed.length && pass <= 2; pass++) {
    const pause = POI_BUILD_TUNING.retryPauseMs * pass;
    report(`${failed.length} b\xF6lge i\xE7in sunucular\u0131n rahatlamas\u0131 bekleniyor (${Math.round(pause / 1e3)} sn)`);
    await sleep(pause, signal);
    failed = await runQueue(failed, 1);
  }
  await saving;
  if (failed.length) {
    throw new Error(`${failed.length} b\xF6lge al\u0131namad\u0131 (sunucular me\u015Fgul). "Devam" yaln\u0131zca eksik b\xF6lgeleri dener; ${feats.length} nokta sakland\u0131.`);
  }
  if (!feats.length) throw new Error("Hi\xE7 nokta bulunamad\u0131");
  const fc = {
    type: "FeatureCollection",
    generated: (/* @__PURE__ */ new Date()).toISOString(),
    source: "OpenStreetMap katk\u0131c\u0131lar\u0131 (ODbL 1.0), Overpass API",
    features: feats
  };
  return JSON.stringify(fc);
}

// tools/pi/_src/afet-noktalari.ts
var out = process.argv[2] || "turkiye-afet-noktalari.geojson";
var ara = out + ".ara";
var checkpoint = {
  load: async () => existsSync(ara) ? JSON.parse(readFileSync(ara, "utf8")) : null,
  save: async (c3) => writeFileSync(ara, JSON.stringify(c3))
};
var son = "";
var text = await buildPoiGeoJSON((p3) => {
  const t3 = `B\xF6lge ${p3.done}/${p3.total} \xB7 ${p3.points} nokta${p3.note ? " \xB7 " + p3.note : ""}`;
  if (t3 !== son) console.log(t3);
  son = t3;
}, void 0, checkpoint);
writeFileSync(out + ".part", text);
renameSync(out + ".part", out);
if (existsSync(ara)) unlinkSync(ara);
console.log(`OK ${out} (${(text.length / 1e6).toFixed(1)} MB)`);
