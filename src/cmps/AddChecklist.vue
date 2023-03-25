<template>
    <form @submit.prevent="addChecklist" class="board-add-form" v-if="isCreateMode">
        <div class="add-form-header">
            <h5 style="padding-right: 25px;">{{ actionData.title }}</h5>
            <p @click="closeModal">x</p>
        </div>
        <input type="text" style="margin-top: 25px;" v-model="checklistToAdd.title">
        <button class="btn add-checklist-btn">Add</button>
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
            if (!task.checklists) {
                task.checklists = []
                console.log('new checklist added')
            }
            console.log('this.checklistToAdd', this.checklistToAdd)
            task.checklists.push(this.checklistToAdd)
            console.log('task after', task)
            this.checklistToAdd = checklistService.getEmptyChecklist()
            eventBus.emit('updateTask', task)
        }

    },
    created() {
        console.log('this.actionData.task.id', this.actionData.task.id)
        this.task = this.actionData.task
    },

    components: {
    }


}

</script>

