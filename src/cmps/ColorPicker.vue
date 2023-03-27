<template>
  <div class="colors-container" ref="container">
    <div @click="setColor(color)" v-for="(color, idx) in colorsForDisplay" :key="idx"
      :class="['color-item', `color-item-${idx + 1}`, { selected: color === pickedColor }]"
      v-html="(color === pickedColor ? getSvg('vPicked') : '')">
    </div>
  </div>
</template>
<!-- v-html="(color === pickedColor ? getSvg('vBoard') : '')" -->
<script>
import { svgService } from '../services/svg.service'
export default {
  props: ['quantity'],
  name: 'ColorPicker',
  data() {
    return {
      pickedColor: 'white',
      colorItems: [
        '#7bc86c',
        ' #f5dd29',
        ' #ffaf3f',
        '#ef7564',
        '#cd8de5',
        '#5ba4cf',
        ' #b7ddb0',
        ' #f5ea92',
        '#fad29c',
        ' #efb3ab',
        ' #dfc0eb',
        '#7bc86c',
        ' #f5dd29',
        ' #ffaf3f',
        ' #ef7564',
        ' #cd8de5',
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
    loggedInUser() { },
    colorsForDisplay() {
      let { quantity } = this.$props
      return this.colorItems.filter((item, idx) => {
        if (idx <= quantity - 1) return item
      })
    },
  },
  created() { },
  methods: {
    onStarBoard(board) {
      this.$emit('starBoard', board)
    },
    onRemoveBoard(boardId) {
      this.$emit('onRemoveBoard', boardId)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    setColor(color) {
      this.pickedColor = color
      this.$emit('setColor', color)
    },
    getCurrentTime() {
      const timestamp = Date.now();
      const date = new Date(timestamp);
      const dateString = date.toLocaleString();
      return dateString
    }

  },
  emits: ['setColor'],
}
</script>
