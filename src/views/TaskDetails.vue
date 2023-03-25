<template>
  <section class="task-details">
    <header v-if="task.cover" class="task-cover">
      <RouterLink :to="'/board'" class="btn-close">
        <div class="icon" v-html="getSvg('close')"></div>
      </RouterLink>
    </header>
    <RouterLink v-if="!task.cover" :to="`/board/${boardId}`" class="btn-close">
      <div class="icon" v-html="getSvg('close')"></div>
    </RouterLink>
    <div class="task-container">
      <div class="task-container-heading flex column">
        <!-- '<div class="txt-container"> -->
        <div class="task-title-wrapper">
          <h2 class="task-title fs20" contenteditable="true" @input="updateTitle">
            <span class="icon header-icon"></span>
            {{ task.title ? task.title : 'new title' }}
          </h2>
        </div>
        <span class="list-related"> in list {{ task.list }}</span>
      </div>

      <div class="task-main-container">
        <main class="task-main">
          <div class="label-container">
            <h3 class="fs12">Labels</h3>
            <ul class="task-heading-label-list flex clean-list">
              <li class="label" v-for="label in task.labels" :key="label.id">
                <LabelPreview :label="label" />
              </li>
            </ul>
          </div>

          <form class="description-editor editor" @submit.prevent="handleDesc">
            <h3><span class="icon description-icon"></span>Description</h3>
            <button v-if="!userIsEditing && task.description" @click="userIsEditing = !userIsEditing">
              Edit
            </button>

            <div v-if="!userIsEditing && !task.description" @click="userIsEditing = !userIsEditing">
              Add a more detailed description...
            </div>
            <p v-if="!userIsEditing" @click="handleDesc">
              {{ task.description }}
            </p>
            <textarea v-if="userIsEditing" v-model="task.description" @blur="userIsEditing = false" autofocus></textarea>
            <button class="btn-submit-desc" v-if="userIsEditing" type="submit">
              Save
            </button>
            <button class="btn-cancel-submit" v-if="userIsEditing" type="submit">
              Cancel
            </button>
          </form>

          <div class="comments-activity-container editor">
            <h3><span class="icon activity-icon"></span> Activity</h3>
            <form class="comment-form" @submit.prevent="handleComment">
              <textarea name="comment" placeholder="Write a comment..."></textarea>
            </form>
            <ul v-if="task.comments && task.comments.length" class="clean-list">
              <li v-for="(comment, idx) in task.comments" :key="idx">
                {{ comment }}
              </li>
            </ul>
            <ul v-if="task.activities && task.activities.length" class="clean-list">
              <li v-for="(activity, idx) in task.activities" :key="idx">
                {{ activity }}
              </li>
            </ul>
            <button @click="test">test</button>
          </div>
        </main>

        <aside class="btns-container side-bar flex">
          <h4>Add to card</h4>
          <button><span class="icon member-icon"></span> Members</button>
          <button @click="labelMenuOpen = true">
            <span class="icon label-icon"></span>Labels
          </button>
          <button @click="checklistMenuOpen = !checklistMenuOpen"><span
              class="icon checklist-icon"></span>Checklist</button>
          <button><span class="icon watch-icon"></span>Dates</button>
          <button><span class="icon attachments-icon"></span>Attachment</button>
          <button v-if="!task.cover">
            <span class="icon card-cover-icon"></span>Cover
          </button>
          <LabelMenu @closeLabelMenu="labelMenuOpen = false" v-if="labelMenuOpen" />
          <ActionModal v-if="checklistMenuOpen" :actionData="{ title: 'Add Checklist', type: 'ColorPicker' }" />
        </aside>
      </div>
    </div>
  </section>
</template>

<script>
import {
  eventBus,
  showErrorMsg,
  showSuccessMsg,
} from '../services/event-bus.service'
import { svgService } from '../services/svg.service'
import LabelMenu from '../cmps/label/LabelMenu.vue'
import LabelPreview from '../cmps/label/LabelPreview.vue'
import ActionModal from '../cmps/ActionModal.vue'
import { getActionUpdateBoard } from '../store/board.store'
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
      board: {},
      userIsEditing: false,
      labelMenuOpen: false,
      checklistMenuOpen: false,
    }
  },
  async created() {
    eventBus.on('updateTask', (task) => {
      this.saveTask(task)
    })
    const { taskId } = this.$route.params
    let task = await this.$store.dispatch({ type: 'loadCurrTask', taskId })
    if (!task) {
      task = this.$store.getters.emptyTask
    }
    this.task = { ...task }
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
  },
  methods: {
    updateTitle(ev) {
      this.task.title = ev.target.innerText
    },
    handleDesc() {
      this.userIsEditing = !this.userIsEditing
      // this.$refs.taskDesc.focus()
    },
    handleComment() {
      console.log(this.task)
    },
    async saveTask(task) {
      let board = JSON.parse(JSON.stringify(this.board))
      let updatedTask = { ...task }
      let group = board.groups.find((group) => {
        return group.tasks.some((t) => t.id === updatedTask.id)
      })
      const taskIdx = group.tasks.findIndex((t) => t.id === updatedTask.id)
      const groupIdx = board.groups.indexOf(group)
      board.groups[groupIdx].tasks.splice(taskIdx, 1, updatedTask)
      this.task = updatedTask
      try {
        await this.updateBoard(board, 'Task updated', 'Failed to updated task')
      } catch (err) {
        console.log('failed to updated task')
        throw err
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    async updateBoard(board, successMsg, errMsg) {
      try {
        this.board = board
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg(successMsg)
      } catch (err) {
        console.log(err)
        showErrorMsg(errMsg)
      }
    },
  },

  computed: {
    // currTask() {
    //   let task = this.$store.getters.currTask
    //   if (!task) task = this.$store.getters.emptyTask
    //   this.task = this.currTask
    // },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },

  unmounted() {
    this.saveTask(this.task)
  },

  watch: {
    '$route.params': {
      async handler() {
        const { taskId, boardId } = this.$route.params
        let task = await this.$store.dispatch({ type: 'loadCurrTask', taskId })
        this.task = task
      },
      immediate: true,
    },
  },
  components: {
    LabelMenu,
    LabelPreview,
    ActionModal,
  },
}
</script>
