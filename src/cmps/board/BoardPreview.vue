<template>
  <div class="board-preview">
    <h5 class="board-title">{{ board.title }}</h5>
    <div class="board-preview-actions">
      <span class="board-star" @click.stop="onStarBoard(board)"
        :class="[(isStarred && !isHoveringStar) ? 'solid-star' : 'star', 'icon']" @mouseenter="isHoveringStar = true"
        @mouseleave="isHoveringStar = false"></span>
    </div>
    <div class="board-overlay"></div>
  </div>
</template>

<script>
import { svgService } from '../../services/svg.service'
export default {
  name: 'BoardPreview',
  props: {
    board: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      isHoveringStar: false,
    }
  },
  computed: {
    isStarred() {
      return this.board.isStarred
    }
  },
  created() { },
  methods: {
    onStarBoard() {
      const currBoard = JSON.parse(JSON.stringify(this.board))
      currBoard.isStarred = !currBoard.isStarred
      this.$emit('starBoard', currBoard)
    },
    onRemoveBoard(boardId, event) {
      this.$emit('onRemoveBoard', boardId)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
