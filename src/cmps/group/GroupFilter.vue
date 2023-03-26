<template>
  <section class="group-filter">
    <div class="group-filter-heading">
      <h3>Filter</h3>
      <button @click="$emit('closeFilterMenu')" class="btn btn-close">X</button>
    </div>
    <!-- <LabelPreview /> -->
    <MembersList />
  </section>
</template>

<script>
import LabelPreview from '../label/LabelPreview.vue'
import MembersList from '../members/MembersList.vue'
export default {
  name: 'GroupFilter',
  data() {
    return {}
  },

  components: {
    LabelPreview,
    MembersList,
  },
}
</script>
