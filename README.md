# xns-seek-bar
A seekable progress bar component for Vue.js

![xns-seek-bar](https://res.cloudinary.com/djx5h4cjt/image/upload/v1581230835/xns-seek-bar/demo.gif "xns-seek-bar")

[![](https://badgen.net/npm/v/xns-seek-bar)](https://badgen.net/npm/v/xns-seek-bar) [![](https://badgen.net/npm/license/xns-seek-bar)](https://badgen.net/npm/license/xns-seek-bar) [![](https://badgen.net/packagephobia/publish/xns-seek-bar)](https://badgen.net/packagephobia/publish/xns-seek-bar) [![](https://badgen.net/bundlephobia/minzip/xns-seek-bar)](https://badgen.net/bundlephobia/minzip/xns-seek-bar)


### install

```sh
$ npm i xns-seek-bar
```


### Import & initiate plugin on your entry js file

```sh
import XnsSeekBar from 'xns-seek-bar'

Vue.use(XnsSeekBar)
```

## In Browser ###
```sh
// Latest update
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdn.jsdelivr.net/npm/xns-seek-bar/dist/index.umd.js"></script>
```


### Example

```sh
<xns-seek-bar :bar-color="'#ffdd00'" :current-value="33" :total-value="100"></xns-seek-bar>
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
| intensity | Number (0.1 - 1)) | false | 0 |


### Options Details

__listen__ : Enable touch / tap.


## Events

__seekedTo__
Returns a **Number** representing value of seeked position.
