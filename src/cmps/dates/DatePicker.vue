<template>
  <section class="date-picker-container">
    <v-date-picker
      v-model="range"
      locale="en-us"
      is-range
      :masks="{ title: 'MMMM YYYY', weekdays: 'WWW' }">
    </v-date-picker>

    <div class="custom-date-picker-component">
      <div class="inputs-container start-date-container">
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
            @blur="updateStartDate($event)"
            placeholder="M/D/YYY" />
        </div>
      </div>
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
            @change="updateEndDate($event)"
            placeholder="M/D/YYYY" />
          <v-date-picker mode="time">
            <input
              type="text"
              :class="
                isChooseDue
                  ? ' txt-input due-time-input'
                  : 'disabled txt-input due-time-input'
              "
              v-model="time"
              @blur="validateTime()"
              placeholder="h:mm A" />
          </v-date-picker>
        </div>
      </div>
    </div>

    <div class="btns-container">
      <button @click="saveDate" class="btn btn-blue btn-save">Save</button>
      <button @click="debug" class="btn btn-light btn-remove">Remove</button>
    </div>
  </section>
</template>

<script>
import { utilService } from '../../services/util.service'
// import VueDatePicker from '@vuepic/vue-datepicker'
// import '@vuepic/vue-datepicker/dist/main.css'
import { format } from 'date-fns'
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'DatePIcker',
  // components: { VueDatePicker },
  data() {
    return {
      range: {
        start: null,
        end: null,
      },
      dueDateForDisplay: null,
      startDateForDisplay: null,
      time: null,
      task: null,
      dueTime: null,
      choosingDue: false,
      choosingStart: false,
      isChooseStart: false,
      isChooseDue: true,
    }
  },
  computed: {
    newDate() {
      if (this.isRangeEnabled) return
      return this.formatDate(this.selectedDate)
    },
    isRangeEnabled() {
      return this.isChooseDue && this.isChooseStart
    },
    setDueDateForDisplay() {
      const dueDateForDisplay = this.formatDate(this.range.end)
      if (!this.isChooseDue) return null

      this.dueDateForDisplay = dueDateForDisplay
    },
    setStartDateForDisplay() {
      const startDateForDisplay = this.formatDate(this.range.start)
      if (!this.isChooseStart) return null

      this.startDateForDisplay = startDateForDisplay
    },
    dueDateParsed() {
      return Date.parse(this.range.end)
    },
    startDateParsed() {
      if (!this.range.start) return null
      return Date.parse(this.range.start)
    },
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
  },
  async mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$refs.dueDateInput.focus()
      }, 100)
    })
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
    this.time = this.formatTimeToAMPM(
      `${new Date().getHours()}:${new Date().getMinutes()}`
    )
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
      // console.log(this.dueDateForDisplay)
      // console.log(this.startDateForDisplay)

      console.log('time', this.time)
    },
    saveDate() {
      let dueDate = this.dueDateParsed
      let dueTime = this.time
      let startDate = this.startDateParsed
      if (isNaN(dueDate)) return

      if (dueDate === startDate) startDate = null
      let task = JSON.parse(JSON.stringify(this.task))
      task.date = { dueDate, startDate, dueTime, isCompleted: false }
      let activity = this.$store.getters.emptyActivity
      activity = { ...activity }
      let user = this.$store.getters.loggedinUser
      activity.txt = `set ${
        task.title
      } to be due ${utilService.formatDateString(dueDate)} at ${dueTime}`
      activity.task = { title: task.title, taskId: this.taskId }
      activity.type = 'date'
      activity.byMember = {
        fullname: user.fullname,
        _id: user._id,
      }

      eventBus.emit('updateTask', { task, activity })
      this.task = task
    },
    formatDate(date = Date.now()) {
      if (!date) return null
      return utilService.getFormattedDate(date)
    },
    parseValidDate(inputDate) {
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

      if (isValidDate) return parsedDate
      return null
    },
    updateStartDate(event) {
      let startDate = event.target.value
      startDate = this.parseValidDate(startDate)
      this.range.start = startDate
    },
    updateEndDate(event) {
      let endDate = event.target.value
      endDate = this.parseValidDate(endDate)
      this.range.end = endDate
    },
    validateTime() {
      let timeValue = this.time.trim()
      let timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/
      let timeRegex12 = /^(1[012]|[1-9]):([0-5][0-9])([AP]M)?$/i

      if (timeValue.match(timeRegex) || timeValue.match(timeRegex12)) {
        this.time = this.formatTimeToAMPM(timeValue)
      } else {
        this.time = ''
      }
      console.log(this.time)
    },
    formatTimeToAMPM(timeString) {
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString
      }
      const timeArray = timeString.split(':')
      const hour = parseInt(timeArray[0], 10)
      let minute = timeArray[1].padStart(2, '0')
      // if (minute <= 9) minute = `0${minute}`
      const period = hour >= 12 ? 'PM' : 'AM'
      const formattedHour = hour % 12 || 12

      return `${formattedHour}:${minute} ${period}`
    },
    timeInput(ev) {
      let userTimeInput = ev.target.value
      console.log(Date.parse(userTimeInput))
    },
  },

  watch: {
    'range.start'() {
      const startDateForDisplay = this.formatDate(this.range.start)
      if (!this.isChooseStart) this.startDateForDisplay = null
      else this.startDateForDisplay = startDateForDisplay
    },
    'range.end'() {
      const dueDateForDisplay = this.formatDate(this.range.end)
      if (!this.isChooseDue) this.dueDateForDisplay = null
      else this.dueDateForDisplay = dueDateForDisplay
    },

    // dueDateParsed() {
    //   this.dateOutput.dueDate =
    // },
    // startDateParsed() {
    //   this.dateOutput.startDate =
    // },

    // isChooseDue() {
    //   if (this.isChooseDue) {
    //     this.choosingDue = true
    //   } else {
    // this.$refs.dueDateInput.focus()
    // this.choosingDue = false
    // this.dueDate = null
    // }
    // },
    // isChooseStart() {
    //   if (!this.isChooseStart) {
    //     this.$refs.startDateInput.focus()
    //     this.choosingStart = true
    //   } else {
    //     this.choosingStart = false
    //     this.startDate = null
    //   }
    // },
    // choosingDue() {
    //   this.choosingDue
    //     ? (this.choosingStart = false)
    //     : (this.choosingStart = true)
    // },
    // choosingStart() {
    //   this.choosingStart
    //     ? (this.choosingDue = false)
    //     : (this.choosingDue = true)
  },
}
</script>
