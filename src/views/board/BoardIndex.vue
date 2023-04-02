<template>
  <div class="index-container container home">
    <Loader :isLoading="isLoading" />
    <BoardList v-show="!isLoading" @removeBoard="removeBoard" @starBoard="starBoard" @addBoard="addBoard" />
  </div>
</template>

<script>
// import { boardService } from '../../services/board.service'
import { boardService } from '../../services/board.service'
import {
  getActionRemoveBoard,
  getActionUpdateBoard,
  getActionAddBoardMsg,
  getActionStarBoard,
} from '../../store/board.store'

import Loader from '../../cmps/Loader.vue'
import ChecklistList from '../../cmps/checklist/ChecklistList.vue'
import BoardList from '../../cmps/board/BoardList.vue'
import ColorPicker from '../../cmps/ColorPicker.vue'
import ImgPicker from '../../cmps/ImgPicker.vue'
import AddBoard from '../../cmps/AddBoard.vue'

export default {
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      boardPickedColor: 'white',
      boardPickedImg: '',
      actionType: 'BoardList',
      isLoading: false,
    }
  },
  computed: {
    loggedinUser() {
      return this.$store.getters.loggedinUser
    },
  },
  created() {
    this.isLoading = true
    this.$store.dispatch({ type: 'loadBoards' }).finally(() => {
      this.isLoading = false
    })
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
    async removeBoard(boardId) {
      try {
        await this.$store.dispatch(getActionRemoveBoard(boardId))
      } catch (err) {
        console.log(err)
      }
    },
    async starBoard(board) {
      try {
        const newBoard = JSON.parse(JSON.stringify(board))
        console.log('newBoard', newBoard)
        await this.$store.dispatch(getActionStarBoard(newBoard))
      } catch (err) {
        console.log(err)
      }
    },
    async updateBoard(board) {
      try {
        board = { ...board }
        await this.$store.dispatch(getActionUpdateBoard(board))
      } catch (err) {
        console.log(err)
      }
    },

    setBoardImg(imgUrls) {
      this.boardToAdd.style.imgUrl = imgUrls
    },
    setAction(actionType) {
      this.action.type = actionType
    },
  },
  components: {
    BoardList,
    ColorPicker,
    ImgPicker,
    AddBoard,
    ChecklistList,
    Loader,
  },
}
</script>
