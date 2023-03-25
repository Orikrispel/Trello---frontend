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
      let members = { ...this.board.members }
      let assignedMember = members.find((member) => {
        return member._id === memberId
      })
      assignedMember.isSelected = true
      console.log(assignedMember)
    },
  },
  components: {
    MemberPreview,
  },
}
</script>
