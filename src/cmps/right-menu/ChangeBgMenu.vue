<template>
    <section class="change-bg-menu">

        <section class="bg-option">
            <img src="../../assets/imgs/photos-right-menu.png" class="change-bg-item" @click="changeCmp('RightMenuImgs')">
            <p>Photos</p>
        </section>
        <section class="bg-option">
            <img src="../../assets/imgs/colors-right-menu.png" class="change-bg-item" @click="changeCmp('RightMenuColors')">
            <p>Colors</p>
        </section>
    </section>
</template>

<script>
export default {
    name: 'ChangeBgMenu',
    props: {
    },
    data() {
        return {
        }
    },
    created() {

    },
    methods: {
        changeCmp(data) {
            this.$emit('changeCmp', data)
        }
    },
    computed: {
    },
}
</script>
