<template>
  <section class="group-wrapper" v-if="group">
    <h2>{{ group.id }}</h2>
    <Container :get-child-payload="getGroupPayload(group.id)" @drop="(e) => onTaskDrop(group.id, e)">
      <Draggable v-for=" task in group.tasks" :key="task.id">
        <div>
          {{ task.title }}
        </div>
      </Draggable>
    </Container>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg } from '../store/board.store'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag, generateItems } from '../services/util.service'


export default {
  name: 'GroupPreview',
  props: ['board', 'group'],
  components: { Container, Draggable },
  methods: {
    onTaskDrop(groupId, dropResult) {
      // check if element where ADDED or REMOVED in current collumn
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