<template>
  <ul v-if="task.files?.length" class="attachment-list">
    <h3><span class="icon attachments-icon"></span>Attacments</h3>
    <li class="attachment-preview" v-for="file in task.files" :key="file.url">
      <section class="task-attachments-preview">
        <img class="attachment-img" :src="file.url" />
        <div class="right-attachments-preview">
          <h3 class="fs14">{{ file.name }}</h3>
          <div class="attachment-links flex">
            <p class="attachment-data">{{ file.createdAt }}</p>
            • <a @click="removeAttachment(file.id)">Delete</a>•
            <VDropdown :distance="1">
              <!-- This will be the popover reference (for the events and position) -->
              <a>Edit</a>
              <!-- This will be the content of the popover -->
              <template #popper>
                <DynamicModal>
                  <template v-slot:title> Edit attachment </template>

                  <template v-slot scope="props">
                    <section class="group-menu flex column">
                      <form
                        class="add-checklist-form"
                        @submit.prevent="updateFileName(file.id)">
                        <h4>Link name</h4>
                        <input
                          type="text"
                          :value="file.name"
                          ref="linkNameInput" />
                        <button
                          class="btn btn-blue"
                          type="submit"
                          id="add-btn"
                          style="color: white">
                          Update
                        </button>
                      </form>
                    </section>
                  </template>
                </DynamicModal>
              </template>
            </VDropdown>
          </div>
        </div>
      </section>
    </li>
    <VDropdown :distance="6" :placement="'top'">
      <button class="btn-task light add-attachment">Add an attachment</button>

      <template #popper>
        <AddAttachment
          :task="task"
          @onUpdateTask="this.$emit('onUpdateTask', newTask)"
          @setImgCover="setImgCover" />
      </template>
    </VDropdown>
  </ul>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import AddAttachment from '../../cmps/attachment/AddAttachment.vue'
import DynamicModal from '../DynamicModal.vue'

export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      files: [],
      editName: '',
      isEditMode: false,
      currFile: null,
    }
  },
  created() {
    eventBus.on('addAttachment', (img) => {
      this.files.push(img)
      const newTask = JSON.parse(JSON.stringify(this.task))
      if (!newTask.files) newTask.files = []
      newTask.files.push(img)
      this.$emit('onUpdateTask', newTask)
    })
  },
  methods: {
    removeAttachment(fileId) {
      const newTask = JSON.parse(JSON.stringify(this.task))
      const idx = newTask.files.findIndex((file) => fileId === file.id)
      newTask.files.splice(idx, 1)
      this.$emit('onUpdateTask', newTask)
    },
    updateFileName(fileId) {
      const newName = this.$refs.linkNameInput[0].value
      const newTask = JSON.parse(JSON.stringify(this.task))
      const idx = newTask.files.findIndex((file) => fileId === file.id)
      newTask.files[idx].name = newName
      this.$emit('onUpdateTask', newTask)
    },
    setImgCover(img) {
      console.log('img 123', img)
    },
  },
  components: {
    DynamicModal,
    AddAttachment,
  },
}
</script>
