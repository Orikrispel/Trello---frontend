<template>
    <div class="board-display" :style="{ 'background': pickedImg }"></div>
    <div class="colors-container">
    </div>
</template>

<script>
export default {
    name: 'ImgPicker',
    data() {
        return {
            pickedImg: '#f2f2f2',
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
            this.$emit('setColor', color)
        },

    },
    emits: ['setColor']
}
</script>
