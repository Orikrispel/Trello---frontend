<template>
  <section class="date-picker-container">
    <VueDatePicker v-model="selectedDate" inline auto-apply>
      <template #time-picker="{ time, updateTime }">
        <div class="custom-time-picker-component">
          <div class="inputs-container start-date-container">
            <label>Start date</label>
            <input
              type="checkbox"
              class="start-date-checkbox"
              @change="disableChooseStart = !disableChooseStart" />
            <div
              :class="
                disableChooseStart
                  ? 'disabled txt-inputs-container'
                  : 'txt-inputs-container'
              ">
              <input
                type="text"
                :class="
                  disableChooseStart
                    ? 'disabled txt-input start-date-input'
                    : 'txt-input start-date-input'
                "
                ref="startDateInput"
                v-model="startDateForDisplay"
                @focus="choosingStart = true"
                @blur="updateDate($event)"
                placeholder="M/D/YYY" />
            </div>
          </div>
          <div class="inputs-container due-date-container">
            <label>Due date</label>
            <input
              type="checkbox"
              class="due-date-checkbox"
              @change="disableChooseDue = !disableChooseDue" />
            <div
              :class="
                disableChooseDue
                  ? 'disabled txt-inputs-container'
                  : 'txt-inputs-container'
              ">
              <input
                type="text"
                :class="
                  disableChooseDue
                    ? 'disabled txt-input due-date-input'
                    : ' txt-input due-date-input'
                "
                ref="dueDateInput"
                v-model="dueDateForDisplay"
                @focus="choosingDue = true"
                @blur="updateDate($event)"
                placeholder="M/D/YYY" />

              <input
                type="text"
                :class="
                  disableChooseDue
                    ? 'disabled txt-input due-time-input'
                    : 'txt-input due-time-input'
                "
                @blur="validateTime"
                @input="updateTime(+$event)"
                placeholder="h:mm A" />
            </div>
          </div>
        </div>
        <button @click="test">test</button>
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
      dateOutput: {
        startDate: null,
        dueDate: null,
      },
      dueDate: null,
      startDate: null,
      dueDateForDisplay: null,
      startDateForDisplay: null,
      dueTime: null,
      choosingDue: false,
      choosingStart: false,
      selectedDate: null,
      disableChooseStart: true,
      disableChooseDue: true,
    }
  },
  created() {},
  computed: {
    newDate() {
      return this.formatDate(this.selectedDate)
    },
  },
  methods: {
    test() {
      console.log(this.dateOutput)
      console.log(Date.now())
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
    dueDate() {
      this.dueDateForDisplay = this.formatDate(this.dueDate)
      this.dateOutput.dueDate = Date.parse(this.dueDate)
    },
    startDate() {
      this.startDateForDisplay = this.formatDate(this.startDate)
      this.dateOutput.startDate = Date.parse(this.startDate)
    },

    disableChooseDue() {
      if (!this.disableChooseDue) {
        this.$refs.dueDateInput.focus()
        this.choosingDue = true
      } else {
        this.choosingDue = false
        this.dueDate = null
      }
    },
    disableChooseStart() {
      if (!this.disableChooseStart) {
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
