<template>
    <div class="colors-container">
        <div class="Img-item Img-item-1"></div>
        <div class="Img-item Img-item-2"></div>
        <div class="Img-item Img-item-3"></div>
        <div class="Img-item Img-item-4"></div>
    </div>
</template>

<script>
import { unsplashService } from '../services/unsplash.service'
export default {
    name: 'ImgPicker',
    data() {
        return {
            pickedImg: '',
        }
    },
    computed: {
        getImg() {
            return unsplashService.getImg()
        }
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
