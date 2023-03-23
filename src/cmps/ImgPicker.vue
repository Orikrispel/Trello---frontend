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
        console.log('this.imgUrls', this.imgUrls)
    },
    methods: {
        onStarBoard(board) {
            this.$emit('starBoard', board)
        },
        onRemoveBoard(boardId) {
            this.$emit('onRemoveBoard', boardId)
        },
        setColor(color) {
            this.pickedColor = color
            this.$emit('setColor', color)
        },
        setImg(imgUrls) {
            this.selectedImgUrls = imgUrls
            this.$emit('setBoardImg', imgUrls)
        },

    },
    emits: ['setColor']
}
</script>
