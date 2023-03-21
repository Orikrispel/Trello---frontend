<template>
  <section class="task-details">
    <!-- <RouterLink :to="'/task'" class="btn">
      <span>X</span>
    </RouterLink> -->
    <div class="task-container">
      <h1>
        {{ task.title }}
      </h1>
      <p>{{ task.description }}</p>
      <ul v-if="task.comments" class="clean-list">
        <li v-for="(comment, idx) in task.comments" :key="idx">
          {{ comment }}
        </li>
      </ul>
      <aside class="btns-container">
        <button>Labels</button>
        <button>Checklist</button>
        <button>Dates</button>
        <button>Location</button>
      </aside>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
    }
  },
  created() {
    const { taskId } = this.$route.params
    // console.log(task)
    this.task = this.$store.getters.emptyTask
  },
  //   watch: {
  //     '$route.params': {
  //       handler() {
  //         const { taskId } = this.$route.params
  //         this.task = task
  //       },
  //       immediate: true,
  //     },
  //   },
}
</script>
