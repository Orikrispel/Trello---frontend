<template>
  <section class="right-menu-actions">
    <button>
      <span v-html="getSvg('addMember')" style="padding-top: 3px"></span>
      About this board
    </button>
    <button @click="this.$emit('ChangeCmp', 'ChangeBgMenu')">
      <span v-html="getSvg('pencil')" style="padding-top: 2px"></span>
      Change background
    </button>
  </section>
  <section class="right-menu-actions">
    <ActivityList v-if="board" :activities="board.activities" />
  </section>
</template>

<script>
import ActivityList from '../activities/ActivityList.vue'
import { svgService } from '../../services/svg.service'
import { eventBus } from '../../services/event-bus.service'
export default {
  components: {
    ActivityList,
  },
  name: 'RightMenuMain',
  data() {
    return {
      board: null,
      currTask: null,
    }
  },
  async created() {
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
  },
  methods: {
    debug() {
      console.log(this.board.activities)
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
  computed: {
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  emits: ['changeCmp', 'setBgColor', 'setBgImg']

}
</script>
