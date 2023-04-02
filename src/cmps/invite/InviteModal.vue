<template>
  <section v-if="isShow" class="invite-modal">
    <header class="modal-header">
      <h2>Share board</h2>
      <button class="btn btn-blue" @click="debug">debug</button>
      <button class="btn btn-close">X</button>
    </header>
    <div class="search-share">
      <input v-model="filterBy" type="text" placeholder="Email address or name" @input="searchMembers" ref="searchMember"
        name="members-search" />
      <button class="btn btn-blue">Share</button>
    </div>
    <div v-if="users" class="members-list-container">
      <ul class="clean-list">
        <li @click="addUserToBoard(user._id)" v-for="user in users" :key="user._id"
          :class="isUserAdmin(user._id) ? 'admin-member-preview' : ''">
          <MemberPreview :member="user" />
          <span v-if="isUserMember(user._id) && !isUserAdmin(user._id)">
            Member</span>
          <span v-if="isUserAdmin(user._id)">Admin</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import MemberPreview from '../members/MemberPreview.vue'
import { socketService } from '../../services/socket.service'
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'InviteModal',
  data() {
    return {
      board: null,
      users: null,
      filterBy: '',
      isShow: false,
    }
  },
  async created() {
    await this.$store.dispatch({ type: 'loadBoards' })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    this.users = await this.$store.dispatch({ type: 'loadUsers' })
  },
  mounted() {
    setTimeout(() => {
      this.$refs.searchMember.focus()
    }, 100)
  },
  methods: {
    isUserAdmin(userId) {
      return this.board.createdBy._id === userId
    },
    isUserMember(userId) {
      return this.boardMembers.find((member) => member._id === userId)
    },
    async debug() {
      let users = await this.$store.dispatch({ type: 'loadUsers' })
      console.log(this.users)
    },
    async searchMembers() {
      let users
      if (this.filterBy) {
        const regex = new RegExp(this.filterBy, 'i')
        users = this.users.filter((user) => regex.test(user.fullname))
      } else {
        users = await this.$store.dispatch({ type: 'loadUsers' })
      }
      this.users = users
    },
    async addUserToBoard(userId) {
      let board = JSON.parse(JSON.stringify(this.board))
      let user = await this.$store.dispatch({ type: 'getUser', userId })
      if (!user.boards) user.boards = []
      user.boards.push(this.boardId)
      user = { _id: userId, fullname: user.fullname, imgUrl: user.imgUrl }
      board.members.push(user)

      let activity = this.$store.getters.emptyActivity
      activity = { ...activity }
      let loggedinUser = this.$store.getters.loggedinUser
      activity.txt = ` added ${user.fullname} to ${board.title} workspace`
      activity.board = { title: board.title, boardId: this.boardId }
      activity.type = 'boardMember'
      activity.byMember = {
        fullname: loggedinUser.fullname,
        _id: loggedinUser._id,
      }
      if (!board.activities) board.activities = []
      board.activities.push(activity)
      this.$emit('updateBoard', board)
      this.board = board
      console.log(this.board)
    },
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
    boardMembers() {
      const { members } = this.board
      return members
    },
  },
  components: {
    MemberPreview,
  },
}
</script>
