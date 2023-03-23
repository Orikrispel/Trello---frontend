<template>
  <section class="group-wrapper flex column" v-if="group">
    <header class="group-header flex">
      <div
        v-if="!isEditGroupTitle"
        class="prevent-title-edit"
        @click="onFocusGroupTitle"></div>
      <h2
        class="group-title fs14"
        ref="groupTitle"
        @blur="updateGroupTitle"
        contenteditable="true">
        {{ group.title }}
      </h2>
      <button>∙∙∙</button>
    </header>

    <main class="tasks-wrapper">
      <Container
        class="task-list"
        :get-child-payload="getGroupPayload(group.id)"
        @drop="(e) => onTaskDrop(group.id, e)"
        group-name="col-items"
        :shouldAcceptDrop="(e) => e.groupName === 'col-items'"
        drag-class="card-ghost"
        drop-class="card-ghost-drop"
        :drop-placeholder="dropPlaceholderOptions">
        <Draggable
          class="task-container"
          @click="$router.push(`${this.board._id}/task/${task.id}`)"
          v-for="task in group.tasks"
          :key="task.id">
          <span class="task-title fs14">{{ task.title }}</span>
        </Draggable>
      </Container>

      <button v-show="!isAddTask" class="btn clean-btn" @click="toggleAddTask">
        + add a card
      </button>
      <div v-show="isAddTask" class="new-task-container flex">
        <textarea
          class="task-container"
          ref="newTask"
          name="add-task"
          cols="30"
          rows="3"
          placeholder="Enter a title for this card..."></textarea>
        <button class="btn btn-blue" @click="onAddTask">Add card</button>
        <button class="btn clean-btn" @click="toggleAddTask">
          <i v-html="getSvg('close')"></i>
        </button>
      </div>
    </main>
  </section>
  <div
    v-if="showTaskDetails"
    @click="$router.push(`/board/${this.board._id}`)"
    class="modal-overlay"></div>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/util.service'
import { utilService } from '../../services/util.service'
import { svgService } from '../../services/svg.service'

export default {
  name: 'GroupPreview',
  props: ['board', 'group'],
  components: { Container, Draggable },
  data() {
    return {
      isAddTask: false,
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
        isEditGroupTitle: false,
      },
      showTaskDetails: false,
    }
  },
  methods: {
    onTaskDrop(groupId, dropResult) {
      // check if element where ADDED or REMOVED in current group
      if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        const board = Object.assign({}, this.board)
        const group = board.groups.filter((g) => g.id === groupId)[0]
        const groupIndex = board.groups.indexOf(group)
        const newGroup = Object.assign({}, group)

        // check if element was ADDED in current group
        if (dropResult.removedIndex == null && dropResult.addedIndex >= 0) {
          dropResult.payload.loading = true
          setTimeout(function () {
            dropResult.payload.loading = false
          }, Math.random() * 5000 + 1000)
        }

        newGroup.tasks = applyDrag(newGroup.tasks, dropResult)
        board.groups.splice(groupIndex, 1, newGroup)
        this.$emit('updateBoard', board)
      }
    },
    getGroupPayload(groupId) {
      return (index) => {
        return this.board.groups.filter((g) => g.id === groupId)[0].tasks[index]
      }
    },
    toggleAddTask() {
      this.isAddTask = !this.isAddTask
      if (this.isAddTask) this.$nextTick(() => this.$refs.newTask.focus())
    },
    onAddTask() {
      let board = utilService.makeCopy(this.board)
      let group = utilService.makeCopy(this.group)
      const idx = board.groups.findIndex((g) => g.id === group.id)

      let newTask = this.$store.getters.emptyTask
      newTask.title = this.$refs.newTask.value

      group.tasks.push(newTask)
      board.groups.splice(idx, 1, group)

      this.$emit('updateBoard', board)
      this.$refs.newTask.value = ''
    },
    updateGroupTitle() {
      let board = { ...this.board }
      let group = { ...this.group }
      const idx = board.groups.findIndex((g) => g.id === group.id)
      group.title = this.$refs.groupTitle.innerText
      board.groups.splice(idx, 1, group)
      console.log('title tried to be changed')
      this.$emit('updateBoard', board)
      this.isEditGroupTitle = !this.isEditGroupTitle
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
    onFocusGroupTitle() {
      this.$refs.groupTitle.focus()
      this.isEditGroupTitle = !this.isEditGroupTitle
    },
  },
  mounted() {
    this.showTaskDetails = false
  },
  watch: {
    '$route.params': {
      handler() {
        this.showTaskDetails = !this.showTaskDetails
      },
      immediate: true,
    },
  },
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
