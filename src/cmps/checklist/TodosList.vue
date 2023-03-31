<template>
    <section class="todos-list">
        <ul class="todos-list list-style-none">
            <li v-for="todo in todos" :key="todo.id">
                <button class="btn-sm btn-task light btn-delete-todo" @click="removeTodo(todo.id)"
                    style="float:right;"><span class="icon icon-close"></span></button>
                <TodosPreview :todo="todo" @updateTodos="onUpdateTodos" />
            </li>
            <input type="text" v-model="addTodoTitle" ref="todoInput" placeholder="Add an item" class="add-todo-input"
                v-if="isEditorOn === true">
            <div class="add-todo-btns">
                <button class="btn-task" @click="addTodo" :class="{ 'blue': isEditorOn, 'light': !isEditorOn }">
                    {{ isEditorOn ? 'Add' : 'Add an item' }}</button>
                <button class="btn-task light" @click="isEditorOn = false" v-if="isEditorOn">Cancel</button>
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
                this.$nextTick(() => this.$refs.todoInput.focus())
                return
            }
            const newTodos = JSON.parse(JSON.stringify(this.todos))
            const newTodo = {
                id: 'td' + utilService.makeId(),
                title: this.addTodoTitle,
                isDone: false
            }
            if (!newTodo.title) return
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
