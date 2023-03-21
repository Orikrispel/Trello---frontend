<template>
    <div class="board-preview">
        <h5>{{ board.title }}</h5>
        <button @click="onStarBoard(board._id)">⭐</button>
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
        onStarBoard(boardId) {
            console.log('preview', boardId)
            this.$emit('starBoard', boardId)
        },
        onRemoveBoard(boardId) {
            console.log('hello')
            this.$emit('onRemoveBoard', boardId)
        }
    }
}
</script>
