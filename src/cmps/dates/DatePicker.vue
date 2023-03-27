<template>
  <VueDatePicker v-model="date" ref="datepicker" @click="test($event)" />
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

export default {
  name: 'DatePicker',
  data() {
    return {
      date: null,
    }
  },
  methods: {
    test(event) {
      console.log(event)
    },
  },
  //   mounted() {
  //     this.$nextTick(() => {
  //       this.$refs.datepicker.context.visible = true
  //     })
  //   },
}
</script>
