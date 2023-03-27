<template>
    <form @submit.prevent="addBoard" class="board-add-form">
        <div class="add-form-header">
            <h5>Create Board</h5>
            <span class="icon btn-close icon-close" @click="closeModal"></span>
        </div>
        <div class="board-display" :style="{
            backgroundImage: 'url(' + pickedImg + ')', background: pickedColor,
            backgroundSize: 'cover'
        }">
        </div>
        <label for="color-picker">Background</label>
        <ImgPicker @onSetBoardImg="setBoardImg" />
        <ColorPicker :quantity="6" @setColor="setBoardBgColor" />
        <label for="board-title">Board title</label>
        <input name="board-title" type="text" v-model="boardToAdd.title" />
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
        info: {
        }
    },
    data() {
        return {
            boardToAdd: boardService.getEmptyBoard(),
            pickedColor: 'white',
            pickedImg: {},
        }
    },
    computed: {

    },
    methods: {
        addBoard() {
            if (!this.boardToAdd.title) return
            this.$emit('addBoard', this.boardToAdd)
            this.$emit('closeModal', false)
        },
        setBoardBgColor(color) {
            this.pickedImg = {}
            this.pickedColor = color
            this.boardToAdd.style.imgUrls = {}
            this.boardToAdd.style.backgroundColor = color
        },
        closeModal() {
            this.$emit('closeModal', false)
        },
        setBoardImg(imgUrls) {
            this.pickedColor = 'null'
            this.pickedImg = imgUrls.thumb
            this.boardToAdd.style.imgUrls = imgUrls
        }
    },
    created() {
        // eventBus.on('setCreateMode', (data) => {
        //     this.isCreateMode = data
        // })
    },

    components: {
        ColorPicker,
        ImgPicker,
    }


}

ImgPicker
</script>

