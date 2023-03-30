<template>
  <div class="due-date-preview-container flex align-center">
    <input type="checkbox" v-model="date.isCompleted" />
    <VDropdown :distance="6" :placement="'right'
    ">
      <button class="btn-date btn-task light flex align-center">
        {{ dateForDisplay }}
        <span :class="spanClass">{{ spanClass }}</span>
        <span class="icon-arrow-down" v-html="getSvg('arrowDown')"></span>
      </button>

      <template #popper>
        <DynamicModal>
          <template v-slot:title>Dates</template>

          <template v-slot scope="props">
            <DatePicker />
          </template>
        </DynamicModal>
      </template>
    </VDropdown>

  </div>
</template>
<script>
import { utilService } from '../../services/util.service'
import { svgService } from '../../services/svg.service'
import DynamicModal from '../../cmps/DynamicModal.vue'
import DatePicker from '../../cmps/dates/DatePicker.vue'
export default {
  name: 'DatePreview',
  props: {
    date: {
      type: Object,
      required: true,
    },
  },
  data() { },
  computed: {
    dateForDisplay() {
      return `${this.getDay} ${utilService.formatDateString(this.date.dueDate)}`
    },
    spanClass() {
      const diff = this.diff(this.date.dueDate)

      if (!this.date.isCompleted) {
        if (diff === 0 || diff === -1) return 'due-soon'
        else if (diff === 1 || diff >= 0) return 'overdue'
        else return ''
      }
      return 'complete'
    },
    getDay() {
      const diff = this.diff(this.date.dueDate)

      if (diff === 0) {
        return `today`
      } else if (diff === -1) {
        return `tomorrow`
      } else if (diff === 1) {
        return `yesterday`
      } else return ''
    },
  },

  methods: {
    test() {
      let res = utilService.formatDateString(this.date.dueDate)
      console.log(this.date)
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
  components: {
    DynamicModal,
    DatePicker
  }
}
</script>
