<template>
    <section class="todos-list">
        <ul class="todos-list list-style-none">
            <li v-for="todo in todos" :key="todo.id">
                <button class="clean-btn btn-sm btn-task light" @click="removeTodo(todo.id)" style="float:right;"><span
                        class="icon icon-overflow-menu-horizontal"></span></button>
                <TodosPreview :todo="todo" @updateTodos="onUpdateTodos" />
            </li>
            <input type="text" v-model="addTodoTitle" class="add-todo-input" v-if="isEditorOn === true">
            <div class="add-todo-btns">
                <button class="btn-task light" @click="addTodo" :class="{ 'btn-blue': isEditorOn }">Add an item</button>
                <button class="btn-task blue" @click="isEditorOn = false" v-if="isEditorOn">Cancel</button>
            </div>
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
            addTodoTitle: '',
            isEditorOn: false,
        };
    },
    methods: {
        addTodo() {
            if (!this.isEditorOn) {
                this.isEditorOn = true
                return
            }
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            const newTodo = {
                id: 'td' + utilService.makeId(),
                title: this.addTodoTitle,
                isDone: false
            }
            this.addTodoTitle = ''
            newTodos.push(newTodo)
            this.$emit('updateChecklist', newTodos)
        },
        removeTodo(todoId) {
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            const idx = newTodos.findIndex(todo => todo.id === todoId)
            newTodos.splice(idx, 1)
            this.$emit('updateChecklist', newTodos)
        },
        onUpdateTodos(todo) {
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            const idx = newTodos.findIndex(td => todo.id === td.id)
            newTodos.splice(idx, 1, todo)
            this.$emit('updateChecklist', newTodos)
        }
    },
    mounted() {
    },
    components: { TodosPreview }
}
</script>
