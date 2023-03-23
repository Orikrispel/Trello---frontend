<template>
  <section class="group-wrapper" v-if="group">
    <div class="group-header flex">
      <h2 class="fs14" contenteditable="true">{{ group.title }}</h2>
    </div>
    <Container class="task-list" :get-child-payload="getGroupPayload(group.id)" @drop="(e) => onTaskDrop(group.id, e)"
      group-name="col-items" :shouldAcceptDrop="(e) => (e.groupName === 'col-items')">

      <Draggable class="task-container" v-for="task in group.tasks" :key="task.id">
        <RouterLink :to="`/task/${task.id}`">
          <span class="task-title fs14">
            {{ task.title }}
          </span>
        </RouterLink>
      </Draggable>

      <button v-show="!isAddTask" class="clean-btn" @click="toggleAddTask">+ add a card</button>
      <div v-show="isAddTask" class="add-task-container flex gap">
        <textarea class="task-container" name="add-task" cols="30" rows="5"
          placeholder="Enter a title for this card..."></textarea>
        <button class="btn" @click="">add card</button>
        <button class="btn clean-btn" @click="toggleAddTask">X</button>
      </div>
    </Container>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../services/util.service'


export default {
  name: 'GroupPreview',
  props: ['board', 'group'],
  components: { Container, Draggable },
  data() {
    return {
      isAddTask: false,
    }
  },
  methods: {
    onTaskDrop(groupId, dropResult) {
      console.log('hi')
      // check if element where ADDED or REMOVED in current group
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {

        const board = Object.assign({}, this.board)
        const group = board.groups.filter(g => g.id === groupId)[0]
        const taskIndex = board.groups.indexOf(group)
        const newGroup = Object.assign({}, group)

        // check if element was ADDED in current group
        if ((dropResult.removedIndex == null && dropResult.addedIndex >= 0)) {
          // your action / api call
          dropResult.payload.loading = true
          // simulate api call
          setTimeout(function () { dropResult.payload.loading = false }, (Math.random() * 5000) + 1000);
        }

        newGroup.tasks = applyDrag(newGroup.tasks, dropResult)
        board.groups.splice(taskIndex, 1, newGroup)
        this.$emit('updateBoard', board)
      }
    },
    getGroupPayload(groupId) {
      return index => {
        return this.board.groups.filter(g => g.id === groupId)[0].tasks[index]
      }
    },
    toggleAddTask() {
      this.isAddTask = !this.isAddTask
    }
  }
}
</script>
<style>
/** NB: dont remove, 
* When using orientation="horizontal" it auto sets "display: table"
* In this case we need flex and not display table  
*/
.smooth-dnd-container.horizontal {
  display: flex !important;
}
</style>