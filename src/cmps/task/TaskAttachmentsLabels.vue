<template>
  <section v-if="task" class="labels-attachments flex align-center">
    <ul class="label-wrapper-list clean-list flex">
      <li @click.stop="handleLabelClick"
        :class="['label-wrapper flex align-center justify-between', { 'with-title': showLabelTitle }]"
        v-for="label in task.labels" :key="label._id"
        :style="{ 'background': showLabelTitle ? label.color + '60' : label.color }">
        <span :style="{ 'background-color': label.color }" class="sm-label-circle"></span>
        <p :class="['fs12', { 'show': showLabelTitle }]">{{ label.title }}</p>
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
    eventBus.on('showLabelsTitle', this.toggleLabelTitle)
  },
  methods: {
    setLabels() {
      if (!this.Task) return
      this.members = this.task.members
    },
    toggleLabelTitle() {
      this.showLabelTitle = !this.showLabelTitle
    },
    handleLabelClick() {
      eventBus.emit('showLabelsTitle')
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
