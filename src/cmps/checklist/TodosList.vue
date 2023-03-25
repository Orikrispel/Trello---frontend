<template>
    <section class="todos-list">
        <ul class="todos-list">
            <li v-for="todo in todos" :key="todo.id">
                <TodosPreview :todo="todo" />
                <input type="text" @input="addTodo">
            </li>
        </ul>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service'
import TodosPreview from './TodosPreview.vue';
export default {
    name: "TodosList",
    props: {
        todos: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            todoToAdd: {
                id: '',
                title: '',
                createdAt: '',
            }
        };
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
        addTodo() {
            const newTodo = {
                id: 'td' + utilService.makeId(),
                title: 'new todo',
                isDone: false
            }
            todos.push(newTodo)
            // this.$emit('setTodos',todos)
        },
    },
    mounted() {
    },
    watch: {},
    components: { TodosPreview }
}
</script>
