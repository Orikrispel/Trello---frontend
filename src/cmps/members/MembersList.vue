<template>
  <div class="members-list-container">
    <div class="members-list-heading">
      <h4>Members</h4>
      <button class="btn btn-close">X</button>
    </div>
    <input
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
      console.log(this.members)
    },
    async addMemberToTask(memberId) {
      //   let user = await userService.getById(memberId)
      let task = JSON.parse(JSON.stringify(this.task))
      let board = JSON.parse(JSON.stringify(this.board))
      let { members } = board
      let member = members.find((member) => {
        return member._id === memberId
      })
      member.isSelected = true
      if (!task.members) task.members = []
      let hasMember = task.members.some((m) => m.id === member.id)
      if (hasMember) task = this.removeMemberFromTask(task, member)
      else task.members.push({ ...member })
      eventBus.emit('updateTask', task)
      this.task = task
    },
    removeMemberFromTask(task, member) {
      const memberToRemoveIdx = task.members.findIndex(
        (m) => m.id === member.id
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
