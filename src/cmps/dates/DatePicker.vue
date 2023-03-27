<template>
  <section class="date-picker-container">
    <button @click="test">test</button>
    <VueDatePicker v-model="dueDate" inline auto-apply>
      <template #time-picker="{ time, updateTime }">
        <div class="custom-time-picker-component">
          <input
            class="text-input"
            :value="dueDate"
            @change="updateTime(+$event.target.value, false)" />

          <input
            type="text"
            class="text-input"
            :value="`${time.hours}: ${time.minutes}`"
            @change="updateTime(+$event.target.value)" />
        </div>
      </template>
    </VueDatePicker>
  </section>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  components: { VueDatePicker },
  data() {
    return {
      dueDate: null,
    }
  },
  computed: {
    // hoursArray() {
    //   const arr = []
    //   for (let i = 0; i < 24; i++) {
    //     arr.push({ text: i < 10 ? `0${i}` : i, value: i })
    //   }
    //   return arr
    // },
  },
  methods: {
    test() {
      console.log(this.dueDate)
    },
    formatDate(date = Date) {
      return format(date, 'dd.MM.yyyy, HH:mm')
    },
  },
}
</script>
