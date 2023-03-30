<template>
  <div v-if="task" class="comments-container">
    <ul class="clean-list">
      <li v-for="comment in task?.comments" :key="comment.id">
        <span>{{ comment.byMember.fullname }}:</span>{{ comment.txt }}
      </li>
    </ul>
    <hr />
    <form @submit.prevent="sendComment">
      <input type="text" v-model="comment.txt" placeholder="Your comment" />
      <button>Send</button>
    </form>
  </div>
  <button @click="test">test</button>
</template>

<script>
import {
  socketService,
  SOCKET_EMIT_SEND_MSG,
  SOCKET_EVENT_ADD_MSG,
  SOCKET_EMIT_SET_TOPIC,
} from '../services/socket.service'
import { boardService } from '../services/board.service'
import { eventBus } from '../services/event-bus.service'
export default {
  name: 'Chat',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      comment: boardService.getEmptyComment(),
      comments: [],
    }
  },
  async created() {
    if (this.task.comments) this.comments = this.task.comments
    socketService.emit(SOCKET_EMIT_SET_TOPIC, this.taskId)
    socketService.on(SOCKET_EVENT_ADD_MSG, this.addCommentToTask)
  },

  unmounted() {
    socketService.off(SOCKET_EVENT_ADD_MSG, this.addCommentToTask)
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
  },
  methods: {
    test() {
      console.log(this.task.comments)
    },
    async addCommentToTask(comment) {
      this.comments.push(comment)
      let updatedTask = { ...this.task }
      updatedTask.comments = updatedTask.comments.concat(comment)
      eventBus.emit('updateTask', updatedTask)
    },

    async sendComment() {
      let comment = { ...this.comment }
      const user = this.loggedinUser
      const byMember = user || 'Guest'
      comment.byMember = byMember
      socketService.emit(SOCKET_EMIT_SEND_MSG, comment)
      this.comment = boardService.getEmptyComment()
    },
    changeTopic() {
      socketService.emit(SOCKET_EMIT_SET_TOPIC, this.taskId)
    },
  },
}
</script>
