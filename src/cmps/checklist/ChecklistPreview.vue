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

    },
    mounted() {
    },
    watch: {

    },
}
</script>
