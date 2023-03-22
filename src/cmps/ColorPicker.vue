<template>
    <div class="board-display" :style="{ 'background-color': pickedColor }"></div>
    <div class="colors-container">
        <div class="color-item" style="background-color: #7bc86c;" @click="setColor('#7bc86c')"></div>
        <div class="color-item" style="background-color: #f5dd29;" @click="setColor('#f5dd29')"></div>
        <div class="color-item" style="background-color: #014a75;" @click="setColor('#014a75')"></div>
        <div class="color-item" style="background-color: #ff8ed4;" @click="setColor('#ff8ed4')"></div>
        <!-- <div class="color-item" style="background-color: #333;" @click="setColor('#333')"></div> -->
    </div>
</template>

<script>
export default {
    name: 'ColorPicker',
    data() {
        return {
            pickedColor: '#f2f2f2',
        }
    },
    computed: {
        loggedInUser() {

        },
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
            this.$emit('setBgColor', color)
        }
    },
    emits: ['setColor']
}
</script>
