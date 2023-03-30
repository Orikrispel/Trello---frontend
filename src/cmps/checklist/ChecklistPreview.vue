<template>
    <section class="checklist-preview">
        <div class="checklist-header">
            <h3 class="checklist-heading"><span class="icon checklist-icon"></span>{{ checklist.title }}</h3>
            <button class="btn-task light" @click="this.$emit('removeChecklist')">Delete</button>
            <div class="progress-container flex align-center gap justify-center">
                <span>{{ progress }}%</span>
                <div class="progress2 progress-moved">
                    <div class="progress-bar"
                        :style="'width:' + progress + '%; background: ' + ((progress !== '100') ? '#5ba4cf' : '#61bd4f')">
                    </div>
                </div>
            </div>
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
    computed: {
        progress() {
            if (!this.checklist) return 0

            const todosCount = this.checklist.todos.length
            const doneTodos = this.checklist.todos.filter(todo => todo.isDone)
            const doneTodosCount = doneTodos.length
            if (!doneTodosCount) return 0
            return ((doneTodosCount / todosCount) * 100).toFixed(0)
        }
    },
    mounted() {
    },
}
</script>
