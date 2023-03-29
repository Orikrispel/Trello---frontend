<template>
  <div class="due-date-preview-container">
    <input type="checkbox" v-model="date.isCompleted" />
    <button @click="test" class="btn btn-light flex">
      {{ dateForDisplay }}
      <span :class="class">{{ this.class }}</span>
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
  data() {
    return {
      class: '',
    }
  },
  computed: {
    dateForDisplay() {
      const diff = this.diff(this.date.dueDate)
      if (diff === 0) {
        this.class = 'due-soon'
        return `Today ${utilService.formatDateString(this.date.dueDate)}`
      } else if (diff === -1) {
        this.class = 'due-soon'
        return `Tomorrow ${utilService.formatDateString(this.date.dueDate)}`
      } else if (diff === 1) {
        this.class = 'overdue'

        return `Yesterday ${utilService.formatDateString(this.date.dueDate)}`
      } else if (diff >= 0) {
        this.class = 'overdue'

        return utilService.formatDateString(this.date.dueDate)
      } else if (this.date.isCompleted) {
        this.class = 'completed'
        return utilService.formatDateString(this.date.dueDate)
      } else this.class = ''
      return utilService.formatDateString(this.date.dueDate)
    },

    // dueTime() {
    //   const diff = this.diff(this.date.dueDate)
    //   if (diff >= -2 && diff <= 2 && diff >= 0) return 'due-soon'
    //   else if (this.diff(this.date.dueDate) <= 0) return 'overdue'
    //   else return ''
    // },
  },

  methods: {
    test() {
      let res = utilService.formatDateString(this.date.dueDate)
      console.log(res)
    },
    diff(date) {
      const millisecondsPerDay = 24 * 60 * 60 * 1000
      const diffInMilliseconds = Date.now() - date
      return Math.floor(diffInMilliseconds / millisecondsPerDay)
    },
    hourDiff(start, end) {
      const diff = Math.abs(end - start)
      const diffInHours = diff / (1000 * 60 * 60)
      return diffInHours
    },

    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
