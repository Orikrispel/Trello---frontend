<template>
  <article class="group-wrapper clean-list">
    <p>{{ group.title }}</p>
    <pre class="fs12">{{ group }}</pre>
    <hr />
  </article>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg } from '../store/board.store'
export default {
  props: ["group"],
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard()
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    boards() {
      return this.$store.getters.boards
    }
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
    async updateBoard(board) {
      try {
        board = { ...board }
        board.price = +prompt('New price?', board.price)
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg('Board updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update board')
      }
    },
    async addBoardMsg(boardId) {
      try {
        await this.$store.dispatch(getActionAddBoardMsg(boardId))
        showSuccessMsg('Board msg added')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add board msg')
      }
    },
    printBoardToConsole(board) {
      console.log('Board msgs:', board.msgs)
    }
  }


}
</script>
