<template>
  <div class="modal-overlay flex" @click="closeModal">
    <section class="invite-modal" @click.stop>
      <header class="modal-header flex align-center justify-between">
        <h2>Share board</h2>
        <!-- <button class="btn btn-blue" @click="debug">debug</button> -->
        <button class="clean-btn btn-close" @click="closeModal">
          <span class="icon icon-close"></span>
        </button>
      </header>
      <div class="search-share-container flex">
        <input v-model="filterBy" type="text" placeholder="Email address or name" @input="searchMembers"
          ref="searchMember" name="members-search" />
        <button class="btn btn-blue">Share</button>
      </div>
      <div v-if="users" class="members-list-wrapper">
        <ul class="clean-list flex column">
          <li @click="addUserToBoard(user._id)" v-for="user in users" :key="user._id"
            :class="isUserAdmin(user._id) ? 'admin-member-preview' : ''">
            <MemberPreview :member="user" />
            <span v-if="isUserMember(user._id) && !isUserAdmin(user._id)">
              Member</span>
            <span v-if="isUserAdmin(user._id)">Admin</span>
            <span v-if="isUserMember(user._id) && !isUserAdmin(user._id)" @click="removeMemberFromBoard(user._id)"
              class="btn btn-light">Remove</span>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>

<script>
import MemberPreview from '../members/MemberPreview.vue'
import {
  socketService,
  SOCKET_EVENT_USER_INVITED,
} from '../../services/socket.service'
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'InviteModal',
  data() {
    return {
      board: null,
      users: null,
      filterBy: '',
    }
  },
  async created() {
    try {
      this.board = await this.$store.dispatch({
        type: 'loadCurrBoard',
        boardId: this.boardId,
      })
    } catch (err) {
      console.log(err, 'could not load board')
    }
    try {
      this.users = await this.$store.dispatch({ type: 'loadUsers' })
      await this.$store.dispatch({ type: 'loadBoards' })
    } catch (err) {
      console.log(err, 'could not load users')
    }
    socketService.on(SOCKET_EVENT_USER_INVITED, (data) => {
      console.log('socket works', data)
    })
  },
  // mounted() {
  //   setTimeout(() => {
  //     this.$refs.searchMember.focus()
  //   }, 100)
  // },
  methods: {
    isUserAdmin(userId) {
      if (this.board) {
        return this.board.createdBy._id === userId
      }
    },
    async removeBoardFromMember(member, boardId) {
      let idx = member.boards.findIndex((board) => board._id === boardId)
      member.boards.splice(idx, 1)
      member = await this.$store.dispatch({ type: 'updateUser', member })
      return member
    },
    async removeMemberFromBoard(userId) {
      const idx = this.board.members.findIndex(
        (member) => member._id === userId
      )
      let board = JSON.parse(JSON.stringify(this.board))
      let user = board.members[idx]
      console.log(user)
      try {
        user = await this.removeBoardFromMember(user, this.board._id)
      } catch (err) {
        console.log(err, 'cannot remove board from member')
      }

      board.members.splice(idx, 1)
      console.log(board.members)
      try {
        this.$emit('updateBoard', board)

        this.board = board
      } catch (err) {
        console.log(err, 'could not update user in invite modal')
      }

      // let activity = this.$store.getters.emptyActivity
      // activity = { ...activity }
      // let loggedinUser = this.$store.getters.loggedinUser
      // activity.txt = ` removed ${user.fullname} from ${board.title} workspace`
      // activity.board = { title: board.title, boardId: this.boardId }
      // activity.type = 'boardMember'
      // activity.byMember = {
      //   fullname: loggedinUser.fullname,
      //   _id: loggedinUser._id,
      // }
    },
    isUserMember(userId) {
      let res = this.board.members.some((member) => member._id === userId)
      return res
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
        try {
          users = await this.$store.dispatch({ type: 'loadUsers' })
        } catch (err) {
          console.log(err, 'cannot load users')
        }
      }
      this.users = users
    },
    async updateUser(userId) {
      let user
      try {
        user = await this.$store.dispatch({ type: 'getUser', userId })
      } catch (err) {
        console.log(err, 'cannot load user')
      }

      user = await this.$store.dispatch({ type: 'updateUser', user })
      return user
    },
    async addUserToBoard(userId) {
      let user
      let board = JSON.parse(JSON.stringify(this.board))

      user = await this.$store.dispatch({ type: 'getUser', userId })

      if (!user) return
      if (this.isUserMember(userId) || this.isUserAdmin(userId)) return
      if (!user.boards) user.boards = []
      user.boards.push(this.boardId)
      console.log(user.boards)
      try {
        user = await this.updateUser(userId)
      } catch (err) {
        console.log(err, 'cannot update user')
      }
      board.members.push(user)
      const data = {
        boardId: board._id,
        userId,
        type: SOCKET_EVENT_USER_INVITED,
      }
      socketService.emit(SOCKET_EVENT_USER_INVITED, data)
      // let activity = this.$store.getters.emptyActivity
      // activity = { ...activity }
      // let loggedinUser = this.$store.getters.loggedinUser
      // activity.txt = ` added ${user.fullname} to ${board.title} workspace`
      // activity.board = { title: board.title, boardId: this.boardId }
      // activity.type = 'boardMember'
      // activity.byMember = {
      //   fullname: loggedinUser.fullname,
      //   _id: loggedinUser._id,
      // }
      // if (!board.activities) board.activities = []
      // board.activities.push(activity)
      this.updateBoard(board)
    },
    updateBoard(board) {
      this.$emit('updateBoard', board)
      this.board = board
    },
    closeModal() {
      this.$emit('closeModal')
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
  // watch: {
  //   'board.members': {
  //     handler: function (newVal, oldVal) {
  //       console.log('Board changed!', 'newVal', newVal.length)
  //       console.log('oldVal', oldVal.length)
  //       // Do something with the new value
  //     },
  //     deep: true,
  //   },
  // },
  components: {
    MemberPreview,
  },
}
</script>
