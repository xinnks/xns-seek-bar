<template>
  <div
    ref="trackProgress" 
    class="xns-seeker-progress-wrapper" 
    :style="{ height: `${barHeight}px`, background: barShadeColor }"
  >
    <div
      class="xns-seeker-progress-bar"
      :style="{ width: `${progress}%`, background: localBarColor }"
    >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

export interface XnsSeekBarProps {
  currentValue?: number
  totalValue?: number
  listen?: boolean
  barHeight?: number
  barColor?: string
  barShadeColor?: string
  intensity?: number
}

const props = withDefaults(defineProps<XnsSeekBarProps>(), {
  currentValue: 0,
  totalValue: 20,
  listen: true,
  barHeight: 60,
  barColor: '#008080',
  barShadeColor: '#e1e1e1',
  intensity: 0.5
})

const emit = defineEmits<{
  seekedTo: [value: number]
}>()

const trackProgress = ref<HTMLElement | null>(null)
const progress = ref<number>(0)
const progressTotalWidth = ref<number>(0)
const localBarColor = ref<string>('')

// Computed property for applying color with opacity
const hexOpacity = (hex: string, opacity: number): string => {
  const op = (opacity * 100) <= 99 ? Math.floor(opacity * 100) : 99
  return `${hex}${op.toString().padStart(2, '0')}`
}

// Update local bar color when props change
const updateBarColor = () => {
  localBarColor.value = hexOpacity(props.barColor, props.intensity)
}

// Calibrate progress based on current and total values
const calibrateProgress = (currentVal: number = props.currentValue, totalVal: number = props.totalValue) => {
  const max = (currentVal / totalVal) * 100
  progress.value = max <= 100 ? max : 100
}

// Handle click position on the progress bar
const getClickPosition = (event: MouseEvent) => {
  if (!trackProgress.value) return
  
  const target = event.target as HTMLElement
  if (!target) return
  
  // Set initial progressbar width if not already set
  if (!progressTotalWidth.value) {
    progressTotalWidth.value = target.offsetWidth
  }
  
  const seekWidth = event.offsetX
  
  // Change seek position
  progress.value = (seekWidth / progressTotalWidth.value) * 100
  
  // Convert seeked position (%) to value
  const trackTime = (progress.value / 100) * props.totalValue
  
  // Emit seeked value
  emit('seekedTo', trackTime)
}

// Handle mouse down for drag functionality
const detectMouseDown = (event: MouseEvent) => {
  event.preventDefault() // prevent browser from moving objects, following links etc
  
  // Start listening to mouse movements
  if (trackProgress.value) {
    trackProgress.value.addEventListener('mousemove', getClickPosition, false)
  }
}

// Handle mouse up to stop dragging
const detectMouseUp = () => {
  // Stop listening to mouse movements
  if (trackProgress.value) {
    trackProgress.value.removeEventListener('mousemove', getClickPosition, false)
  }
}

// Handle window resize
const windowResize = () => {
  setTimeout(() => {
    if (trackProgress.value) {
      progressTotalWidth.value = trackProgress.value.offsetWidth
    }
  }, 200)
}

// Setup or remove event listeners
const listenToEvents = (shouldListen: boolean = true) => {
  if (!trackProgress.value) return
  
  const element = trackProgress.value
  
  if (shouldListen) {
    element.addEventListener('click', getClickPosition, false)
    element.addEventListener('mousedown', detectMouseDown, false)
    element.addEventListener('mouseup', detectMouseUp, false)
  } else {
    element.removeEventListener('click', getClickPosition, false)
    element.removeEventListener('mousedown', detectMouseDown, false)
    element.removeEventListener('mouseup', detectMouseUp, false)
  }
}

// Watch for prop changes
watch(() => props.currentValue, () => {
  calibrateProgress(props.currentValue)
}, { immediate: true })

watch(() => props.totalValue, () => {
  calibrateProgress(props.currentValue, props.totalValue)
})

watch(() => props.listen, (newValue) => {
  listenToEvents(newValue)
})

watch([() => props.barColor, () => props.intensity], () => {
  updateBarColor()
}, { immediate: true })

// Lifecycle hooks
onMounted(() => {
  // Calibrate progress
  calibrateProgress(props.currentValue, props.totalValue)
  
  // Set seek bar color
  updateBarColor()
  
  // Start listening to taps and clicks
  listenToEvents(props.listen)
  
  // Recalibrate progress width on window width resize
  window.addEventListener('resize', windowResize, false)
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('resize', windowResize, false)
  listenToEvents(false)
})
</script>

<style scoped>
  ::selection{
    background: none;
  }
  *, *:hover{
    cursor: default;
  }
  .xns-seeker-progress-wrapper{
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
    height: inherit;
  }
</style>