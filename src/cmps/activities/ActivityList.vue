<!-- know if its in board or task based on route params -->

<template>
  <ul class="clean-list">
    <li v-for="activity in activities" :key="activity.id">
      {{ activity.txt }}
    </li>
  </ul>
</template>

<script>
import { boardService } from '../../services/board.service'
import { socketService } from '../../services/socket.service'
export default {
  name: 'ActivityList',
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      activity: boardService.getEmptyActivity(),
    }
  },
  async created() {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, this.taskId)
    socketService.on(SOCKET_EVENT_UPDATE_TASK, this.addActivityToTask)
  },
  computed: {
    loggedinUser() {
      let user = { ...this.$store.getters.loggedinUser }
      return user
    },
    taskId() {
      let { taskId } = this.$route.params
      return taskId
    },
    boardId() {
      let { boardId } = this.$route.params
      return boardId
    },
  },

  async addActivityToTask(activity) {
    this.activities.push(activity)
    let updatedTask = { ...this.task }
    if (!updatedTask.activities) updatedTask.activities = []
    updatedTask.activities = updatedTask.activities.concat(activity)
    eventBus.emit('updateTask', updatedTask)
  },
}
</script>
