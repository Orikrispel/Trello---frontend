<template>
    <div class="img-picker-container">
        <img :src="imgUrl.thumb" class="img-picker-item" v-for="(imgUrl, index) in imgUrls" :key="index"
            @click="setImg(imgUrls[index])" />
    </div>
</template>

<script>
import { unsplashService } from '../services/unsplash.service'
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
        this.imgUrls = await unsplashService.getImgs('paris', 4)
    },
    methods: {
        setImg(imgUrls) {
            this.selectedImgUrls = imgUrls
            console.log('JSON.stringify(imgUrls)', JSON.parse)
            this.$emit('onSetBoardImg',)
        },

    },
    emits: ['setColor', 'onSetBoardImg']
}
</script>
