<template>
  <div class="board-lists-container">
    <section class="star-boards">
      <div class="boards-header" v-if="starredBoards.length">
        <span class="icon fs24 star"></span>
        <h3>Starred boards</h3>
      </div>
      <ul class="board-list">
        <li v-for="board in starredBoards" :key="board._id" @click="showBoardDetails(board._id)" :style="{
          'background-color': board.style?.backgroundColor || '#014a75',
          backgroundImage: getBoardBg(board) || 'none',
          backgroundSize: 'cover',
        }">
          <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
        </li>
      </ul>
    </section>
    <section class="user-boards">
      <div class="boards-header">
        <span class="icon" v-html="getSvg('addMember')"></span>
        <h3>Your boards</h3>
      </div>
      <ul class="board-list">

        <li v-for="board in boards" :key="board._id" @click="showBoardDetails(board._id)" :style="{
          'background-color': board.style?.backgroundColor || '#014a75',
          backgroundImage: getBoardBg(board) || 'none',
          backgroundSize: 'cover',
        }">
          <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
        </li>
        <li class="new-board" @click="isCreateMode = true">
          <p>Create new board</p>
          <AddBoard v-show="isCreateMode" @addBoard="addBoard" @closeModal="isCreateMode = false" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import { svgService } from '../../services/svg.service'
import BoardPreview from '../board/BoardPreview.vue'
import AddBoard from '../AddBoard.vue'
export default {
  name: 'BoardList',
  data() {
    return {
      isCreateMode: false,
    }
  },
  created() { },
  computed: {
    loggedInUser() { },
    starredBoards() {
      const boards = this.$store.getters.boards
      return boards.filter((board) => board.isStarred)
    },
    boards() {
      return this.$store.getters.boards
    },
    getCreateMode() {
      return this.isCreateMode
    }
  },
  methods: {
    removeBoard(boardId) {
      this.$emit('removeBoard', boardId)
    },
    starBoard(board) {
      this.$emit('starBoard', board)
    },
    closeModal() {
      this.isCreateMode = false
      console.log('this.isCreateMode', this.isCreateMode)
      // this.isCreateMode = true
      // eventBus.emit('closeModal', true)
    },
    showBoardDetails(boardId) {
      this.$router.push(`/board/${boardId}`)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    getBoardBg(board) {
      if (!board.style?.imgUrls) return null
      else return `url(${board.style?.imgUrls.thumb})`
    },
    addBoard(board) {
      this.$emit('addBoard', board)
    }
  },

  components: {
    BoardPreview,
    AddBoard,
  },
}
</script>
