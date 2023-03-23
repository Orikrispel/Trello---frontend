<template>
  <div class="board-lists-container">
    <div class="boards-header" v-if="starredBoards.length">
      <h3 v-html="getSvg('star')"></h3>
      <h3>Starred Boards</h3>
    </div>
    <ul class="board-list">
      <li v-for="board in starredBoards" :key="board._id" @click="showBoardDetails(board._id)" :style="{
        'background-color': board.style?.backgroundColor || '#014a75',
      }">
        <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
      </li>
    </ul>
    <div class="boards-header">
      <h3 v-html="getSvg('addMember')"></h3>
      <h3>Your boards</h3>
    </div>
    <ul class="board-list">
      <li class="new-board" @click="setCreateMode">
        <p>Create new board</p>
      </li>
      <li v-for="board in boards" :key="board._id" @click="showBoardDetails(board._id)" :style="{
        'background-color': board.style?.backgroundColor || '#014a75',
        'backgroundImage': board.style?.imgUrls || 'none'
      }">
        <pre>{{ board.style.imgUrls }}</pre>
        <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
      </li>
    </ul>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import { svgService } from '../../services/svg.service'
import BoardPreview from '../board/BoardPreview.vue'
export default {
  name: 'BoardList',
  data() {
    return {}
  },
  created() {
  },
  computed: {
    loggedInUser() { },
    starredBoards() {
      const boards = this.$store.getters.boards
      return boards.filter((board) => board.isStarred)
    },
    boards() {
      return this.$store.getters.boards
    },
  },
  methods: {
    removeBoard(boardId) {
      this.$emit('removeBoard', boardId)
    },
    starBoard(board) {
      this.$emit('starBoard', board)
    },
    setCreateMode() {
      eventBus.emit('setCreateMode', true)
    },
    showBoardDetails(boardId) {
      this.$router.push(`/board/${boardId}`)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },

  components: {
    BoardPreview,
  },
}

</script>
