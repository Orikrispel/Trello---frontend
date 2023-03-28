<template>
  <div class="due-date-preview-container">
    <input type="checkbox" />
    <button @click="test" class="btn btn-light flex">
      {{ dateForDisplay }}
      <span v-if="isOverdue" class="span-overdue">overdue </span>
      <br />
      <span v-if="isDueSoon" class="span-due-soon">due soon</span>
      <span class="icon icon-arrow-down" v-html="getSvg('arrowDown')"></span>
    </button>
  </div>
</template>
<script>
import { utilService } from '../../services/util.service'
import { svgService } from '../../services/svg.service'
export default {
  name: 'DatePreview',
  props: {
    date: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dateForDisplay() {
      const diff = this.diff(this.date.dueDate)
      if (diff === 0) {
        return 'Today'
      } else if (diff === 1) {
        return 'Tomorrow'
      } else if (diff === -1) {
        return 'Yesterday'
      } else {
        return utilService.formatDateString(this.date.dueDate)
      }
    },
    isOverdue() {
      if (this.diff(this.date.dueDate) <= 0) return true
      return false
    },
    isDueSoon() {
      const diff = this.diff(this.date.dueDate)
      if (diff >= -2 && diff <= 2 && diff >= 0) return true
      return false
    },
  },

  methods: {
    test() {
      console.log(this.diff(this.date.dueDate))
    },
    diff(date) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000
      const diffInMilliseconds = Math.abs(date - Date.now())
      return Math.floor(diffInMilliseconds / millisecondsPerDay)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
