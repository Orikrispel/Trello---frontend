<template>
  <div class="container main">
    <h1>hello</h1>
    <GroupList v-if="board" :board="board" />
    <hr />
  </div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardService } from '../../services/board.service.local'
import GroupList from '../cmps/GroupList.vue'
import {
  getActionRemoveGroup,
  getActionUpdateGroup,
  getActionAddGroupMsg,
} from '../../store/board.store'

export default {
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup(),
      board: null,
    }
  },
  async created() {
    // this.$store.dispatch({ type: 'loadGroups', boardId: this.boardId })
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    console.log('board:', this.board)
  },
  computed: {
    // board() {
    //   // return this.$store.getters.currBoard
    // },
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
    async addGroupMsg(groupId) {
      try {
        await this.$store.dispatch(getActionAddGroupMsg(groupId))
        showSuccessMsg('Group msg added')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add group msg')
      }
    },
    printGroupToConsole(group) {
      console.log('Group msgs:', group.msgs)
    },
  },
  components: {
    GroupList,
  },
}
</script>
