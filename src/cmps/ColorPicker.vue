<template>
  <div class="colors-container" ref="container">
    <div @click="setColor(color)" v-for="(color, idx) in colorsForDisplay" :key="idx" :class="[
      'color-item',
      `color-item-${idx + 1}`,
      { selected: color === pickedColor },
    ]" v-html="color === pickedColor ? getSvg('vPicked') : ''"></div>
  </div>
</template>
<!-- v-html="(color === pickedColor ? getSvg('vBoard') : '')" -->
<script>
import { eventBus } from '../services/event-bus.service'
import { svgService } from '../services/svg.service'
export default {
  props: ['quantity'],
  name: 'ColorPicker',
  data() {
    return {
      pickedColor: 'white',
      colorItems: [
        'linear-gradient(55.41deg, rgb(12, 102, 228) 2%, rgb(55, 180, 195) 100%)',
        'linear-gradient(55.41deg, rgb(12, 102, 228) 2%, rgb(9, 50, 108) 100%)',
        'linear-gradient(55.41deg, rgb(9, 50, 108) 2%, rgb(205, 81, 157) 100%)',
        'linear-gradient(55.41deg, rgb(110, 93, 198) 2%, rgb(231, 116, 187) 100%)',
        'linear-gradient(55.41deg, rgb(227, 73, 53) 2%, rgb(250, 165, 61) 100%)',
        'linear-gradient(55.41deg, rgb(250, 165, 61) 2%, rgb(89, 201, 2) 100%)',

        ' #f5dd29',
        ' #ffaf3f',
        '#ef7564',
        '#cd8de5',

        ' #5aac44',
        ' #e6c60d',
        ' #e79217',
        ' #cf513d',
        ' #a86cc1',

        ' #8bbdd9',
        ' #8fdfeb',
        ' #b3f1d0',
        ' #f9c2e4',
        ' #505f79',

        ' #5ba4cf',
        ' #29cce5',
        ' #6deca9',
        ' #ff8ed4',
        ' #344563',

        ' #026aa7',
        ' #00aecc',
        ' #4ed583',
        ' #e568af',
        ' #091e42',

        ' #aabbcc',
        ' #ddeeff',
      ],
    }
  },
  computed: {
    loggedinUser() { },
    colorsForDisplay() {
      let { quantity } = this.$props
      return this.colorItems.filter((item, idx) => {
        if (idx <= quantity - 1) return item
      })
    },
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    setColor(color) {
      eventBus.emit('onColorChange')
      this.pickedColor = color
      this.$emit('setColor', color)
    },
    clearSelection() {
      this.pickedColor = ''
      document.querySelectorAll('.color-item.selected').forEach((el) => {
        el.classList.remove('selected')
      })
    },
  },
  created() {
    eventBus.on('onImgChange', () => {
      this.clearSelection()
    })
  },
  emits: ['setColor'],
}
</script>
