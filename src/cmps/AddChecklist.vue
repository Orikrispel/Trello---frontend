<template>
    <form @submit.prevent="addChecklist" class="add-checklist-form">
        <div>
            <input type="text" style="margin-top: 25px;" v-model="checklistToAdd.title">
            <button class="btn btn-blue" id="add-btn" style="color:white">Add</button>
        </div>
    </form>
</template>

<script>
import { checklistService } from '../services/checklist.service';
import { eventBus } from '../services/event-bus.service';
import { utilService } from '../services/util.service';
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
            task: null,
            checklistToAdd: checklistService.getEmptyChecklist(),
            isCreateMode: true,
        }
    },
    computed: {
    },
    methods: {
        async addChecklist() {
            this.checklistToAdd.id = 'cl' + utilService.makeId()
            let task = JSON.parse(JSON.stringify(this.actionData.task))
            if (!task.checklists) task.checklists = []
            task.checklists.push(this.checklistToAdd)
            this.checklistToAdd = checklistService.getEmptyChecklist()
            eventBus.emit('updateTask', task)
            this.$emit('setCreateModeOff')
        },
        closeModal() {
            this.$emit('setCreateModeOff')
        }
    },
    created() {
        this.task = this.actionData.task
    },
    components: {
    }
}
</script>