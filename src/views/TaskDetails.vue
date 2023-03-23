<template>
  <section class="task-details main">
    <!-- <header v-if="task.cover" class="task-cover">
      <RouterLink :to="'/board'" class="btn-close">
        '<div class="icon" v-html="getSvg("close")"></div>',
      </RouterLink>
    </header> -->
    '
    <div class="task-container">
      '
      <div class="task-container-heading">
        <!-- '<div class="txt-container"> -->
        <h2 contenteditable="true" @input="updateTitle">
          <span class="icon header-icon"></span>
          {{ task.title ? task.title : 'new title' }}
        </h2>
        <small>
          <span class="icon header-icon"></span> in list {{ task.list }}</small
        >
        <!-- </div> -->
        <RouterLink v-if="!task.cover" :to="'/board'" class="btn-close">
          '
          <div class="icon" v-html="getSvg('close')"></div>
          ',
        </RouterLink>
      </div>
      <ul class="task-heading-label-list flex clean-list">
        <h3>Labels</h3>
        <li v-for="label in task.labels" :key="label.id">{{ label.txt }}</li>
      </ul>
      <form class="description-editor" @submit.prevent="handleDesc">
        <h3>
          <span class="icon description-icon"></span>
          Description
          <button
            v-if="!userIsEditing && task.description"
            @click="userIsEditing = !userIsEditing">
            Edit
          </button>
        </h3>
        '
        <div
          v-if="!userIsEditing && !task.description"
          @click="userIsEditing = !userIsEditing">
          Add a more detailed description...
        </div>
        <p v-if="!userIsEditing" @click="handleDesc">
          {{ task.description }}
        </p>
        <textarea
          v-if="userIsEditing"
          v-model="task.description"
          @blur="userIsEditing = !userIsEditing"
          autofocus></textarea>
        <button class="btn-submit-desc" v-if="userIsEditing" type="submit">
          Save
        </button>
        <button class="btn-cancel-submit" v-if="userIsEditing" type="submit">
          Cancel
        </button>
      </form>

      <aside class="btns-container flex">
        <h4>Add to card</h4>
        <button><span class="icon member-icon"></span> Members</button>
        <button @click="labelMenuOpen = true">
          <span class="icon label-icon"></span>Labels
        </button>
        <button><span class="icon checklist-icon"></span>Checklist</button>
        <button><span class="icon watch-icon"></span>Dates</button>
        <button><span class="icon attachments-icon"></span>Attachment</button>
        <button v-if="!task.cover">
          <span class="icon card-cover-icon"></span>Cover
        </button>
      </aside>
      '
      <div class="comments-activity-container">
        <h3><span class="icon activity-icon"></span> Activity</h3>
        <form class="comment-form" @submit.prevent="handleComment">
          <textarea name="comment" placeholder="Write a comment..."></textarea>
        </form>
        <ul v-if="task.comments" class="clean-list">
          <li v-for="(comment, idx) in task.comments" :key="idx">
            {{ comment }}
          </li>
        </ul>
        <ul v-if="task.activities" class="clean-list">
          <li v-for="(activity, idx) in task.activities" :key="idx">
            {{ activity }}
          </li>
        </ul>
        <button @click="test">test</button>
      </div>
    </div>
    <LabelMenu @closeLabelMenu="labelMenuOpen = false" v-if="labelMenuOpen" />
  </section>
</template>

<script>
import { svgService } from '../services/svg.service'
import LabelMenu from '../cmps/label/LabelMenu.vue'
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
      userIsEditing: false,
      labelMenuOpen: false,
    }
  },
  async created() {
    const { taskId } = this.$route.params
    let task = await this.$store.dispatch({ type: 'setCurrTask', taskId })
    this.task = task
  },
  methods: {
    updateTitle(ev) {
      this.task.title = ev.target.innerText
    },
    handleDesc() {
      userIsEditing = !this.userIsEditing
      this.$refs.taskDesc.focus()
    },
    async saveTask() {
      let task = { ...this.task }
      await this.$store.dispatch({ type: 'saveTask', task })
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },

  computed: {
    currTask() {
      let task = this.$store.getters.currTask
      if (!task) task = this.$store.getters.emptyTask
      this.task = this.currTask
    },
  },

  unmounted() {
    this.saveTask()
  },

  watch: {
    '$route.params': {
      async handler() {
        const { taskId } = this.$route.params
        let task = await this.$store.dispatch({ type: 'setCurrTask', taskId })
        this.task = task
      },
      immediate: true,
    },
  },
  components: {
    LabelMenu,
  },
}
</script>
