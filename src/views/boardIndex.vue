<template>
  <div class="index-container container home">
    <BoardList @removeBoard="removeBoard" @starBoard="starBoard" @setCreateMode="setCreateMode" />
    <form @submit.prevent="addBoard()" class="board-add-form" v-if="isCreateMode">
      <div class="add-form-header">
        <h5>Create Board</h5>
        <p @click="setCreateMode">x</p>
      </div>
      <ColorPicker @setColor="setBoardBgColor" />
      <label for="board-title">Board title</label>
      <input name="board-title" type="text" v-model="boardToAdd.title" />
      <button>Create</button>
    </form>
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg, getActionStarBoard } from '../store/board.store'

import BoardList from '../cmps/BoardList.vue'
import ColorPicker from '../cmps/ColorPicker.vue'
import ActionModal from '../cmps/ColorPicker.vue'

export default {
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      isCreateMode: false,
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
        this.isCreateMode = false,
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

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove board')
      }
    },
    async starBoard(board) {
      try {
        const newBoard = { ...board }
        newBoard.isStarred = !newBoard.isStarred
        await this.$store.dispatch(getActionStarBoard(newBoard))

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot star board')
      }
    },
    async updateBoard(board) {
      try {
        board = { ...board }
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg('Board updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update board')
      }
    },
    setBoardBgColor(color) {
      this.boardToAdd.style.backgroundColor = color
    },
    setCreateMode() {
      this.isCreateMode = !this.isCreateMode
    }
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
    ColorPicker,
    ActionModal,
  },


}
</script>
