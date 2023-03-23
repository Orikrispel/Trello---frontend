<template></template>

<script>
export default {
    name: 'ActionModal',
    props: {
        info: {

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

    },
    created() {

    },

    components: {
    }


}

</script>

