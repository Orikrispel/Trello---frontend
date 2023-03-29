<template>
  <section v-if="task" class="labels-attachments flex">
    <ul class="label-wrapper-list clean-list flex">
      <li class="label-wrapper" v-for="label in task.labels" :key="label._id" :style="{ 'background': label.color }">
        <p v-show="!showLabelTitle" class="fs12">{{ label.title }}</p>
      </li>
    </ul>
  </section>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'TaskAttachmentsLabels',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showLabelTitle: false
    }
  },
  created() {
  },
  methods: {
    setLabels() {
      if (!this.Task) return
      this.members = this.task.members
    }
  },
  computed: {
  },
  watch: {
    task: {
      immediate: true,
      handler() {
        // this.setLabels()
      },
    },
  },
}

</script>
