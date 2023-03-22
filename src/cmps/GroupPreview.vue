<template>
  <Container class="group-wrapper flex" group-name="cols" tag="div" orientation="horizontal" @drop="onGroupDrop($event)">
    <Draggable class="">
      <div class="flex column">

        <!-- header-->
        <div class="cursor-move rounded-t-lg p-4 space-x-4 bg-primary text-white flex space-x-2">
          <span class="text-lg">{{ group.title }}</span>
        </div>
        <!-- group -->
        <Container class="group-wrapper" orientation="vertical" group-name="col-tasks"
          :shouldAcceptDrop="(e, payload) => (e.groupName === 'col-tasks' && !payload.loading)"
          :get-child-payload="getCardPayload(group.id)" :drop-placeholder="{
            className: ``,
            animationDuration: '200',
            showOnTop: true
          }" drag-class="" drop-class="" @drop="(e) => onCardDrop(group.id, e)">

          <!-- Tasks -->
          <Draggable v-for="task in group.tasks" :key="task.id" :task="task">
            <div v-if="task.loading" class="flex">
              <span>Processing...</span>
            </div>
            <p>{{ task.title }}</p>
            <pre>{{ task }}</pre>
          </Draggable>
        </Container>
      </div>
    </Draggable>
  </Container>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import { getActionRemoveBoard, getActionUpdateBoard, getActionAddBoardMsg } from '../store/board.store'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag, generateItems } from '../services/util.service'


export default {
  props: ['group, board'],
  components: { Container, Draggable },
  data() {
    return {
    }
  },
  methods: {
    getGroupHeightPx() {
      let kanban = document.getElementById('kanbanContainer');
      return kanban ? kanban.offsetHeight - 122 : 0;
    },
    onGroupDrop(dropResult) {
      const scene = Object.assign({}, this.scene)
      scene.children = applyDrag(scene.children, dropResult)
      this.scene = scene
    },
    onCardDrop(groupId, dropResult) {

      // check if element where ADDED or REMOVED in current collumn
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {

        const scene = Object.assign({}, this.scene)
        const group = scene.children.filter(p => p.id === groupId)[0]
        const taskIndex = scene.children.indexOf(group)
        const newGroup = Object.assign({}, group)

        // check if element was ADDED in current group
        if ((dropResult.removedIndex == null && dropResult.addedIndex >= 0)) {
          // your action / api call
          dropResult.payload.loading = true
          // simulate api call
          setTimeout(function () { dropResult.payload.loading = false }, (Math.random() * 5000) + 1000);
        }

        newGroup.children = applyDrag(newGroup.children, dropResult)
        scene.children.splice(taskIndex, 1, newGroup)
        this.scene = scene
      }
    },
    getCardPayload(groupId) {
      return index => {
        return this.scene.children.filter(p => p.id === groupId)[0].children[index]
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