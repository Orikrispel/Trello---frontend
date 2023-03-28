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
import LabelPreview from './LabelPreview.vue'
import ColorPicker from '../../cmps/ColorPicker.vue'
import { getActionUpdateBoard } from '../../store/board.store'
export default {
  name: 'LabelEdit',
  data() {
    return {
      label: {},
      board: null,
      creatingNewLabel: false,
    }
  },
  computed: {
    boardId() {
      const { boardId } = this.$route.params
      return boardId
    },
  },
  async created() {
    let label = await this.$store.getters.currLabel
    if (!label) {
      label = this.$store.getters.defaultEmptyLabel
      this.creatingNewLabel = true
    }
    this.label = { ...label }
    this.board = await this.$store.dispatch({
      type: 'loadCurrBoard',
      boardId: this.boardId,
    })
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
      try {
        await this.updateBoard(board, 'Label Saved', 'Failed to save label')
      } catch (err) {
        console.log('failed to save label')
        throw err
      }
      this.$emit('toggleLabelEdit')
    },
    async removeLabel() {
      let label = { ...this.label }
      let board = JSON.parse(JSON.stringify(this.board))
      const labelIdx = board.labels.findIndex((l) => l.id === label.id)
      board.labels.splice(labelIdx, 1)
      try {
        await this.updateBoard(board, 'Label removed', 'Failed to remove label')
      } catch (err) {
        console.log(err, "couldn't remove label")
      }
      this.$emit('toggleLabelEdit')
    },
    async updateBoard(board, successMsg, errMsg) {
      try {
        this.board = board
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg(successMsg)
      } catch (err) {
        console.log(err)
        showErrorMsg(errMsg)
      }
    },
  },
  components: {
    ColorPicker,
    LabelPreview,
  },
}
</script>
