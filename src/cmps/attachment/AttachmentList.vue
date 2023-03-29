<template>
    <ul class="attachment-list">
        <li class="attachment-preview" v-for="file in task.files" :key="file.url">
            <h1>Attachment</h1>
            <img class="attachment-img" :src="file.url">
            <p style="float: right;" @click="removeAttachment(file.id)">x</p>
            <p style="float:right; margin:15px;" @click="editAttachment(file.id)">Edit</p>

        </li>
        <VDropdown :distance="6" v-if="isEditMode">
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
            editUrl: '',
            files: [],
            isEditMode: false,
        }
    },

    methods: {
        removeAttachment(fileId) {
            const newTask = JSON.parse(JSON.stringify(this.task))
            const idx = this.files.findIndex(file => fileId === file.id)
            newTask.files.splice(idx, 1)
            this.$emit('onUpdateTask', newTask)
        },
        editAttachment(fileId) {
            const newTask = JSON.parse(JSON.stringify(this.task))
            const idx = this.files.findIndex(file => fileId === file.id)
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
