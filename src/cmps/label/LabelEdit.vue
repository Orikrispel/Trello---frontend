<template>
  <section class="label-edit">
    <div class="label-preview-container">
      <labelPreview :label="label" />
    </div>
    <h4>Title</h4>
    <input type="text" name="label-title" v-model="label.title" />
    <h4>Select a color</h4>
    <ColorPicker :quantity="30" @setColor="setColor" />
    <button>X Remove color</button>
    <button @click="saveLabel">Create</button>
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
      this.label.color = color
      this.$emit('setColor', color)
    },
    saveLabel() {
      let label = { ...this.label }
    },
  },
  components: {
    ColorPicker,
    LabelPreview,
  },
}
</script>
