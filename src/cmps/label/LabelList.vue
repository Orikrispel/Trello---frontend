<template>
  <div v-if="board" class="labels-list">
    <input
      type="text"
      name="label-search"
      placeholder="Search labels..."
      v-model="filterBy" />
    <h4>Labels</h4>
    <ul v-if="labels" class="clean-list">
      <li class="label-list-item" v-for="label in labels" :key="label.id">
        <input
          type="checkbox"
          :checked="isChecked(label.id)"
          :id="[`label-checkbox-${label.id}`]"
          @input="addLabelToTask(label)" />
        <label class="label-checkbox" :for="[`label-checkbox-${label.id}`]">
          <LabelPreview :label="label" />
        </label>
        <button class="btn-sm clean-btn" @click="editLabel(label.id)">
          <span class="icon pencil-icon" v-html="getSvg('pencil')"></span>
        </button>
      </li>
    </ul>
    <button class="btn-task light btn-label" @click="$emit('toggleLabelEdit')">
      Create a new label
    </button>
  </div>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import LabelPreview from './LabelPreview.vue'
import { svgService } from '../../services/svg.service'
import { mapGetters } from 'vuex'

export default {
  name: 'LabelList',
  props: {
    taskLabels: {
      required: true,
    },
  },
  data() {
    return {
      board: null,
      task: null,
      filterBy: '',
    }
  },
  async created() {
    this.board = this.$store.getters.currBoard
    this.task = await this.$store.dispatch({
      type: 'loadCurrTask',
      taskId: this.taskId,
    })
  },
  computed: {
    ...mapGetters(['currBoard']),
    taskId() {
      const { taskId } = this.$route.params
      return taskId
    },
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
    labels() {
      let labels = this.board.labels
      if (this.filterBy) {
        const regex = new RegExp(this.filterBy, 'i')
        labels = this.labels.filter((label) => regex.test(label.title))
      }
      return labels
    },
  },
  methods: {
    isChecked(labelId) {
      if (!this.taskLabels) return
      return this.taskLabels.find((l) => l.id === labelId)
    },
    async addLabelToTask(label) {
      let user = this.$store.getters.loggedinUser

      let task = JSON.parse(JSON.stringify(this.task))
      if (!task.labels) task.labels = []
      let hasLabel = task.labels.some((l) => l.id === label.id)

      if (hasLabel) task = this.removeLabelFromTask(task, label)
      else task.labels.push({ ...label })

      let activity = await this.$store.dispatch({
        type: 'returnActivity',
        data: {
          task: { title: this.task.title, taskId: this.taskId },
          type: 'label',
          byMember: {
            fullname: user.fullname,
            _id: user._id,
          },
          label,
        },
      })
      const data = { task, activity }
      eventBus.emit('updateTask', data)
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
  watch: {
    currBoard: {
      handler(newBoard, oldBoard) {
        this.board = newBoard
      },
      immediate: true,
    },
  },
  components: {
    LabelPreview,
  },
}
</script>
