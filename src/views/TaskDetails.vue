<template>
  <div class="modal-overlay flex" @click="closeTaskDetails">
    <section class="task-details" @click.stop>
      <header
        v-if="task.cover?.color"
        class="task-cover"
        :style="{ backgroundColor: task.cover?.color }">
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
          <p v-if="group" class="group-related">
            in list <span>{{ group.title }}</span>
          </p>
        </div>

        <div class="task-main-container">
          <main class="task-main">
            <div class="flex task-detail-data">
              <div
                v-show="task.members?.length"
                class="member-container container">
                <h3 class="fs12 inner-title">Members</h3>
                <ul class="task-heading-member-list flex clean-list">
                  <li
                    v-for="member in task.members"
                    :key="member._id"
                    class="member">
                    <div class="member-img">
                      {{
                        member.imgUrl
                          ? member.imgUrl
                          : member.fullname.charAt(0).toUpperCase()
                      }}
                    </div>
                  </li>
                  <VDropdown :distance="6" :placement="'right-start'">
                    <button class="btn-task light btn-add-member flex">
                      <span class="icon icon-add"></span>
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
                </ul>
              </div>

              <div
                v-show="task.labels?.length"
                class="label-container container">
                <h3 class="fs12 inner-title">Labels</h3>
                <ul class="task-heading-label-list flex clean-list">
                  <li
                    class="label"
                    v-for="label in task.labels"
                    :key="label.id">
                    <LabelPreview :label="label" />
                  </li>
                </ul>
              </div>

              <div class="date-container container" v-if="task.date">
                <h3 class="fs12 inner-title">Due date</h3>
                <DatePreview :date="task.date" />
              </div>
            </div>

            <AttachmentList :task="task" @onUpdateTask="onUpdateTask" />
            <!-- checklist list -->
            <ChecklistList :task="task" />

            <!-- description -->
            <form
              class="description-editor editor"
              @submit.prevent="handleDesc">
              <span class="icon description-icon icon-lg"></span>
              <h3 class="fs16">Description</h3>
              <button
                class="btn-task light"
                id="edit-desc-btn"
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
                ref="taskDesc"
                v-model="task.description"
                @blur="userIsEditing = false"
                autofocus></textarea>
              <button
                class="btn-task blue"
                v-if="userIsEditing"
                @click="saveTask(task)">
                Save
              </button>
              <button class="btn-task light" v-if="userIsEditing">
                Cancel
              </button>
            </form>

            <div class="comments-activity-container editor">
              <div class="editor-header">
                <span class="icon activity-icon icon-lg"></span>
                <h3 class="activity-title">Activity</h3>
              </div>
              <!-- <form class="comment-form" @submit.prevent="handleComment"> -->
              <div class="comment-box-input">
                <div class="member-img icon icon-lg">
                  <!-- {{
                    loggedinUser.imgUrl
                    ? loggedinUser.imgUrl
                    : loggedinUser.fullname.charAt(0).toUpperCase()
                  }} -->
                </div>
                <Chat :task="task" />
              </div>
              <!-- </form> -->
              <!-- <ul
                v-if="task.comments && task.comments.length"
                class="clean-list">
                <li v-for="(comment, idx) in task.comments" :key="idx">
                  {{ comment }}
                </li>
              </ul> -->
              <!-- <ul
                v-if="task.activities && task.activities.length"
                class="clean-list">
                <li v-for="(activity, idx) in task.activities" :key="idx">
                  {{ activity }}
                </li>
              </ul> -->
              <div
                v-if="activities && activities.length"
                class="activities-container">
                <ActivityList :activities="task.activities" />
              </div>
            </div>
          </main>

          <aside class="btns-container side-bar flex">
            <h3>Add to card</h3>

            <VDropdown :distance="6">
              <button class="btn-task light">
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

            <VDropdown :distance="6" :placement="'left-start'">
              <button class="btn-task light">
                <span class="icon icon-small label-icon"></span>Labels
              </button>

              <template #popper>
                <DynamicModal>
                  <template v-slot:title>{{
                    userIsEditing ? 'Create a label' : 'Labels'
                  }}</template>

                  <template v-slot scope="props">
                    <LabelMenu :taskLabels="task.labels" />
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>

            <VDropdown :distance="6">
              <button class="btn-task light">
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
            <VDropdown :distance="6" :placement="'left'">
              <button class="btn-task light">
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

            <VDropdown :distance="6" :placement="'left-start'">
              <button class="btn-task light">
                <span class="icon icon-small attachments-icon"></span>Attachment
              </button>

              <template #popper>
                <AddAttachment :task="task" @onUpdateTask="onUpdateTask" />
              </template>
            </VDropdown>

            <VDropdown :distance="6" :placement="'left-start'">
              <button class="btn-task light">
                <span class="icon icon-small card-cover-icon"></span>Cover
              </button>
              <template #popper>
                <AddCover
                  :task="task"
                  @onUpdateTask="onUpdateTask"
                  @setCover="setCover"
                  @removeCover="removeCover" />
              </template>
            </VDropdown>
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
import { mapGetters } from 'vuex'
import { svgService } from '../services/svg.service'
import DatePicker from '../cmps/dates/DatePicker.vue'
import MembersList from '../cmps/members/MembersList.vue'
import MemberPreview from '../cmps/members/MemberPreview.vue'
import LabelMenu from '../cmps/label/LabelMenu.vue'
import LabelPreview from '../cmps/label/LabelPreview.vue'
import AddChecklist from '../cmps/AddChecklist.vue'
import ChecklistList from '../cmps/checklist/ChecklistList.vue'
import AddAttachment from '../cmps/attachment/AddAttachment.vue'
import AttachmentList from '../cmps/attachment/AttachmentList.vue'
import Chat from '../views/Chat.vue'
import ActivityList from '../cmps/activities/ActivityList.vue'
import AddCover from '../cmps/cover/AddCover.vue'
import { getActionUpdateBoard } from '../store/board.store'
import DatePreview from '../cmps/dates/DatePreview.vue'
import DynamicModal from '../cmps/DynamicModal.vue'
export default {
  name: 'TaskDetails',
  data() {
    return {
      task: this.$store.getters.emptyTask,
      board: {},
      group: {},
      userIsEditing: false,
      loggedinUser: this.$store.getters.loggedinUser,
    }
  },
  async created() {
    eventBus.on('updateTask', ({ task, activity }) => {
      this.saveTask(task, activity)
    })
    eventBus.on('updateBoard', (board) => {
      this.updateBoard(board)
    })
    eventBus.on('removeLabel', (labelId) => {
      this.removeLabel(labelId)
    })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    const { taskId } = this.$route.params
    let task = await this.$store.dispatch({ type: 'loadCurrTask', taskId })
    if (!task) task = this.$store.getters.emptyTask
    this.task = { ...task }
    let groups = this.board.groups
    for (const group of groups) {
      let { tasks } = group
      let currTask = tasks.find((t) => t.id === this.task.id)
      if (currTask) {
        this.group = group
        break
      }
    }
  },
  methods: {
    updateTitle(ev) {
      this.task.title = ev.target.innerText

      this.saveTask(this.task)
    },
    handleDesc() {
      this.userIsEditing = !this.userIsEditing
      this.$refs.taskDesc.focus()
    },
    saveTask(task, activity) {
      let board = JSON.parse(JSON.stringify(this.board))
      let updatedTask = JSON.parse(JSON.stringify(task))
      if (!updatedTask.activities) updatedTask.activities = []
      updatedTask.activities.unshift(activity)

      let group = board.groups.find((group) => {
        return group.tasks.some((t) => t.id === updatedTask.id)
      })

      const taskIdx = group?.tasks.findIndex((t) => t.id === updatedTask.id)
      const groupIdx = board.groups.indexOf(group)
      board.groups[groupIdx].tasks.splice(taskIdx, 1, updatedTask)
      if (!board.activities) board.activities = []
      board.activities.unshift(activity)
      this.task = updatedTask
      this.updateBoard(board, 'Task updated', 'Failed to updated task')
    },
    closeTaskDetails() {
      this.$router.push(`/board/${this.board._id}`)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    async updateBoard(
      board,
      successMsg = 'board saved',
      errMsg = "couldn't save board"
    ) {
      try {
        this.board = board
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg(successMsg)
      } catch (err) {
        console.log(err)
        showErrorMsg(errMsg)
      }
    },
    removeLabel(labelId) {
      let board = JSON.parse(JSON.stringify(this.board))

      const labelIdx = this.task.labels.findIndex((l) => l.id === labelId)
      console.log('labelIdx:', labelIdx)
      this.task.labels.splice(labelIdx, 1)

      const labelIdxFromBoard = board.labels.findIndex((l) => l.id === labelId)
      board.labels.splice(labelIdxFromBoard, 1)
      this.board = board

      this.saveTask(this.task)
    },
    onUpdateTask(newTask) {
      console.log('newTask.files', newTask.files)
      eventBus.emit('updateTask', newTask)
    },
    setCover(type, color) {
      const newTask = JSON.parse(JSON.stringify(this.task))
      newTask.cover = { type, color }
      eventBus.emit('updateTask', newTask)
      console.log('newTask.cover', newTask.cover)
    },
    removeCover() {
      const newTask = JSON.parse(JSON.stringify(this.task))
      newTask.cover = {}
      eventBus.emit('updateTask', newTask)
      console.log('newTask.cover', newTask.cover)
      console.log('this.task', this.task)
    },
  },
  computed: {
    ...mapGetters(['currBoard']),
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
    coverBg() {
      return this.task.cover.color
    },
  },
  unmounted() {
    this.saveTask(this.task)
  },
  watch: {
    currBoard: {
      handler(newBoard, oldBoard) {
        this.board = newBoard
      },
      immediate: true,
    },
  },
  emits: ['setCover', 'removeCover'],
  components: {
    LabelMenu,
    LabelPreview,
    AddChecklist,
    MembersList,
    MemberPreview,
    ChecklistList,
    DatePicker,
    DynamicModal,
    DatePreview,
    AddAttachment,
    AttachmentList,
    Chat,
    AddCover,
    ActivityList,
  },
}
</script>
