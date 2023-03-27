<template>
  <div class="modal-overlay flex" @click="closeTaskDetails">
    <section class="task-details" @click.stop>
      <header v-if="task.cover" class="task-cover">
        <RouterLink :to="`/board/${boardId}`" class="btn-close">
          <div class="icon" v-html="getSvg('close')"></div>
        </RouterLink>
      </header>

      <RouterLink
        v-if="!task.cover"
        :to="`/board/${boardId}`"
        class="btn-close">
        <div class="icon" v-html="getSvg('close')"></div>
      </RouterLink>
      <div class="task-container">
        <div class="task-container-heading flex column">
          <div class="task-title-wrapper">
            <h2
              class="task-title fs20"
              contenteditable="true"
              @blur="updateTitle">
              <span
                contenteditable="false"
                class="icon header-icon icon-lg"></span>
              {{ task.title ? task.title : 'new title' }}
            </h2>
          </div>
          <p class="list-related">in list {{ task.list }}</p>
        </div>

        <div class="task-main-container">
          <main class="task-main">
            <div class="label-container">
              <h3 class="fs12">Labels</h3>
              <ul class="task-heading-label-list flex clean-list">
                <li
                  v-for="member in task.members"
                  :key="member._id"
                  class="member">
                  <MemberPreview :member="member" />
                </li>
              </ul>
              <ul class="task-heading-label-list flex clean-list">
                <li class="label" v-for="label in task.labels" :key="label.id">
                  <LabelPreview :label="label" />
                </li>
              </ul>
            </div>
            <!-- checklist list -->
            <ChecklistList :task="task" />

            <!-- description -->
            <form
              class="description-editor editor"
              @submit.prevent="handleDesc">
              <h3>
                <span class="icon description-icon icon-lg"></span>Description
              </h3>
              <button
                class="btn btn-light"
                v-if="!userIsEditing && task.description"
                @click="userIsEditing = !userIsEditing">
                Edit
              </button>

              <p
                class="btn btn-desc"
                v-if="!userIsEditing && !task.description"
                @click="userIsEditing = !userIsEditing">
                Add a more detailed description...
                <br />
                <br />
              </p>
              <p v-if="!userIsEditing" @click="handleDesc">
                {{ task.description }}
              </p>
              <textarea
                v-if="userIsEditing"
                v-model="task.description"
                @blur="userIsEditing = false"
                autofocus></textarea>
              <button
                class="btn btn-blue"
                v-if="userIsEditing"
                @click="saveTask(task)">
                Save
              </button>
              <button class="btn btn-cancel-submit" v-if="userIsEditing">
                Cancel
              </button>
            </form>

            <div class="comments-activity-container editor">
              <div class="editor-header">
                <span class="icon activity-icon icon-lg"></span>
                <h3 class="activity-title">Activity</h3>
              </div>
              <form class="comment-form" @submit.prevent="handleComment">
                <div class="comment-box-input">
                  <div class="member-img icon icon-lg">
                    {{
                      loggedInUser.imgUrl
                        ? loggedInUser.imgUrl
                        : loggedInUser.fullname.charAt(0).toUpperCase()
                    }}
                  </div>
                  <textarea
                    name="comment"
                    placeholder="Write a comment..."></textarea>
                </div>
              </form>
              <ul
                v-if="task.comments && task.comments.length"
                class="clean-list">
                <li v-for="(comment, idx) in task.comments" :key="idx">
                  {{ comment }}
                </li>
              </ul>
              <ul
                v-if="task.activities && task.activities.length"
                class="clean-list">
                <li v-for="(activity, idx) in task.activities" :key="idx">
                  {{ activity }}
                </li>
              </ul>
            </div>
          </main>

          <aside class="btns-container side-bar flex">
            <h4>Add to card</h4>

            <VDropdown :distance="6">
              <button>
                <span class="icon icon-small member-icon"></span> Members
              </button>

              <template #popper>
                <DynamicModal>
                  <template v-slot:title>Members</template>

                  <template v-slot scope="props">
                    <MembersList />
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>

            <VDropdown :distance="6">
              <button>
                <span class="icon icon-small label-icon"></span>Labels
              </button>

              <template #popper>
                <DynamicModal>
                  <template v-slot:title>{{
                    userIsEditing ? 'Create a label' : 'Labels'
                  }}</template>

                  <template v-slot scope="props">
                    <LabelMenu />
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>

            <VDropdown :distance="6">
              <button>
                <span class="icon icon-small checklist-icon"></span>Checklist
              </button>

              <template #popper>
                <DynamicModal>
                  <template v-slot:title>Add checklist</template>

                  <template v-slot scope="props">
                    <AddChecklist
                      :actionData="{ task: task }"
                      @setCreateModeOff="checklistMenuOpen = false" />
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>
            <VDropdown :distance="6">
              <button>
                <span
                  class="icon icon-small time-icon"
                  v-html="getSvg('watch')"></span
                >Dates
              </button>

              <template #popper>
                <DynamicModal>
                  <template v-slot:title>Dates</template>

                  <template v-slot scope="props">
                    <DatePicker />
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>

            <button>
              <span class="icon icon-small attachments-icon"></span>Attachment
            </button>
            <button v-if="!task.cover">
              <span class="icon icon-small card-cover-icon"></span>Cover
            </button>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import {
  eventBus,
  showErrorMsg,
  showSuccessMsg,
} from '../services/event-bus.service'
import { svgService } from '../services/svg.service'
import DatePicker from '../cmps/dates/DatePicker.vue'
import MembersList from '../cmps/members/MembersList.vue'
import MemberPreview from '../cmps/members/MemberPreview.vue'
import LabelMenu from '../cmps/label/LabelMenu.vue'
import LabelPreview from '../cmps/label/LabelPreview.vue'
import AddChecklist from '../cmps/AddChecklist.vue'
import ChecklistList from '../cmps/checklist/ChecklistList.vue'
import { getActionUpdateBoard } from '../store/board.store'
import DynamicModal from '../cmps/DynamicModal.vue'
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: {},
      board: {},
      userIsEditing: false,
      loggedInUser: {
        imgUrl: null,
        fullname: 'Yohai Korem',
      },
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
    closeTaskDetails() {
      this.$router.push(`/board/${this.board._id}`)
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
    AddChecklist,
    MembersList,
    MemberPreview,
    ChecklistList,
    DatePicker,
    DynamicModal,
  },
}
</script>
