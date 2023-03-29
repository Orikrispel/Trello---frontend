<template>
    <DynamicModal>
        <template v-slot:title>
            Attach from...
        </template>

        <template v-slot scope="props">
            <section ref="groupMenu" class="group-menu flex column">
                <label class="add-attachment-menu" scope="props">
                    <button class="btn btn-list clean-btn" @click="onImgUpload">Computer</button>
                    <input class="upload-img-input" type="file" @change="onImgUpload">
                </label>
                <form class="add-checklist-form">
                    <h4>Attach a link</h4>
                    <input type="text" placeholder="Paste any link here...">
                    <button class="btn attach-btn">Attach</button>
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

export default ({
    props: {
        task: {
            type: Object,
            require: true,
        }
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
                const newFile = { id: 'att' + utilService.makeId(), url: this.fileUrl }
                newTask.files.push(newFile)
                this.$emit('onUpdateTask', newTask)
                eventBus.emit('addAttachment', newFile)
                console.log('file added', newFile)
            }
        },
        // addChecklist() {
        //     this.checklistToAdd.id = 'cl' + utilService.makeId()
        //     let task = JSON.parse(JSON.stringify(this.actionData.task))
        //     if (!task.checklists) task.checklists = []
        //     task.checklists.push(this.checklistToAdd)
        //     this.checklistToAdd = checklistService.getEmptyChecklist()
        //     eventBus.emit('updateTask', task)
        //     this.$emit('setCreateModeOff')
        //     console.log('checklist added')
        // },
    },
    components: {
        DynamicModal,
    },

})
</script>
