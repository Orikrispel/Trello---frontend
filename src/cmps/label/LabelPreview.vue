<template>
  <div
    :style="{
      'background-color': label.color || '#bcd9ea',
    }"
    class="label-container"
    @mouseover="getLabelStyle"
    @mouseout="getLabelStyle">
    <span>{{ label.title }}</span>
  </div>
</template>
<script>
export default {
  name: 'LabelPreview',
  props: ['label'],
  methods: {
    getLabelStyle(ev) {
      if (ev.type === 'mouseover') {
        ev.target.style.filter = 'brightness(85%)'
      } else if (ev.type === 'mouseout') {
        ev.target.style.filter = 'brightness(100%)'
      }
    },
  },
}
</script>
