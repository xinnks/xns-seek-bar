import XnsSeekBar from "./XnsSeekBar.vue";

const seeker = {
    install(Vue, options = {}) {
        // register component globally
        // https://vuejs.org/v2/guide/components-registration.html
        Vue.component("xns-seek-bar", XnsSeekBar);
    }
}

export default seeker

if(typeof window !== 'undefined' && window.Vue){
	window.Vue.use(seeker)
}