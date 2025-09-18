import type { App } from 'vue'
import XnsSeekBar from './XnsSeekBar.vue'
import type { XnsSeekBarProps } from './XnsSeekBar.vue'

export type { XnsSeekBarProps }
export { XnsSeekBar }

const XnsSeekBarPlugin = {
  install(app: App) {
    app.component('XnsSeekBar', XnsSeekBar)
    app.component('xns-seek-bar', XnsSeekBar) // Keep kebab-case for backward compatibility
  }
}

export default XnsSeekBarPlugin

// Auto-install when used via script tag
if (typeof window !== 'undefined' && (window as any).Vue) {
  const app = (window as any).Vue.createApp({})
  app.use(XnsSeekBarPlugin)
}
