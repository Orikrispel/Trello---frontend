<template>
  <section class="task-attachments flex">

    <div class="flex align-center">
      <span class="icon description-icon"></span>
      <p :class="['fs12 checklist flex ', { complete: isComplete }]" v-if="todosCount !== 0"><span
          class="icon checklist-icon"></span>{{
            checklistStatus
          }}
      </p>

    </div>
    <ul class="clean-list flex">
      <li class="member-preview" v-for="member in task.members" :key="member._id">
        <div class="member-img">
          {{ member.imgUrl ? member.imgUrl : member.fullname.charAt(0).toUpperCase() }}
        </div>
      </li>
    </ul>
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
      todosCount: 0,
      todosDone: 0,
      members: [],
      isComplete: false,
    }
  },
  created() {
  },
  methods: {
    setTodos() {
      if (!this.task) return
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
      this.isComplete = (countDone === countTodos) ? true : false
    },
    setMembers() {
      if (!this.Task) return
      this.members = this.task.members
    }
  },
  computed: {
    checklistStatus() {
      return `${this.todosDone}/${this.todosCount}`
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
