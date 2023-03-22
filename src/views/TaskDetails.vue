<template>
  <section class="task-details main">
    <header v-if="task.cover" class="task-cover">
      <RouterLink :to="'/board'" class="btn-close">
        <div class="icon" v-html="getSvg('close')"></div>
      </RouterLink>
    </header>

    <div class="task-container">
      <div class="task-container-heading">
        <div class="txt-container">
          <h2 contenteditable="true" @input="updateTitle">
            {{ task.title ? task.title : 'new title' }}
          </h2>
          <small>in list {{ task.list }}</small>
        </div>
        <RouterLink v-if="!task.cover" :to="'/board'" class="btn-close"
          ><div class="icon" v-html="getSvg('close')"></div>
        </RouterLink>
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

      <aside class="btns-container flex">
        <h4>Add to card</h4>
        <button class="flex align-center">
          <div class="icon" v-html="getSvg('addMember')"></div>
          Members
        </button>

        <button>Labels</button>
        <button class="flex align-center">
          <div class="icon" v-html="getSvg('checkInsideBox')"></div>
          Checklist
        </button>
        <button class="flex align-center">
          <div class="icon" v-html="getSvg('clock')"></div>
          Dates
        </button>
        <button class="flex align-center">
          <div class="icon" v-html="getSvg('attachment')"></div>
          Attachment
        </button>
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
