<template>
  <div v-if="board" class="board-container main flex column" :style="{
    'background-color': board.style?.backgroundColor || '#333',
    backgroundImage: getBoardBg(board) || 'none',
    backgroundSize: 'cover',
  }">
    <header class="board-header flex align-center justify-between gap">
      <div class="flex gap">
        <h1 class="board-title fs18" ref="boardTitle" @blur="updateBoardTitle" contenteditable="true">
          {{ board.title }}
        </h1>
        <button class="btn btn-light btn-star" @click="starBoard">
          <span :class="[isStarred ? 'solid-star' : 'star', 'icon']"></span>
        </button>
      </div>

      <div class="flex board-right-actions" :class="{ 'move-right-actions': isRightMenuOpen }">
        <!-- <div class="right-menu-open" v-if="isRightMenuOpen"></div> -->
        <button class="btn btn-light btn-filter" @click="showFilterMenu = !showFilterMenu">
          <i v-html="getSvg('filter')"></i>Filter
        </button>
        <button @click="openRightMenu" class="btn btn-light" v-if="!isRightMenuOpen"
          v-html="getSvg('threeDots')"></button>
      </div>
      <RightMenuIndex @closeRightMenu="isRightMenuOpen = false" />


    </header>
    <main class="groups-wrapper flex">
      <GroupList :board="board" @updateBoard="updateBoard" />

      <article class="new-group-container flex">
        <button v-show="!isAddGroup" class="btn btn-light" @click="toggleAddGroup">
          <span class="icon icon-add"></span> Add another list
        </button>
        <div v-show="isAddGroup" class="new-group-wrapper flex">
          <input ref="newGroup" name="add-group" placeholder="Enter list title..." />
          <button class="btn btn-blue" @keyup.enter="onAddGroup" @click="onAddGroup">
            Add list
          </button>
          <button class="btn clean-btn" @click="toggleAddGroup">
            <i v-html="getSvg('close')"></i>
          </button>
        </div>
      </article>
      <GroupFilter @closeFilterMenu="showFilterMenu = false" v-if="showFilterMenu" />

    </main>
  </div>
  <RouterView />
</template>

<script>
import RightMenuIndex from '../../cmps/right-menu/RightMenuIndex.vue'
import { eventBus } from '../../services/event-bus.service'
import DynamicModal from '../../cmps/DynamicModal.vue'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import GroupList from '../../cmps/group/GroupList.vue'
import GroupFilter from '../../cmps/group/GroupFilter.vue'
import { svgService } from '../../services/svg.service'
import {
  getActionRemoveBoard,
  getActionUpdateBoard,
  getActionStarBoard,
} from '../../store/board.store'

export default {
  data() {
    return {
      board: null,
      groupToAdd: this.$store.getters.emptyGroup,
      isAddGroup: false,
      showFilterMenu: false,
      isRightMenuOpen: false,
    }
  },
  async created() {
    await this.$store.dispatch({ type: 'loadBoards' })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
    isStarred() {
      return this.board.isStarred
    },

  },
  methods: {
    openRightMenu() {
      eventBus.emit('openRightMenu')
    },
    async onSelectedImg(newImgUrls) {
      newBoard.style.imgUrls = { ...newImgUrls }
      const newBoard = JSON.parse(JSON.stringify(this.board))
      newBoard.style.backgroundColor = ''
      await this.updateBoard(newBoard)
    },
    async onSelectedColor(newBg) {
      const newBoard = JSON.parse(JSON.stringify(this.board))
      newBoard.style.backgroundColor = newBg
      newBoard.style.imgUrls = {}
      await this.updateBoard(newBoard)
    },
    onAddGroup() {
      let board = JSON.parse(JSON.stringify(this.board))

      this.groupToAdd.title = this.$refs.newGroup.value
      board.groups.push(this.groupToAdd)
      this.updateBoard(board)

      this.groupToAdd = this.$store.getEmptyGroup
      this.$refs.newGroup.value = ''
      this.toggleAddGroup()
    },
    getBoardBg(board) {
      if (!board.style?.imgUrls) return null
      else return `url(${board.style?.imgUrls.raw})`
    },
    async updateBoard(board) {
      try {
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg('Board updated')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update board')
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
    async starBoard() {
      try {
        let board = { ...this.board }
        board.isStarred = !board.isStarred
        this.board = board
        await this.$store.dispatch(getActionStarBoard(board))
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot star board')
      }
    },
    updateBoardTitle() {
      let board = { ...this.board }
      if (!this.$refs.boardTitle.innerText) {
        this.$refs.boardTitle.innerText = board.title
        return
      }
      board.title = this.$refs.boardTitle.innerText
      this.updateBoard(board)
    },
    toggleAddGroup() {
      this.isAddGroup = !this.isAddGroup
      if (this.isAddGroup) this.$nextTick(() => this.$refs.newGroup.focus())
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    mounted() {
      this.taskDetailsIsOpen = false
    },
  },
  watch: {
    board: {
      async handler() {
        if (this.board) {
          // await this.$store.dispatch({ type: 'loadBoards' })
          this.board = await this.$store.dispatch({
            type: 'loadCurrBoard',
            boardId: this.boardId,
          })
        }
      },
      immediate: true,
    },
  },
  components: {
    GroupList,
    GroupFilter,
    DynamicModal,
    RightMenuIndex,
  },
}
</script>
