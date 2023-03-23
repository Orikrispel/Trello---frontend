<template>
    <form @submit.prevent="addBoard" class="board-add-form" v-if="isCreateMode">
        <div class="add-form-header">
            <h5>Create Board</h5>
            <p @click="setCreateMode">x</p>
        </div>
        <div class="board-display" :style="{ 'background-color': boardPickedColor }"></div>
        <label for="color-picker">Background</label>
        <ColorPicker :quantity="6" @setColor="setBoardBgColor" />
        <label for="board-title">Board title</label>
        <input name="board-title" type="text" v-model="boardToAdd.title" />
        <button>Create</button>
    </form>
</template>

<script>
import { boardService } from '../services/board.service.local';
import { eventBus } from '../services/event-bus.service';
import ColorPicker from './ColorPicker.vue';
export default {
    name: 'ActionModal',
    props: {
        info: {
        }
    },
    data() {
        return {
            boardToAdd: boardService.getEmptyBoard(),
            isCreateMode: false,
            boardPickedColor: 'white',
            boardPickedImg: ''
        }
    },
    computed: {

    },
    methods: {
        addBoard() {
            this.$emit('addBoard', this.boardToAdd)
        },
        setBoardBgColor(color) {
            this.boardPickedColor = color
            this.boardToAdd.style.backgroundColor = color
        },
        setCreateMode() {
            this.isCreateMode = !this.isCreateMode
        },
    },
    created() {
        eventBus.on('setCreateMode', (data) => {
            this.isCreateMode = data
        })
    },

    components: {
        ColorPicker,
    }


}

</script>

