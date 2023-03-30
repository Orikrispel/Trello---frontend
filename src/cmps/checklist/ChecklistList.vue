<template>
    <section class="checklist-list list-style-none">
        <div class="container flex align-center gap justify-center">
            <span>{{ progress }}%</span>
            <div class="progress2 progress-moved">
                <div class="progress-bar" :style="'width:' + progress + '%'"></div>
            </div>
        </div>
        <ul class="list-style-none">
            <li v-for="checklist in task.checklists" :key="checklist.id" class="checklist-li">
                <ChecklistPreview :checklist="checklist" @updateTask="onUpdateTask"
                    @removeChecklist="removeChecklist(checklist.id)" />
            </li>
        </ul>
    </section>
</template>

<script>
import ChecklistPreview from './ChecklistPreview.vue'
import { eventBus } from '../../services/event-bus.service'
import { de } from 'date-fns/locale'
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
    created() {
        this.currTask = this.task
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
    computed: {
        progress() {
            if (!this.currTask) return null
            let countDone = 0
            let countTodos = 0
            if (!this.task.checklists || this.task.checklists.length === 0) return null
            this.task.checklists.forEach((checklist) => {
                checklist.todos.forEach((todo) => {
                    if (todo.isDone) countDone++
                    countTodos++
                })
            })
            return ((countDone / countTodos) * 100).toFixed(0)
        }
    },
}
</script>