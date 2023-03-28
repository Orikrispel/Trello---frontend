<template>
  <section class="date-picker-container">
    <VueDatePicker
      v-model="selectedDate"
      @change="debug(selectedDate)"
      inline
      auto-apply
      no-today
      week-start="0"
      month-name-format="long">
      <template #time-picker="{ time, updateTime }">
        <div class="custom-time-picker-component">
          <!-- <div class="inputs-container start-date-container">
            <label>Start date</label>
            <input
              type="checkbox"
              class="start-date-checkbox"
              v-model="isChooseStart" />
            <div
              :class="
                isChooseStart
                  ? ' txt-inputs-container'
                  : 'disabled txt-inputs-container'
              ">
              <input
                type="text"
                :class="
                  isChooseStart
                    ? ' txt-input start-date-input'
                    : 'disabled txt-input start-date-input'
                "
                ref="startDateInput"
                v-model="startDateForDisplay"
                @focus="choosingStart = true"
                @blur="updateDate($event)"
                placeholder="M/D/YYY" />
            </div>
          </div> -->
          <div class="inputs-container due-date-container">
            <label>Due date</label>
            <input
              type="checkbox"
              class="due-date-checkbox"
              v-model="isChooseDue" />
            <div
              :class="
                isChooseDue
                  ? ' txt-inputs-container'
                  : 'disabled txt-inputs-container'
              ">
              <input
                type="text"
                :class="
                  isChooseDue
                    ? ' txt-input due-date-input'
                    : 'disabled txt-input due-date-input'
                "
                ref="dueDateInput"
                v-model="dueDateForDisplay"
                @focus="choosingDue = true"
                @blur="updateDate($event)"
                placeholder="M/D/YYY" />

              <!-- <input
                type="text"
                :class="
                  isChooseDue
                    ? ' txt-input due-time-input'
                    : 'disabled txt-input due-time-input'
                "
                @blur="validateTime"
                @input="updateTime(+$event)"
                placeholder="h:mm A" /> -->
            </div>
          </div>
        </div>
        <div class="btns-container">
          <button @click="saveDate" class="btn btn-blue btn-save">Save</button>
          <button class="btn btn-light btn-remove">Remove</button>
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
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'DatePIcker',
  components: { VueDatePicker },
  data() {
    return {
      task: null,
      selectedDate: null,
      selectedDates: [],
      dueDate: null,
      startDate: null,
      dueTime: null,
      choosingDue: false,
      choosingStart: false,
      isChooseStart: false,
      isChooseDue: true,
    }
  },
  created() {},
  computed: {
    newDate() {
      if (this.isRangeEnabled) return
      return this.formatDate(this.selectedDate)
    },
    isRangeEnabled() {
      return !this.isChooseDue && !this.isChooseStart
    },
    dueDateForDisplay() {
      const dueDateForDisplay = this.formatDate(this.dueDate)
      return dueDateForDisplay
    },
    startDateForDisplay() {
      const startDateForDisplay = this.formatDate(this.startDate)
      return startDateForDisplay
    },
    dueDateParsed() {
      return Date.parse(this.dueDate)
    },
    startDateParsed() {
      return Date.parse(this.startDate)
    },
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
  },
  async mounted() {
    // if (!this.isRangeEnabled) return
    // const startDate = new Date()
    // const endDate = new Date(new Date().setDate(startDate.getDate() + 7))
    // this.date = new Date()
    // if (this.isRangeEnabled) this.date = [startDate, endDate]
    // console.log(this.date)
    this.task = await this.$store.dispatch({
      type: 'loadCurrTask',
      taskId: this.taskId,
    })
  },
  methods: {
    diff() {
      const millisecondsPerDay = 24 * 60 * 60 * 1000
      const diffInMilliseconds = Math.abs(
        this.dueDateParsed - this.startDateParsed
      )
      return Math.floor(diffInMilliseconds / millisecondsPerDay)
    },
    debug(ev) {
      // console.log(this.saveDate())
      // console.log(this.diff())
      console.log(this.taskId)
    },
    saveDate() {
      // const startDate = this.startDateParsed
      // var dateOutput = { startDate, dueDate }
      const dueDate = this.dueDateParsed

      let task = JSON.parse(JSON.stringify(this.task))
      task.date = { dueDate, isCompleted: false }
      eventBus.emit('updateTask', task)
      this.task = task
    },
    formatDate(date = Date.now()) {
      if (!date) return null
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
        this.selectedDate = parsedDate
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
    timeInput(ev) {
      console.log(ev)
    },
  },

  watch: {
    selectedDate() {
      if (this.choosingDue) {
        this.dueDate = this.selectedDate
      } else if (this.choosingStart) {
        this.startDate = this.selectedDate
      }
    },
    // dueDateParsed() {
    //   this.dateOutput.dueDate =
    // },
    // startDateParsed() {
    //   this.dateOutput.startDate =
    // },

    isChooseDue() {
      if (!this.isChooseDue) {
        this.$refs.dueDateInput.focus()
        this.choosingDue = true
      } else {
        this.choosingDue = false
        this.dueDate = null
      }
    },
    isChooseStart() {
      if (!this.isChooseStart) {
        this.$refs.startDateInput.focus()
        this.choosingStart = true
      } else {
        this.choosingStart = false
        this.startDate = null
      }
    },
    choosingDue() {
      this.choosingDue
        ? (this.choosingStart = false)
        : (this.choosingStart = true)
    },
    choosingStart() {
      this.choosingStart
        ? (this.choosingDue = false)
        : (this.choosingDue = true)
    },
  },
}
</script>
