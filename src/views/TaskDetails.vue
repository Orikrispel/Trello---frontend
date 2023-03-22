<template>
  <section class="task-details main">
    <header class="task-cover">
      <RouterLink :to="'/board'" class="btn-close">X </RouterLink>
    </header>
    <RouterLink :to="'/board'" class="btn-close">X </RouterLink>
    <div class="task-container">
      <div class="task-container-heading">
        <h2 contenteditable="true" @input="updateTitle">
          {{ task.title ? task.title : 'new title' }}
        </h2>
        <small>in list {{ task.list }}</small>
      </div>
      <ul>
        <li v-for="label in task.labels">{{ label }}</li>
      </ul>
      <form class="description-editor" @submit.prevent="handleDesc">
        <h3>
          Description
          <button
            v-if="!userIsEditing && task.description"
            @click="userIsEditing = !userIsEditing">
            Edit
          </button>
        </h3>
        <div
          v-if="!userIsEditing && !task.description"
          @click="userIsEditing = !userIsEditing">
          Add a more detailed description...
        </div>
        <p v-if="!userIsEditing" @click="userIsEditing = !userIsEditing">
          {{ task.description }}
        </p>
        <textarea
          v-if="userIsEditing"
          v-model="task.description"
          @blur="userIsEditing = !userIsEditing"></textarea>
      </form>

      <aside class="btns-container">
        <h4>Add to card</h4>
        <button>
          <div class="icon" v-html="getSvg('star')"></div>
        </button>
        <button>Labels</button>
        <button>Checklist</button>
        <button>Dates</button>
        <button>Attachment</button>
        <button>Location</button>
      </aside>
      <div class="comments-activity-container">
        <h3>Activity</h3>
        <form class="comment-form" @submit.prevent="handleComment">
          <textarea name="comment" placeholder="Write a comment..."></textarea>
        </form>
        <ul v-if="task.comments" class="clean-list">
          <li v-for="(comment, idx) in task.comments" :key="idx">
            {{ comment }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script>
import { svgService } from '../services/svg.service'

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
    getSvg(iconName) {
      return svgService.getSvg(iconName)
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
