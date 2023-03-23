<template>
  <LabelEdit v-if="userIsEditing" />
  <LabelList v-if="!userIsEditing" />
</template>

<script>
import LabelEdit from './LabelEdit.vue'
import LabelList from './LabelList.vue'

export default {
  name: 'LabelMenu',
  data() {
    return {
      userIsEditing: false,
    }
  },
  components: {
    LabelEdit,
    LabelList,
  },
}
</script>
