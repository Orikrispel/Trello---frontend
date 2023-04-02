<template>
  <section v-if="task" class="task-attachments flex">

    <div class="flex align-center">
      <span v-show="task.description" class="icon description-icon"></span>

      <p v-if="this.task.date" :class="['dueDate flex fs12', { complete: isComplete }]"><span
          class="icon checklist-icon"></span>
        {{ dueDate }}
      </p>

      <!-- <pre class="fs12"> {{ task.date }}</pre> -->

      <p v-show="todosCount !== 0" :class="['checklist flex fs12', { complete: isComplete }]"><span
          class="icon checklist-icon"></span>
        {{ checklistStatus }}
      </p>

      <p v-show="filesCount !== 0" class="files fs12">
        <span class="icon attachments-icon"></span>
        {{ filesCount }}
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
      filesCount: 0,
      isComplete: false,
    }
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
      if (!this.task.members) return
      this.members = this.task.members
    },
    setMembers() {
      if (!this.task.files) return
      this.filesCount = this.task.files.length
    }
  },
  computed: {
    checklistStatus() {
      return `${this.todosDone}/${this.todosCount}`
    },

    dueDate() {
      if (!this.task.date.dueDate) return
      let date = new Date(this.task.date.dueDate);

      var day = date.getDate()
      var month = date.toLocaleString('default', { month: 'short' });
      console.log(`${month} ${day}`)
      return `${month} ${day}`

    }
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
