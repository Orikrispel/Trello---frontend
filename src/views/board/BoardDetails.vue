<template>
  <div v-if="board" class="board-container main flex column">
    <header class="board-header flex align-center justify-between gap">
      <div class="flex gap">
        <h1 class="board-title fs18">{{ board.title }}</h1>
        <button class="btn btn-light btn-star" @click="starBoard">
          <span :class="[isStarred ? 'solid-star' : 'star', 'icon']"></span>
        </button>
      </div>

      <div class="flex gap">
        <button class="btn btn-light btn-filter">
          <i v-html="getSvg('filter')"></i>Filter
        </button>
      </div>
    </header>

    <main class="groups-wrapper flex">
      <GroupList :board="board" @updateBoard="updateBoard" />

      <article class="new-group-container flex">
        <button v-show="!isAddGroup" class="btn btn-light" @click="toggleAddGroup">
          + add another list
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
      <RouterView />
    </main>
    <!-- <div
      v-if="taskDetailsIsOpen"
      @click="toggleTaskDetails('group')"
      class="modal-overlay"></div> -->
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import GroupList from '../../cmps/group/GroupList.vue'
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
    }
  },
  methods: {
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
        this.board = board
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
        const newBoard = { ...this.board }
        newBoard.isStarred = !newBoard.isStarred
        this.board = newBoard
        await this.$store.dispatch(getActionStarBoard(newBoard))
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot star board')
      }
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
  components: {
    GroupList,
  },
}
</script>
