<template>
    <section class="right-menu" :class="{ 'open': isMenuOpen }">
        <div class="add-form-header right-menu-header">
            <span>back icon</span>
            <h5 id="right-menu-h5">Menu</h5>
            <span class="icon btn-close icon-close" @click.stop="this.$emit('closeRightMenu')"></span>
        </div>
        <!-- <section> -->
        <!-- <component :is="currCmp" /> -->
        <section class="right-menu-actions">
            <button>
                <span v-html="getSvg('addMember')"></span>
                About this board
            </button>
            <button @click="currentCmp = 'changeBgc'">
                <span v-html="getSvg('pencil')"></span>
                Change background
            </button>
        </section>
        <!-- </section> -->
    </section>
    <!-- <section class="right-menu" :class="{ 'open': isMenuOpen }" v-if="currentCmp">
        <div class="add-form-header right-menu-header">
            <h5 id="right-menu-h5">Menu</h5>
            <span class="icon btn-close icon-close" @click.stop="this.$emit('closeRightMenu')"></span>
        </div>
        <section class="right-menu-actions">
            <button>
                About this board
            </button>
            <button @click="currentCmp = 'changeBgc'">
                <span v-html="getSvg('pencil')"></span>
                Change background
            </button>
        </section>
    </section> -->
</template>

<script>
import { svgService } from '../services/svg.service';
export default {
    name: 'BoardRightMenu',
    data() {
        return {
            currentCmp: '',
            isMenuOpen: false,
        }
    },

    components: {

    },
    methods: {
        closeModal() {
            this.isModalOpen = false
        },
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
    },
    mounted() {
        this.isMenuOpen = true
    }
}
</script>
