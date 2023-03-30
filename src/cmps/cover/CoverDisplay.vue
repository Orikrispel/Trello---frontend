<template>
    <section class="covers-container">
        <div @click="setCover('semi')" class="cover-display cover-semi-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'semi' }]"
            :style="{ backgroundColor: getBgColor }">
        </div>

        <div @click="setCover('full')" class="cover-display cover-full-container"
            :class="[{ selected: pickedColor }, { picked: pickedCover === 'full' }]"
            :style="{ backgroundColor: getBgColor }">
        </div>

    </section>
    <button class="btn-task remove-cover-btn" @click="removeCover('')">
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
        },
        setCover(coverType) {
            this.pickedCover = coverType
        },
        removeCover() {
            this.pickedColor = 'rgba(9, 30, 66, 0.25)'
            this.pickedCover = ''
        }

    },
    created() {
        eventBus.on('onCoverColorPick', (color) => {
            this.setColor(color)
        });
    },
}
</script>
