<template>
    <section class="todos-list">
        <ul class="todos-list list-style-none">
            <li v-for="todo in todos" :key="todo.id">
                <button @click="removeTodo(todo.id)">x</button>
                <TodosPreview :todo="todo" />
            </li>
            <button class="btn" @click="addTodo">Add To Do</button>
        </ul>
    </section>
</template>

<script>
import { eventBus } from '../../services/event-bus.service';
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
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            console.log('newTodos', newTodos)
            const newTodo = {
                id: 'td' + utilService.makeId(),
                title: 'new todo...',
                isDone: false
            }
            newTodos.push(newTodo)
            this.$emit('updateChecklist', newTodos)
        },
        removeTodo(todoId) {
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            const idx = newTodos.findIndex(todo => todo.id === todoId)
            newTodos.splice(idx, 1)
            this.$emit('updateChecklist', newTodos)
        }
    },
    mounted() {
    },
    watch: {},
    components: { TodosPreview }
}
</script>
