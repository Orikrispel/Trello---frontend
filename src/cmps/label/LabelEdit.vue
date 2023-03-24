<template>
  <section class="label-edit">
    <div class="label-preview-container">
      <labelPreview :label="label" />
    </div>
    <h4>Title</h4>
    <input type="text" name="label-title" v-model="label.title" />
    <h4>Select a color</h4>
    <ColorPicker :quantity="30" @setColor="setColor" />
    <button class="btn btn-light" @click="setColor('#e2e4e9')">
      X Remove color
    </button>
    <button class="btn btn-blue" @click="saveLabel">Save</button>
    <button class="btn btn-red" v-if="!creatingNewLabel">Delete</button>
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
    console.log(label)
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
      this.$emit('setColor', color)
    },
    saveLabel() {
      let label = { ...this.label }
      let board = JSON.parse(JSON.stringify(this.board))
      if (!label.id) {
        board.labels.push(label)
      }

      this.updateBoard(board)
    },
    async updateBoard(board) {
      try {
        this.board = board
        await this.$store.dispatch(getActionUpdateBoard(board))
        showSuccessMsg('Board updated')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update board')
      }
    },
  },
  components: {
    ColorPicker,
    LabelPreview,
  },
}
</script>
