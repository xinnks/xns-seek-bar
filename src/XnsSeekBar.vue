<template>
    <div ref="trackprogress" class="xns-seeker-progress-wrapper" :style="'height: '+barHeight+'px; background: '+barShadeColor">
        <div :style="'width: '+progress+'%; background: '+localBarColor" class="xns-seeker-progress-bar">
        </div>
    </div>
</template>

<script>
export default {
    name: "XnsSeekBar",
    props: {
        currentValue: {
            type: Number,
            default: 0
        },
        totalValue: {
            type: Number,
            default: 20
        },
        listen: {
            type: Boolean,
            default: true
        },
        barHeight: {
            type: Number,
            default: 60
        },
        barColor: {
            type: String,
            default: '#008080'
        },
        barShadeColor: {
            type: String,
            default: '#e1e1e1'
        },
        intensity: {
            type: Number,
            default: 0.5
        }
    },
    data() {
        return {
            progress: 0, // % of totalValue
            progressTotalWidth: 0,
            colorIntensity: 50,
            localBarColor: ''
        }
    },
    watch: {
        immediate: true,
        currentValue() {
            this.calibrateProgress(this.currentValue)
        },
        totalValue(){
            this.calibrateProgress(this.currentValue, this.totalValue)
        },
        listen(){
            this.listenToEvents(this.listen)
        },
        intensity(){
            this.hexOpacity(this.barColor, this.intensity)
        },
        barColor() {
            this.hexOpacity(this.barColor, this.intensity)
        },
    },
    mounted() {
        // calibrate progress
        this.calibrateProgress(this.currentValue, this.totalValue)

        // set seek bar color
        this.hexOpacity(this.barColor, this.intensity)

        // start listening to taps and clicks
        this.listenToEvents(this.listen)

        // recalibrate progress width on window width resize
        window.addEventListener('resize', this.windowResize, false)
    },
    methods: {
        getClickPosition(el){

            el = el || window.event;

            // get target element
            let targ = el.target || el.srcElement;
            if (targ.nodeType == 3) targ = targ.parentNode; // defeat Safari bug
            this.progressTotalWidth = this.progressTotalWidth || targ.offsetWidth // set initial progressbar width
            let seekWidth = el.offsetX

            //change seek position
            this.progress = (seekWidth / this.progressTotalWidth) *100

            // convert seeked posiion(%) to value
            let trackTime = (this.progress / 100) * this.totalValue

            // emit seeked value
            this.$emit('seekedTo', trackTime)
        },
        detectMouseDown(e){
          e.preventDefault() // prevent browser from moving objects, following links etc

          // start listening to mouse movements
          this.$refs.trackprogress.addEventListener("mousemove", this.getClickPosition, false)
        },
        detectMouseUp(){
          // stop listening to mouse movements
          this.$refs.trackprogress.removeEventListener("mousemove", this.getClickPosition, false)
        },
        windowResize(){
            let pp = this
            setTimeout(()=>{
                pp.progressTotalWidth = pp.$refs.trackprogress.offsetWidth
            }, 200)
        },
        listenToEvents(listen = true){
            if (listen){
                this.$refs.trackprogress.addEventListener("click", this.getClickPosition, false)
                this.$refs.trackprogress.addEventListener("mousedown", this.detectMouseDown, false)
                this.$refs.trackprogress.addEventListener("mouseup", this.detectMouseUp, false)
            }
            else{
                this.$refs.trackprogress.removeEventListener("click", this.getClickPosition, false)
                this.$refs.trackprogress.removeEventListener("mousedown", this.detectMouseDown, false)
                this.$refs.trackprogress.removeEventListener("mouseup", this.detectMouseUp, false)
            }
        },

        // calibrate progress
        calibrateProgress(currentVal = this.currentValue, totalVal = this.totalValue){
            let max = ((currentVal / totalVal) *100)
            this.progress = max <= 100 ? max : 100
        },

        // apply opacity to color
        hexOpacity(hex, opacity){
            let op = (opacity * 100) <= 99 ? (opacity * 100) : 99
            this.localBarColor = `${hex}`+op
        }
    }
}
</script>

<style scoped>
  ::selection{
    background: none;
  }
  *, *:hover{
    cursor: default;
  }
  .xns-seeker-progress-wrapper{
    position: inherit;
    display: flex;
    flex: 1;
    width: inherit;
    position: relative;
    overflow: hidden
  }
  .xns-seeker-progress-bar{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    height:
    inherit;
  }
</style>