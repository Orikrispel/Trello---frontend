<template>
  <section class="flex">
    <Container v-if="boardCopy" class="flex" @drop="onDrop" orientation="horizontal"
      :drop-placeholder="upperDropPlaceholderOptions">
      <Draggable v-for="group in boardCopy.groups" :key="group.id">
        <GroupPreview :board="boardCopy" :group="group" @updateBoard="updateBoard" />
      </Draggable>
    </Container>
  </section>
</template>

<script>
import { boardService } from '../../services/board.service'
// import { boardService } from '../../services/board.service.local'
import GroupPreview from './GroupPreview.vue'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/util.service'
export default {
  name: 'GroupList',
  props: ['board'],
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup(),
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
    }
  },
  computed: {
    boardCopy() {
      return JSON.parse(JSON.stringify(this.board))
    },
  },
  methods: {
    onDrop(dropResult) {
      let board = this.boardCopy
      board.groups = applyDrag(board.groups, dropResult)
      this.updateBoard(board)
    },

    updateBoard(board) {
      this.$emit('updateBoard', board)
    },
  },
  components: {
    GroupPreview,
    Container,
    Draggable,
  },
}
</script>
