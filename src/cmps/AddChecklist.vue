<template>
    <form @submit.prevent="addChecklist" class="board-add-form" v-if="isCreateMode">
        <div class="add-form-header">
            <h5 style="padding-right: 25px;">{{ actionData.title }}</h5>
            <p @click="closeModal">x</p>
        </div>
        <input type="text" style="margin-top: 25px;" v-model="checklistToAdd.title">
        <button class="btn add-checklist-btn">Add</button>
        <pre>{{ actionData.task }}</pre>
    </form>
</template>

<script>
import { checklistService } from '../services/checklist.service';
import { eventBus } from '../services/event-bus.service';

export default {
    name: 'AddChecklist',
    props: {
        actionData: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            checklistToAdd: checklistService.getEmptyChecklist(),
            isCreateMode: true,
        }
    },
    computed: {

    },
    methods: {
        async addChecklist() {
            console.log('this.checklistToAdd', this.checklistToAdd)
            if (!this.actionData.task.checklists) this.actionData.task.checklists = []
            console.log('this.actionData.task', this.actionData.task)
            this.checklistToAdd = checklistService.getEmptyChecklist()
            eventBus.emit('updateTask', task)
        }
    },
    created() {
        eventBus.on('updateTask', (task) => {
            this.saveTask(task)
        })
    },

    components: {
    }


}

</script>

