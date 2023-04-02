<template>
  <form @submit.prevent="addBoard" class="board-add-form" @click.stop>
    <div class="add-form-header">
      <h2>Create Board</h2>
      <span class="icon btn-close icon-close" @click.stop="closeModal"></span>
    </div>
    <div class="board-display" :style="{
      backgroundImage: 'url(' + pickedImg + ')',
      background: pickedColor,
      backgroundSize: 'cover',
    }">
      <i v-html="getSvg('boardToDisplay')"></i>
    </div>
    <label for="color-picker" class="background-label">Background</label>
    <div class="picker-cmps">
      <ImgPicker @onSetBoardImg="setBoardImg" />
      <ColorPicker :quantity="6" @setColor="setBoardBgColor" />
    </div>
    <label for="board-title" class="board-title-label">Board title<span class="required-field">*</span></label>
    <input name="board-title" type="text" v-model="boardToAdd.title" />
    <button type="submit">Create</button>
  </form>
</template>

<script>
import { boardService } from '../services/board.service.local'
// import { boardService } from '../services/board.service'
import { svgService } from '../services/svg.service'
import { eventBus } from '../services/event-bus.service'
import ColorPicker from './ColorPicker.vue'
import ImgPicker from './ImgPicker.vue'

export default {
  name: 'AddBoard',
  props: {
    info: {},
  },
  data() {
    return {
      boardToAdd: boardService.getEmptyBoard(),
      pickedColor: 'white',
      pickedImg: {},
    }
  },
  computed: {},
  methods: {
    addBoard() {
      if (!this.boardToAdd.title) return
      this.$emit('addBoard', this.boardToAdd)
      this.$emit('closeModal')
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    setBoardBgColor(color) {
      this.pickedImg = {}
      this.pickedColor = color
      this.boardToAdd.style.imgUrls = {}
      this.boardToAdd.style.backgroundColor = color
    },
    closeModal() {
      this.$emit('closeModal', false)
    },
    setBoardImg(imgUrls) {
      this.pickedColor = 'null'
      this.pickedImg = imgUrls.thumb
      this.boardToAdd.style.imgUrls = imgUrls
      console.log(
        'this.boardToAdd.style.imgUrls',
        this.boardToAdd.style.imgUrls
      )
    },
  },
  created() {
    eventBus.on('setPickerOff', (task) => {
      this.saveTask(task)
    })
  },

  components: {
    ColorPicker,
    ImgPicker,
  },
}

ImgPicker
</script>
