<template>
  <section class="label-menu">
    <span v-if="userIsEditing" @click="backFromEdit" class="icon btn-back" v-html="getSvg('arrowLeft')"></span>
    <LabelEdit @toggleLabelEdit="userIsEditing = !userIsEditing" v-if="userIsEditing" />
    <LabelList :taskLabels="taskLabels" @toggleLabelEdit="userIsEditing = !userIsEditing" v-if="!userIsEditing" />
  </section>
</template>

<script>
import LabelEdit from './LabelEdit.vue'
import LabelList from './LabelList.vue'
import { svgService } from '../../services/svg.service'

export default {
  name: 'LabelMenu',
  props: {
    taskLabels: {
      type: Object,
      required: true,
    }
  },
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
      this.userIsEditing = false
      await this.$store.dispatch({ type: 'setCurrLabel', labelId: null })
    },
  },
  watch: {
    userIsEditing: {
      async handler() {
        if (this.userIsEditing === false)
          await this.$store.dispatch({ type: 'setCurrLabel', labelId: null })
      },
    },
  },
  components: {
    LabelEdit,
    LabelList,
  },
}
</script>
