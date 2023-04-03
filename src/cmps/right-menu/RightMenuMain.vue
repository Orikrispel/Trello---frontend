<template>
  <section class="right-menu-actions">
    <button>
      <span v-html="getSvg('trello')" style="padding-top: 3px"></span>
      About this board
    </button>
    <button @click="this.$emit('changeCmp', 'ChangeBgMenu')">
      <div v-if="this.board" class="background-thumb" :style="{
        background: board.style?.backgroundColor,
        backgroundImage: getBoardBg() || board.style?.backgroundColor,
        backgroundSize: 'cover',
        'background-position': 'center',
      }"></div>
      Change background
    </button>

    <hr>
    <section class="right-menu-actions">
      <h3 class="activity-title flex align-center"><span class="icon activity-icon"></span>Activity</h3>
      <ActivityList v-if="board" :activities="board.activities" />
    </section>
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
    getBoardBg() {
      if (!this.board.style.imgUrls?.regular) return null
      else return `url(${this.board.style.imgUrls?.regular})`
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
