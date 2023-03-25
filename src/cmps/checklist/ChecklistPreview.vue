<template>
    <section class="checklist-preview">
        <h2>{{ checklist.title }}</h2>
        <TodosList :todos="checklist.todos" />
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
        // addChecklist() {
        //     const newChecklist = {
        //         id: utilService.makeId(),
        //         title: '',
        //         todos: []
        //     }
        //     this.checklists.push(newChecklist)
        //     this.todoTitle = ''
        // },
        // removeChecklist(idx) {
        //     this.checklists.splice(idx, 1)
        // },
        // addTodoToChecklist(checklist) {
        //     const newTodo = {
        //         id: 'cl' + utilService.makeId(),
        //         title: '',
        //         isDone: false
        //     }
        //     checklist.todos.push(newTodo)
        // },
        // removeTodoFromChecklist(checklist, todo) {
        //     const idx = checklist.todos.indexOf(todo)
        //     checklist.todos.splice(idx, 1)
        // }
    },
    mounted() {
    },
    watch: {

    },
}
</script>
