<template>
    <section class="checklist-list list-style-none">
        <h2>Checklists</h2>
        <ul class="list-style-none">
            <li v-for="checklist in task.checklists" :key="checklist.id">
                <!-- <ChecklistPreview :checklist="checklist" /> -->
                <pre>{{ checklist }}</pre>
                <button class="btn" @click="removeChecklist(checklist.id)" style="margin-right: 20px;">Remove
                    Checklist</button>
            </li>
        </ul>
        <!-- <button class="btn" @click="addChecklist">Add Checklist</button> -->
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
            console.log('task', task)
            console.log('checklistId', checklistId)
            console.log('this.currTask', task.checklists)
            const idx = task.checklists.findIndex(checklist => checklist.id === checklistId)
            task.checklists.splice(idx, 1)
            eventBus.emit('updateTask', task)
        },
    },
    created() {
        this.currTask = this.task
    },
    mounted() {
    },
    watch: {

    },
}
</script>
