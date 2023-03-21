<template>
    <div>
        <ul class="board-list">
            <li v-for="board in boards" :key="board._id">
                <BoardPreview :board="board" />
                <button @click="removeBoard(board._id)">x</button>
            </li>
        </ul>
    </div>
</template>

<script>
import BoardPreview from './BoardPreview.vue';
export default {
    name: 'BoardList',
    data() {
    },
    computed: {
        loggedInUser() {
        },
        boards() {
            return this.$store.getters.boards
        }
    },
    methods: {
        removeBoard(boardId) {
            console.log('hello')
            this.$emit('removeBoard', boardId)
        }

    },
    created() {

    },

    components: {
        BoardPreview
    }


}
</script>
