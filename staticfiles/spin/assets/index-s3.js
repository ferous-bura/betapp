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
            s.referrerPolicy && (o.referrerPolicy = s.referrerPolicy),
            s.crossOrigin === "use-credentials" ? (o.credentials = "include") : s.crossOrigin === "anonymous" ? (o.credentials = "omit") : (o.credentials = "same-origin"),
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
function se(e) {
    if (H(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) {
            const r = e[n],
                s = pe(r) ? hl(r) : se(r);
            if (s) for (const o in s) t[o] = s[o];
        }
        return t;
    } else {
        if (pe(e)) return e;
        if (le(e)) return e;
    }
}
const ul = /;(?![^(]*\))/g,
    fl = /:([^]+)/,
    dl = /\/\*.*?\*\//gs;
function hl(e) {
    const t = {};
    return (
        e
            .replace(dl, "")
            .split(ul)
            .forEach((n) => {
                if (n) {
                    const r = n.split(fl);
                    r.length > 1 && (t[r[0].trim()] = r[1].trim());
                }
            }),
        t
    );
}
function jn(e) {
    let t = "";
    if (pe(e)) t = e;
    else if (H(e))
        for (let n = 0; n < e.length; n++) {
            const r = jn(e[n]);
            r && (t += r + " ");
        }
    else if (le(e)) for (const n in e) e[n] && (t += n + " ");
    return t.trim();
}
const pl = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
    ml = qr(pl);
function xo(e) {
    return !!e || e === "";
}
const z = (e) => (pe(e) ? e : e == null ? "" : H(e) || (le(e) && (e.toString === To || !q(e.toString))) ? JSON.stringify(e, Co, 2) : String(e)),
    Co = (e, t) =>
        t && t.__v_isRef ? Co(e, t.value) : Ft(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((n, [r, s]) => ((n[`${r} =>`] = s), n), {}) } : Ao(t) ? { [`Set(${t.size})`]: [...t.values()] } : le(t) && !H(t) && !Po(t) ? String(t) : t,
    ie = {},
    It = [],
    Ue = () => {},
    gl = () => !1,
    yl = /^on[^a-z]/,
    Un = (e) => yl.test(e),
    Kr = (e) => e.startsWith("onUpdate:"),
    we = Object.assign,
    Wr = (e, t) => {
        const n = e.indexOf(t);
        n > -1 && e.splice(n, 1);
    },
    bl = Object.prototype.hasOwnProperty,
    Q = (e, t) => bl.call(e, t),
    H = Array.isArray,
    Ft = (e) => Hn(e) === "[object Map]",
    Ao = (e) => Hn(e) === "[object Set]",
    q = (e) => typeof e == "function",
    pe = (e) => typeof e == "string",
    Vr = (e) => typeof e == "symbol",
    le = (e) => e !== null && typeof e == "object",
    Oo = (e) => le(e) && q(e.then) && q(e.catch),
    To = Object.prototype.toString,
    Hn = (e) => To.call(e),
    _l = (e) => Hn(e).slice(8, -1),
    Po = (e) => Hn(e) === "[object Object]",
    Gr = (e) => pe(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
    vn = qr(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),
    zn = (e) => {
        const t = Object.create(null);
        return (n) => t[n] || (t[n] = e(n));
    },
    wl = /-(\w)/g,
    Dt = zn((e) => e.replace(wl, (t, n) => (n ? n.toUpperCase() : ""))),
    Rl = /\B([A-Z])/g,
    Kt = zn((e) => e.replace(Rl, "-$1").toLowerCase()),
    No = zn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
    nr = zn((e) => (e ? `on${No(e)}` : "")),
    on = (e, t) => !Object.is(e, t),
    rr = (e, t) => {
        for (let n = 0; n < e.length; n++) e[n](t);
    },
    Mn = (e, t, n) => {
        Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n });
    },
    El = (e) => {
        const t = parseFloat(e);
        return isNaN(t) ? e : t;
    };
let Ss;
const Sl = () => Ss || (Ss = typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {});
let Oe;
class Mo {
    constructor(t = !1) {
        (this.detached = t), (this._active = !0), (this.effects = []), (this.cleanups = []), (this.parent = Oe), !t && Oe && (this.index = (Oe.scopes || (Oe.scopes = [])).push(this) - 1);
    }
    get active() {
        return this._active;
    }
    run(t) {
        if (this._active) {
            const n = Oe;
            try {
                return (Oe = this), t();
            } finally {
                Oe = n;
            }
        }
    }
    on() {
        Oe = this;
    }
    off() {
        Oe = this.parent;
    }
    stop(t) {
        if (this._active) {
            let n, r;
            for (n = 0, r = this.effects.length; n < r; n++) this.effects[n].stop();
            for (n = 0, r = this.cleanups.length; n < r; n++) this.cleanups[n]();
            if (this.scopes) for (n = 0, r = this.scopes.length; n < r; n++) this.scopes[n].stop(!0);
            if (!this.detached && this.parent && !t) {
                const s = this.parent.scopes.pop();
                s && s !== this && ((this.parent.scopes[this.index] = s), (s.index = this.index));
            }
            (this.parent = void 0), (this._active = !1);
        }
    }
}
function Io(e) {
    return new Mo(e);
}
function vl(e, t = Oe) {
    t && t.active && t.effects.push(e);
}
function Fo() {
    return Oe;
}
function xl(e) {
    Oe && Oe.cleanups.push(e);
}
const Jr = (e) => {
        const t = new Set(e);
        return (t.w = 0), (t.n = 0), t;
    },
    ko = (e) => (e.w & pt) > 0,
    Bo = (e) => (e.n & pt) > 0,
    Cl = ({ deps: e }) => {
        if (e.length) for (let t = 0; t < e.length; t++) e[t].w |= pt;
    },
    Al = (e) => {
        const { deps: t } = e;
        if (t.length) {
            let n = 0;
            for (let r = 0; r < t.length; r++) {
                const s = t[r];
                ko(s) && !Bo(s) ? s.delete(e) : (t[n++] = s), (s.w &= ~pt), (s.n &= ~pt);
            }
            t.length = n;
        }
    },
    In = new WeakMap();
let Xt = 0,
    pt = 1;
const wr = 30;
let De;
const St = Symbol(""),
    Rr = Symbol("");
class $r {
    constructor(t, n = null, r) {
        (this.fn = t), (this.scheduler = n), (this.active = !0), (this.deps = []), (this.parent = void 0), vl(this, r);
    }
    run() {
        if (!this.active) return this.fn();
        let t = De,
            n = ft;
        for (; t; ) {
            if (t === this) return;
            t = t.parent;
        }
        try {
            return (this.parent = De), (De = this), (ft = !0), (pt = 1 << ++Xt), Xt <= wr ? Cl(this) : vs(this), this.fn();
        } finally {
            Xt <= wr && Al(this), (pt = 1 << --Xt), (De = this.parent), (ft = n), (this.parent = void 0), this.deferStop && this.stop();
        }
    }
    stop() {
        De === this ? (this.deferStop = !0) : this.active && (vs(this), this.onStop && this.onStop(), (this.active = !1));
    }
}
function vs(e) {
    const { deps: t } = e;
    if (t.length) {
        for (let n = 0; n < t.length; n++) t[n].delete(e);
        t.length = 0;
    }
}
let ft = !0;
const Do = [];
function Wt() {
    Do.push(ft), (ft = !1);
}
function Vt() {
    const e = Do.pop();
    ft = e === void 0 ? !0 : e;
}
function xe(e, t, n) {
    if (ft && De) {
        let r = In.get(e);
        r || In.set(e, (r = new Map()));
        let s = r.get(n);
        s || r.set(n, (s = Jr())), Lo(s);
    }
}
function Lo(e, t) {
    let n = !1;
    Xt <= wr ? Bo(e) || ((e.n |= pt), (n = !ko(e))) : (n = !e.has(De)), n && (e.add(De), De.deps.push(e));
}
function tt(e, t, n, r, s, o) {
    const i = In.get(e);
    if (!i) return;
    let l = [];
    if (t === "clear") l = [...i.values()];
    else if (n === "length" && H(e)) {
        const c = Number(r);
        i.forEach((a, u) => {
            (u === "length" || u >= c) && l.push(a);
        });
    } else
        switch ((n !== void 0 && l.push(i.get(n)), t)) {
            case "add":
                H(e) ? Gr(n) && l.push(i.get("length")) : (l.push(i.get(St)), Ft(e) && l.push(i.get(Rr)));
                break;
            case "delete":
                H(e) || (l.push(i.get(St)), Ft(e) && l.push(i.get(Rr)));
                break;
            case "set":
                Ft(e) && l.push(i.get(St));
                break;
        }
    if (l.length === 1) l[0] && Er(l[0]);
    else {
        const c = [];
        for (const a of l) a && c.push(...a);
        Er(Jr(c));
    }
}
function Er(e, t) {
    const n = H(e) ? e : [...e];
    for (const r of n) r.computed && xs(r);
    for (const r of n) r.computed || xs(r);
}
function xs(e, t) {
    (e !== De || e.allowRecurse) && (e.scheduler ? e.scheduler() : e.run());
}
function Ol(e, t) {
    var n;
    return (n = In.get(e)) === null || n === void 0 ? void 0 : n.get(t);
}
const Tl = qr("__proto__,__v_isRef,__isVue"),
    jo = new Set(
        Object.getOwnPropertyNames(Symbol)
            .filter((e) => e !== "arguments" && e !== "caller")
            .map((e) => Symbol[e])
            .filter(Vr)
    ),
    Pl = Qr(),
    Nl = Qr(!1, !0),
    Ml = Qr(!0),
    Cs = Il();
function Il() {
    const e = {};
    return (
        ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
            e[t] = function (...n) {
                const r = J(this);
                for (let o = 0, i = this.length; o < i; o++) xe(r, "get", o + "");
                const s = r[t](...n);
                return s === -1 || s === !1 ? r[t](...n.map(J)) : s;
            };
        }),
        ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
            e[t] = function (...n) {
                Wt();
                const r = J(this)[t].apply(this, n);
                return Vt(), r;
            };
        }),
        e
    );
}
function Fl(e) {
    const t = J(this);
    return xe(t, "has", e), t.hasOwnProperty(e);
}
function Qr(e = !1, t = !1) {
    return function (r, s, o) {
        if (s === "__v_isReactive") return !e;
        if (s === "__v_isReadonly") return e;
        if (s === "__v_isShallow") return t;
        if (s === "__v_raw" && o === (e ? (t ? Ql : Ko) : t ? qo : zo).get(r)) return r;
        const i = H(r);
        if (!e) {
            if (i && Q(Cs, s)) return Reflect.get(Cs, s, o);
            if (s === "hasOwnProperty") return Fl;
        }
        const l = Reflect.get(r, s, o);
        return (Vr(s) ? jo.has(s) : Tl(s)) || (e || xe(r, "get", s), t) ? l : ue(l) ? (i && Gr(s) ? l : l.value) : le(l) ? (e ? Wo(l) : Gt(l)) : l;
    };
}
const kl = Uo(),
    Bl = Uo(!0);
function Uo(e = !1) {
    return function (n, r, s, o) {
        let i = n[r];
        if (Lt(i) && ue(i) && !ue(s)) return !1;
        if (!e && (!Fn(s) && !Lt(s) && ((i = J(i)), (s = J(s))), !H(n) && ue(i) && !ue(s))) return (i.value = s), !0;
        const l = H(n) && Gr(r) ? Number(r) < n.length : Q(n, r),
            c = Reflect.set(n, r, s, o);
        return n === J(o) && (l ? on(s, i) && tt(n, "set", r, s) : tt(n, "add", r, s)), c;
    };
}
function Dl(e, t) {
    const n = Q(e, t);
    e[t];
    const r = Reflect.deleteProperty(e, t);
    return r && n && tt(e, "delete", t, void 0), r;
}
function Ll(e, t) {
    const n = Reflect.has(e, t);
    return (!Vr(t) || !jo.has(t)) && xe(e, "has", t), n;
}
function jl(e) {
    return xe(e, "iterate", H(e) ? "length" : St), Reflect.ownKeys(e);
}
const Ho = { get: Pl, set: kl, deleteProperty: Dl, has: Ll, ownKeys: jl },
    Ul = {
        get: Ml,
        set(e, t) {
            return !0;
        },
        deleteProperty(e, t) {
            return !0;
        },
    },
    Hl = we({}, Ho, { get: Nl, set: Bl }),
    Yr = (e) => e,
    qn = (e) => Reflect.getPrototypeOf(e);
function yn(e, t, n = !1, r = !1) {
    e = e.__v_raw;
    const s = J(e),
        o = J(t);
    n || (t !== o && xe(s, "get", t), xe(s, "get", o));
    const { has: i } = qn(s),
        l = r ? Yr : n ? es : ln;
    if (i.call(s, t)) return l(e.get(t));
    if (i.call(s, o)) return l(e.get(o));
    e !== s && e.get(t);
}
function bn(e, t = !1) {
    const n = this.__v_raw,
        r = J(n),
        s = J(e);
    return t || (e !== s && xe(r, "has", e), xe(r, "has", s)), e === s ? n.has(e) : n.has(e) || n.has(s);
}
function _n(e, t = !1) {
    return (e = e.__v_raw), !t && xe(J(e), "iterate", St), Reflect.get(e, "size", e);
}
function As(e) {
    e = J(e);
    const t = J(this);
    return qn(t).has.call(t, e) || (t.add(e), tt(t, "add", e, e)), this;
}
function Os(e, t) {
    t = J(t);
    const n = J(this),
        { has: r, get: s } = qn(n);
    let o = r.call(n, e);
    o || ((e = J(e)), (o = r.call(n, e)));
    const i = s.call(n, e);
    return n.set(e, t), o ? on(t, i) && tt(n, "set", e, t) : tt(n, "add", e, t), this;
}
function Ts(e) {
    const t = J(this),
        { has: n, get: r } = qn(t);
    let s = n.call(t, e);
    s || ((e = J(e)), (s = n.call(t, e))), r && r.call(t, e);
    const o = t.delete(e);
    return s && tt(t, "delete", e, void 0), o;
}
function Ps() {
    const e = J(this),
        t = e.size !== 0,
        n = e.clear();
    return t && tt(e, "clear", void 0, void 0), n;
}
function wn(e, t) {
    return function (r, s) {
        const o = this,
            i = o.__v_raw,
            l = J(i),
            c = t ? Yr : e ? es : ln;
        return !e && xe(l, "iterate", St), i.forEach((a, u) => r.call(s, c(a), c(u), o));
    };
}
function Rn(e, t, n) {
    return function (...r) {
        const s = this.__v_raw,
            o = J(s),
            i = Ft(o),
            l = e === "entries" || (e === Symbol.iterator && i),
            c = e === "keys" && i,
            a = s[e](...r),
            u = n ? Yr : t ? es : ln;
        return (
            !t && xe(o, "iterate", c ? Rr : St),
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
function ot(e) {
    return function (...t) {
        return e === "delete" ? !1 : this;
    };
}
function zl() {
    const e = {
            get(o) {
                return yn(this, o);
            },
            get size() {
                return _n(this);
            },
            has: bn,
            add: As,
            set: Os,
            delete: Ts,
            clear: Ps,
            forEach: wn(!1, !1),
        },
        t = {
            get(o) {
                return yn(this, o, !1, !0);
            },
            get size() {
                return _n(this);
            },
            has: bn,
            add: As,
            set: Os,
            delete: Ts,
            clear: Ps,
            forEach: wn(!1, !0),
        },
        n = {
            get(o) {
                return yn(this, o, !0);
            },
            get size() {
                return _n(this, !0);
            },
            has(o) {
                return bn.call(this, o, !0);
            },
            add: ot("add"),
            set: ot("set"),
            delete: ot("delete"),
            clear: ot("clear"),
            forEach: wn(!0, !1),
        },
        r = {
            get(o) {
                return yn(this, o, !0, !0);
            },
            get size() {
                return _n(this, !0);
            },
            has(o) {
                return bn.call(this, o, !0);
            },
            add: ot("add"),
            set: ot("set"),
            delete: ot("delete"),
            clear: ot("clear"),
            forEach: wn(!0, !0),
        };
    return (
        ["keys", "values", "entries", Symbol.iterator].forEach((o) => {
            (e[o] = Rn(o, !1, !1)), (n[o] = Rn(o, !0, !1)), (t[o] = Rn(o, !1, !0)), (r[o] = Rn(o, !0, !0));
        }),
        [e, n, t, r]
    );
}
const [ql, Kl, Wl, Vl] = zl();
function Xr(e, t) {
    const n = t ? (e ? Vl : Wl) : e ? Kl : ql;
    return (r, s, o) => (s === "__v_isReactive" ? !e : s === "__v_isReadonly" ? e : s === "__v_raw" ? r : Reflect.get(Q(n, s) && s in r ? n : r, s, o));
}
const Gl = { get: Xr(!1, !1) },
    Jl = { get: Xr(!1, !0) },
    $l = { get: Xr(!0, !1) },
    zo = new WeakMap(),
    qo = new WeakMap(),
    Ko = new WeakMap(),
    Ql = new WeakMap();
function Yl(e) {
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
function Xl(e) {
    return e.__v_skip || !Object.isExtensible(e) ? 0 : Yl(_l(e));
}
function Gt(e) {
    return Lt(e) ? e : Zr(e, !1, Ho, Gl, zo);
}
function Zl(e) {
    return Zr(e, !1, Hl, Jl, qo);
}
function Wo(e) {
    return Zr(e, !0, Ul, $l, Ko);
}
function Zr(e, t, n, r, s) {
    if (!le(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
    const o = s.get(e);
    if (o) return o;
    const i = Xl(e);
    if (i === 0) return e;
    const l = new Proxy(e, i === 2 ? r : n);
    return s.set(e, l), l;
}
function dt(e) {
    return Lt(e) ? dt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Lt(e) {
    return !!(e && e.__v_isReadonly);
}
function Fn(e) {
    return !!(e && e.__v_isShallow);
}
function Vo(e) {
    return dt(e) || Lt(e);
}
function J(e) {
    const t = e && e.__v_raw;
    return t ? J(t) : e;
}
function jt(e) {
    return Mn(e, "__v_skip", !0), e;
}
const ln = (e) => (le(e) ? Gt(e) : e),
    es = (e) => (le(e) ? Wo(e) : e);
function Go(e) {
    ft && De && ((e = J(e)), Lo(e.dep || (e.dep = Jr())));
}
function Jo(e, t) {
    e = J(e);
    const n = e.dep;
    n && Er(n);
}
function ue(e) {
    return !!(e && e.__v_isRef === !0);
}
function ts(e) {
    return $o(e, !1);
}
function ec(e) {
    return $o(e, !0);
}
function $o(e, t) {
    return ue(e) ? e : new tc(e, t);
}
class tc {
    constructor(t, n) {
        (this.__v_isShallow = n), (this.dep = void 0), (this.__v_isRef = !0), (this._rawValue = n ? t : J(t)), (this._value = n ? t : ln(t));
    }
    get value() {
        return Go(this), this._value;
    }
    set value(t) {
        const n = this.__v_isShallow || Fn(t) || Lt(t);
        (t = n ? t : J(t)), on(t, this._rawValue) && ((this._rawValue = t), (this._value = n ? t : ln(t)), Jo(this));
    }
}
function kt(e) {
    return ue(e) ? e.value : e;
}
const nc = {
    get: (e, t, n) => kt(Reflect.get(e, t, n)),
    set: (e, t, n, r) => {
        const s = e[t];
        return ue(s) && !ue(n) ? ((s.value = n), !0) : Reflect.set(e, t, n, r);
    },
};
function Qo(e) {
    return dt(e) ? e : new Proxy(e, nc);
}
function rc(e) {
    const t = H(e) ? new Array(e.length) : {};
    for (const n in e) t[n] = oc(e, n);
    return t;
}
class sc {
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
    get dep() {
        return Ol(J(this._object), this._key);
    }
}
function oc(e, t, n) {
    const r = e[t];
    return ue(r) ? r : new sc(e, t, n);
}
var Yo;
class ic {
    constructor(t, n, r, s) {
        (this._setter = n),
            (this.dep = void 0),
            (this.__v_isRef = !0),
            (this[Yo] = !1),
            (this._dirty = !0),
            (this.effect = new $r(t, () => {
                this._dirty || ((this._dirty = !0), Jo(this));
            })),
            (this.effect.computed = this),
            (this.effect.active = this._cacheable = !s),
            (this.__v_isReadonly = r);
    }
    get value() {
        const t = J(this);
        return Go(t), (t._dirty || !t._cacheable) && ((t._dirty = !1), (t._value = t.effect.run())), t._value;
    }
    set value(t) {
        this._setter(t);
    }
}
Yo = "__v_isReadonly";
function lc(e, t, n = !1) {
    let r, s;
    const o = q(e);
    return o ? ((r = e), (s = Ue)) : ((r = e.get), (s = e.set)), new ic(r, s, o || !s, n);
}
function ht(e, t, n, r) {
    let s;
    try {
        s = r ? e(...r) : e();
    } catch (o) {
        Kn(o, t, n);
    }
    return s;
}
function Ie(e, t, n, r) {
    if (q(e)) {
        const o = ht(e, t, n, r);
        return (
            o &&
                Oo(o) &&
                o.catch((i) => {
                    Kn(i, t, n);
                }),
            o
        );
    }
    const s = [];
    for (let o = 0; o < e.length; o++) s.push(Ie(e[o], t, n, r));
    return s;
}
function Kn(e, t, n, r = !0) {
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
            ht(c, null, 10, [e, i, l]);
            return;
        }
    }
    cc(e, n, s, r);
}
function cc(e, t, n, r = !0) {
    console.error(e);
}
let cn = !1,
    Sr = !1;
const _e = [];
let $e = 0;
const Bt = [];
let Ze = null,
    wt = 0;
const Xo = Promise.resolve();
let ns = null;
function rs(e) {
    const t = ns || Xo;
    return e ? t.then(this ? e.bind(this) : e) : t;
}
function ac(e) {
    let t = $e + 1,
        n = _e.length;
    for (; t < n; ) {
        const r = (t + n) >>> 1;
        an(_e[r]) < e ? (t = r + 1) : (n = r);
    }
    return t;
}
function ss(e) {
    (!_e.length || !_e.includes(e, cn && e.allowRecurse ? $e + 1 : $e)) && (e.id == null ? _e.push(e) : _e.splice(ac(e.id), 0, e), Zo());
}
function Zo() {
    !cn && !Sr && ((Sr = !0), (ns = Xo.then(ti)));
}
function uc(e) {
    const t = _e.indexOf(e);
    t > $e && _e.splice(t, 1);
}
function fc(e) {
    H(e) ? Bt.push(...e) : (!Ze || !Ze.includes(e, e.allowRecurse ? wt + 1 : wt)) && Bt.push(e), Zo();
}
function Ns(e, t = cn ? $e + 1 : 0) {
    for (; t < _e.length; t++) {
        const n = _e[t];
        n && n.pre && (_e.splice(t, 1), t--, n());
    }
}
function ei(e) {
    if (Bt.length) {
        const t = [...new Set(Bt)];
        if (((Bt.length = 0), Ze)) {
            Ze.push(...t);
            return;
        }
        for (Ze = t, Ze.sort((n, r) => an(n) - an(r)), wt = 0; wt < Ze.length; wt++) Ze[wt]();
        (Ze = null), (wt = 0);
    }
}
const an = (e) => (e.id == null ? 1 / 0 : e.id),
    dc = (e, t) => {
        const n = an(e) - an(t);
        if (n === 0) {
            if (e.pre && !t.pre) return -1;
            if (t.pre && !e.pre) return 1;
        }
        return n;
    };
function ti(e) {
    (Sr = !1), (cn = !0), _e.sort(dc);
    const t = Ue;
    try {
        for ($e = 0; $e < _e.length; $e++) {
            const n = _e[$e];
            n && n.active !== !1 && ht(n, null, 14);
        }
    } finally {
        ($e = 0), (_e.length = 0), ei(), (cn = !1), (ns = null), (_e.length || Bt.length) && ti();
    }
}
function hc(e, t, ...n) {
    if (e.isUnmounted) return;
    const r = e.vnode.props || ie;
    let s = n;
    const o = t.startsWith("update:"),
        i = o && t.slice(7);
    if (i && i in r) {
        const u = `${i === "modelValue" ? "model" : i}Modifiers`,
            { number: h, trim: p } = r[u] || ie;
        p && (s = n.map((g) => (pe(g) ? g.trim() : g))), h && (s = n.map(El));
    }
    let l,
        c = r[(l = nr(t))] || r[(l = nr(Dt(t)))];
    !c && o && (c = r[(l = nr(Kt(t)))]), c && Ie(c, e, 6, s);
    const a = r[l + "Once"];
    if (a) {
        if (!e.emitted) e.emitted = {};
        else if (e.emitted[l]) return;
        (e.emitted[l] = !0), Ie(a, e, 6, s);
    }
}
function ni(e, t, n = !1) {
    const r = t.emitsCache,
        s = r.get(e);
    if (s !== void 0) return s;
    const o = e.emits;
    let i = {},
        l = !1;
    if (!q(e)) {
        const c = (a) => {
            const u = ni(a, t, !0);
            u && ((l = !0), we(i, u));
        };
        !n && t.mixins.length && t.mixins.forEach(c), e.extends && c(e.extends), e.mixins && e.mixins.forEach(c);
    }
    return !o && !l ? (le(e) && r.set(e, null), null) : (H(o) ? o.forEach((c) => (i[c] = null)) : we(i, o), le(e) && r.set(e, i), i);
}
function Wn(e, t) {
    return !e || !Un(t) ? !1 : ((t = t.slice(2).replace(/Once$/, "")), Q(e, t[0].toLowerCase() + t.slice(1)) || Q(e, Kt(t)) || Q(e, t));
}
let Le = null,
    ri = null;
function kn(e) {
    const t = Le;
    return (Le = e), (ri = (e && e.type.__scopeId) || null), t;
}
function pc(e, t = Le, n) {
    if (!t || e._n) return e;
    const r = (...s) => {
        r._d && Us(-1);
        const o = kn(t);
        let i;
        try {
            i = e(...s);
        } finally {
            kn(o), r._d && Us(1);
        }
        return i;
    };
    return (r._n = !0), (r._c = !0), (r._d = !0), r;
}
function sr(e) {
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
        ctx: y,
        inheritAttrs: E,
    } = e;
    let k, T;
    const D = kn(e);
    try {
        if (n.shapeFlag & 4) {
            const K = s || r;
            (k = Je(u.call(K, K, h, o, g, p, y))), (T = c);
        } else {
            const K = t;
            (k = Je(K.length > 1 ? K(o, { attrs: c, slots: l, emit: a }) : K(o, null))), (T = t.props ? c : mc(c));
        }
    } catch (K) {
        (tn.length = 0), Kn(K, e, 1), (k = Ne(ze));
    }
    let I = k;
    if (T && E !== !1) {
        const K = Object.keys(T),
            { shapeFlag: G } = I;
        K.length && G & 7 && (i && K.some(Kr) && (T = gc(T, i)), (I = mt(I, T)));
    }
    return n.dirs && ((I = mt(I)), (I.dirs = I.dirs ? I.dirs.concat(n.dirs) : n.dirs)), n.transition && (I.transition = n.transition), (k = I), kn(D), k;
}
const mc = (e) => {
        let t;
        for (const n in e) (n === "class" || n === "style" || Un(n)) && ((t || (t = {}))[n] = e[n]);
        return t;
    },
    gc = (e, t) => {
        const n = {};
        for (const r in e) (!Kr(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
        return n;
    };
function yc(e, t, n) {
    const { props: r, children: s, component: o } = e,
        { props: i, children: l, patchFlag: c } = t,
        a = o.emitsOptions;
    if (t.dirs || t.transition) return !0;
    if (n && c >= 0) {
        if (c & 1024) return !0;
        if (c & 16) return r ? Ms(r, i, a) : !!i;
        if (c & 8) {
            const u = t.dynamicProps;
            for (let h = 0; h < u.length; h++) {
                const p = u[h];
                if (i[p] !== r[p] && !Wn(a, p)) return !0;
            }
        }
    } else return (s || l) && (!l || !l.$stable) ? !0 : r === i ? !1 : r ? (i ? Ms(r, i, a) : !0) : !!i;
    return !1;
}
function Ms(e, t, n) {
    const r = Object.keys(t);
    if (r.length !== Object.keys(e).length) return !0;
    for (let s = 0; s < r.length; s++) {
        const o = r[s];
        if (t[o] !== e[o] && !Wn(n, o)) return !0;
    }
    return !1;
}
function bc({ vnode: e, parent: t }, n) {
    for (; t && t.subTree === e; ) ((e = t.vnode).el = n), (t = t.parent);
}
const _c = (e) => e.__isSuspense;
function wc(e, t) {
    t && t.pendingBranch ? (H(e) ? t.effects.push(...e) : t.effects.push(e)) : fc(e);
}
function xn(e, t) {
    if (de) {
        let n = de.provides;
        const r = de.parent && de.parent.provides;
        r === n && (n = de.provides = Object.create(r)), (n[e] = t);
    }
}
function He(e, t, n = !1) {
    const r = de || Le;
    if (r) {
        const s = r.parent == null ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides;
        if (s && e in s) return s[e];
        if (arguments.length > 1) return n && q(t) ? t.call(r.proxy) : t;
    }
}
const En = {};
function Zt(e, t, n) {
    return si(e, t, n);
}
function si(e, t, { immediate: n, deep: r, flush: s, onTrack: o, onTrigger: i } = ie) {
    const l = Fo() === (de == null ? void 0 : de.scope) ? de : null;
    let c,
        a = !1,
        u = !1;
    if (
        (ue(e)
            ? ((c = () => e.value), (a = Fn(e)))
            : dt(e)
            ? ((c = () => e), (r = !0))
            : H(e)
            ? ((u = !0),
              (a = e.some((I) => dt(I) || Fn(I))),
              (c = () =>
                  e.map((I) => {
                      if (ue(I)) return I.value;
                      if (dt(I)) return Mt(I);
                      if (q(I)) return ht(I, l, 2);
                  })))
            : q(e)
            ? t
                ? (c = () => ht(e, l, 2))
                : (c = () => {
                      if (!(l && l.isUnmounted)) return h && h(), Ie(e, l, 3, [p]);
                  })
            : (c = Ue),
        t && r)
    ) {
        const I = c;
        c = () => Mt(I());
    }
    let h,
        p = (I) => {
            h = T.onStop = () => {
                ht(I, l, 4);
            };
        },
        g;
    if (fn)
        if (((p = Ue), t ? n && Ie(t, l, 3, [c(), u ? [] : void 0, p]) : c(), s === "sync")) {
            const I = pa();
            g = I.__watcherHandles || (I.__watcherHandles = []);
        } else return Ue;
    let y = u ? new Array(e.length).fill(En) : En;
    const E = () => {
        if (T.active)
            if (t) {
                const I = T.run();
                (r || a || (u ? I.some((K, G) => on(K, y[G])) : on(I, y))) && (h && h(), Ie(t, l, 3, [I, y === En ? void 0 : u && y[0] === En ? [] : y, p]), (y = I));
            } else T.run();
    };
    E.allowRecurse = !!t;
    let k;
    s === "sync" ? (k = E) : s === "post" ? (k = () => ve(E, l && l.suspense)) : ((E.pre = !0), l && (E.id = l.uid), (k = () => ss(E)));
    const T = new $r(c, k);
    t ? (n ? E() : (y = T.run())) : s === "post" ? ve(T.run.bind(T), l && l.suspense) : T.run();
    const D = () => {
        T.stop(), l && l.scope && Wr(l.scope.effects, T);
    };
    return g && g.push(D), D;
}
function Rc(e, t, n) {
    const r = this.proxy,
        s = pe(e) ? (e.includes(".") ? oi(r, e) : () => r[e]) : e.bind(r, r);
    let o;
    q(t) ? (o = t) : ((o = t.handler), (n = t));
    const i = de;
    Ut(this);
    const l = si(s, o.bind(r), n);
    return i ? Ut(i) : vt(), l;
}
function oi(e, t) {
    const n = t.split(".");
    return () => {
        let r = e;
        for (let s = 0; s < n.length && r; s++) r = r[n[s]];
        return r;
    };
}
function Mt(e, t) {
    if (!le(e) || e.__v_skip || ((t = t || new Set()), t.has(e))) return e;
    if ((t.add(e), ue(e))) Mt(e.value, t);
    else if (H(e)) for (let n = 0; n < e.length; n++) Mt(e[n], t);
    else if (Ao(e) || Ft(e))
        e.forEach((n) => {
            Mt(n, t);
        });
    else if (Po(e)) for (const n in e) Mt(e[n], t);
    return e;
}
function Ec() {
    const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() };
    return (
        ui(() => {
            e.isMounted = !0;
        }),
        fi(() => {
            e.isUnmounting = !0;
        }),
        e
    );
}
const Me = [Function, Array],
    Sc = {
        name: "BaseTransition",
        props: {
            mode: String,
            appear: Boolean,
            persisted: Boolean,
            onBeforeEnter: Me,
            onEnter: Me,
            onAfterEnter: Me,
            onEnterCancelled: Me,
            onBeforeLeave: Me,
            onLeave: Me,
            onAfterLeave: Me,
            onLeaveCancelled: Me,
            onBeforeAppear: Me,
            onAppear: Me,
            onAfterAppear: Me,
            onAppearCancelled: Me,
        },
        setup(e, { slots: t }) {
            const n = Si(),
                r = Ec();
            let s;
            return () => {
                const o = t.default && li(t.default(), !0);
                if (!o || !o.length) return;
                let i = o[0];
                if (o.length > 1) {
                    for (const E of o)
                        if (E.type !== ze) {
                            i = E;
                            break;
                        }
                }
                const l = J(e),
                    { mode: c } = l;
                if (r.isLeaving) return or(i);
                const a = Is(i);
                if (!a) return or(i);
                const u = vr(a, l, r, n);
                xr(a, u);
                const h = n.subTree,
                    p = h && Is(h);
                let g = !1;
                const { getTransitionKey: y } = a.type;
                if (y) {
                    const E = y();
                    s === void 0 ? (s = E) : E !== s && ((s = E), (g = !0));
                }
                if (p && p.type !== ze && (!Rt(a, p) || g)) {
                    const E = vr(p, l, r, n);
                    if ((xr(p, E), c === "out-in"))
                        return (
                            (r.isLeaving = !0),
                            (E.afterLeave = () => {
                                (r.isLeaving = !1), n.update.active !== !1 && n.update();
                            }),
                            or(i)
                        );
                    c === "in-out" &&
                        a.type !== ze &&
                        (E.delayLeave = (k, T, D) => {
                            const I = ii(r, p);
                            (I[String(p.key)] = p),
                                (k._leaveCb = () => {
                                    T(), (k._leaveCb = void 0), delete u.delayedLeave;
                                }),
                                (u.delayedLeave = D);
                        });
                }
                return i;
            };
        },
    },
    vc = Sc;
function ii(e, t) {
    const { leavingVNodes: n } = e;
    let r = n.get(t.type);
    return r || ((r = Object.create(null)), n.set(t.type, r)), r;
}
function vr(e, t, n, r) {
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
            onLeaveCancelled: y,
            onBeforeAppear: E,
            onAppear: k,
            onAfterAppear: T,
            onAppearCancelled: D,
        } = t,
        I = String(e.key),
        K = ii(n, e),
        G = (M, X) => {
            M && Ie(M, r, 9, X);
        },
        ce = (M, X) => {
            const $ = X[1];
            G(M, X), H(M) ? M.every((ae) => ae.length <= 1) && $() : M.length <= 1 && $();
        },
        W = {
            mode: o,
            persisted: i,
            beforeEnter(M) {
                let X = l;
                if (!n.isMounted)
                    if (s) X = E || l;
                    else return;
                M._leaveCb && M._leaveCb(!0);
                const $ = K[I];
                $ && Rt(e, $) && $.el._leaveCb && $.el._leaveCb(), G(X, [M]);
            },
            enter(M) {
                let X = c,
                    $ = a,
                    ae = u;
                if (!n.isMounted)
                    if (s) (X = k || c), ($ = T || a), (ae = D || u);
                    else return;
                let Re = !1;
                const ye = (M._enterCb = (Ce) => {
                    Re || ((Re = !0), Ce ? G(ae, [M]) : G($, [M]), W.delayedLeave && W.delayedLeave(), (M._enterCb = void 0));
                });
                X ? ce(X, [M, ye]) : ye();
            },
            leave(M, X) {
                const $ = String(e.key);
                if ((M._enterCb && M._enterCb(!0), n.isUnmounting)) return X();
                G(h, [M]);
                let ae = !1;
                const Re = (M._leaveCb = (ye) => {
                    ae || ((ae = !0), X(), ye ? G(y, [M]) : G(g, [M]), (M._leaveCb = void 0), K[$] === e && delete K[$]);
                });
                (K[$] = e), p ? ce(p, [M, Re]) : Re();
            },
            clone(M) {
                return vr(M, t, n, r);
            },
        };
    return W;
}
function or(e) {
    if (Vn(e)) return (e = mt(e)), (e.children = null), e;
}
function Is(e) {
    return Vn(e) ? (e.children ? e.children[0] : void 0) : e;
}
function xr(e, t) {
    e.shapeFlag & 6 && e.component ? xr(e.component.subTree, t) : e.shapeFlag & 128 ? ((e.ssContent.transition = t.clone(e.ssContent)), (e.ssFallback.transition = t.clone(e.ssFallback))) : (e.transition = t);
}
function li(e, t = !1, n) {
    let r = [],
        s = 0;
    for (let o = 0; o < e.length; o++) {
        let i = e[o];
        const l = n == null ? i.key : String(n) + String(i.key != null ? i.key : o);
        i.type === Te ? (i.patchFlag & 128 && s++, (r = r.concat(li(i.children, t, l)))) : (t || i.type !== ze) && r.push(l != null ? mt(i, { key: l }) : i);
    }
    if (s > 1) for (let o = 0; o < r.length; o++) r[o].patchFlag = -2;
    return r;
}
function ci(e) {
    return q(e) ? { setup: e, name: e.name } : e;
}
const Cn = (e) => !!e.type.__asyncLoader,
    Vn = (e) => e.type.__isKeepAlive;
function xc(e, t) {
    ai(e, "a", t);
}
function Cc(e, t) {
    ai(e, "da", t);
}
function ai(e, t, n = de) {
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
    if ((Gn(t, r, n), n)) {
        let s = n.parent;
        for (; s && s.parent; ) Vn(s.parent.vnode) && Ac(r, t, n, s), (s = s.parent);
    }
}
function Ac(e, t, n, r) {
    const s = Gn(t, e, r, !0);
    di(() => {
        Wr(r[t], s);
    }, n);
}
function Gn(e, t, n = de, r = !1) {
    if (n) {
        const s = n[e] || (n[e] = []),
            o =
                t.__weh ||
                (t.__weh = (...i) => {
                    if (n.isUnmounted) return;
                    Wt(), Ut(n);
                    const l = Ie(t, n, e, i);
                    return vt(), Vt(), l;
                });
        return r ? s.unshift(o) : s.push(o), o;
    }
}
const nt = (e) => (t, n = de) => (!fn || e === "sp") && Gn(e, (...r) => t(...r), n),
    Oc = nt("bm"),
    ui = nt("m"),
    Tc = nt("bu"),
    Pc = nt("u"),
    fi = nt("bum"),
    di = nt("um"),
    Nc = nt("sp"),
    Mc = nt("rtg"),
    Ic = nt("rtc");
function Fc(e, t = de) {
    Gn("ec", e, t);
}
function yt(e, t, n, r) {
    const s = e.dirs,
        o = t && t.dirs;
    for (let i = 0; i < s.length; i++) {
        const l = s[i];
        o && (l.oldValue = o[i].value);
        let c = l.dir[r];
        c && (Wt(), Ie(c, n, 8, [e.el, l, e, t]), Vt());
    }
}
const kc = Symbol();
function ir(e, t, n, r) {
    let s;
    const o = n && n[r];
    if (H(e) || pe(e)) {
        s = new Array(e.length);
        for (let i = 0, l = e.length; i < l; i++) s[i] = t(e[i], i, void 0, o && o[i]);
    } else if (typeof e == "number") {
        s = new Array(e);
        for (let i = 0; i < e; i++) s[i] = t(i + 1, i, void 0, o && o[i]);
    } else if (le(e))
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
const Cr = (e) => (e ? (vi(e) ? cs(e) || e.proxy : Cr(e.parent)) : null),
    en = we(Object.create(null), {
        $: (e) => e,
        $el: (e) => e.vnode.el,
        $data: (e) => e.data,
        $props: (e) => e.props,
        $attrs: (e) => e.attrs,
        $slots: (e) => e.slots,
        $refs: (e) => e.refs,
        $parent: (e) => Cr(e.parent),
        $root: (e) => Cr(e.root),
        $emit: (e) => e.emit,
        $options: (e) => os(e),
        $forceUpdate: (e) => e.f || (e.f = () => ss(e.update)),
        $nextTick: (e) => e.n || (e.n = rs.bind(e.proxy)),
        $watch: (e) => Rc.bind(e),
    }),
    lr = (e, t) => e !== ie && !e.__isScriptSetup && Q(e, t),
    Bc = {
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
                    if (lr(r, t)) return (i[t] = 1), r[t];
                    if (s !== ie && Q(s, t)) return (i[t] = 2), s[t];
                    if ((a = e.propsOptions[0]) && Q(a, t)) return (i[t] = 3), o[t];
                    if (n !== ie && Q(n, t)) return (i[t] = 4), n[t];
                    Ar && (i[t] = 0);
                }
            }
            const u = en[t];
            let h, p;
            if (u) return t === "$attrs" && xe(e, "get", t), u(e);
            if ((h = l.__cssModules) && (h = h[t])) return h;
            if (n !== ie && Q(n, t)) return (i[t] = 4), n[t];
            if (((p = c.config.globalProperties), Q(p, t))) return p[t];
        },
        set({ _: e }, t, n) {
            const { data: r, setupState: s, ctx: o } = e;
            return lr(s, t) ? ((s[t] = n), !0) : r !== ie && Q(r, t) ? ((r[t] = n), !0) : Q(e.props, t) || (t[0] === "$" && t.slice(1) in e) ? !1 : ((o[t] = n), !0);
        },
        has({ _: { data: e, setupState: t, accessCache: n, ctx: r, appContext: s, propsOptions: o } }, i) {
            let l;
            return !!n[i] || (e !== ie && Q(e, i)) || lr(t, i) || ((l = o[0]) && Q(l, i)) || Q(r, i) || Q(en, i) || Q(s.config.globalProperties, i);
        },
        defineProperty(e, t, n) {
            return n.get != null ? (e._.accessCache[t] = 0) : Q(n, "value") && this.set(e, t, n.value, null), Reflect.defineProperty(e, t, n);
        },
    };
let Ar = !0;
function Dc(e) {
    const t = os(e),
        n = e.proxy,
        r = e.ctx;
    (Ar = !1), t.beforeCreate && Fs(t.beforeCreate, e, "bc");
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
        updated: y,
        activated: E,
        deactivated: k,
        beforeDestroy: T,
        beforeUnmount: D,
        destroyed: I,
        unmounted: K,
        render: G,
        renderTracked: ce,
        renderTriggered: W,
        errorCaptured: M,
        serverPrefetch: X,
        expose: $,
        inheritAttrs: ae,
        components: Re,
        directives: ye,
        filters: Ce,
    } = t;
    if ((a && Lc(a, r, null, e.appContext.config.unwrapInjectedRef), i))
        for (const re in i) {
            const Z = i[re];
            q(Z) && (r[re] = Z.bind(n));
        }
    if (s) {
        const re = s.call(n, n);
        le(re) && (e.data = Gt(re));
    }
    if (((Ar = !0), o))
        for (const re in o) {
            const Z = o[re],
                Ye = q(Z) ? Z.bind(n, n) : q(Z.get) ? Z.get.bind(n, n) : Ue,
                st = !q(Z) && q(Z.set) ? Z.set.bind(n) : Ue,
                Ke = Pe({ get: Ye, set: st });
            Object.defineProperty(r, re, { enumerable: !0, configurable: !0, get: () => Ke.value, set: (Se) => (Ke.value = Se) });
        }
    if (l) for (const re in l) hi(l[re], r, n, re);
    if (c) {
        const re = q(c) ? c.call(n) : c;
        Reflect.ownKeys(re).forEach((Z) => {
            xn(Z, re[Z]);
        });
    }
    u && Fs(u, e, "c");
    function ge(re, Z) {
        H(Z) ? Z.forEach((Ye) => re(Ye.bind(n))) : Z && re(Z.bind(n));
    }
    if ((ge(Oc, h), ge(ui, p), ge(Tc, g), ge(Pc, y), ge(xc, E), ge(Cc, k), ge(Fc, M), ge(Ic, ce), ge(Mc, W), ge(fi, D), ge(di, K), ge(Nc, X), H($)))
        if ($.length) {
            const re = e.exposed || (e.exposed = {});
            $.forEach((Z) => {
                Object.defineProperty(re, Z, { get: () => n[Z], set: (Ye) => (n[Z] = Ye) });
            });
        } else e.exposed || (e.exposed = {});
    G && e.render === Ue && (e.render = G), ae != null && (e.inheritAttrs = ae), Re && (e.components = Re), ye && (e.directives = ye);
}
function Lc(e, t, n = Ue, r = !1) {
    H(e) && (e = Or(e));
    for (const s in e) {
        const o = e[s];
        let i;
        le(o) ? ("default" in o ? (i = He(o.from || s, o.default, !0)) : (i = He(o.from || s))) : (i = He(o)),
            ue(i) && r ? Object.defineProperty(t, s, { enumerable: !0, configurable: !0, get: () => i.value, set: (l) => (i.value = l) }) : (t[s] = i);
    }
}
function Fs(e, t, n) {
    Ie(H(e) ? e.map((r) => r.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function hi(e, t, n, r) {
    const s = r.includes(".") ? oi(n, r) : () => n[r];
    if (pe(e)) {
        const o = t[e];
        q(o) && Zt(s, o);
    } else if (q(e)) Zt(s, e.bind(n));
    else if (le(e))
        if (H(e)) e.forEach((o) => hi(o, t, n, r));
        else {
            const o = q(e.handler) ? e.handler.bind(n) : t[e.handler];
            q(o) && Zt(s, o, e);
        }
}
function os(e) {
    const t = e.type,
        { mixins: n, extends: r } = t,
        {
            mixins: s,
            optionsCache: o,
            config: { optionMergeStrategies: i },
        } = e.appContext,
        l = o.get(t);
    let c;
    return l ? (c = l) : !s.length && !n && !r ? (c = t) : ((c = {}), s.length && s.forEach((a) => Bn(c, a, i, !0)), Bn(c, t, i)), le(t) && o.set(t, c), c;
}
function Bn(e, t, n, r = !1) {
    const { mixins: s, extends: o } = t;
    o && Bn(e, o, n, !0), s && s.forEach((i) => Bn(e, i, n, !0));
    for (const i in t)
        if (!(r && i === "expose")) {
            const l = jc[i] || (n && n[i]);
            e[i] = l ? l(e[i], t[i]) : t[i];
        }
    return e;
}
const jc = {
    data: ks,
    props: _t,
    emits: _t,
    methods: _t,
    computed: _t,
    beforeCreate: Ee,
    created: Ee,
    beforeMount: Ee,
    mounted: Ee,
    beforeUpdate: Ee,
    updated: Ee,
    beforeDestroy: Ee,
    beforeUnmount: Ee,
    destroyed: Ee,
    unmounted: Ee,
    activated: Ee,
    deactivated: Ee,
    errorCaptured: Ee,
    serverPrefetch: Ee,
    components: _t,
    directives: _t,
    watch: Hc,
    provide: ks,
    inject: Uc,
};
function ks(e, t) {
    return t
        ? e
            ? function () {
                  return we(q(e) ? e.call(this, this) : e, q(t) ? t.call(this, this) : t);
              }
            : t
        : e;
}
function Uc(e, t) {
    return _t(Or(e), Or(t));
}
function Or(e) {
    if (H(e)) {
        const t = {};
        for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
        return t;
    }
    return e;
}
function Ee(e, t) {
    return e ? [...new Set([].concat(e, t))] : t;
}
function _t(e, t) {
    return e ? we(we(Object.create(null), e), t) : t;
}
function Hc(e, t) {
    if (!e) return t;
    if (!t) return e;
    const n = we(Object.create(null), e);
    for (const r in t) n[r] = Ee(e[r], t[r]);
    return n;
}
function zc(e, t, n, r = !1) {
    const s = {},
        o = {};
    Mn(o, $n, 1), (e.propsDefaults = Object.create(null)), pi(e, t, s, o);
    for (const i in e.propsOptions[0]) i in s || (s[i] = void 0);
    n ? (e.props = r ? s : Zl(s)) : e.type.props ? (e.props = s) : (e.props = o), (e.attrs = o);
}
function qc(e, t, n, r) {
    const {
            props: s,
            attrs: o,
            vnode: { patchFlag: i },
        } = e,
        l = J(s),
        [c] = e.propsOptions;
    let a = !1;
    if ((r || i > 0) && !(i & 16)) {
        if (i & 8) {
            const u = e.vnode.dynamicProps;
            for (let h = 0; h < u.length; h++) {
                let p = u[h];
                if (Wn(e.emitsOptions, p)) continue;
                const g = t[p];
                if (c)
                    if (Q(o, p)) g !== o[p] && ((o[p] = g), (a = !0));
                    else {
                        const y = Dt(p);
                        s[y] = Tr(c, l, y, g, e, !1);
                    }
                else g !== o[p] && ((o[p] = g), (a = !0));
            }
        }
    } else {
        pi(e, t, s, o) && (a = !0);
        let u;
        for (const h in l) (!t || (!Q(t, h) && ((u = Kt(h)) === h || !Q(t, u)))) && (c ? n && (n[h] !== void 0 || n[u] !== void 0) && (s[h] = Tr(c, l, h, void 0, e, !0)) : delete s[h]);
        if (o !== l) for (const h in o) (!t || !Q(t, h)) && (delete o[h], (a = !0));
    }
    a && tt(e, "set", "$attrs");
}
function pi(e, t, n, r) {
    const [s, o] = e.propsOptions;
    let i = !1,
        l;
    if (t)
        for (let c in t) {
            if (vn(c)) continue;
            const a = t[c];
            let u;
            s && Q(s, (u = Dt(c))) ? (!o || !o.includes(u) ? (n[u] = a) : ((l || (l = {}))[u] = a)) : Wn(e.emitsOptions, c) || ((!(c in r) || a !== r[c]) && ((r[c] = a), (i = !0)));
        }
    if (o) {
        const c = J(n),
            a = l || ie;
        for (let u = 0; u < o.length; u++) {
            const h = o[u];
            n[h] = Tr(s, c, h, a[h], e, !Q(a, h));
        }
    }
    return i;
}
function Tr(e, t, n, r, s, o) {
    const i = e[n];
    if (i != null) {
        const l = Q(i, "default");
        if (l && r === void 0) {
            const c = i.default;
            if (i.type !== Function && q(c)) {
                const { propsDefaults: a } = s;
                n in a ? (r = a[n]) : (Ut(s), (r = a[n] = c.call(null, t)), vt());
            } else r = c;
        }
        i[0] && (o && !l ? (r = !1) : i[1] && (r === "" || r === Kt(n)) && (r = !0));
    }
    return r;
}
function mi(e, t, n = !1) {
    const r = t.propsCache,
        s = r.get(e);
    if (s) return s;
    const o = e.props,
        i = {},
        l = [];
    let c = !1;
    if (!q(e)) {
        const u = (h) => {
            c = !0;
            const [p, g] = mi(h, t, !0);
            we(i, p), g && l.push(...g);
        };
        !n && t.mixins.length && t.mixins.forEach(u), e.extends && u(e.extends), e.mixins && e.mixins.forEach(u);
    }
    if (!o && !c) return le(e) && r.set(e, It), It;
    if (H(o))
        for (let u = 0; u < o.length; u++) {
            const h = Dt(o[u]);
            Bs(h) && (i[h] = ie);
        }
    else if (o)
        for (const u in o) {
            const h = Dt(u);
            if (Bs(h)) {
                const p = o[u],
                    g = (i[h] = H(p) || q(p) ? { type: p } : Object.assign({}, p));
                if (g) {
                    const y = js(Boolean, g.type),
                        E = js(String, g.type);
                    (g[0] = y > -1), (g[1] = E < 0 || y < E), (y > -1 || Q(g, "default")) && l.push(h);
                }
            }
        }
    const a = [i, l];
    return le(e) && r.set(e, a), a;
}
function Bs(e) {
    return e[0] !== "$";
}
function Ds(e) {
    const t = e && e.toString().match(/^\s*(function|class) (\w+)/);
    return t ? t[2] : e === null ? "null" : "";
}
function Ls(e, t) {
    return Ds(e) === Ds(t);
}
function js(e, t) {
    return H(t) ? t.findIndex((n) => Ls(n, e)) : q(t) && Ls(t, e) ? 0 : -1;
}
const gi = (e) => e[0] === "_" || e === "$stable",
    is = (e) => (H(e) ? e.map(Je) : [Je(e)]),
    Kc = (e, t, n) => {
        if (t._n) return t;
        const r = pc((...s) => is(t(...s)), n);
        return (r._c = !1), r;
    },
    yi = (e, t, n) => {
        const r = e._ctx;
        for (const s in e) {
            if (gi(s)) continue;
            const o = e[s];
            if (q(o)) t[s] = Kc(s, o, r);
            else if (o != null) {
                const i = is(o);
                t[s] = () => i;
            }
        }
    },
    bi = (e, t) => {
        const n = is(t);
        e.slots.default = () => n;
    },
    Wc = (e, t) => {
        if (e.vnode.shapeFlag & 32) {
            const n = t._;
            n ? ((e.slots = J(t)), Mn(t, "_", n)) : yi(t, (e.slots = {}));
        } else (e.slots = {}), t && bi(e, t);
        Mn(e.slots, $n, 1);
    },
    Vc = (e, t, n) => {
        const { vnode: r, slots: s } = e;
        let o = !0,
            i = ie;
        if (r.shapeFlag & 32) {
            const l = t._;
            l ? (n && l === 1 ? (o = !1) : (we(s, t), !n && l === 1 && delete s._)) : ((o = !t.$stable), yi(t, s)), (i = t);
        } else t && (bi(e, t), (i = { default: 1 }));
        if (o) for (const l in s) !gi(l) && !(l in i) && delete s[l];
    };
function _i() {
    return {
        app: null,
        config: { isNativeTag: gl, performance: !1, globalProperties: {}, optionMergeStrategies: {}, errorHandler: void 0, warnHandler: void 0, compilerOptions: {} },
        mixins: [],
        components: {},
        directives: {},
        provides: Object.create(null),
        optionsCache: new WeakMap(),
        propsCache: new WeakMap(),
        emitsCache: new WeakMap(),
    };
}
let Gc = 0;
function Jc(e, t) {
    return function (r, s = null) {
        q(r) || (r = Object.assign({}, r)), s != null && !le(s) && (s = null);
        const o = _i(),
            i = new Set();
        let l = !1;
        const c = (o.app = {
            _uid: Gc++,
            _component: r,
            _props: s,
            _container: null,
            _context: o,
            _instance: null,
            version: ma,
            get config() {
                return o.config;
            },
            set config(a) {},
            use(a, ...u) {
                return i.has(a) || (a && q(a.install) ? (i.add(a), a.install(c, ...u)) : q(a) && (i.add(a), a(c, ...u))), c;
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
                    const p = Ne(r, s);
                    return (p.appContext = o), u && t ? t(p, a) : e(p, a, h), (l = !0), (c._container = a), (a.__vue_app__ = c), cs(p.component) || p.component.proxy;
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
function Pr(e, t, n, r, s = !1) {
    if (H(e)) {
        e.forEach((p, g) => Pr(p, t && (H(t) ? t[g] : t), n, r, s));
        return;
    }
    if (Cn(r) && !s) return;
    const o = r.shapeFlag & 4 ? cs(r.component) || r.component.proxy : r.el,
        i = s ? null : o,
        { i: l, r: c } = e,
        a = t && t.r,
        u = l.refs === ie ? (l.refs = {}) : l.refs,
        h = l.setupState;
    if ((a != null && a !== c && (pe(a) ? ((u[a] = null), Q(h, a) && (h[a] = null)) : ue(a) && (a.value = null)), q(c))) ht(c, l, 12, [i, u]);
    else {
        const p = pe(c),
            g = ue(c);
        if (p || g) {
            const y = () => {
                if (e.f) {
                    const E = p ? (Q(h, c) ? h[c] : u[c]) : c.value;
                    s ? H(E) && Wr(E, o) : H(E) ? E.includes(o) || E.push(o) : p ? ((u[c] = [o]), Q(h, c) && (h[c] = u[c])) : ((c.value = [o]), e.k && (u[e.k] = c.value));
                } else p ? ((u[c] = i), Q(h, c) && (h[c] = i)) : g && ((c.value = i), e.k && (u[e.k] = i));
            };
            i ? ((y.id = -1), ve(y, n)) : y();
        }
    }
}
const ve = wc;
function $c(e) {
    return Qc(e);
}
function Qc(e, t) {
    const n = Sl();
    n.__VUE__ = !0;
    const { insert: r, remove: s, patchProp: o, createElement: i, createText: l, createComment: c, setText: a, setElementText: u, parentNode: h, nextSibling: p, setScopeId: g = Ue, insertStaticContent: y } = e,
        E = (f, d, m, b = null, R = null, S = null, P = !1, x = null, A = !!d.dynamicChildren) => {
            if (f === d) return;
            f && !Rt(f, d) && ((b = w(f)), Se(f, R, S, !0), (f = null)), d.patchFlag === -2 && ((A = !1), (d.dynamicChildren = null));
            const { type: v, ref: L, shapeFlag: F } = d;
            switch (v) {
                case Jn:
                    k(f, d, m, b);
                    break;
                case ze:
                    T(f, d, m, b);
                    break;
                case cr:
                    f == null && D(d, m, b, P);
                    break;
                case Te:
                    Re(f, d, m, b, R, S, P, x, A);
                    break;
                default:
                    F & 1 ? G(f, d, m, b, R, S, P, x, A) : F & 6 ? ye(f, d, m, b, R, S, P, x, A) : (F & 64 || F & 128) && v.process(f, d, m, b, R, S, P, x, A, O);
            }
            L != null && R && Pr(L, f && f.ref, S, d || f, !d);
        },
        k = (f, d, m, b) => {
            if (f == null) r((d.el = l(d.children)), m, b);
            else {
                const R = (d.el = f.el);
                d.children !== f.children && a(R, d.children);
            }
        },
        T = (f, d, m, b) => {
            f == null ? r((d.el = c(d.children || "")), m, b) : (d.el = f.el);
        },
        D = (f, d, m, b) => {
            [f.el, f.anchor] = y(f.children, d, m, b, f.el, f.anchor);
        },
        I = ({ el: f, anchor: d }, m, b) => {
            let R;
            for (; f && f !== d; ) (R = p(f)), r(f, m, b), (f = R);
            r(d, m, b);
        },
        K = ({ el: f, anchor: d }) => {
            let m;
            for (; f && f !== d; ) (m = p(f)), s(f), (f = m);
            s(d);
        },
        G = (f, d, m, b, R, S, P, x, A) => {
            (P = P || d.type === "svg"), f == null ? ce(d, m, b, R, S, P, x, A) : X(f, d, R, S, P, x, A);
        },
        ce = (f, d, m, b, R, S, P, x) => {
            let A, v;
            const { type: L, props: F, shapeFlag: j, transition: U, dirs: V } = f;
            if (((A = f.el = i(f.type, S, F && F.is, F)), j & 8 ? u(A, f.children) : j & 16 && M(f.children, A, null, b, R, S && L !== "foreignObject", P, x), V && yt(f, null, b, "created"), W(A, f, f.scopeId, P, b), F)) {
                for (const ne in F) ne !== "value" && !vn(ne) && o(A, ne, null, F[ne], S, f.children, b, R, be);
                "value" in F && o(A, "value", null, F.value), (v = F.onVnodeBeforeMount) && Ge(v, b, f);
            }
            V && yt(f, null, b, "beforeMount");
            const oe = (!R || (R && !R.pendingBranch)) && U && !U.persisted;
            oe && U.beforeEnter(A),
                r(A, d, m),
                ((v = F && F.onVnodeMounted) || oe || V) &&
                    ve(() => {
                        v && Ge(v, b, f), oe && U.enter(A), V && yt(f, null, b, "mounted");
                    }, R);
        },
        W = (f, d, m, b, R) => {
            if ((m && g(f, m), b)) for (let S = 0; S < b.length; S++) g(f, b[S]);
            if (R) {
                let S = R.subTree;
                if (d === S) {
                    const P = R.vnode;
                    W(f, P, P.scopeId, P.slotScopeIds, R.parent);
                }
            }
        },
        M = (f, d, m, b, R, S, P, x, A = 0) => {
            for (let v = A; v < f.length; v++) {
                const L = (f[v] = x ? at(f[v]) : Je(f[v]));
                E(null, L, d, m, b, R, S, P, x);
            }
        },
        X = (f, d, m, b, R, S, P) => {
            const x = (d.el = f.el);
            let { patchFlag: A, dynamicChildren: v, dirs: L } = d;
            A |= f.patchFlag & 16;
            const F = f.props || ie,
                j = d.props || ie;
            let U;
            m && bt(m, !1), (U = j.onVnodeBeforeUpdate) && Ge(U, m, d, f), L && yt(d, f, m, "beforeUpdate"), m && bt(m, !0);
            const V = R && d.type !== "foreignObject";
            if ((v ? $(f.dynamicChildren, v, x, m, b, V, S) : P || Z(f, d, x, null, m, b, V, S, !1), A > 0)) {
                if (A & 16) ae(x, d, F, j, m, b, R);
                else if ((A & 2 && F.class !== j.class && o(x, "class", null, j.class, R), A & 4 && o(x, "style", F.style, j.style, R), A & 8)) {
                    const oe = d.dynamicProps;
                    for (let ne = 0; ne < oe.length; ne++) {
                        const fe = oe[ne],
                            ke = F[fe],
                            At = j[fe];
                        (At !== ke || fe === "value") && o(x, fe, ke, At, R, f.children, m, b, be);
                    }
                }
                A & 1 && f.children !== d.children && u(x, d.children);
            } else !P && v == null && ae(x, d, F, j, m, b, R);
            ((U = j.onVnodeUpdated) || L) &&
                ve(() => {
                    U && Ge(U, m, d, f), L && yt(d, f, m, "updated");
                }, b);
        },
        $ = (f, d, m, b, R, S, P) => {
            for (let x = 0; x < d.length; x++) {
                const A = f[x],
                    v = d[x],
                    L = A.el && (A.type === Te || !Rt(A, v) || A.shapeFlag & 70) ? h(A.el) : m;
                E(A, v, L, null, b, R, S, P, !0);
            }
        },
        ae = (f, d, m, b, R, S, P) => {
            if (m !== b) {
                if (m !== ie) for (const x in m) !vn(x) && !(x in b) && o(f, x, m[x], null, P, d.children, R, S, be);
                for (const x in b) {
                    if (vn(x)) continue;
                    const A = b[x],
                        v = m[x];
                    A !== v && x !== "value" && o(f, x, v, A, P, d.children, R, S, be);
                }
                "value" in b && o(f, "value", m.value, b.value);
            }
        },
        Re = (f, d, m, b, R, S, P, x, A) => {
            const v = (d.el = f ? f.el : l("")),
                L = (d.anchor = f ? f.anchor : l(""));
            let { patchFlag: F, dynamicChildren: j, slotScopeIds: U } = d;
            U && (x = x ? x.concat(U) : U),
                f == null
                    ? (r(v, m, b), r(L, m, b), M(d.children, m, L, R, S, P, x, A))
                    : F > 0 && F & 64 && j && f.dynamicChildren
                    ? ($(f.dynamicChildren, j, m, R, S, P, x), (d.key != null || (R && d === R.subTree)) && wi(f, d, !0))
                    : Z(f, d, m, L, R, S, P, x, A);
        },
        ye = (f, d, m, b, R, S, P, x, A) => {
            (d.slotScopeIds = x), f == null ? (d.shapeFlag & 512 ? R.ctx.activate(d, m, b, P, A) : Ce(d, m, b, R, S, P, A)) : he(f, d, A);
        },
        Ce = (f, d, m, b, R, S, P) => {
            const x = (f.component = la(f, b, R));
            if ((Vn(f) && (x.ctx.renderer = O), ca(x), x.asyncDep)) {
                if ((R && R.registerDep(x, ge), !f.el)) {
                    const A = (x.subTree = Ne(ze));
                    T(null, A, d, m);
                }
                return;
            }
            ge(x, f, d, m, R, S, P);
        },
        he = (f, d, m) => {
            const b = (d.component = f.component);
            if (yc(f, d, m))
                if (b.asyncDep && !b.asyncResolved) {
                    re(b, d, m);
                    return;
                } else (b.next = d), uc(b.update), b.update();
            else (d.el = f.el), (b.vnode = d);
        },
        ge = (f, d, m, b, R, S, P) => {
            const x = () => {
                    if (f.isMounted) {
                        let { next: L, bu: F, u: j, parent: U, vnode: V } = f,
                            oe = L,
                            ne;
                        bt(f, !1), L ? ((L.el = V.el), re(f, L, P)) : (L = V), F && rr(F), (ne = L.props && L.props.onVnodeBeforeUpdate) && Ge(ne, U, L, V), bt(f, !0);
                        const fe = sr(f),
                            ke = f.subTree;
                        (f.subTree = fe), E(ke, fe, h(ke.el), w(ke), f, R, S), (L.el = fe.el), oe === null && bc(f, fe.el), j && ve(j, R), (ne = L.props && L.props.onVnodeUpdated) && ve(() => Ge(ne, U, L, V), R);
                    } else {
                        let L;
                        const { el: F, props: j } = d,
                            { bm: U, m: V, parent: oe } = f,
                            ne = Cn(d);
                        if ((bt(f, !1), U && rr(U), !ne && (L = j && j.onVnodeBeforeMount) && Ge(L, oe, d), bt(f, !0), F && ee)) {
                            const fe = () => {
                                (f.subTree = sr(f)), ee(F, f.subTree, f, R, null);
                            };
                            ne ? d.type.__asyncLoader().then(() => !f.isUnmounted && fe()) : fe();
                        } else {
                            const fe = (f.subTree = sr(f));
                            E(null, fe, m, b, f, R, S), (d.el = fe.el);
                        }
                        if ((V && ve(V, R), !ne && (L = j && j.onVnodeMounted))) {
                            const fe = d;
                            ve(() => Ge(L, oe, fe), R);
                        }
                        (d.shapeFlag & 256 || (oe && Cn(oe.vnode) && oe.vnode.shapeFlag & 256)) && f.a && ve(f.a, R), (f.isMounted = !0), (d = m = b = null);
                    }
                },
                A = (f.effect = new $r(x, () => ss(v), f.scope)),
                v = (f.update = () => A.run());
            (v.id = f.uid), bt(f, !0), v();
        },
        re = (f, d, m) => {
            d.component = f;
            const b = f.vnode.props;
            (f.vnode = d), (f.next = null), qc(f, d.props, b, m), Vc(f, d.children, m), Wt(), Ns(), Vt();
        },
        Z = (f, d, m, b, R, S, P, x, A = !1) => {
            const v = f && f.children,
                L = f ? f.shapeFlag : 0,
                F = d.children,
                { patchFlag: j, shapeFlag: U } = d;
            if (j > 0) {
                if (j & 128) {
                    st(v, F, m, b, R, S, P, x, A);
                    return;
                } else if (j & 256) {
                    Ye(v, F, m, b, R, S, P, x, A);
                    return;
                }
            }
            U & 8 ? (L & 16 && be(v, R, S), F !== v && u(m, F)) : L & 16 ? (U & 16 ? st(v, F, m, b, R, S, P, x, A) : be(v, R, S, !0)) : (L & 8 && u(m, ""), U & 16 && M(F, m, b, R, S, P, x, A));
        },
        Ye = (f, d, m, b, R, S, P, x, A) => {
            (f = f || It), (d = d || It);
            const v = f.length,
                L = d.length,
                F = Math.min(v, L);
            let j;
            for (j = 0; j < F; j++) {
                const U = (d[j] = A ? at(d[j]) : Je(d[j]));
                E(f[j], U, m, null, R, S, P, x, A);
            }
            v > L ? be(f, R, S, !0, !1, F) : M(d, m, b, R, S, P, x, A, F);
        },
        st = (f, d, m, b, R, S, P, x, A) => {
            let v = 0;
            const L = d.length;
            let F = f.length - 1,
                j = L - 1;
            for (; v <= F && v <= j; ) {
                const U = f[v],
                    V = (d[v] = A ? at(d[v]) : Je(d[v]));
                if (Rt(U, V)) E(U, V, m, null, R, S, P, x, A);
                else break;
                v++;
            }
            for (; v <= F && v <= j; ) {
                const U = f[F],
                    V = (d[j] = A ? at(d[j]) : Je(d[j]));
                if (Rt(U, V)) E(U, V, m, null, R, S, P, x, A);
                else break;
                F--, j--;
            }
            if (v > F) {
                if (v <= j) {
                    const U = j + 1,
                        V = U < L ? d[U].el : b;
                    for (; v <= j; ) E(null, (d[v] = A ? at(d[v]) : Je(d[v])), m, V, R, S, P, x, A), v++;
                }
            } else if (v > j) for (; v <= F; ) Se(f[v], R, S, !0), v++;
            else {
                const U = v,
                    V = v,
                    oe = new Map();
                for (v = V; v <= j; v++) {
                    const Ae = (d[v] = A ? at(d[v]) : Je(d[v]));
                    Ae.key != null && oe.set(Ae.key, v);
                }
                let ne,
                    fe = 0;
                const ke = j - V + 1;
                let At = !1,
                    ws = 0;
                const $t = new Array(ke);
                for (v = 0; v < ke; v++) $t[v] = 0;
                for (v = U; v <= F; v++) {
                    const Ae = f[v];
                    if (fe >= ke) {
                        Se(Ae, R, S, !0);
                        continue;
                    }
                    let We;
                    if (Ae.key != null) We = oe.get(Ae.key);
                    else
                        for (ne = V; ne <= j; ne++)
                            if ($t[ne - V] === 0 && Rt(Ae, d[ne])) {
                                We = ne;
                                break;
                            }
                    We === void 0 ? Se(Ae, R, S, !0) : (($t[We - V] = v + 1), We >= ws ? (ws = We) : (At = !0), E(Ae, d[We], m, null, R, S, P, x, A), fe++);
                }
                const Rs = At ? Yc($t) : It;
                for (ne = Rs.length - 1, v = ke - 1; v >= 0; v--) {
                    const Ae = V + v,
                        We = d[Ae],
                        Es = Ae + 1 < L ? d[Ae + 1].el : b;
                    $t[v] === 0 ? E(null, We, m, Es, R, S, P, x, A) : At && (ne < 0 || v !== Rs[ne] ? Ke(We, m, Es, 2) : ne--);
                }
            }
        },
        Ke = (f, d, m, b, R = null) => {
            const { el: S, type: P, transition: x, children: A, shapeFlag: v } = f;
            if (v & 6) {
                Ke(f.component.subTree, d, m, b);
                return;
            }
            if (v & 128) {
                f.suspense.move(d, m, b);
                return;
            }
            if (v & 64) {
                P.move(f, d, m, O);
                return;
            }
            if (P === Te) {
                r(S, d, m);
                for (let F = 0; F < A.length; F++) Ke(A[F], d, m, b);
                r(f.anchor, d, m);
                return;
            }
            if (P === cr) {
                I(f, d, m);
                return;
            }
            if (b !== 2 && v & 1 && x)
                if (b === 0) x.beforeEnter(S), r(S, d, m), ve(() => x.enter(S), R);
                else {
                    const { leave: F, delayLeave: j, afterLeave: U } = x,
                        V = () => r(S, d, m),
                        oe = () => {
                            F(S, () => {
                                V(), U && U();
                            });
                        };
                    j ? j(S, V, oe) : oe();
                }
            else r(S, d, m);
        },
        Se = (f, d, m, b = !1, R = !1) => {
            const { type: S, props: P, ref: x, children: A, dynamicChildren: v, shapeFlag: L, patchFlag: F, dirs: j } = f;
            if ((x != null && Pr(x, null, m, f, !0), L & 256)) {
                d.ctx.deactivate(f);
                return;
            }
            const U = L & 1 && j,
                V = !Cn(f);
            let oe;
            if ((V && (oe = P && P.onVnodeBeforeUnmount) && Ge(oe, d, f), L & 6)) gn(f.component, m, b);
            else {
                if (L & 128) {
                    f.suspense.unmount(m, b);
                    return;
                }
                U && yt(f, null, d, "beforeUnmount"), L & 64 ? f.type.remove(f, d, m, R, O, b) : v && (S !== Te || (F > 0 && F & 64)) ? be(v, d, m, !1, !0) : ((S === Te && F & 384) || (!R && L & 16)) && be(A, d, m), b && xt(f);
            }
            ((V && (oe = P && P.onVnodeUnmounted)) || U) &&
                ve(() => {
                    oe && Ge(oe, d, f), U && yt(f, null, d, "unmounted");
                }, m);
        },
        xt = (f) => {
            const { type: d, el: m, anchor: b, transition: R } = f;
            if (d === Te) {
                Ct(m, b);
                return;
            }
            if (d === cr) {
                K(f);
                return;
            }
            const S = () => {
                s(m), R && !R.persisted && R.afterLeave && R.afterLeave();
            };
            if (f.shapeFlag & 1 && R && !R.persisted) {
                const { leave: P, delayLeave: x } = R,
                    A = () => P(m, S);
                x ? x(f.el, S, A) : A();
            } else S();
        },
        Ct = (f, d) => {
            let m;
            for (; f !== d; ) (m = p(f)), s(f), (f = m);
            s(d);
        },
        gn = (f, d, m) => {
            const { bum: b, scope: R, update: S, subTree: P, um: x } = f;
            b && rr(b),
                R.stop(),
                S && ((S.active = !1), Se(P, f, d, m)),
                x && ve(x, d),
                ve(() => {
                    f.isUnmounted = !0;
                }, d),
                d && d.pendingBranch && !d.isUnmounted && f.asyncDep && !f.asyncResolved && f.suspenseId === d.pendingId && (d.deps--, d.deps === 0 && d.resolve());
        },
        be = (f, d, m, b = !1, R = !1, S = 0) => {
            for (let P = S; P < f.length; P++) Se(f[P], d, m, b, R);
        },
        w = (f) => (f.shapeFlag & 6 ? w(f.component.subTree) : f.shapeFlag & 128 ? f.suspense.next() : p(f.anchor || f.el)),
        N = (f, d, m) => {
            f == null ? d._vnode && Se(d._vnode, null, null, !0) : E(d._vnode || null, f, d, null, null, null, m), Ns(), ei(), (d._vnode = f);
        },
        O = { p: E, um: Se, m: Ke, r: xt, mt: Ce, mc: M, pc: Z, pbc: $, n: w, o: e };
    let B, ee;
    return t && ([B, ee] = t(O)), { render: N, hydrate: B, createApp: Jc(N, B) };
}
function bt({ effect: e, update: t }, n) {
    e.allowRecurse = t.allowRecurse = n;
}
function wi(e, t, n = !1) {
    const r = e.children,
        s = t.children;
    if (H(r) && H(s))
        for (let o = 0; o < r.length; o++) {
            const i = r[o];
            let l = s[o];
            l.shapeFlag & 1 && !l.dynamicChildren && ((l.patchFlag <= 0 || l.patchFlag === 32) && ((l = s[o] = at(s[o])), (l.el = i.el)), n || wi(i, l)), l.type === Jn && (l.el = i.el);
        }
}
function Yc(e) {
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
const Xc = (e) => e.__isTeleport,
    Te = Symbol(void 0),
    Jn = Symbol(void 0),
    ze = Symbol(void 0),
    cr = Symbol(void 0),
    tn = [];
let je = null;
function Be(e = !1) {
    tn.push((je = e ? null : []));
}
function Zc() {
    tn.pop(), (je = tn[tn.length - 1] || null);
}
let un = 1;
function Us(e) {
    un += e;
}
function Ri(e) {
    return (e.dynamicChildren = un > 0 ? je || It : null), Zc(), un > 0 && je && je.push(e), e;
}
function Ve(e, t, n, r, s, o) {
    return Ri(C(e, t, n, r, s, o, !0));
}
function ea(e, t, n, r, s) {
    return Ri(Ne(e, t, n, r, s, !0));
}
function Nr(e) {
    return e ? e.__v_isVNode === !0 : !1;
}
function Rt(e, t) {
    return e.type === t.type && e.key === t.key;
}
const $n = "__vInternal",
    Ei = ({ key: e }) => e ?? null,
    An = ({ ref: e, ref_key: t, ref_for: n }) => (e != null ? (pe(e) || ue(e) || q(e) ? { i: Le, r: e, k: t, f: !!n } : e) : null);
function C(e, t = null, n = null, r = 0, s = null, o = e === Te ? 0 : 1, i = !1, l = !1) {
    const c = {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e,
        props: t,
        key: t && Ei(t),
        ref: t && An(t),
        scopeId: ri,
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
        ctx: Le,
    };
    return l ? (ls(c, n), o & 128 && e.normalize(c)) : n && (c.shapeFlag |= pe(n) ? 8 : 16), un > 0 && !i && je && (c.patchFlag > 0 || o & 6) && c.patchFlag !== 32 && je.push(c), c;
}
const Ne = ta;
function ta(e, t = null, n = null, r = 0, s = null, o = !1) {
    if (((!e || e === kc) && (e = ze), Nr(e))) {
        const l = mt(e, t, !0);
        return n && ls(l, n), un > 0 && !o && je && (l.shapeFlag & 6 ? (je[je.indexOf(e)] = l) : je.push(l)), (l.patchFlag |= -2), l;
    }
    if ((da(e) && (e = e.__vccOpts), t)) {
        t = na(t);
        let { class: l, style: c } = t;
        l && !pe(l) && (t.class = jn(l)), le(c) && (Vo(c) && !H(c) && (c = we({}, c)), (t.style = se(c)));
    }
    const i = pe(e) ? 1 : _c(e) ? 128 : Xc(e) ? 64 : le(e) ? 4 : q(e) ? 2 : 0;
    return C(e, t, n, r, s, i, o, !0);
}
function na(e) {
    return e ? (Vo(e) || $n in e ? we({}, e) : e) : null;
}
function mt(e, t, n = !1) {
    const { props: r, ref: s, patchFlag: o, children: i } = e,
        l = t ? sa(r || {}, t) : r;
    return {
        __v_isVNode: !0,
        __v_skip: !0,
        type: e.type,
        props: l,
        key: l && Ei(l),
        ref: t && t.ref ? (n && s ? (H(s) ? s.concat(An(t)) : [s, An(t)]) : An(t)) : s,
        scopeId: e.scopeId,
        slotScopeIds: e.slotScopeIds,
        children: i,
        target: e.target,
        targetAnchor: e.targetAnchor,
        staticCount: e.staticCount,
        shapeFlag: e.shapeFlag,
        patchFlag: t && e.type !== Te ? (o === -1 ? 16 : o | 16) : o,
        dynamicProps: e.dynamicProps,
        dynamicChildren: e.dynamicChildren,
        appContext: e.appContext,
        dirs: e.dirs,
        transition: e.transition,
        component: e.component,
        suspense: e.suspense,
        ssContent: e.ssContent && mt(e.ssContent),
        ssFallback: e.ssFallback && mt(e.ssFallback),
        el: e.el,
        anchor: e.anchor,
        ctx: e.ctx,
        ce: e.ce,
    };
}
function ra(e = " ", t = 0) {
    return Ne(Jn, null, e, t);
}
function Ot(e = "", t = !1) {
    return t ? (Be(), ea(ze, null, e)) : Ne(ze, null, e);
}
function Je(e) {
    return e == null || typeof e == "boolean" ? Ne(ze) : H(e) ? Ne(Te, null, e.slice()) : typeof e == "object" ? at(e) : Ne(Jn, null, String(e));
}
function at(e) {
    return (e.el === null && e.patchFlag !== -1) || e.memo ? e : mt(e);
}
function ls(e, t) {
    let n = 0;
    const { shapeFlag: r } = e;
    if (t == null) t = null;
    else if (H(t)) n = 16;
    else if (typeof t == "object")
        if (r & 65) {
            const s = t.default;
            s && (s._c && (s._d = !1), ls(e, s()), s._c && (s._d = !0));
            return;
        } else {
            n = 32;
            const s = t._;
            !s && !($n in t) ? (t._ctx = Le) : s === 3 && Le && (Le.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
        }
    else q(t) ? ((t = { default: t, _ctx: Le }), (n = 32)) : ((t = String(t)), r & 64 ? ((n = 16), (t = [ra(t)])) : (n = 8));
    (e.children = t), (e.shapeFlag |= n);
}
function sa(...e) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
        const r = e[n];
        for (const s in r)
            if (s === "class") t.class !== r.class && (t.class = jn([t.class, r.class]));
            else if (s === "style") t.style = se([t.style, r.style]);
            else if (Un(s)) {
                const o = t[s],
                    i = r[s];
                i && o !== i && !(H(o) && o.includes(i)) && (t[s] = o ? [].concat(o, i) : i);
            } else s !== "" && (t[s] = r[s]);
    }
    return t;
}
function Ge(e, t, n, r = null) {
    Ie(e, t, 7, [n, r]);
}
const oa = _i();
let ia = 0;
function la(e, t, n) {
    const r = e.type,
        s = (t ? t.appContext : e.appContext) || oa,
        o = {
            uid: ia++,
            vnode: e,
            type: r,
            parent: t,
            appContext: s,
            root: null,
            next: null,
            subTree: null,
            effect: null,
            update: null,
            scope: new Mo(!0),
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
            propsOptions: mi(r, s),
            emitsOptions: ni(r, s),
            emit: null,
            emitted: null,
            propsDefaults: ie,
            inheritAttrs: r.inheritAttrs,
            ctx: ie,
            data: ie,
            props: ie,
            attrs: ie,
            slots: ie,
            refs: ie,
            setupState: ie,
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
    return (o.ctx = { _: o }), (o.root = t ? t.root : o), (o.emit = hc.bind(null, o)), e.ce && e.ce(o), o;
}
let de = null;
const Si = () => de || Le,
    Ut = (e) => {
        (de = e), e.scope.on();
    },
    vt = () => {
        de && de.scope.off(), (de = null);
    };
function vi(e) {
    return e.vnode.shapeFlag & 4;
}
let fn = !1;
function ca(e, t = !1) {
    fn = t;
    const { props: n, children: r } = e.vnode,
        s = vi(e);
    zc(e, n, s, t), Wc(e, r);
    const o = s ? aa(e, t) : void 0;
    return (fn = !1), o;
}
function aa(e, t) {
    const n = e.type;
    (e.accessCache = Object.create(null)), (e.proxy = jt(new Proxy(e.ctx, Bc)));
    const { setup: r } = n;
    if (r) {
        const s = (e.setupContext = r.length > 1 ? fa(e) : null);
        Ut(e), Wt();
        const o = ht(r, e, 0, [e.props, s]);
        if ((Vt(), vt(), Oo(o))) {
            if ((o.then(vt, vt), t))
                return o
                    .then((i) => {
                        Hs(e, i, t);
                    })
                    .catch((i) => {
                        Kn(i, e, 0);
                    });
            e.asyncDep = o;
        } else Hs(e, o, t);
    } else xi(e, t);
}
function Hs(e, t, n) {
    q(t) ? (e.type.__ssrInlineRender ? (e.ssrRender = t) : (e.render = t)) : le(t) && (e.setupState = Qo(t)), xi(e, n);
}
let zs;
function xi(e, t, n) {
    const r = e.type;
    if (!e.render) {
        if (!t && zs && !r.render) {
            const s = r.template || os(e).template;
            if (s) {
                const { isCustomElement: o, compilerOptions: i } = e.appContext.config,
                    { delimiters: l, compilerOptions: c } = r,
                    a = we(we({ isCustomElement: o, delimiters: l }, i), c);
                r.render = zs(s, a);
            }
        }
        e.render = r.render || Ue;
    }
    Ut(e), Wt(), Dc(e), Vt(), vt();
}
function ua(e) {
    return new Proxy(e.attrs, {
        get(t, n) {
            return xe(e, "get", "$attrs"), t[n];
        },
    });
}
function fa(e) {
    const t = (r) => {
        e.exposed = r || {};
    };
    let n;
    return {
        get attrs() {
            return n || (n = ua(e));
        },
        slots: e.slots,
        emit: e.emit,
        expose: t,
    };
}
function cs(e) {
    if (e.exposed)
        return (
            e.exposeProxy ||
            (e.exposeProxy = new Proxy(Qo(jt(e.exposed)), {
                get(t, n) {
                    if (n in t) return t[n];
                    if (n in en) return en[n](e);
                },
                has(t, n) {
                    return n in t || n in en;
                },
            }))
        );
}
function da(e) {
    return q(e) && "__vccOpts" in e;
}
const Pe = (e, t) => lc(e, t, fn);
function Ci(e, t, n) {
    const r = arguments.length;
    return r === 2 ? (le(t) && !H(t) ? (Nr(t) ? Ne(e, null, [t]) : Ne(e, t)) : Ne(e, null, t)) : (r > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : r === 3 && Nr(n) && (n = [n]), Ne(e, t, n));
}
const ha = Symbol(""),
    pa = () => He(ha),
    ma = "3.2.47",
    ga = "http://www.w3.org/2000/svg",
    Et = typeof document < "u" ? document : null,
    qs = Et && Et.createElement("template"),
    ya = {
        insert: (e, t, n) => {
            t.insertBefore(e, n || null);
        },
        remove: (e) => {
            const t = e.parentNode;
            t && t.removeChild(e);
        },
        createElement: (e, t, n, r) => {
            const s = t ? Et.createElementNS(ga, e) : Et.createElement(e, n ? { is: n } : void 0);
            return e === "select" && r && r.multiple != null && s.setAttribute("multiple", r.multiple), s;
        },
        createText: (e) => Et.createTextNode(e),
        createComment: (e) => Et.createComment(e),
        setText: (e, t) => {
            e.nodeValue = t;
        },
        setElementText: (e, t) => {
            e.textContent = t;
        },
        parentNode: (e) => e.parentNode,
        nextSibling: (e) => e.nextSibling,
        querySelector: (e) => Et.querySelector(e),
        setScopeId(e, t) {
            e.setAttribute(t, "");
        },
        insertStaticContent(e, t, n, r, s, o) {
            const i = n ? n.previousSibling : t.lastChild;
            if (s && (s === o || s.nextSibling)) for (; t.insertBefore(s.cloneNode(!0), n), !(s === o || !(s = s.nextSibling)); );
            else {
                qs.innerHTML = r ? `<svg>${e}</svg>` : e;
                const l = qs.content;
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
function ba(e, t, n) {
    const r = e._vtc;
    r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : (e.className = t);
}
function _a(e, t, n) {
    const r = e.style,
        s = pe(n);
    if (n && !s) {
        if (t && !pe(t)) for (const o in t) n[o] == null && Mr(r, o, "");
        for (const o in n) Mr(r, o, n[o]);
    } else {
        const o = r.display;
        s ? t !== n && (r.cssText = n) : t && e.removeAttribute("style"), "_vod" in e && (r.display = o);
    }
}
const Ks = /\s*!important$/;
function Mr(e, t, n) {
    if (H(n)) n.forEach((r) => Mr(e, t, r));
    else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
    else {
        const r = wa(e, t);
        Ks.test(n) ? e.setProperty(Kt(r), n.replace(Ks, ""), "important") : (e[r] = n);
    }
}
const Ws = ["Webkit", "Moz", "ms"],
    ar = {};
function wa(e, t) {
    const n = ar[t];
    if (n) return n;
    let r = Dt(t);
    if (r !== "filter" && r in e) return (ar[t] = r);
    r = No(r);
    for (let s = 0; s < Ws.length; s++) {
        const o = Ws[s] + r;
        if (o in e) return (ar[t] = o);
    }
    return t;
}
const Vs = "http://www.w3.org/1999/xlink";
function Ra(e, t, n, r, s) {
    if (r && t.startsWith("xlink:")) n == null ? e.removeAttributeNS(Vs, t.slice(6, t.length)) : e.setAttributeNS(Vs, t, n);
    else {
        const o = ml(t);
        n == null || (o && !xo(n)) ? e.removeAttribute(t) : e.setAttribute(t, o ? "" : n);
    }
}
function Ea(e, t, n, r, s, o, i) {
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
        c === "boolean" ? (n = xo(n)) : n == null && c === "string" ? ((n = ""), (l = !0)) : c === "number" && ((n = 0), (l = !0));
    }
    try {
        e[t] = n;
    } catch {}
    l && e.removeAttribute(t);
}
function Sa(e, t, n, r) {
    e.addEventListener(t, n, r);
}
function va(e, t, n, r) {
    e.removeEventListener(t, n, r);
}
function xa(e, t, n, r, s = null) {
    const o = e._vei || (e._vei = {}),
        i = o[t];
    if (r && i) i.value = r;
    else {
        const [l, c] = Ca(t);
        if (r) {
            const a = (o[t] = Ta(r, s));
            Sa(e, l, a, c);
        } else i && (va(e, l, i, c), (o[t] = void 0));
    }
}
const Gs = /(?:Once|Passive|Capture)$/;
function Ca(e) {
    let t;
    if (Gs.test(e)) {
        t = {};
        let r;
        for (; (r = e.match(Gs)); ) (e = e.slice(0, e.length - r[0].length)), (t[r[0].toLowerCase()] = !0);
    }
    return [e[2] === ":" ? e.slice(3) : Kt(e.slice(2)), t];
}
let ur = 0;
const Aa = Promise.resolve(),
    Oa = () => ur || (Aa.then(() => (ur = 0)), (ur = Date.now()));
function Ta(e, t) {
    const n = (r) => {
        if (!r._vts) r._vts = Date.now();
        else if (r._vts <= n.attached) return;
        Ie(Pa(r, n.value), t, 5, [r]);
    };
    return (n.value = e), (n.attached = Oa()), n;
}
function Pa(e, t) {
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
const Js = /^on[a-z]/,
    Na = (e, t, n, r, s = !1, o, i, l, c) => {
        t === "class"
            ? ba(e, r, s)
            : t === "style"
            ? _a(e, n, r)
            : Un(t)
            ? Kr(t) || xa(e, t, n, r, i)
            : (t[0] === "." ? ((t = t.slice(1)), !0) : t[0] === "^" ? ((t = t.slice(1)), !1) : Ma(e, t, r, s))
            ? Ea(e, t, r, o, i, l, c)
            : (t === "true-value" ? (e._trueValue = r) : t === "false-value" && (e._falseValue = r), Ra(e, t, r, s));
    };
function Ma(e, t, n, r) {
    return r
        ? !!(t === "innerHTML" || t === "textContent" || (t in e && Js.test(t) && q(n)))
        : t === "spellcheck" || t === "draggable" || t === "translate" || t === "form" || (t === "list" && e.tagName === "INPUT") || (t === "type" && e.tagName === "TEXTAREA") || (Js.test(t) && pe(n))
        ? !1
        : t in e;
}
const Ia = {
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
vc.props;
const Fa = we({ patchProp: Na }, ya);
let $s;
function ka() {
    return $s || ($s = $c(Fa));
}
const Ba = (...e) => {
    const t = ka().createApp(...e),
        { mount: n } = t;
    return (
        (t.mount = (r) => {
            const s = Da(r);
            if (!s) return;
            const o = t._component;
            !q(o) && !o.render && !o.template && (o.template = s.innerHTML), (s.innerHTML = "");
            const i = n(s, !1, s instanceof SVGElement);
            return s instanceof Element && (s.removeAttribute("v-cloak"), s.setAttribute("data-v-app", "")), i;
        }),
        t
    );
};
function Da(e) {
    return pe(e) ? document.querySelector(e) : e;
}
var La = !1;
/*!
 * pinia v2.0.33
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */ let Ai;
const Qn = (e) => (Ai = e),
    Oi = Symbol();
function Ir(e) {
    return e && typeof e == "object" && Object.prototype.toString.call(e) === "[object Object]" && typeof e.toJSON != "function";
}
var nn;
(function (e) {
    (e.direct = "direct"), (e.patchObject = "patch object"), (e.patchFunction = "patch function");
})(nn || (nn = {}));
function ja() {
    const e = Io(!0),
        t = e.run(() => ts({}));
    let n = [],
        r = [];
    const s = jt({
        install(o) {
            Qn(s), (s._a = o), o.provide(Oi, s), (o.config.globalProperties.$pinia = s), r.forEach((i) => n.push(i)), (r = []);
        },
        use(o) {
            return !this._a && !La ? r.push(o) : n.push(o), this;
        },
        _p: n,
        _a: null,
        _e: e,
        _s: new Map(),
        state: t,
    });
    return s;
}
const Ti = () => {};
function Qs(e, t, n, r = Ti) {
    e.push(t);
    const s = () => {
        const o = e.indexOf(t);
        o > -1 && (e.splice(o, 1), r());
    };
    return !n && Fo() && xl(s), s;
}
function Tt(e, ...t) {
    e.slice().forEach((n) => {
        n(...t);
    });
}
function Fr(e, t) {
    e instanceof Map && t instanceof Map && t.forEach((n, r) => e.set(r, n)), e instanceof Set && t instanceof Set && t.forEach(e.add, e);
    for (const n in t) {
        if (!t.hasOwnProperty(n)) continue;
        const r = t[n],
            s = e[n];
        Ir(s) && Ir(r) && e.hasOwnProperty(n) && !ue(r) && !dt(r) ? (e[n] = Fr(s, r)) : (e[n] = r);
    }
    return e;
}
const Ua = Symbol();
function Ha(e) {
    return !Ir(e) || !e.hasOwnProperty(Ua);
}
const { assign: ct } = Object;
function za(e) {
    return !!(ue(e) && e.effect);
}
function qa(e, t, n, r) {
    const { state: s, actions: o, getters: i } = t,
        l = n.state.value[e];
    let c;
    function a() {
        l || (n.state.value[e] = s ? s() : {});
        const u = rc(n.state.value[e]);
        return ct(
            u,
            o,
            Object.keys(i || {}).reduce(
                (h, p) => (
                    (h[p] = jt(
                        Pe(() => {
                            Qn(n);
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
    return (c = Pi(e, a, t, n, r, !0)), c;
}
function Pi(e, t, n = {}, r, s, o) {
    let i;
    const l = ct({ actions: {} }, n),
        c = { deep: !0 };
    let a,
        u,
        h = jt([]),
        p = jt([]),
        g;
    const y = r.state.value[e];
    !o && !y && (r.state.value[e] = {}), ts({});
    let E;
    function k(W) {
        let M;
        (a = u = !1), typeof W == "function" ? (W(r.state.value[e]), (M = { type: nn.patchFunction, storeId: e, events: g })) : (Fr(r.state.value[e], W), (M = { type: nn.patchObject, payload: W, storeId: e, events: g }));
        const X = (E = Symbol());
        rs().then(() => {
            E === X && (a = !0);
        }),
            (u = !0),
            Tt(h, M, r.state.value[e]);
    }
    const T = o
        ? function () {
              const { state: M } = n,
                  X = M ? M() : {};
              this.$patch(($) => {
                  ct($, X);
              });
          }
        : Ti;
    function D() {
        i.stop(), (h = []), (p = []), r._s.delete(e);
    }
    function I(W, M) {
        return function () {
            Qn(r);
            const X = Array.from(arguments),
                $ = [],
                ae = [];
            function Re(he) {
                $.push(he);
            }
            function ye(he) {
                ae.push(he);
            }
            Tt(p, { args: X, name: W, store: G, after: Re, onError: ye });
            let Ce;
            try {
                Ce = M.apply(this && this.$id === e ? this : G, X);
            } catch (he) {
                throw (Tt(ae, he), he);
            }
            return Ce instanceof Promise ? Ce.then((he) => (Tt($, he), he)).catch((he) => (Tt(ae, he), Promise.reject(he))) : (Tt($, Ce), Ce);
        };
    }
    const K = {
            _p: r,
            $id: e,
            $onAction: Qs.bind(null, p),
            $patch: k,
            $reset: T,
            $subscribe(W, M = {}) {
                const X = Qs(h, W, M.detached, () => $()),
                    $ = i.run(() =>
                        Zt(
                            () => r.state.value[e],
                            (ae) => {
                                (M.flush === "sync" ? u : a) && W({ storeId: e, type: nn.direct, events: g }, ae);
                            },
                            ct({}, c, M)
                        )
                    );
                return X;
            },
            $dispose: D,
        },
        G = Gt(K);
    r._s.set(e, G);
    const ce = r._e.run(() => ((i = Io()), i.run(() => t())));
    for (const W in ce) {
        const M = ce[W];
        if ((ue(M) && !za(M)) || dt(M)) o || (y && Ha(M) && (ue(M) ? (M.value = y[W]) : Fr(M, y[W])), (r.state.value[e][W] = M));
        else if (typeof M == "function") {
            const X = I(W, M);
            (ce[W] = X), (l.actions[W] = M);
        }
    }
    return (
        ct(G, ce),
        ct(J(G), ce),
        Object.defineProperty(G, "$state", {
            get: () => r.state.value[e],
            set: (W) => {
                k((M) => {
                    ct(M, W);
                });
            },
        }),
        r._p.forEach((W) => {
            ct(
                G,
                i.run(() => W({ store: G, app: r._a, pinia: r, options: l }))
            );
        }),
        y && o && n.hydrate && n.hydrate(G.$state, y),
        (a = !0),
        (u = !0),
        G
    );
}
function Ka(e, t, n) {
    let r, s;
    const o = typeof t == "function";
    typeof e == "string" ? ((r = e), (s = o ? n : t)) : ((s = e), (r = e.id));
    function i(l, c) {
        const a = Si();
        return (l = l || (a && He(Oi, null))), l && Qn(l), (l = Ai), l._s.has(r) || (o ? Pi(r, t, s, l) : qa(r, s, l)), l._s.get(r);
    }
    return (i.$id = r), i;
}
function Ni(e, t) {
    return function () {
        return e.apply(t, arguments);
    };
}
const { toString: Mi } = Object.prototype,
    { getPrototypeOf: as } = Object,
    us = ((e) => (t) => {
        const n = Mi.call(t);
        return e[n] || (e[n] = n.slice(8, -1).toLowerCase());
    })(Object.create(null)),
    rt = (e) => ((e = e.toLowerCase()), (t) => us(t) === e),
    Yn = (e) => (t) => typeof t === e,
    { isArray: Jt } = Array,
    dn = Yn("undefined");
function Wa(e) {
    return e !== null && !dn(e) && e.constructor !== null && !dn(e.constructor) && gt(e.constructor.isBuffer) && e.constructor.isBuffer(e);
}
const Ii = rt("ArrayBuffer");
function Va(e) {
    let t;
    return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? (t = ArrayBuffer.isView(e)) : (t = e && e.buffer && Ii(e.buffer)), t;
}
const Ga = Yn("string"),
    gt = Yn("function"),
    Fi = Yn("number"),
    fs = (e) => e !== null && typeof e == "object",
    Ja = (e) => e === !0 || e === !1,
    On = (e) => {
        if (us(e) !== "object") return !1;
        const t = as(e);
        return (t === null || t === Object.prototype || Object.getPrototypeOf(t) === null) && !(Symbol.toStringTag in e) && !(Symbol.iterator in e);
    },
    $a = rt("Date"),
    Qa = rt("File"),
    Ya = rt("Blob"),
    Xa = rt("FileList"),
    Za = (e) => fs(e) && gt(e.pipe),
    eu = (e) => {
        const t = "[object FormData]";
        return e && ((typeof FormData == "function" && e instanceof FormData) || Mi.call(e) === t || (gt(e.toString) && e.toString() === t));
    },
    tu = rt("URLSearchParams"),
    nu = (e) => (e.trim ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, ""));
function pn(e, t, { allOwnKeys: n = !1 } = {}) {
    if (e === null || typeof e > "u") return;
    let r, s;
    if ((typeof e != "object" && (e = [e]), Jt(e))) for (r = 0, s = e.length; r < s; r++) t.call(null, e[r], r, e);
    else {
        const o = n ? Object.getOwnPropertyNames(e) : Object.keys(e),
            i = o.length;
        let l;
        for (r = 0; r < i; r++) (l = o[r]), t.call(null, e[l], l, e);
    }
}
function ki(e, t) {
    t = t.toLowerCase();
    const n = Object.keys(e);
    let r = n.length,
        s;
    for (; r-- > 0; ) if (((s = n[r]), t === s.toLowerCase())) return s;
    return null;
}
const Bi = (() => (typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : global))(),
    Di = (e) => !dn(e) && e !== Bi;
function kr() {
    const { caseless: e } = (Di(this) && this) || {},
        t = {},
        n = (r, s) => {
            const o = (e && ki(t, s)) || s;
            On(t[o]) && On(r) ? (t[o] = kr(t[o], r)) : On(r) ? (t[o] = kr({}, r)) : Jt(r) ? (t[o] = r.slice()) : (t[o] = r);
        };
    for (let r = 0, s = arguments.length; r < s; r++) arguments[r] && pn(arguments[r], n);
    return t;
}
const ru = (e, t, n, { allOwnKeys: r } = {}) => (
        pn(
            t,
            (s, o) => {
                n && gt(s) ? (e[o] = Ni(s, n)) : (e[o] = s);
            },
            { allOwnKeys: r }
        ),
        e
    ),
    su = (e) => (e.charCodeAt(0) === 65279 && (e = e.slice(1)), e),
    ou = (e, t, n, r) => {
        (e.prototype = Object.create(t.prototype, r)), (e.prototype.constructor = e), Object.defineProperty(e, "super", { value: t.prototype }), n && Object.assign(e.prototype, n);
    },
    iu = (e, t, n, r) => {
        let s, o, i;
        const l = {};
        if (((t = t || {}), e == null)) return t;
        do {
            for (s = Object.getOwnPropertyNames(e), o = s.length; o-- > 0; ) (i = s[o]), (!r || r(i, e, t)) && !l[i] && ((t[i] = e[i]), (l[i] = !0));
            e = n !== !1 && as(e);
        } while (e && (!n || n(e, t)) && e !== Object.prototype);
        return t;
    },
    lu = (e, t, n) => {
        (e = String(e)), (n === void 0 || n > e.length) && (n = e.length), (n -= t.length);
        const r = e.indexOf(t, n);
        return r !== -1 && r === n;
    },
    cu = (e) => {
        if (!e) return null;
        if (Jt(e)) return e;
        let t = e.length;
        if (!Fi(t)) return null;
        const n = new Array(t);
        for (; t-- > 0; ) n[t] = e[t];
        return n;
    },
    au = ((e) => (t) => e && t instanceof e)(typeof Uint8Array < "u" && as(Uint8Array)),
    uu = (e, t) => {
        const r = (e && e[Symbol.iterator]).call(e);
        let s;
        for (; (s = r.next()) && !s.done; ) {
            const o = s.value;
            t.call(e, o[0], o[1]);
        }
    },
    fu = (e, t) => {
        let n;
        const r = [];
        for (; (n = e.exec(t)) !== null; ) r.push(n);
        return r;
    },
    du = rt("HTMLFormElement"),
    hu = (e) =>
        e.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function (n, r, s) {
            return r.toUpperCase() + s;
        }),
    Ys = (({ hasOwnProperty: e }) => (t, n) => e.call(t, n))(Object.prototype),
    pu = rt("RegExp"),
    Li = (e, t) => {
        const n = Object.getOwnPropertyDescriptors(e),
            r = {};
        pn(n, (s, o) => {
            t(s, o, e) !== !1 && (r[o] = s);
        }),
            Object.defineProperties(e, r);
    },
    mu = (e) => {
        Li(e, (t, n) => {
            if (gt(e) && ["arguments", "caller", "callee"].indexOf(n) !== -1) return !1;
            const r = e[n];
            if (gt(r)) {
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
    gu = (e, t) => {
        const n = {},
            r = (s) => {
                s.forEach((o) => {
                    n[o] = !0;
                });
            };
        return Jt(e) ? r(e) : r(String(e).split(t)), n;
    },
    yu = () => {},
    bu = (e, t) => ((e = +e), Number.isFinite(e) ? e : t),
    fr = "abcdefghijklmnopqrstuvwxyz",
    Xs = "0123456789",
    ji = { DIGIT: Xs, ALPHA: fr, ALPHA_DIGIT: fr + fr.toUpperCase() + Xs },
    _u = (e = 16, t = ji.ALPHA_DIGIT) => {
        let n = "";
        const { length: r } = t;
        for (; e--; ) n += t[(Math.random() * r) | 0];
        return n;
    };
function wu(e) {
    return !!(e && gt(e.append) && e[Symbol.toStringTag] === "FormData" && e[Symbol.iterator]);
}
const Ru = (e) => {
        const t = new Array(10),
            n = (r, s) => {
                if (fs(r)) {
                    if (t.indexOf(r) >= 0) return;
                    if (!("toJSON" in r)) {
                        t[s] = r;
                        const o = Jt(r) ? [] : {};
                        return (
                            pn(r, (i, l) => {
                                const c = n(i, s + 1);
                                !dn(c) && (o[l] = c);
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
    _ = {
        isArray: Jt,
        isArrayBuffer: Ii,
        isBuffer: Wa,
        isFormData: eu,
        isArrayBufferView: Va,
        isString: Ga,
        isNumber: Fi,
        isBoolean: Ja,
        isObject: fs,
        isPlainObject: On,
        isUndefined: dn,
        isDate: $a,
        isFile: Qa,
        isBlob: Ya,
        isRegExp: pu,
        isFunction: gt,
        isStream: Za,
        isURLSearchParams: tu,
        isTypedArray: au,
        isFileList: Xa,
        forEach: pn,
        merge: kr,
        extend: ru,
        trim: nu,
        stripBOM: su,
        inherits: ou,
        toFlatObject: iu,
        kindOf: us,
        kindOfTest: rt,
        endsWith: lu,
        toArray: cu,
        forEachEntry: uu,
        matchAll: fu,
        isHTMLForm: du,
        hasOwnProperty: Ys,
        hasOwnProp: Ys,
        reduceDescriptors: Li,
        freezeMethods: mu,
        toObjectSet: gu,
        toCamelCase: hu,
        noop: yu,
        toFiniteNumber: bu,
        findKey: ki,
        global: Bi,
        isContextDefined: Di,
        ALPHABET: ji,
        generateString: _u,
        isSpecCompliantForm: wu,
        toJSONObject: Ru,
    };
function Y(e, t, n, r, s) {
    Error.call(this),
        Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : (this.stack = new Error().stack),
        (this.message = e),
        (this.name = "AxiosError"),
        t && (this.code = t),
        n && (this.config = n),
        r && (this.request = r),
        s && (this.response = s);
}
_.inherits(Y, Error, {
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
            config: _.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null,
        };
    },
});
const Ui = Y.prototype,
    Hi = {};
["ERR_BAD_OPTION_VALUE", "ERR_BAD_OPTION", "ECONNABORTED", "ETIMEDOUT", "ERR_NETWORK", "ERR_FR_TOO_MANY_REDIRECTS", "ERR_DEPRECATED", "ERR_BAD_RESPONSE", "ERR_BAD_REQUEST", "ERR_CANCELED", "ERR_NOT_SUPPORT", "ERR_INVALID_URL"].forEach(
    (e) => {
        Hi[e] = { value: e };
    }
);
Object.defineProperties(Y, Hi);
Object.defineProperty(Ui, "isAxiosError", { value: !0 });
Y.from = (e, t, n, r, s, o) => {
    const i = Object.create(Ui);
    return (
        _.toFlatObject(
            e,
            i,
            function (c) {
                return c !== Error.prototype;
            },
            (l) => l !== "isAxiosError"
        ),
        Y.call(i, e.message, t, n, r, s),
        (i.cause = e),
        (i.name = e.name),
        o && Object.assign(i, o),
        i
    );
};
const Eu = null;
function Br(e) {
    return _.isPlainObject(e) || _.isArray(e);
}
function zi(e) {
    return _.endsWith(e, "[]") ? e.slice(0, -2) : e;
}
function Zs(e, t, n) {
    return e
        ? e
              .concat(t)
              .map(function (s, o) {
                  return (s = zi(s)), !n && o ? "[" + s + "]" : s;
              })
              .join(n ? "." : "")
        : t;
}
function Su(e) {
    return _.isArray(e) && !e.some(Br);
}
const vu = _.toFlatObject(_, {}, null, function (t) {
    return /^is[A-Z]/.test(t);
});
function Xn(e, t, n) {
    if (!_.isObject(e)) throw new TypeError("target must be an object");
    (t = t || new FormData()),
        (n = _.toFlatObject(n, { metaTokens: !0, dots: !1, indexes: !1 }, !1, function (E, k) {
            return !_.isUndefined(k[E]);
        }));
    const r = n.metaTokens,
        s = n.visitor || u,
        o = n.dots,
        i = n.indexes,
        c = (n.Blob || (typeof Blob < "u" && Blob)) && _.isSpecCompliantForm(t);
    if (!_.isFunction(s)) throw new TypeError("visitor must be a function");
    function a(y) {
        if (y === null) return "";
        if (_.isDate(y)) return y.toISOString();
        if (!c && _.isBlob(y)) throw new Y("Blob is not supported. Use a Buffer instead.");
        return _.isArrayBuffer(y) || _.isTypedArray(y) ? (c && typeof Blob == "function" ? new Blob([y]) : Buffer.from(y)) : y;
    }
    function u(y, E, k) {
        let T = y;
        if (y && !k && typeof y == "object") {
            if (_.endsWith(E, "{}")) (E = r ? E : E.slice(0, -2)), (y = JSON.stringify(y));
            else if ((_.isArray(y) && Su(y)) || ((_.isFileList(y) || _.endsWith(E, "[]")) && (T = _.toArray(y))))
                return (
                    (E = zi(E)),
                    T.forEach(function (I, K) {
                        !(_.isUndefined(I) || I === null) && t.append(i === !0 ? Zs([E], K, o) : i === null ? E : E + "[]", a(I));
                    }),
                    !1
                );
        }
        return Br(y) ? !0 : (t.append(Zs(k, E, o), a(y)), !1);
    }
    const h = [],
        p = Object.assign(vu, { defaultVisitor: u, convertValue: a, isVisitable: Br });
    function g(y, E) {
        if (!_.isUndefined(y)) {
            if (h.indexOf(y) !== -1) throw Error("Circular reference detected in " + E.join("."));
            h.push(y),
                _.forEach(y, function (T, D) {
                    (!(_.isUndefined(T) || T === null) && s.call(t, T, _.isString(D) ? D.trim() : D, E, p)) === !0 && g(T, E ? E.concat(D) : [D]);
                }),
                h.pop();
        }
    }
    if (!_.isObject(e)) throw new TypeError("data must be an object");
    return g(e), t;
}
function eo(e) {
    const t = { "!": "%21", "'": "%27", "(": "%28", ")": "%29", "~": "%7E", "%20": "+", "%00": "\0" };
    return encodeURIComponent(e).replace(/[!'()~]|%20|%00/g, function (r) {
        return t[r];
    });
}
function ds(e, t) {
    (this._pairs = []), e && Xn(e, this, t);
}
const qi = ds.prototype;
qi.append = function (t, n) {
    this._pairs.push([t, n]);
};
qi.toString = function (t) {
    const n = t
        ? function (r) {
              return t.call(this, r, eo);
          }
        : eo;
    return this._pairs
        .map(function (s) {
            return n(s[0]) + "=" + n(s[1]);
        }, "")
        .join("&");
};
function xu(e) {
    return encodeURIComponent(e).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function Ki(e, t, n) {
    if (!t) return e;
    const r = (n && n.encode) || xu,
        s = n && n.serialize;
    let o;
    if ((s ? (o = s(t, n)) : (o = _.isURLSearchParams(t) ? t.toString() : new ds(t, n).toString(r)), o)) {
        const i = e.indexOf("#");
        i !== -1 && (e = e.slice(0, i)), (e += (e.indexOf("?") === -1 ? "?" : "&") + o);
    }
    return e;
}
class Cu {
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
        _.forEach(this.handlers, function (r) {
            r !== null && t(r);
        });
    }
}
const to = Cu,
    Wi = { silentJSONParsing: !0, forcedJSONParsing: !0, clarifyTimeoutError: !1 },
    Au = typeof URLSearchParams < "u" ? URLSearchParams : ds,
    Ou = typeof FormData < "u" ? FormData : null,
    Tu = typeof Blob < "u" ? Blob : null,
    Pu = (() => {
        let e;
        return typeof navigator < "u" && ((e = navigator.product) === "ReactNative" || e === "NativeScript" || e === "NS") ? !1 : typeof window < "u" && typeof document < "u";
    })(),
    Nu = (() => typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope && typeof self.importScripts == "function")(),
    Qe = { isBrowser: !0, classes: { URLSearchParams: Au, FormData: Ou, Blob: Tu }, isStandardBrowserEnv: Pu, isStandardBrowserWebWorkerEnv: Nu, protocols: ["http", "https", "file", "blob", "url", "data"] };
function Mu(e, t) {
    return Xn(
        e,
        new Qe.classes.URLSearchParams(),
        Object.assign(
            {
                visitor: function (n, r, s, o) {
                    return Qe.isNode && _.isBuffer(n) ? (this.append(r, n.toString("base64")), !1) : o.defaultVisitor.apply(this, arguments);
                },
            },
            t
        )
    );
}
function Iu(e) {
    return _.matchAll(/\w+|\[(\w*)]/g, e).map((t) => (t[0] === "[]" ? "" : t[1] || t[0]));
}
function Fu(e) {
    const t = {},
        n = Object.keys(e);
    let r;
    const s = n.length;
    let o;
    for (r = 0; r < s; r++) (o = n[r]), (t[o] = e[o]);
    return t;
}
function Vi(e) {
    function t(n, r, s, o) {
        let i = n[o++];
        const l = Number.isFinite(+i),
            c = o >= n.length;
        return (i = !i && _.isArray(s) ? s.length : i), c ? (_.hasOwnProp(s, i) ? (s[i] = [s[i], r]) : (s[i] = r), !l) : ((!s[i] || !_.isObject(s[i])) && (s[i] = []), t(n, r, s[i], o) && _.isArray(s[i]) && (s[i] = Fu(s[i])), !l);
    }
    if (_.isFormData(e) && _.isFunction(e.entries)) {
        const n = {};
        return (
            _.forEachEntry(e, (r, s) => {
                t(Iu(r), s, n, 0);
            }),
            n
        );
    }
    return null;
}
const ku = { "Content-Type": void 0 };
function Bu(e, t, n) {
    if (_.isString(e))
        try {
            return (t || JSON.parse)(e), _.trim(e);
        } catch (r) {
            if (r.name !== "SyntaxError") throw r;
        }
    return (n || JSON.stringify)(e);
}
const Zn = {
    transitional: Wi,
    adapter: ["xhr", "http"],
    transformRequest: [
        function (t, n) {
            const r = n.getContentType() || "",
                s = r.indexOf("application/json") > -1,
                o = _.isObject(t);
            if ((o && _.isHTMLForm(t) && (t = new FormData(t)), _.isFormData(t))) return s && s ? JSON.stringify(Vi(t)) : t;
            if (_.isArrayBuffer(t) || _.isBuffer(t) || _.isStream(t) || _.isFile(t) || _.isBlob(t)) return t;
            if (_.isArrayBufferView(t)) return t.buffer;
            if (_.isURLSearchParams(t)) return n.setContentType("application/x-www-form-urlencoded;charset=utf-8", !1), t.toString();
            let l;
            if (o) {
                if (r.indexOf("application/x-www-form-urlencoded") > -1) return Mu(t, this.formSerializer).toString();
                if ((l = _.isFileList(t)) || r.indexOf("multipart/form-data") > -1) {
                    const c = this.env && this.env.FormData;
                    return Xn(l ? { "files[]": t } : t, c && new c(), this.formSerializer);
                }
            }
            return o || s ? (n.setContentType("application/json", !1), Bu(t)) : t;
        },
    ],
    transformResponse: [
        function (t) {
            const n = this.transitional || Zn.transitional,
                r = n && n.forcedJSONParsing,
                s = this.responseType === "json";
            if (t && _.isString(t) && ((r && !this.responseType) || s)) {
                const i = !(n && n.silentJSONParsing) && s;
                try {
                    return JSON.parse(t);
                } catch (l) {
                    if (i) throw l.name === "SyntaxError" ? Y.from(l, Y.ERR_BAD_RESPONSE, this, null, this.response) : l;
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
    env: { FormData: Qe.classes.FormData, Blob: Qe.classes.Blob },
    validateStatus: function (t) {
        return t >= 200 && t < 300;
    },
    headers: { common: { Accept: "application/json, text/plain, */*" } },
};
_.forEach(["delete", "get", "head"], function (t) {
    Zn.headers[t] = {};
});
_.forEach(["post", "put", "patch"], function (t) {
    Zn.headers[t] = _.merge(ku);
});
const hs = Zn,
    Du = _.toObjectSet([
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
    Lu = (e) => {
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
                            !(!n || (t[n] && Du[n])) && (n === "set-cookie" ? (t[n] ? t[n].push(r) : (t[n] = [r])) : (t[n] = t[n] ? t[n] + ", " + r : r));
                    }),
            t
        );
    },
    no = Symbol("internals");
function Qt(e) {
    return e && String(e).trim().toLowerCase();
}
function Tn(e) {
    return e === !1 || e == null ? e : _.isArray(e) ? e.map(Tn) : String(e);
}
function ju(e) {
    const t = Object.create(null),
        n = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let r;
    for (; (r = n.exec(e)); ) t[r[1]] = r[2];
    return t;
}
function Uu(e) {
    return /^[-_a-zA-Z]+$/.test(e.trim());
}
function dr(e, t, n, r, s) {
    if (_.isFunction(r)) return r.call(this, t, n);
    if ((s && (t = n), !!_.isString(t))) {
        if (_.isString(r)) return t.indexOf(r) !== -1;
        if (_.isRegExp(r)) return r.test(t);
    }
}
function Hu(e) {
    return e
        .trim()
        .toLowerCase()
        .replace(/([a-z\d])(\w*)/g, (t, n, r) => n.toUpperCase() + r);
}
function zu(e, t) {
    const n = _.toCamelCase(" " + t);
    ["get", "set", "has"].forEach((r) => {
        Object.defineProperty(e, r + n, {
            value: function (s, o, i) {
                return this[r].call(this, t, s, o, i);
            },
            configurable: !0,
        });
    });
}
class er {
    constructor(t) {
        t && this.set(t);
    }
    set(t, n, r) {
        const s = this;
        function o(l, c, a) {
            const u = Qt(c);
            if (!u) throw new Error("header name must be a non-empty string");
            const h = _.findKey(s, u);
            (!h || s[h] === void 0 || a === !0 || (a === void 0 && s[h] !== !1)) && (s[h || c] = Tn(l));
        }
        const i = (l, c) => _.forEach(l, (a, u) => o(a, u, c));
        return _.isPlainObject(t) || t instanceof this.constructor ? i(t, n) : _.isString(t) && (t = t.trim()) && !Uu(t) ? i(Lu(t), n) : t != null && o(n, t, r), this;
    }
    get(t, n) {
        if (((t = Qt(t)), t)) {
            const r = _.findKey(this, t);
            if (r) {
                const s = this[r];
                if (!n) return s;
                if (n === !0) return ju(s);
                if (_.isFunction(n)) return n.call(this, s, r);
                if (_.isRegExp(n)) return n.exec(s);
                throw new TypeError("parser must be boolean|regexp|function");
            }
        }
    }
    has(t, n) {
        if (((t = Qt(t)), t)) {
            const r = _.findKey(this, t);
            return !!(r && this[r] !== void 0 && (!n || dr(this, this[r], r, n)));
        }
        return !1;
    }
    delete(t, n) {
        const r = this;
        let s = !1;
        function o(i) {
            if (((i = Qt(i)), i)) {
                const l = _.findKey(r, i);
                l && (!n || dr(r, r[l], l, n)) && (delete r[l], (s = !0));
            }
        }
        return _.isArray(t) ? t.forEach(o) : o(t), s;
    }
    clear(t) {
        const n = Object.keys(this);
        let r = n.length,
            s = !1;
        for (; r--; ) {
            const o = n[r];
            (!t || dr(this, this[o], o, t, !0)) && (delete this[o], (s = !0));
        }
        return s;
    }
    normalize(t) {
        const n = this,
            r = {};
        return (
            _.forEach(this, (s, o) => {
                const i = _.findKey(r, o);
                if (i) {
                    (n[i] = Tn(s)), delete n[o];
                    return;
                }
                const l = t ? Hu(o) : String(o).trim();
                l !== o && delete n[o], (n[l] = Tn(s)), (r[l] = !0);
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
            _.forEach(this, (r, s) => {
                r != null && r !== !1 && (n[s] = t && _.isArray(r) ? r.join(", ") : r);
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
        const r = (this[no] = this[no] = { accessors: {} }).accessors,
            s = this.prototype;
        function o(i) {
            const l = Qt(i);
            r[l] || (zu(s, i), (r[l] = !0));
        }
        return _.isArray(t) ? t.forEach(o) : o(t), this;
    }
}
er.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
_.freezeMethods(er.prototype);
_.freezeMethods(er);
const et = er;
function hr(e, t) {
    const n = this || hs,
        r = t || n,
        s = et.from(r.headers);
    let o = r.data;
    return (
        _.forEach(e, function (l) {
            o = l.call(n, o, s.normalize(), t ? t.status : void 0);
        }),
        s.normalize(),
        o
    );
}
function Gi(e) {
    return !!(e && e.__CANCEL__);
}
function mn(e, t, n) {
    Y.call(this, e ?? "canceled", Y.ERR_CANCELED, t, n), (this.name = "CanceledError");
}
_.inherits(mn, Y, { __CANCEL__: !0 });
function qu(e, t, n) {
    const r = n.config.validateStatus;
    !n.status || !r || r(n.status) ? e(n) : t(new Y("Request failed with status code " + n.status, [Y.ERR_BAD_REQUEST, Y.ERR_BAD_RESPONSE][Math.floor(n.status / 100) - 4], n.config, n.request, n));
}
const Ku = Qe.isStandardBrowserEnv
    ? (function () {
          return {
              write: function (n, r, s, o, i, l) {
                  const c = [];
                  c.push(n + "=" + encodeURIComponent(r)),
                      _.isNumber(s) && c.push("expires=" + new Date(s).toGMTString()),
                      _.isString(o) && c.push("path=" + o),
                      _.isString(i) && c.push("domain=" + i),
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
function Wu(e) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(e);
}
function Vu(e, t) {
    return t ? e.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "") : e;
}
function Ji(e, t) {
    return e && !Wu(t) ? Vu(e, t) : t;
}
const Gu = Qe.isStandardBrowserEnv
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
                  const l = _.isString(i) ? s(i) : i;
                  return l.protocol === r.protocol && l.host === r.host;
              }
          );
      })()
    : (function () {
          return function () {
              return !0;
          };
      })();
function Ju(e) {
    const t = /^([-+\w]{1,25})(:?\/\/|:)/.exec(e);
    return (t && t[1]) || "";
}
function $u(e, t) {
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
function ro(e, t) {
    let n = 0;
    const r = $u(50, 250);
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
const Qu = typeof XMLHttpRequest < "u",
    Yu =
        Qu &&
        function (e) {
            return new Promise(function (n, r) {
                let s = e.data;
                const o = et.from(e.headers).normalize(),
                    i = e.responseType;
                let l;
                function c() {
                    e.cancelToken && e.cancelToken.unsubscribe(l), e.signal && e.signal.removeEventListener("abort", l);
                }
                _.isFormData(s) && (Qe.isStandardBrowserEnv || Qe.isStandardBrowserWebWorkerEnv) && o.setContentType(!1);
                let a = new XMLHttpRequest();
                if (e.auth) {
                    const g = e.auth.username || "",
                        y = e.auth.password ? unescape(encodeURIComponent(e.auth.password)) : "";
                    o.set("Authorization", "Basic " + btoa(g + ":" + y));
                }
                const u = Ji(e.baseURL, e.url);
                a.open(e.method.toUpperCase(), Ki(u, e.params, e.paramsSerializer), !0), (a.timeout = e.timeout);
                function h() {
                    if (!a) return;
                    const g = et.from("getAllResponseHeaders" in a && a.getAllResponseHeaders()),
                        E = { data: !i || i === "text" || i === "json" ? a.responseText : a.response, status: a.status, statusText: a.statusText, headers: g, config: e, request: a };
                    qu(
                        function (T) {
                            n(T), c();
                        },
                        function (T) {
                            r(T), c();
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
                        a && (r(new Y("Request aborted", Y.ECONNABORTED, e, a)), (a = null));
                    }),
                    (a.onerror = function () {
                        r(new Y("Network Error", Y.ERR_NETWORK, e, a)), (a = null);
                    }),
                    (a.ontimeout = function () {
                        let y = e.timeout ? "timeout of " + e.timeout + "ms exceeded" : "timeout exceeded";
                        const E = e.transitional || Wi;
                        e.timeoutErrorMessage && (y = e.timeoutErrorMessage), r(new Y(y, E.clarifyTimeoutError ? Y.ETIMEDOUT : Y.ECONNABORTED, e, a)), (a = null);
                    }),
                    Qe.isStandardBrowserEnv)
                ) {
                    const g = (e.withCredentials || Gu(u)) && e.xsrfCookieName && Ku.read(e.xsrfCookieName);
                    g && o.set(e.xsrfHeaderName, g);
                }
                s === void 0 && o.setContentType(null),
                    "setRequestHeader" in a &&
                        _.forEach(o.toJSON(), function (y, E) {
                            a.setRequestHeader(E, y);
                        }),
                    _.isUndefined(e.withCredentials) || (a.withCredentials = !!e.withCredentials),
                    i && i !== "json" && (a.responseType = e.responseType),
                    typeof e.onDownloadProgress == "function" && a.addEventListener("progress", ro(e.onDownloadProgress, !0)),
                    typeof e.onUploadProgress == "function" && a.upload && a.upload.addEventListener("progress", ro(e.onUploadProgress)),
                    (e.cancelToken || e.signal) &&
                        ((l = (g) => {
                            a && (r(!g || g.type ? new mn(null, e, a) : g), a.abort(), (a = null));
                        }),
                        e.cancelToken && e.cancelToken.subscribe(l),
                        e.signal && (e.signal.aborted ? l() : e.signal.addEventListener("abort", l)));
                const p = Ju(u);
                if (p && Qe.protocols.indexOf(p) === -1) {
                    r(new Y("Unsupported protocol " + p + ":", Y.ERR_BAD_REQUEST, e));
                    return;
                }
                a.send(s || null);
            });
        },
    Pn = { http: Eu, xhr: Yu };
_.forEach(Pn, (e, t) => {
    if (e) {
        try {
            Object.defineProperty(e, "name", { value: t });
        } catch {}
        Object.defineProperty(e, "adapterName", { value: t });
    }
});
const Xu = {
    getAdapter: (e) => {
        e = _.isArray(e) ? e : [e];
        const { length: t } = e;
        let n, r;
        for (let s = 0; s < t && ((n = e[s]), !(r = _.isString(n) ? Pn[n.toLowerCase()] : n)); s++);
        if (!r) throw r === !1 ? new Y(`Adapter ${n} is not supported by the environment`, "ERR_NOT_SUPPORT") : new Error(_.hasOwnProp(Pn, n) ? `Adapter '${n}' is not available in the build` : `Unknown adapter '${n}'`);
        if (!_.isFunction(r)) throw new TypeError("adapter is not a function");
        return r;
    },
    adapters: Pn,
};
function pr(e) {
    if ((e.cancelToken && e.cancelToken.throwIfRequested(), e.signal && e.signal.aborted)) throw new mn(null, e);
}
function so(e) {
    return (
        pr(e),
        (e.headers = et.from(e.headers)),
        (e.data = hr.call(e, e.transformRequest)),
        ["post", "put", "patch"].indexOf(e.method) !== -1 && e.headers.setContentType("application/x-www-form-urlencoded", !1),
        Xu.getAdapter(e.adapter || hs.adapter)(e).then(
            function (r) {
                return pr(e), (r.data = hr.call(e, e.transformResponse, r)), (r.headers = et.from(r.headers)), r;
            },
            function (r) {
                return Gi(r) || (pr(e), r && r.response && ((r.response.data = hr.call(e, e.transformResponse, r.response)), (r.response.headers = et.from(r.response.headers)))), Promise.reject(r);
            }
        )
    );
}
const oo = (e) => (e instanceof et ? e.toJSON() : e);
function Ht(e, t) {
    t = t || {};
    const n = {};
    function r(a, u, h) {
        return _.isPlainObject(a) && _.isPlainObject(u) ? _.merge.call({ caseless: h }, a, u) : _.isPlainObject(u) ? _.merge({}, u) : _.isArray(u) ? u.slice() : u;
    }
    function s(a, u, h) {
        if (_.isUndefined(u)) {
            if (!_.isUndefined(a)) return r(void 0, a, h);
        } else return r(a, u, h);
    }
    function o(a, u) {
        if (!_.isUndefined(u)) return r(void 0, u);
    }
    function i(a, u) {
        if (_.isUndefined(u)) {
            if (!_.isUndefined(a)) return r(void 0, a);
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
        headers: (a, u) => s(oo(a), oo(u), !0),
    };
    return (
        _.forEach(Object.keys(e).concat(Object.keys(t)), function (u) {
            const h = c[u] || s,
                p = h(e[u], t[u], u);
            (_.isUndefined(p) && h !== l) || (n[u] = p);
        }),
        n
    );
}
const $i = "1.3.4",
    ps = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((e, t) => {
    ps[e] = function (r) {
        return typeof r === e || "a" + (t < 1 ? "n " : " ") + e;
    };
});
const io = {};
ps.transitional = function (t, n, r) {
    function s(o, i) {
        return "[Axios v" + $i + "] Transitional option '" + o + "'" + i + (r ? ". " + r : "");
    }
    return (o, i, l) => {
        if (t === !1) throw new Y(s(i, " has been removed" + (n ? " in " + n : "")), Y.ERR_DEPRECATED);
        return n && !io[i] && ((io[i] = !0), console.warn(s(i, " has been deprecated since v" + n + " and will be removed in the near future"))), t ? t(o, i, l) : !0;
    };
};
function Zu(e, t, n) {
    if (typeof e != "object") throw new Y("options must be an object", Y.ERR_BAD_OPTION_VALUE);
    const r = Object.keys(e);
    let s = r.length;
    for (; s-- > 0; ) {
        const o = r[s],
            i = t[o];
        if (i) {
            const l = e[o],
                c = l === void 0 || i(l, o, e);
            if (c !== !0) throw new Y("option " + o + " must be " + c, Y.ERR_BAD_OPTION_VALUE);
            continue;
        }
        if (n !== !0) throw new Y("Unknown option " + o, Y.ERR_BAD_OPTION);
    }
}
const Dr = { assertOptions: Zu, validators: ps },
    it = Dr.validators;
class Dn {
    constructor(t) {
        (this.defaults = t), (this.interceptors = { request: new to(), response: new to() });
    }
    request(t, n) {
        typeof t == "string" ? ((n = n || {}), (n.url = t)) : (n = t || {}), (n = Ht(this.defaults, n));
        const { transitional: r, paramsSerializer: s, headers: o } = n;
        r !== void 0 && Dr.assertOptions(r, { silentJSONParsing: it.transitional(it.boolean), forcedJSONParsing: it.transitional(it.boolean), clarifyTimeoutError: it.transitional(it.boolean) }, !1),
            s !== void 0 && Dr.assertOptions(s, { encode: it.function, serialize: it.function }, !0),
            (n.method = (n.method || this.defaults.method || "get").toLowerCase());
        let i;
        (i = o && _.merge(o.common, o[n.method])),
            i &&
                _.forEach(["delete", "get", "head", "post", "put", "patch", "common"], (y) => {
                    delete o[y];
                }),
            (n.headers = et.concat(i, o));
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
            const y = [so.bind(this), void 0];
            for (y.unshift.apply(y, l), y.push.apply(y, a), p = y.length, u = Promise.resolve(n); h < p; ) u = u.then(y[h++], y[h++]);
            return u;
        }
        p = l.length;
        let g = n;
        for (h = 0; h < p; ) {
            const y = l[h++],
                E = l[h++];
            try {
                g = y(g);
            } catch (k) {
                E.call(this, k);
                break;
            }
        }
        try {
            u = so.call(this, g);
        } catch (y) {
            return Promise.reject(y);
        }
        for (h = 0, p = a.length; h < p; ) u = u.then(a[h++], a[h++]);
        return u;
    }
    getUri(t) {
        t = Ht(this.defaults, t);
        const n = Ji(t.baseURL, t.url);
        return Ki(n, t.params, t.paramsSerializer);
    }
}
_.forEach(["delete", "get", "head", "options"], function (t) {
    Dn.prototype[t] = function (n, r) {
        return this.request(Ht(r || {}, { method: t, url: n, data: (r || {}).data }));
    };
});
_.forEach(["post", "put", "patch"], function (t) {
    function n(r) {
        return function (o, i, l) {
            return this.request(Ht(l || {}, { method: t, headers: r ? { "Content-Type": "multipart/form-data" } : {}, url: o, data: i }));
        };
    }
    (Dn.prototype[t] = n()), (Dn.prototype[t + "Form"] = n(!0));
});
const Nn = Dn;
class ms {
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
                r.reason || ((r.reason = new mn(o, i, l)), n(r.reason));
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
            token: new ms(function (s) {
                t = s;
            }),
            cancel: t,
        };
    }
}
const ef = ms;
function tf(e) {
    return function (n) {
        return e.apply(null, n);
    };
}
function nf(e) {
    return _.isObject(e) && e.isAxiosError === !0;
}
const Lr = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511,
};
Object.entries(Lr).forEach(([e, t]) => {
    Lr[t] = e;
});
const rf = Lr;
function Qi(e) {
    const t = new Nn(e),
        n = Ni(Nn.prototype.request, t);
    return (
        _.extend(n, Nn.prototype, t, { allOwnKeys: !0 }),
        _.extend(n, t, null, { allOwnKeys: !0 }),
        (n.create = function (s) {
            return Qi(Ht(e, s));
        }),
        n
    );
}
const me = Qi(hs);
me.Axios = Nn;
me.CanceledError = mn;
me.CancelToken = ef;
me.isCancel = Gi;
me.VERSION = $i;
me.toFormData = Xn;
me.AxiosError = Y;
me.Cancel = me.CanceledError;
me.all = function (t) {
    return Promise.all(t);
};
me.spread = tf;
me.isAxiosError = nf;
me.mergeConfig = Ht;
me.AxiosHeaders = et;
me.formToJSON = (e) => Vi(_.isHTMLForm(e) ? new FormData(e) : e);
me.HttpStatusCode = rf;
me.default = me;
const lo = me,
    mr = {
        async post(e, t, n) {
            var r = null,
                s = null,
                o = localStorage.getItem("token"),
                i = o ? { Authorization: `Bearer ${o}` } : {};
            try {
                const l = await lo.post(e, t, { headers: i, ...n });
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
                const i = await lo.get(e, { headers: o, ...t });
                (n = i.status), (r = i.data);
            } catch (i) {
                if (!i.response) throw i;
                (n = i.response.status), (r = i.response.data);
            }
            return { status: n, data: r };
        },
    };
function sf(e) {
    return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var jr = {},
    of = {
        get exports() {
            return jr;
        },
        set exports(e) {
            jr = e;
        },
    },
    Yi = {};
function Fe(e, t) {
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
var lf = Fe;
Fe.prototype.reset = function () {
    (this._attempts = 1), (this._timeouts = this._originalTimeouts.slice(0));
};
Fe.prototype.stop = function () {
    this._timeout && clearTimeout(this._timeout), this._timer && clearTimeout(this._timer), (this._timeouts = []), (this._cachedTimeouts = null);
};
Fe.prototype.retry = function (e) {
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
Fe.prototype.attempt = function (e, t) {
    (this._fn = e), t && (t.timeout && (this._operationTimeout = t.timeout), t.cb && (this._operationTimeoutCb = t.cb));
    var n = this;
    this._operationTimeoutCb &&
        (this._timeout = setTimeout(function () {
            n._operationTimeoutCb();
        }, n._operationTimeout)),
        (this._operationStart = new Date().getTime()),
        this._fn(this._attempts);
};
Fe.prototype.try = function (e) {
    console.log("Using RetryOperation.try() is deprecated"), this.attempt(e);
};
Fe.prototype.start = function (e) {
    console.log("Using RetryOperation.start() is deprecated"), this.attempt(e);
};
Fe.prototype.start = Fe.prototype.try;
Fe.prototype.errors = function () {
    return this._errors;
};
Fe.prototype.attempts = function () {
    return this._attempts;
};
Fe.prototype.mainError = function () {
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
    var t = lf;
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
                    p.push(function (y) {
                        h.retry(y) || (y && (arguments[0] = h.mainError()), g.apply(this, arguments));
                    }),
                        h.attempt(function () {
                            u.apply(n, p);
                        });
                }.bind(n, c)),
                    (n[l].options = r);
            }
        });
})(Yi);
(function (e) {
    e.exports = Yi;
})(of);
const gr = sf(jr),
    cf = 5e3;
function Xi(e) {
    return {
        async fetchResultByGameNumber(t) {
            const n = gr.operation({ retries: 1, minTimeout: 2e3, maxTimeout: 2e3 });
            return new Promise((r, s) => {
                n.attempt(async (o) => {
                    try {
                        const i = await mr.get(`${e}/api/number?gameNumber=${t}`, { timeout: cf });
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
            const t = gr.operation({ retries: 100, minTimeout: 1e3, maxTimeout: 6e4, randomize: !0 });
            return new Promise((n, r) => {
                t.attempt(async (s) => {
                    try {
                        const o = await mr.get(`${e}/api/open`, { timeout: 5e3 });
                        if (o.status === 200) n(o);
                        else throw new Error(o);
                    } catch (o) {
                        if (t.retry(o)) return;
                        r(o);
                    }
                });
            });
        },
        async fetchRecentResults() {
            const t = gr.operation({ retries: 100, minTimeout: 1e3, maxTimeout: 6e4, randomize: !0 });
            return new Promise((n, r) => {
                t.attempt(async (s) => {
                    try {
                        const o = await mr.get(`${e}/api/recent`, { timeout: 5e3 });
                        if (o.status === 200) n(o);
                        else throw new Error(o);
                    } catch (o) {
                        if (t.retry(o)) return;
                        r(o);
                    }
                });
            });
        },
    };
}
let Sn = Xi("");
const Pt = { numbers: "numbers", betsClosed: "betsClosed", placeBet: "placeBet" },
    af = Ka("game", {
        state: () => ({
            countdownMinutes: 0,
            delayMinutes: 0,
            nextDrawRemainingMinutes: "00",
            nextDrawRemainingSeconds: "00",
            nextDrawRemainingTotalSeconds: 0,
            drawStarted: !1,
            drawSeconds: 24,
            initializing: !0,
            openGameNumber: null,
            recentResults: [],
            sorted: [],
            centerCirlce: Pt.placeBet,
            showWheelBling: !1,
            angle: 0,
            speed: 0,
            pinAngle: 0,
            pinNumber: 1,
            showInfo: !1,
            baseUrl: "",
        }),
        actions: {
            reInitializeGame() {
                (this.drawStarted = !1), (this.showWheelBling = !1), (this.centerCirlce = Pt.placeBet), this.openGameNumber++;
            },
            async initializeGame(e, t, n) {
                e=4, t=1, n='https://mayabet2.pythonanywhere.com/spin',
                (this.baseUrl = n), (this.countdownMinutes = e), (this.delayMinutes = t), (Sn = Xi('https://mayabet2.pythonanywhere.com/spin'));
                const r = await Sn.fetchOpenGame();
                (this.openGameNumber = r.data.openGame.gameNumber),
                    await this.setRecentGames(r.data.recent),
                    (this.angle = this.getAngleByNumber(this.recentResults[0].gameResult)),
                    this.updatePinAngle(),
                    (this.initializing = !1),
                    (this.drawStarted = !1);
            },
            async update() {
                if ((this.updateGameCountdown(), this.nextDrawRemainingTotalSeconds == this.countdownMinutes * 60 - 1 && !this.drawStarted)) {
                    (this.drawStarted = !0), (this.centerCirlce = Pt.betsClosed);
                    let e = Sn.fetchResultByGameNumber(this.openGameNumber);
                    setTimeout(() => this.awaitGameResults(e), 5e3);
                }
                this.nextDrawRemainingTotalSeconds == 7 && (this.showWheelBling = !0);
            },
            updateGameCountdown() {
                var e = new Date(new Date().getTime() + this.delayMinutes * 60 * 1e3),
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
            async setRecentGames(e) {
                this.recentResults = e;
                const t = new Map();
                for (let r = 0; r < 37; r++) t.set(r, this.recentResults.filter((s) => s.gameResult == r).length);
                const n = new Map([...t.entries()].sort((r, s) => s[1] - r[1]));
                this.sorted = Array.from(n.keys());
            },
            async awaitGameResults(e) {
                try {
                    e = await e;
                } catch {
                    this.reInitializeGame(), await this.syncOpenGame();
                    return;
                }
                const { data: t } = e;
                if (t.result.gameNumber < t.recent[0].gameNumber) (t.result = t.recent[0]), (this.openGameNumber = t.result.gameNumber);
                else if (t.result.gameNumber > t.recent[0].gameNumber) {
                    this.reInitializeGame(), await this.syncOpenGame();
                    return;
                }
                this.rotate(t), (this.centerCirlce = Pt.numbers);
            },
            getAngleByNumber(e) {
                const n = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26].indexOf(e);
                if (n != -1) return (-360 / 37) * n;
            },
            getRandomNumber(e, t) {
                return Math.random() * (t - e) + e;
            },
            getDeceleration(e, t) {
                return -(e * e) / (2 * t);
            },
            getElapsedSeconds(e) {
                return (new Date().getTime() - e) / 1e3;
            },
            updatePinAngle() {
                const e = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26],
                    t = 35,
                    n = -360 / 37 / 2 + 1.5,
                    r = n - 6,
                    s = this.angle % (360 / 37);
                let o = Math.floor(((this.angle % 360) - r) / (-360 / 37)) + 1;
                (o = o == 37 ? 0 : o), (this.pinNumber = e[o]), s > n || s <= r ? (this.pinAngle = 0) : (this.pinAngle = t - ((s - r) / (n - r)) * t);
            },
            updateWheelAngle(e, t, n, r) {
                const s = e * t + 0.5 * n * t * t;
                this.angle = r + s;
            },
            updateSpeed(e, t, n) {
                this.speed = e + t * n;
            },
            rotate(e) {
                const t = this.angle,
                    n = new Date().getTime(),
                    r = -90,
                    s = -25,
                    o = setInterval(() => {
                        const i = this.getElapsedSeconds(n);
                        this.updateSpeed(r, i, s), this.updateWheelAngle(r, i, s, t), this.updatePinAngle();
                    }, 5);
                setTimeout(() => {
                    clearInterval(o), this.stop(e);
                }, 5e3);
            },
            stop(e) {
                const t = this.getAngleByNumber(e.result.gameResult),
                    n = 4,
                    r = -360 - (this.angle % 360) - 360 * n + t,
                    s = this.angle,
                    o = new Date().getTime(),
                    i = this.speed,
                    l = this.getDeceleration(i, r),
                    c = setInterval(() => {
                        const a = this.getElapsedSeconds(o);
                        this.updateSpeed(i, a, l), !(this.speed >= 0) && (this.updateWheelAngle(i, a, l, s), this.updatePinAngle());
                    }, 5);
                setTimeout(() => {
                    clearInterval(c),
                        setTimeout(async () => {
                            await this.setRecentGames(e.recent), (this.openGameNumber = e.openGame.gameNumber), (this.drawStarted = !1), (this.centerCirlce = Pt.placeBet), (this.showWheelBling = !1), await this.syncOpenGame();
                        }, 15e3);
                }, (-i / l) * 1e3);
            },
            async syncOpenGame() {
                try {
                    const e = await Sn.fetchOpenGame();
                    this.openGameNumber = e.data.openGame.gameNumber;
                } catch {}
            },
        },
    });
/*!
 * vue-router v4.2.1
 * (c) 2023 Eduardo San Martin Morote
 * @license MIT
 */ const Nt = typeof window < "u";
function uf(e) {
    return e.__esModule || e[Symbol.toStringTag] === "Module";
}
const te = Object.assign;
function yr(e, t) {
    const n = {};
    for (const r in t) {
        const s = t[r];
        n[r] = qe(s) ? s.map(e) : e(s);
    }
    return n;
}
const rn = () => {},
    qe = Array.isArray,
    ff = /\/$/,
    df = (e) => e.replace(ff, "");
function br(e, t, n = "/") {
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
        (r = gf(r ?? t, n)),
        { fullPath: r + (o && "?") + o + i, path: r, query: s, hash: i }
    );
}
function hf(e, t) {
    const n = t.query ? e(t.query) : "";
    return t.path + (n && "?") + n + (t.hash || "");
}
function co(e, t) {
    return !t || !e.toLowerCase().startsWith(t.toLowerCase()) ? e : e.slice(t.length) || "/";
}
function pf(e, t, n) {
    const r = t.matched.length - 1,
        s = n.matched.length - 1;
    return r > -1 && r === s && zt(t.matched[r], n.matched[s]) && Zi(t.params, n.params) && e(t.query) === e(n.query) && t.hash === n.hash;
}
function zt(e, t) {
    return (e.aliasOf || e) === (t.aliasOf || t);
}
function Zi(e, t) {
    if (Object.keys(e).length !== Object.keys(t).length) return !1;
    for (const n in e) if (!mf(e[n], t[n])) return !1;
    return !0;
}
function mf(e, t) {
    return qe(e) ? ao(e, t) : qe(t) ? ao(t, e) : e === t;
}
function ao(e, t) {
    return qe(t) ? e.length === t.length && e.every((n, r) => n === t[r]) : e.length === 1 && e[0] === t;
}
function gf(e, t) {
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
var hn;
(function (e) {
    (e.pop = "pop"), (e.push = "push");
})(hn || (hn = {}));
var sn;
(function (e) {
    (e.back = "back"), (e.forward = "forward"), (e.unknown = "");
})(sn || (sn = {}));
function yf(e) {
    if (!e)
        if (Nt) {
            const t = document.querySelector("base");
            (e = (t && t.getAttribute("href")) || "/"), (e = e.replace(/^\w+:\/\/[^\/]+/, ""));
        } else e = "/";
    return e[0] !== "/" && e[0] !== "#" && (e = "/" + e), df(e);
}
const bf = /^[^#]+#/;
function _f(e, t) {
    return e.replace(bf, "#") + t;
}
function wf(e, t) {
    const n = document.documentElement.getBoundingClientRect(),
        r = e.getBoundingClientRect();
    return { behavior: t.behavior, left: r.left - n.left - (t.left || 0), top: r.top - n.top - (t.top || 0) };
}
const tr = () => ({ left: window.pageXOffset, top: window.pageYOffset });
function Rf(e) {
    let t;
    if ("el" in e) {
        const n = e.el,
            r = typeof n == "string" && n.startsWith("#"),
            s = typeof n == "string" ? (r ? document.getElementById(n.slice(1)) : document.querySelector(n)) : n;
        if (!s) return;
        t = wf(s, e);
    } else t = e;
    "scrollBehavior" in document.documentElement.style ? window.scrollTo(t) : window.scrollTo(t.left != null ? t.left : window.pageXOffset, t.top != null ? t.top : window.pageYOffset);
}
function uo(e, t) {
    return (history.state ? history.state.position - t : -1) + e;
}
const Ur = new Map();
function Ef(e, t) {
    Ur.set(e, t);
}
function Sf(e) {
    const t = Ur.get(e);
    return Ur.delete(e), t;
}
let vf = () => location.protocol + "//" + location.host;
function el(e, t) {
    const { pathname: n, search: r, hash: s } = t,
        o = e.indexOf("#");
    if (o > -1) {
        let l = s.includes(e.slice(o)) ? e.slice(o).length : 1,
            c = s.slice(l);
        return c[0] !== "/" && (c = "/" + c), co(c, "");
    }
    return co(n, e) + r + s;
}
function xf(e, t, n, r) {
    let s = [],
        o = [],
        i = null;
    const l = ({ state: p }) => {
        const g = el(e, location),
            y = n.value,
            E = t.value;
        let k = 0;
        if (p) {
            if (((n.value = g), (t.value = p), i && i === y)) {
                i = null;
                return;
            }
            k = E ? p.position - E.position : 0;
        } else r(g);
        s.forEach((T) => {
            T(n.value, y, { delta: k, type: hn.pop, direction: k ? (k > 0 ? sn.forward : sn.back) : sn.unknown });
        });
    };
    function c() {
        i = n.value;
    }
    function a(p) {
        s.push(p);
        const g = () => {
            const y = s.indexOf(p);
            y > -1 && s.splice(y, 1);
        };
        return o.push(g), g;
    }
    function u() {
        const { history: p } = window;
        p.state && p.replaceState(te({}, p.state, { scroll: tr() }), "");
    }
    function h() {
        for (const p of o) p();
        (o = []), window.removeEventListener("popstate", l), window.removeEventListener("beforeunload", u);
    }
    return window.addEventListener("popstate", l), window.addEventListener("beforeunload", u, { passive: !0 }), { pauseListeners: c, listen: a, destroy: h };
}
function fo(e, t, n, r = !1, s = !1) {
    return { back: e, current: t, forward: n, replaced: r, position: window.history.length, scroll: s ? tr() : null };
}
function Cf(e) {
    const { history: t, location: n } = window,
        r = { value: el(e, n) },
        s = { value: t.state };
    s.value || o(r.value, { back: null, current: r.value, forward: null, position: t.length - 1, replaced: !0, scroll: null }, !0);
    function o(c, a, u) {
        const h = e.indexOf("#"),
            p = h > -1 ? (n.host && document.querySelector("base") ? e : e.slice(h)) + c : vf() + e + c;
        try {
            t[u ? "replaceState" : "pushState"](a, "", p), (s.value = a);
        } catch (g) {
            console.error(g), n[u ? "replace" : "assign"](p);
        }
    }
    function i(c, a) {
        const u = te({}, t.state, fo(s.value.back, c, s.value.forward, !0), a, { position: s.value.position });
        o(c, u, !0), (r.value = c);
    }
    function l(c, a) {
        const u = te({}, s.value, t.state, { forward: c, scroll: tr() });
        o(u.current, u, !0);
        const h = te({}, fo(r.value, c, null), { position: u.position + 1 }, a);
        o(c, h, !1), (r.value = c);
    }
    return { location: r, state: s, push: l, replace: i };
}
function Af(e) {
    e = yf(e);
    const t = Cf(e),
        n = xf(e, t.state, t.location, t.replace);
    function r(o, i = !0) {
        i || n.pauseListeners(), history.go(o);
    }
    const s = te({ location: "", base: e, go: r, createHref: _f.bind(null, e) }, t, n);
    return Object.defineProperty(s, "location", { enumerable: !0, get: () => t.location.value }), Object.defineProperty(s, "state", { enumerable: !0, get: () => t.state.value }), s;
}
function Of(e) {
    return (e = location.host ? e || location.pathname + location.search : ""), e.includes("#") || (e += "#"), Af(e);
}
function Tf(e) {
    return typeof e == "string" || (e && typeof e == "object");
}
function tl(e) {
    return typeof e == "string" || typeof e == "symbol";
}
const lt = { path: "/", name: void 0, params: {}, query: {}, hash: "", fullPath: "/", matched: [], meta: {}, redirectedFrom: void 0 },
    nl = Symbol("");
var ho;
(function (e) {
    (e[(e.aborted = 4)] = "aborted"), (e[(e.cancelled = 8)] = "cancelled"), (e[(e.duplicated = 16)] = "duplicated");
})(ho || (ho = {}));
function qt(e, t) {
    return te(new Error(), { type: e, [nl]: !0 }, t);
}
function Xe(e, t) {
    return e instanceof Error && nl in e && (t == null || !!(e.type & t));
}
const po = "[^/]+?",
    Pf = { sensitive: !1, strict: !1, start: !0, end: !0 },
    Nf = /[.+*?^${}()[\]/\\]/g;
function Mf(e, t) {
    const n = te({}, Pf, t),
        r = [];
    let s = n.start ? "^" : "";
    const o = [];
    for (const a of e) {
        const u = a.length ? [] : [90];
        n.strict && !a.length && (s += "/");
        for (let h = 0; h < a.length; h++) {
            const p = a[h];
            let g = 40 + (n.sensitive ? 0.25 : 0);
            if (p.type === 0) h || (s += "/"), (s += p.value.replace(Nf, "\\$&")), (g += 40);
            else if (p.type === 1) {
                const { value: y, repeatable: E, optional: k, regexp: T } = p;
                o.push({ name: y, repeatable: E, optional: k });
                const D = T || po;
                if (D !== po) {
                    g += 10;
                    try {
                        new RegExp(`(${D})`);
                    } catch (K) {
                        throw new Error(`Invalid custom RegExp for param "${y}" (${D}): ` + K.message);
                    }
                }
                let I = E ? `((?:${D})(?:/(?:${D}))*)` : `(${D})`;
                h || (I = k && a.length < 2 ? `(?:/${I})` : "/" + I), k && (I += "?"), (s += I), (g += 20), k && (g += -8), E && (g += -20), D === ".*" && (g += -50);
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
                y = o[p - 1];
            h[y.name] = g && y.repeatable ? g.split("/") : g;
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
                    const { value: y, repeatable: E, optional: k } = g,
                        T = y in a ? a[y] : "";
                    if (qe(T) && !E) throw new Error(`Provided param "${y}" is an array but it is not repeatable (* or + modifiers)`);
                    const D = qe(T) ? T.join("/") : T;
                    if (!D)
                        if (k) p.length < 2 && (u.endsWith("/") ? (u = u.slice(0, -1)) : (h = !0));
                        else throw new Error(`Missing required param "${y}"`);
                    u += D;
                }
        }
        return u || "/";
    }
    return { re: i, score: r, keys: o, parse: l, stringify: c };
}
function If(e, t) {
    let n = 0;
    for (; n < e.length && n < t.length; ) {
        const r = t[n] - e[n];
        if (r) return r;
        n++;
    }
    return e.length < t.length ? (e.length === 1 && e[0] === 40 + 40 ? -1 : 1) : e.length > t.length ? (t.length === 1 && t[0] === 40 + 40 ? 1 : -1) : 0;
}
function Ff(e, t) {
    let n = 0;
    const r = e.score,
        s = t.score;
    for (; n < r.length && n < s.length; ) {
        const o = If(r[n], s[n]);
        if (o) return o;
        n++;
    }
    if (Math.abs(s.length - r.length) === 1) {
        if (mo(r)) return 1;
        if (mo(s)) return -1;
    }
    return s.length - r.length;
}
function mo(e) {
    const t = e[e.length - 1];
    return e.length > 0 && t[t.length - 1] < 0;
}
const kf = { type: 0, value: "" },
    Bf = /[a-zA-Z0-9_]/;
function Df(e) {
    if (!e) return [[]];
    if (e === "/") return [[kf]];
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
                c === "(" ? (n = 2) : Bf.test(c) ? p() : (h(), (n = 0), c !== "*" && c !== "?" && c !== "+" && l--);
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
function Lf(e, t, n) {
    const r = Mf(Df(e.path), n),
        s = te(r, { record: e, parent: t, children: [], alias: [] });
    return t && !s.record.aliasOf == !t.record.aliasOf && t.children.push(s), s;
}
function jf(e, t) {
    const n = [],
        r = new Map();
    t = bo({ strict: !1, end: !0, sensitive: !1 }, t);
    function s(u) {
        return r.get(u);
    }
    function o(u, h, p) {
        const g = !p,
            y = Uf(u);
        y.aliasOf = p && p.record;
        const E = bo(t, u),
            k = [y];
        if ("alias" in u) {
            const I = typeof u.alias == "string" ? [u.alias] : u.alias;
            for (const K of I) k.push(te({}, y, { components: p ? p.record.components : y.components, path: K, aliasOf: p ? p.record : y }));
        }
        let T, D;
        for (const I of k) {
            const { path: K } = I;
            if (h && K[0] !== "/") {
                const G = h.record.path,
                    ce = G[G.length - 1] === "/" ? "" : "/";
                I.path = h.record.path + (K && ce + K);
            }
            if (((T = Lf(I, h, E)), p ? p.alias.push(T) : ((D = D || T), D !== T && D.alias.push(T), g && u.name && !yo(T) && i(u.name)), y.children)) {
                const G = y.children;
                for (let ce = 0; ce < G.length; ce++) o(G[ce], T, p && p.children[ce]);
            }
            (p = p || T), ((T.record.components && Object.keys(T.record.components).length) || T.record.name || T.record.redirect) && c(T);
        }
        return D
            ? () => {
                  i(D);
              }
            : rn;
    }
    function i(u) {
        if (tl(u)) {
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
        for (; h < n.length && Ff(u, n[h]) >= 0 && (u.record.path !== n[h].record.path || !rl(u, n[h])); ) h++;
        n.splice(h, 0, u), u.record.name && !yo(u) && r.set(u.record.name, u);
    }
    function a(u, h) {
        let p,
            g = {},
            y,
            E;
        if ("name" in u && u.name) {
            if (((p = r.get(u.name)), !p)) throw qt(1, { location: u });
            (E = p.record.name),
                (g = te(
                    go(
                        h.params,
                        p.keys.filter((D) => !D.optional).map((D) => D.name)
                    ),
                    u.params &&
                        go(
                            u.params,
                            p.keys.map((D) => D.name)
                        )
                )),
                (y = p.stringify(g));
        } else if ("path" in u) (y = u.path), (p = n.find((D) => D.re.test(y))), p && ((g = p.parse(y)), (E = p.record.name));
        else {
            if (((p = h.name ? r.get(h.name) : n.find((D) => D.re.test(h.path))), !p)) throw qt(1, { location: u, currentLocation: h });
            (E = p.record.name), (g = te({}, h.params, u.params)), (y = p.stringify(g));
        }
        const k = [];
        let T = p;
        for (; T; ) k.unshift(T.record), (T = T.parent);
        return { name: E, path: y, params: g, matched: k, meta: zf(k) };
    }
    return e.forEach((u) => o(u)), { addRoute: o, resolve: a, removeRoute: i, getRoutes: l, getRecordMatcher: s };
}
function go(e, t) {
    const n = {};
    for (const r of t) r in e && (n[r] = e[r]);
    return n;
}
function Uf(e) {
    return {
        path: e.path,
        redirect: e.redirect,
        name: e.name,
        meta: e.meta || {},
        aliasOf: void 0,
        beforeEnter: e.beforeEnter,
        props: Hf(e),
        children: e.children || [],
        instances: {},
        leaveGuards: new Set(),
        updateGuards: new Set(),
        enterCallbacks: {},
        components: "components" in e ? e.components || null : e.component && { default: e.component },
    };
}
function Hf(e) {
    const t = {},
        n = e.props || !1;
    if ("component" in e) t.default = n;
    else for (const r in e.components) t[r] = typeof n == "boolean" ? n : n[r];
    return t;
}
function yo(e) {
    for (; e; ) {
        if (e.record.aliasOf) return !0;
        e = e.parent;
    }
    return !1;
}
function zf(e) {
    return e.reduce((t, n) => te(t, n.meta), {});
}
function bo(e, t) {
    const n = {};
    for (const r in e) n[r] = r in t ? t[r] : e[r];
    return n;
}
function rl(e, t) {
    return t.children.some((n) => n === e || rl(e, n));
}
const sl = /#/g,
    qf = /&/g,
    Kf = /\//g,
    Wf = /=/g,
    Vf = /\?/g,
    ol = /\+/g,
    Gf = /%5B/g,
    Jf = /%5D/g,
    il = /%5E/g,
    $f = /%60/g,
    ll = /%7B/g,
    Qf = /%7C/g,
    cl = /%7D/g,
    Yf = /%20/g;
function gs(e) {
    return encodeURI("" + e)
        .replace(Qf, "|")
        .replace(Gf, "[")
        .replace(Jf, "]");
}
function Xf(e) {
    return gs(e).replace(ll, "{").replace(cl, "}").replace(il, "^");
}
function Hr(e) {
    return gs(e).replace(ol, "%2B").replace(Yf, "+").replace(sl, "%23").replace(qf, "%26").replace($f, "`").replace(ll, "{").replace(cl, "}").replace(il, "^");
}
function Zf(e) {
    return Hr(e).replace(Wf, "%3D");
}
function ed(e) {
    return gs(e).replace(sl, "%23").replace(Vf, "%3F");
}
function td(e) {
    return e == null ? "" : ed(e).replace(Kf, "%2F");
}
function Ln(e) {
    try {
        return decodeURIComponent("" + e);
    } catch {}
    return "" + e;
}
function nd(e) {
    const t = {};
    if (e === "" || e === "?") return t;
    const r = (e[0] === "?" ? e.slice(1) : e).split("&");
    for (let s = 0; s < r.length; ++s) {
        const o = r[s].replace(ol, " "),
            i = o.indexOf("="),
            l = Ln(i < 0 ? o : o.slice(0, i)),
            c = i < 0 ? null : Ln(o.slice(i + 1));
        if (l in t) {
            let a = t[l];
            qe(a) || (a = t[l] = [a]), a.push(c);
        } else t[l] = c;
    }
    return t;
}
function _o(e) {
    let t = "";
    for (let n in e) {
        const r = e[n];
        if (((n = Zf(n)), r == null)) {
            r !== void 0 && (t += (t.length ? "&" : "") + n);
            continue;
        }
        (qe(r) ? r.map((o) => o && Hr(o)) : [r && Hr(r)]).forEach((o) => {
            o !== void 0 && ((t += (t.length ? "&" : "") + n), o != null && (t += "=" + o));
        });
    }
    return t;
}
function rd(e) {
    const t = {};
    for (const n in e) {
        const r = e[n];
        r !== void 0 && (t[n] = qe(r) ? r.map((s) => (s == null ? null : "" + s)) : r == null ? r : "" + r);
    }
    return t;
}
const sd = Symbol(""),
    wo = Symbol(""),
    ys = Symbol(""),
    bs = Symbol(""),
    zr = Symbol("");
function Yt() {
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
function ut(e, t, n, r, s) {
    const o = r && (r.enterCallbacks[s] = r.enterCallbacks[s] || []);
    return () =>
        new Promise((i, l) => {
            const c = (h) => {
                    h === !1 ? l(qt(4, { from: n, to: t })) : h instanceof Error ? l(h) : Tf(h) ? l(qt(2, { from: t, to: h })) : (o && r.enterCallbacks[s] === o && typeof h == "function" && o.push(h), i());
                },
                a = e.call(r && r.instances[s], t, n, c);
            let u = Promise.resolve(a);
            e.length < 3 && (u = u.then(c)), u.catch((h) => l(h));
        });
}
function _r(e, t, n, r) {
    const s = [];
    for (const o of e)
        for (const i in o.components) {
            let l = o.components[i];
            if (!(t !== "beforeRouteEnter" && !o.instances[i]))
                if (od(l)) {
                    const a = (l.__vccOpts || l)[t];
                    a && s.push(ut(a, n, r, o, i));
                } else {
                    let c = l();
                    s.push(() =>
                        c.then((a) => {
                            if (!a) return Promise.reject(new Error(`Couldn't resolve component "${i}" at "${o.path}"`));
                            const u = uf(a) ? a.default : a;
                            o.components[i] = u;
                            const p = (u.__vccOpts || u)[t];
                            return p && ut(p, n, r, o, i)();
                        })
                    );
                }
        }
    return s;
}
function od(e) {
    return typeof e == "object" || "displayName" in e || "props" in e || "__vccOpts" in e;
}
function Ro(e) {
    const t = He(ys),
        n = He(bs),
        r = Pe(() => t.resolve(kt(e.to))),
        s = Pe(() => {
            const { matched: c } = r.value,
                { length: a } = c,
                u = c[a - 1],
                h = n.matched;
            if (!u || !h.length) return -1;
            const p = h.findIndex(zt.bind(null, u));
            if (p > -1) return p;
            const g = Eo(c[a - 2]);
            return a > 1 && Eo(u) === g && h[h.length - 1].path !== g ? h.findIndex(zt.bind(null, c[a - 2])) : p;
        }),
        o = Pe(() => s.value > -1 && ad(n.params, r.value.params)),
        i = Pe(() => s.value > -1 && s.value === n.matched.length - 1 && Zi(n.params, r.value.params));
    function l(c = {}) {
        return cd(c) ? t[kt(e.replace) ? "replace" : "push"](kt(e.to)).catch(rn) : Promise.resolve();
    }
    return { route: r, href: Pe(() => r.value.href), isActive: o, isExactActive: i, navigate: l };
}
const id = ci({
        name: "RouterLink",
        compatConfig: { MODE: 3 },
        props: { to: { type: [String, Object], required: !0 }, replace: Boolean, activeClass: String, exactActiveClass: String, custom: Boolean, ariaCurrentValue: { type: String, default: "page" } },
        useLink: Ro,
        setup(e, { slots: t }) {
            const n = Gt(Ro(e)),
                { options: r } = He(ys),
                s = Pe(() => ({ [So(e.activeClass, r.linkActiveClass, "router-link-active")]: n.isActive, [So(e.exactActiveClass, r.linkExactActiveClass, "router-link-exact-active")]: n.isExactActive }));
            return () => {
                const o = t.default && t.default(n);
                return e.custom ? o : Ci("a", { "aria-current": n.isExactActive ? e.ariaCurrentValue : null, href: n.href, onClick: n.navigate, class: s.value }, o);
            };
        },
    }),
    ld = id;
function cd(e) {
    if (!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && !e.defaultPrevented && !(e.button !== void 0 && e.button !== 0)) {
        if (e.currentTarget && e.currentTarget.getAttribute) {
            const t = e.currentTarget.getAttribute("target");
            if (/\b_blank\b/i.test(t)) return;
        }
        return e.preventDefault && e.preventDefault(), !0;
    }
}
function ad(e, t) {
    for (const n in t) {
        const r = t[n],
            s = e[n];
        if (typeof r == "string") {
            if (r !== s) return !1;
        } else if (!qe(s) || s.length !== r.length || r.some((o, i) => o !== s[i])) return !1;
    }
    return !0;
}
function Eo(e) {
    return e ? (e.aliasOf ? e.aliasOf.path : e.path) : "";
}
const So = (e, t, n) => e ?? t ?? n,
    ud = ci({
        name: "RouterView",
        inheritAttrs: !1,
        props: { name: { type: String, default: "default" }, route: Object },
        compatConfig: { MODE: 3 },
        setup(e, { attrs: t, slots: n }) {
            const r = He(zr),
                s = Pe(() => e.route || r.value),
                o = He(wo, 0),
                i = Pe(() => {
                    let a = kt(o);
                    const { matched: u } = s.value;
                    let h;
                    for (; (h = u[a]) && !h.components; ) a++;
                    return a;
                }),
                l = Pe(() => s.value.matched[i.value]);
            xn(
                wo,
                Pe(() => i.value + 1)
            ),
                xn(sd, l),
                xn(zr, s);
            const c = ts();
            return (
                Zt(
                    () => [c.value, l.value, e.name],
                    ([a, u, h], [p, g, y]) => {
                        u && ((u.instances[h] = a), g && g !== u && a && a === p && (u.leaveGuards.size || (u.leaveGuards = g.leaveGuards), u.updateGuards.size || (u.updateGuards = g.updateGuards))),
                            a && u && (!g || !zt(u, g) || !p) && (u.enterCallbacks[h] || []).forEach((E) => E(a));
                    },
                    { flush: "post" }
                ),
                () => {
                    const a = s.value,
                        u = e.name,
                        h = l.value,
                        p = h && h.components[u];
                    if (!p) return vo(n.default, { Component: p, route: a });
                    const g = h.props[u],
                        y = g ? (g === !0 ? a.params : typeof g == "function" ? g(a) : g) : null,
                        k = Ci(
                            p,
                            te({}, y, t, {
                                onVnodeUnmounted: (T) => {
                                    T.component.isUnmounted && (h.instances[u] = null);
                                },
                                ref: c,
                            })
                        );
                    return vo(n.default, { Component: k, route: a }) || k;
                }
            );
        },
    });
function vo(e, t) {
    if (!e) return null;
    const n = e(t);
    return n.length === 1 ? n[0] : n;
}
const fd = ud;
function dd(e) {
    const t = jf(e.routes, e),
        n = e.parseQuery || nd,
        r = e.stringifyQuery || _o,
        s = e.history,
        o = Yt(),
        i = Yt(),
        l = Yt(),
        c = ec(lt);
    let a = lt;
    Nt && e.scrollBehavior && "scrollRestoration" in history && (history.scrollRestoration = "manual");
    const u = yr.bind(null, (w) => "" + w),
        h = yr.bind(null, td),
        p = yr.bind(null, Ln);
    function g(w, N) {
        let O, B;
        return tl(w) ? ((O = t.getRecordMatcher(w)), (B = N)) : (B = w), t.addRoute(B, O);
    }
    function y(w) {
        const N = t.getRecordMatcher(w);
        N && t.removeRoute(N);
    }
    function E() {
        return t.getRoutes().map((w) => w.record);
    }
    function k(w) {
        return !!t.getRecordMatcher(w);
    }
    function T(w, N) {
        if (((N = te({}, N || c.value)), typeof w == "string")) {
            const m = br(n, w, N.path),
                b = t.resolve({ path: m.path }, N),
                R = s.createHref(m.fullPath);
            return te(m, b, { params: p(b.params), hash: Ln(m.hash), redirectedFrom: void 0, href: R });
        }
        let O;
        if ("path" in w) O = te({}, w, { path: br(n, w.path, N.path).path });
        else {
            const m = te({}, w.params);
            for (const b in m) m[b] == null && delete m[b];
            (O = te({}, w, { params: h(m) })), (N.params = h(N.params));
        }
        const B = t.resolve(O, N),
            ee = w.hash || "";
        B.params = u(p(B.params));
        const f = hf(r, te({}, w, { hash: Xf(ee), path: B.path })),
            d = s.createHref(f);
        return te({ fullPath: f, hash: ee, query: r === _o ? rd(w.query) : w.query || {} }, B, { redirectedFrom: void 0, href: d });
    }
    function D(w) {
        return typeof w == "string" ? br(n, w, c.value.path) : te({}, w);
    }
    function I(w, N) {
        if (a !== w) return qt(8, { from: N, to: w });
    }
    function K(w) {
        return W(w);
    }
    function G(w) {
        return K(te(D(w), { replace: !0 }));
    }
    function ce(w) {
        const N = w.matched[w.matched.length - 1];
        if (N && N.redirect) {
            const { redirect: O } = N;
            let B = typeof O == "function" ? O(w) : O;
            return typeof B == "string" && ((B = B.includes("?") || B.includes("#") ? (B = D(B)) : { path: B }), (B.params = {})), te({ query: w.query, hash: w.hash, params: "path" in B ? {} : w.params }, B);
        }
    }
    function W(w, N) {
        const O = (a = T(w)),
            B = c.value,
            ee = w.state,
            f = w.force,
            d = w.replace === !0,
            m = ce(O);
        if (m) return W(te(D(m), { state: typeof m == "object" ? te({}, ee, m.state) : ee, force: f, replace: d }), N || O);
        const b = O;
        b.redirectedFrom = N;
        let R;
        return (
            !f && pf(r, B, O) && ((R = qt(16, { to: b, from: B })), Ke(B, B, !0, !1)),
            (R ? Promise.resolve(R) : $(b, B))
                .catch((S) => (Xe(S) ? (Xe(S, 2) ? S : st(S)) : Z(S, b, B)))
                .then((S) => {
                    if (S) {
                        if (Xe(S, 2)) return W(te({ replace: d }, D(S.to), { state: typeof S.to == "object" ? te({}, ee, S.to.state) : ee, force: f }), N || b);
                    } else S = Re(b, B, !0, d, ee);
                    return ae(b, B, S), S;
                })
        );
    }
    function M(w, N) {
        const O = I(w, N);
        return O ? Promise.reject(O) : Promise.resolve();
    }
    function X(w) {
        const N = Ct.values().next().value;
        return N && typeof N.runWithContext == "function" ? N.runWithContext(w) : w();
    }
    function $(w, N) {
        let O;
        const [B, ee, f] = hd(w, N);
        O = _r(B.reverse(), "beforeRouteLeave", w, N);
        for (const m of B)
            m.leaveGuards.forEach((b) => {
                O.push(ut(b, w, N));
            });
        const d = M.bind(null, w, N);
        return (
            O.push(d),
            be(O)
                .then(() => {
                    O = [];
                    for (const m of o.list()) O.push(ut(m, w, N));
                    return O.push(d), be(O);
                })
                .then(() => {
                    O = _r(ee, "beforeRouteUpdate", w, N);
                    for (const m of ee)
                        m.updateGuards.forEach((b) => {
                            O.push(ut(b, w, N));
                        });
                    return O.push(d), be(O);
                })
                .then(() => {
                    O = [];
                    for (const m of w.matched)
                        if (m.beforeEnter && !N.matched.includes(m))
                            if (qe(m.beforeEnter)) for (const b of m.beforeEnter) O.push(ut(b, w, N));
                            else O.push(ut(m.beforeEnter, w, N));
                    return O.push(d), be(O);
                })
                .then(() => (w.matched.forEach((m) => (m.enterCallbacks = {})), (O = _r(f, "beforeRouteEnter", w, N)), O.push(d), be(O)))
                .then(() => {
                    O = [];
                    for (const m of i.list()) O.push(ut(m, w, N));
                    return O.push(d), be(O);
                })
                .catch((m) => (Xe(m, 8) ? m : Promise.reject(m)))
        );
    }
    function ae(w, N, O) {
        for (const B of l.list()) X(() => B(w, N, O));
    }
    function Re(w, N, O, B, ee) {
        const f = I(w, N);
        if (f) return f;
        const d = N === lt,
            m = Nt ? history.state : {};
        O && (B || d ? s.replace(w.fullPath, te({ scroll: d && m && m.scroll }, ee)) : s.push(w.fullPath, ee)), (c.value = w), Ke(w, N, O, d), st();
    }
    let ye;
    function Ce() {
        ye ||
            (ye = s.listen((w, N, O) => {
                if (!gn.listening) return;
                const B = T(w),
                    ee = ce(B);
                if (ee) {
                    W(te(ee, { replace: !0 }), B).catch(rn);
                    return;
                }
                a = B;
                const f = c.value;
                Nt && Ef(uo(f.fullPath, O.delta), tr()),
                    $(B, f)
                        .catch((d) =>
                            Xe(d, 12)
                                ? d
                                : Xe(d, 2)
                                ? (W(d.to, B)
                                      .then((m) => {
                                          Xe(m, 20) && !O.delta && O.type === hn.pop && s.go(-1, !1);
                                      })
                                      .catch(rn),
                                  Promise.reject())
                                : (O.delta && s.go(-O.delta, !1), Z(d, B, f))
                        )
                        .then((d) => {
                            (d = d || Re(B, f, !1)), d && (O.delta && !Xe(d, 8) ? s.go(-O.delta, !1) : O.type === hn.pop && Xe(d, 20) && s.go(-1, !1)), ae(B, f, d);
                        })
                        .catch(rn);
            }));
    }
    let he = Yt(),
        ge = Yt(),
        re;
    function Z(w, N, O) {
        st(w);
        const B = ge.list();
        return B.length ? B.forEach((ee) => ee(w, N, O)) : console.error(w), Promise.reject(w);
    }
    function Ye() {
        return re && c.value !== lt
            ? Promise.resolve()
            : new Promise((w, N) => {
                  he.add([w, N]);
              });
    }
    function st(w) {
        return re || ((re = !w), Ce(), he.list().forEach(([N, O]) => (w ? O(w) : N())), he.reset()), w;
    }
    function Ke(w, N, O, B) {
        const { scrollBehavior: ee } = e;
        if (!Nt || !ee) return Promise.resolve();
        const f = (!O && Sf(uo(w.fullPath, 0))) || ((B || !O) && history.state && history.state.scroll) || null;
        return rs()
            .then(() => ee(w, N, f))
            .then((d) => d && Rf(d))
            .catch((d) => Z(d, w, N));
    }
    const Se = (w) => s.go(w);
    let xt;
    const Ct = new Set(),
        gn = {
            currentRoute: c,
            listening: !0,
            addRoute: g,
            removeRoute: y,
            hasRoute: k,
            getRoutes: E,
            resolve: T,
            options: e,
            push: K,
            replace: G,
            go: Se,
            back: () => Se(-1),
            forward: () => Se(1),
            beforeEach: o.add,
            beforeResolve: i.add,
            afterEach: l.add,
            onError: ge.add,
            isReady: Ye,
            install(w) {
                const N = this;
                w.component("RouterLink", ld),
                    w.component("RouterView", fd),
                    (w.config.globalProperties.$router = N),
                    Object.defineProperty(w.config.globalProperties, "$route", { enumerable: !0, get: () => kt(c) }),
                    Nt && !xt && c.value === lt && ((xt = !0), K(s.location).catch((ee) => {}));
                const O = {};
                for (const ee in lt) O[ee] = Pe(() => c.value[ee]);
                w.provide(ys, N), w.provide(bs, Gt(O)), w.provide(zr, c);
                const B = w.unmount;
                Ct.add(w),
                    (w.unmount = function () {
                        Ct.delete(w), Ct.size < 1 && ((a = lt), ye && ye(), (ye = null), (c.value = lt), (xt = !1), (re = !1)), B();
                    });
            },
        };
    function be(w) {
        return w.reduce((N, O) => N.then(() => X(O)), Promise.resolve());
    }
    return gn;
}
function hd(e, t) {
    const n = [],
        r = [],
        s = [],
        o = Math.max(t.matched.length, e.matched.length);
    for (let i = 0; i < o; i++) {
        const l = t.matched[i];
        l && (e.matched.find((a) => zt(a, l)) ? r.push(l) : n.push(l));
        const c = e.matched[i];
        c && (t.matched.find((a) => zt(a, c)) || s.push(c));
    }
    return [n, r, s];
}
function pd() {
    return He(bs);
}
const md = "/static/spin/center.png",
    gd = "/static/spin/place-bet-circle.png",
    yd = "/static/spin/bet-closed-circle.png",
    bd = "/static/spin/pin.png";
const _d = (e, t) => {
        const n = e.__vccOpts || e;
        for (const [r, s] of t) n[r] = s;
        return n;
    },
    wd = {
        mounted() {
            this.gameStore.initializeGame(this.route.query.cdm, this.route.query.dm, this.route.query.url);
        },
        setup() {
            const e = af(),
                t = pd();
            return (
                setInterval(() => {
                    e.initializing || e.update();
                }, 1e3),
                {
                    gameStore: e,
                    centerCircleNames: Pt,
                    route: t,
                    displayInfo: () => {
                        (e.showInfo = !0),
                            setTimeout(() => {
                                e.showInfo = !1;
                            }, 5e3);
                    },
                }
            );
        },
        methods: {
            getPrimaryColor(e) {
                return e == 0 ? "green" : e < 11 ? (e % 2 == 0 ? "black" : "red") : e < 19 ? (e % 2 == 0 ? "red" : "black") : e < 29 ? (e % 2 == 0 ? "black" : "red") : e % 2 == 0 ? "red" : "black";
            },
            getSecondaryColor(e) {
                return e == 0
                    ? ""
                    : [7, 28, 12, 35, 3, 26].includes(e)
                    ? "white"
                    : [14, 31, 9, 22, 18, 29].includes(e)
                    ? "yellow"
                    : [5, 24, 16, 33, 1, 20].includes(e)
                    ? "emerald"
                    : [36, 11, 30, 8, 23, 10].includes(e)
                    ? "pink"
                    : [25, 17, 34, 6, 27, 13].includes(e)
                    ? "blue"
                    : "orange";
            },
        },
    },
    Rd = { key: 0 },
    Ed = { id: "video-parent-container", ref: "parentRef" },
    Sd = { key: 0, style: { color: "white", position: "absolute", "font-size": "0.8em", "z-index": "1000", top: "60em", left: "75em", "text-shadow": "0 0 3px black", "font-family": "'euro'" } },
    vd = C("p", null, "version: 2.0.1", -1),
    xd = { id: "info-panel" },
    Cd = { id: "game-number" },
    Ad = { class: "quartz-font" },
    Od = C("span", { style: { "font-size": "1.6rem", position: "relative", top: "-0.6rem" } }, " :", -1),
    Td = { class: "quartz-font" },
    Pd = { key: 1, id: "bets-closed" },
    Nd = { id: "previous-6-games" },
    Md = { class: "p-6-g-left p-6-g-top" },
    Id = { class: "p-6-g-left p-6-g-middle" },
    Fd = { class: "p-6-g-left p-6-g-bottom" },
    kd = { class: "p-6-g-right p-6-g-top" },
    Bd = { class: "p-6-g-right p-6-g-middle" },
    Dd = { class: "p-6-g-right p-6-g-bottom" },
    Ld = { class: "p-6-d" },
    jd = { class: "p-6-d" },
    Ud = { class: "p-6-c-d" },
    Hd = { class: "p-6-c-d" },
    zd = { id: "f-l-2-d" },
    qd = { class: "f-l-2-d-b" },
    Kd = { id: "f-l-2-d-middle" },
    Wd = { class: "f-l-2-d-b" },
    Vd = { id: "f-l-2-d-right" },
    Gd = { class: "f-l-2-d-b" },
    Jd = { id: "c-l-2-d" },
    $d = { class: "c-l-2-d-t-b" },
    Qd = { class: "c-l-2-d-t-b" },
    Yd = { class: "c-l-2-d-t-b", style: { "text-shadow": "0px 0px 2px black" } },
    Xd = { class: "c-l-2-d-b-b" },
    Zd = { class: "c-l-2-d-b-b" },
    eh = { class: "c-l-2-d-b-b" },
    th = { class: "c-l-2-d-b-b", style: { color: "#333" } },
    nh = { class: "c-l-2-d-b-b", style: { color: "#333" } },
    rh = { class: "c-l-2-d-b-b", style: { color: "#333" } },
    sh = { id: "d-l-2-d" },
    oh = { class: "d-l-2-d-b" },
    ih = { class: "d-l-2-d-b" },
    lh = { class: "d-l-2-d-b" },
    ch = { id: "h-c-l-2-d" },
    ah = C("img", { id: "center-wheel", src: md }, null, -1),
    uh = { key: 0, id: "place-bet-oval", src: gd },
    fh = { key: 1, id: "place-bet-oval", src: yd },
    dh = ["src"],
    hh = ["src"];
function ph(e, t, n, r, s, o) {
    return (
        Be(),
        Ve("html", null, [
            r.gameStore.initializing
                ? Ot("", !0)
                : (Be(),
                  Ve("body", Rd, [
                      C(
                          "div",
                          Ed,
                          [
                              C(
                                  "div",
                                  { id: "video-container", onDblclick: t[0] || (t[0] = (...i) => r.displayInfo && r.displayInfo(...i)) },
                                  [
                                      r.gameStore.showInfo
                                          ? (Be(), Ve("p", Sd, [C("p", null, "cdm:" + z(r.gameStore.countdownMinutes), 1), C("p", null, "dm:" + z(r.gameStore.delayMinutes), 1), C("p", null, "url: " + z(r.gameStore.baseUrl), 1), vd]))
                                          : Ot("", !0),
                                      C("div", null, [
                                          C("div", xd, [
                                              C("div", Cd, z(r.gameStore.openGameNumber), 1),
                                              r.gameStore.drawStarted
                                                  ? Ot("", !0)
                                                  : (Be(),
                                                    Ve(
                                                        "div",
                                                        { key: 0, id: "countdown", class: jn([r.gameStore.nextDrawRemainingTotalSeconds < 10 ? "blink-animation" : ""]) },
                                                        [C("span", Ad, z(r.gameStore.nextDrawRemainingMinutes), 1), Od, C("span", Td, z(r.gameStore.nextDrawRemainingSeconds), 1)],
                                                        2
                                                    )),
                                              r.gameStore.drawStarted ? (Be(), Ve("div", Pd, " BETS CLOSED ")) : Ot("", !0),
                                              C("div", Nd, [
                                                  C("div", null, [
                                                      C("div", Md, " # " + z(r.gameStore.recentResults[0].gameNumber), 1),
                                                      C("div", Id, " # " + z(r.gameStore.recentResults[1].gameNumber), 1),
                                                      C("div", Fd, " # " + z(r.gameStore.recentResults[2].gameNumber), 1),
                                                  ]),
                                                  C("div", null, [
                                                      C("div", kd, " # " + z(r.gameStore.recentResults[5].gameNumber), 1),
                                                      C("div", Bd, " # " + z(r.gameStore.recentResults[4].gameNumber), 1),
                                                      C("div", Dd, " # " + z(r.gameStore.recentResults[3].gameNumber), 1),
                                                  ]),
                                                  C("div", Ld, [
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-left p-6-d-top", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[0].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[0].gameResult),
                                                          5
                                                      ),
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-left p-6-d-middle", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[1].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[1].gameResult),
                                                          5
                                                      ),
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-left p-6-d-bottom", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[2].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[2].gameResult),
                                                          5
                                                      ),
                                                  ]),
                                                  C("div", jd, [
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-right p-6-d-top", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[5].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[5].gameResult),
                                                          5
                                                      ),
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-right p-6-d-middle", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[4].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[4].gameResult),
                                                          5
                                                      ),
                                                      C(
                                                          "div",
                                                          { class: "p-6-d-right p-6-d-bottom", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.recentResults[3].gameResult)}.png)` }) },
                                                          z(r.gameStore.recentResults[3].gameResult),
                                                          5
                                                      ),
                                                  ]),
                                                  C("div", Ud, [
                                                      C("div", { class: "p-6-c-d-left p-6-c-d-top", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[0].gameResult)}.png)` }) }, null, 4),
                                                      C("div", { class: "p-6-c-d-left p-6-c-d-middle", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[1].gameResult)}.png)` }) }, null, 4),
                                                      C("div", { class: "p-6-c-d-left p-6-c-d-bottom", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[2].gameResult)}.png)` }) }, null, 4),
                                                  ]),
                                                  C("div", Hd, [
                                                      C("div", { class: "p-6-c-d-right p-6-c-d-top", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[5].gameResult)}.png)` }) }, null, 4),
                                                      C("div", { class: "p-6-c-d-right p-6-c-d-middle", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[4].gameResult)}.png)` }) }, null, 4),
                                                      C("div", { class: "p-6-c-d-right p-6-c-d-bottom", style: se({ "background-image": `url(/static/spin/colors/${o.getSecondaryColor(r.gameStore.recentResults[3].gameResult)}.png)` }) }, null, 4),
                                                  ]),
                                              ]),
                                              C("div", zd, [
                                                  C("div", null, [
                                                      (Be(),
                                                      Ve(
                                                          Te,
                                                          null,
                                                          ir([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (i) => C("div", qd, z(r.gameStore.recentResults.filter((l) => l.gameResult == i).length), 1)),
                                                          64
                                                      )),
                                                  ]),
                                                  C("div", Kd, [
                                                      (Be(),
                                                      Ve(
                                                          Te,
                                                          null,
                                                          ir([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (i) => C("div", Wd, z(r.gameStore.recentResults.filter((l) => l.gameResult == i + 12).length), 1)),
                                                          64
                                                      )),
                                                  ]),
                                                  C("div", Vd, [
                                                      (Be(),
                                                      Ve(
                                                          Te,
                                                          null,
                                                          ir([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], (i) => C("div", Gd, z(r.gameStore.recentResults.filter((l) => l.gameResult == i + 24).length), 1)),
                                                          64
                                                      )),
                                                  ]),
                                              ]),
                                              C("div", Jd, [
                                                  C("div", null, [
                                                      C("span", $d, z(r.gameStore.recentResults.filter((i) => o.getPrimaryColor(i.gameResult) == "red").length), 1),
                                                      C("span", Qd, z(r.gameStore.recentResults.filter((i) => o.getPrimaryColor(i.gameResult) == "black").length), 1),
                                                      C("span", Yd, z(r.gameStore.recentResults.filter((i) => o.getPrimaryColor(i.gameResult) == "green").length), 1),
                                                  ]),
                                                  C("div", null, [
                                                      C("span", Xd, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "orange").length), 1),
                                                      C("span", Zd, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "blue").length), 1),
                                                      C("span", eh, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "pink").length), 1),
                                                      C("span", th, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "emerald").length), 1),
                                                      C("span", nh, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "yellow").length), 1),
                                                      C("span", rh, z(r.gameStore.recentResults.filter((i) => o.getSecondaryColor(i.gameResult) == "white").length), 1),
                                                  ]),
                                              ]),
                                              C("div", sh, [
                                                  C("div", null, [
                                                      C("span", oh, z(r.gameStore.recentResults.filter((i) => i.gameResult >= 1 && i.gameResult <= 12).length), 1),
                                                      C("span", ih, z(r.gameStore.recentResults.filter((i) => i.gameResult >= 12 && i.gameResult <= 24).length), 1),
                                                      C("span", lh, z(r.gameStore.recentResults.filter((i) => i.gameResult >= 25 && i.gameResult <= 36).length), 1),
                                                  ]),
                                              ]),
                                              C("div", ch, [
                                                  C("div", null, [
                                                      C("span", { class: "h-c-l-2-d-t-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[0])}.png)` }) }, z(r.gameStore.sorted[0]), 5),
                                                      C("span", { class: "h-c-l-2-d-t-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[1])}.png)` }) }, z(r.gameStore.sorted[1]), 5),
                                                      C("span", { class: "h-c-l-2-d-t-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[2])}.png)` }) }, z(r.gameStore.sorted[2]), 5),
                                                      C("span", { class: "h-c-l-2-d-t-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[3])}.png)` }) }, z(r.gameStore.sorted[3]), 5),
                                                      C("span", { class: "h-c-l-2-d-t-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[4])}.png)` }) }, z(r.gameStore.sorted[4]), 5),
                                                  ]),
                                                  C("div", null, [
                                                      C("span", { class: "h-c-l-2-d-b-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[36])}.png)` }) }, z(r.gameStore.sorted[36]), 5),
                                                      C("span", { class: "h-c-l-2-d-b-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[35])}.png)` }) }, z(r.gameStore.sorted[35]), 5),
                                                      C("span", { class: "h-c-l-2-d-b-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[34])}.png)` }) }, z(r.gameStore.sorted[34]), 5),
                                                      C("span", { class: "h-c-l-2-d-b-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[33])}.png)` }) }, z(r.gameStore.sorted[33]), 5),
                                                      C("span", { class: "h-c-l-2-d-b-b", style: se({ "background-image": `url(/static/spin/colors/${o.getPrimaryColor(r.gameStore.sorted[34])}.png)` }) }, z(r.gameStore.sorted[32]), 5),
                                                  ]),
                                              ]),
                                          ]),
                                          ah,
                                          r.gameStore.centerCirlce == r.centerCircleNames.placeBet ? (Be(), Ve("img", uh)) : Ot("", !0),
                                          r.gameStore.centerCirlce == r.centerCircleNames.betsClosed ? (Be(), Ve("img", fh)) : Ot("", !0),
                                          C("img", { id: "center-circle", src: `/static/spin/circle-${r.gameStore.pinNumber}.png` }, null, 8, dh),
                                          C("div", null, [C("img", { id: "pin", src: bd, style: se({ transform: `rotate(${r.gameStore.pinAngle}deg)` }) }, null, 4)]),
                                          C("img", { id: "wheel", src: r.gameStore.showWheelBling ? "/static/spin/wheel-bling.png" : "/static/spin/wheel.png", style: se({ transform: `rotate(${r.gameStore.angle}deg)` }) }, null, 12, hh),
                                      ]),
                                  ],
                                  32
                              ),
                          ],
                          512
                      ),
                  ])),
        ])
    );
}
const mh = _d(wd, [["render", ph]]);
const _s = Ba(mh),
    al = dd({ history: Of(), routes: [] });
_s.use(ja());
_s.use(al);
al.isReady().then(() => {
    _s.mount("#app");
});
