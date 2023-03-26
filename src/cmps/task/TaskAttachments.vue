<template>
    <section class="task-attachments">
        <p> {{ getChecklistStatus }}</p>
        <p> {{ getMembers }}</p>
    </section>
</template>

<script>
import { eventBus } from '../../services/event-bus.service';
export default {
    name: 'TaskAttachments',
    props: {
        task: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            currTask: null,
        }
    },
    created() {
        eventBus.on('updateTask', (task) => {
            this.getCurrTask(task)
        })
    },
    methods: {
        getCurrTask(task) {
            this.task = task
        }
    },
    computed: {
        getChecklistStatus() {
            let count = 0;
            if (!this.task.checklists || this.task.checklists.length === 0) return
            this.task.checklists.forEach((checklist) => {
                if (checklist.todos.every((todo) => todo.isDone)) {
                    count++;
                }
            });
            return `${count}/${this.task.checklists.length}`;
        },
        getMembers() {
            if (!this.task.members) return
            const members = this.task.members.map(member => member.fullname)
            return `${members}`
        }
    }
}
</script>
