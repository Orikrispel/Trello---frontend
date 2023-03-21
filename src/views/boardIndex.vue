<template>
  <div class="index-container container home">
    <BoardList @removeBoard="removeBoard" @starBoard="starBoard" />
    <form @submit.prevent="addBoard()">
      <h2>Add board</h2>
      <input type="text" v-model="boardToAdd.title" placeholder="enter title...." />
      <button>Save</button>
    </form>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg } from '../store/board.store'
import BoardList from '../cmps/BoardList.vue'
export default {
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard()
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },

  },
  created() {
    this.$store.dispatch({ type: 'loadBoards' })
  },
  methods: {
    async addBoard() {
      try {
        await this.$store.dispatch({ type: 'addBoard', board: this.boardToAdd })
        showSuccessMsg('Board added')
        this.boardToAdd = boardService.getEmptyBoard()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add board')
      }
    },
    async removeBoard(boardId) {
      try {
        await this.$store.dispatch(getActionRemoveBoard(boardId))
        showSuccessMsg('Board removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove board')
      }
    },
    async starBoard(boardId) {
      try {
        console.log('starred index', boardId)
        // await this.$store.dispatch(getActionStarBoard(boardId))
        // showSuccessMsg('Board removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove board')
      }
    }
    // async updateBoard(board) {
    //   try {
    //     board = { ...board }
    //     board.price = +prompt('New price?', board.price)
    //     await this.$store.dispatch(getActionUpdateBoard(board))
    //     showSuccessMsg('Board updated')

    //   } catch (err) {
    //     console.log(err)
    //     showErrorMsg('Cannot update board')
    //   }
    // },
    // async addBoardMsg(boardId) {
    //   try {
    //     await this.$store.dispatch(getActionAddBoardMsg(boardId))
    //     showSuccessMsg('Board msg added')
    //   } catch (err) {
    //     console.log(err)
    //     showErrorMsg('Cannot add board msg')
    //   }
    // },
    // printBoardToConsole(board) {
    //   console.log('Board msgs:', board.msgs)
    // }
  },
  components: {
    BoardList,
  }


}
</script>
