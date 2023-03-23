<template>
  <section class="flex">
    <Container v-if="boardCopy" class="flex" @drop="onDrop" orientation="horizontal">
      <Draggable v-for="group in boardCopy.groups" :key="group.id">
        <GroupPreview :board="boardCopy" :group="group" @updateBoard="updateBoard" />
      </Draggable>
    </Container>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { boardService } from '../../services/board.service.local'
import GroupPreview from './GroupPreview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/util.service'
export default {
  name: 'GroupList',
  props: ['board'],
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup(),
      boardCopy: JSON.parse(JSON.stringify(this.board))
    }
  },
  methods: {
    onDrop(dropResult) {
      console.log('dropResult:', dropResult)
      this.boardCopy.groups = applyDrag(this.boardCopy.groups, dropResult)
      this.updateBoard(this.boardCopy)
    },

    async updateBoard(board) {
      try {
        await this.$store.dispatch({ type: 'updateBoard', board })
        showSuccessMsg('Board updated')
        this.boardCopy = board
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update group')
      }
    },
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
  },
  components: {
    GroupPreview,
    Container,
    Draggable
  }


}
</script>
