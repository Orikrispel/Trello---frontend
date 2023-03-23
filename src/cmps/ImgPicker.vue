<template>
    <div class="colors-container">
        <img class="color-item" :src="imgs[0]">
        <img class="color-item" :src="imgs[1]">
        <img class="color-item" :src="imgs[2]">
        <img class="color-item" :src="imgs[3]">
    </div>
</template>

<script>
import { unsplashService } from '../services/unsplash.service'
export default {
    name: 'ImgPicker',
    data() {
        return {
            imgs: []
        }
    },
    computed: {

    },
    created() {
    },
    methods: {
        onStarBoard(board) {
            this.$emit('starBoard', board)
        },
        onRemoveBoard(boardId) {
            this.$emit('onRemoveBoard', boardId)
        },
        setColor(color) {
            this.pickedColor = color
            this.$emit('setColor', color)
        },

    },
    emits: ['setColor']
}
</script>
