<template>
  <div v-if="board" class="board-container main flex column">
    <section class="board-header flex align-center gap">
      <h1 class="board-title fs18">{{ board.title }}</h1>
      <button class="btn">
        <div class="star-svg" v-html="getSvg('star')" @click="starBoard"></div>
      </button>
    </section>
    <GroupList :board="board" />
    <hr />
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardService } from '../../services/board.service.local'
import GroupList from '../../cmps/group/GroupList.vue'
import { svgService } from '../../services/svg.service'
import {
  getActionRemoveGroup,
  getActionUpdateGroup,
  getActionStarBoard,
} from '../../store/board.store'

export default {
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup(),
      board: null
    }
  },
  async created() {
    this.board = await this.$store.dispatch({ type: 'loadBoards' })
    this.board = await this.$store.dispatch({ type: 'loadCurrBoard', boardId: this.boardId })
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  methods: {
    async addGroup() {
      try {
        await this.$store.dispatch({ type: 'addGroup', group: this.groupToAdd })
        showSuccessMsg('Group added')
        this.groupToAdd = groupService.getEmptyGroup()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add group')
      }
    },
    async removeGroup(groupId) {
      try {
        await this.$store.dispatch(getActionRemoveGroup(groupId))
        showSuccessMsg('Group removed')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove group')
      }
    },
    async updateGroup(group) {
      try {
        group = { ...group }
        group.price = +prompt('New price?', group.price)
        await this.$store.dispatch(getActionUpdateGroup(group))
        showSuccessMsg('Group updated')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update group')
      }
    },
    async starBoard() {
      try {
        const newBoard = JSON.parse(JSON.stringify(this.board))
        newBoard.isStarred = !newBoard.isStarred
        await this.$store.dispatch(getActionStarBoard(newBoard))

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot star board')
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
  components: {
    GroupList,
  },
}
</script>
