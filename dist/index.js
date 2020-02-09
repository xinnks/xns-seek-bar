/*!
 * xns-seek-bar v1.0.0
 * (c) James Sinkala
 * Released under the ISC License.
 */
'use strict';

//
//
//
//
//
//
//
var script = {
  name: "XnsSeekBar",
  props: {
    currentValue: {
      type: Number,
      "default": 0
    },
    totalValue: {
      type: Number,
      "default": 20
    },
    listen: {
      type: Boolean,
      "default": true
    },
    barHeight: {
      type: Number,
      "default": 60
    },
    barColor: {
      type: String,
      "default": '#008080'
    },
    barShadeColor: {
      type: String,
      "default": '#e1e1e1'
    },
    intensity: {
      type: Number,
      "default": 0.5
    }
  },
  data: function data() {
    return {
      progress: 0,
      // a value less than totalValue
      localValue: 0,
      // total value
      progressTotalWidth: 0,
      colorIntensity: ''
    };
  },
  computed: {
    localListen: function localListen() {
      return this.listen;
    }
  },
  watch: {
    immediate: true,
    currentValue: function currentValue() {
      var max = this.currentValue / this.totalValue * 100;
      this.progress = max <= 100 ? max : 100;
    },
    listen: function listen() {
      this.listenToEvents(this.listen);
    },
    intensity: function intensity() {
      this.colorIntensity = 50 + this.intensity * 50 >= 100 ? '' : 50 + this.intensity * 50;
    }
  },
  mounted: function mounted() {
    var max = this.currentValue / this.totalValue * 100;
    this.progress = max <= 100 ? max : 100;
    this.colorIntensity = 50; // progress opacity value

    this.listenToEvents(this.localListen); // recalibrate progress width on window width resize

    window.addEventListener('resize', this.windowResize, false);
  },
  methods: {
    getClickPosition: function getClickPosition(el) {
      el = el || window.event; // get target element

      var targ = el.target || el.srcElement;
      if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug

      this.progressTotalWidth = this.progressTotalWidth || targ.offsetWidth; // set initial progressbar width

      var seekWidth = el.offsetX; //change seek position

      this.progress = seekWidth / this.progressTotalWidth * 100; // convert seeked posiion(%) to value

      var trackTime = this.progress / 100 * this.totalValue; // emit seeked value

      this.$emit('seekedTo', trackTime);
    },
    detectMouseDown: function detectMouseDown(e) {
      e.preventDefault(); // prevent browser from moving objects, following links etc
      // start listening to mouse movements

      this.$refs.trackprogress.addEventListener("mousemove", this.getClickPosition, false);
    },
    detectMouseUp: function detectMouseUp() {
      // stop listening to mouse movements
      this.$refs.trackprogress.removeEventListener("mousemove", this.getClickPosition, false);
    },
    windowResize: function windowResize() {
      var pp = this;
      setTimeout(function () {
        pp.progressTotalWidth = pp.$refs.trackprogress.offsetWidth;
      }, 200);
    },
    listenToEvents: function listenToEvents() {
      var listen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (listen) {
        this.$refs.trackprogress.addEventListener("click", this.getClickPosition, false);
        this.$refs.trackprogress.addEventListener("mousedown", this.detectMouseDown, false);
        this.$refs.trackprogress.addEventListener("mouseup", this.detectMouseUp, false);
      } else {
        this.$refs.trackprogress.removeEventListener("click", this.getClickPosition, false);
        this.$refs.trackprogress.removeEventListener("mousedown", this.detectMouseDown, false);
        this.$refs.trackprogress.removeEventListener("mouseup", this.detectMouseUp, false);
      }
    }
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    const options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    let hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            const originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            const existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

const isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return (id, style) => addStyle(id, style);
}
let HEAD;
const styles = {};
function addStyle(id, css) {
    const group = isOldIE ? css.media || 'default' : id;
    const style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        let code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                style.element.setAttribute('media', css.media);
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            const index = style.ids.size - 1;
            const textNode = document.createTextNode(code);
            const nodes = style.element.childNodes;
            if (nodes[index])
                style.element.removeChild(nodes[index]);
            if (nodes.length)
                style.element.insertBefore(textNode, nodes[index]);
            else
                style.element.appendChild(textNode);
        }
    }
}

/* script */
var __vue_script__ = script;
/* template */

var __vue_render__ = function __vue_render__() {
  var _vm = this;

  var _h = _vm.$createElement;

  var _c = _vm._self._c || _h;

  return _c('div', {
    ref: "trackprogress",
    staticClass: "progress-wrapper",
    style: 'position: inherit; display: flex; flex: 1; width: inherit; height: ' + _vm.barHeight + 'px; position: relative; background: ' + _vm.barShadeColor + '; overflow: hidden;'
  }, [_c('div', {
    staticClass: "progressbar",
    style: 'background: rgba(3,169,244, .8); width: ' + _vm.progress + '%;position: absolute; left: 0; right: 0; bottom: 0; top: 0; height: inherit; background: ' + _vm.barColor + '' + _vm.colorIntensity
  })]);
};

var __vue_staticRenderFns__ = [];
/* style */

var __vue_inject_styles__ = function __vue_inject_styles__(inject) {
  if (!inject) return;
  inject("data-v-15c9f83f_0", {
    source: "[data-v-15c9f83f]::selection{background:0 0}*[data-v-15c9f83f],[data-v-15c9f83f]:hover{cursor:default}",
    map: undefined,
    media: undefined
  });
};
/* scoped */


var __vue_scope_id__ = "data-v-15c9f83f";
/* module identifier */

var __vue_module_identifier__ = undefined;
/* functional template */

var __vue_is_functional_template__ = false;
/* style inject SSR */

/* style inject shadow dom */

var __vue_component__ = normalizeComponent({
  render: __vue_render__,
  staticRenderFns: __vue_staticRenderFns__
}, __vue_inject_styles__, __vue_script__, __vue_scope_id__, __vue_is_functional_template__, __vue_module_identifier__, false, createInjector, undefined, undefined);

var index = {
  install: function install(Vue) {
    // register component globally
    // https://vuejs.org/v2/guide/components-registration.html
    Vue.component("xns-seek-bar", __vue_component__);
  }
};

module.exports = index;
