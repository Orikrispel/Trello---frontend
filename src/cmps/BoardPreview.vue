<template>
    <div class="board-preview">
        <h5>{{ board.title }}</h5>
        <div class="board-preview-actions">
            <button @click.stop="onRemoveBoard(board._id)">Remove</button>
            <div class="star-svg" v-html="getSvg('star')" @click.stop="onStarBoard(board)"></div>
        </div>
    </div>
</template>

<script>
import { svgService } from '../services/svg.service'
export default {
    name: 'BoardPreview',
    props: {
        board: {
            type: Object,
            require: true,
        },

    },
    data() {
        return {
            isStarred: false,
        }
    },
    computed: {
    },
    created() {

    },
    methods: {
        onStarBoard(board) {
            this.isStarred = !this.isStarred;
            this.$emit('starBoard', board)
        },
        onRemoveBoard(boardId, event) {
            this.$emit('onRemoveBoard', boardId)
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
    }
}
</script>
