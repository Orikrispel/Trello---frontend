<template>
  <div v-if="board" class="board-container main flex column" :style="{
    background: board.style?.gradient || '#014a75',
    backgroundImage: getBoardBg() || board.style?.gradient,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
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
        <!-- <button class="btn btn-light btn-filter" @click="showFilterMenu = !showFilterMenu">
          <i v-html="getSvg('filter')"></i>Filter
        </button> -->
        <button class="btn btn-light">Share</button>
        <span class="board-header-btn-divider"></span>
        <button @click="openRightMenu" class="btn btn-light btn-sm btn-menu" v-if="!isRightMenuOpen"
          v-html="getSvg('threeDots')"></button>
      </div>
      <RightMenuIndex @closeRightMenu="isRightMenuOpen = false" @setBgColor="setBgColor" @setBgImg="setBgImg" />
    </header>

    <InviteModalVue @updateBoard="updateBoard" />

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
import {
  socketService,
  SOCKET_EVENT_TASK_DROPPED,
  SOCKET_EVENT_BOARD_UPDATED,
  SOCKET_EMIT_BOARD_UPDATED,
  SOCKET_EMIT_SET_TOPIC,
} from '../../services/socket.service'
import InviteModalVue from '../../cmps/invite/InviteModal.vue'
import RightMenuIndex from '../../cmps/right-menu/RightMenuIndex.vue'
import { eventBus } from '../../services/event-bus.service'
import DynamicModal from '../../cmps/DynamicModal.vue'

import GroupList from '../../cmps/group/GroupList.vue'
import GroupFilter from '../../cmps/group/GroupFilter.vue'
import { svgService } from '../../services/svg.service'
import { mapGetters } from 'vuex'
import {
  getActionRemoveBoard,
  getActionUpdateBoard,
  getActionStarBoard,
} from '../../store/board.store'
import { utilService } from '../../services/util.service'

export default {
  data() {
    return {
      board: null,
      groupToAdd: this.$store.getters.emptyGroup,
      isAddGroup: false,
      showFilterMenu: false,
      isRightMenuOpen: false,
      isDark: true,
    }
  },
  async created() {
    await this.$store.dispatch({ type: 'loadBoards' })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    this.checkIsDark()

    // socketService.on(SOCKET_EVENT_BOARD_UPDATED, (board) => {
    //   this.updateBoard(board)
    // })
  },
  computed: {
    ...mapGetters(['currBoard']),
    loggedinUser() {
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
    async updateBoard(board, activity) {
      try {
        this.board = await this.$store.dispatch(getActionUpdateBoard(board))
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
    async starBoard() {
      try {
        let board = { ...this.board }
        board.isStarred = !board.isStarred
        this.board = board
        await this.$store.dispatch(getActionStarBoard(board))
      } catch (err) {
        console.log(err)
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
      if (!this.board.style?.imgUrls?.regular) return null
      else return `url(${this.board.style?.imgUrls?.regular})`
    },
    async checkIsDark() {
      const fac = new FastAverageColor()
      if (!this.board) return
      if (this.board.style?.imgUrls?.regular) {
        try {
          const color = await fac.getColorAsync(
            this.board.style?.imgUrls?.regular
          )
          this.isDark = color.isDark
        } catch (err) {
          console.log(err)
        }

      } else {
        this.isDark = true
      }
    },
  },
  mounted() {
    this.taskDetailsIsOpen = false
    socketService.emit(SOCKET_EMIT_SET_TOPIC, this.boardId)
    // socketService.on(SOCKET_EVENT_BOARD_UPDATED, (board) => {
    //   this.board = board
    // })
  },
  watch: {
    currBoard: {
      handler(newBoard, oldBoard) {
        this.board = newBoard
        this.checkIsDark()
      },
      immediate: true,
    },
  },
  components: {
    GroupList,
    GroupFilter,
    DynamicModal,
    RightMenuIndex,
    InviteModalVue,
  },
}
</script>
