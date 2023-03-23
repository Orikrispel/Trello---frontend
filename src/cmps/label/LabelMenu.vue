<template>
  <section class="label-menu">
    <span
      @click="$emit('closeLabelMenu')"
      class="icon btn-close"
      v-html="getSvg('close')"></span>

    <LabelEdit
      @toggleLabelEdit="userIsEditing = !userIsEditing"
      v-if="userIsEditing" />
    <LabelList
      @toggleLabelEdit="userIsEditing = !userIsEditing"
      v-if="!userIsEditing" />
  </section>
</template>

<script>
import LabelEdit from './LabelEdit.vue'
import LabelList from './LabelList.vue'
import { svgService } from '../../services/svg.service'

export default {
  name: 'LabelMenu',
  data() {
    return {
      userIsEditing: false,
    }
  },
  methods: {
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
  components: {
    LabelEdit,
    LabelList,
  },
}
</script>
