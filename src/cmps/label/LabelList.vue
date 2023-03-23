<template>
  <div class="labels-list">
    <span class="icon btn-close" v-html="getSvg('close')"></span>
    <h3>Labels</h3>
    <hr />
    <input type="text" name="label-search" placeholder="Search labels..." />
    <h4>Labels</h4>
    <ul class="clean-list">
      <li class="label-list-item" v-for="(label, idx) in labels" :key="idx">
        <input type="checkbox" />
        <div :style="{
          'background-color': label.color || '#bcd9ea',
        }" class="label-container" @mouseover="getLabelStyle" @mouseout="getLabelStyle">
          <span>{{ label.title }}</span>
        </div>
        <div class="icon pencil-icon" v-html="getSvg('pencil')"></div>
      </li>
      <button @click="userIsEditing = true">Create a new label</button>
    </ul>
  </div>
</template>

<script>
import LabelEdit from './LabelEdit.vue'
import { svgService } from '../../services/svg.service'
export default {
  name: 'LabelList',
  data() {
    return {
      labels: [],
    }
  },
  computed: {
    currLabels() {
      let board = this.$store.getters.currBoard
      if (!board) board = this.$store.getters.demoBoard

      let { labels } = demoBoard
      if (!labels || !labels.length)
        labels = this.$store.getters.defaultEmptyLabels

      this.labels = labels
    },
  },
  created() {
    let board = this.$store.getters.currBoard
    if (!board) board = this.$store.getters.demoBoard
    let { labels } = board
    if (!labels || !labels.length)
      labels = this.$store.getters.defaultEmptyLabels
    this.labels = labels
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    getLabelStyle(ev) {
      if (ev.type === 'mouseover') {
        ev.target.style.filter = 'brightness(85%)'
      } else if (ev.type === 'mouseout') {
        ev.target.style.filter = 'brightness(100%)'
      }
    },
  },
  components: {
    LabelEdit,
  },
}
</script>
