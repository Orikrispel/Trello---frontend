<template>
    <form @submit.prevent="addBoard" class="board-add-form" v-if="isCreateMode">
        <div class="add-form-header">
            <h5>{{ actionData.title }}</h5>
            <p @click="setCreateMode">x</p>
        </div>
        <div class="board-display" v-if="isBoardDisplay" :style="{
            backgroundImage: 'url(' + pickedImg + ')', background: pickedColor,
            backgroundSize: 'cover'
        }">
        </div>
        <input name="board-title" type="text" />
        <button type="submit">Create</button>
    </form>
</template>

<script>
import { boardService } from '../services/board.service.local';
import { eventBus } from '../services/event-bus.service';
import ColorPicker from './ColorPicker.vue';
import ImgPicker from './ImgPicker.vue';

export default {
    name: 'AddBoard',
    props: {
        actionData: {
            type: Object,
            required: true,
        }
    },
    data() {
        return {
            boardToAdd: boardService.getEmptyBoard(),
            isCreateMode: true,
            pickedColor: 'white',
            pickedImg: {},
        }
    },
    computed: {

    },
    methods: {
        addBoard() {
            this.$emit('addBoard', this.boardToAdd)
            this.isCreateMode = false
        },
        setBoardBgColor(color) {
            this.pickedImg = {}
            this.pickedColor = color
            this.boardToAdd.style.imgUrls = {}
            this.boardToAdd.style.backgroundColor = color
        },
        setCreateMode() {
            this.isCreateMode = !this.isCreateMode
        },
        setBoardImg(imgUrls) {
            this.pickedColor = 'null'
            this.pickedImg = imgUrls.thumb
            this.boardToAdd.style.imgUrls = imgUrls
        }
    },
    created() {
        eventBus.on('setCreateMode', (data) => {
            this.isCreateMode = data
        })
    },

    components: {
        ColorPicker,
        ImgPicker,
    }


}

ImgPicker
</script>

