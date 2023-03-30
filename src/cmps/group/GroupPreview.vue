<template>
  <section class="group-wrapper flex column" v-if="group">
    <header class="group-header flex">
      <div v-show="!isEditGroupTitle" class="prevent-title-edit" @click="onFocusGroupTitle"></div>
      <h2 class="group-title fs14" ref="groupTitle" @blur="updateGroupTitle" contenteditable="true">
        {{ group.title }}
      </h2>

      <VDropdown :distance="6">
        <!-- This will be the popover reference (for the events and position) -->
        <button class="clean-btn btn-menu"><span class="icon icon-overflow-menu-horizontal"></span></button>

        <!-- This will be the content of the popover -->
        <template #popper>
          <DynamicModal>

            <template v-slot:title>
              List actions
            </template>

            <template v-slot scope="props">
              <section ref="groupMenu" class="group-menu flex column">
                <div class="group-menu-content" scope="props">
                  <button class="btn btn-list clean-btn" @click="toggleAddTask">Add card...</button>
                  <button class="btn btn-list clean-btn" @click="duplicateGroup">Copy list...</button>
                  <hr />
                  <button class="btn btn-list clean-btn" @click="removeGroup">Archive this list</button>
                </div>
              </section>
            </template>
          </DynamicModal>
        </template>
      </VDropdown>
    </header>

    <main class="tasks-wrapper">
      <Container class="task-list" :get-child-payload="getGroupPayload(group.id)" @drop="(e) => onTaskDrop(group.id, e)"
        group-name="col-items" :shouldAcceptDrop="(e) => e.groupName === 'col-items'">
        <Draggable class="task-container" v-for="task in group.tasks" :key="task.id"
          :style="{ backgroundColor: (task.cover?.type === 'full') ? task.cover?.color : '' }">
          <TaskPreview :task="task" @click.stop="openTaskDetails(task.id)" />
        </Draggable>
      </Container>
      <div v-show="isAddTask" class="new-task-container flex">
        <textarea class="task-container" ref="taskTitle" name="add-task" cols="30" rows="3"
          placeholder="Enter a title for this card..."></textarea>
        <button class="btn btn-blue" @click="onAddTask">Add card</button>
        <button class="btn clean-btn" @click="toggleAddTask">
          <i v-html="getSvg('close')"></i>
        </button>
      </div>
    </main>

    <button v-show="!isAddTask" class="btn clean-btn btn-add-task" @click="toggleAddTask">
      <span class="icon icon-add"></span> Add a card
    </button>


  </section>
</template>

<script>
import { Container, Draggable } from 'vue3-smooth-dnd'
import { applyDrag } from '../../services/util.service'
import { utilService } from '../../services/util.service'
import { svgService } from '../../services/svg.service'
import TaskPreview from '../task/TaskPreview.vue'
import DynamicModal from '../DynamicModal.vue'

export default {
  name: 'GroupPreview',
  emits: ['updateBoard'],
  props: ['board', 'group'],
  components: { Container, Draggable, TaskPreview, DynamicModal },
  data() {
    return {
      isAddTask: false,
      isEditGroupTitle: false,
      dropPlaceholderOptions: {
        className: 'drop-preview',
        animationDuration: '150',
        showOnTop: true,
      },
      showGroupMenu: false,
    }
  },
  mounted() {
    document.addEventListener('click', this.clickedOutGroupMenu)
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
      if (this.showGroupMenu) this.showGroupMenu = false
      this.isAddTask = !this.isAddTask
      if (this.isAddTask) this.$nextTick(() => this.$refs.taskTitle.focus())
    },
    onAddTask() {
      let newTask = this.$store.getters.emptyTask
      newTask.title = this.$refs.taskTitle.value
      newTask.id = this.$store.getters.makeId
      console.log(newTask)
      if (!newTask.title) {
        this.$refs.taskTitle.focus()
        return
      }

      let board = JSON.parse(JSON.stringify(this.board))
      let group = JSON.parse(JSON.stringify(this.group))
      const idx = board.groups.findIndex((g) => g.id === group.id)

      group.tasks.push(newTask)
      board.groups.splice(idx, 1, group)

      this.$emit('updateBoard', board)
      this.$refs.taskTitle.value = ''
    },
    removeGroup() {
      let board = { ...this.board }
      const idx = board.groups.findIndex((g) => g.id === this.group.id)
      board.groups.splice(idx, 1)
      this.$emit('updateBoard', board)
    },
    duplicateGroup() {
      let board = { ...this.board }
      const idx = board.groups.findIndex((g) => g.id === this.group.id)
      if (!idx) return
      let groupToAdd = JSON.parse(JSON.stringify(this.group))
      groupToAdd.id = utilService.makeId()
      groupToAdd.tasks.forEach((task) => (task.id = utilService.makeId()))
      board.groups.splice(idx, 0, groupToAdd)
      this.$emit('updateBoard', board)
    },
    updateGroupTitle() {
      let board = { ...this.board }
      let group = { ...this.group }
      const idx = board.groups.findIndex((g) => g.id === group.id)
      group.title = this.$refs.groupTitle.innerText
      if (!group.title) return
      board.groups.splice(idx, 1, group)
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
    openTaskDetails(taskId) {
      console.log('hi')
      this.$router.push(`/board/${this.board._id}/task/${taskId}`)
    },
    toggleGroupMenu() {
      this.showGroupMenu = !this.showGroupMenu
    },
    clickedOutGroupMenu(event) {
      if (!this.showGroupMenu || !this.$refs.groupMenu) return
      if (!this.$refs.groupMenu.contains(event.target)) {
        this.toggleGroupMenu()
      }
    },
  },
  beforeDestroy() {
    document.removeEventListener('click', this.clickedOutGroupMenu)
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
