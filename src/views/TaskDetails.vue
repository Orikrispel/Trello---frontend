<template>
  <section class="task-details main">
    <header class="task-cover">
      <RouterLink :to="'/board'" class="btn">X </RouterLink>
    </header>
    <button @click="test()">test</button>
    <div class="task-container">
      <h2 contenteditable="true" @input="updateTitle">
        {{ task.title ? task.title : 'new title' }}
      </h2>

      <form @submit.prevent="handleDesc">
        <button v-if="!userIsEditing" @click="userIsEditing = !userIsEditing">
          Edit
        </button>
        <p v-if="!userIsEditing">{{ task.description }}</p>
        <textarea
          v-if="userIsEditing"
          v-model="task.description"
          @blur="userIsEditing = !userIsEditing"></textarea>
      </form>

      <aside class="btns-container">
        <button>Labels</button>
        <button>Checklist</button>
        <button>Dates</button>
        <button>Location</button>
      </aside>
      <ul v-if="task.comments" class="clean-list">
        <li v-for="(comment, idx) in task.comments" :key="idx">
          {{ comment }}
        </li>
      </ul>
      <form class="comment-form" @submit.prevent="handleComment">
        <textarea name="comment"></textarea>
      </form>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
      userIsEditing: false,
    }
  },
  created() {
    const { taskId } = this.$route.params
    // console.log(task)
    this.task = this.$store.getters.emptyTask
  },
  methods: {
    test() {
      console.log(this.task)
    },
    updateTitle(ev) {
      this.task.title = ev.target.innerText
    },
    async saveTask() {
      let task = { ...this.task }
      await this.$store.dispatch({ type: 'saveTask', task })
    },
  },
  unmounted() {
    this.saveTask()
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
