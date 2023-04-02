<template>
  <header class="app-header">
    <nav class="flex gap">
      <RouterLink class="flex" to="/"><img class="logo" src="../assets/logo white.png" alt="Jello logo" /></RouterLink>
      <RouterLink to="/board">Boards</RouterLink>
      <button class="btn add-board" @click="isCreateMode = !isCreateMode">
        Create
        <AddBoard v-show="isCreateMode" @addBoard="addBoard" @closeModal="isCreateMode = false" style="top: 40px" />
      </button>
    </nav>
    <button @click="showUsers">users</button>

    <nav class="flex gap">
      <section class="loggedin-user" v-if="loggedinUser">
        <RouterLink class="member-wrapper flex align-center" :to="`/login`">
          <img class="user-img" v-if="loggedinUser.imgUrl" :src="loggedinUser.imgUrl" alt="" />
          <div v-else class="member-img">
            <span>{{ loggedinUser.fullname.charAt(0).toUpperCase() }}</span>
          </div>
        </RouterLink>
      </section>
      <section class="log-in" v-else>
        <RouterLink :to="`/login`">
          <div class="login-img">
            <span v-html="getSvg('login')"></span>
          </div>
        </RouterLink>
      </section>
    </nav>
  </header>
</template>

<script>
import { boardService } from '../services/board.service'
import { svgService } from '../services/svg.service'
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
  created() { },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  methods: {
    async addBoard(board) {
      try {
        console.log('ADDED board', board)
        await this.$store.dispatch({ type: 'addBoard', board })
        this.boardToAdd = boardService.getEmptyBoard()
      } catch (err) {
        console.log(err)
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
  components: {
    AddBoard,
  },
}
</script>
