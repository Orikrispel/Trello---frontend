<template>
  <div v-if="board" class="board-container main flex column" :style="{
    background: board.style?.backgroundColor || '#014a75',
    backgroundImage: getBoardBg() || board.style?.backgroundColor,
    backgroundSize: 'cover',
    'background-position': 'center',
  }">
    <header :class="[
      'board-header flex align-center justify-between',
      { dark: isDark },
    ]">
      <div class="flex">
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
        <span class="board-header-btn-divider"></span>
        <button @click="openRightMenu" class="btn btn-light btn-sm btn-menu" v-if="!isRightMenuOpen"
          v-html="getSvg('threeDots')"></button>
      </div>
      <RightMenuIndex @closeRightMenu="isRightMenuOpen = false" @setBgColor="setBgColor" @setBgImg="setBgImg" />
    </header>
    <main class="groups-wrapper flex">
      <GroupList :board="board" @updateBoard="updateBoard" />

      <article class="new-group-container flex">
        <button v-show="!isAddGroup" :class="['btn btn-light btn-add-group', { dark: isDark }]" @click="toggleAddGroup">
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
import { mapGetters } from 'vuex'
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
      isDark: false,
    }
  },
  async created() {
    await this.$store.dispatch({ type: 'loadBoards' })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    this.checkIsDark()
  },
  computed: {
    ...mapGetters(['currBoard']),
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
    getBgImg() {
      return this.board.style.imgUrls.thumb
    },
  },
  methods: {
    openRightMenu() {
      eventBus.emit('openRightMenu')
    },
    async setBgImg(newImgUrls) {
      const newBoard = JSON.parse(JSON.stringify(this.board))
      newBoard.style.imgUrls = newImgUrls
      newBoard.style.backgroundColor = ''
      await this.updateBoard(newBoard)
    },
    async setBgColor(newBg) {
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
    async updateBoard(board) {
      try {
        this.board = await this.$store.dispatch(getActionUpdateBoard(board))
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
    getBoardBg() {
      if (!this.board.style.imgUrls.regular) {
        return null
      }
      else return `url(${this.board.style?.imgUrls.regular})`
    },
    async checkIsDark() {
      const fac = new FastAverageColor()
      if (this.board.style.backgroundColor) {
        const hexColor = this.board.style.backgroundColor
        let red = parseInt(hexColor.substring(1, 3), 16)
        let green = parseInt(hexColor.substring(3, 5), 16)
        let blue = parseInt(hexColor.substring(5, 7), 16)

        // Calculate perceived brightness
        let perceivedBrightness = 0.299 * red + 0.587 * green + 0.114 * blue

        // Check if color is light or dark
        this.isDark = perceivedBrightness >= 128
      } else {
        try {
          const color = await fac.getColorAsync(
            this.board.style.imgUrls.regular
          )
          this.isDark = color.isDark
        } catch (err) {
          console.log(err)
        }
      }
    },
  },
  mounted() {
    this.taskDetailsIsOpen = false
  },
  watch: {
    currBoard: {
      handler(newBoard, oldBoard) {
        this.board = newBoard
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
