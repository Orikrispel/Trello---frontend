<template>
  <div class="due-date-preview-container">
    <input type="checkbox" />
    <button class="btn btn-light">
      {{ dateForDisplay }}
      <span class="icon icon-arrow-down" v-html="getSvg('arrowDown')"></span>
    </button>
  </div>
</template>
<script>
import { utilService } from '../../services/util.service'
import { svgService } from '../../services/svg.service'
export default {
  name: 'DatePreview',
  props: {
    date: {
      type: Object,
      required: true,
    },
  },
  computed: {
    dateForDisplay() {
      return utilService.getFormattedDate(this.datedate)
    },
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
