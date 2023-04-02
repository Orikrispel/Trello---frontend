<template>
  <div class="chat-container">
    <form @submit.prevent="sendComment" class="comment-input-container">
      <input @blur="handleBlur" @focus="isUserCommenting = true" class="comment-input" type="text" v-model="comment.txt"
        placeholder="Write a comment..." />
      <div :class="
        isUserCommenting
          ? 'comment-editor-wrapper open'
          : 'comment-editor-wrapper'
      ">
        <div v-if="isUserCommenting" class="comment-editor-container">
          <div :class="isUserCommenting ? 'btn-wrapper no-clicks' : 'btn-wrapper'">
            <button @click.stop :class="comment.txt ? 'btn btn-blue' : 'btn btn-light disabled'">
              Save
            </button>
          </div>
        </div>
      </div>
    </form>
    <div v-if="task" class="comments-container">
      <CommentList :comments="task.comments" />
    </div>
  </div>
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
import CommentList from '../cmps/comments/CommentList.vue'
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
      comment: null,
      comments: [],
      isUserCommenting: false,
    }
  },
  async created() {
    const comment = boardService.getEmptyComment()
    this.comment = { ...comment }
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
    handleBlur() {
      setTimeout(() => {
        this.isUserCommenting = false
      }, 500)
    },
    async addCommentToTask(comment) {
      let activity = this.$store.getters.emptyActivity
      activity = { ...activity }
      let user = this.$store.getters.loggedinUser
      activity.txt = `${comment.txt}`
      activity.task = { title: this.task.title, taskId: this.taskId }
      activity.type = 'comment'
      activity.byMember = {
        fullname: user?.fullname || 'Ori Teicher',
        _id: user?._id || 'u12345',
      }
      this.comments.push(comment)
      let updatedTask = { ...this.task }
      if (!updatedTask.comments) updatedTask.comments = []
      updatedTask.comments = updatedTask.comments.concat(comment)
      const data = { task: updatedTask, activity }
      eventBus.emit('updateTask', data)
      // const activity = {
      //   id: this.$store.getters.makeId,
      //   txt: 'commented',
      //   createdAt: Date.now(),
      //   byMember: this.loggedinUser,
      //   task: updatedTask.id,
      // }
    },

    async sendComment() {
      let comment = { ...this.comment }
      const user = this.loggedinUser
      const byMember = user || 'Guest'
      comment.byMember = byMember
      socketService.emit(SOCKET_EMIT_SEND_MSG, comment)
      this.comment = boardService.getEmptyComment()
    },
  },
  components: {
    CommentList,
  },
}
</script>
