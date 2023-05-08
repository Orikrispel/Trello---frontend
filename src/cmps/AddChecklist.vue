<template>
  <form @submit.prevent="addChecklist" class="add-checklist-form">
    <h4>Title</h4>
    <input type="text" ref="checklistTitle" v-model="checklistToAdd.title" />
    <button class="btn btn-blue" id="add-btn" style="color: white">Add</button>
  </form>
</template>

<script>
import {
  socketService,
  SOCKET_EVENT_TASK_UPDATED,
} from '../services/socket.service'
import { checklistService } from '../services/checklist.service'
import { eventBus } from '../services/event-bus.service'
import { utilService } from '../services/util.service'
export default {
  name: 'AddChecklist',
  props: {
    actionData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      task: null,
      checklistToAdd: checklistService.getEmptyChecklist(),
      isCreateMode: true,
    }
  },
  mounted() {
    setTimeout(() => {
      this.$refs.checklistTitle.focus()
    }, 100)
  },
  methods: {
    getActivityToAdd(task) {
      let activity = this.$store.getters.emptyActivity
      activity = { ...activity }

      let user = this.$store.getters.loggedinUser
      activity.txt = ` added ${this.checklistToAdd.title} to ${task.title}`
      activity.task = { title: this.task.title, taskId: this.taskId }
      activity.type = 'checklist'
      activity.byMember = {
        fullname: user.fullname,
        _id: user._id,
      }
      return activity
    },
    async addChecklist() {
      let user = this.$store.getters.loggedinUser

      this.checklistToAdd.id = 'cl' + utilService.makeId()
      let task = JSON.parse(JSON.stringify(this.actionData.task))
      if (!task.checklists) task.checklists = []
      task.checklists.push(this.checklistToAdd)
      let activity = await this.$store.dispatch({
        type: 'returnActivity',
        data: {
          task: { title: this.task.title, taskId: this.taskId },
          type: 'addChecklist',
          byMember: {
            fullname: user.fullname,
            _id: user._id,
          },
          checklist: this.checklistToAdd,
        },
      })
      const data = {
        task,
        activity,
      }
      this.checklistToAdd = checklistService.getEmptyChecklist()
      eventBus.emit('updateTask', data)
      // socketService.emit(SOCKET_EVENT_TASK_UPDATED, task)
      this.$emit('setCreateModeOff')
    },
    closeModal() {
      this.$emit('setCreateModeOff')
    },
  },
  created() {
    this.task = this.actionData.task
  },
  computed: {
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
  },
  components: {},
}
</script>
