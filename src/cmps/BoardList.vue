<template>
    <div>
        <h3>Starred Boards:</h3>
        <ul class="board-list">
            <li v-for="board in starredBoards" :key="board._id">
                <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
            </li>
        </ul>
        <h3>Boards:</h3>
        <ul class="board-list">
            <li v-for="board in boards" :key="board._id">
                <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
            </li>
        </ul>
    </div>
</template>

<script>
import BoardPreview from './BoardPreview.vue';
export default {
    name: 'BoardList',

    computed: {
        loggedInUser() {
        },
        starredBoards() {
            const boards = this.$store.getters.boards
            return boards.filter(board => board.isStarred)
        },
        boards() {
            const boards = this.$store.getters.boards
            return boards.filter(board => !board.isStarred)
        }
    },
    methods: {
        removeBoard(boardId) {
            this.$emit('removeBoard', boardId)
        },
        starBoard(boardId) {
            console.log('list', boardId)
            this.$emit('starBoard', boardId)
        }

    },
    created() {

    },

    components: {
        BoardPreview,
    }


}
</script>
