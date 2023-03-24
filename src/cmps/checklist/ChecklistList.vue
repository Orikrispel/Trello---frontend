<template>
    <section class="checklist-list list-style-none">
        <h2>Checklists</h2>
        <ul class="list-style-none">
            <li v-for="(checklist, idx) in checklists" :key="checklist.id">
                <h3>{{ checklist.title }}</h3>
                <ul class="list-style-none">
                    <li v-for="todo in checklist.todos" :key="todo.id">
                        <input type="checkbox" v-model="todo.isDone">
                        <input type="text" v-model="todo.title" placeholder="Add item..."
                            :style="{ 'text-decoration': todo.isDone ? 'line-through' : 'none' }">
                        <button class="btn" @click="removeTodoFromChecklist(checklist, todo)">Remove Todo</button>
                    </li>
                </ul>
                <button class="btn checklist-btn" @click="addTodoToChecklist(checklist)">Add Todo</button>
                <button class="btn checklist-btn" @click="removeChecklist(idx)">Remove Checklist</button>
            </li>
        </ul>
        <button class="btn" @click="addChecklist">Add Checklist</button>
    </section>
</template>

<script>
import { utilService } from '../../services/util.service'
export default {
    name: 'ChecklistList',
    props: {
        checklists: {
            type: Array,
            required: true
        }
    },
    data() {
        return {

        }
    },
    methods: {
        addChecklist() {
            const newChecklist = {
                id: utilService.makeId(),
                title: this.todoTitle,
                todos: []
            }
            this.checklists.push(newChecklist)
            this.todoTitle = ''
        },
        removeChecklist(idx) {
            this.checklists.splice(idx, 1)
        },
        addTodoToChecklist(checklist) {
            const newTodo = {
                id: 'cl' + utilService.makeId(),
                title: '',
                isDone: false
            }
            checklist.todos.push(newTodo)
        },
        removeTodoFromChecklist(checklist, todo) {
            const idx = checklist.todos.indexOf(todo)
            checklist.todos.splice(idx, 1)
        }
    },
    mounted() {
    },
    watch: {

    },
}
</script>
