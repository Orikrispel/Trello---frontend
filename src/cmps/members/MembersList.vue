<template>
  <div class="members-list-container">
    <input
      v-model="filterBy"
      type="text"
      placeholder="Search members"
      @input="searchMembers"
      name="members-search" />
    <div class="members-container">
      <h5>Board members</h5>
      <ul class="clean-list">
        <li
          @click="addMemberToTask(member._id)"
          v-for="member in members"
          :key="member._id">
          <MemberPreview :member="member" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { userService } from '../../services/user.service'
import { eventBus } from '../../services/event-bus.service'
import MemberPreview from './MemberPreview.vue'
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

    if (!members || !members.length)
      members = this.$store.getters.defaultMembers
    this.members = members
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
      let task = JSON.parse(JSON.stringify(this.task))
      let board = JSON.parse(JSON.stringify(this.board))
      console.log(task.members)
      let { members } = board
      let member = members.find((member) => {
        return member._id === memberId
      })
      if (!task.members) task.members = []
      let hasMember = task.members.some((member) => {
        return member._id === memberId
      })
      if (hasMember) task = this.removeMemberFromTask(task, member)
      else {
        member.isSelected = true
        task.members.push({ ...member })
      }

      eventBus.emit('updateTask', task)
      this.task = task
    },
    removeMemberFromTask(task, member) {
      const memberToRemoveIdx = task.members.findIndex(
        (m) => m._id === member._id
      )
      task.members.splice(memberToRemoveIdx, 1)
      return task
    },
  },
  components: {
    MemberPreview,
  },
}
</script>
