<template>
    <section class="checklist-preview">
        <h1>{{ checklist.title }}</h1>
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
    watch: {

    },
}
</script>
