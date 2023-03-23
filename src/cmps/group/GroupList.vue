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
      boardCopy: JSON.parse(JSON.stringify(this.board)),
      upperDropPlaceholderOptions: {
        className: 'cards-drop-preview',
        animationDuration: '150',
        showOnTop: true
      },
    }
  },
  methods: {
    onDrop(dropResult) {
      this.boardCopy.groups = applyDrag(this.boardCopy.groups, dropResult)
      this.updateBoard()
    },

    updateBoard() {
      this.$emit('updateBoard', this.boardCopy)
    },
  },
  components: {
    GroupPreview,
    Container,
    Draggable
  }


}
</script>
