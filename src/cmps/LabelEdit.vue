<template>
  <div class="colors-container">
    <div class="color-item color-item-1" @click="setColor('#7bc86c')"></div>
    <div class="color-item color-item-2" @click="setColor('#f5dd29')"></div>
    <div class="color-item color-item-3" @click="setColor('#ffaf3f')"></div>
    <div class="color-item color-item-4" @click="setColor('#ef7564')"></div>
    <div class="color-item color-item-5" @click="setColor('#cd8de5')"></div>
    <div class="color-item color-item-6" @click="setColor('#5ba4cf')"></div>
  </div>
</template>

<script>
export default {
  methods: {
    setColor(color) {
      this.pickedColor = color
      this.$emit('setColor', color)
    },
  },
}
</script>
