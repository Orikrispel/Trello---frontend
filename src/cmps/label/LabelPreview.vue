<template>
  <div
    :style="{
      'background-color': label.color || '#bcd9ea',
    }"
    class="label-preview flex"
    @mouseover="getLabelStyle"
    @mouseout="getLabelStyle">
    <span>
      <span
        :style="{
          'background-color': labelCircleClr,
        }"
        class="label-circle"></span>
      {{ label.title }}</span
    >
  </div>
</template>
<script>
import { newShade } from '../../services/util.service'
export default {
  name: 'LabelPreview',
  props: {
    label: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      labelCircleClr: '',
    }
  },
  created() {
    this.labelCircleClr = newShade(this.label.color, -15)
  },
  methods: {
    getLabelStyle(ev) {
      console.log(this.labelCircleClr, this.label.color)
      if (ev.type === 'mouseover') {
        ev.target.style.filter = 'brightness(85%)'
      } else if (ev.type === 'mouseout') {
        ev.target.style.filter = 'brightness(100%)'
      }
    },
  },
}
</script>
<!-- <style lang="scss">
@import '../../assets/styles/setup/_mixins.scss';
$labelClr: #{labelClr};

.label-preview {
  span {
    background-color: #{$labelClr};
    &::before {
      content: '';
      position: absolute;
      top: 1em;
      bottom: 0.5em;
      left: -0.5em;
      border-radius: 50%;
      width: 1em;
      height: 1em;
      background-color: #{$labelClr};
      @include contrast-bg-color(#{$labelClr});
    }
  }
}
</style> -->
