<template>
    <section class="todos-preview">
        <input type="checkbox" v-model="currTodo.isDone" @change="updateTodo">
        <input type="text" v-model="currTodo.title" @change="updateTodo" style="width: 100%;"
            :style="{ 'text-decoration': currTodo.isDone ? 'line-through' : 'none' }">
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
            currTodo: null,
        }
    },
    methods: {
        updateTodo() {
            this.$emit('updateTodos', this.currTodo)
        }
    },
    mounted() {
    },
    created() {
        this.currTodo = JSON.parse(JSON.stringify(this.todo))
    }
}
</script>
