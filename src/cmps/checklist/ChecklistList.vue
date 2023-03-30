<template>
    <section class="checklist-list list-style-none">
        <ul class="list-style-none">
            <li v-for="checklist in task.checklists" :key="checklist.id" class="checklist-li">
                <button class="btn" id="delete-cl-btn" @click="removeChecklist(checklist.id)"
                    style="float:right;">Delete</button>
                <ChecklistPreview :checklist="checklist" @updateTask="onUpdateTask" />
            </li>
        </ul>
    </section>
</template>

<script>
import ChecklistPreview from './ChecklistPreview.vue'
import { utilService } from '../../services/util.service'
import { eventBus } from '../../services/event-bus.service'
export default {
    name: 'ChecklistList',
    props: {
        task: {
            type: Object,
            required: true
        }
    },
    components: {
        ChecklistPreview
    },
    data() {
        return {
            currTask: null
        }
    },
    methods: {
        removeChecklist(checklistId) {
            let task = JSON.parse(JSON.stringify(this.task))
            const idx = task.checklists.findIndex(checklist => checklist.id === checklistId)
            task.checklists.splice(idx, 1)
            eventBus.emit('updateTask', task)
        },
        onUpdateTask(checklistToAdd) {
            let task = JSON.parse(JSON.stringify(this.task))
            const idx = task.checklists.findIndex(checklist => checklist.id === checklistToAdd.id)
            task.checklists.splice(idx, 1, checklistToAdd)
            eventBus.emit('updateTask', task)
        }
    },
    created() {
        this.currTask = this.task
    },
    mounted() {
    },
}
</script>