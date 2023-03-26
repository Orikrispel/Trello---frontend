<template>
  <div class="index-container container home">
    <BoardList @removeBoard="removeBoard" @starBoard="starBoard" @setCreateMode="setCreateMode" />
    <AddBoard @addBoard="addBoard" />
    <!-- <ChecklistList :checklists="checklists" /> -->
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardService } from '../../services/board.service.local'
import {
  getActionRemoveBoard,
  getActionUpdateBoard,
  getActionAddBoardMsg,
  getActionStarBoard,
} from '../../store/board.store'

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
      checklists: [{
        "id": "YEhmF",
        "title": "Checklist",
        "todos": [
          {
            "id": "212jX",
            "title": "To Do 1",
            "isDone": false
          }
        ]
      },
      {
        "id": "YEhmF",
        "title": "Checklist",
        "todos": [
          {
            "id": "212jaX",
            "title": "To Do 1",
            "isDone": false
          }
        ]
      },
      ]
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
        const newBoard = JSON.parse(JSON.stringify(board))
        console.log('newBoard', newBoard)
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
    setCreateMode() {
      this.isCreateMode = !this.isCreateMode
      console.log('isCreateMode', this.isCreateMode)
    },
    setBoardImg(imgUrls) {
      this.boardToAdd.style.imgUrl = imgUrls
    },
    setAction(actionType) {
      this.action.type = actionType
    }
  },
  components: {
    BoardList,
    ColorPicker,
    ImgPicker,
    AddBoard,
    ChecklistList,
  },
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
</script>
