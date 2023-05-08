<template>
  <div class="members-list-container">
    <input
      v-model="filterBy"
      type="text"
      placeholder="Search members"
      @input="searchMembers"
      ref="searchMember"
      name="members-search" />
    <h4>Board members</h4>
    <ul class="clean-list">
      <li
        @click="addMemberToTask(member._id)"
        v-for="member in members"
        :key="member._id">
        <MemberPreview :member="member" />
      </li>
    </ul>
  </div>
</template>
<script>
import { userService } from '../../services/user.service'
import { eventBus } from '../../services/event-bus.service'
import MemberPreview from './MemberPreview.vue'
import { store } from '../../store/store'
export default {
  data() {
    return {
      members: [],
      board: null,
      task: null,
      filterBy: '',
    }
  },
  computed: {
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  async created() {
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    this.task = await this.$store.dispatch({
      type: 'loadCurrTask',
      taskId: this.taskId,
    })
    let { members } = this.board

    this.members = members
  },
  mounted() {
    setTimeout(() => {
      this.$refs.searchMember.focus()
    }, 100)
  },
  methods: {
    searchMembers() {
      let members
      if (this.filterBy) {
        const regex = new RegExp(this.filterBy, 'i')
        members = this.members.filter((member) => regex.test(member.fullname))
      } else {
        members = this.board.members
      }
      this.members = members
    },
    async addMemberToTask(memberId) {
      let user = this.$store.getters.loggedinUser
      let activity
      let task = JSON.parse(JSON.stringify(this.task))
      let board = JSON.parse(JSON.stringify(this.board))
      let { members } = board
      let member = members.find((member) => {
        return member._id === memberId
      })
      if (!task.members) task.members = []
      if (!member.tasks) member.tasks = []
      let taskHasMember = task.members.some((member) => {
        return member._id === memberId
      })
      if (taskHasMember) {
        const data = this.removeMemberFromTask(task, member)
        task = data.task
        member = data.member

        activity = await this.$store.dispatch({
          type: 'returnActivity',
          data: {
            task: { title: this.task.title, taskId: this.taskId },
            type: 'removeMemberFromTask',
            byMember: {
              fullname: user.fullname,
              _id: user._id,
            },
            member,
          },
        })
      } else {
        task.members.push({ ...member })
        member.tasks.push(task.id)
        activity = await this.$store.dispatch({
          type: 'returnActivity',
          data: {
            task: { title: this.task.title, taskId: this.taskId },
            type: 'addMemberToTask',
            byMember: {
              fullname: user.fullname,
              _id: user._id,
            },
            member,
          },
        })
      }

      const data = {
        task,
        activity,
      }
      eventBus.emit('updateTask', data)
      this.$store.dispatch({ type: 'updateUser', user: member })
      this.task = task
    },

    removeMemberFromTask(task, member) {
      const memberToRemoveIdx = task.members.findIndex(
        (m) => m._id === member._id
      )
      const taskToRemoveFromMemberIdx = member.tasks.findIndex((t) => {
        t.id === task.id
      })
      task.members.splice(memberToRemoveIdx, 1)
      member.tasks.splice(taskToRemoveFromMemberIdx, 1)
      const data = { task, member }
      return data
    },
  },
  components: {
    MemberPreview,
  },
}
</script>
