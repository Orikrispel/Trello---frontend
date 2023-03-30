<template>
    <section class="covers-container">
        <div @click="setCover('semi')" class="cover-display cover-semi-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'semi' }]"
            :style="{ backgroundColor: getBgColor }">
            <h1>semi</h1>
        </div>

        <div @click="setCover('full')" class="cover-display cover-full-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'full' }]"
            :style="{ backgroundColor: getBgColor }">
            <h1>full</h1>
        </div>

    </section>
    <button class="btn-task remove-cover-btn" @click="removeCover">
        Remove cover
    </button>
</template>
<!-- v-html="(color === pickedColor ? getSvg('vBoard') : '')" -->
<script>
import { eventBus } from '../../services/event-bus.service'
export default {
    name: 'ColorPicker',
    data() {
        return {
            pickedColor: '',
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
}
</script>
