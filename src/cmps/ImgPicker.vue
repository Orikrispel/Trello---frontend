<template>
    <div class="img-picker-container">
        <div :style="{ 'background': 'url(' + imgUrl.thumb + ')', 'background-size': 'cover' }"
            v-for="(imgUrl, idx) in imgUrls" :key="idx" @click="setImg(imgUrls[idx])"
            :class="['img-picker-item', `img-picker-item-${idx + 1}`, { selected: imgUrls[idx] === selectedImgUrls }]"
            v-html="(imgUrls[idx] === selectedImgUrls ? getSvg('vPicked') : '')" />
    </div>
</template>

<script>
import { eventBus } from '../services/event-bus.service'
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
            eventBus.emit('setPickerOff',)
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
