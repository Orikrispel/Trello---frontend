<template>
    <ul class="attachment-list">
        <li class="attachment-preview" v-for="file in task.files" :key="file.url">
            <section class="task-attachments-preview">
                <img class="attachment-img" :src="file.url">
                <div class="right-attachments-preview">
                    <h3>{{ file.name }}</h3>
                    <p>{{ file.createdAt }}</p>
                    <div class="attachment-links">
                        <a @click="removeAttachment(file.id)">Remove</a>
                        <VDropdown :distance="1">
                            <!-- This will be the popover reference (for the events and position) -->
                            <a>Edit</a>
                            <!-- This will be the content of the popover -->
                            <template #popper>
                                <DynamicModal>

                                    <template v-slot:title>
                                        Edit attachment
                                    </template>

                                    <template v-slot scope="props">
                                        <section class="group-menu flex column">
                                            <form class="add-checklist-form" @submit.prevent="updateFileName(file.id)">
                                                <h4>Link name</h4>
                                                <input type="text" :value="file.name" ref="linkNameInput">
                                                <button class="btn btn-blue" type="submit" id="add-btn"
                                                    style="color:white">Update</button>
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

    },
    methods: {
        removeAttachment(fileId) {
            const newTask = JSON.parse(JSON.stringify(this.task))
            const idx = newTask.files.findIndex(file => fileId === file.id)
            newTask.files.splice(idx, 1)
            this.$emit('onUpdateTask', newTask)
        },
        updateFileName(fileId) {
            const newName = this.$refs.linkNameInput[0].value
            const newTask = JSON.parse(JSON.stringify(this.task))
            const idx = newTask.files.findIndex(file => fileId === file.id)
            newTask.files[idx].name = newName
            this.$emit('onUpdateTask', newTask)
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
