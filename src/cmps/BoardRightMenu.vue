<template>
    <section class="right-menu">
        <div class="add-form-header right-menu-header">
            <h5 id="right-menu-h5">Menu</h5>
            <span class="icon btn-close icon-close" @click.stop="this.$emit('closeRightMenu')"></span>
        </div>
        <section class="right-menu-actions">
            <button>
                <span v-html="getSvg('addMember')"></span>
                About this board
            </button>
            <button>
                <span v-html="getSvg('addMember')"></span>
                Change background
            </button>
        </section>
    </section>
</template>

<script>
import { svgService } from '../services/svg.service';
export default {
    name: 'BoardRightMenu',
    data() {
        return {
            currentCmp: '',
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
    }
}
</script>
