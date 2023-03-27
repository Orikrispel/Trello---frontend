<template>
  <div class="labels-list">
    <hr />
    <input
      type="text"
      name="label-search"
      placeholder="Search labels..."
      v-model="filterBy"
      @input="searchLabels" />
    <h4>Labels</h4>
    <ul class="clean-list">
      <li
        class="label-list-item"
        v-for="(label, idx) in labels"
        :key="label.id">
        <input type="checkbox" />
        <LabelPreview :label="label" @click="addLabelToTask(label)" />
        <div
          @click="editLabel(label.id)"
          class="icon pencil-icon"
          v-html="getSvg('pencil')"></div>
      </li>
      <button class="btn btn-label" @click="$emit('toggleLabelEdit')">
        Create a new label
      </button>
    </ul>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import LabelPreview from './LabelPreview.vue'
import { svgService } from '../../services/svg.service'
export default {
  name: 'LabelList',
  data() {
    return {
      labels: [],
      board: null,
      task: null,
      filterBy: '',
    }
  },
  computed: {
    currLabels() {
      return this.$store.getters.currLabels
    },

    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  async created() {
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
    this.task = await this.$store.dispatch({
      type: 'loadCurrTask',
      taskId: this.taskId,
    })
    let { labels } = this.board
    if (!labels || !labels.length)
      labels = this.$store.getters.defaultEmptyLabels
    this.labels = labels
  },
  methods: {
    searchLabels() {
      let labels
      if (this.filterBy) {
        const regex = new RegExp(this.filterBy, 'i')
        labels = this.labels.filter((label) => regex.test(label.title))
      } else {
        labels = this.board.labels
      }
      this.labels = labels
    },
    async addLabelToTask(label) {
      let task = JSON.parse(JSON.stringify(this.task))
      if (!task.labels) task.labels = []
      console.log(task.labels)
      let hasLabel = task.labels.some((l) => l.id === label.id)

      if (hasLabel) task = this.removeLabelFromTask(task, label)
      else task.labels.push({ ...label })
      eventBus.emit('updateTask', task)
      this.task = task
    },
    removeLabelFromTask(task, label) {
      const labelToRemoveIdx = task.labels.findIndex((l) => l.id === label.id)
      task.labels.splice(labelToRemoveIdx, 1)
      return task
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    getLabelStyle(ev) {
      if (ev.type === 'mouseover') {
        ev.target.style.filter = 'brightness(85%)'
      } else if (ev.type === 'mouseout') {
        ev.target.style.filter = 'brightness(100%)'
      }
    },
    async editLabel(labelId) {
      await this.$store.dispatch({ type: 'setCurrLabel', labelId })
      this.$emit('toggleLabelEdit')
    },
  },

  components: {
    LabelPreview,
  },
}
</script>
