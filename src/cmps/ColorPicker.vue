<template>
  <div class="colors-container">
    <div class="color-item color-item-1" @click="setColor('#7bc86c')"></div>
    <div class="color-item color-item-2" @click="setColor('#f5dd29')"></div>
    <div class="color-item color-item-3" @click="setColor('#ffaf3f')"></div>
    <div class="color-item color-item-4" @click="setColor('#ef7564')"></div>
    <div class="color-item color-item-5" @click="setColor('#cd8de5')"></div>
    <div class="color-item color-item-6" @click="setColor('#5ba4cf')"></div>
    <div class="color-item color-item-7" @click="setColor('#b7ddb0')"></div>
    <div class="color-item color-item-8" @click="setColor('#f5ea92')"></div>
    <div class="color-item color-item-9" @click="setColor('#fad29c')"></div>
    <div class="color-item color-item-10" @click="setColor('#efb3ab')"></div>
    <div class="color-item color-item-11" @click="setColor('#dfc0eb')"></div>
    <div class="color-item color-item-12" @click="setColor('#7bc86c')"></div>
    <div class="color-item color-item-13" @click="setColor('#f5dd29')"></div>
    <div class="color-item color-item-14" @click="setColor('#ffaf3f')"></div>
    <div class="color-item color-item-15" @click="setColor('#ef7564')"></div>
    <div class="color-item color-item-16" @click="setColor('#cd8de5')"></div>
    <div class="color-item color-item-17" @click="setColor('#5aac44')"></div>
    <div class="color-item color-item-18" @click="setColor('#e6c60d')"></div>
    <div class="color-item color-item-19" @click="setColor('#e79217')"></div>
    <div class="color-item color-item-20" @click="setColor('#cf513d')"></div>
    <div class="color-item color-item-21" @click="setColor('#a86cc1')"></div>
    <div class="color-item color-item-22" @click="setColor('#8bbdd9')"></div>
    <div class="color-item color-item-23" @click="setColor('#8fdfeb')"></div>
    <div class="color-item color-item-24" @click="setColor('#b3f1d0')"></div>
    <div class="color-item color-item-25" @click="setColor('#f9c2e4')"></div>
    <div class="color-item color-item-26" @click="setColor('#505f79')"></div>
    <div class="color-item color-item-27" @click="setColor('#5ba4cf')"></div>
    <div class="color-item color-item-28" @click="setColor('#29cce5')"></div>
    <div class="color-item color-item-29" @click="setColor('#6deca9')"></div>
    <div class="color-item color-item-30" @click="setColor('#ff8ed4')"></div>
    <div class="color-item color-item-31" @click="setColor('#344563')"></div>
    <div class="color-item color-item-32" @click="setColor('#026aa7')"></div>
    <div class="color-item color-item-33" @click="setColor('#00aecc')"></div>
    <div class="color-item color-item-34" @click="setColor('#4ed583')"></div>
    <div class="color-item color-item-35" @click="setColor('#e568af')"></div>
    <div class="color-item color-item-36" @click="setColor('#091e42')"></div>
    <div class="color-item color-item-37" @click="setColor('#aabbcc')"></div>
    <div class="color-item color-item-38" @click="setColor('#ddeeff')"></div>
  </div>
</template>

<script>
export default {
  props: ['quantity'],
  name: 'ColorPicker',
  data() {
    return {
      pickedColor: 'white',
      colorItems: [],
    }
  },
  computed: {
    loggedInUser() {},
  },
  created() {
    console.log(this)
  },
  methods: {
    onStarBoard(board) {
      this.$emit('starBoard', board)
    },
    onRemoveBoard(boardId) {
      this.$emit('onRemoveBoard', boardId)
    },
    setColor(color) {
      console.log(this)
      this.pickedColor = color
      this.$emit('setColor', color)
    },
  },
  emits: ['setColor'],
}
</script>
