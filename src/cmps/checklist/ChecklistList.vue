<template>
  <section class="checklist-list list-style-none">
    <ul class="list-style-none">
      <li
        v-for="checklist in task.checklists"
        :key="checklist.id"
        class="checklist-li">
        <ChecklistPreview
          :checklist="checklist"
          @updateTask="onUpdateTask"
          @removeChecklist="removeChecklist(checklist.id)" />
      </li>
    </ul>
  </section>
</template>

<script>
import ChecklistPreview from './ChecklistPreview.vue'
import { eventBus } from '../../services/event-bus.service'
import { de } from 'date-fns/locale'
export default {
  name: 'ChecklistList',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  components: {
    ChecklistPreview,
  },
  data() {
    return {
      currTask: null,
    }
  },
  created() {
    this.currTask = this.task
  },
  methods: {
    async removeChecklist(checklistId) {
      let task = JSON.parse(JSON.stringify(this.task))
      const idx = task.checklists.findIndex(
        (checklist) => checklist.id === checklistId
      )
      const checklist = task.checklists[idx]
      task.checklists.splice(idx, 1)

      let user = this.$store.getters.loggedinUser
      let activity = await this.$store.dispatch({
        type: 'returnActivity',
        data: {
          task: { title: this.task.title, taskId: this.taskId },
          type: 'removeChecklist',
          byMember: {
            fullname: user.fullname,
            _id: user._id,
          },
          checklist,
        },
      })
      const data = {
        task,
        activity,
      }
      eventBus.emit('updateTask', data)
    },
    onUpdateTask(checklistToAdd) {
      let task = JSON.parse(JSON.stringify(this.task))
      const idx = task.checklists.findIndex(
        (checklist) => checklist.id === checklistToAdd.id
      )
      task.checklists.splice(idx, 1, checklistToAdd)

      const data = {
        task,
      }
      eventBus.emit('updateTask', data)
    },
  },
}
</script>
