<template>
  <section class="label-edit">
    <div class="label-preview-container">
      <labelPreview :label="label" />
    </div>
    <h4>Title</h4>
    <input type="text" name="label-title" v-model="label.title" />
    <h4>Select a color</h4>
    <ColorPicker :quantity="30" @setColor="setColor" />
    <button class="btn btn-remove-color" @click="setColor('#e2e4e9')">
      <span class="icon btn-close icon-close" v-close-popper></span> Remove color
    </button>
    <hr>
    <div class="label-btns-container">
      <button class="btn btn-blue btn-label" @click="saveLabel">{{ creatingNewLabel ? 'Create' : 'Save' }}</button>
      <button class="btn btn-red btn-label" v-if="!creatingNewLabel" @click="removeLabel">
        Delete
      </button>
    </div>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { eventBus } from '../../services/event-bus.service';
import LabelPreview from './LabelPreview.vue'
import ColorPicker from '../../cmps/ColorPicker.vue'
import { getActionUpdateBoard } from '../../store/board.store'
import { mapGetters } from 'vuex'

export default {
  name: 'LabelEdit',
  data() {
    return {
      label: {},
      board: this.$store.getters.currBoard,
      creatingNewLabel: false,
    }
  },
  computed: {
    ...mapGetters(['currBoard']),
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  async created() {
    let label = this.$store.getters.currLabel
    if (!label) {
      label = this.$store.getters.defaultEmptyLabel
      this.creatingNewLabel = true
    }
    this.label = { ...label }
  },
  methods: {
    setColor(color) {
      this.label.color = color
    },
    async saveLabel() {
      let label = { ...this.label }
      let board = JSON.parse(JSON.stringify(this.board))
      if (!label.id) {
        label.id = this.$store.getters.makeId
        board.labels.push(label)
      } else {
        const labelIdx = board.labels.findIndex((l) => l.id === label.id)
        board.labels.splice(labelIdx, 1, label)
      }
      eventBus.emit('updateBoard', board)
      this.$emit('toggleLabelEdit')
    },
    removeLabel() {
      eventBus.emit('removeLabel', this.label.id)
      this.$emit('toggleLabelEdit')

    },
  },
  watch: {
    currBoard: {
      handler(newBoard, oldBoard) {
        console.log('currBoard changed:', newBoard);
        this.board = newBoard
      },
      immediate: true,
    },
  },
  components: {
    ColorPicker,
    LabelPreview,
  },
}
</script>
