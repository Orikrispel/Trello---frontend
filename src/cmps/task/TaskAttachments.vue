<template>
  <section class="task-attachments">
    <p v-if="todosCount !== 0">{{ getChecklistStatus }}</p>
    <p v-if="members">{{ getMembers }}</p>
  </section>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
export default {
  name: 'TaskAttachments',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currTask: null,
      todosCount: 0,
      todosDone: 0,
      members: [],
    }
  },
  created() {
    eventBus.on('updateTask', (task) => {
      this.getCurrTask(task)
    })
  },
  methods: {
    getCurrTask(task) {
      this.currTask = task
    },
    setTodos() {
      if (!this.currTask) return
      let countDone = 0
      let countTodos = 0
      if (!this.task.checklists || this.task.checklists.length === 0) return
      this.task.checklists.forEach((checklist) => {
        checklist.todos.forEach((todo) => {
          if (todo.isDone) countDone++
          countTodos++
        })
      })
      this.todosCount = countTodos
      this.todosDone = countDone
    },
    setMembers() {
      if (!this.currTask) return
      const members = this.task.members.map((member) => member.fullname)
      this.members = members
    }
  },
  computed: {
    getChecklistStatus() {
      return `${this.todosDone}/${this.todosCount}`
    },
    getMembers() {
      return this.members.toString()
    },
  },
  watch: {
    task: {
      immediate: true,
      handler() {
        this.setTodos()
        this.setMembers()
      },
    },
  },
}

</script>
