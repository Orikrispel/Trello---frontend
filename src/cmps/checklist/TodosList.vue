<template>
    <section class="todos-list">
        <ul class="todos-list list-style-none">
            <li v-for="todo in todos" :key="todo.id">
                <button @click="removeTodo(todo.id)">x</button>
                <TodosPreview :todo="todo" />
            </li>
            <button class="btn" @click="addTodo">Add</button>
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
        };
    },
    methods: {
        addTodo() {
            const newTodo = {
                id: 'td' + utilService.makeId(),
                title: 'new todo...',
                isDone: false
            }
            this.todos.push(newTodo)
            // this.$emit('updateTodos', this.todos)
        },
        removeTodo(todoId) {
            const idx = this.todos.findIndex(todo => todo.id === todoId)
            this.todos.splice(idx, 1)
            // this.$emit('updateTodos', this.todos)
        }
    },
    mounted() {
    },
    watch: {},
    components: { TodosPreview }
}
</script>
