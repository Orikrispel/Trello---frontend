<template>
    <div class="img-picker-container">
        <img :src="imgUrl.thumb" v-for="(imgUrl, idx) in imgUrls" :key="idx" @click="setImg(imgUrls[idx])"
            :class="['img-picker-item', `img-picker-item-${idx + 1}`, { selected: imgUrls[idx] === selectedImgUrls }]"
            v-html="(imgUrls[idx] === selectedImgUrls ? getSvg('vPicked') : '')" />
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
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },

    },
    emits: ['setColor', 'onSetBoardImg']
}
</script>
