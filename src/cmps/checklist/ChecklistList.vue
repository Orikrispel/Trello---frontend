<template>
    <section class="checklist-list list-style-none">
        <h2>Checklists</h2>
        <ul class="list-style-none">
            <li v-for="checklist in checklists" :key="checklist.id">
                <ChecklistPreview :checklist="checklist" />
                <button class="btn" @click="removeChecklist(checklist.id)" style="margin-right: 20px;">Remove
                    Checklist</button>
            </li>
        </ul>
        <button class="btn" @click="addChecklist">Add Checklist</button>
    </section>
</template>

<script>
import ChecklistPreview from './ChecklistPreview.vue'
import { utilService } from '../../services/util.service'
export default {
    name: 'ChecklistList',
    props: {
        checklists: {
            type: Array,
            required: true
        }
    },
    components: {
        ChecklistPreview
    },
    data() {

    },
    methods: {
        addChecklist() {
            const newChecklist = {
                id: utilService.makeId(),
                title: 'Checklist',
                todos: []
            }
            this.checklists.push(newChecklist)
            this.todoTitle = ''
            // save to local storage
        },
        removeChecklist(checklistId) {
            this.checklists.splice(checklistId, 1)
            // save to local storage
        },
    },
    mounted() {
    },
    watch: {

    },
}
</script>
