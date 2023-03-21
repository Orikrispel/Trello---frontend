<template>
    <div class="board-preview">
        {{ board.title }}
    </div>
</template>

<script>

export default {
    name: 'BoardList',
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

    }
}
</script>
