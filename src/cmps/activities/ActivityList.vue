<!-- know if its in board or task based on route params -->

<template>
  <ul v-if="activities" class="clean-list activity-list">
    <li
      v-for="activity in activities"
      :key="activity?.id"
      class="activity-container">
      <p v-if="activity" class="activity-txt">
        <span class="activity-by">{{ activity?.byMember?.fullname }}</span>
        <RouterLink
          :to="`/board/${this.boardId}/task/${activity.task?.taskId}`">
          {{ activity.txt }}
        </RouterLink>
        <!-- <p v-else>{{ activity.txt }}</p> -->

        <span class="activity-timestamp">{{ dateForDisplay(activity) }}</span>
      </p>
    </li>
  </ul>
</template>

<script>
import { boardService } from '../../services/board.service'

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
  async created() {},
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
    // linkCommon(activity) {
    //   if (!activity.txt || !activity.task) return
    //   let { txt, task } = activity
    //   let { title } = task
    //   let common = []
    //   for (let i = 0; i < Math.min(txt.length, title.length); i++) {
    //     if (txt[i] === title[i]) {
    //       common.push(txt[i])
    //     } else {
    //       break
    //     }
    //   }
    //   if (common.length) {
    //     let res =
    //       txt.slice(0, common.length) +
    //       '<a href="#" class="activity-link">' +
    //       common +
    //       '</a>' +
    //       txt.slice(common.length)
    //     console.log('res', res)
    //     return res
    //   } else {
    //     return txt
    //   }
    // },
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
  // async addActivityToTask(activity) {
  //   this.activities.push(activity)
  //   let updatedTask = { ...this.task }
  //   if (!updatedTask.activities) updatedTask.activities = []
  //   updatedTask.activities = updatedTask.activities.concat(activity)
  //   eventBus.emit('updateTask', updatedTask)
  // },
}
</script>
