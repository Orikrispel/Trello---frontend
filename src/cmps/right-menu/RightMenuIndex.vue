<template>
    <section class="right-menu" :class="{ 'show': isMenuOpen }">
        <div class="add-form-header right-menu-header">
            <span class="icon btn-back" v-html="getSvg('arrowLeft')" @click=setCmp
                v-if="currCmp !== 'RightMenuMain'"></span>
            <h5 id="right-menu-h5">{{ getCurrTitle }}</h5>
            <span class="icon btn-close icon-close" @click.stop="closeMenu"></span>
        </div>
        <component :is="currCmp" @changeCmp="changeCmp" @setBgColor="setBgColor" />
    </section>
</template>

<script>
import ChangeBgMenu from './ChangeBgMenu.vue';
import RightMenuMain from './RightMenuMain.vue';
import RightMenuColors from './RightMenuColors.vue';
import { eventBus } from '../../services/event-bus.service';
import { svgService } from '../../services/svg.service';
export default {
    name: 'r',
    data() {
        return {
            currCmp: 'RightMenuMain',
            isMenuOpen: false,
        }
    },
    computed: {
        getCurrTitle() {
            switch (this.currCmp) {
                case 'RightMenuColors':
                    return 'Colors'
                case 'RightMenuMain':
                    return 'Menu'
                case 'RightMenuPhotos':
                    return 'Photos'
                case 'ChangeBgMenu':
                    return 'Change Background'
            }
        }
    },
    components: {
        RightMenuMain,
        ChangeBgMenu,
        RightMenuColors,
    },
    methods: {
        closeModal() {
            this.isModalOpen = false
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        openMenu() {
            this.isMenuOpen = true
        },
        closeMenu() {
            this.currCmp = 'RightMenuMain'
            this.isMenuOpen = false
        },
        changeCmp(data) {
            this.currCmp = data
        },
        setBgColor(color) {
            this.$emit('setBgColor', color)
        },
        setCmp() {
            debugger
            switch (this.currCmp) {
                case 'RightMenuColors':
                    this.currCmp = 'ChangeBgMenu'
                    break
                case 'RightMenuPhotos':
                    this.currCmp = 'ChangeBgMenu'
                    break
                case 'ChangeBgMenu':
                    this.currCmp = 'RightMenuMain'
                    break
                default: this.closeMenu()
            }
        },
    },
    created() {
        eventBus.on('openRightMenu', () => {
            this.isMenuOpen = true
        })
    }
}
</script>
