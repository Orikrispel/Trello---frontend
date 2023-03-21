<template>
  <section class="task-details">
    <RouterLink :to="'/task'" class="btn">
      <span>X</span>
    </RouterLink>
    <div class="task-container">
      <h1>
        {{ task.name }}
        <small>{{ task.inStock ? 'available' : 'out of stock' }}</small>
      </h1>
      <h3>{{ task.price }}$</h3>
      <ul class="clean-list">
        <li v-for="(label, idx) in task.labels" :key="idx">
          {{ label }}
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import { taskService } from '../services/task.service.js'
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
    }
  },
  created() {
    const { taskId } = this.$route.params
    taskService.get(taskId).then((task) => {
      console.log(task)
      this.task = task
    })
  },
  watch: {
    '$route.params': {
      handler() {
        const { taskId } = this.$route.params
        taskService.get(taskId).then((task) => {
          this.task = task
        })
      },
      immediate: true,
    },
  },
}
</script>
