import { defineComponent as y, ref as i, watch as c, onMounted as L, onUnmounted as B, createElementBlock as C, openBlock as S, normalizeStyle as V, createElementVNode as x } from "vue";
const T = /* @__PURE__ */ y({
  __name: "XnsSeekBar",
  props: {
    currentValue: { default: 0 },
    totalValue: { default: 20 },
    listen: { type: Boolean, default: !0 },
    barHeight: { default: 60 },
    barColor: { default: "#008080" },
    barShadeColor: { default: "#e1e1e1" },
    intensity: { default: 0.5 }
  },
  emits: ["seekedTo"],
  setup(a, { emit: d }) {
    const e = a, f = d, n = i(null), r = i(0), l = i(0), p = i(""), b = (t, o) => {
      const s = o * 100 <= 99 ? Math.floor(o * 100) : 99;
      return `${t}${s.toString().padStart(2, "0")}`;
    }, k = () => {
      p.value = b(e.barColor, e.intensity);
    }, v = (t = e.currentValue, o = e.totalValue) => {
      const s = t / o * 100;
      r.value = s <= 100 ? s : 100;
    }, u = (t) => {
      if (!n.value) return;
      const o = t.target;
      if (!o) return;
      l.value || (l.value = o.offsetWidth);
      const s = t.offsetX;
      r.value = s / l.value * 100;
      const _ = r.value / 100 * e.totalValue;
      f("seekedTo", _);
    }, g = (t) => {
      t.preventDefault(), n.value && n.value.addEventListener("mousemove", u, !1);
    }, w = () => {
      n.value && n.value.removeEventListener("mousemove", u, !1);
    }, h = () => {
      setTimeout(() => {
        n.value && (l.value = n.value.offsetWidth);
      }, 200);
    }, m = (t = !0) => {
      if (!n.value) return;
      const o = n.value;
      t ? (o.addEventListener("click", u, !1), o.addEventListener("mousedown", g, !1), o.addEventListener("mouseup", w, !1)) : (o.removeEventListener("click", u, !1), o.removeEventListener("mousedown", g, !1), o.removeEventListener("mouseup", w, !1));
    };
    return c(() => e.currentValue, () => {
      v(e.currentValue);
    }, { immediate: !0 }), c(() => e.totalValue, () => {
      v(e.currentValue, e.totalValue);
    }), c(() => e.listen, (t) => {
      m(t);
    }), c([() => e.barColor, () => e.intensity], () => {
      k();
    }, { immediate: !0 }), L(() => {
      v(e.currentValue, e.totalValue), k(), m(e.listen), window.addEventListener("resize", h, !1);
    }), B(() => {
      window.removeEventListener("resize", h, !1), m(!1);
    }), (t, o) => (S(), C("div", {
      ref_key: "trackProgress",
      ref: n,
      class: "xns-seeker-progress-wrapper",
      style: V({ height: `${t.barHeight}px`, background: t.barShadeColor })
    }, [
      x("div", {
        class: "xns-seeker-progress-bar",
        style: V({ width: `${r.value}%`, background: p.value })
      }, null, 4)
    ], 4));
  }
}), P = (a, d) => {
  const e = a.__vccOpts || a;
  for (const [f, n] of d)
    e[f] = n;
  return e;
}, E = /* @__PURE__ */ P(T, [["__scopeId", "data-v-88c70191"]]), X = {
  install(a) {
    a.component("XnsSeekBar", E), a.component("xns-seek-bar", E);
  }
};
typeof window < "u" && window.Vue && window.Vue.createApp({}).use(X);
export {
  E as XnsSeekBar,
  X as default
};
