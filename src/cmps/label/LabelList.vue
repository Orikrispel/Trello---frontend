<template>
  <div class="labels-list">
    <input type="text" name="label-search" placeholder="Search labels..." v-model="filterBy" @input="searchLabels" />
    <h4>Labels</h4>
    <ul class="clean-list">
      <li class="label-list-item" v-for="(label, idx) in labels" :key="label.id">
        <input type="checkbox" :checked="isChecked(label.id)" :id="[`label-checkbox-${label.id}`]"
          @input="addLabelToTask(label)" />
        <label class="label-checkbox" :for="[`label-checkbox-${label.id}`]">
          <LabelPreview :label="label" />
        </label>
        <button class="btn-sm clean-btn" @click="editLabel(label.id)">
          <span class="icon pencil-icon" v-html="getSvg('pencil')"></span>
        </button>
      </li>
    </ul>
    <button class="btn btn-label" @click="$emit('toggleLabelEdit')">
      Create a new label
    </button>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import LabelPreview from './LabelPreview.vue'
import { svgService } from '../../services/svg.service'
export default {
  name: 'LabelList',
  props: {
    taskLabels: {
      required: true,
    }
  },
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
  async mounted() {
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
    isChecked(labelId) {
      return this.taskLabels.find(l => l.id === labelId)
    },
    async addLabelToTask(label) {
      let task = JSON.parse(JSON.stringify(this.task))
      if (!task.labels) task.labels = []
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
