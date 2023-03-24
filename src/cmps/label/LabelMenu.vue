<template>
  <section class="label-menu">
    <section class="label-menu-header">
      <h3>{{ userIsEditing ? 'Create a label' : 'Labels' }}</h3>

      <span
        v-if="userIsEditing"
        @click="backFromEdit"
        class="icon btn-back"
        v-html="getSvg('arrowLeft')"></span>
      <span
        @click="$emit('closeLabelMenu')"
        class="icon btn-close"
        v-html="getSvg('close')"></span>
    </section>
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
    async backFromEdit() {
      this.userIsEditinguserIsEditing = false
      await this.$store.dispatch({ type: 'setCurrLabel', labelId: null })
      this.$emit('toggleLabelEdit')
    },
  },
  components: {
    LabelEdit,
    LabelList,
  },
}
</script>
