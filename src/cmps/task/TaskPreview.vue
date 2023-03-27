<template>
  <section v-if="task" class="task-preview">
    <button class="clean-btn btn-menu">
      <span class="icon icon-edit" @click="openTaskOptions"></span>
    </button>
    <span class="task-title fs14">{{ task.title }}</span>
    <span class="todo-attachments">
      <!-- <TaskAttachments :task="task" /> -->
    </span>
  </section>
</template>

<script>
import { svgService } from '../../services/svg.service'
import TaskAttachments from './TaskAttachments.vue'
export default {
  name: 'TaskPreview',
  props: ['task'],
  data() {
    return {}
  },
  computed: {},
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
  components: {
    TaskAttachments,
  },
}
</script>
