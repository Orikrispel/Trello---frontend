<template>
  <div class="comment-container">
    <h5>
      <span class="comment-by">{{ comment?.byMember?.fullname }} </span>
      <span class="comment-date">{{ dateForDisplay }}</span>
    </h5>

    <p
      :class="isUserEditing ? 'edit comment-txt' : 'comment-txt'"
      :contenteditable="isUserEditing"
      @blur="isUserEditing = false">
      {{ comment?.txt }}
    </p>
    <div v-if="taskId" class="btns-container-comment">
      <span class="icon icon-sm icon-add-reaction"></span>
      <a class="btn-comment btn-comment-edit" @click="isUserEditing = true"
        >Edit</a
      >
      <a
        class="btn-comment btn-comment-delete"
        @click="removeComment(comment.id)"
        >Delete</a
      >
    </div>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import { utilService } from '../../services/util.service'
export default {
  name: 'CommentPreview',
  props: {
    comment: {
      type: Object,
      required: true,
      default: null,
    },
  },
  data() {
    return {
      isUserEditing: false,
      task: null,
    }
  },
  async created() {
    this.task = await this.$store.dispatch({
      type: 'loadCurrTask',
      taskId: this.taskId,
    })
  },
  methods: {
    removeComment(commentId) {
      let task = JSON.parse(JSON.stringify(this.task))
      console.log(task)
      const idx = task.comments.findIndex((comment) => comment.id === commentId)
      task.comments.splice(idx, 1)
      eventBus.emit('updateTask', task)
      this.task = task
    },
  },
  computed: {
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
    dateForDisplay() {
      const timestamp = this.comment.createdAt
      const now = Date.now()
      const diff = now - timestamp
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      if (days > 0) {
        return `${days} days ago`
      } else if (hours > 0) {
        return `${hours} hours ago`
      } else if (minutes > 0) {
        return `${minutes} minutes ago`
      } else {
        return `${seconds} seconds ago`
      }
    },
  },
}
</script>
