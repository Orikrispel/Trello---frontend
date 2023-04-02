<template>
    <section class="right-imgs-container">
        <div class="right-search-container">
            <span v-html="getSvg('search')"></span>
            <input type="search" placeholder="Photos..." class="input" v-model="search" @input="searchImgLater">
        </div>
        <div class="rightimg-picker-container" v-show="!isLoad">
            <div :style="{ 'background': 'url(' + imgUrl.thumb + ')', 'background-size': 'cover' }"
                v-for="(imgUrl, idx) in imgUrls" :key="idx" @click="setBgImg(imgUrl)" :class="['rightimg-picker-item']">
            </div>
        </div>
        <Loader :isLoading="isLoading" />
    </section>
</template>

<script>
import { unsplashService } from '../../services/unsplash.service'
import { svgService } from '../../services/svg.service'
import { utilService } from '../../services/util.service'
import Loader from '../Loader.vue'
export default {
    name: 'RightMenuImgs',
    data() {
        return {
            imgUrls: [],
            selectedImgUrls: null,
            search: '',
            isLoading: false,
        }
    },
    computed: {

    },


    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        async searchImg() {
            this.isLoading = true
            this.imgUrls = await unsplashService.getImgs(this.search, 14, true)
                .finally(() => this.isLoading = false)
        },
        setBgImg(imgUrl) {
            console.log('this.imgUrl', imgUrl)
            this.$emit('setBgImg', imgUrl)
        }

    },
    async created() {
        try {
            this.isLoading = true
            this.imgUrls = await unsplashService.getImgs('israel', 14, true)
                .finally(this.isLoading = false)
            this.searchImgLater = utilService.debounce(this.searchImg, 500)
        }
        catch {
            console.log('error')
        }
    },
    emits: ['setColor', 'onSetBoardImg'],
    components: {
        Loader,
    }
}
</script>
