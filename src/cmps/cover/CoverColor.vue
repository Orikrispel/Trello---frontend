<template>
    <div class="colors-container" ref="container">
        <div @click="setColor(color)" v-for="(color, idx) in colorsForDisplay" :key="idx"
            :class="['color-item', `cover-color-item-${idx + 1}`, { selected: color === pickedColor }]">
        </div>
    </div>
</template>
<!-- v-html="(color === pickedColor ? getSvg('vBoard') : '')" -->
<script>
import { eventBus } from '../../services/event-bus.service'
export default {
    props: ['quantity'],
    name: 'ColorPicker',
    data() {
        return {
            pickedColor: '',
            pickedCover: '',
            colorItems: [
                '#7bc86c',
                '#f5dd29',
                '#ffaf3f',
                '#ef7564',
                '#cd8de5',
                '#8bbdd9',
                '#8fdfeb',
                '#b3f1d0',
                '#f9c2e4',
                '#505f79',
            ],
        }
    },
    computed: {
        loggedInUser() { },
        colorsForDisplay() {
            let { quantity } = this.$props
            return this.colorItems.filter((item, idx) => {
                if (idx <= quantity - 1) return item
            })
        },
    },
    methods: {
        setColor(color) {
            this.pickedColor = color
            eventBus.emit('onCoverColorPick', color)
            this.$emit('setColor', this.pickedColor)
        },
        clearSelection() {
            this.pickedColor = ''
            document.querySelectorAll('.color-item.selected').forEach((el) => {
                el.classList.remove('selected')
            })
        },
        setCoverType(data) {
            this.pickedCover = data
        }

    },
    created() {
        eventBus.on('onCoverPick', data => {
            this.setCoverType(data)
        })
    },
    emits: ['setColor'],
}
</script>
