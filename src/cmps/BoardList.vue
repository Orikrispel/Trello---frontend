<template>
    <div class="board-lists-container">
        <h3 v-if="starredBoards.length">Starred Boards:</h3>
        <ul class="board-list">
            <li v-for="board in starredBoards" :key="board._id"
                :style="{ 'background-color': board.style?.backgroundColor || '#014a75' }">
                <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
                <router-link :to="`/board/${board._id}`" class="board-link">Use This</router-link>
            </li>
        </ul>
        <h3>Boards:</h3>
        <ul class="board-list">
            <li class="new-board" @click="setCreateMode">
                <h5>Create new board</h5>
            </li>
            <li v-for="board in boards" :key="board._id"
                :style="{ 'background-color': board.style?.backgroundColor || '#014a75' }">
                <BoardPreview :board="board" @onRemoveBoard="removeBoard" @starBoard="starBoard" />
                <router-link :to="`/board/${board._id}`" class="board-link">Use This</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
import BoardPreview from './BoardPreview.vue';
export default {
    name: 'BoardList',
    data() {
        return {
        }
    },
    computed: {
        loggedInUser() {
        },
        starredBoards() {
            const boards = this.$store.getters.boards
            return boards.filter(board => board.isStarred)
        },
        boards() {
            return this.$store.getters.boards
        }
    },
    methods: {
        removeBoard(boardId) {
            this.$emit('removeBoard', boardId)
        },
        starBoard(board) {
            this.$emit('starBoard', board)
        },
        setCreateMode() {
            this.$emit('setCreateMode')
        }
    },
    created() {

    },

    components: {
        BoardPreview,
    }


}

//    <router-link :to="`/board/${board._id}`" class="board-link">
</script>

