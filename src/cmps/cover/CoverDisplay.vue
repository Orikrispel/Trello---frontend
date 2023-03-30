<template>
    <section class="covers-container">
        <div @click="setCover('semi')" class="cover-display cover-semi-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'semi' }]"
            :style="{ backgroundColor: getBgColor }">
            <SemiCoverDisplay />
        </div>

        <div @click="setCover('full')" class="cover-display cover-full-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'full' }]"
            :style="{ backgroundColor: getBgColor }">
        </div>
        <!-- <FullCoverDisplay /> -->
    </section>
    <button class="btn-task light" @click="removeCover">
        Remove cover
    </button>
</template>
<!-- v-html="(color === pickedColor ? getSvg('vBoard') : '')" -->
<script>
import { eventBus } from '../../services/event-bus.service'
import SemiCoverDisplay from './SemiCoverDisplay.vue'
export default {
    name: 'ColorPicker',
    data() {
        return {
            pickedColor: 'rgba(9, 30, 66, 0.25)',
            pickedCover: ''
        }
    },
    computed: {
        getBgColor() {
            return this.pickedColor
        }
    },
    methods: {
        setColor(color) {
            this.pickedColor = color
            this.pickedCover = 'semi'
            this.$emit('setCover', 'semi', this.pickedColor)
        },
        setCover(coverType) {
            eventBus.emit('onCoverPick', coverType)
            if (!this.pickedColor) return
            this.pickedCover = coverType
            this.$emit('setCover', coverType, this.pickedColor)
        },
        removeCover() {
            this.pickedColor = ''
            this.pickedCover = ''
            this.$emit('removeCover')
        }

    },
    emits: ['setCover', 'removeCover'],
    created() {
        eventBus.on('onCoverColorPick', (color) => {
            this.setColor(color)
        });
    },
    components: {
        SemiCoverDisplay,

    }
}
</script>
