<template>
    <section class="right-menu" :class="{ 'show': isMenuOpen }">
        <div class="add-form-header right-menu-header">
            <!-- <span>back icon</span> -->
            <h5 id="right-menu-h5">Menu</h5>
            <span class="icon btn-close icon-close" @click.stop="closeMenu"></span>
        </div>
        <component :is="currCmp" @changeCmp="changeCmp" />
    </section>
</template>

<script>
import ChangeBgMenu from './ChangeBgMenu.vue';
import RightMenuMain from './RightMenuMain.vue';
import { eventBus } from '../../services/event-bus.service';
import { svgService } from '../../services/svg.service';
export default {
    name: 'RightMenu',
    data() {
        return {
            currCmp: 'RightMenuMain',
            isMenuOpen: false,
        }
    },

    components: {
        RightMenuMain,
        ChangeBgMenu,
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
            this.isMenuOpen = false
        },
        changeCmp(data) {
            this.currCmp = data
        }

    },
    created() {
        eventBus.on('openRightMenu', () => {
            this.isMenuOpen = true
        })
    }
}
</script>
