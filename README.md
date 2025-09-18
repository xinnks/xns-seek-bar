# XnsSeekBar

A seekable progress bar component for Vue 3 with TypeScript support.

![xns-seek-bar](https://res.cloudinary.com/djx5h4cjt/image/upload/v1581230835/xns-seek-bar/demo.gif "xns-seek-bar")

[![](https://badgen.net/npm/v/xns-seek-bar)](https://badgen.net/npm/v/xns-seek-bar) [![](https://badgen.net/npm/license/xns-seek-bar)](https://badgen.net/npm/license/xns-seek-bar) [![](https://badgen.net/packagephobia/publish/xns-seek-bar)](https://badgen.net/packagephobia/publish/xns-seek-bar) [![](https://badgen.net/bundlephobia/minzip/xns-seek-bar)](https://badgen.net/bundlephobia/minzip/xns-seek-bar)

## Installation

```bash
npm install xns-seek-bar
```

## Usage

### As a Plugin (Global Registration)

```javascript
import { createApp } from 'vue'
import XnsSeekBarPlugin from 'xns-seek-bar'

const app = createApp(App)
app.use(XnsSeekBarPlugin)
app.mount('#app')
```

### As a Component (Local Registration)

```vue
<template>
  <XnsSeekBar 
    :current-value="currentValue"
    :total-value="100"
    @seeked-to="onSeek"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { XnsSeekBar } from 'xns-seek-bar'

const currentValue = ref(50)

const onSeek = (value: number) => {
  currentValue.value = value
}
</script>
```

## In Browser

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xns-seek-bar/dist/index.umd.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/xns-seek-bar/dist/style.css">
```

### Example

```html
<xns-seek-bar :bar-color="'#ffdd00'" :current-value="33" :total-value="100" @seeked-to="handleSeek"></xns-seek-bar>
```


## Options

| Option | Type | Required | Default |
| ------ | ---- | -------- | ------- |
| currentValue | Number | false | 0 |
| totalValue | Number | false | 300 |
| listen | Boolean | false | true |
| barHeight | Number | false | 0.5 |
| barColor | String (Hex) | false | false |
| barShadeColor | String (Hex) | false | false |
| intensity | Number (0.1 - 1) | false | 0 |


### Options Details

__listen__ : Enable touch / tap.


## Events

__seekedTo__
Returns a **Number** representing value of seeked position.
