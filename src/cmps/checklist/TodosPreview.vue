<template>
    <section class="todos-preview">
        <input type="text" v-model="todo.title">


    </section>
</template>

<script>
import { utilService } from '../../services/util.service'
export default {
    name: 'TodosPreview',
    props: {
        todo: {
            type: Object,
            required: true
        }
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
