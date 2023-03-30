<template>
    <section class="checklist-preview">
        <div class="checklist-header">
            <h3 class="checklist-heading"><span class="icon checklist-icon"></span>{{ checklist.title }}</h3>
            <button @click="this.$emit('removeChecklist')">Delete</button>
        </div>
        <TodosList :todos="checklist.todos" @updateChecklist="onUpdateChecklist" />
    </section>
</template>

<script>
import { utilService } from '../../services/util.service'
import TodosList from './TodosList.vue';
export default {
    name: 'ChecklistPreview',
    props: {
        checklist: {
            type: Object,
            required: true
        }
    },
    components: {
        TodosList,
    },
    data() {
        return {

        }
    },
    methods: {
        onUpdateChecklist(todos) {
            const currCheckList = JSON.parse(JSON.stringify(this.checklist))
            currCheckList.todos = [...todos]
            this.$emit('updateTask', currCheckList)
        },
    },
    mounted() {
    },
}
</script>
