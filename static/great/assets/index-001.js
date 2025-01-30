let syncBog;
(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) r(s);
  new MutationObserver((s) => {
      for (const o of s) if (o.type === "childList") for (const i of o.addedNodes) i.tagName === "LINK" && i.rel === "modulepreload" && r(i);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(s) {
      const o = {};
      return (
          s.integrity && (o.integrity = s.integrity),
          s.referrerpolicy && (o.referrerPolicy = s.referrerpolicy),
          s.crossorigin === "use-credentials" ? (o.credentials = "include") : s.crossorigin === "anonymous" ? (o.credentials = "omit") : (o.credentials = "same-origin"),
          o
      );
  }
  function r(s) {
      if (s.ep) return;
      s.ep = !0;
      const o = n(s);
      fetch(s.href, o);
  }
})();
function qr(e, t) {
  const n = Object.create(null),
      r = e.split(",");
  for (let s = 0; s < r.length; s++) n[r[s]] = !0;
  return t ? (s) => !!n[s.toLowerCase()] : (s) => !!n[s];
}
function Ht(e) {
  if (H(e)) {
      const t = {};
      for (let n = 0; n < e.length; n++) {
          const r = e[n],
              s = me(r) ? bl(r) : Ht(r);
          if (s) for (const o in s) t[o] = s[o];
      }
      return t;
  } else {
      if (me(e)) return e;
      if (ce(e)) return e;
  }
}
const gl = /;(?![^(]*\))/g,
  _l = /:([^]+)/,
  yl = /\/\*.*?\*\//gs;
function bl(e) {
  const t = {};
  return (
      e
          .replace(yl, "")
          .split(gl)
          .forEach((n) => {
              if (n) {
                  const r = n.split(_l);
                  r.length > 1 && (t[r[0].trim()] = r[1].trim());
              }
          }),
      t
  );
}
function Tt(e) {
  let t = "";
  if (me(e)) t = e;
  else if (H(e))
      for (let n = 0; n < e.length; n++) {
          const r = Tt(e[n]);
          r && (t += r + " ");
      }
  else if (ce(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const wl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  Sl = qr(wl);
function No(e) {
  return !!e || e === "";
}
const Ie = (e) => (me(e) ? e : e == null ? "" : H(e) || (ce(e) && (e.toString === Do || !z(e.toString))) ? JSON.stringify(e, ko, 2) : String(e)),
  ko = (e, t) =>
      t && t.__v_isRef ? ko(e, t.value) : $t(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((n, [r, s]) => ((n[`${r} =>`] = s), n), {}) } : Io(t) ? { [`Set(${t.size})`]: [...t.values()] } : ce(t) && !H(t) && !Fo(t) ? String(t) : t,
  le = {},
  Lt = [],
  ze = () => {},
  El = () => !1,
  vl = /^on[^a-z]/,
  Wn = (e) => vl.test(e),
  Vr = (e) => e.startsWith("onUpdate:"),
  ve = Object.assign,
  Wr = (e, t) => {
      const n = e.indexOf(t);
      n > -1 && e.splice(n, 1);
  },
  xl = Object.prototype.hasOwnProperty,
  G = (e, t) => xl.call(e, t),
  H = Array.isArray,
  $t = (e) => Gn(e) === "[object Map]",
  Io = (e) => Gn(e) === "[object Set]",
  z = (e) => typeof e == "function",
  me = (e) => typeof e == "string",
  Gr = (e) => typeof e == "symbol",
  ce = (e) => e !== null && typeof e == "object",
  Mo = (e) => ce(e) && z(e.then) && z(e.catch),
  Do = Object.prototype.toString,
  Gn = (e) => Do.call(e),
  Rl = (e) => Gn(e).slice(8, -1),
  Fo = (e) => Gn(e) === "[object Object]",
  Jr = (e) => me(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  kn = qr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
  Jn = (e) => {
      const t = Object.create(null);
      return (n) => t[n] || (t[n] = e(n));
  },
  Pl = /-(\w)/g,
  et = Jn((e) => e.replace(Pl, (t, n) => (n ? n.toUpperCase() : ""))),
  Cl = /\B([A-Z])/g,
  Jt = Jn((e) => e.replace(Cl, "-$1").toLowerCase()),
  Qn = Jn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  ur = Jn((e) => (e ? `on${Qn(e)}` : "")),
  dn = (e, t) => !Object.is(e, t),
  fr = (e, t) => {
      for (let n = 0; n < e.length; n++) e[n](t);
  },
  Un = (e, t, n) => {
      Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n });
  },
  Bo = (e) => {
      const t = parseFloat(e);
      return isNaN(t) ? e : t;
  };
let Ps;
const Ol = () => Ps || (Ps = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
let Ne;
class Lo {
  constructor(t = !1) {
      (this.detached = t), (this.active = !0), (this.effects = []), (this.cleanups = []), (this.parent = Ne), !t && Ne && (this.index = (Ne.scopes || (Ne.scopes = [])).push(this) - 1);
  }
  run(t) {
      if (this.active) {
          const n = Ne;
          try {
              return (Ne = this), t();
          } finally {
              Ne = n;
          }
      }
  }
  on() {
      Ne = this;
  }
  off() {
      Ne = this.parent;
  }
  stop(t) {
      if (this.active) {
          let n, r;
          for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop();
          for (n = 0, r = this.cleanups.length; n < r; n++) this.cleanups[n]();
          if (this.scopes) for (n = 0, r = this.scopes.length; n < r; n++) this.scopes[n].stop(!0);
          if (!this.detached && this.parent && !t) {
              const s = this.parent.scopes.pop();
              s && s !== this && ((this.parent.scopes[this.index] = s), (s.index = this.index));
          }
          (this.parent = void 0), (this.active = !1);
      }
  }
}
function $o(e) {
  return new Lo(e);
}
function Al(e, t = Ne) {
  t && t.active && t.effects.push(e);
}
function Tl() {
  return Ne;
}
function Nl(e) {
  Ne && Ne.cleanups.push(e);
}
const Qr = (e) => {
      const t = new Set(e);
      return (t.w = 0), (t.n = 0), t;
  },
  jo = (e) => (e.w & bt) > 0,
  Uo = (e) => (e.n & bt) > 0,
  kl = ({ deps: e }) => {
      if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= bt;
  },
  Il = (e) => {
      const { deps: t } = e;
      if (t.length) {
          let n = 0;
          for (let r = 0; r < t.length; r++) {
              const s = t[r];
              jo(s) && !Uo(s) ? s.delete(e) : (t[n++] = s), (s.w &= ~bt), (s.n &= ~bt);
          }
          t.length = n;
      }
  },
  Er = new WeakMap();
let sn = 0,
  bt = 1;
const vr = 30;
let Ue;
const Ct = Symbol(""),
  xr = Symbol("");
class Yr {
  constructor(t, n = null, r) {
      (this.fn = t), (this.scheduler = n), (this.active = !0), (this.deps = []), (this.parent = void 0), Al(this, r);
  }
  run() {
      if (!this.active) return this.fn();
      let t = Ue,
          n = gt;
      for (; t; ) {
          if (t === this) return;
          t = t.parent;
      }
      try {
          return (this.parent = Ue), (Ue = this), (gt = !0), (bt = 1 << ++sn), sn <= vr ? kl(this) : Cs(this), this.fn();
      } finally {
          sn <= vr && Il(this), (bt = 1 << --sn), (Ue = this.parent), (gt = n), (this.parent = void 0), this.deferStop && this.stop();
      }
  }
  stop() {
      Ue === this ? (this.deferStop = !0) : this.active && (Cs(this), this.onStop && this.onStop(), (this.active = !1));
  }
}
function Cs(e) {
  const { deps: t } = e;
  if (t.length) {
      for (let n = 0; n < t.length; n++) t[n].delete(e);
      t.length = 0;
  }
}
let gt = !0;
const Ho = [];
function Qt() {
  Ho.push(gt), (gt = !1);
}
function Yt() {
  const e = Ho.pop();
  gt = e === void 0 ? !0 : e;
}
function Me(e, t, n) {
  if (gt && Ue) {
      let r = Er.get(e);
      r || Er.set(e, (r = new Map()));
      let s = r.get(n);
      s || r.set(n, (s = Qr())), zo(s);
  }
}
function zo(e, t) {
  let n = !1;
  sn <= vr ? Uo(e) || ((e.n |= bt), (n = !jo(e))) : (n = !e.has(Ue)), n && (e.add(Ue), Ue.deps.push(e));
}
function ot(e, t, n, r, s, o) {
  const i = Er.get(e);
  if (!i) return;
  let l = [];
  if (t === "clear") l = [...i.values()];
  else if (n === "length" && H(e)) {
      const c = Bo(r);
      i.forEach((a, u) => {
          (u === "length" || u >= c) && l.push(a);
      });
  } else
      switch ((n !== void 0 && l.push(i.get(n)), t)) {
          case "add":
              H(e) ? Jr(n) && l.push(i.get("length")) : (l.push(i.get(Ct)), $t(e) && l.push(i.get(xr)));
              break;
          case "delete":
              H(e) || (l.push(i.get(Ct)), $t(e) && l.push(i.get(xr)));
              break;
          case "set":
              $t(e) && l.push(i.get(Ct));
              break;
      }
  if (l.length === 1) l[0] && Rr(l[0]);
  else {
      const c = [];
      for (const a of l) a && c.push(...a);
      Rr(Qr(c));
  }
}
function Rr(e, t) {
  const n = H(e) ? e : [...e];
  for (const r of n) r.computed && Os(r);
  for (const r of n) r.computed || Os(r);
}
function Os(e, t) {
  (e !== Ue || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}
const Ml = qr("__proto__,__v_isRef,__isVue"),
  Ko = new Set(
      Object.getOwnPropertyNames(Symbol)
          .filter((e) => e !== "arguments" && e !== "caller")
          .map((e) => Symbol[e])
          .filter(Gr)
  ),
  Dl = Xr(),
  Fl = Xr(!1, !0),
  Bl = Xr(!0),
  As = Ll();
function Ll() {
  const e = {};
  return (
      ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
          e[t] = function (...n) {
              const r = Q(this);
              for (let o = 0, i = this.length; o < i; o++) Me(r, "get", o + "");
              const s = r[t](...n);
              return s === -1 || s === !1 ? r[t](...n.map(Q)) : s;
          };
      }),
      ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
          e[t] = function (...n) {
              Qt();
              const r = Q(this)[t].apply(this, n);
              return Yt(), r;
          };
      }),
      e
  );
}
function Xr(e = !1, t = !1) {
  return function (r, s, o) {
      if (s === "__v_isReactive") return !e;
      if (s === "__v_isReadonly") return e;
      if (s === "__v_isShallow") return t;
      if (s === "__v_raw" && o === (e ? (t ? ec : Jo) : t ? Go : Wo).get(r)) return r;
      const i = H(r);
      if (!e && i && G(As, s)) return Reflect.get(As, s, o);
      const l = Reflect.get(r, s, o);
      return (Gr(s) ? Ko.has(s) : Ml(s)) || (e || Me(r, "get", s), t) ? l : fe(l) ? (i && Jr(s) ? l : l.value) : ce(l) ? (e ? Qo(l) : Xt(l)) : l;
  };
}
const $l = qo(),
  jl = qo(!0);
function qo(e = !1) {
  return function (n, r, s, o) {
      let i = n[r];
      if (zt(i) && fe(i) && !fe(s)) return !1;
      if (!e && (!Hn(s) && !zt(s) && ((i = Q(i)), (s = Q(s))), !H(n) && fe(i) && !fe(s))) return (i.value = s), !0;
      const l = H(n) && Jr(r) ? Number(r) < n.length : G(n, r),
          c = Reflect.set(n, r, s, o);
      return n === Q(o) && (l ? dn(s, i) && ot(n, "set", r, s) : ot(n, "add", r, s)), c;
  };
}
function Ul(e, t) {
  const n = G(e, t);
  e[t];
  const r = Reflect.deleteProperty(e, t);
  return r && n && ot(e, "delete", t, void 0), r;
}
function Hl(e, t) {
  const n = Reflect.has(e, t);
  return (!Gr(t) || !Ko.has(t)) && Me(e, "has", t), n;
}
function zl(e) {
  return Me(e, "iterate", H(e) ? "length" : Ct), Reflect.ownKeys(e);
}
const Vo = { get: Dl, set: $l, deleteProperty: Ul, has: Hl, ownKeys: zl },
  Kl = {
      get: Bl,
      set(e, t) {
          return !0;
      },
      deleteProperty(e, t) {
          return !0;
      },
  },
  ql = ve({}, Vo, { get: Fl, set: jl }),
  Zr = (e) => e,
  Yn = (e) => Reflect.getPrototypeOf(e);
function Rn(e, t, n = !1, r = !1) {
  e = e.__v_raw;
  const s = Q(e),
      o = Q(t);
  n || (t !== o && Me(s, "get", t), Me(s, "get", o));
  const { has: i } = Yn(s),
      l = r ? Zr : n ? ns : hn;
  if (i.call(s, t)) return l(e.get(t));
  if (i.call(s, o)) return l(e.get(o));
  e !== s && e.get(t);
}
function Pn(e, t = !1) {
  const n = this.__v_raw,
      r = Q(n),
      s = Q(e);
  return t || (e !== s && Me(r, "has", e), Me(r, "has", s)), e === s ? n.has(e) : n.has(e) || n.has(s);
}
function Cn(e, t = !1) {
  return (e = e.__v_raw), !t && Me(Q(e), "iterate", Ct), Reflect.get(e, "size", e);
}
function Ts(e) {
  e = Q(e);
  const t = Q(this);
  return Yn(t).has.call(t, e) || (t.add(e), ot(t, "add", e, e)), this;
}
function Ns(e, t) {
  t = Q(t);
  const n = Q(this),
      { has: r, get: s } = Yn(n);
  let o = r.call(n, e);
  o || ((e = Q(e)), (o = r.call(n, e)));
  const i = s.call(n, e);
  return n.set(e, t), o ? dn(t, i) && ot(n, "set", e, t) : ot(n, "add", e, t), this;
}
function ks(e) {
  const t = Q(this),
      { has: n, get: r } = Yn(t);
  let s = n.call(t, e);
  s || ((e = Q(e)), (s = n.call(t, e))), r && r.call(t, e);
  const o = t.delete(e);
  return s && ot(t, "delete", e, void 0), o;
}
function Is() {
  const e = Q(this),
      t = e.size !== 0,
      n = e.clear();
  return t && ot(e, "clear", void 0, void 0), n;
}
function On(e, t) {
  return function (r, s) {
      const o = this,
          i = o.__v_raw,
          l = Q(i),
          c = t ? Zr : e ? ns : hn;
      return !e && Me(l, "iterate", Ct), i.forEach((a, u) => r.call(s, c(a), c(u), o));
  };
}
function An(e, t, n) {
  return function (...r) {
      const s = this.__v_raw,
          o = Q(s),
          i = $t(o),
          l = e === "entries" || (e === Symbol.iterator && i),
          c = e === "keys" && i,
          a = s[e](...r),
          u = n ? Zr : t ? ns : hn;
      return (
          !t && Me(o, "iterate", c ? xr : Ct),
          {
              next() {
                  const { value: h, done: p } = a.next();
                  return p ? { value: h, done: p } : { value: l ? [u(h[0]), u(h[1])] : u(h), done: p };
              },
              [Symbol.iterator]() {
                  return this;
              },
          }
      );
  };
}
function at(e) {
  return function (...t) {
      return e === "delete" ? !1 : this;
  };
}
function Vl() {
  const e = {
          get(o) {
              return Rn(this, o);
          },
          get size() {
              return Cn(this);
          },
          has: Pn,
          add: Ts,
          set: Ns,
          delete: ks,
          clear: Is,
          forEach: On(!1, !1),
      },
      t = {
          get(o) {
              return Rn(this, o, !1, !0);
          },
          get size() {
              return Cn(this);
          },
          has: Pn,
          add: Ts,
          set: Ns,
          delete: ks,
          clear: Is,
          forEach: On(!1, !0),
      },
      n = {
          get(o) {
              return Rn(this, o, !0);
          },
          get size() {
              return Cn(this, !0);
          },
          has(o) {
              return Pn.call(this, o, !0);
          },
          add: at("add"),
          set: at("set"),
          delete: at("delete"),
          clear: at("clear"),
          forEach: On(!0, !1),
      },
      r = {
          get(o) {
              return Rn(this, o, !0, !0);
          },
          get size() {
              return Cn(this, !0);
          },
          has(o) {
              return Pn.call(this, o, !0);
          },
          add: at("add"),
          set: at("set"),
          delete: at("delete"),
          clear: at("clear"),
          forEach: On(!0, !0),
      };
  return (
      ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
          (e[o] = An(o, !1, !1)), (n[o] = An(o, !0, !1)), (t[o] = An(o, !1, !0)), (r[o] = An(o, !0, !0));
      }),
      [e, n, t, r]
  );
}
const [Wl, Gl, Jl, Ql] = Vl();
function es(e, t) {
  const n = t ? (e ? Ql : Jl) : e ? Gl : Wl;
  return (r, s, o) => (s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? r : Reflect.get(G(n, s) && s in r ? n : r, s, o));
}
const Yl = { get: es(!1, !1) },
  Xl = { get: es(!1, !0) },
  Zl = { get: es(!0, !1) },
  Wo = new WeakMap(),
  Go = new WeakMap(),
  Jo = new WeakMap(),
  ec = new WeakMap();
function tc(e) {
  switch (e) {
      case "Object":
      case "Array":
          return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
          return 2;
      default:
          return 0;
  }
}
function nc(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : tc(Rl(e));
}
function Xt(e) {
  return zt(e) ? e : ts(e, !1, Vo, Yl, Wo);
}
function rc(e) {
  return ts(e, !1, ql, Xl, Go);
}
function Qo(e) {
  return ts(e, !0, Kl, Zl, Jo);
}
function ts(e, t, n, r, s) {
  if (!ce(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const o = s.get(e);
  if (o) return o;
  const i = nc(e);
  if (i === 0) return e;
  const l = new Proxy(e, i === 2 ? r : n);
  return s.set(e, l), l;
}
function _t(e) {
  return zt(e) ? _t(e.__v_raw) : !!(e && e.__v_isReactive);
}
function zt(e) {
  return !!(e && e.__v_isReadonly);
}
function Hn(e) {
  return !!(e && e.__v_isShallow);
}
function Yo(e) {
  return _t(e) || zt(e);
}
function Q(e) {
  const t = e && e.__v_raw;
  return t ? Q(t) : e;
}
function Kt(e) {
  return Un(e, "__v_skip", !0), e;
}
const hn = (e) => (ce(e) ? Xt(e) : e),
  ns = (e) => (ce(e) ? Qo(e) : e);
function Xo(e) {
  gt && Ue && ((e = Q(e)), zo(e.dep || (e.dep = Qr())));
}
function Zo(e, t) {
  (e = Q(e)), e.dep && Rr(e.dep);
}
function fe(e) {
  return !!(e && e.__v_isRef === !0);
}
function rs(e) {
  return ei(e, !1);
}
function sc(e) {
  return ei(e, !0);
}
function ei(e, t) {
  return fe(e) ? e : new oc(e, t);
}
class oc {
  constructor(t, n) {
      (this.__v_isShallow = n), (this.dep = void 0), (this.__v_isRef = !0), (this._rawValue = n ? t : Q(t)), (this._value = n ? t : hn(t));
  }
  get value() {
      return Xo(this), this._value;
  }
  set value(t) {
      const n = this.__v_isShallow || Hn(t) || zt(t);
      (t = n ? t : Q(t)), dn(t, this._rawValue) && ((this._rawValue = t), (this._value = n ? t : hn(t)), Zo(this));
  }
}
function jt(e) {
  return fe(e) ? e.value : e;
}
const ic = {
  get: (e, t, n) => jt(Reflect.get(e, t, n)),
  set: (e, t, n, r) => {
      const s = e[t];
      return fe(s) && !fe(n) ? ((s.value = n), !0) : Reflect.set(e, t, n, r);
  },
};
function ti(e) {
  return _t(e) ? e : new Proxy(e, ic);
}
function lc(e) {
  const t = H(e) ? new Array(e.length) : {};
  for (const n in e) t[n] = ac(e, n);
  return t;
}
class cc {
  constructor(t, n, r) {
      (this._object = t), (this._key = n), (this._defaultValue = r), (this.__v_isRef = !0);
  }
  get value() {
      const t = this._object[this._key];
      return t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
      this._object[this._key] = t;
  }
}
function ac(e, t, n) {
  const r = e[t];
  return fe(r) ? r : new cc(e, t, n);
}
var ni;
class uc {
  constructor(t, n, r, s) {
      (this._setter = n),
          (this.dep = void 0),
          (this.__v_isRef = !0),
          (this[ni] = !1),
          (this._dirty = !0),
          (this.effect = new Yr(t, () => {
              this._dirty || ((this._dirty = !0), Zo(this));
          })),
          (this.effect.computed = this),
          (this.effect.active = this._cacheable = !s),
          (this.__v_isReadonly = r);
  }
  get value() {
      const t = Q(this);
      return Xo(t), (t._dirty || !t._cacheable) && ((t._dirty = !1), (t._value = t.effect.run())), t._value;
  }
  set value(t) {
      this._setter(t);
  }
}
ni = "__v_isReadonly";
function fc(e, t, n = !1) {
  let r, s;
  const o = z(e);
  return o ? ((r = e), (s = ze)) : ((r = e.get), (s = e.set)), new uc(r, s, o || !s, n);
}
function yt(e, t, n, r) {
  let s;
  try {
      s = r ? e(...r) : e();
  } catch (o) {
      Xn(o, t, n);
  }
  return s;
}
function Be(e, t, n, r) {
  if (z(e)) {
      const o = yt(e, t, n, r);
      return (
          o &&
              Mo(o) &&
              o.catch((i) => {
                  Xn(i, t, n);
              }),
          o
      );
  }
  const s = [];
  for (let o = 0; o < e.length; o++) s.push(Be(e[o], t, n, r));
  return s;
}
function Xn(e, t, n, r = !0) {
  const s = t ? t.vnode : null;
  if (t) {
      let o = t.parent;
      const i = t.proxy,
          l = n;
      for (; o; ) {
          const a = o.ec;
          if (a) {
              for (let u = 0; u < a.length; u++) if (a[u](e, i, l) === !1) return;
          }
          o = o.parent;
      }
      const c = t.appContext.config.errorHandler;
      if (c) {
          yt(c, null, 10, [e, i, l]);
          return;
      }
  }
  dc(e, n, s, r);
}
function dc(e, t, n, r = !0) {
  console.error(e);
}
let pn = !1,
  Pr = !1;
const Se = [];
let Xe = 0;
const Ut = [];
let rt = null,
  xt = 0;
const ri = Promise.resolve();
let ss = null;
function os(e) {
  const t = ss || ri;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function hc(e) {
  let t = Xe + 1,
      n = Se.length;
  for (; t < n; ) {
      const r = (t + n) >>> 1;
      mn(Se[r]) < e ? (t = r + 1) : (n = r);
  }
  return t;
}
function is(e) {
  (!Se.length || !Se.includes(e, pn && e.allowRecurse ? Xe + 1 : Xe)) && (e.id == null ? Se.push(e) : Se.splice(hc(e.id), 0, e), si());
}
function si() {
  !pn && !Pr && ((Pr = !0), (ss = ri.then(ii)));
}
function pc(e) {
  const t = Se.indexOf(e);
  t > Xe && Se.splice(t, 1);
}
function mc(e) {
  H(e) ? Ut.push(...e) : (!rt || !rt.includes(e, e.allowRecurse ? xt + 1 : xt)) && Ut.push(e), si();
}
function Ms(e, t = pn ? Xe + 1 : 0) {
  for (; t < Se.length; t++) {
      const n = Se[t];
      n && n.pre && (Se.splice(t, 1), t--, n());
  }
}
function oi(e) {
  if (Ut.length) {
      const t = [...new Set(Ut)];
      if (((Ut.length = 0), rt)) {
          rt.push(...t);
          return;
      }
      for (rt = t, rt.sort((n, r) => mn(n) - mn(r)), xt = 0; xt < rt.length; xt++) rt[xt]();
      (rt = null), (xt = 0);
  }
}
const mn = (e) => (e.id == null ? 1 / 0 : e.id),
  gc = (e, t) => {
      const n = mn(e) - mn(t);
      if (n === 0) {
          if (e.pre && !t.pre) return -1;
          if (t.pre && !e.pre) return 1;
      }
      return n;
  };
function ii(e) {
  (Pr = !1), (pn = !0), Se.sort(gc);
  const t = ze;
  try {
      for (Xe = 0; Xe < Se.length; Xe++) {
          const n = Se[Xe];
          n && n.active !== !1 && yt(n, null, 14);
      }
  } finally {
      (Xe = 0), (Se.length = 0), oi(), (pn = !1), (ss = null), (Se.length || Ut.length) && ii();
  }
}
function _c(e, t, ...n) {
  if (e.isUnmounted) return;
  const r = e.vnode.props || le;
  let s = n;
  const o = t.startsWith("update:"),
      i = o && t.slice(7);
  if (i && i in r) {
      const u = `${i === "modelValue" ? "model" : i}Modifiers`,
          { number: h, trim: p } = r[u] || le;
      p && (s = n.map((g) => (me(g) ? g.trim() : g))), h && (s = n.map(Bo));
  }
  let l,
      c = r[(l = ur(t))] || r[(l = ur(et(t)))];
  !c && o && (c = r[(l = ur(Jt(t)))]), c && Be(c, e, 6, s);
  const a = r[l + "Once"];
  if (a) {
      if (!e.emitted) e.emitted = {};
      else if (e.emitted[l]) return;
      (e.emitted[l] = !0), Be(a, e, 6, s);
  }
}
function li(e, t, n = !1) {
  const r = t.emitsCache,
      s = r.get(e);
  if (s !== void 0) return s;
  const o = e.emits;
  let i = {},
      l = !1;
  if (!z(e)) {
      const c = (a) => {
          const u = li(a, t, !0);
          u && ((l = !0), ve(i, u));
      };
      !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
  }
  return !o && !l ? (ce(e) && r.set(e, null), null) : (H(o) ? o.forEach((c) => (i[c] = null)) : ve(i, o), ce(e) && r.set(e, i), i);
}
function Zn(e, t) {
  return !e || !Wn(t) ? !1 : ((t = t.slice(2).replace(/Once$/, "")), G(e, t[0].toLowerCase() + t.slice(1)) || G(e, Jt(t)) || G(e, t));
}
let Fe = null,
  ci = null;
function zn(e) {
  const t = Fe;
  return (Fe = e), (ci = (e && e.type.__scopeId) || null), t;
}
function yc(e, t = Fe, n) {
  if (!t || e._n) return e;
  const r = (...s) => {
      r._d && Ks(-1);
      const o = zn(t);
      let i;
      try {
          i = e(...s);
      } finally {
          zn(o), r._d && Ks(1);
      }
      return i;
  };
  return (r._n = !0), (r._c = !0), (r._d = !0), r;
}
function dr(e) {
  const {
      type: t,
      vnode: n,
      proxy: r,
      withProxy: s,
      props: o,
      propsOptions: [i],
      slots: l,
      attrs: c,
      emit: a,
      render: u,
      renderCache: h,
      data: p,
      setupState: g,
      ctx: _,
      inheritAttrs: E,
  } = e;
  let M, O;
  const F = zn(e);
  try {
      if (n.shapeFlag & 4) {
          const K = s || r;
          (M = Ye(u.call(K, K, h, o, g, p, _))), (O = c);
      } else {
          const K = t;
          (M = Ye(K.length > 1 ? K(o, { attrs: c, slots: l, emit: a }) : K(o, null))), (O = t.props ? c : bc(c));
      }
  } catch (K) {
      (cn.length = 0), Xn(K, e, 1), (M = Ee(qe));
  }
  let k = M;
  if (O && E !== !1) {
      const K = Object.keys(O),
          { shapeFlag: W } = k;
      K.length && W & 7 && (i && K.some(Vr) && (O = wc(O, i)), (k = wt(k, O)));
  }
  return n.dirs && ((k = wt(k)), (k.dirs = k.dirs ? k.dirs.concat(n.dirs) : n.dirs)), n.transition && (k.transition = n.transition), (M = k), zn(F), M;
}
const bc = (e) => {
      let t;
      for (const n in e) (n === "class" || n === "style" || Wn(n)) && ((t || (t = {}))[n] = e[n]);
      return t;
  },
  wc = (e, t) => {
      const n = {};
      for (const r in e) (!Vr(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
      return n;
  };
function Sc(e, t, n) {
  const { props: r, children: s, component: o } = e,
      { props: i, children: l, patchFlag: c } = t,
      a = o.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && c >= 0) {
      if (c & 1024) return !0;
      if (c & 16) return r ? Ds(r, i, a) : !!i;
      if (c & 8) {
          const u = t.dynamicProps;
          for (let h = 0; h < u.length; h++) {
              const p = u[h];
              if (i[p] !== r[p] && !Zn(a, p)) return !0;
          }
      }
  } else return (s || l) && (!l || !l.$stable) ? !0 : r === i ? !1 : r ? (i ? Ds(r, i, a) : !0) : !!i;
  return !1;
}
function Ds(e, t, n) {
  const r = Object.keys(t);
  if (r.length !== Object.keys(e).length) return !0;
  for (let s = 0; s < r.length; s++) {
      const o = r[s];
      if (t[o] !== e[o] && !Zn(n, o)) return !0;
  }
  return !1;
}
function Ec({ vnode: e, parent: t }, n) {
  for (; t && t.subTree === e; ) ((e = t.vnode).el = n), (t = t.parent);
}
const vc = (e) => e.__isSuspense;
function xc(e, t) {
  t && t.pendingBranch ? (H(e) ? t.effects.push(...e) : t.effects.push(e)) : mc(e);
}
function In(e, t) {
  if (_e) {
      let n = _e.provides;
      const r = _e.parent && _e.parent.provides;
      r === n && (n = _e.provides = Object.create(r)), (n[e] = t);
  }
}
function Ke(e, t, n = !1) {
  const r = _e || Fe;
  if (r) {
      const s = r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides;
      if (s && e in s) return s[e];
      if (arguments.length > 1) return n && z(t) ? t.call(r.proxy) : t;
  }
}
const Tn = {};
function on(e, t, n) {
  return ai(e, t, n);
}
function ai(e, t, { immediate: n, deep: r, flush: s, onTrack: o, onTrigger: i } = le) {
  const l = _e;
  let c,
      a = !1,
      u = !1;
  if (
      (fe(e)
          ? ((c = () => e.value), (a = Hn(e)))
          : _t(e)
          ? ((c = () => e), (r = !0))
          : H(e)
          ? ((u = !0),
            (a = e.some((k) => _t(k) || Hn(k))),
            (c = () =>
                e.map((k) => {
                    if (fe(k)) return k.value;
                    if (_t(k)) return Bt(k);
                    if (z(k)) return yt(k, l, 2);
                })))
          : z(e)
          ? t
              ? (c = () => yt(e, l, 2))
              : (c = () => {
                    if (!(l && l.isUnmounted)) return h && h(), Be(e, l, 3, [p]);
                })
          : (c = ze),
      t && r)
  ) {
      const k = c;
      c = () => Bt(k());
  }
  let h,
      p = (k) => {
          h = O.onStop = () => {
              yt(k, l, 4);
          };
      },
      g;
  if (yn)
      if (((p = ze), t ? n && Be(t, l, 3, [c(), u ? [] : void 0, p]) : c(), s === "sync")) {
          const k = ya();
          g = k.__watcherHandles || (k.__watcherHandles = []);
      } else return ze;
  let _ = u ? new Array(e.length).fill(Tn) : Tn;
  const E = () => {
      if (O.active)
          if (t) {
              const k = O.run();
              (r || a || (u ? k.some((K, W) => dn(K, _[W])) : dn(k, _))) && (h && h(), Be(t, l, 3, [k, _ === Tn ? void 0 : u && _[0] === Tn ? [] : _, p]), (_ = k));
          } else O.run();
  };
  E.allowRecurse = !!t;
  let M;
  s === "sync" ? (M = E) : s === "post" ? (M = () => Oe(E, l && l.suspense)) : ((E.pre = !0), l && (E.id = l.uid), (M = () => is(E)));
  const O = new Yr(c, M);
  t ? (n ? E() : (_ = O.run())) : s === "post" ? Oe(O.run.bind(O), l && l.suspense) : O.run();
  const F = () => {
      O.stop(), l && l.scope && Wr(l.scope.effects, O);
  };
  return g && g.push(F), F;
}
function Rc(e, t, n) {
  const r = this.proxy,
      s = me(e) ? (e.includes(".") ? ui(r, e) : () => r[e]) : e.bind(r, r);
  let o;
  z(t) ? (o = t) : ((o = t.handler), (n = t));
  const i = _e;
  qt(this);
  const l = ai(s, o.bind(r), n);
  return i ? qt(i) : Ot(), l;
}
function ui(e, t) {
  const n = t.split(".");
  return () => {
      let r = e;
      for (let s = 0; s < n.length && r; s++) r = r[n[s]];
      return r;
  };
}
function Bt(e, t) {
  if (!ce(e) || e.__v_skip || ((t = t || new Set()), t.has(e))) return e;
  if ((t.add(e), fe(e))) Bt(e.value, t);
  else if (H(e)) for (let n = 0; n < e.length; n++) Bt(e[n], t);
  else if (Io(e) || $t(e))
      e.forEach((n) => {
          Bt(n, t);
      });
  else if (Fo(e)) for (const n in e) Bt(e[n], t);
  return e;
}
function Pc() {
  const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() };
  return (
      mi(() => {
          e.isMounted = !0;
      }),
      gi(() => {
          e.isUnmounting = !0;
      }),
      e
  );
}
const De = [Function, Array],
  Cc = {
      name: "BaseTransition",
      props: {
          mode: String,
          appear: Boolean,
          persisted: Boolean,
          onBeforeEnter: De,
          onEnter: De,
          onAfterEnter: De,
          onEnterCancelled: De,
          onBeforeLeave: De,
          onLeave: De,
          onAfterLeave: De,
          onLeaveCancelled: De,
          onBeforeAppear: De,
          onAppear: De,
          onAfterAppear: De,
          onAppearCancelled: De,
      },
      setup(e, { slots: t }) {
          const n = Ai(),
              r = Pc();
          let s;
          return () => {
              const o = t.default && di(t.default(), !0);
              if (!o || !o.length) return;
              let i = o[0];
              if (o.length > 1) {
                  for (const E of o)
                      if (E.type !== qe) {
                          i = E;
                          break;
                      }
              }
              const l = Q(e),
                  { mode: c } = l;
              if (r.isLeaving) return hr(i);
              const a = Fs(i);
              if (!a) return hr(i);
              const u = Cr(a, l, r, n);
              Or(a, u);
              const h = n.subTree,
                  p = h && Fs(h);
              let g = !1;
              const { getTransitionKey: _ } = a.type;
              if (_) {
                  const E = _();
                  s === void 0 ? (s = E) : E !== s && ((s = E), (g = !0));
              }
              if (p && p.type !== qe && (!Rt(a, p) || g)) {
                  const E = Cr(p, l, r, n);
                  if ((Or(p, E), c === "out-in"))
                      return (
                          (r.isLeaving = !0),
                          (E.afterLeave = () => {
                              (r.isLeaving = !1), n.update.active !== !1 && n.update();
                          }),
                          hr(i)
                      );
                  c === "in-out" &&
                      a.type !== qe &&
                      (E.delayLeave = (M, O, F) => {
                          const k = fi(r, p);
                          (k[String(p.key)] = p),
                              (M._leaveCb = () => {
                                  O(), (M._leaveCb = void 0), delete u.delayedLeave;
                              }),
                              (u.delayedLeave = F);
                      });
              }
              return i;
          };
      },
  },
  Oc = Cc;
function fi(e, t) {
  const { leavingVNodes: n } = e;
  let r = n.get(t.type);
  return r || ((r = Object.create(null)), n.set(t.type, r)), r;
}
function Cr(e, t, n, r) {
  const {
          appear: s,
          mode: o,
          persisted: i = !1,
          onBeforeEnter: l,
          onEnter: c,
          onAfterEnter: a,
          onEnterCancelled: u,
          onBeforeLeave: h,
          onLeave: p,
          onAfterLeave: g,
          onLeaveCancelled: _,
          onBeforeAppear: E,
          onAppear: M,
          onAfterAppear: O,
          onAppearCancelled: F,
      } = t,
      k = String(e.key),
      K = fi(n, e),
      W = (N, X) => {
          N && Be(N, r, 9, X);
      },
      ae = (N, X) => {
          const Y = X[1];
          W(N, X), H(N) ? N.every((ue) => ue.length <= 1) && Y() : N.length <= 1 && Y();
      },
      q = {
          mode: o,
          persisted: i,
          beforeEnter(N) {
              let X = l;
              if (!n.isMounted)
                  if (s) X = E || l;
                  else return;
              N._leaveCb && N._leaveCb(!0);
              const Y = K[k];
              Y && Rt(e, Y) && Y.el._leaveCb && Y.el._leaveCb(), W(X, [N]);
          },
          enter(N) {
              let X = c,
                  Y = a,
                  ue = u;
              if (!n.isMounted)
                  if (s) (X = M || c), (Y = O || a), (ue = F || u);
                  else return;
              let xe = !1;
              const be = (N._enterCb = (Ae) => {
                  xe || ((xe = !0), Ae ? W(ue, [N]) : W(Y, [N]), q.delayedLeave && q.delayedLeave(), (N._enterCb = void 0));
              });
              X ? ae(X, [N, be]) : be();
          },
          leave(N, X) {
              const Y = String(e.key);
              if ((N._enterCb && N._enterCb(!0), n.isUnmounting)) return X();
              W(h, [N]);
              let ue = !1;
              const xe = (N._leaveCb = (be) => {
                  ue || ((ue = !0), X(), be ? W(_, [N]) : W(g, [N]), (N._leaveCb = void 0), K[Y] === e && delete K[Y]);
              });
              (K[Y] = e), p ? ae(p, [N, xe]) : xe();
          },
          clone(N) {
              return Cr(N, t, n, r);
          },
      };
  return q;
}
function hr(e) {
  if (er(e)) return (e = wt(e)), (e.children = null), e;
}
function Fs(e) {
  return er(e) ? (e.children ? e.children[0] : void 0) : e;
}
function Or(e, t) {
  e.shapeFlag & 6 && e.component ? Or(e.component.subTree, t) : e.shapeFlag & 128 ? ((e.ssContent.transition = t.clone(e.ssContent)), (e.ssFallback.transition = t.clone(e.ssFallback))) : (e.transition = t);
}
function di(e, t = !1, n) {
  let r = [],
      s = 0;
  for (let o = 0; o < e.length; o++) {
      let i = e[o];
      const l = n == null ? i.key : String(n) + String(i.key != null ? i.key : o);
      i.type === Pe ? (i.patchFlag & 128 && s++, (r = r.concat(di(i.children, t, l)))) : (t || i.type !== qe) && r.push(l != null ? wt(i, { key: l }) : i);
  }
  if (s > 1) for (let o = 0; o < r.length; o++) r[o].patchFlag = -2;
  return r;
}
function hi(e) {
  return z(e) ? { setup: e, name: e.name } : e;
}
const Mn = (e) => !!e.type.__asyncLoader,
  er = (e) => e.type.__isKeepAlive;
function Ac(e, t) {
  pi(e, "a", t);
}
function Tc(e, t) {
  pi(e, "da", t);
}
function pi(e, t, n = _e) {
  const r =
      e.__wdc ||
      (e.__wdc = () => {
          let s = n;
          for (; s; ) {
              if (s.isDeactivated) return;
              s = s.parent;
          }
          return e();
      });
  if ((tr(t, r, n), n)) {
      let s = n.parent;
      for (; s && s.parent; ) er(s.parent.vnode) && Nc(r, t, n, s), (s = s.parent);
  }
}
function Nc(e, t, n, r) {
  const s = tr(t, e, r, !0);
  _i(() => {
      Wr(r[t], s);
  }, n);
}
function tr(e, t, n = _e, r = !1) {
  if (n) {
      const s = n[e] || (n[e] = []),
          o =
              t.__weh ||
              (t.__weh = (...i) => {
                  if (n.isUnmounted) return;
                  Qt(), qt(n);
                  const l = Be(t, n, e, i);
                  return Ot(), Yt(), l;
              });
      return r ? s.unshift(o) : s.push(o), o;
  }
}
const it = (e) => (t, n = _e) => (!yn || e === "sp") && tr(e, (...r) => t(...r), n),
  kc = it("bm"),
  mi = it("m"),
  Ic = it("bu"),
  Mc = it("u"),
  gi = it("bum"),
  _i = it("um"),
  Dc = it("sp"),
  Fc = it("rtg"),
  Bc = it("rtc");
function Lc(e, t = _e) {
  tr("ec", e, t);
}
function St(e, t, n, r) {
  const s = e.dirs,
      o = t && t.dirs;
  for (let i = 0; i < s.length; i++) {
      const l = s[i];
      o && (l.oldValue = o[i].value);
      let c = l.dir[r];
      c && (Qt(), Be(c, n, 8, [e.el, l, e, t]), Yt());
  }
}
const yi = "components";
function je(e, t) {
  return jc(yi, e, !0, t) || e;
}
const $c = Symbol();
function jc(e, t, n = !0, r = !1) {
  const s = Fe || _e;
  if (s) {
      const o = s.type;
      if (e === yi) {
          const l = ma(o, !1);
          if (l && (l === t || l === et(t) || l === Qn(et(t)))) return o;
      }
      const i = Bs(s[e] || o[e], t) || Bs(s.appContext[e], t);
      return !i && r ? o : i;
  }
}
function Bs(e, t) {
  return e && (e[t] || e[et(t)] || e[Qn(et(t))]);
}
function gn(e, t, n, r) {
  let s;
  const o = n && n[r];
  if (H(e) || me(e)) {
      s = new Array(e.length);
      for (let i = 0, l = e.length; i < l; i++) s[i] = t(e[i], i, void 0, o && o[i]);
  } else if (typeof e == "number") {
      s = new Array(e);
      for (let i = 0; i < e; i++) s[i] = t(i + 1, i, void 0, o && o[i]);
  } else if (ce(e))
      if (e[Symbol.iterator]) s = Array.from(e, (i, l) => t(i, l, void 0, o && o[l]));
      else {
          const i = Object.keys(e);
          s = new Array(i.length);
          for (let l = 0, c = i.length; l < c; l++) {
              const a = i[l];
              s[l] = t(e[a], a, l, o && o[l]);
          }
      }
  else s = [];
  return n && (n[r] = s), s;
}
const Ar = (e) => (e ? (Ti(e) ? fs(e) || e.proxy : Ar(e.parent)) : null),
  ln = ve(Object.create(null), {
      $: (e) => e,
      $el: (e) => e.vnode.el,
      $data: (e) => e.data,
      $props: (e) => e.props,
      $attrs: (e) => e.attrs,
      $slots: (e) => e.slots,
      $refs: (e) => e.refs,
      $parent: (e) => Ar(e.parent),
      $root: (e) => Ar(e.root),
      $emit: (e) => e.emit,
      $options: (e) => ls(e),
      $forceUpdate: (e) => e.f || (e.f = () => is(e.update)),
      $nextTick: (e) => e.n || (e.n = os.bind(e.proxy)),
      $watch: (e) => Rc.bind(e),
  }),
  pr = (e, t) => e !== le && !e.__isScriptSetup && G(e, t),
  Uc = {
      get({ _: e }, t) {
          const { ctx: n, setupState: r, data: s, props: o, accessCache: i, type: l, appContext: c } = e;
          let a;
          if (t[0] !== "$") {
              const g = i[t];
              if (g !== void 0)
                  switch (g) {
                      case 1:
                          return r[t];
                      case 2:
                          return s[t];
                      case 4:
                          return n[t];
                      case 3:
                          return o[t];
                  }
              else {
                  if (pr(r, t)) return (i[t] = 1), r[t];
                  if (s !== le && G(s, t)) return (i[t] = 2), s[t];
                  if ((a = e.propsOptions[0]) && G(a, t)) return (i[t] = 3), o[t];
                  if (n !== le && G(n, t)) return (i[t] = 4), n[t];
                  Tr && (i[t] = 0);
              }
          }
          const u = ln[t];
          let h, p;
          if (u) return t === "$attrs" && Me(e, "get", t), u(e);
          if ((h = l.__cssModules) && (h = h[t])) return h;
          if (n !== le && G(n, t)) return (i[t] = 4), n[t];
          if (((p = c.config.globalProperties), G(p, t))) return p[t];
      },
      set({ _: e }, t, n) {
          const { data: r, setupState: s, ctx: o } = e;
          return pr(s, t) ? ((s[t] = n), !0) : r !== le && G(r, t) ? ((r[t] = n), !0) : G(e.props, t) || (t[0] === "$" && t.slice(1) in e) ? !1 : ((o[t] = n), !0);
      },
      has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: s, propsOptions: o } }, i) {
          let l;
          return !!n[i] || (e !== le && G(e, i)) || pr(t, i) || ((l = o[0]) && G(l, i)) || G(r, i) || G(ln, i) || G(s.config.globalProperties, i);
      },
      defineProperty(e, t, n) {
          return n.get != null ? (e._.accessCache[t] = 0) : G(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
      },
  };
let Tr = !0;
function Hc(e) {
  const t = ls(e),
      n = e.proxy,
      r = e.ctx;
  (Tr = !1), t.beforeCreate && Ls(t.beforeCreate, e, "bc");
  const {
      data: s,
      computed: o,
      methods: i,
      watch: l,
      provide: c,
      inject: a,
      created: u,
      beforeMount: h,
      mounted: p,
      beforeUpdate: g,
      updated: _,
      activated: E,
      deactivated: M,
      beforeDestroy: O,
      beforeUnmount: F,
      destroyed: k,
      unmounted: K,
      render: W,
      renderTracked: ae,
      renderTriggered: q,
      errorCaptured: N,
      serverPrefetch: X,
      expose: Y,
      inheritAttrs: ue,
      components: xe,
      directives: be,
      filters: Ae,
  } = t;
  if ((a && zc(a, r, null, e.appContext.config.unwrapInjectedRef), i))
      for (const oe in i) {
          const Z = i[oe];
          z(Z) && (r[oe] = Z.bind(n));
      }
  if (s) {
      const oe = s.call(n, n);
      ce(oe) && (e.data = Xt(oe));
  }
  if (((Tr = !0), o))
      for (const oe in o) {
          const Z = o[oe],
              tt = z(Z) ? Z.bind(n, n) : z(Z.get) ? Z.get.bind(n, n) : ze,
              ct = !z(Z) && z(Z.set) ? Z.set.bind(n) : ze,
              Ge = ke({ get: tt, set: ct });
          Object.defineProperty(r, oe, { enumerable: !0, configurable: !0, get: () => Ge.value, set: (Ce) => (Ge.value = Ce) });
      }
  if (l) for (const oe in l) bi(l[oe], r, n, oe);
  if (c) {
      const oe = z(c) ? c.call(n) : c;
      Reflect.ownKeys(oe).forEach((Z) => {
          In(Z, oe[Z]);
      });
  }
  u && Ls(u, e, "c");
  function ge(oe, Z) {
      H(Z) ? Z.forEach((tt) => oe(tt.bind(n))) : Z && oe(Z.bind(n));
  }
  if ((ge(kc, h), ge(mi, p), ge(Ic, g), ge(Mc, _), ge(Ac, E), ge(Tc, M), ge(Lc, N), ge(Bc, ae), ge(Fc, q), ge(gi, F), ge(_i, K), ge(Dc, X), H(Y)))
      if (Y.length) {
          const oe = e.exposed || (e.exposed = {});
          Y.forEach((Z) => {
              Object.defineProperty(oe, Z, { get: () => n[Z], set: (tt) => (n[Z] = tt) });
          });
      } else e.exposed || (e.exposed = {});
  W && e.render === ze && (e.render = W), ue != null && (e.inheritAttrs = ue), xe && (e.components = xe), be && (e.directives = be);
}
function zc(e, t, n = ze, r = !1) {
  H(e) && (e = Nr(e));
  for (const s in e) {
      const o = e[s];
      let i;
      ce(o) ? ("default" in o ? (i = Ke(o.from || s, o.default, !0)) : (i = Ke(o.from || s))) : (i = Ke(o)),
          fe(i) && r ? Object.defineProperty(t, s, { enumerable: !0, configurable: !0, get: () => i.value, set: (l) => (i.value = l) }) : (t[s] = i);
  }
}
function Ls(e, t, n) {
  Be(H(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function bi(e, t, n, r) {
  const s = r.includes(".") ? ui(n, r) : () => n[r];
  if (me(e)) {
      const o = t[e];
      z(o) && on(s, o);
  } else if (z(e)) on(s, e.bind(n));
  else if (ce(e))
      if (H(e)) e.forEach((o) => bi(o, t, n, r));
      else {
          const o = z(e.handler) ? e.handler.bind(n) : t[e.handler];
          z(o) && on(s, o, e);
      }
}
function ls(e) {
  const t = e.type,
      { mixins: n, extends: r } = t,
      {
          mixins: s,
          optionsCache: o,
          config: { optionMergeStrategies: i },
      } = e.appContext,
      l = o.get(t);
  let c;
  return l ? (c = l) : !s.length && !n && !r ? (c = t) : ((c = {}), s.length && s.forEach((a) => Kn(c, a, i, !0)), Kn(c, t, i)), ce(t) && o.set(t, c), c;
}
function Kn(e, t, n, r = !1) {
  const { mixins: s, extends: o } = t;
  o && Kn(e, o, n, !0), s && s.forEach((i) => Kn(e, i, n, !0));
  for (const i in t)
      if (!(r && i === "expose")) {
          const l = Kc[i] || (n && n[i]);
          e[i] = l ? l(e[i], t[i]) : t[i];
      }
  return e;
}
const Kc = {
  data: $s,
  props: vt,
  emits: vt,
  methods: vt,
  computed: vt,
  beforeCreate: Re,
  created: Re,
  beforeMount: Re,
  mounted: Re,
  beforeUpdate: Re,
  updated: Re,
  beforeDestroy: Re,
  beforeUnmount: Re,
  destroyed: Re,
  unmounted: Re,
  activated: Re,
  deactivated: Re,
  errorCaptured: Re,
  serverPrefetch: Re,
  components: vt,
  directives: vt,
  watch: Vc,
  provide: $s,
  inject: qc,
};
function $s(e, t) {
  return t
      ? e
          ? function () {
                return ve(z(e) ? e.call(this, this) : e, z(t) ? t.call(this, this) : t);
            }
          : t
      : e;
}
function qc(e, t) {
  return vt(Nr(e), Nr(t));
}
function Nr(e) {
  if (H(e)) {
      const t = {};
      for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
      return t;
  }
  return e;
}
function Re(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function vt(e, t) {
  return e ? ve(ve(Object.create(null), e), t) : t;
}
function Vc(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ve(Object.create(null), e);
  for (const r in t) n[r] = Re(e[r], t[r]);
  return n;
}
function Wc(e, t, n, r = !1) {
  const s = {},
      o = {};
  Un(o, rr, 1), (e.propsDefaults = Object.create(null)), wi(e, t, s, o);
  for (const i in e.propsOptions[0]) i in s || (s[i] = void 0);
  n ? (e.props = r ? s : rc(s)) : e.type.props ? (e.props = s) : (e.props = o), (e.attrs = o);
}
function Gc(e, t, n, r) {
  const {
          props: s,
          attrs: o,
          vnode: { patchFlag: i },
      } = e,
      l = Q(s),
      [c] = e.propsOptions;
  let a = !1;
  if ((r || i > 0) && !(i & 16)) {
      if (i & 8) {
          const u = e.vnode.dynamicProps;
          for (let h = 0; h < u.length; h++) {
              let p = u[h];
              if (Zn(e.emitsOptions, p)) continue;
              const g = t[p];
              if (c)
                  if (G(o, p)) g !== o[p] && ((o[p] = g), (a = !0));
                  else {
                      const _ = et(p);
                      s[_] = kr(c, l, _, g, e, !1);
                  }
              else g !== o[p] && ((o[p] = g), (a = !0));
          }
      }
  } else {
      wi(e, t, s, o) && (a = !0);
      let u;
      for (const h in l) (!t || (!G(t, h) && ((u = Jt(h)) === h || !G(t, u)))) && (c ? n && (n[h] !== void 0 || n[u] !== void 0) && (s[h] = kr(c, l, h, void 0, e, !0)) : delete s[h]);
      if (o !== l) for (const h in o) (!t || !G(t, h)) && (delete o[h], (a = !0));
  }
  a && ot(e, "set", "$attrs");
}
function wi(e, t, n, r) {
  const [s, o] = e.propsOptions;
  let i = !1,
      l;
  if (t)
      for (let c in t) {
          if (kn(c)) continue;
          const a = t[c];
          let u;
          s && G(s, (u = et(c))) ? (!o || !o.includes(u) ? (n[u] = a) : ((l || (l = {}))[u] = a)) : Zn(e.emitsOptions, c) || ((!(c in r) || a !== r[c]) && ((r[c] = a), (i = !0)));
      }
  if (o) {
      const c = Q(n),
          a = l || le;
      for (let u = 0; u < o.length; u++) {
          const h = o[u];
          n[h] = kr(s, c, h, a[h], e, !G(a, h));
      }
  }
  return i;
}
function kr(e, t, n, r, s, o) {
  const i = e[n];
  if (i != null) {
      const l = G(i, "default");
      if (l && r === void 0) {
          const c = i.default;
          if (i.type !== Function && z(c)) {
              const { propsDefaults: a } = s;
              n in a ? (r = a[n]) : (qt(s), (r = a[n] = c.call(null, t)), Ot());
          } else r = c;
      }
      i[0] && (o && !l ? (r = !1) : i[1] && (r === "" || r === Jt(n)) && (r = !0));
  }
  return r;
}
function Si(e, t, n = !1) {
  const r = t.propsCache,
      s = r.get(e);
  if (s) return s;
  const o = e.props,
      i = {},
      l = [];
  let c = !1;
  if (!z(e)) {
      const u = (h) => {
          c = !0;
          const [p, g] = Si(h, t, !0);
          ve(i, p), g && l.push(...g);
      };
      !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
  }
  if (!o && !c) return ce(e) && r.set(e, Lt), Lt;
  if (H(o))
      for (let u = 0; u < o.length; u++) {
          const h = et(o[u]);
          js(h) && (i[h] = le);
      }
  else if (o)
      for (const u in o) {
          const h = et(u);
          if (js(h)) {
              const p = o[u],
                  g = (i[h] = H(p) || z(p) ? { type: p } : Object.assign({}, p));
              if (g) {
                  const _ = zs(Boolean, g.type),
                      E = zs(String, g.type);
                  (g[0] = _ > -1), (g[1] = E < 0 || _ < E), (_ > -1 || G(g, "default")) && l.push(h);
              }
          }
      }
  const a = [i, l];
  return ce(e) && r.set(e, a), a;
}
function js(e) {
  return e[0] !== "$";
}
function Us(e) {
  const t = e && e.toString().match(/^\s*function (\w+)/);
  return t ? t[1] : e === null ? "null" : "";
}
function Hs(e, t) {
  return Us(e) === Us(t);
}
function zs(e, t) {
  return H(t) ? t.findIndex((n) => Hs(n, e)) : z(t) && Hs(t, e) ? 0 : -1;
}
const Ei = (e) => e[0] === "_" || e === "$stable",
  cs = (e) => (H(e) ? e.map(Ye) : [Ye(e)]),
  Jc = (e, t, n) => {
      if (t._n) return t;
      const r = yc((...s) => cs(t(...s)), n);
      return (r._c = !1), r;
  },
  vi = (e, t, n) => {
      const r = e._ctx;
      for (const s in e) {
          if (Ei(s)) continue;
          const o = e[s];
          if (z(o)) t[s] = Jc(s, o, r);
          else if (o != null) {
              const i = cs(o);
              t[s] = () => i;
          }
      }
  },
  xi = (e, t) => {
      const n = cs(t);
      e.slots.default = () => n;
  },
  Qc = (e, t) => {
      if (e.vnode.shapeFlag & 32) {
          const n = t._;
          n ? ((e.slots = Q(t)), Un(t, "_", n)) : vi(t, (e.slots = {}));
      } else (e.slots = {}), t && xi(e, t);
      Un(e.slots, rr, 1);
  },
  Yc = (e, t, n) => {
      const { vnode: r, slots: s } = e;
      let o = !0,
          i = le;
      if (r.shapeFlag & 32) {
          const l = t._;
          l ? (n && l === 1 ? (o = !1) : (ve(s, t), !n && l === 1 && delete s._)) : ((o = !t.$stable), vi(t, s)), (i = t);
      } else t && (xi(e, t), (i = { default: 1 }));
      if (o) for (const l in s) !Ei(l) && !(l in i) && delete s[l];
  };
function Ri() {
  return {
      app: null,
      config: { isNativeTag: El, performance: !1, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} },
      mixins: [],
      components: {},
      directives: {},
      provides: Object.create(null),
      optionsCache: new WeakMap(),
      propsCache: new WeakMap(),
      emitsCache: new WeakMap(),
  };
}
let Xc = 0;
function Zc(e, t) {
  return function (r, s = null) {
      z(r) || (r = Object.assign({}, r)), s != null && !ce(s) && (s = null);
      const o = Ri(),
          i = new Set();
      let l = !1;
      const c = (o.app = {
          _uid: Xc++,
          _component: r,
          _props: s,
          _container: null,
          _context: o,
          _instance: null,
          version: ba,
          get config() {
              return o.config;
          },
          set config(a) {},
          use(a, ...u) {
              return i.has(a) || (a && z(a.install) ? (i.add(a), a.install(c, ...u)) : z(a) && (i.add(a), a(c, ...u))), c;
          },
          mixin(a) {
              return o.mixins.includes(a) || o.mixins.push(a), c;
          },
          component(a, u) {
              return u ? ((o.components[a] = u), c) : o.components[a];
          },
          directive(a, u) {
              return u ? ((o.directives[a] = u), c) : o.directives[a];
          },
          mount(a, u, h) {
              if (!l) {
                  const p = Ee(r, s);
                  return (p.appContext = o), u && t ? t(p, a) : e(p, a, h), (l = !0), (c._container = a), (a.__vue_app__ = c), fs(p.component) || p.component.proxy;
              }
          },
          unmount() {
              l && (e(null, c._container), delete c._container.__vue_app__);
          },
          provide(a, u) {
              return (o.provides[a] = u), c;
          },
      });
      return c;
  };
}
function Ir(e, t, n, r, s = !1) {
  if (H(e)) {
      e.forEach((p, g) => Ir(p, t && (H(t) ? t[g] : t), n, r, s));
      return;
  }
  if (Mn(r) && !s) return;
  const o = r.shapeFlag & 4 ? fs(r.component) || r.component.proxy : r.el,
      i = s ? null : o,
      { i: l, r: c } = e,
      a = t && t.r,
      u = l.refs === le ? (l.refs = {}) : l.refs,
      h = l.setupState;
  if ((a != null && a !== c && (me(a) ? ((u[a] = null), G(h, a) && (h[a] = null)) : fe(a) && (a.value = null)), z(c))) yt(c, l, 12, [i, u]);
  else {
      const p = me(c),
          g = fe(c);
      if (p || g) {
          const _ = () => {
              if (e.f) {
                  const E = p ? (G(h, c) ? h[c] : u[c]) : c.value;
                  s ? H(E) && Wr(E, o) : H(E) ? E.includes(o) || E.push(o) : p ? ((u[c] = [o]), G(h, c) && (h[c] = u[c])) : ((c.value = [o]), e.k && (u[e.k] = c.value));
              } else p ? ((u[c] = i), G(h, c) && (h[c] = i)) : g && ((c.value = i), e.k && (u[e.k] = i));
          };
          i ? ((_.id = -1), Oe(_, n)) : _();
      }
  }
}
const Oe = xc;
function ea(e) {
  return ta(e);
}
function ta(e, t) {
  const n = Ol();
  n.__VUE__ = !0;
  const { insert: r, remove: s, patchProp: o, createElement: i, createText: l, createComment: c, setText: a, setElementText: u, parentNode: h, nextSibling: p, setScopeId: g = ze, insertStaticContent: _ } = e,
      E = (f, d, m, y = null, S = null, v = null, A = !1, R = null, P = !!d.dynamicChildren) => {
          if (f === d) return;
          f && !Rt(f, d) && ((y = w(f)), Ce(f, S, v, !0), (f = null)), d.patchFlag === -2 && ((P = !1), (d.dynamicChildren = null));
          const { type: x, ref: B, shapeFlag: I } = d;
          switch (x) {
              case nr:
                  M(f, d, m, y);
                  break;
              case qe:
                  O(f, d, m, y);
                  break;
              case Dn:
                  f == null && F(d, m, y, A);
                  break;
              case Pe:
                  xe(f, d, m, y, S, v, A, R, P);
                  break;
              default:
                  I & 1 ? W(f, d, m, y, S, v, A, R, P) : I & 6 ? be(f, d, m, y, S, v, A, R, P) : (I & 64 || I & 128) && x.process(f, d, m, y, S, v, A, R, P, C);
          }
          B != null && S && Ir(B, f && f.ref, v, d || f, !d);
      },
      M = (f, d, m, y) => {
          if (f == null) r((d.el = l(d.children)), m, y);
          else {
              const S = (d.el = f.el);
              d.children !== f.children && a(S, d.children);
          }
      },
      O = (f, d, m, y) => {
          f == null ? r((d.el = c(d.children || "")), m, y) : (d.el = f.el);
      },
      F = (f, d, m, y) => {
          [f.el, f.anchor] = _(f.children, d, m, y, f.el, f.anchor);
      },
      k = ({ el: f, anchor: d }, m, y) => {
          let S;
          for (; f && f !== d; ) (S = p(f)), r(f, m, y), (f = S);
          r(d, m, y);
      },
      K = ({ el: f, anchor: d }) => {
          let m;
          for (; f && f !== d; ) (m = p(f)), s(f), (f = m);
          s(d);
      },
      W = (f, d, m, y, S, v, A, R, P) => {
          (A = A || d.type === "svg"), f == null ? ae(d, m, y, S, v, A, R, P) : X(f, d, S, v, A, R, P);
      },
      ae = (f, d, m, y, S, v, A, R) => {
          let P, x;
          const { type: B, props: I, shapeFlag: L, transition: U, dirs: V } = f;
          if (((P = f.el = i(f.type, v, I && I.is, I)), L & 8 ? u(P, f.children) : L & 16 && N(f.children, P, null, y, S, v && B !== "foreignObject", A, R), V && St(f, null, y, "created"), I)) {
              for (const re in I) re !== "value" && !kn(re) && o(P, re, null, I[re], v, f.children, y, S, we);
              "value" in I && o(P, "value", null, I.value), (x = I.onVnodeBeforeMount) && Qe(x, y, f);
          }
          q(P, f, f.scopeId, A, y), V && St(f, null, y, "beforeMount");
          const ie = (!S || (S && !S.pendingBranch)) && U && !U.persisted;
          ie && U.beforeEnter(P),
              r(P, d, m),
              ((x = I && I.onVnodeMounted) || ie || V) &&
                  Oe(() => {
                      x && Qe(x, y, f), ie && U.enter(P), V && St(f, null, y, "mounted");
                  }, S);
      },
      q = (f, d, m, y, S) => {
          if ((m && g(f, m), y)) for (let v = 0; v < y.length; v++) g(f, y[v]);
          if (S) {
              let v = S.subTree;
              if (d === v) {
                  const A = S.vnode;
                  q(f, A, A.scopeId, A.slotScopeIds, S.parent);
              }
          }
      },
      N = (f, d, m, y, S, v, A, R, P = 0) => {
          for (let x = P; x < f.length; x++) {
              const B = (f[x] = R ? ht(f[x]) : Ye(f[x]));
              E(null, B, d, m, y, S, v, A, R);
          }
      },
      X = (f, d, m, y, S, v, A) => {
          const R = (d.el = f.el);
          let { patchFlag: P, dynamicChildren: x, dirs: B } = d;
          P |= f.patchFlag & 16;
          const I = f.props || le,
              L = d.props || le;
          let U;
          m && Et(m, !1), (U = L.onVnodeBeforeUpdate) && Qe(U, m, d, f), B && St(d, f, m, "beforeUpdate"), m && Et(m, !0);
          const V = S && d.type !== "foreignObject";
          if ((x ? Y(f.dynamicChildren, x, R, m, y, V, v) : A || Z(f, d, R, null, m, y, V, v, !1), P > 0)) {
              if (P & 16) ue(R, d, I, L, m, y, S);
              else if ((P & 2 && I.class !== L.class && o(R, "class", null, L.class, S), P & 4 && o(R, "style", I.style, L.style, S), P & 8)) {
                  const ie = d.dynamicProps;
                  for (let re = 0; re < ie.length; re++) {
                      const de = ie[re],
                          $e = I[de],
                          It = L[de];
                      (It !== $e || de === "value") && o(R, de, $e, It, S, f.children, m, y, we);
                  }
              }
              P & 1 && f.children !== d.children && u(R, d.children);
          } else !A && x == null && ue(R, d, I, L, m, y, S);
          ((U = L.onVnodeUpdated) || B) &&
              Oe(() => {
                  U && Qe(U, m, d, f), B && St(d, f, m, "updated");
              }, y);
      },
      Y = (f, d, m, y, S, v, A) => {
          for (let R = 0; R < d.length; R++) {
              const P = f[R],
                  x = d[R],
                  B = P.el && (P.type === Pe || !Rt(P, x) || P.shapeFlag & 70) ? h(P.el) : m;
              E(P, x, B, null, y, S, v, A, !0);
          }
      },
      ue = (f, d, m, y, S, v, A) => {
          if (m !== y) {
              if (m !== le) for (const R in m) !kn(R) && !(R in y) && o(f, R, m[R], null, A, d.children, S, v, we);
              for (const R in y) {
                  if (kn(R)) continue;
                  const P = y[R],
                      x = m[R];
                  P !== x && R !== "value" && o(f, R, x, P, A, d.children, S, v, we);
              }
              "value" in y && o(f, "value", m.value, y.value);
          }
      },
      xe = (f, d, m, y, S, v, A, R, P) => {
          const x = (d.el = f ? f.el : l("")),
              B = (d.anchor = f ? f.anchor : l(""));
          let { patchFlag: I, dynamicChildren: L, slotScopeIds: U } = d;
          U && (R = R ? R.concat(U) : U),
              f == null
                  ? (r(x, m, y), r(B, m, y), N(d.children, m, B, S, v, A, R, P))
                  : I > 0 && I & 64 && L && f.dynamicChildren
                  ? (Y(f.dynamicChildren, L, m, S, v, A, R), (d.key != null || (S && d === S.subTree)) && Pi(f, d, !0))
                  : Z(f, d, m, B, S, v, A, R, P);
      },
      be = (f, d, m, y, S, v, A, R, P) => {
          (d.slotScopeIds = R), f == null ? (d.shapeFlag & 512 ? S.ctx.activate(d, m, y, A, P) : Ae(d, m, y, S, v, A, P)) : he(f, d, P);
      },
      Ae = (f, d, m, y, S, v, A) => {
          const R = (f.component = ua(f, y, S));
          if ((er(f) && (R.ctx.renderer = C), fa(R), R.asyncDep)) {
              if ((S && S.registerDep(R, ge), !f.el)) {
                  const P = (R.subTree = Ee(qe));
                  O(null, P, d, m);
              }
              return;
          }
          ge(R, f, d, m, S, v, A);
      },
      he = (f, d, m) => {
          const y = (d.component = f.component);
          if (Sc(f, d, m))
              if (y.asyncDep && !y.asyncResolved) {
                  oe(y, d, m);
                  return;
              } else (y.next = d), pc(y.update), y.update();
          else (d.el = f.el), (y.vnode = d);
      },
      ge = (f, d, m, y, S, v, A) => {
          const R = () => {
                  if (f.isMounted) {
                      let { next: B, bu: I, u: L, parent: U, vnode: V } = f,
                          ie = B,
                          re;
                      Et(f, !1), B ? ((B.el = V.el), oe(f, B, A)) : (B = V), I && fr(I), (re = B.props && B.props.onVnodeBeforeUpdate) && Qe(re, U, B, V), Et(f, !0);
                      const de = dr(f),
                          $e = f.subTree;
                      (f.subTree = de), E($e, de, h($e.el), w($e), f, S, v), (B.el = de.el), ie === null && Ec(f, de.el), L && Oe(L, S), (re = B.props && B.props.onVnodeUpdated) && Oe(() => Qe(re, U, B, V), S);
                  } else {
                      let B;
                      const { el: I, props: L } = d,
                          { bm: U, m: V, parent: ie } = f,
                          re = Mn(d);
                      if ((Et(f, !1), U && fr(U), !re && (B = L && L.onVnodeBeforeMount) && Qe(B, ie, d), Et(f, !0), I && ee)) {
                          const de = () => {
                              (f.subTree = dr(f)), ee(I, f.subTree, f, S, null);
                          };
                          re ? d.type.__asyncLoader().then(() => !f.isUnmounted && de()) : de();
                      } else {
                          const de = (f.subTree = dr(f));
                          E(null, de, m, y, f, S, v), (d.el = de.el);
                      }
                      if ((V && Oe(V, S), !re && (B = L && L.onVnodeMounted))) {
                          const de = d;
                          Oe(() => Qe(B, ie, de), S);
                      }
                      (d.shapeFlag & 256 || (ie && Mn(ie.vnode) && ie.vnode.shapeFlag & 256)) && f.a && Oe(f.a, S), (f.isMounted = !0), (d = m = y = null);
                  }
              },
              P = (f.effect = new Yr(R, () => is(x), f.scope)),
              x = (f.update = () => P.run());
          (x.id = f.uid), Et(f, !0), x();
      },
      oe = (f, d, m) => {
          d.component = f;
          const y = f.vnode.props;
          (f.vnode = d), (f.next = null), Gc(f, d.props, y, m), Yc(f, d.children, m), Qt(), Ms(), Yt();
      },
      Z = (f, d, m, y, S, v, A, R, P = !1) => {
          const x = f && f.children,
              B = f ? f.shapeFlag : 0,
              I = d.children,
              { patchFlag: L, shapeFlag: U } = d;
          if (L > 0) {
              if (L & 128) {
                  ct(x, I, m, y, S, v, A, R, P);
                  return;
              } else if (L & 256) {
                  tt(x, I, m, y, S, v, A, R, P);
                  return;
              }
          }
          U & 8 ? (B & 16 && we(x, S, v), I !== x && u(m, I)) : B & 16 ? (U & 16 ? ct(x, I, m, y, S, v, A, R, P) : we(x, S, v, !0)) : (B & 8 && u(m, ""), U & 16 && N(I, m, y, S, v, A, R, P));
      },
      tt = (f, d, m, y, S, v, A, R, P) => {
          (f = f || Lt), (d = d || Lt);
          const x = f.length,
              B = d.length,
              I = Math.min(x, B);
          let L;
          for (L = 0; L < I; L++) {
              const U = (d[L] = P ? ht(d[L]) : Ye(d[L]));
              E(f[L], U, m, null, S, v, A, R, P);
          }
          x > B ? we(f, S, v, !0, !1, I) : N(d, m, y, S, v, A, R, P, I);
      },
      ct = (f, d, m, y, S, v, A, R, P) => {
          let x = 0;
          const B = d.length;
          let I = f.length - 1,
              L = B - 1;
          for (; x <= I && x <= L; ) {
              const U = f[x],
                  V = (d[x] = P ? ht(d[x]) : Ye(d[x]));
              if (Rt(U, V)) E(U, V, m, null, S, v, A, R, P);
              else break;
              x++;
          }
          for (; x <= I && x <= L; ) {
              const U = f[I],
                  V = (d[L] = P ? ht(d[L]) : Ye(d[L]));
              if (Rt(U, V)) E(U, V, m, null, S, v, A, R, P);
              else break;
              I--, L--;
          }
          if (x > I) {
              if (x <= L) {
                  const U = L + 1,
                      V = U < B ? d[U].el : y;
                  for (; x <= L; ) E(null, (d[x] = P ? ht(d[x]) : Ye(d[x])), m, V, S, v, A, R, P), x++;
              }
          } else if (x > L) for (; x <= I; ) Ce(f[x], S, v, !0), x++;
          else {
              const U = x,
                  V = x,
                  ie = new Map();
              for (x = V; x <= L; x++) {
                  const Te = (d[x] = P ? ht(d[x]) : Ye(d[x]));
                  Te.key != null && ie.set(Te.key, x);
              }
              let re,
                  de = 0;
              const $e = L - V + 1;
              let It = !1,
                  vs = 0;
              const tn = new Array($e);
              for (x = 0; x < $e; x++) tn[x] = 0;
              for (x = U; x <= I; x++) {
                  const Te = f[x];
                  if (de >= $e) {
                      Ce(Te, S, v, !0);
                      continue;
                  }
                  let Je;
                  if (Te.key != null) Je = ie.get(Te.key);
                  else
                      for (re = V; re <= L; re++)
                          if (tn[re - V] === 0 && Rt(Te, d[re])) {
                              Je = re;
                              break;
                          }
                  Je === void 0 ? Ce(Te, S, v, !0) : ((tn[Je - V] = x + 1), Je >= vs ? (vs = Je) : (It = !0), E(Te, d[Je], m, null, S, v, A, R, P), de++);
              }
              const xs = It ? na(tn) : Lt;
              for (re = xs.length - 1, x = $e - 1; x >= 0; x--) {
                  const Te = V + x,
                      Je = d[Te],
                      Rs = Te + 1 < B ? d[Te + 1].el : y;
                  tn[x] === 0 ? E(null, Je, m, Rs, S, v, A, R, P) : It && (re < 0 || x !== xs[re] ? Ge(Je, m, Rs, 2) : re--);
              }
          }
      },
      Ge = (f, d, m, y, S = null) => {
          const { el: v, type: A, transition: R, children: P, shapeFlag: x } = f;
          if (x & 6) {
              Ge(f.component.subTree, d, m, y);
              return;
          }
          if (x & 128) {
              f.suspense.move(d, m, y);
              return;
          }
          if (x & 64) {
              A.move(f, d, m, C);
              return;
          }
          if (A === Pe) {
              r(v, d, m);
              for (let I = 0; I < P.length; I++) Ge(P[I], d, m, y);
              r(f.anchor, d, m);
              return;
          }
          if (A === Dn) {
              k(f, d, m);
              return;
          }
          if (y !== 2 && x & 1 && R)
              if (y === 0) R.beforeEnter(v), r(v, d, m), Oe(() => R.enter(v), S);
              else {
                  const { leave: I, delayLeave: L, afterLeave: U } = R,
                      V = () => r(v, d, m),
                      ie = () => {
                          I(v, () => {
                              V(), U && U();
                          });
                      };
                  L ? L(v, V, ie) : ie();
              }
          else r(v, d, m);
      },
      Ce = (f, d, m, y = !1, S = !1) => {
          const { type: v, props: A, ref: R, children: P, dynamicChildren: x, shapeFlag: B, patchFlag: I, dirs: L } = f;
          if ((R != null && Ir(R, null, m, f, !0), B & 256)) {
              d.ctx.deactivate(f);
              return;
          }
          const U = B & 1 && L,
              V = !Mn(f);
          let ie;
          if ((V && (ie = A && A.onVnodeBeforeUnmount) && Qe(ie, d, f), B & 6)) xn(f.component, m, y);
          else {
              if (B & 128) {
                  f.suspense.unmount(m, y);
                  return;
              }
              U && St(f, null, d, "beforeUnmount"), B & 64 ? f.type.remove(f, d, m, S, C, y) : x && (v !== Pe || (I > 0 && I & 64)) ? we(x, d, m, !1, !0) : ((v === Pe && I & 384) || (!S && B & 16)) && we(P, d, m), y && Nt(f);
          }
          ((V && (ie = A && A.onVnodeUnmounted)) || U) &&
              Oe(() => {
                  ie && Qe(ie, d, f), U && St(f, null, d, "unmounted");
              }, m);
      },
      Nt = (f) => {
          const { type: d, el: m, anchor: y, transition: S } = f;
          if (d === Pe) {
              kt(m, y);
              return;
          }
          if (d === Dn) {
              K(f);
              return;
          }
          const v = () => {
              s(m), S && !S.persisted && S.afterLeave && S.afterLeave();
          };
          if (f.shapeFlag & 1 && S && !S.persisted) {
              const { leave: A, delayLeave: R } = S,
                  P = () => A(m, v);
              R ? R(f.el, v, P) : P();
          } else v();
      },
      kt = (f, d) => {
          let m;
          for (; f !== d; ) (m = p(f)), s(f), (f = m);
          s(d);
      },
      xn = (f, d, m) => {
          const { bum: y, scope: S, update: v, subTree: A, um: R } = f;
          y && fr(y),
              S.stop(),
              v && ((v.active = !1), Ce(A, f, d, m)),
              R && Oe(R, d),
              Oe(() => {
                  f.isUnmounted = !0;
              }, d),
              d && d.pendingBranch && !d.isUnmounted && f.asyncDep && !f.asyncResolved && f.suspenseId === d.pendingId && (d.deps--, d.deps === 0 && d.resolve());
      },
      we = (f, d, m, y = !1, S = !1, v = 0) => {
          for (let A = v; A < f.length; A++) Ce(f[A], d, m, y, S);
      },
      w = (f) => (f.shapeFlag & 6 ? w(f.component.subTree) : f.shapeFlag & 128 ? f.suspense.next() : p(f.anchor || f.el)),
      T = (f, d, m) => {
          f == null ? d._vnode && Ce(d._vnode, null, null, !0) : E(d._vnode || null, f, d, null, null, null, m), Ms(), oi(), (d._vnode = f);
      },
      C = { p: E, um: Ce, m: Ge, r: Nt, mt: Ae, mc: N, pc: Z, pbc: Y, n: w, o: e };
  let D, ee;
  return t && ([D, ee] = t(C)), { render: T, hydrate: D, createApp: Zc(T, D) };
}
function Et({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function Pi(e, t, n = !1) {
  const r = e.children,
      s = t.children;
  if (H(r) && H(s))
      for (let o = 0; o < r.length; o++) {
          const i = r[o];
          let l = s[o];
          l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && ((l = s[o] = ht(s[o])), (l.el = i.el)), n || Pi(i, l)), l.type === nr && (l.el = i.el);
      }
}
function na(e) {
  const t = e.slice(),
      n = [0];
  let r, s, o, i, l;
  const c = e.length;
  for (r = 0; r < c; r++) {
      const a = e[r];
      if (a !== 0) {
          if (((s = n[n.length - 1]), e[s] < a)) {
              (t[r] = s), n.push(r);
              continue;
          }
          for (o = 0, i = n.length - 1; o < i; ) (l = (o + i) >> 1), e[n[l]] < a ? (o = l + 1) : (i = l);
          a < e[n[o]] && (o > 0 && (t[r] = n[o - 1]), (n[o] = r));
      }
  }
  for (o = n.length, i = n[o - 1]; o-- > 0; ) (n[o] = i), (i = t[i]);
  return n;
}
const ra = (e) => e.__isTeleport,
  Pe = Symbol(void 0),
  nr = Symbol(void 0),
  qe = Symbol(void 0),
  Dn = Symbol(void 0),
  cn = [];
let He = null;
function $(e = !1) {
  cn.push((He = e ? null : []));
}
function sa() {
  cn.pop(), (He = cn[cn.length - 1] || null);
}
let _n = 1;
function Ks(e) {
  _n += e;
}
function Ci(e) {
  return (e.dynamicChildren = _n > 0 ? He || Lt : null), sa(), _n > 0 && He && He.push(e), e;
}
function ne(e, t, n, r, s, o) {
  return Ci(j(e, t, n, r, s, o, !0));
}
function pe(e, t, n, r, s) {
  return Ci(Ee(e, t, n, r, s, !0));
}
function Mr(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function Rt(e, t) {
  return e.type === t.type && e.key === t.key;
}
const rr = "__vInternal",
  Oi = ({ key: e }) => e ?? null,
  Fn = ({ ref: e, ref_key: t, ref_for: n }) => (e != null ? (me(e) || fe(e) || z(e) ? { i: Fe, r: e, k: t, f: !!n } : e) : null);
function j(e, t = null, n = null, r = 0, s = null, o = e === Pe ? 0 : 1, i = !1, l = !1) {
  const c = {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e,
      props: t,
      key: t && Oi(t),
      ref: t && Fn(t),
      scopeId: ci,
      slotScopeIds: null,
      children: n,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag: o,
      patchFlag: r,
      dynamicProps: s,
      dynamicChildren: null,
      appContext: null,
      ctx: Fe,
  };
  return l ? (us(c, n), o & 128 && e.normalize(c)) : n && (c.shapeFlag |= me(n) ? 8 : 16), _n > 0 && !i && He && (c.patchFlag > 0 || o & 6) && c.patchFlag !== 32 && He.push(c), c;
}
const Ee = oa;
function oa(e, t = null, n = null, r = 0, s = null, o = !1) {
  if (((!e || e === $c) && (e = qe), Mr(e))) {
      const l = wt(e, t, !0);
      return n && us(l, n), _n > 0 && !o && He && (l.shapeFlag & 6 ? (He[He.indexOf(e)] = l) : He.push(l)), (l.patchFlag |= -2), l;
  }
  if ((ga(e) && (e = e.__vccOpts), t)) {
      t = ia(t);
      let { class: l, style: c } = t;
      l && !me(l) && (t.class = Tt(l)), ce(c) && (Yo(c) && !H(c) && (c = ve({}, c)), (t.style = Ht(c)));
  }
  const i = me(e) ? 1 : vc(e) ? 128 : ra(e) ? 64 : ce(e) ? 4 : z(e) ? 2 : 0;
  return j(e, t, n, r, s, i, o, !0);
}
function ia(e) {
  return e ? (Yo(e) || rr in e ? ve({}, e) : e) : null;
}
function wt(e, t, n = !1) {
  const { props: r, ref: s, patchFlag: o, children: i } = e,
      l = t ? la(r || {}, t) : r;
  return {
      __v_isVNode: !0,
      __v_skip: !0,
      type: e.type,
      props: l,
      key: l && Oi(l),
      ref: t && t.ref ? (n && s ? (H(s) ? s.concat(Fn(t)) : [s, Fn(t)]) : Fn(t)) : s,
      scopeId: e.scopeId,
      slotScopeIds: e.slotScopeIds,
      children: i,
      target: e.target,
      targetAnchor: e.targetAnchor,
      staticCount: e.staticCount,
      shapeFlag: e.shapeFlag,
      patchFlag: t && e.type !== Pe ? (o === -1 ? 16 : o | 16) : o,
      dynamicProps: e.dynamicProps,
      dynamicChildren: e.dynamicChildren,
      appContext: e.appContext,
      dirs: e.dirs,
      transition: e.transition,
      component: e.component,
      suspense: e.suspense,
      ssContent: e.ssContent && wt(e.ssContent),
      ssFallback: e.ssFallback && wt(e.ssFallback),
      el: e.el,
      anchor: e.anchor,
      ctx: e.ctx,
  };
}
function Sn(e = " ", t = 0) {
  return Ee(nr, null, e, t);
}
function as(e, t) {
  const n = Ee(Dn, null, e);
  return (n.staticCount = t), n;
}
function se(e = "", t = !1) {
  return t ? ($(), pe(qe, null, e)) : Ee(qe, null, e);
}
function Ye(e) {
  return e == null || typeof e == "boolean" ? Ee(qe) : H(e) ? Ee(Pe, null, e.slice()) : typeof e == "object" ? ht(e) : Ee(nr, null, String(e));
}
function ht(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : wt(e);
}
function us(e, t) {
  let n = 0;
  const { shapeFlag: r } = e;
  if (t == null) t = null;
  else if (H(t)) n = 16;
  else if (typeof t == "object")
      if (r & 65) {
          const s = t.default;
          s && (s._c && (s._d = !1), us(e, s()), s._c && (s._d = !0));
          return;
      } else {
          n = 32;
          const s = t._;
          !s && !(rr in t) ? (t._ctx = Fe) : s === 3 && Fe && (Fe.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
      }
  else z(t) ? ((t = { default: t, _ctx: Fe }), (n = 32)) : ((t = String(t)), r & 64 ? ((n = 16), (t = [Sn(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}
function la(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
      const r = e[n];
      for (const s in r)
          if (s === "class") t.class !== r.class && (t.class = Tt([t.class, r.class]));
          else if (s === "style") t.style = Ht([t.style, r.style]);
          else if (Wn(s)) {
              const o = t[s],
                  i = r[s];
              i && o !== i && !(H(o) && o.includes(i)) && (t[s] = o ? [].concat(o, i) : i);
          } else s !== "" && (t[s] = r[s]);
  }
  return t;
}
function Qe(e, t, n, r = null) {
  Be(e, t, 7, [n, r]);
}
const ca = Ri();
let aa = 0;
function ua(e, t, n) {
  const r = e.type,
      s = (t ? t.appContext : e.appContext) || ca,
      o = {
          uid: aa++,
          vnode: e,
          type: r,
          parent: t,
          appContext: s,
          root: null,
          next: null,
          subTree: null,
          effect: null,
          update: null,
          scope: new Lo(!0),
          render: null,
          proxy: null,
          exposed: null,
          exposeProxy: null,
          withProxy: null,
          provides: t ? t.provides : Object.create(s.provides),
          accessCache: null,
          renderCache: [],
          components: null,
          directives: null,
          propsOptions: Si(r, s),
          emitsOptions: li(r, s),
          emit: null,
          emitted: null,
          propsDefaults: le,
          inheritAttrs: r.inheritAttrs,
          ctx: le,
          data: le,
          props: le,
          attrs: le,
          slots: le,
          refs: le,
          setupState: le,
          setupContext: null,
          suspense: n,
          suspenseId: n ? n.pendingId : 0,
          asyncDep: null,
          asyncResolved: !1,
          isMounted: !1,
          isUnmounted: !1,
          isDeactivated: !1,
          bc: null,
          c: null,
          bm: null,
          m: null,
          bu: null,
          u: null,
          um: null,
          bum: null,
          da: null,
          a: null,
          rtg: null,
          rtc: null,
          ec: null,
          sp: null,
      };
  return (o.ctx = { _: o }), (o.root = t ? t.root : o), (o.emit = _c.bind(null, o)), e.ce && e.ce(o), o;
}
let _e = null;
const Ai = () => _e || Fe,
  qt = (e) => {
      (_e = e), e.scope.on();
  },
  Ot = () => {
      _e && _e.scope.off(), (_e = null);
  };
function Ti(e) {
  return e.vnode.shapeFlag & 4;
}
let yn = !1;
function fa(e, t = !1) {
  yn = t;
  const { props: n, children: r } = e.vnode,
      s = Ti(e);
  Wc(e, n, s, t), Qc(e, r);
  const o = s ? da(e, t) : void 0;
  return (yn = !1), o;
}
function da(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = Kt(new Proxy(e.ctx, Uc)));
  const { setup: r } = n;
  if (r) {
      const s = (e.setupContext = r.length > 1 ? pa(e) : null);
      qt(e), Qt();
      const o = yt(r, e, 0, [e.props, s]);
      if ((Yt(), Ot(), Mo(o))) {
          if ((o.then(Ot, Ot), t))
              return o
                  .then((i) => {
                      qs(e, i, t);
                  })
                  .catch((i) => {
                      Xn(i, e, 0);
                  });
          e.asyncDep = o;
      } else qs(e, o, t);
  } else Ni(e, t);
}
function qs(e, t, n) {
  z(t) ? (e.type.__ssrInlineRender ? (e.ssrRender = t) : (e.render = t)) : ce(t) && (e.setupState = ti(t)), Ni(e, n);
}
let Vs;
function Ni(e, t, n) {
  const r = e.type;
  if (!e.render) {
      if (!t && Vs && !r.render) {
          const s = r.template || ls(e).template;
          if (s) {
              const { isCustomElement: o, compilerOptions: i } = e.appContext.config,
                  { delimiters: l, compilerOptions: c } = r,
                  a = ve(ve({ isCustomElement: o, delimiters: l }, i), c);
              r.render = Vs(s, a);
          }
      }
      e.render = r.render || ze;
  }
  qt(e), Qt(), Hc(e), Yt(), Ot();
}
function ha(e) {
  return new Proxy(e.attrs, {
      get(t, n) {
          return Me(e, "get", "$attrs"), t[n];
      },
  });
}
function pa(e) {
  const t = (r) => {
      e.exposed = r || {};
  };
  let n;
  return {
      get attrs() {
          return n || (n = ha(e));
      },
      slots: e.slots,
      emit: e.emit,
      expose: t,
  };
}
function fs(e) {
  if (e.exposed)
      return (
          e.exposeProxy ||
          (e.exposeProxy = new Proxy(ti(Kt(e.exposed)), {
              get(t, n) {
                  if (n in t) return t[n];
                  if (n in ln) return ln[n](e);
              },
              has(t, n) {
                  return n in t || n in ln;
              },
          }))
      );
}
function ma(e, t = !0) {
  return z(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function ga(e) {
  return z(e) && "__vccOpts" in e;
}
const ke = (e, t) => fc(e, t, yn);
function ki(e, t, n) {
  const r = arguments.length;
  return r === 2 ? (ce(t) && !H(t) ? (Mr(t) ? Ee(e, null, [t]) : Ee(e, t)) : Ee(e, null, t)) : (r > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : r === 3 && Mr(n) && (n = [n]), Ee(e, t, n));
}
const _a = Symbol(""),
  ya = () => Ke(_a),
  ba = "3.2.45",
  wa = "http://www.w3.org/2000/svg",
  Pt = typeof document < "u" ? document : null,
  Ws = Pt && Pt.createElement("template"),
  Sa = {
      insert: (e, t, n) => {
          t.insertBefore(e, n || null);
      },
      remove: (e) => {
          const t = e.parentNode;
          t && t.removeChild(e);
      },
      createElement: (e, t, n, r) => {
          const s = t ? Pt.createElementNS(wa, e) : Pt.createElement(e, n ? { is: n } : void 0);
          return e === "select" && r && r.multiple != null && s.setAttribute("multiple", r.multiple), s;
      },
      createText: (e) => Pt.createTextNode(e),
      createComment: (e) => Pt.createComment(e),
      setText: (e, t) => {
          e.nodeValue = t;
      },
      setElementText: (e, t) => {
          e.textContent = t;
      },
      parentNode: (e) => e.parentNode,
      nextSibling: (e) => e.nextSibling,
      querySelector: (e) => Pt.querySelector(e),
      setScopeId(e, t) {
          e.setAttribute(t, "");
      },
      insertStaticContent(e, t, n, r, s, o) {
          const i = n ? n.previousSibling : t.lastChild;
          if (s && (s === o || s.nextSibling)) for (; t.insertBefore(s.cloneNode(!0), n), !(s === o || !(s = s.nextSibling)); );
          else {
              Ws.innerHTML = r ? `<svg>${e}</svg>` : e;
              const l = Ws.content;
              if (r) {
                  const c = l.firstChild;
                  for (; c.firstChild; ) l.appendChild(c.firstChild);
                  l.removeChild(c);
              }
              t.insertBefore(l, n);
          }
          return [i ? i.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
      },
  };
function Ea(e, t, n) {
  const r = e._vtc;
  r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : (e.className = t);
}
function va(e, t, n) {
  const r = e.style,
      s = me(n);
  if (n && !s) {
      for (const o in n) Dr(r, o, n[o]);
      if (t && !me(t)) for (const o in t) n[o] == null && Dr(r, o, "");
  } else {
      const o = r.display;
      s ? t !== n && (r.cssText = n) : t && e.removeAttribute("style"), "_vod" in e && (r.display = o);
  }
}
const Gs = /\s*!important$/;
function Dr(e, t, n) {
  if (H(n)) n.forEach((r) => Dr(e, t, r));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
      const r = xa(e, t);
      Gs.test(n) ? e.setProperty(Jt(r), n.replace(Gs, ""), "important") : (e[r] = n);
  }
}
const Js = ["Webkit", "Moz", "ms"],
  mr = {};
function xa(e, t) {
  const n = mr[t];
  if (n) return n;
  let r = et(t);
  if (r !== "filter" && r in e) return (mr[t] = r);
  r = Qn(r);
  for (let s = 0; s < Js.length; s++) {
      const o = Js[s] + r;
      if (o in e) return (mr[t] = o);
  }
  return t;
}
const Qs = "http://www.w3.org/1999/xlink";
function Ra(e, t, n, r, s) {
  if (r && t.startsWith("xlink:")) n == null ? e.removeAttributeNS(Qs, t.slice(6, t.length)) : e.setAttributeNS(Qs, t, n);
  else {
      const o = Sl(t);
      n == null || (o && !No(n)) ? e.removeAttribute(t) : e.setAttribute(t, o ? "" : n);
  }
}
function Pa(e, t, n, r, s, o, i) {
  if (t === "innerHTML" || t === "textContent") {
      r && i(r, s, o), (e[t] = n ?? "");
      return;
  }
  if (t === "value" && e.tagName !== "PROGRESS" && !e.tagName.includes("-")) {
      e._value = n;
      const c = n ?? "";
      (e.value !== c || e.tagName === "OPTION") && (e.value = c), n == null && e.removeAttribute(t);
      return;
  }
  let l = !1;
  if (n === "" || n == null) {
      const c = typeof e[t];
      c === "boolean" ? (n = No(n)) : n == null && c === "string" ? ((n = ""), (l = !0)) : c === "number" && ((n = 0), (l = !0));
  }
  try {
      e[t] = n;
  } catch {}
  l && e.removeAttribute(t);
}
function Ca(e, t, n, r) {
  e.addEventListener(t, n, r);
}
function Oa(e, t, n, r) {
  e.removeEventListener(t, n, r);
}
function Aa(e, t, n, r, s = null) {
  const o = e._vei || (e._vei = {}),
      i = o[t];
  if (r && i) i.value = r;
  else {
      const [l, c] = Ta(t);
      if (r) {
          const a = (o[t] = Ia(r, s));
          Ca(e, l, a, c);
      } else i && (Oa(e, l, i, c), (o[t] = void 0));
  }
}
const Ys = /(?:Once|Passive|Capture)$/;
function Ta(e) {
  let t;
  if (Ys.test(e)) {
      t = {};
      let r;
      for (; (r = e.match(Ys)); ) (e = e.slice(0, e.length - r[0].length)), (t[r[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : Jt(e.slice(2)), t];
}
let gr = 0;
const Na = Promise.resolve(),
  ka = () => gr || (Na.then(() => (gr = 0)), (gr = Date.now()));
function Ia(e, t) {
  const n = (r) => {
      if (!r._vts) r._vts = Date.now();
      else if (r._vts <= n.attached) return;
      Be(Ma(r, n.value), t, 5, [r]);
  };
  return (n.value = e), (n.attached = ka()), n;
}
function Ma(e, t) {
  if (H(t)) {
      const n = e.stopImmediatePropagation;
      return (
          (e.stopImmediatePropagation = () => {
              n.call(e), (e._stopped = !0);
          }),
          t.map((r) => (s) => !s._stopped && r && r(s))
      );
  } else return t;
}
const Xs = /^on[a-z]/,
  Da = (e, t, n, r, s = !1, o, i, l, c) => {
      t === "class"
          ? Ea(e, r, s)
          : t === "style"
          ? va(e, n, r)
          : Wn(t)
          ? Vr(t) || Aa(e, t, n, r, i)
          : (t[0] === "." ? ((t = t.slice(1)), !0) : t[0] === "^" ? ((t = t.slice(1)), !1) : Fa(e, t, r, s))
          ? Pa(e, t, r, o, i, l, c)
          : (t === "true-value" ? (e._trueValue = r) : t === "false-value" && (e._falseValue = r), Ra(e, t, r, s));
  };
function Fa(e, t, n, r) {
  return r
      ? !!(t === "innerHTML" || t === "textContent" || (t in e && Xs.test(t) && z(n)))
      : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || (t === "list" && e.tagName === "INPUT") || (t === "type" && e.tagName === "TEXTAREA") || (Xs.test(t) && me(n))
      ? !1
      : t in e;
}
const Ba = {
  name: String,
  type: String,
  css: { type: Boolean, default: !0 },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String,
};
Oc.props;
const La = ve({ patchProp: Da }, Sa);
let Zs;
function $a() {
  return Zs || (Zs = ea(La));
}
const ja = (...e) => {
  const t = $a().createApp(...e),
      { mount: n } = t;
  return (
      (t.mount = (r) => {
          const s = Ua(r);
          if (!s) return;
          const o = t._component;
          !z(o) && !o.render && !o.template && (o.template = s.innerHTML), (s.innerHTML = "");
          const i = n(s, !1, s instanceof SVGElement);
          return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), i;
      }),
      t
  );
};
function Ua(e) {
  return me(e) ? document.querySelector(e) : e;
}
var Ha = !1;
/*!
* pinia v2.0.28
* (c) 2022 Eduardo San Martin Morote
* @license MIT
*/ let Ii;
const sr = (e) => (Ii = e),
  Mi = Symbol();
function Fr(e) {
  return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var an;
(function (e) {
  (e.direct = "direct"), (e.patchObject = "patch object"), (e.patchFunction = "patch function");
})(an || (an = {}));
function za() {
  const e = $o(!0),
      t = e.run(() => rs({}));
  let n = [],
      r = [];
  const s = Kt({
      install(o) {
          sr(s), (s._a = o), o.provide(Mi, s), (o.config.globalProperties.$pinia = s), r.forEach((i) => n.push(i)), (r = []);
      },
      use(o) {
          return !this._a && !Ha ? r.push(o) : n.push(o), this;
      },
      _p: n,
      _a: null,
      _e: e,
      _s: new Map(),
      state: t,
  });
  return s;
}
const Di = () => {};
function eo(e, t, n, r = Di) {
  e.push(t);
  const s = () => {
      const o = e.indexOf(t);
      o > -1 && (e.splice(o, 1), r());
  };
  return !n && Tl() && Nl(s), s;
}
function Mt(e, ...t) {
  e.slice().forEach((n) => {
      n(...t);
  });
}
function Br(e, t) {
  e instanceof Map && t instanceof Map && t.forEach((n, r) => e.set(r, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
  for (const n in t) {
      if (!t.hasOwnProperty(n)) continue;
      const r = t[n],
          s = e[n];
      Fr(s) && Fr(r) && e.hasOwnProperty(n) && !fe(r) && !_t(r) ? (e[n] = Br(s, r)) : (e[n] = r);
  }
  return e;
}
const Ka = Symbol();
function qa(e) {
  return !Fr(e) || !e.hasOwnProperty(Ka);
}
const { assign: pt } = Object;
function Va(e) {
  return !!(fe(e) && e.effect);
}
function Wa(e, t, n, r) {
  const { state: s, actions: o, getters: i } = t,
      l = n.state.value[e];
  let c;
  function a() {
      l || (n.state.value[e] = s ? s() : {});
      const u = lc(n.state.value[e]);
      return pt(
          u,
          o,
          Object.keys(i || {}).reduce(
              (h, p) => (
                  (h[p] = Kt(
                      ke(() => {
                          sr(n);
                          const g = n._s.get(e);
                          return i[p].call(g, g);
                      })
                  )),
                  h
              ),
              {}
          )
      );
  }
  return (
      (c = Fi(e, a, t, n, r, !0)),
      (c.$reset = function () {
          const h = s ? s() : {};
          this.$patch((p) => {
              pt(p, h);
          });
      }),
      c
  );
}
function Fi(e, t, n = {}, r, s, o) {
  let i;
  const l = pt({ actions: {} }, n),
      c = { deep: !0 };
  let a,
      u,
      h = Kt([]),
      p = Kt([]),
      g;
  const _ = r.state.value[e];
  !o && !_ && (r.state.value[e] = {}), rs({});
  let E;
  function M(q) {
      let N;
      (a = u = !1), typeof q == "function" ? (q(r.state.value[e]), (N = { type: an.patchFunction, storeId: e, events: g })) : (Br(r.state.value[e], q), (N = { type: an.patchObject, payload: q, storeId: e, events: g }));
      const X = (E = Symbol());
      os().then(() => {
          E === X && (a = !0);
      }),
          (u = !0),
          Mt(h, N, r.state.value[e]);
  }
  const O = Di;
  function F() {
      i.stop(), (h = []), (p = []), r._s.delete(e);
  }
  function k(q, N) {
      return function () {
          sr(r);
          const X = Array.from(arguments),
              Y = [],
              ue = [];
          function xe(he) {
              Y.push(he);
          }
          function be(he) {
              ue.push(he);
          }
          Mt(p, { args: X, name: q, store: W, after: xe, onError: be });
          let Ae;
          try {
              Ae = N.apply(this && this.$id === e ? this : W, X);
          } catch (he) {
              throw (Mt(ue, he), he);
          }
          return Ae instanceof Promise ? Ae.then((he) => (Mt(Y, he), he)).catch((he) => (Mt(ue, he), Promise.reject(he))) : (Mt(Y, Ae), Ae);
      };
  }
  const K = {
          _p: r,
          $id: e,
          $onAction: eo.bind(null, p),
          $patch: M,
          $reset: O,
          $subscribe(q, N = {}) {
              const X = eo(h, q, N.detached, () => Y()),
                  Y = i.run(() =>
                      on(
                          () => r.state.value[e],
                          (ue) => {
                              (N.flush === "sync" ? u : a) && q({ storeId: e, type: an.direct, events: g }, ue);
                          },
                          pt({}, c, N)
                      )
                  );
              return X;
          },
          $dispose: F,
      },
      W = Xt(K);
  r._s.set(e, W);
  const ae = r._e.run(() => ((i = $o()), i.run(() => t())));
  for (const q in ae) {
      const N = ae[q];
      if ((fe(N) && !Va(N)) || _t(N)) o || (_ && qa(N) && (fe(N) ? (N.value = _[q]) : Br(N, _[q])), (r.state.value[e][q] = N));
      else if (typeof N == "function") {
          const X = k(q, N);
          (ae[q] = X), (l.actions[q] = N);
      }
  }
  return (
      pt(W, ae),
      pt(Q(W), ae),
      Object.defineProperty(W, "$state", {
          get: () => r.state.value[e],
          set: (q) => {
              M((N) => {
                  pt(N, q);
              });
          },
      }),
      r._p.forEach((q) => {
          pt(
              W,
              i.run(() => q({ store: W, app: r._a, pinia: r, options: l }))
          );
      }),
      _ && o && n.hydrate && n.hydrate(W.$state, _),
      (a = !0),
      (u = !0),
      W
  );
}
function Ga(e, t, n) {
  let r, s;
  const o = typeof t == "function";
  typeof e == "string" ? ((r = e), (s = o ? n : t)) : ((s = e), (r = e.id));
  function i(l, c) {
      const a = Ai();
      return (l = l || (a && Ke(Mi, null))), l && sr(l), (l = Ii), l._s.has(r) || (o ? Fi(r, t, s, l) : Wa(r, s, l)), l._s.get(r);
  }
  return (i.$id = r), i;
}
function Bi(e, t) {
  return function () {
      return e.apply(t, arguments);
  };
}
const { toString: Li } = Object.prototype,
  { getPrototypeOf: ds } = Object,
  hs = ((e) => (t) => {
      const n = Li.call(t);
      return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
  })(Object.create(null)),
  lt = (e) => ((e = e.toLowerCase()), (t) => hs(t) === e),
  or = (e) => (t) => typeof t === e,
  { isArray: Zt } = Array,
  bn = or("undefined");
function Ja(e) {
  return e !== null && !bn(e) && e.constructor !== null && !bn(e.constructor) && At(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const $i = lt("ArrayBuffer");
function Qa(e) {
  let t;
  return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? (t = ArrayBuffer.isView(e)) : (t = e && e.buffer && $i(e.buffer)), t;
}
const Ya = or("string"),
  At = or("function"),
  ji = or("number"),
  ps = (e) => e !== null && typeof e == "object",
  Xa = (e) => e === !0 || e === !1,
  Bn = (e) => {
      if (hs(e) !== "object") return !1;
      const t = ds(e);
      return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
  },
  Za = lt("Date"),
  eu = lt("File"),
  tu = lt("Blob"),
  nu = lt("FileList"),
  ru = (e) => ps(e) && At(e.pipe),
  su = (e) => {
      const t = "[object FormData]";
      return e && ((typeof FormData == "function" && e instanceof FormData) || Li.call(e) === t || (At(e.toString) && e.toString() === t));
  },
  ou = lt("URLSearchParams"),
  iu = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
function En(e, t, { allOwnKeys: n = !1 } = {}) {
  if (e === null || typeof e > "u") return;
  let r, s;
  if ((typeof e != "object" && (e = [e]), Zt(e))) for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
  else {
      const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
          i = o.length;
      let l;
      for (r = 0; r < i; r++) (l = o[r]), t.call(null, e[l], l, e);
  }
}
function Ui(e, t) {
  t = t.toLowerCase();
  const n = Object.keys(e);
  let r = n.length,
      s;
  for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
  return null;
}
const Hi = typeof self > "u" ? (typeof global > "u" ? globalThis : global) : self,
  zi = (e) => !bn(e) && e !== Hi;
function Lr() {
  const { caseless: e } = (zi(this) && this) || {},
      t = {},
      n = (r, s) => {
          const o = (e && Ui(t, s)) || s;
          Bn(t[o]) && Bn(r) ? (t[o] = Lr(t[o], r)) : Bn(r) ? (t[o] = Lr({}, r)) : Zt(r) ? (t[o] = r.slice()) : (t[o] = r);
      };
  for (let r = 0, s = arguments.length; r < s; r++) arguments[r] && En(arguments[r], n);
  return t;
}
const lu = (e, t, n, { allOwnKeys: r } = {}) => (
      En(
          t,
          (s, o) => {
              n && At(s) ? (e[o] = Bi(s, n)) : (e[o] = s);
          },
          { allOwnKeys: r }
      ),
      e
  ),
  cu = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
  au = (e, t, n, r) => {
      (e.prototype = Object.create(t.prototype, r)), (e.prototype.constructor = e), Object.defineProperty(e, "super", { value: t.prototype }), n && Object.assign(e.prototype, n);
  },
  uu = (e, t, n, r) => {
      let s, o, i;
      const l = {};
      if (((t = t || {}), e == null)) return t;
      do {
          for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; ) (i = s[o]), (!r || r(i, e, t)) && !l[i] && ((t[i] = e[i]), (l[i] = !0));
          e = n !== !1 && ds(e);
      } while (e && (!n || n(e, t)) && e !== Object.prototype);
      return t;
  },
  fu = (e, t, n) => {
      (e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length);
      const r = e.indexOf(t, n);
      return r !== -1 && r === n;
  },
  du = (e) => {
      if (!e) return null;
      if (Zt(e)) return e;
      let t = e.length;
      if (!ji(t)) return null;
      const n = new Array(t);
      for (; t-- > 0; ) n[t] = e[t];
      return n;
  },
  hu = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && ds(Uint8Array)),
  pu = (e, t) => {
      const r = (e && e[Symbol.iterator]).call(e);
      let s;
      for (; (s = r.next()) && !s.done; ) {
          const o = s.value;
          t.call(e, o[0], o[1]);
      }
  },
  mu = (e, t) => {
      let n;
      const r = [];
      for (; (n = e.exec(t)) !== null; ) r.push(n);
      return r;
  },
  gu = lt("HTMLFormElement"),
  _u = (e) =>
      e.toLowerCase().replace(/[_-\s]([a-z\d])(\w*)/g, function (n, r, s) {
          return r.toUpperCase() + s;
      }),
  to = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype),
  yu = lt("RegExp"),
  Ki = (e, t) => {
      const n = Object.getOwnPropertyDescriptors(e),
          r = {};
      En(n, (s, o) => {
          t(s, o, e) !== !1 && (r[o] = s);
      }),
          Object.defineProperties(e, r);
  },
  bu = (e) => {
      Ki(e, (t, n) => {
          if (At(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1) return !1;
          const r = e[n];
          if (At(r)) {
              if (((t.enumerable = !1), "writable" in t)) {
                  t.writable = !1;
                  return;
              }
              t.set ||
                  (t.set = () => {
                      throw Error("Can not rewrite read-only method '" + n + "'");
                  });
          }
      });
  },
  wu = (e, t) => {
      const n = {},
          r = (s) => {
              s.forEach((o) => {
                  n[o] = !0;
              });
          };
      return Zt(e) ? r(e) : r(String(e).split(t)), n;
  },
  Su = () => {},
  Eu = (e, t) => ((e = +e), Number.isFinite(e) ? e : t),
  vu = (e) => {
      const t = new Array(10),
          n = (r, s) => {
              if (ps(r)) {
                  if (t.indexOf(r) >= 0) return;
                  if (!("toJSON" in r)) {
                      t[s] = r;
                      const o = Zt(r) ? [] : {};
                      return (
                          En(r, (i, l) => {
                              const c = n(i, s + 1);
                              !bn(c) && (o[l] = c);
                          }),
                          (t[s] = void 0),
                          o
                      );
                  }
              }
              return r;
          };
      return n(e, 0);
  },
  b = {
      isArray: Zt,
      isArrayBuffer: $i,
      isBuffer: Ja,
      isFormData: su,
      isArrayBufferView: Qa,
      isString: Ya,
      isNumber: ji,
      isBoolean: Xa,
      isObject: ps,
      isPlainObject: Bn,
      isUndefined: bn,
      isDate: Za,
      isFile: eu,
      isBlob: tu,
      isRegExp: yu,
      isFunction: At,
      isStream: ru,
      isURLSearchParams: ou,
      isTypedArray: hu,
      isFileList: nu,
      forEach: En,
      merge: Lr,
      extend: lu,
      trim: iu,
      stripBOM: cu,
      inherits: au,
      toFlatObject: uu,
      kindOf: hs,
      kindOfTest: lt,
      endsWith: fu,
      toArray: du,
      forEachEntry: pu,
      matchAll: mu,
      isHTMLForm: gu,
      hasOwnProperty: to,
      hasOwnProp: to,
      reduceDescriptors: Ki,
      freezeMethods: bu,
      toObjectSet: wu,
      toCamelCase: _u,
      noop: Su,
      toFiniteNumber: Eu,
      findKey: Ui,
      global: Hi,
      isContextDefined: zi,
      toJSONObject: vu,
  };
function J(e, t, n, r, s) {
  Error.call(this),
      Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : (this.stack = new Error().stack),
      (this.message = e),
      (this.name = "AxiosError"),
      t && (this.code = t),
      n && (this.config = n),
      r && (this.request = r),
      s && (this.response = s);
}
b.inherits(J, Error, {
  toJSON: function () {
      return {
          message: this.message,
          name: this.name,
          description: this.description,
          number: this.number,
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          config: b.toJSONObject(this.config),
          code: this.code,
          status: this.response && this.response.status ? this.response.status : null,
      };
  },
});
const qi = J.prototype,
  Vi = {};
["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach(
  (e) => {
      Vi[e] = { value: e };
  }
);
Object.defineProperties(J, Vi);
Object.defineProperty(qi, "isAxiosError", { value: !0 });
J.from = (e, t, n, r, s, o) => {
  const i = Object.create(qi);
  return (
      b.toFlatObject(
          e,
          i,
          function (c) {
              return c !== Error.prototype;
          },
          (l) => l !== "isAxiosError"
      ),
      J.call(i, e.message, t, n, r, s),
      (i.cause = e),
      (i.name = e.name),
      o && Object.assign(i, o),
      i
  );
};
function xu(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ru = typeof self == "object" ? self.FormData : window.FormData;
const Pu = Ru;
function $r(e) {
  return b.isPlainObject(e) || b.isArray(e);
}
function Wi(e) {
  return b.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function no(e, t, n) {
  return e
      ? e
            .concat(t)
            .map(function (s, o) {
                return (s = Wi(s)), !n && o ? "[" + s + "]" : s;
            })
            .join(n ? "." : "")
      : t;
}
function Cu(e) {
  return b.isArray(e) && !e.some($r);
}
const Ou = b.toFlatObject(b, {}, null, function (t) {
  return /^is[A-Z]/.test(t);
});
function Au(e) {
  return e && b.isFunction(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator];
}
function ir(e, t, n) {
  if (!b.isObject(e)) throw new TypeError("target must be an object");
  (t = t || new (Pu || FormData)()),
      (n = b.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (E, M) {
          return !b.isUndefined(M[E]);
      }));
  const r = n.metaTokens,
      s = n.visitor || u,
      o = n.dots,
      i = n.indexes,
      c = (n.Blob || (typeof Blob < "u" && Blob)) && Au(t);
  if (!b.isFunction(s)) throw new TypeError("visitor must be a function");
  function a(_) {
      if (_ === null) return "";
      if (b.isDate(_)) return _.toISOString();
      if (!c && b.isBlob(_)) throw new J("Blob is not supported. Use a Buffer instead.");
      return b.isArrayBuffer(_) || b.isTypedArray(_) ? (c && typeof Blob == "function" ? new Blob([_]) : Buffer.from(_)) : _;
  }
  function u(_, E, M) {
      let O = _;
      if (_ && !M && typeof _ == "object") {
          if (b.endsWith(E, "{}")) (E = r ? E : E.slice(0, -2)), (_ = JSON.stringify(_));
          else if ((b.isArray(_) && Cu(_)) || b.isFileList(_) || (b.endsWith(E, "[]") && (O = b.toArray(_))))
              return (
                  (E = Wi(E)),
                  O.forEach(function (k, K) {
                      !(b.isUndefined(k) || k === null) && t.append(i === !0 ? no([E], K, o) : i === null ? E : E + "[]", a(k));
                  }),
                  !1
              );
      }
      return $r(_) ? !0 : (t.append(no(M, E, o), a(_)), !1);
  }
  const h = [],
      p = Object.assign(Ou, { defaultVisitor: u, convertValue: a, isVisitable: $r });
  function g(_, E) {
      if (!b.isUndefined(_)) {
          if (h.indexOf(_) !== -1) throw Error("Circular reference detected in " + E.join("."));
          h.push(_),
              b.forEach(_, function (O, F) {
                  (!(b.isUndefined(O) || O === null) && s.call(t, O, b.isString(F) ? F.trim() : F, E, p)) === !0 && g(O, E ? E.concat(F) : [F]);
              }),
              h.pop();
      }
  }
  if (!b.isObject(e)) throw new TypeError("data must be an object");
  return g(e), t;
}
function ro(e) {
  const t = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0" };
  return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
      return t[r];
  });
}
function ms(e, t) {
  (this._pairs = []), e && ir(e, this, t);
}
const Gi = ms.prototype;
Gi.append = function (t, n) {
  this._pairs.push([t, n]);
};
Gi.toString = function (t) {
  const n = t
      ? function (r) {
            return t.call(this, r, ro);
        }
      : ro;
  return this._pairs
      .map(function (s) {
          return n(s[0]) + "=" + n(s[1]);
      }, "")
      .join("&");
};
function Tu(e) {
  return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Ji(e, t, n) {
  if (!t) return e;
  const r = (n && n.encode) || Tu,
      s = n && n.serialize;
  let o;
  if ((s ? (o = s(t, n)) : (o = b.isURLSearchParams(t) ? t.toString() : new ms(t, n).toString(r)), o)) {
      const i = e.indexOf("#");
      i !== -1 && (e = e.slice(0, i)), (e += (e.indexOf("?") === -1 ? "?" : "&") + o);
  }
  return e;
}
class Nu {
  constructor() {
      this.handlers = [];
  }
  use(t, n, r) {
      return this.handlers.push({ fulfilled: t, rejected: n, synchronous: r ? r.synchronous : !1, runWhen: r ? r.runWhen : null }), this.handlers.length - 1;
  }
  eject(t) {
      this.handlers[t] && (this.handlers[t] = null);
  }
  clear() {
      this.handlers && (this.handlers = []);
  }
  forEach(t) {
      b.forEach(this.handlers, function (r) {
          r !== null && t(r);
      });
  }
}
const so = Nu,
  Qi = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
  ku = typeof URLSearchParams < "u" ? URLSearchParams : ms,
  Iu = FormData,
  Mu = (() => {
      let e;
      return typeof navigator < "u" && ((e = navigator.product) === "ReactNative" || e === "NativeScript" || e === "NS") ? !1 : typeof window < "u" && typeof document < "u";
  })(),
  Du = (() => typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function")(),
  Ze = { isBrowser: !0, classes: { URLSearchParams: ku, FormData: Iu, Blob }, isStandardBrowserEnv: Mu, isStandardBrowserWebWorkerEnv: Du, protocols: ["http", "https", "file", "blob", "url", "data"] };
function Fu(e, t) {
  return ir(
      e,
      new Ze.classes.URLSearchParams(),
      Object.assign(
          {
              visitor: function (n, r, s, o) {
                  return Ze.isNode && b.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
              },
          },
          t
      )
  );
}
function Bu(e) {
  return b.matchAll(/\w+|\[(\w*)]/g, e).map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function Lu(e) {
  const t = {},
      n = Object.keys(e);
  let r;
  const s = n.length;
  let o;
  for (r = 0; r < s; r++) (o = n[r]), (t[o] = e[o]);
  return t;
}
function Yi(e) {
  function t(n, r, s, o) {
      let i = n[o++];
      const l = Number.isFinite(+i),
          c = o >= n.length;
      return (i = !i && b.isArray(s) ? s.length : i), c ? (b.hasOwnProp(s, i) ? (s[i] = [s[i], r]) : (s[i] = r), !l) : ((!s[i] || !b.isObject(s[i])) && (s[i] = []), t(n, r, s[i], o) && b.isArray(s[i]) && (s[i] = Lu(s[i])), !l);
  }
  if (b.isFormData(e) && b.isFunction(e.entries)) {
      const n = {};
      return (
          b.forEachEntry(e, (r, s) => {
              t(Bu(r), s, n, 0);
          }),
          n
      );
  }
  return null;
}
const $u = { "Content-Type": void 0 };
function ju(e, t, n) {
  if (b.isString(e))
      try {
          return (t || JSON.parse)(e), b.trim(e);
      } catch (r) {
          if (r.name !== "SyntaxError") throw r;
      }
  return (n || JSON.stringify)(e);
}
const lr = {
  transitional: Qi,
  adapter: ["xhr", "http"],
  transformRequest: [
      function (t, n) {
          const r = n.getContentType() || "",
              s = r.indexOf("application/json") > -1,
              o = b.isObject(t);
          if ((o && b.isHTMLForm(t) && (t = new FormData(t)), b.isFormData(t))) return s && s ? JSON.stringify(Yi(t)) : t;
          if (b.isArrayBuffer(t) || b.isBuffer(t) || b.isStream(t) || b.isFile(t) || b.isBlob(t)) return t;
          if (b.isArrayBufferView(t)) return t.buffer;
          if (b.isURLSearchParams(t)) return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
          let l;
          if (o) {
              if (r.indexOf("application/x-www-form-urlencoded") > -1) return Fu(t, this.formSerializer).toString();
              if ((l = b.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
                  const c = this.env && this.env.FormData;
                  return ir(l ? { "files[]": t } : t, c && new c(), this.formSerializer);
              }
          }
          return o || s ? (n.setContentType("application/json", !1), ju(t)) : t;
      },
  ],
  transformResponse: [
      function (t) {
          const n = this.transitional || lr.transitional,
              r = n && n.forcedJSONParsing,
              s = this.responseType === "json";
          if (t && b.isString(t) && ((r && !this.responseType) || s)) {
              const i = !(n && n.silentJSONParsing) && s;
              try {
                  return JSON.parse(t);
              } catch (l) {
                  if (i) throw l.name === "SyntaxError" ? J.from(l, J.ERR_BAD_RESPONSE, this, null, this.response) : l;
              }
          }
          return t;
      },
  ],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: { FormData: Ze.classes.FormData, Blob: Ze.classes.Blob },
  validateStatus: function (t) {
      return t >= 200 && t < 300;
  },
  headers: { common: { Accept: "application/json, text/plain, */*" } },
};
b.forEach(["delete", "get", "head"], function (t) {
  lr.headers[t] = {};
});
b.forEach(["post", "put", "patch"], function (t) {
  lr.headers[t] = b.merge($u);
});
const gs = lr,
  Uu = b.toObjectSet([
      "age",
      "authorization",
      "content-length",
      "content-type",
      "etag",
      "expires",
      "from",
      "host",
      "if-modified-since",
      "if-unmodified-since",
      "last-modified",
      "location",
      "max-forwards",
      "proxy-authorization",
      "referer",
      "retry-after",
      "user-agent",
  ]),
  Hu = (e) => {
      const t = {};
      let n, r, s;
      return (
          e &&
              e
                  .split(
                      `
`
                  )
                  .forEach(function (i) {
                      (s = i.indexOf(":")),
                          (n = i.substring(0, s).trim().toLowerCase()),
                          (r = i.substring(s + 1).trim()),
                          !(!n || (t[n] && Uu[n])) && (n === "set-cookie" ? (t[n] ? t[n].push(r) : (t[n] = [r])) : (t[n] = t[n] ? t[n] + ", " + r : r));
                  }),
          t
      );
  },
  oo = Symbol("internals");
function nn(e) {
  return e && String(e).trim().toLowerCase();
}
function Ln(e) {
  return e === !1 || e == null ? e : b.isArray(e) ? e.map(Ln) : String(e);
}
function zu(e) {
  const t = Object.create(null),
      n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let r;
  for (; (r = n.exec(e)); ) t[r[1]] = r[2];
  return t;
}
function Ku(e) {
  return /^[-_a-zA-Z]+$/.test(e.trim());
}
function io(e, t, n, r) {
  if (b.isFunction(r)) return r.call(this, t, n);
  if (b.isString(t)) {
      if (b.isString(r)) return t.indexOf(r) !== -1;
      if (b.isRegExp(r)) return r.test(t);
  }
}
function qu(e) {
  return e
      .trim()
      .toLowerCase()
      .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function Vu(e, t) {
  const n = b.toCamelCase(" " + t);
  ["get", "set", "has"].forEach((r) => {
      Object.defineProperty(e, r + n, {
          value: function (s, o, i) {
              return this[r].call(this, t, s, o, i);
          },
          configurable: !0,
      });
  });
}
class cr {
  constructor(t) {
      t && this.set(t);
  }
  set(t, n, r) {
      const s = this;
      function o(l, c, a) {
          const u = nn(c);
          if (!u) throw new Error("header name must be a non-empty string");
          const h = b.findKey(s, u);
          (!h || s[h] === void 0 || a === !0 || (a === void 0 && s[h] !== !1)) && (s[h || c] = Ln(l));
      }
      const i = (l, c) => b.forEach(l, (a, u) => o(a, u, c));
      return b.isPlainObject(t) || t instanceof this.constructor ? i(t, n) : b.isString(t) && (t = t.trim()) && !Ku(t) ? i(Hu(t), n) : t != null && o(n, t, r), this;
  }
  get(t, n) {
      if (((t = nn(t)), t)) {
          const r = b.findKey(this, t);
          if (r) {
              const s = this[r];
              if (!n) return s;
              if (n === !0) return zu(s);
              if (b.isFunction(n)) return n.call(this, s, r);
              if (b.isRegExp(n)) return n.exec(s);
              throw new TypeError("parser must be boolean|regexp|function");
          }
      }
  }
  has(t, n) {
      if (((t = nn(t)), t)) {
          const r = b.findKey(this, t);
          return !!(r && (!n || io(this, this[r], r, n)));
      }
      return !1;
  }
  delete(t, n) {
      const r = this;
      let s = !1;
      function o(i) {
          if (((i = nn(i)), i)) {
              const l = b.findKey(r, i);
              l && (!n || io(r, r[l], l, n)) && (delete r[l], (s = !0));
          }
      }
      return b.isArray(t) ? t.forEach(o) : o(t), s;
  }
  clear() {
      return Object.keys(this).forEach(this.delete.bind(this));
  }
  normalize(t) {
      const n = this,
          r = {};
      return (
          b.forEach(this, (s, o) => {
              const i = b.findKey(r, o);
              if (i) {
                  (n[i] = Ln(s)), delete n[o];
                  return;
              }
              const l = t ? qu(o) : String(o).trim();
              l !== o && delete n[o], (n[l] = Ln(s)), (r[l] = !0);
          }),
          this
      );
  }
  concat(...t) {
      return this.constructor.concat(this, ...t);
  }
  toJSON(t) {
      const n = Object.create(null);
      return (
          b.forEach(this, (r, s) => {
              r != null && r !== !1 && (n[s] = t && b.isArray(r) ? r.join(", ") : r);
          }),
          n
      );
  }
  [Symbol.iterator]() {
      return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
      return Object.entries(this.toJSON()).map(([t, n]) => t + ": " + n).join(`
`);
  }
  get [Symbol.toStringTag]() {
      return "AxiosHeaders";
  }
  static from(t) {
      return t instanceof this ? t : new this(t);
  }
  static concat(t, ...n) {
      const r = new this(t);
      return n.forEach((s) => r.set(s)), r;
  }
  static accessor(t) {
      const r = (this[oo] = this[oo] = { accessors: {} }).accessors,
          s = this.prototype;
      function o(i) {
          const l = nn(i);
          r[l] || (Vu(s, i), (r[l] = !0));
      }
      return b.isArray(t) ? t.forEach(o) : o(t), this;
  }
}
cr.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent"]);
b.freezeMethods(cr.prototype);
b.freezeMethods(cr);
const st = cr;
function _r(e, t) {
  const n = this || gs,
      r = t || n,
      s = st.from(r.headers);
  let o = r.data;
  return (
      b.forEach(e, function (l) {
          o = l.call(n, o, s.normalize(), t ? t.status : void 0);
      }),
      s.normalize(),
      o
  );
}
function Xi(e) {
  return !!(e && e.__CANCEL__);
}
function vn(e, t, n) {
  J.call(this, e ?? "canceled", J.ERR_CANCELED, t, n), (this.name = "CanceledError");
}
b.inherits(vn, J, { __CANCEL__: !0 });
const Wu = null;
function Gu(e, t, n) {
  const r = n.config.validateStatus;
  !n.status || !r || r(n.status) ? e(n) : t(new J("Request failed with status code " + n.status, [J.ERR_BAD_REQUEST, J.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4], n.config, n.request, n));
}
const Ju = Ze.isStandardBrowserEnv
  ? (function () {
        return {
            write: function (n, r, s, o, i, l) {
                const c = [];
                c.push(n + "=" + encodeURIComponent(r)),
                    b.isNumber(s) && c.push("expires=" + new Date(s).toGMTString()),
                    b.isString(o) && c.push("path=" + o),
                    b.isString(i) && c.push("domain=" + i),
                    l === !0 && c.push("secure"),
                    (document.cookie = c.join("; "));
            },
            read: function (n) {
                const r = document.cookie.match(new RegExp("(^|;\\s*)(" + n + ")=([^;]*)"));
                return r ? decodeURIComponent(r[3]) : null;
            },
            remove: function (n) {
                this.write(n, "", Date.now() - 864e5);
            },
        };
    })()
  : (function () {
        return {
            write: function () {},
            read: function () {
                return null;
            },
            remove: function () {},
        };
    })();
function Qu(e) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Yu(e, t) {
  return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Zi(e, t) {
  return e && !Qu(t) ? Yu(e, t) : t;
}
const Xu = Ze.isStandardBrowserEnv
  ? (function () {
        const t = /(msie|trident)/i.test(navigator.userAgent),
            n = document.createElement("a");
        let r;
        function s(o) {
            let i = o;
            return (
                t && (n.setAttribute("href", i), (i = n.href)),
                n.setAttribute("href", i),
                {
                    href: n.href,
                    protocol: n.protocol ? n.protocol.replace(/:$/, "") : "",
                    host: n.host,
                    search: n.search ? n.search.replace(/^\?/, "") : "",
                    hash: n.hash ? n.hash.replace(/^#/, "") : "",
                    hostname: n.hostname,
                    port: n.port,
                    pathname: n.pathname.charAt(0) === "/" ? n.pathname : "/" + n.pathname,
                }
            );
        }
        return (
            (r = s(window.location.href)),
            function (i) {
                const l = b.isString(i) ? s(i) : i;
                return l.protocol === r.protocol && l.host === r.host;
            }
        );
    })()
  : (function () {
        return function () {
            return !0;
        };
    })();
function Zu(e) {
  const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
  return (t && t[1]) || "";
}
function ef(e, t) {
  e = e || 10;
  const n = new Array(e),
      r = new Array(e);
  let s = 0,
      o = 0,
      i;
  return (
      (t = t !== void 0 ? t : 1e3),
      function (c) {
          const a = Date.now(),
              u = r[o];
          i || (i = a), (n[s] = c), (r[s] = a);
          let h = o,
              p = 0;
          for (; h !== s; ) (p += n[h++]), (h = h % e);
          if (((s = (s + 1) % e), s === o && (o = (o + 1) % e), a - i < t)) return;
          const g = u && a - u;
          return g ? Math.round((p * 1e3) / g) : void 0;
      }
  );
}
function lo(e, t) {
  let n = 0;
  const r = ef(50, 250);
  return (s) => {
      const o = s.loaded,
          i = s.lengthComputable ? s.total : void 0,
          l = o - n,
          c = r(l),
          a = o <= i;
      n = o;
      const u = { loaded: o, total: i, progress: i ? o / i : void 0, bytes: l, rate: c || void 0, estimated: c && i && a ? (i - o) / c : void 0, event: s };
      (u[t ? "download" : "upload"] = !0), e(u);
  };
}
const tf = typeof XMLHttpRequest < "u",
  nf =
      tf &&
      function (e) {
          return new Promise(function (n, r) {
              let s = e.data;
              const o = st.from(e.headers).normalize(),
                  i = e.responseType;
              let l;
              function c() {
                  e.cancelToken && e.cancelToken.unsubscribe(l), e.signal && e.signal.removeEventListener("abort", l);
              }
              b.isFormData(s) && (Ze.isStandardBrowserEnv || Ze.isStandardBrowserWebWorkerEnv) && o.setContentType(!1);
              let a = new XMLHttpRequest();
              if (e.auth) {
                  const g = e.auth.username || "",
                      _ = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
                  o.set("Authorization", "Basic " + btoa(g + ":" + _));
              }
              const u = Zi(e.baseURL, e.url);
              a.open(e.method.toUpperCase(), Ji(u, e.params, e.paramsSerializer), !0), (a.timeout = e.timeout);
              function h() {
                  if (!a) return;
                  const g = st.from("getAllResponseHeaders" in a && a.getAllResponseHeaders()),
                      E = { data: !i || i === "text" || i === "json" ? a.responseText : a.response, status: a.status, statusText: a.statusText, headers: g, config: e, request: a };
                  Gu(
                      function (O) {
                          n(O), c();
                      },
                      function (O) {
                          r(O), c();
                      },
                      E
                  ),
                      (a = null);
              }
              if (
                  ("onloadend" in a
                      ? (a.onloadend = h)
                      : (a.onreadystatechange = function () {
                            !a || a.readyState !== 4 || (a.status === 0 && !(a.responseURL && a.responseURL.indexOf("file:") === 0)) || setTimeout(h);
                        }),
                  (a.onabort = function () {
                      a && (r(new J("Request aborted", J.ECONNABORTED, e, a)), (a = null));
                  }),
                  (a.onerror = function () {
                      r(new J("Network Error", J.ERR_NETWORK, e, a)), (a = null);
                  }),
                  (a.ontimeout = function () {
                      let _ = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
                      const E = e.transitional || Qi;
                      e.timeoutErrorMessage && (_ = e.timeoutErrorMessage), r(new J(_, E.clarifyTimeoutError ? J.ETIMEDOUT : J.ECONNABORTED, e, a)), (a = null);
                  }),
                  Ze.isStandardBrowserEnv)
              ) {
                  const g = (e.withCredentials || Xu(u)) && e.xsrfCookieName && Ju.read(e.xsrfCookieName);
                  g && o.set(e.xsrfHeaderName, g);
              }
              s === void 0 && o.setContentType(null),
                  "setRequestHeader" in a &&
                      b.forEach(o.toJSON(), function (_, E) {
                          a.setRequestHeader(E, _);
                      }),
                  b.isUndefined(e.withCredentials) || (a.withCredentials = !!e.withCredentials),
                  i && i !== "json" && (a.responseType = e.responseType),
                  typeof e.onDownloadProgress == "function" && a.addEventListener("progress", lo(e.onDownloadProgress, !0)),
                  typeof e.onUploadProgress == "function" && a.upload && a.upload.addEventListener("progress", lo(e.onUploadProgress)),
                  (e.cancelToken || e.signal) &&
                      ((l = (g) => {
                          a && (r(!g || g.type ? new vn(null, e, a) : g), a.abort(), (a = null));
                      }),
                      e.cancelToken && e.cancelToken.subscribe(l),
                      e.signal && (e.signal.aborted ? l() : e.signal.addEventListener("abort", l)));
              const p = Zu(u);
              if (p && Ze.protocols.indexOf(p) === -1) {
                  r(new J("Unsupported protocol " + p + ":", J.ERR_BAD_REQUEST, e));
                  return;
              }
              a.send(s || null);
          });
      },
  $n = { http: Wu, xhr: nf };
b.forEach($n, (e, t) => {
  if (e) {
      try {
          Object.defineProperty(e, "name", { value: t });
      } catch {}
      Object.defineProperty(e, "adapterName", { value: t });
  }
});
const rf = {
  getAdapter: (e) => {
      e = b.isArray(e) ? e : [e];
      const { length: t } = e;
      let n, r;
      for (let s = 0; s < t && ((n = e[s]), !(r = b.isString(n) ? $n[n.toLowerCase()] : n)); s++);
      if (!r) throw r === !1 ? new J(`Adapter ${n} is not supported by the environment`, "ERR_NOT_SUPPORT") : new Error(b.hasOwnProp($n, n) ? `Adapter '${n}' is not available in the build` : `Unknown adapter '${n}'`);
      if (!b.isFunction(r)) throw new TypeError("adapter is not a function");
      return r;
  },
  adapters: $n,
};
function yr(e) {
  if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)) throw new vn(null, e);
}
function co(e) {
  return (
      yr(e),
      (e.headers = st.from(e.headers)),
      (e.data = _r.call(e, e.transformRequest)),
      ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1),
      rf
          .getAdapter(e.adapter || gs.adapter)(e)
          .then(
              function (r) {
                  return yr(e), (r.data = _r.call(e, e.transformResponse, r)), (r.headers = st.from(r.headers)), r;
              },
              function (r) {
                  return Xi(r) || (yr(e), r && r.response && ((r.response.data = _r.call(e, e.transformResponse, r.response)), (r.response.headers = st.from(r.response.headers)))), Promise.reject(r);
              }
          )
  );
}
const ao = (e) => (e instanceof st ? e.toJSON() : e);
function Vt(e, t) {
  t = t || {};
  const n = {};
  function r(a, u, h) {
      return b.isPlainObject(a) && b.isPlainObject(u) ? b.merge.call({ caseless: h }, a, u) : b.isPlainObject(u) ? b.merge({}, u) : b.isArray(u) ? u.slice() : u;
  }
  function s(a, u, h) {
      if (b.isUndefined(u)) {
          if (!b.isUndefined(a)) return r(void 0, a, h);
      } else return r(a, u, h);
  }
  function o(a, u) {
      if (!b.isUndefined(u)) return r(void 0, u);
  }
  function i(a, u) {
      if (b.isUndefined(u)) {
          if (!b.isUndefined(a)) return r(void 0, a);
      } else return r(void 0, u);
  }
  function l(a, u, h) {
      if (h in t) return r(a, u);
      if (h in e) return r(void 0, a);
  }
  const c = {
      url: o,
      method: o,
      data: o,
      baseURL: i,
      transformRequest: i,
      transformResponse: i,
      paramsSerializer: i,
      timeout: i,
      timeoutMessage: i,
      withCredentials: i,
      adapter: i,
      responseType: i,
      xsrfCookieName: i,
      xsrfHeaderName: i,
      onUploadProgress: i,
      onDownloadProgress: i,
      decompress: i,
      maxContentLength: i,
      maxBodyLength: i,
      beforeRedirect: i,
      transport: i,
      httpAgent: i,
      httpsAgent: i,
      cancelToken: i,
      socketPath: i,
      responseEncoding: i,
      validateStatus: l,
      headers: (a, u) => s(ao(a), ao(u), !0),
  };
  return (
      b.forEach(Object.keys(e).concat(Object.keys(t)), function (u) {
          const h = c[u] || s,
              p = h(e[u], t[u], u);
          (b.isUndefined(p) && h !== l) || (n[u] = p);
      }),
      n
  );
}
const el = "1.2.1",
  _s = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
  _s[e] = function (r) {
      return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
  };
});
const uo = {};
_s.transitional = function (t, n, r) {
  function s(o, i) {
      return "[Axios v" + el + "] Transitional option '" + o + "'" + i + (r ? ". " + r : "");
  }
  return (o, i, l) => {
      if (t === !1) throw new J(s(i, " has been removed" + (n ? " in " + n : "")), J.ERR_DEPRECATED);
      return n && !uo[i] && ((uo[i] = !0), console.warn(s(i, " has been deprecated since v" + n + " and will be removed in the near future"))), t ? t(o, i, l) : !0;
  };
};
function sf(e, t, n) {
  if (typeof e != "object") throw new J("options must be an object", J.ERR_BAD_OPTION_VALUE);
  const r = Object.keys(e);
  let s = r.length;
  for (; s-- > 0; ) {
      const o = r[s],
          i = t[o];
      if (i) {
          const l = e[o],
              c = l === void 0 || i(l, o, e);
          if (c !== !0) throw new J("option " + o + " must be " + c, J.ERR_BAD_OPTION_VALUE);
          continue;
      }
      if (n !== !0) throw new J("Unknown option " + o, J.ERR_BAD_OPTION);
  }
}
const jr = { assertOptions: sf, validators: _s },
  ut = jr.validators;
class qn {
  constructor(t) {
      (this.defaults = t), (this.interceptors = { request: new so(), response: new so() });
  }
  request(t, n) {
      typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}), (n = Vt(this.defaults, n));
      const { transitional: r, paramsSerializer: s, headers: o } = n;
      r !== void 0 && jr.assertOptions(r, { silentJSONParsing: ut.transitional(ut.boolean), forcedJSONParsing: ut.transitional(ut.boolean), clarifyTimeoutError: ut.transitional(ut.boolean) }, !1),
          s !== void 0 && jr.assertOptions(s, { encode: ut.function, serialize: ut.function }, !0),
          (n.method = (n.method || this.defaults.method || "get").toLowerCase());
      let i;
      (i = o && b.merge(o.common, o[n.method])),
          i &&
              b.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (_) => {
                  delete o[_];
              }),
          (n.headers = st.concat(i, o));
      const l = [];
      let c = !0;
      this.interceptors.request.forEach(function (E) {
          (typeof E.runWhen == "function" && E.runWhen(n) === !1) || ((c = c && E.synchronous), l.unshift(E.fulfilled, E.rejected));
      });
      const a = [];
      this.interceptors.response.forEach(function (E) {
          a.push(E.fulfilled, E.rejected);
      });
      let u,
          h = 0,
          p;
      if (!c) {
          const _ = [co.bind(this), void 0];
          for (_.unshift.apply(_, l), _.push.apply(_, a), p = _.length, u = Promise.resolve(n); h < p; ) u = u.then(_[h++], _[h++]);
          return u;
      }
      p = l.length;
      let g = n;
      for (h = 0; h < p; ) {
          const _ = l[h++],
              E = l[h++];
          try {
              g = _(g);
          } catch (M) {
              E.call(this, M);
              break;
          }
      }
      try {
          u = co.call(this, g);
      } catch (_) {
          return Promise.reject(_);
      }
      for (h = 0, p = a.length; h < p; ) u = u.then(a[h++], a[h++]);
      return u;
  }
  getUri(t) {
      t = Vt(this.defaults, t);
      const n = Zi(t.baseURL, t.url);
      return Ji(n, t.params, t.paramsSerializer);
  }
}
b.forEach(["delete", "get", "head", "options"], function (t) {
  qn.prototype[t] = function (n, r) {
      return this.request(Vt(r || {}, { method: t, url: n, data: (r || {}).data }));
  };
});
b.forEach(["post", "put", "patch"], function (t) {
  function n(r) {
      return function (o, i, l) {
          return this.request(Vt(l || {}, { method: t, headers: r ? { "Content-Type": "multipart/form-data" } : {}, url: o, data: i }));
      };
  }
  (qn.prototype[t] = n()), (qn.prototype[t + "Form"] = n(!0));
});
const jn = qn;
class ys {
  constructor(t) {
      if (typeof t != "function") throw new TypeError("executor must be a function.");
      let n;
      this.promise = new Promise(function (o) {
          n = o;
      });
      const r = this;
      this.promise.then((s) => {
          if (!r._listeners) return;
          let o = r._listeners.length;
          for (; o-- > 0; ) r._listeners[o](s);
          r._listeners = null;
      }),
          (this.promise.then = (s) => {
              let o;
              const i = new Promise((l) => {
                  r.subscribe(l), (o = l);
              }).then(s);
              return (
                  (i.cancel = function () {
                      r.unsubscribe(o);
                  }),
                  i
              );
          }),
          t(function (o, i, l) {
              r.reason || ((r.reason = new vn(o, i, l)), n(r.reason));
          });
  }
  throwIfRequested() {
      if (this.reason) throw this.reason;
  }
  subscribe(t) {
      if (this.reason) {
          t(this.reason);
          return;
      }
      this._listeners ? this._listeners.push(t) : (this._listeners = [t]);
  }
  unsubscribe(t) {
      if (!this._listeners) return;
      const n = this._listeners.indexOf(t);
      n !== -1 && this._listeners.splice(n, 1);
  }
  static source() {
      let t;
      return {
          token: new ys(function (s) {
              t = s;
          }),
          cancel: t,
      };
  }
}
const of = ys;
function lf(e) {
  return function (n) {
      return e.apply(null, n);
  };
}
function cf(e) {
  return b.isObject(e) && e.isAxiosError === !0;
}
function tl(e) {
  const t = new jn(e),
      n = Bi(jn.prototype.request, t);
  return (
      b.extend(n, jn.prototype, t, { allOwnKeys: !0 }),
      b.extend(n, t, null, { allOwnKeys: !0 }),
      (n.create = function (s) {
          return tl(Vt(e, s));
      }),
      n
  );
}
const ye = tl(gs);
ye.Axios = jn;
ye.CanceledError = vn;
ye.CancelToken = of;
ye.isCancel = Xi;
ye.VERSION = el;
ye.toFormData = ir;
ye.AxiosError = J;
ye.Cancel = ye.CanceledError;
ye.all = function (t) {
  return Promise.all(t);
};
ye.spread = lf;
ye.isAxiosError = cf;
ye.mergeConfig = Vt;
ye.AxiosHeaders = st;
ye.formToJSON = (e) => Yi(b.isHTMLForm(e) ? new FormData(e) : e);
ye.default = ye;
const fo = ye,
  ho = {
      async post(e, t, n) {
          var r = null,
              s = null,
              o = localStorage.getItem("token"),
              i = o ? { Authorization: `Bearer ${o}` } : {};
          try {
              const l = await fo.post(e, t, { headers: i, ...n });
              (r = l.status), (s = l.data);
          } catch (l) {
              if (!l.response) throw l;
              (r = l.response.status), (s = l.response.data);
          }
          return { status: r, data: s };
      },
      async get(e, t) {
          var n = null,
              r = null,
              s = localStorage.getItem("token"),
              o = s ? { Authorization: `Bearer ${s}` } : {};
          try {
              const i = await fo.get(e, { headers: o, ...t });
              (n = i.status), (r = i.data);
          } catch (i) {
              if (!i.response) throw i;
              (n = i.response.status), (r = i.response.data);
          }
          return { status: n, data: r };
      },
  };
var Ur = {},
  af = {
      get exports() {
          return Ur;
      },
      set exports(e) {
          Ur = e;
      },
  },
  nl = {};
function Le(e, t) {
  typeof t == "boolean" && (t = { forever: t }),
      (this._originalTimeouts = JSON.parse(JSON.stringify(e))),
      (this._timeouts = e),
      (this._options = t || {}),
      (this._maxRetryTime = (t && t.maxRetryTime) || 1 / 0),
      (this._fn = null),
      (this._errors = []),
      (this._attempts = 1),
      (this._operationTimeout = null),
      (this._operationTimeoutCb = null),
      (this._timeout = null),
      (this._operationStart = null),
      (this._timer = null),
      this._options.forever && (this._cachedTimeouts = this._timeouts.slice(0));
}
var uf = Le;
Le.prototype.reset = function () {
  (this._attempts = 1), (this._timeouts = this._originalTimeouts.slice(0));
};
Le.prototype.stop = function () {
  this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), (this._timeouts = []), (this._cachedTimeouts = null);
};
Le.prototype.retry = function (e) {
  if ((this._timeout && clearTimeout(this._timeout), !e)) return !1;
  var t = new Date().getTime();
  if (e && t - this._operationStart >= this._maxRetryTime) return this._errors.push(e), this._errors.unshift(new Error("RetryOperation timeout occurred")), !1;
  this._errors.push(e);
  var n = this._timeouts.shift();
  if (n === void 0)
      if (this._cachedTimeouts) this._errors.splice(0, this._errors.length - 1), (n = this._cachedTimeouts.slice(-1));
      else return !1;
  var r = this;
  return (
      (this._timer = setTimeout(function () {
          r._attempts++,
              r._operationTimeoutCb &&
                  ((r._timeout = setTimeout(function () {
                      r._operationTimeoutCb(r._attempts);
                  }, r._operationTimeout)),
                  r._options.unref && r._timeout.unref()),
              r._fn(r._attempts);
      }, n)),
      this._options.unref && this._timer.unref(),
      !0
  );
};
Le.prototype.attempt = function (e, t) {
  (this._fn = e), t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
  var n = this;
  this._operationTimeoutCb &&
      (this._timeout = setTimeout(function () {
          n._operationTimeoutCb();
      }, n._operationTimeout)),
      (this._operationStart = new Date().getTime()),
      this._fn(this._attempts);
};
Le.prototype.try = function (e) {
  // console.log("Using RetryOperation.try() is deprecated"), this.attempt(e);
};
Le.prototype.start = function (e) {
  // console.log("Using RetryOperation.start() is deprecated"), this.attempt(e);
};
Le.prototype.start = Le.prototype.try;
Le.prototype.errors = function () {
  return this._errors;
};
Le.prototype.attempts = function () {
  return this._attempts;
};
Le.prototype.mainError = function () {
  if (this._errors.length === 0) return null;
  for (var e = {}, t = null, n = 0, r = 0; r < this._errors.length; r++) {
      var s = this._errors[r],
          o = s.message,
          i = (e[o] || 0) + 1;
      (e[o] = i), i >= n && ((t = s), (n = i));
  }
  return t;
};
(function (e) {
  var t = uf;
  (e.operation = function (n) {
      var r = e.timeouts(n);
      return new t(r, { forever: n && (n.forever || n.retries === 1 / 0), unref: n && n.unref, maxRetryTime: n && n.maxRetryTime });
  }),
      (e.timeouts = function (n) {
          if (n instanceof Array) return [].concat(n);
          var r = { retries: 10, factor: 2, minTimeout: 1 * 1e3, maxTimeout: 1 / 0, randomize: !1 };
          for (var s in n) r[s] = n[s];
          if (r.minTimeout > r.maxTimeout) throw new Error("minTimeout is greater than maxTimeout");
          for (var o = [], i = 0; i < r.retries; i++) o.push(this.createTimeout(i, r));
          return (
              n && n.forever && !o.length && o.push(this.createTimeout(i, r)),
              o.sort(function (l, c) {
                  return l - c;
              }),
              o
          );
      }),
      (e.createTimeout = function (n, r) {
          var s = r.randomize ? Math.random() + 1 : 1,
              o = Math.round(s * Math.max(r.minTimeout, 1) * Math.pow(r.factor, n));
          return (o = Math.min(o, r.maxTimeout)), o;
      }),
      (e.wrap = function (n, r, s) {
          if ((r instanceof Array && ((s = r), (r = null)), !s)) {
              s = [];
              for (var o in n) typeof n[o] == "function" && s.push(o);
          }
          for (var i = 0; i < s.length; i++) {
              var l = s[i],
                  c = n[l];
              (n[l] = function (u) {
                  var h = e.operation(r),
                      p = Array.prototype.slice.call(arguments, 1),
                      g = p.pop();
                  p.push(function (_) {
                      h.retry(_) || (_ && (arguments[0] = h.mainError()), g.apply(this, arguments));
                  }),
                      h.attempt(function () {
                          u.apply(n, p);
                      });
              }.bind(n, c)),
                  (n[l].options = r);
          }
      });
})(nl);

(function (e) {
  e.exports = nl;
})(af);
const po = xu(Ur),
  ff = 5e3;
  function rl(e) {
    return {
        async fetchResultByGameNumber(t) {
            // logAction('1-fetchResultByGameNumber');
            const n = po.operation({ retries: 1, minTimeout: 2e3, maxTimeout: 2e3 });
            return new Promise((r, s) => {
                n.attempt(async (o) => {
                    try {
                        const i = await ho.get(`${e}/number?gameNumber=${t}`, { timeout: ff });
                        if (i.status === 200) r(i);
                        else throw new Error(i);
                    } catch (i) {
                        if (n.retry(i)) return;
                        s(i);
                    }
                });
            });
        },

        async fetchOpenGame() {
            // logAction('1-fetchOpenGame');
            const t = po.operation({ retries: 100, minTimeout: 1e3, maxTimeout: 6e4, randomize: !0 });
            return new Promise((n, r) => {
                t.attempt(async (s) => {
                    try {
                        const o = await ho.get(`${e}/open`, { timeout: 5e3 });
                        // const o = await ho.get(`${e}/game/open`, { timeout: 5e3 });
                        if (o.status === 200) n(o);
                        else throw new Error(o);
                    } catch (o) {
                        if (t.retry(o)) return;
                        r(o);
                    }
                    // logAction('2-fetchOpenGame');
                });
            });
        },
    };
}
let Nn = rl("");
function logAction(actionName) {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp}: Action '${actionName}' executed.`);
}
const dt = { countdown: "countdown", draw: "draw", shuffle: "shuffle", results: "results", initial: "initial" },
    Dt = { none: "none", heads: "heads", tails: "tails", evens: "evens" },
    en = Ga("game", {
        state: () => ({
            initializing: !0,
            openGameId: null,
            openGameNumber: null,
            previousGameNumber: null,
            recentResults: [],
            drawnPicks: [],
            specialPick: Dt.none,
            headsCount: 0,
            tailsCount: 0,
            showScreen: dt.initial,
            countdownMinutes: 0,
            drawSeconds: 10,
            nextDrawRemainingMinutes: "00",
            nextDrawRemainingSeconds: "00",
            nextDrawRemainingTotalSeconds: 0,
            animateDrawBall: !1,
            animatingBallNumber: 0,
            shuffleVideoRef: null,
            drawStarted: !1,
            promoSlide: 14,
            baseUrl: "",
            showInfo: !1,
        }),
        actions: {
            async reInitializeGame() {
                // logAction('1-reInitializeGame');
                (this.openGameNumber = this.openGameNumber + 1), (this.showScreen = dt.countdown), (this.drawStarted = !1);
                // logAction('2-reInitializeGame');
            },
            async initializeGame(e, t='https://mayabet2.pythonanywhere.com/') {
                // logAction('1-initializeGame-1');
                e=4;
                (this.countdownMinutes = e), (this.baseUrl = t), (Nn = rl('https://mayabet2.pythonanywhere.com/api/keno'));
                const n = await Nn.fetchOpenGame();
                (this.openGameId = n.data.openGame.id),
                //             t = 'http://127.0.0.1:8000/';
                //             Nn = rl('http://127.0.0.1:8000/api/keno');//rl(this.baseUrl);//

                    (this.openGameNumber = n.data.openGame.gameNumber),
                    (this.drawnPicks = n.data.result.map((r) => r.value)),
                    (this.previousGameNumber = n.data.lastGame.gameNumber),
                    this.updateSpecialPick(),
                    (this.recentResults = n.data.recent),
                    (this.initializing = !1),
                    (this.showScreen = dt.countdown),
                    (this.drawStarted = !1);
                    // logAction('2-initializeGame');
            },
            updateSpecialPick() {
                (this.headsCount = this.drawnPicks.filter((e) => e <= 40).length),
                    (this.tailsCount = this.drawnPicks.filter((e) => e > 40).length),
                    this.headsCount == 0 && this.tailsCount == 0
                        ? (this.specialPick = Dt.none)
                        : this.headsCount > this.tailsCount
                        ? (this.specialPick = Dt.heads)
                        : this.headsCount < this.tailsCount
                        ? (this.specialPick = Dt.tails)
                        : (this.specialPick = Dt.evens);
            },
            startBallAnimation() {
                this.animateDrawBall = !0;
            },
            stopBallAnimation() {
                this.animateDrawBall = !1;
            },
            async update() {
                if ((this.updateGameCountdown(), this.nextDrawRemainingTotalSeconds == this.countdownMinutes * 60 - 1)) {
                    if (!this.drawStarted) {
                        this.drawStarted = !0;
                        let e = Nn.fetchResultByGameNumber(this.openGameNumber);
                        setTimeout(() => this.awaitGameResults(e), 3e3);
                    }
                }
                else {
                    this.nextDrawRemainingTotalSeconds == this.countdownMinutes * 60 - this.drawSeconds && ((this.showScreen = dt.countdown), (this.drawStarted = !1));
                }
            },
            updateGameCountdown() {
                var e = new Date(),
                    t = e.getMinutes(),
                    n = e.getSeconds();
                (this.nextDrawRemainingMinutes = this.countdownMinutes - (t % this.countdownMinutes)),
                    (this.nextDrawRemainingSeconds = (60 - n) % 60),
                    this.nextDrawRemainingSeconds != 0 && this.nextDrawRemainingMinutes--,
                    (this.nextDrawRemainingTotalSeconds = this.nextDrawRemainingMinutes * 60 + this.nextDrawRemainingSeconds),
                    this.nextDrawRemainingMinutes < 10 && (this.nextDrawRemainingMinutes = "0" + this.nextDrawRemainingMinutes),
                    this.nextDrawRemainingSeconds < 10 && (this.nextDrawRemainingSeconds = "0" + this.nextDrawRemainingSeconds),
                    this.nextDrawRemainingTotalSeconds == this.countdownMinutes * 60 && ((this.nextDrawRemainingMinutes = "00"), (this.nextDrawRemainingSeconds = "00"));
            },
            startDraw() {
                // logAction('1-startDraw');
                this.startShuffleAnimation(), setTimeout(this.fetchGameResults, 100);
                // logAction('2-startDraw');
            },
            startShuffleAnimation(e) {
                // logAction('1-startShuffleAnimation');
                (this.showScreen = dt.shuffle), this.shuffleVideoRef.play(), setTimeout(() => this.startDrawAnimation(e), 4200);
                // logAction('2-startShuffleAnimation');
            },
            async awaitGameResults(e) {
                // logAction('1-awaitGameResults');
                // console.log('e -', e);
                try {
                    // logAction('try-awaitGameResults');
                    e = await e;
                } catch {
                    // logAction('catch-awaitGameResults');
                    this.reInitializeGame(), await this.syncOpenGame();
                    // console.log('e -', e);

                    return;
                }
                // logAction('2-awaitGameResults');
                syncBog = e;
                e.data.game.gameNumber == e.data.recent[0].gameNumber
                    ? ((this.openGameId = e.data.openGame.id),
                      (this.openGameNumber = e.data.openGame.gameNumber),
                      (this.previousGameNumber = e.data.game.gameNumber),
                      (this.recentResults = e.data.recent),
                      this.startShuffleAnimation(e.data.result.map((t) => t.value)))
                    : e.data.game.gameNumber < e.data.recent[0].gameNumber
                    ? ((this.openGameId = e.data.openGame.id),
                      (this.openGameNumber = e.data.openGame.gameNumber),
                      (this.previousGameNumber = e.data.recent[0].gameNumber),
                      (this.recentResults = e.data.recent),
                      this.startShuffleAnimation(e.data.recent[0].results.map((t) => t.value)))
                    : (this.reInitializeGame(), await this.syncOpenGame());
                    // logAction('3-awaitGameResults');
                // console.log('syncBog -', syncBog);

            },
            startDrawAnimation(e) {
                // logAction('1-startDrawAnimation');
                (this.drawnPicks = []), // Clearing drawnPicks array
                this.updateSpecialPick(),
                setTimeout(() => {
                    this.showScreen = dt.draw;
                }, 2e3);
                let t = 0;
                const n = setInterval(async () => {
                    // logAction('interval-start');
                    if (t == e.length) {
                        clearInterval(n),
                        setTimeout(() => {
                            // logAction('showResults-called');
                            this.showResults(); // Show the results screen
                            this.drawnPicks = e; // Update drawnPicks with the fetched results
                        }, 2e3),
                        this.stopBallAnimation(), // Stop the ball animation
                        await this.syncOpenGame(); // Fetch the open game details
                        // logAction('interval-end');
                        // console.log('syncBog -', syncBog);
                        return;
                    }
                    this.stopBallAnimation(), // Stop the ball animation
                    (this.animatingBallNumber = e[t]), // Set the animating ball number
                    setTimeout(this.drawABall, 100), // Draw the ball after a short delay
                    t++;
                }, 2500);
            },
            drawABall() {
                this.startBallAnimation(),
                    setTimeout(() => {
                        this.drawnPicks.push(this.animatingBallNumber), this.updateSpecialPick();
                    }, 400);
                },
                showResults() {
                    // logAction('1-showResults');
                    this.showScreen = dt.results;
                    setTimeout(() => {
                        this.showScreen = dt.countdown; // Replace dt.countdown with the screen you want to transition to
                        // logAction('2-showResults');
                    }, 10000); // 10000 milliseconds = 10 seconds
                },

            async syncOpenGame() {
                // logAction('1-syncOpenGame');
                // // console.log('syncBog -- ', syncBog);

                try {
                    (this.openGameId = syncBog.data.openGame.id), (this.openGameNumber = syncBog.data.openGame.gameNumber);
                } catch (error) {
                    // console.error('An error occurred during syncOpenGame:', error);
                }
                // logAction('2-syncOpenGame');
            },

        },
    }),
  df = "/static/great/images/keno.png",
  We = (e, t) => {
      const n = e.__vccOpts || e;
      for (const [r, s] of t) n[r] = s;
      return n;
  },
  hf = {
      setup() {
          return { gameStore: en(), spcialPickValue: Dt };
      },
  },
  pf = { id: "left-container" },
  mf = { id: "left-top" },
  gf = j("span", { class: "draw-text gold-black-text shadow-text" }, "DRAW ", -1),
  _f = { class: "draw-number-text" },
  yf = { key: 0, style: { "margin-top": "1rem" }, class: "heads yellow-special-gradient-bg" },
  bf = { key: 1, style: { "margin-top": "1rem" }, class: "heads white-special-gradient-bg" },
  wf = { key: 2, style: { "margin-top": "1rem" }, class: "heads special-place-holder" },
  Sf = { id: "left-center" },
  Ef = { class: "number-row" },
  vf = { class: "number-text" },
  xf = { id: "left-bottom" },
  Rf = j("span", null, [j("img", { src: df, style: { height: "4.3rem" } })], -1),
  Pf = { key: 0, class: "heads orange-special-gradient-bg" },
  Cf = { key: 1, class: "heads white-special-gradient-bg" },
  Of = { key: 2, class: "heads special-place-holder" };
function Af(e, t, n, r, s, o) {
  return (
      $(),
      ne("div", pf, [
          j("div", mf, [
              gf,
              Sn("   "),
              j("span", _f, Ie(r.gameStore.previousGameNumber), 1),
              r.gameStore.specialPick == r.spcialPickValue.heads ? ($(), ne("span", yf)) : se("", !0),
              r.gameStore.specialPick == r.spcialPickValue.evens ? ($(), ne("span", bf)) : se("", !0),
              r.gameStore.specialPick != r.spcialPickValue.evens && r.gameStore.specialPick != r.spcialPickValue.heads ? ($(), ne("span", wf)) : se("", !0),
          ]),
          j("div", Sf, [
              ($(),
              ne(
                  Pe,
                  null,
                  gn([0, 10, 20, 30, 40, 50, 60, 70], (i) =>
                      j("div", Ef, [
                          ($(),
                          ne(
                              Pe,
                              null,
                              gn([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (l) =>
                                  j(
                                      "span",
                                      {
                                          ref_for: !0,
                                          ref: "{{row + col}}",
                                          class: Tt([r.gameStore.drawnPicks.includes(i + l) ? "number-selected" : "number-unselected number-unselected-bg", i + l > 40 ? "orange-gradient-bg" : "yellow-gradient-bg"]),
                                      },
                                      [j("span", vf, Ie(i + l), 1)],
                                      2
                                  )
                              ),
                              64
                          )),
                      ])
                  ),
                  64
              )),
          ]),
          j("div", xf, [
              Rf,
              r.gameStore.specialPick == r.spcialPickValue.tails ? ($(), ne("span", Pf)) : se("", !0),
              r.gameStore.specialPick == r.spcialPickValue.evens ? ($(), ne("span", Cf)) : se("", !0),
              r.gameStore.specialPick != r.spcialPickValue.evens && r.gameStore.specialPick != r.spcialPickValue.tails ? ($(), ne("span", Of)) : se("", !0),
          ]),
      ])
  );
}
const sl = We(hf, [["render", Af]]),
  Tf = { props: { pick: Number, pays: Array } },
  Nf = { class: "pick-text" },
  kf = { id: "hit-win-table-container" },
  If = j("div", { class: "hit-win-table-head squash" }, [j("p", null, "HITS"), j("p", null, "WIN")], -1),
  Mf = { class: "hit-win-table-value squash" },
  Df = { style: { width: "9rem", "text-align": "left" } };
function Ff(e, t, n, r, s, o) {
  return (
      $(),
      ne("div", null, [
          j("div", Nf, "Pick " + Ie(n.pick), 1),
          j("div", kf, [
              If,
              ($(!0),
              ne(
                  Pe,
                  null,
                  gn(n.pays, (i) => ($(), ne("div", Mf, [j("p", null, Ie(i[0]), 1), j("p", Df, Ie(i[1]), 1)]))),
                  256
              )),
          ]),
      ])
  );
}
const Bf = We(Tf, [["render", Ff]]);
const Lf = {},
  $f = { id: "promo-special-a-container" },
  jf = j("p", null, [j("span", { class: "red-text" }, "20"), Sn(" balls")], -1),
  Uf = j("p", { style: { "margin-top": "-3.8rem" } }, "drawn", -1),
  Hf = j("p", { style: { "margin-top": "-3.8rem" } }, [Sn("from "), j("span", { class: "red-text" }, "80")], -1),
  zf = [jf, Uf, Hf];
function Kf(e, t) {
  return $(), ne("div", $f, zf);
}
const qf = We(Lf, [["render", Kf]]);
const Vf = {},
  Wf = { id: "promo-special-b-container" },
  Gf = as(
      '<div class="squash">Play</div><div><span class="squash">The</span> <span class="red-text" style="font-family:&#39;good-times-rg&#39;;font-size:4rem;">PICK 10</span> <span class="squash">Game</span></div><div class="squash" style="margin-top:3rem;">Get <span class="red-text">10</span> numbers</div><div class="squash">correct, <span style="margin-left:0.2rem;">and</span></div><div class="squash">win the</div><div style="margin-top:2rem;"><span class="red-text" style="font-family:&#39;good-times-rg&#39;;font-size:4rem;">PICK 10</span> <span class="squash">JACKPOT</span></div>',
      6
  ),
  Jf = [Gf];
function Qf(e, t) {
  return $(), ne("div", Wf, Jf);
}
const Yf = We(Vf, [["render", Qf]]);
const Xf = {},
  Zf = { id: "promo-special-c-container" },
  ed = as(
      '<div class="red-text" style="font-family:&#39;good-times-rg&#39;;">pick 3</div><div style="font-family:&#39;good-times-rg&#39;;">TO</div><div class="red-text" style="font-family:&#39;good-times-rg&#39;;">pick 10</div><div class="squash">games have</div><div style="font-family:&#39;good-times-rg&#39;;color:yellow;">MULTIPLE</div><div style="font-family:&#39;good-times-rg&#39;;color:yellow;">PAY LEVELS</div><div class="squash">on other spots.</div>',
      7
  ),
  td = [ed];
function nd(e, t) {
  return $(), ne("div", Zf, td);
}
const rd = We(Xf, [["render", nd]]);
const sd = {},
  od = { id: "promo-special-a-container" },
  id = as('<p>Pick <span class="red-text">1</span> To <span class="red-text">10</span></p><p style="margin-top:-3.8rem;">numbers</p><p style="margin-top:-3.8rem;">from <span class="red-text">80</span></p>', 3),
  ld = [id];
function cd(e, t) {
  return $(), ne("div", od, ld);
}
const ad = We(sd, [["render", cd]]),
  ud = {
      setup() {
          return { gameStore: en() };
      },
      components: { Pick: sl, Promo: Bf, PromoSpecialA: qf, PromoSpecialB: Yf, PromoSpecialC: rd, PromoSpecialD: ad },
  },
  fd = { id: "main-container" },
  dd = { id: "right-container", class: "black-red-gradient-bg" },
  hd = { id: "right-top" },
  pd = j("span", { class: "draw-text gold-black-text shadow-text" }, "DRAW ", -1),
  md = { class: "draw-number-text" },
  gd = { style: { "margin-top": "1.8rem", "margin-left": "1.8rem" } },
  _d = { key: 1, class: "bets-closed count-down-text shadow-text" },
  yd = { style: { position: "absolute", top: "16.5rem" } };
function bd(e, t, n, r, s, o) {
  const i = je("Pick"),
      l = je("Promo"),
      c = je("PromoSpecialD"),
      a = je("PromoSpecialA"),
      u = je("PromoSpecialB"),
      h = je("PromoSpecialC");
  return (
      $(),
      ne("div", fd, [
          Ee(i),
          j("div", dd, [
              j("div", hd, [pd, Sn("   "), j("span", md, Ie(r.gameStore.openGameNumber), 1)]),
              j("div", gd, [
                  r.gameStore.drawStarted
                      ? se("", !0)
                      : ($(),
                        ne(
                            "div",
                            { key: 0, class: Tt(["count-down count-down-text shadow-text", [r.gameStore.nextDrawRemainingTotalSeconds < 10 ? "blink-animation" : ""]]) },
                            Ie(r.gameStore.nextDrawRemainingMinutes) + ":" + Ie(r.gameStore.nextDrawRemainingSeconds),
                            3
                        )),
                  r.gameStore.drawStarted ? ($(), ne("div", _d, " BETS CLOSED ")) : se("", !0),
                  j("div", yd, [
                      r.gameStore.promoSlide == 10
                          ? ($(),
                            pe(l, {
                                key: 0,
                                pick: 10,
                                pays: [
                                    [10, "5,000"],
                                    [9, "2,500"],
                                    [8, 400],
                                    [7, 40],
                                    [6, 12],
                                    [5, 4],
                                    [4, 2],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 9
                          ? ($(),
                            pe(l, {
                                key: 1,
                                pick: 9,
                                pays: [
                                    [9, "4,200"],
                                    [8, "1,800"],
                                    [7, 120],
                                    [6, 18],
                                    [5, 6],
                                    [4, 3],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 8
                          ? ($(),
                            pe(l, {
                                key: 2,
                                pick: 8,
                                pays: [
                                    [8, "3,000"],
                                    [7, 600],
                                    [6, 68],
                                    [5, 8],
                                    [4, 4],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 7
                          ? ($(),
                            pe(l, {
                                key: 3,
                                pick: 7,
                                pays: [
                                    [7, "2,150"],
                                    [6, 120],
                                    [5, 12],
                                    [4, 6],
                                    [3, 1],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 6
                          ? ($(),
                            pe(l, {
                                key: 4,
                                pick: 6,
                                pays: [
                                    [6, "1,800"],
                                    [5, 70],
                                    [4, 10],
                                    [3, 1],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 5
                          ? ($(),
                            pe(l, {
                                key: 5,
                                pick: 5,
                                pays: [
                                    [5, 900],
                                    [4, 15],
                                    [3, 3],
                                    [2, 1],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 4
                          ? ($(),
                            pe(l, {
                                key: 6,
                                pick: 4,
                                pays: [
                                    [4, 110],
                                    [3, 20],
                                    [2, 1],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 3
                          ? ($(),
                            pe(l, {
                                key: 7,
                                pick: 3,
                                pays: [
                                    [3, 50],
                                    [2, 5],
                                ],
                            }))
                          : se("", !0),
                      r.gameStore.promoSlide == 2 ? ($(), pe(l, { key: 8, pick: 2, pays: [[1, 1] ,[2, 25]] })) : se("", !0),
                      r.gameStore.promoSlide == 1 ? ($(), pe(l, { key: 9, pick: 1, pays: [[1, "4"]] }, null, 8, ["pays"])) : se("", !0),
                      r.gameStore.promoSlide == 14 ? ($(), pe(c, { key: 10 })) : se("", !0),
                      r.gameStore.promoSlide == 13 ? ($(), pe(a, { key: 11 })) : se("", !0),
                      r.gameStore.promoSlide == 12 ? ($(), pe(u, { key: 12 })) : se("", !0),
                      r.gameStore.promoSlide == 11 ? ($(), pe(h, { key: 13 })) : se("", !0),
                  ]),
              ]),
          ]),
      ])
  );
}
const wd = We(ud, [["render", bd]]),
  Sd = "/static/great/images/pipet.png",
  Ed = "/static/great/images/pipe.png";
const vd = {
      setup() {
          return { gameStore: en() };
      },
      components: { Pick: sl },
  },
  xd = { id: "main-container" },
  Rd = { id: "right-container" },
  Pd = { id: "draw-counter" },
  Cd = { style: { "margin-top": "1rem" } },
  Od = j("span", { style: { "margin-top": "-2rem", "margin-left": "2.8rem" } }, "/", -1),
  Ad = j("span", { style: { "margin-top": "-1.5rem", "margin-left": "4.2rem" } }, "20", -1),
  Td = j("img", { class: "pipe-image-transparent", src: Sd }, null, -1),
  Nd = j("img", { class: "pipe-image", src: Ed }, null, -1),
  kd = ["src"];
function Id(e, t, n, r, s, o) {
  const i = je("Pick");
  return (
      $(),
      ne("div", xd, [
          Ee(i),
          j("div", Rd, [
              j("div", Pd, [j("span", Cd, Ie(r.gameStore.drawnPicks.length), 1), Od, Ad]),
              Td,
              Nd,
              j("img", { class: Tt([r.gameStore.animateDrawBall ? "animate-draw-ball ball-image" : "ball-image"]), src: `/static/great/images/balls/${r.gameStore.animatingBallNumber}.png` }, null, 10, kd),
          ]),
      ])
  );
}
const Md = We(vd, [["render", Id]]);
const Dd = {
      setup() {
          return { gameStore: en() };
      },
  },
  Fd = { id: "result-container" },
  Bd = { class: "game-id" },
  Ld = { class: "number-row" },
  $d = { key: 0, class: "divider" };
function jd(e, t, n, r, s, o) {
  return (
      $(),
      ne("div", Fd, [
          ($(!0),
          ne(
              Pe,
              null,
              gn(
                  r.gameStore.recentResults,
                  (i, l) => (
                      $(),
                      ne(
                          "div",
                          { class: "result-number-row", style: Ht([l === 9 ? "border-bottom: .2rem solid rgba(255, 255, 255, 0.2);" : ""]) },
                          [
                              j("p", Bd, Ie(i.gameNumber), 1),
                              ($(!0),
                              ne(
                                  Pe,
                                  null,
                                  gn(
                                      i.results.sort((c, a) => c.value - a.value),
                                      (c, a) => (
                                          $(),
                                          ne("span", Ld, [
                                              j(
                                                  "span",
                                                  { style: Ht([a === 9 ? "position:relative; top: -1.2rem; margin-right: 0.2rem;" : ""]), class: Tt(["result-number", [c.value > 40 ? "brown-result" : "yellow-result"]]) },
                                                  Ie(c.value),
                                                  7
                                              ),
                                              a === 9 ? ($(), ne("span", $d)) : se("", !0),
                                          ])
                                      )
                                  ),
                                  256
                              )),
                          ],
                          4
                      )
                  )
              ),
              256
          )),
      ])
  );
}
const Ud = We(Dd, [["render", jd]]);
const Hd = {
      setup() {
          return { gameStore: en() };
      },
  },
  zd = { id: "init-container" };
function Kd(e, t, n, r, s, o) {
  return $(), ne("div", zd);
}
const qd = We(Hd, [["render", Kd]]);
/*!
* vue-router v4.2.1
* (c) 2023 Eduardo San Martin Morote
* @license MIT
*/ const Ft = typeof window < "u";
function Vd(e) {
  return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const te = Object.assign;
function br(e, t) {
  const n = {};
  for (const r in t) {
      const s = t[r];
      n[r] = Ve(s) ? s.map(e) : e(s);
  }
  return n;
}
const un = () => {},
  Ve = Array.isArray,
  Wd = /\/$/,
  Gd = (e) => e.replace(Wd, "");
function wr(e, t, n = "/") {
  let r,
      s = {},
      o = "",
      i = "";
  const l = t.indexOf("#");
  let c = t.indexOf("?");
  return (
      l < c && l >= 0 && (c = -1),
      c > -1 && ((r = t.slice(0, c)), (o = t.slice(c + 1, l > -1 ? l : t.length)), (s = e(o))),
      l > -1 && ((r = r || t.slice(0, l)), (i = t.slice(l, t.length))),
      (r = Xd(r ?? t, n)),
      { fullPath: r + (o && "?") + o + i, path: r, query: s, hash: i }
  );
}
function Jd(e, t) {
  const n = t.query ? e(t.query) : "";
  return t.path + (n && "?") + n + (t.hash || "");
}
function mo(e, t) {
  return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function Qd(e, t, n) {
  const r = t.matched.length - 1,
      s = n.matched.length - 1;
  return r > -1 && r === s && Wt(t.matched[r], n.matched[s]) && ol(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function Wt(e, t) {
  return (e.aliasOf || e) === (t.aliasOf || t);
}
function ol(e, t) {
  if (Object.keys(e).length !== Object.keys(t).length) return !1;
  for (const n in e) if (!Yd(e[n], t[n])) return !1;
  return !0;
}
function Yd(e, t) {
  return Ve(e) ? go(e, t) : Ve(t) ? go(t, e) : e === t;
}
function go(e, t) {
  return Ve(t) ? e.length === t.length && e.every((n, r) => n === t[r]) : e.length === 1 && e[0] === t;
}
function Xd(e, t) {
  if (e.startsWith("/")) return e;
  if (!e) return t;
  const n = t.split("/"),
      r = e.split("/"),
      s = r[r.length - 1];
  (s === ".." || s === ".") && r.push("");
  let o = n.length - 1,
      i,
      l;
  for (i = 0; i < r.length; i++)
      if (((l = r[i]), l !== "."))
          if (l === "..") o > 1 && o--;
          else break;
  return n.slice(0, o).join("/") + "/" + r.slice(i - (i === r.length ? 1 : 0)).join("/");
}
var wn;
(function (e) {
  (e.pop = "pop"), (e.push = "push");
})(wn || (wn = {}));
var fn;
(function (e) {
  (e.back = "back"), (e.forward = "forward"), (e.unknown = "");
})(fn || (fn = {}));
function Zd(e) {
  if (!e)
      if (Ft) {
          const t = document.querySelector("base");
          (e = (t && t.getAttribute("href")) || "/"), (e = e.replace(/^\w+:\/\/[^\/]+/, ""));
      } else e = "/";
  return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), Gd(e);
}
const eh = /^[^#]+#/;
function th(e, t) {
  return e.replace(eh, "#") + t;
}
function nh(e, t) {
  const n = document.documentElement.getBoundingClientRect(),
      r = e.getBoundingClientRect();
  return { behavior: t.behavior, left: r.left - n.left - (t.left || 0), top: r.top - n.top - (t.top || 0) };
}
const ar = () => ({ left: window.pageXOffset, top: window.pageYOffset });
function rh(e) {
  let t;
  if ("el" in e) {
      const n = e.el,
          r = typeof n == "string" && n.startsWith("#"),
          s = typeof n == "string" ? (r ? document.getElementById(n.slice(1)) : document.querySelector(n)) : n;
      if (!s) return;
      t = nh(s, e);
  } else t = e;
  "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function _o(e, t) {
  return (history.state ? history.state.position - t : -1) + e;
}
const Hr = new Map();
function sh(e, t) {
  Hr.set(e, t);
}
function oh(e) {
  const t = Hr.get(e);
  return Hr.delete(e), t;
}
let ih = () => location.protocol + "//" + location.host;
function il(e, t) {
  const { pathname: n, search: r, hash: s } = t,
      o = e.indexOf("#");
  if (o > -1) {
      let l = s.includes(e.slice(o)) ? e.slice(o).length : 1,
          c = s.slice(l);
      return c[0] !== "/" && (c = "/" + c), mo(c, "");
  }
  return mo(n, e) + r + s;
}
function lh(e, t, n, r) {
  let s = [],
      o = [],
      i = null;
  const l = ({ state: p }) => {
      const g = il(e, location),
          _ = n.value,
          E = t.value;
      let M = 0;
      if (p) {
          if (((n.value = g), (t.value = p), i && i === _)) {
              i = null;
              return;
          }
          M = E ? p.position - E.position : 0;
      } else r(g);
      s.forEach((O) => {
          O(n.value, _, { delta: M, type: wn.pop, direction: M ? (M > 0 ? fn.forward : fn.back) : fn.unknown });
      });
  };
  function c() {
      i = n.value;
  }
  function a(p) {
      s.push(p);
      const g = () => {
          const _ = s.indexOf(p);
          _ > -1 && s.splice(_, 1);
      };
      return o.push(g), g;
  }
  function u() {
      const { history: p } = window;
      p.state && p.replaceState(te({}, p.state, { scroll: ar() }), "");
  }
  function h() {
      for (const p of o) p();
      (o = []), window.removeEventListener("popstate", l), window.removeEventListener("beforeunload", u);
  }
  return window.addEventListener("popstate", l), window.addEventListener("beforeunload", u, { passive: !0 }), { pauseListeners: c, listen: a, destroy: h };
}
function yo(e, t, n, r = !1, s = !1) {
  return { back: e, current: t, forward: n, replaced: r, position: window.history.length, scroll: s ? ar() : null };
}
function ch(e) {
  const { history: t, location: n } = window,
      r = { value: il(e, n) },
      s = { value: t.state };
  s.value || o(r.value, { back: null, current: r.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0);
  function o(c, a, u) {
      const h = e.indexOf("#"),
          p = h > -1 ? (n.host && document.querySelector("base") ? e : e.slice(h)) + c : ih() + e + c;
      try {
          t[u ? "replaceState" : "pushState"](a, "", p), (s.value = a);
      } catch (g) {
          console.error(g), n[u ? "replace" : "assign"](p);
      }
  }
  function i(c, a) {
      const u = te({}, t.state, yo(s.value.back, c, s.value.forward, !0), a, { position: s.value.position });
      o(c, u, !0), (r.value = c);
  }
  function l(c, a) {
      const u = te({}, s.value, t.state, { forward: c, scroll: ar() });
      o(u.current, u, !0);
      const h = te({}, yo(r.value, c, null), { position: u.position + 1 }, a);
      o(c, h, !1), (r.value = c);
  }
  return { location: r, state: s, push: l, replace: i };
}
function ah(e) {
  e = Zd(e);
  const t = ch(e),
      n = lh(e, t.state, t.location, t.replace);
  function r(o, i = !0) {
      i || n.pauseListeners(), history.go(o);
  }
  const s = te({ location: "", base: e, go: r, createHref: th.bind(null, e) }, t, n);
  return Object.defineProperty(s, "location", { enumerable: !0, get: () => t.location.value }), Object.defineProperty(s, "state", { enumerable: !0, get: () => t.state.value }), s;
}
function uh(e) {
  return (e = location.host ? e || location.pathname + location.search : ""), e.includes("#") || (e += "#"), ah(e);
}
function fh(e) {
  return typeof e == "string" || (e && typeof e == "object");
}
function ll(e) {
  return typeof e == "string" || typeof e == "symbol";
}
const ft = { path: "/", name: void 0, params: {}, query: {}, hash: "", fullPath: "/", matched: [], meta: {}, redirectedFrom: void 0 },
  cl = Symbol("");
var bo;
(function (e) {
  (e[(e.aborted = 4)] = "aborted"), (e[(e.cancelled = 8)] = "cancelled"), (e[(e.duplicated = 16)] = "duplicated");
})(bo || (bo = {}));
function Gt(e, t) {
  return te(new Error(), { type: e, [cl]: !0 }, t);
}
function nt(e, t) {
  return e instanceof Error && cl in e && (t == null || !!(e.type & t));
}
const wo = "[^/]+?",
  dh = { sensitive: !1, strict: !1, start: !0, end: !0 },
  hh = /[.+*?^${}()[\]/\\]/g;
function ph(e, t) {
  const n = te({}, dh, t),
      r = [];
  let s = n.start ? "^" : "";
  const o = [];
  for (const a of e) {
      const u = a.length ? [] : [90];
      n.strict && !a.length && (s += "/");
      for (let h = 0; h < a.length; h++) {
          const p = a[h];
          let g = 40 + (n.sensitive ? 0.25 : 0);
          if (p.type === 0) h || (s += "/"), (s += p.value.replace(hh, "\\$&")), (g += 40);
          else if (p.type === 1) {
              const { value: _, repeatable: E, optional: M, regexp: O } = p;
              o.push({ name: _, repeatable: E, optional: M });
              const F = O || wo;
              if (F !== wo) {
                  g += 10;
                  try {
                      new RegExp(`(${F})`);
                  } catch (K) {
                      throw new Error(`Invalid custom RegExp for param "${_}" (${F}): ` + K.message);
                  }
              }
              let k = E ? `((?:${F})(?:/(?:${F}))*)` : `(${F})`;
              h || (k = M && a.length < 2 ? `(?:/${k})` : "/" + k), M && (k += "?"), (s += k), (g += 20), M && (g += -8), E && (g += -20), F === ".*" && (g += -50);
          }
          u.push(g);
      }
      r.push(u);
  }
  if (n.strict && n.end) {
      const a = r.length - 1;
      r[a][r[a].length - 1] += 0.7000000000000001;
  }
  n.strict || (s += "/?"), n.end ? (s += "$") : n.strict && (s += "(?:/|$)");
  const i = new RegExp(s, n.sensitive ? "" : "i");
  function l(a) {
      const u = a.match(i),
          h = {};
      if (!u) return null;
      for (let p = 1; p < u.length; p++) {
          const g = u[p] || "",
              _ = o[p - 1];
          h[_.name] = g && _.repeatable ? g.split("/") : g;
      }
      return h;
  }
  function c(a) {
      let u = "",
          h = !1;
      for (const p of e) {
          (!h || !u.endsWith("/")) && (u += "/"), (h = !1);
          for (const g of p)
              if (g.type === 0) u += g.value;
              else if (g.type === 1) {
                  const { value: _, repeatable: E, optional: M } = g,
                      O = _ in a ? a[_] : "";
                  if (Ve(O) && !E) throw new Error(`Provided param "${_}" is an array but it is not repeatable (* or + modifiers)`);
                  const F = Ve(O) ? O.join("/") : O;
                  if (!F)
                      if (M) p.length < 2 && (u.endsWith("/") ? (u = u.slice(0, -1)) : (h = !0));
                      else throw new Error(`Missing required param "${_}"`);
                  u += F;
              }
      }
      return u || "/";
  }
  return { re: i, score: r, keys: o, parse: l, stringify: c };
}
function mh(e, t) {
  let n = 0;
  for (; n < e.length && n < t.length; ) {
      const r = t[n] - e[n];
      if (r) return r;
      n++;
  }
  return e.length < t.length ? (e.length === 1 && e[0] === 40 + 40 ? -1 : 1) : e.length > t.length ? (t.length === 1 && t[0] === 40 + 40 ? 1 : -1) : 0;
}
function gh(e, t) {
  let n = 0;
  const r = e.score,
      s = t.score;
  for (; n < r.length && n < s.length; ) {
      const o = mh(r[n], s[n]);
      if (o) return o;
      n++;
  }
  if (Math.abs(s.length - r.length) === 1) {
      if (So(r)) return 1;
      if (So(s)) return -1;
  }
  return s.length - r.length;
}
function So(e) {
  const t = e[e.length - 1];
  return e.length > 0 && t[t.length - 1] < 0;
}
const _h = { type: 0, value: "" },
  yh = /[a-zA-Z0-9_]/;
function bh(e) {
  if (!e) return [[]];
  if (e === "/") return [[_h]];
  if (!e.startsWith("/")) throw new Error(`Invalid path "${e}"`);
  function t(g) {
      throw new Error(`ERR (${n})/"${a}": ${g}`);
  }
  let n = 0,
      r = n;
  const s = [];
  let o;
  function i() {
      o && s.push(o), (o = []);
  }
  let l = 0,
      c,
      a = "",
      u = "";
  function h() {
      a &&
          (n === 0
              ? o.push({ type: 0, value: a })
              : n === 1 || n === 2 || n === 3
              ? (o.length > 1 && (c === "*" || c === "+") && t(`A repeatable param (${a}) must be alone in its segment. eg: '/:ids+.`),
                o.push({ type: 1, value: a, regexp: u, repeatable: c === "*" || c === "+", optional: c === "*" || c === "?" }))
              : t("Invalid state to consume buffer"),
          (a = ""));
  }
  function p() {
      a += c;
  }
  for (; l < e.length; ) {
      if (((c = e[l++]), c === "\\" && n !== 2)) {
          (r = n), (n = 4);
          continue;
      }
      switch (n) {
          case 0:
              c === "/" ? (a && h(), i()) : c === ":" ? (h(), (n = 1)) : p();
              break;
          case 4:
              p(), (n = r);
              break;
          case 1:
              c === "(" ? (n = 2) : yh.test(c) ? p() : (h(), (n = 0), c !== "*" && c !== "?" && c !== "+" && l--);
              break;
          case 2:
              c === ")" ? (u[u.length - 1] == "\\" ? (u = u.slice(0, -1) + c) : (n = 3)) : (u += c);
              break;
          case 3:
              h(), (n = 0), c !== "*" && c !== "?" && c !== "+" && l--, (u = "");
              break;
          default:
              t("Unknown state");
              break;
      }
  }
  return n === 2 && t(`Unfinished custom RegExp for param "${a}"`), h(), i(), s;
}
function wh(e, t, n) {
  const r = ph(bh(e.path), n),
      s = te(r, { record: e, parent: t, children: [], alias: [] });
  return t && !s.record.aliasOf == !t.record.aliasOf && t.children.push(s), s;
}
function Sh(e, t) {
  const n = [],
      r = new Map();
  t = xo({ strict: !1, end: !0, sensitive: !1 }, t);
  function s(u) {
      return r.get(u);
  }
  function o(u, h, p) {
      const g = !p,
          _ = Eh(u);
      _.aliasOf = p && p.record;
      const E = xo(t, u),
          M = [_];
      if ("alias" in u) {
          const k = typeof u.alias == "string" ? [u.alias] : u.alias;
          for (const K of k) M.push(te({}, _, { components: p ? p.record.components : _.components, path: K, aliasOf: p ? p.record : _ }));
      }
      let O, F;
      for (const k of M) {
          const { path: K } = k;
          if (h && K[0] !== "/") {
              const W = h.record.path,
                  ae = W[W.length - 1] === "/" ? "" : "/";
              k.path = h.record.path + (K && ae + K);
          }
          if (((O = wh(k, h, E)), p ? p.alias.push(O) : ((F = F || O), F !== O && F.alias.push(O), g && u.name && !vo(O) && i(u.name)), _.children)) {
              const W = _.children;
              for (let ae = 0; ae < W.length; ae++) o(W[ae], O, p && p.children[ae]);
          }
          (p = p || O), ((O.record.components && Object.keys(O.record.components).length) || O.record.name || O.record.redirect) && c(O);
      }
      return F
          ? () => {
                i(F);
            }
          : un;
  }
  function i(u) {
      if (ll(u)) {
          const h = r.get(u);
          h && (r.delete(u), n.splice(n.indexOf(h), 1), h.children.forEach(i), h.alias.forEach(i));
      } else {
          const h = n.indexOf(u);
          h > -1 && (n.splice(h, 1), u.record.name && r.delete(u.record.name), u.children.forEach(i), u.alias.forEach(i));
      }
  }
  function l() {
      return n;
  }
  function c(u) {
      let h = 0;
      for (; h < n.length && gh(u, n[h]) >= 0 && (u.record.path !== n[h].record.path || !al(u, n[h])); ) h++;
      n.splice(h, 0, u), u.record.name && !vo(u) && r.set(u.record.name, u);
  }
  function a(u, h) {
      let p,
          g = {},
          _,
          E;
      if ("name" in u && u.name) {
          if (((p = r.get(u.name)), !p)) throw Gt(1, { location: u });
          (E = p.record.name),
              (g = te(
                  Eo(
                      h.params,
                      p.keys.filter((F) => !F.optional).map((F) => F.name)
                  ),
                  u.params &&
                      Eo(
                          u.params,
                          p.keys.map((F) => F.name)
                      )
              )),
              (_ = p.stringify(g));
      } else if ("path" in u) (_ = u.path), (p = n.find((F) => F.re.test(_))), p && ((g = p.parse(_)), (E = p.record.name));
      else {
          if (((p = h.name ? r.get(h.name) : n.find((F) => F.re.test(h.path))), !p)) throw Gt(1, { location: u, currentLocation: h });
          (E = p.record.name), (g = te({}, h.params, u.params)), (_ = p.stringify(g));
      }
      const M = [];
      let O = p;
      for (; O; ) M.unshift(O.record), (O = O.parent);
      return { name: E, path: _, params: g, matched: M, meta: xh(M) };
  }
  return e.forEach((u) => o(u)), { addRoute: o, resolve: a, removeRoute: i, getRoutes: l, getRecordMatcher: s };
}
function Eo(e, t) {
  const n = {};
  for (const r of t) r in e && (n[r] = e[r]);
  return n;
}
function Eh(e) {
  return {
      path: e.path,
      redirect: e.redirect,
      name: e.name,
      meta: e.meta || {},
      aliasOf: void 0,
      beforeEnter: e.beforeEnter,
      props: vh(e),
      children: e.children || [],
      instances: {},
      leaveGuards: new Set(),
      updateGuards: new Set(),
      enterCallbacks: {},
      components: "components" in e ? e.components || null : e.component && { default: e.component },
  };
}
function vh(e) {
  const t = {},
      n = e.props || !1;
  if ("component" in e) t.default = n;
  else for (const r in e.components) t[r] = typeof n == "boolean" ? n : n[r];
  return t;
}
function vo(e) {
  for (; e; ) {
      if (e.record.aliasOf) return !0;
      e = e.parent;
  }
  return !1;
}
function xh(e) {
  return e.reduce((t, n) => te(t, n.meta), {});
}
function xo(e, t) {
  const n = {};
  for (const r in e) n[r] = r in t ? t[r] : e[r];
  return n;
}
function al(e, t) {
  return t.children.some((n) => n === e || al(e, n));
}
const ul = /#/g,
  Rh = /&/g,
  Ph = /\//g,
  Ch = /=/g,
  Oh = /\?/g,
  fl = /\+/g,
  Ah = /%5B/g,
  Th = /%5D/g,
  dl = /%5E/g,
  Nh = /%60/g,
  hl = /%7B/g,
  kh = /%7C/g,
  pl = /%7D/g,
  Ih = /%20/g;
function bs(e) {
  return encodeURI("" + e)
      .replace(kh, "|")
      .replace(Ah, "[")
      .replace(Th, "]");
}
function Mh(e) {
  return bs(e).replace(hl, "{").replace(pl, "}").replace(dl, "^");
}
function zr(e) {
  return bs(e).replace(fl, "%2B").replace(Ih, "+").replace(ul, "%23").replace(Rh, "%26").replace(Nh, "`").replace(hl, "{").replace(pl, "}").replace(dl, "^");
}
function Dh(e) {
  return zr(e).replace(Ch, "%3D");
}
function Fh(e) {
  return bs(e).replace(ul, "%23").replace(Oh, "%3F");
}
function Bh(e) {
  return e == null ? "" : Fh(e).replace(Ph, "%2F");
}
function Vn(e) {
  try {
      return decodeURIComponent("" + e);
  } catch {}
  return "" + e;
}
function Lh(e) {
  const t = {};
  if (e === "" || e === "?") return t;
  const r = (e[0] === "?" ? e.slice(1) : e).split("&");
  for (let s = 0; s < r.length; ++s) {
      const o = r[s].replace(fl, " "),
          i = o.indexOf("="),
          l = Vn(i < 0 ? o : o.slice(0, i)),
          c = i < 0 ? null : Vn(o.slice(i + 1));
      if (l in t) {
          let a = t[l];
          Ve(a) || (a = t[l] = [a]), a.push(c);
      } else t[l] = c;
  }
  return t;
}
function Ro(e) {
  let t = "";
  for (let n in e) {
      const r = e[n];
      if (((n = Dh(n)), r == null)) {
          r !== void 0 && (t += (t.length ? "&" : "") + n);
          continue;
      }
      (Ve(r) ? r.map((o) => o && zr(o)) : [r && zr(r)]).forEach((o) => {
          o !== void 0 && ((t += (t.length ? "&" : "") + n), o != null && (t += "=" + o));
      });
  }
  return t;
}
function $h(e) {
  const t = {};
  for (const n in e) {
      const r = e[n];
      r !== void 0 && (t[n] = Ve(r) ? r.map((s) => (s == null ? null : "" + s)) : r == null ? r : "" + r);
  }
  return t;
}
const jh = Symbol(""),
  Po = Symbol(""),
  ws = Symbol(""),
  Ss = Symbol(""),
  Kr = Symbol("");
function rn() {
  let e = [];
  function t(r) {
      return (
          e.push(r),
          () => {
              const s = e.indexOf(r);
              s > -1 && e.splice(s, 1);
          }
      );
  }
  function n() {
      e = [];
  }
  return { add: t, list: () => e, reset: n };
}
function mt(e, t, n, r, s) {
  const o = r && (r.enterCallbacks[s] = r.enterCallbacks[s] || []);
  return () =>
      new Promise((i, l) => {
          const c = (h) => {
                  h === !1 ? l(Gt(4, { from: n, to: t })) : h instanceof Error ? l(h) : fh(h) ? l(Gt(2, { from: t, to: h })) : (o && r.enterCallbacks[s] === o && typeof h == "function" && o.push(h), i());
              },
              a = e.call(r && r.instances[s], t, n, c);
          let u = Promise.resolve(a);
          e.length < 3 && (u = u.then(c)), u.catch((h) => l(h));
      });
}
function Sr(e, t, n, r) {
  const s = [];
  for (const o of e)
      for (const i in o.components) {
          let l = o.components[i];
          if (!(t !== "beforeRouteEnter" && !o.instances[i]))
              if (Uh(l)) {
                  const a = (l.__vccOpts || l)[t];
                  a && s.push(mt(a, n, r, o, i));
              } else {
                  let c = l();
                  s.push(() =>
                      c.then((a) => {
                          if (!a) return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${o.path}"`));
                          const u = Vd(a) ? a.default : a;
                          o.components[i] = u;
                          const p = (u.__vccOpts || u)[t];
                          return p && mt(p, n, r, o, i)();
                      })
                  );
              }
      }
  return s;
}
function Uh(e) {
  return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Co(e) {
  const t = Ke(ws),
      n = Ke(Ss),
      r = ke(() => t.resolve(jt(e.to))),
      s = ke(() => {
          const { matched: c } = r.value,
              { length: a } = c,
              u = c[a - 1],
              h = n.matched;
          if (!u || !h.length) return -1;
          const p = h.findIndex(Wt.bind(null, u));
          if (p > -1) return p;
          const g = Oo(c[a - 2]);
          return a > 1 && Oo(u) === g && h[h.length - 1].path !== g ? h.findIndex(Wt.bind(null, c[a - 2])) : p;
      }),
      o = ke(() => s.value > -1 && qh(n.params, r.value.params)),
      i = ke(() => s.value > -1 && s.value === n.matched.length - 1 && ol(n.params, r.value.params));
  function l(c = {}) {
      return Kh(c) ? t[jt(e.replace) ? "replace" : "push"](jt(e.to)).catch(un) : Promise.resolve();
  }
  return { route: r, href: ke(() => r.value.href), isActive: o, isExactActive: i, navigate: l };
}
const Hh = hi({
      name: "RouterLink",
      compatConfig: { MODE: 3 },
      props: { to: { type: [String, Object], required: !0 }, replace: Boolean, activeClass: String, exactActiveClass: String, custom: Boolean, ariaCurrentValue: { type: String, default: "page" } },
      useLink: Co,
      setup(e, { slots: t }) {
          const n = Xt(Co(e)),
              { options: r } = Ke(ws),
              s = ke(() => ({ [Ao(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive, [Ao(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive }));
          return () => {
              const o = t.default && t.default(n);
              return e.custom ? o : ki("a", { "aria-current": n.isExactActive ? e.ariaCurrentValue : null, href: n.href, onClick: n.navigate, class: s.value }, o);
          };
      },
  }),
  zh = Hh;
function Kh(e) {
  if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
      if (e.currentTarget && e.currentTarget.getAttribute) {
          const t = e.currentTarget.getAttribute("target");
          if (/\b_blank\b/i.test(t)) return;
      }
      return e.preventDefault && e.preventDefault(), !0;
  }
}
function qh(e, t) {
  for (const n in t) {
      const r = t[n],
          s = e[n];
      if (typeof r == "string") {
          if (r !== s) return !1;
      } else if (!Ve(s) || s.length !== r.length || r.some((o, i) => o !== s[i])) return !1;
  }
  return !0;
}
function Oo(e) {
  return e ? (e.aliasOf ? e.aliasOf.path : e.path) : "";
}
const Ao = (e, t, n) => e ?? t ?? n,
  Vh = hi({
      name: "RouterView",
      inheritAttrs: !1,
      props: { name: { type: String, default: "default" }, route: Object },
      compatConfig: { MODE: 3 },
      setup(e, { attrs: t, slots: n }) {
          const r = Ke(Kr),
              s = ke(() => e.route || r.value),
              o = Ke(Po, 0),
              i = ke(() => {
                  let a = jt(o);
                  const { matched: u } = s.value;
                  let h;
                  for (; (h = u[a]) && !h.components; ) a++;
                  return a;
              }),
              l = ke(() => s.value.matched[i.value]);
          In(
              Po,
              ke(() => i.value + 1)
          ),
              In(jh, l),
              In(Kr, s);
          const c = rs();
          return (
              on(
                  () => [c.value, l.value, e.name],
                  ([a, u, h], [p, g, _]) => {
                      u && ((u.instances[h] = a), g && g !== u && a && a === p && (u.leaveGuards.size || (u.leaveGuards = g.leaveGuards), u.updateGuards.size || (u.updateGuards = g.updateGuards))),
                          a && u && (!g || !Wt(u, g) || !p) && (u.enterCallbacks[h] || []).forEach((E) => E(a));
                  },
                  { flush: "post" }
              ),
              () => {
                  const a = s.value,
                      u = e.name,
                      h = l.value,
                      p = h && h.components[u];
                  if (!p) return To(n.default, { Component: p, route: a });
                  const g = h.props[u],
                      _ = g ? (g === !0 ? a.params : typeof g == "function" ? g(a) : g) : null,
                      M = ki(
                          p,
                          te({}, _, t, {
                              onVnodeUnmounted: (O) => {
                                  O.component.isUnmounted && (h.instances[u] = null);
                              },
                              ref: c,
                          })
                      );
                  return To(n.default, { Component: M, route: a }) || M;
              }
          );
      },
  });
function To(e, t) {
  if (!e) return null;
  const n = e(t);
  return n.length === 1 ? n[0] : n;
}
const Wh = Vh;
function Gh(e) {
  const t = Sh(e.routes, e),
      n = e.parseQuery || Lh,
      r = e.stringifyQuery || Ro,
      s = e.history,
      o = rn(),
      i = rn(),
      l = rn(),
      c = sc(ft);
  let a = ft;
  Ft && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
  const u = br.bind(null, (w) => "" + w),
      h = br.bind(null, Bh),
      p = br.bind(null, Vn);
  function g(w, T) {
      let C, D;
      return ll(w) ? ((C = t.getRecordMatcher(w)), (D = T)) : (D = w), t.addRoute(D, C);
  }
  function _(w) {
      const T = t.getRecordMatcher(w);
      T && t.removeRoute(T);
  }
  function E() {
      return t.getRoutes().map((w) => w.record);
  }
  function M(w) {
      return !!t.getRecordMatcher(w);
  }
  function O(w, T) {
      if (((T = te({}, T || c.value)), typeof w == "string")) {
          const m = wr(n, w, T.path),
              y = t.resolve({ path: m.path }, T),
              S = s.createHref(m.fullPath);
          return te(m, y, { params: p(y.params), hash: Vn(m.hash), redirectedFrom: void 0, href: S });
      }
      let C;
      if ("path" in w) C = te({}, w, { path: wr(n, w.path, T.path).path });
      else {
          const m = te({}, w.params);
          for (const y in m) m[y] == null && delete m[y];
          (C = te({}, w, { params: h(m) })), (T.params = h(T.params));
      }
      const D = t.resolve(C, T),
          ee = w.hash || "";
      D.params = u(p(D.params));
      const f = Jd(r, te({}, w, { hash: Mh(ee), path: D.path })),
          d = s.createHref(f);
      return te({ fullPath: f, hash: ee, query: r === Ro ? $h(w.query) : w.query || {} }, D, { redirectedFrom: void 0, href: d });
  }
  function F(w) {
      return typeof w == "string" ? wr(n, w, c.value.path) : te({}, w);
  }
  function k(w, T) {
      if (a !== w) return Gt(8, { from: T, to: w });
  }
  function K(w) {
      return q(w);
  }
  function W(w) {
      return K(te(F(w), { replace: !0 }));
  }
  function ae(w) {
      const T = w.matched[w.matched.length - 1];
      if (T && T.redirect) {
          const { redirect: C } = T;
          let D = typeof C == "function" ? C(w) : C;
          return typeof D == "string" && ((D = D.includes("?") || D.includes("#") ? (D = F(D)) : { path: D }), (D.params = {})), te({ query: w.query, hash: w.hash, params: "path" in D ? {} : w.params }, D);
      }
  }
  function q(w, T) {
      const C = (a = O(w)),
          D = c.value,
          ee = w.state,
          f = w.force,
          d = w.replace === !0,
          m = ae(C);
      if (m) return q(te(F(m), { state: typeof m == "object" ? te({}, ee, m.state) : ee, force: f, replace: d }), T || C);
      const y = C;
      y.redirectedFrom = T;
      let S;
      return (
          !f && Qd(r, D, C) && ((S = Gt(16, { to: y, from: D })), Ge(D, D, !0, !1)),
          (S ? Promise.resolve(S) : Y(y, D))
              .catch((v) => (nt(v) ? (nt(v, 2) ? v : ct(v)) : Z(v, y, D)))
              .then((v) => {
                  if (v) {
                      if (nt(v, 2)) return q(te({ replace: d }, F(v.to), { state: typeof v.to == "object" ? te({}, ee, v.to.state) : ee, force: f }), T || y);
                  } else v = xe(y, D, !0, d, ee);
                  return ue(y, D, v), v;
              })
      );
  }
  function N(w, T) {
      const C = k(w, T);
      return C ? Promise.reject(C) : Promise.resolve();
  }
  function X(w) {
      const T = kt.values().next().value;
      return T && typeof T.runWithContext == "function" ? T.runWithContext(w) : w();
  }
  function Y(w, T) {
      let C;
      const [D, ee, f] = Jh(w, T);
      C = Sr(D.reverse(), "beforeRouteLeave", w, T);
      for (const m of D)
          m.leaveGuards.forEach((y) => {
              C.push(mt(y, w, T));
          });
      const d = N.bind(null, w, T);
      return (
          C.push(d),
          we(C)
              .then(() => {
                  C = [];
                  for (const m of o.list()) C.push(mt(m, w, T));
                  return C.push(d), we(C);
              })
              .then(() => {
                  C = Sr(ee, "beforeRouteUpdate", w, T);
                  for (const m of ee)
                      m.updateGuards.forEach((y) => {
                          C.push(mt(y, w, T));
                      });
                  return C.push(d), we(C);
              })
              .then(() => {
                  C = [];
                  for (const m of w.matched)
                      if (m.beforeEnter && !T.matched.includes(m))
                          if (Ve(m.beforeEnter)) for (const y of m.beforeEnter) C.push(mt(y, w, T));
                          else C.push(mt(m.beforeEnter, w, T));
                  return C.push(d), we(C);
              })
              .then(() => (w.matched.forEach((m) => (m.enterCallbacks = {})), (C = Sr(f, "beforeRouteEnter", w, T)), C.push(d), we(C)))
              .then(() => {
                  C = [];
                  for (const m of i.list()) C.push(mt(m, w, T));
                  return C.push(d), we(C);
              })
              .catch((m) => (nt(m, 8) ? m : Promise.reject(m)))
      );
  }
  function ue(w, T, C) {
      for (const D of l.list()) X(() => D(w, T, C));
  }
  function xe(w, T, C, D, ee) {
      const f = k(w, T);
      if (f) return f;
      const d = T === ft,
          m = Ft ? history.state : {};
      C && (D || d ? s.replace(w.fullPath, te({ scroll: d && m && m.scroll }, ee)) : s.push(w.fullPath, ee)), (c.value = w), Ge(w, T, C, d), ct();
  }
  let be;
  function Ae() {
      be ||
          (be = s.listen((w, T, C) => {
              if (!xn.listening) return;
              const D = O(w),
                  ee = ae(D);
              if (ee) {
                  q(te(ee, { replace: !0 }), D).catch(un);
                  return;
              }
              a = D;
              const f = c.value;
              Ft && sh(_o(f.fullPath, C.delta), ar()),
                  Y(D, f)
                      .catch((d) =>
                          nt(d, 12)
                              ? d
                              : nt(d, 2)
                              ? (q(d.to, D)
                                    .then((m) => {
                                        nt(m, 20) && !C.delta && C.type === wn.pop && s.go(-1, !1);
                                    })
                                    .catch(un),
                                Promise.reject())
                              : (C.delta && s.go(-C.delta, !1), Z(d, D, f))
                      )
                      .then((d) => {
                          (d = d || xe(D, f, !1)), d && (C.delta && !nt(d, 8) ? s.go(-C.delta, !1) : C.type === wn.pop && nt(d, 20) && s.go(-1, !1)), ue(D, f, d);
                      })
                      .catch(un);
          }));
  }
  let he = rn(),
      ge = rn(),
      oe;
  function Z(w, T, C) {
      ct(w);
      const D = ge.list();
      return D.length ? D.forEach((ee) => ee(w, T, C)) : console.error(w), Promise.reject(w);
  }
  function tt() {
      return oe && c.value !== ft
          ? Promise.resolve()
          : new Promise((w, T) => {
                he.add([w, T]);
            });
  }
  function ct(w) {
      return oe || ((oe = !w), Ae(), he.list().forEach(([T, C]) => (w ? C(w) : T())), he.reset()), w;
  }
  function Ge(w, T, C, D) {
      const { scrollBehavior: ee } = e;
      if (!Ft || !ee) return Promise.resolve();
      const f = (!C && oh(_o(w.fullPath, 0))) || ((D || !C) && history.state && history.state.scroll) || null;
      return os()
          .then(() => ee(w, T, f))
          .then((d) => d && rh(d))
          .catch((d) => Z(d, w, T));
  }
  const Ce = (w) => s.go(w);
  let Nt;
  const kt = new Set(),
      xn = {
          currentRoute: c,
          listening: !0,
          addRoute: g,
          removeRoute: _,
          hasRoute: M,
          getRoutes: E,
          resolve: O,
          options: e,
          push: K,
          replace: W,
          go: Ce,
          back: () => Ce(-1),
          forward: () => Ce(1),
          beforeEach: o.add,
          beforeResolve: i.add,
          afterEach: l.add,
          onError: ge.add,
          isReady: tt,
          install(w) {
              const T = this;
              w.component("RouterLink", zh),
                  w.component("RouterView", Wh),
                  (w.config.globalProperties.$router = T),
                  Object.defineProperty(w.config.globalProperties, "$route", { enumerable: !0, get: () => jt(c) }),
                  Ft && !Nt && c.value === ft && ((Nt = !0), K(s.location).catch((ee) => {}));
              const C = {};
              for (const ee in ft) C[ee] = ke(() => c.value[ee]);
              w.provide(ws, T), w.provide(Ss, Xt(C)), w.provide(Kr, c);
              const D = w.unmount;
              kt.add(w),
                  (w.unmount = function () {
                      kt.delete(w), kt.size < 1 && ((a = ft), be && be(), (be = null), (c.value = ft), (Nt = !1), (oe = !1)), D();
                  });
          },
      };
  function we(w) {
      return w.reduce((T, C) => T.then(() => X(C)), Promise.resolve());
  }
  return xn;
}
function Jh(e, t) {
  const n = [],
      r = [],
      s = [],
      o = Math.max(t.matched.length, e.matched.length);
  for (let i = 0; i < o; i++) {
      const l = t.matched[i];
      l && (e.matched.find((a) => Wt(a, l)) ? r.push(l) : n.push(l));
      const c = e.matched[i];
      c && (t.matched.find((a) => Wt(a, c)) || s.push(c));
  }
  return [n, r, s];
}
function Qh() {
  return Ke(Ss);
}
const Yh = "/static/great/shuffle.webm";
const Xh = {
      mounted() {
          (this.gameStore.shuffleVideoRef = this.$refs.shuffleVideoPlayer), this.gameStore.initializeGame(this.route.query.cdm, this.route.query.url);
      },
      setup() {
          const e = Qh(),
              t = en();
          return (
              setInterval(() => {
                  t.initializing || t.update();
              }, 1e3),
              setInterval(() => {
                  t.promoSlide !== 1 ? (t.promoSlide = t.promoSlide - 1) : (t.promoSlide = 14);
              }, 4e3),
              {
                  gameStore: t,
                  screenNames: dt,
                  route: e,
                  displayInfo: () => {
                      (t.showInfo = !0),
                          setTimeout(() => {
                              t.showInfo = !1;
                          }, 5e3);
                  },
              }
          );
      },
      components: { CountDown: wd, Draw: Md, Results: Ud, Intalize: qd },
  },
  Zh = { id: "video-container" },
  ep = { key: 0, style: { color: "white", position: "absolute", "font-size": "0.8em", "z-index": "1000", top: "60em", left: "75em", "text-shadow": "0 0 3px black", "font-family": "'euro'" } },
  tp = j("p", null, "version: 2.0.1", -1);
function np(e, t, n, r, s, o) {
  const i = je("Draw"),
      l = je("CountDown"),
      c = je("Results"),
      a = je("Intalize");
  return (
      $(),
      ne(
          "div",
          { id: "video-parent-container", onDblclick: t[0] || (t[0] = (...u) => r.displayInfo && r.displayInfo(...u)) },
          [
              j("div", Zh, [
                  r.gameStore.showInfo ? ($(), ne("p", ep, [j("p", null, "cdm:" + Ie(r.gameStore.countdownMinutes), 1), j("p", null, "url: " + Ie(r.gameStore.baseUrl), 1), tp])) : se("", !0),
                  r.gameStore.showScreen == r.screenNames.draw ? ($(), pe(i, { key: 1 })) : se("", !0),
                  r.gameStore.showScreen == r.screenNames.countdown ? ($(), pe(l, { key: 2 })) : se("", !0),
                  j(
                      "video",
                      {
                          ref: "shuffleVideoPlayer",
                          src: Yh,
                          preload: "auto",
                          playsinline: "playsinline",
                          muted: "",
                          style: Ht(r.gameStore.showScreen == r.screenNames.shuffle ? "width: 100vw; display: block; pointer-events: none" : "display: none; pointer-events: none"),
                      },
                      null,
                      4
                  ),
                  r.gameStore.showScreen == r.screenNames.results ? ($(), pe(c, { key: 3 })) : se("", !0),
                  r.gameStore.showScreen == r.screenNames.initial ? ($(), pe(a, { key: 4 })) : se("", !0),
              ]),
          ],
          32
      )
  );
}
const rp = We(Xh, [["render", np]]);
const Es = ja(rp),
  ml = Gh({ history: uh(), routes: [] });
Es.use(za());
Es.use(ml);
ml.isReady().then(() => {
  Es.mount("#app");
});
