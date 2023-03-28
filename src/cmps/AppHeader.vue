<template>
  <header class="app-header">
    <nav class="flex gap">
      <img class="logo" src="../assets/imgs/header/logo white.png" alt="Jello logo">
      <button class="btn board-btn" @click="this.$router.push('/board')">Boards</button>
      <!-- <button hidden class="btn" @click="isCreateMode = !isCreateMode">Create</button> -->
      <AddBoard v-show="isCreateMode" @addBoard="addBoard" @closeModal="isCreateMode = false" />

    </nav>
    <nav class="flex gap">
      <RouterLink to="/login">Login / Signup</RouterLink>
    </nav>
    <section class="loggedin-user" v-if="loggedInUser">
      <RouterLink :to="`/user/${loggedInUser._id}`">
        {{ loggedInUser.fullname }}
      </RouterLink>
      <span>{{ loggedInUser.score.toLocaleString() }}</span>
      <img :src="loggedInUser.imgUrl" />
    </section>
  </header>
</template>
<script>
import { boardService } from '../services/board.service.local'
import AddBoard from '../cmps/AddBoard.vue'
export default {
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      boardPickedColor: 'white',
      boardPickedImg: '',
      actionType: 'BoardList',
      isCreateMode: false,
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
  },
  methods: {
    async addBoard(board) {
      try {
        console.log('ADDED board', board)
        await this.$store.dispatch({ type: 'addBoard', board })
          ; showSuccessMsg('Board added')
        this.boardToAdd = boardService.getEmptyBoard()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add board')
      }
    },
  },
  components: {
    AddBoard,
  }
}
</script>