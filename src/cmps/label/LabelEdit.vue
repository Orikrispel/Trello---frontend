<template>
  <ColorPicker @setColor="setColor" />
</template>

<script>
import ColorPicker from '../cmps/ColorPicker.vue'
export default {
  methods: {
    setColor(color) {
      this.pickedColor = color
      this.$emit('setColor', color)
    },
  },
  components: {
    ColorPicker,
  },
}
</script>
