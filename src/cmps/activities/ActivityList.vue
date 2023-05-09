<!-- know if its in board or task based on route params -->

<template>
  <ul v-if="activities" class="clean-list activity-list">
    <li
      v-for="activity in activities"
      :key="activity?.id"
      class="activity-container">
      <p v-if="activity && activity.type !== 'comment'" class="activity-txt">
        <span class="activity-by">{{ activity?.byMember?.fullname }}</span>
        <RouterLink
          :to="`/board/${this.boardId}/task/${activity.task?.taskId}`">
          {{ activity.txt }}
        </RouterLink>
        <span class="activity-timestamp">{{ dateForDisplay(activity) }}</span>
      </p>
      <RouterLink
        v-else-if="activity && activity.type === 'comment'"
        :to="`/board/${this.boardId}/task/${activity.task?.taskId}`">
        <div class="comments-container">
          <CommentPreview :comment="activity" />
        </div>
      </RouterLink>
      <!-- <p v-else>{{ activity.txt }}</p> -->
    </li>
  </ul>
</template>

<script>
import { boardService } from '../../services/board.service'
import CommentPreview from '../comments/CommentPreview.vue'

export default {
  name: 'ActivityList',
  props: {
    activities: {
      type: Array,
      required: true,
    },
  },
  // data() {
  //   return {
  //     activity: boardService.getEmptyActivity(),
  //   }
  // },
  async created() {
    console.log(this.activities[0])
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
  methods: {
    dateForDisplay(activity) {
      const timestamp = activity.createdAt
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
  components: { CommentPreview },
}
</script>
