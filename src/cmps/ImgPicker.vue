<template>
    <div class="img-picker-container">
        <img :src="imgUrl.thumb" class="img-picker-item" v-for="(imgUrl, index) in imgUrls" :key="index"
            @click="setImg(imgUrls[index])" />
    </div>
</template>

<script>
import { unsplashService } from '../services/unsplash.service'
import { svgService } from '../services/svg.service'
export default {
    name: 'ImgPicker',
    data() {
        return {
            imgUrls: [],
            selectedImgUrls: null,
        }
    },
    computed: {

    },
    async mounted() {
        this.imgUrls = await unsplashService.getImgs('japan', 4)
    },

    methods: {
        setImg(imgUrls) {
            this.selectedImgUrls = imgUrls
            this.$emit('onSetBoardImg', imgUrls)
        },

    },
    emits: ['setColor', 'onSetBoardImg']
}
</script>
