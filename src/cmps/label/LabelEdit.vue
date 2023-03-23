<template>
  <section class="label-edit">
    <labelPreview :label="label" />
    <input type="text" name="label-title" v-model="label.title" />
    <ColorPicker :quantity="30" @setColor="setColor" />
  </section>
</template>

<script>
import LabelPreview from './LabelPreview.vue'
import ColorPicker from '../../cmps/ColorPicker.vue'
export default {
  data() {
    return {
      label: {},
    }
  },
  computed: {
    currLabel() {
      let label = this.$store.getters.defaultEmptyLabel
      this.label = { ...label }
    },
  },
  methods: {
    setColor(color) {
      console.log(this.label)
      this.pickedColor = color
      this.$emit('setColor', color)
    },
  },
  components: {
    ColorPicker,
    LabelPreview,
  },
}
</script>
