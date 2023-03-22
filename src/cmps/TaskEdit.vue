<template>
  <form @submit.prevent="saveTask">
    <textarea
      v-if="userIsEditing"
      v-model="task.title"
      @blur="userIsEditing = !userIsEditing"></textarea>
    <button type="submit">+ Add a card</button>
  </form>
</template>

<script>
export default {
  name: 'TadkEdit',
  data() {
    return {
      task: {},
      userIsEditing: false,
    }
  },
  created() {
    this.task = this.$store.getters.emptyTask
  },
  methods: {
    saveTask() {
      console.log(this.task)
    },
  },
}
</script>
