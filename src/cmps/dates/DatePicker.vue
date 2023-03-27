<template>
  <section class="date-picker-container">
    <VueDatePicker v-model="dueDate" inline auto-apply>
      <template #time-picker="{ time, updateTime }">
        <div class="custom-time-picker-component">
          <div class="start-date start-date-container">
            <label>Start date</label>
            <input type="checkbox" class="start-date start-date-checkbox" />
            <input
              type="text"
              class="txt-input start-date start-date-input"
              v-model="startDateForDisplay" />
          </div>
          <div class="due-date due-date-container">
            <label>Due date</label>
            <input type="checkbox" class="due-date due-date-checkbox" />
            <input
              type="text"
              class="txt-input due-date due-date-input"
              v-model="dueDateForDisplay"
              @change="updateDate($event)" />

            <input
              type="text"
              class="txt-input due-time"
              v-model="timeInput"
              @blur="validateTime"
              @input="updateTime(+$event)" />
          </div>
        </div>
      </template>
    </VueDatePicker>
  </section>
</template>

<script>
import { utilService } from '../../services/util.service'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'
export default {
  components: { VueDatePicker },
  data() {
    return {
      date: Date.now(),
      dueDate: null,
      dueDateForDisplay: null,
      startDateForDisplay: null,
      dueTime: null,
    }
  },
  computed: {
    newDate() {
      return this.formatDate(this.dueDate)
    },
  },
  methods: {
    test() {
      console.log(this.dueDate)
    },
    formatDate(date = Date.now()) {
      return utilService.getFormattedDate(date)
    },
    updateDate(event) {
      const inputDate = event.target.value
      const parts = inputDate.split('/')
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10)
      const year = parseInt(parts[2], 10)
      const parsedDate = new Date(year, month - 1, day)
      const isValidDate =
        !isNaN(parsedDate.getTime()) &&
        parsedDate.getDate() === day &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getFullYear() === year

      if (isValidDate) {
        this.dueDate = parsedDate
      }
    },
    validateTime() {
      const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9] ?(am|pm)$/i
      if (!timeRegex.test(this.timeInput)) {
        return
      }
    },
    updateTime(hours, minutes) {
      console.log(hours, minutes)
      // const timeInMs = (hours * 60 + minutes) * 60 * 1000
      // this.dueDate = new Date(
      //   this.dueDate.getTime() -
      //     this.dueDate.getTimezoneOffset() * 60 * 1000 +
      //     timeInMs
      // )
    },
  },

  watch: {
    dueDate() {
      this.dateForDisplay = this.formatDate(this.dueDate)
    },
  },
}
</script>
