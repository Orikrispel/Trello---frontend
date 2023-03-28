<template>
    <section class="right-imgs-container">
        <div class="right-search-container">
            <span v-html="getSvg('search')"></span>
            <input type="search" placeholder="Photos..." class="input" v-model="search" @blur="searchImgLater">
        </div>
        <div class="rightimg-picker-container">
            <div :style="{ 'background': 'url(' + imgUrl.thumb + ')', 'background-size': 'cover' }"
                v-for="(imgUrl, idx) in imgUrls" :key="idx" @click="setBgImg(imgUrl)" :class="['rightimg-picker-item']">
            </div>
        </div>
    </section>
</template>

<script>
import { unsplashService } from '../../services/unsplash.service'
import { svgService } from '../../services/svg.service'
import { utilService } from '../../services/util.service'
export default {
    name: 'RightMenuImgs',
    data() {
        return {
            imgUrls: [],
            selectedImgUrls: null,
            search: '',
        }
    },
    computed: {

    },
    async mounted() {
        this.imgUrls = await unsplashService.getImgs('israel', 14, true)
        this.searchImgLater = utilService.debounce(this.searchImg, 1000)
    },

    methods: {
        clearSelection() {
            this.selectedImgUrls = {}
            document.querySelectorAll('.img-picker-item.selected').forEach((el) => {
                el.classList.remove('selected')
            })
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        async searchImg() {
            this.imgUrls = await unsplashService.getImgs(this.search, 14, true)
        },
        setBgImg(imgUrl) {
            this.imgUrls = imgUrl
            console.log('this.imgUrl', this.imgUrl)
            this.$emit('setBgImg', this.imgUrls)
        }

    },
    created() {
    },
    emits: ['setColor', 'onSetBoardImg']
}
</script>
