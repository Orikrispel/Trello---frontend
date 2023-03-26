<template>
    <section class="task-attachments">
        <p> {{ getChecklistStatus }}</p>
        <p> {{ getMembers }}</p>
    </section>
</template>

<script>
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
            currTask: {},
        }
    },
    created() {
        this.currTask = this.task
    },
    methods: {

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
            console.log('this.task.members', this.task.members)
            const members = this.task.members.map(member => member.fullname)
            console.log('members', members)
            return `${members}`
        }
    }
}
</script>
