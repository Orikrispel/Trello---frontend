<template>
    <div class="board-preview">
        <h5>{{ board.title }}</h5>
        <button @click="onStarBoard(board)">⭐</button>
        <button @click="onRemoveBoard(board._id)">x</button>
    </div>
</template>

<script>

export default {
    name: 'BoardPreview',
    props: {
        board: {
            type: Object,
            require: true,
        }
    },
    data() {
        return {
            boards: null,
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
        }
    }
}
</script>
