<template>
    <ul class="attachment-list">
        <li class="attachment-preview" v-for="file in task.files" :key="file.url">
            <h1>Attachment</h1>
            <img class="attachment-img" :src="file.url">
            {{ file.id }}
            <p style="float: right;" @click="removeAttachment(file.id)">x</p>
            <VDropdown :distance="1">
                <!-- This will be the popover reference (for the events and position) -->
                <p style="float:right; margin: 0px 5px;">Edit</p>

                <!-- This will be the content of the popover -->
                <template #popper>
                    <DynamicModal>

                        <template v-slot:title>
                            Edit attachment
                        </template>

                        <template v-slot scope="props">
                            <section class="group-menu flex column">
                                <form class="add-checklist-form" @submit.prevent="updateFileName($event)">
                                    <h4>Link name</h4>
                                    <input type="text" v-model="updatedFile">
                                    <button class="btn btn-blue" type="submit" id="add-btn"
                                        style="color:white">Update</button>
                                </form>
                            </section>
                        </template>

                    </DynamicModal>
                </template>
            </VDropdown>
        </li>

    </ul>
</template>

<script>
import { eventBus } from '../../services/event-bus.service'
import { uploadService } from '../../services/upload.service'
import { utilService } from '../../services/util.service'
import DynamicModal from '../DynamicModal.vue'

export default ({
    props: {
        task: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            files: [],
            editName: '',
            isEditMode: false,
            currFile: null,
        }
    },
    computed: {
        // setCurrFile() {
        //     this.currFile = JSON.parse(JSON.stringify(this.file))
        // }
    },
    methods: {
        removeAttachment(fileId) {
            const newTask = JSON.parse(JSON.stringify(this.task))
            const idx = newTask.files.findIndex(file => fileId === file.id)
            newTask.files.splice(idx, 1)
            this.$emit('onUpdateTask', newTask)
        },
        updateFileName(ev) {
            const newName = ev
            console.log('newName', newName)
            // console.log('fileId', fileId)
            // const newTask = JSON.parse(JSON.stringify(this.task))
            // console.log('newTask', newTask)
            // const idx = newTask.files.findIndex(file => fileId === file.id)
            // console.log('this.$refs.linkNameInput', this.$refs.linkNameInput.value)

            // this.$emit('onUpdateTask', newTask)
        }
    },
    components: {
        DynamicModal,
    },
    created() {
        eventBus.on('addAttachment', (img) => {
            this.files.push(img)
            const newTask = JSON.parse(JSON.stringify(this.task))
            if (!newTask.files) newTask.files = []
            newTask.files.push(img)
            this.$emit('onUpdateTask', newTask)
        })
    }
})
</script>
