<template>
    <div class="loader-container" v-if="isLoading">
        <div class="loader"></div>
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
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-top: 4px solid #333;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>