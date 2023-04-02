<template>
  <DynamicModal>
    <template v-slot:title> Attach from... </template>

    <template v-slot scope="props">
      <section class="add-attachment flex column">
        <label class="add-attachment-menu" scope="props">
          <button class="btn btn-list clean-btn" @click="onImgUpload">
            Computer
          </button>
          <input
            class="upload-img-input"
            type="file"
            @change.prevent="onImgUpload" />
        </label>
        <hr />
        <form class="add-checklist-form">
          <h4>Attach a link</h4>
          <input type="text" placeholder="Paste any link here..." />
          <button class="btn attach-btn" @click.prevent="onImgUpload(event)">
            Attach
          </button>
        </form>
      </section>
    </template>
  </DynamicModal>
</template>

<script>
import { utilService } from '../../services/util.service'
import { eventBus } from '../../services/event-bus.service'
import { uploadService } from '../../services/upload.service'
import DynamicModal from '../DynamicModal.vue'

export default {
  props: {
    task: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      currFile: '',
      fileUrl: '',
    }
  },
  methods: {
    onImgUpload(event) {
      const newTask = JSON.parse(JSON.stringify(this.task))
      if (!newTask.files) newTask.files = []
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.fileUrl = reader.result
        const newFile = {
          id: 'att' + utilService.makeId(),
          url: this.fileUrl,
          name: file.name,
          createdAt: 'Added on' + utilService.formatDateString(Date.now()),
        }
        newTask.files.push(newFile)

        let activity = this.$store.getters.emptyActivity
        activity = { ...activity }
        let user = this.$store.getters.loggedinUser
        activity.txt = ` attached ${newFile.name} to ${newTask.title}`
        activity.task = { title: newTask.title, taskId: newTask.id }
        activity.type = 'attachment'
        activity.byMember = {
          fullname: user.fullname,
          _id: user._id,
        }
        const data = {
          task: newTask,
          activity,
        }

        this.$emit('onUpdateTask', data)
      }
    },
  },
  components: {
    DynamicModal,
  },
}
</script>
