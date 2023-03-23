<template>
    <component :is="info" />
</template>

<script>

export default {
    name: 'ActionModal',
    props: {
        info: {
            type: String,
        }
    },
    data() {
        return {

        }
    },
    computed: {

    },
    methods: {

    },
    created() {
        console.log('',)
    },

    components: {
    }


}

</script>

