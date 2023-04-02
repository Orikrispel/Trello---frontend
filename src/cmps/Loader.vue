<template>
    <div class="loader-container" v-if="isLoading">
        <img class="loader" src="../assets/imgs/spinner.svg" />
    </div>
</template>

<script>
export default {
    name: 'Loader',
    props: {
        isLoading: {
            type: Boolean,
            default: false
        }
    }
}
</script>

<style>
.loader-container {
    margin-top: 50px;
    display: flex;
    margin: 100px 0px;
    justify-content: center;
    align-items: center;
    height: 100%;
}

.loader {
    width: 60px;
    height: 60px;
}
</style>