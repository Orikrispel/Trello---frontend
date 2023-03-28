<template>
    <div class="right-colors-container" ref="container">
        <div class="right-menu-color" @click="setColor(color)" v-for="(color, idx) in colorItems" :key="idx"
            :style="{ backgroundColor: color }">
        </div>
    </div>
</template>

<script>
import { svgService } from '../../services/svg.service';
import { eventBus } from '../../services/event-bus.service'
export default {
    name: 'RightMenuColors',
    props: {
    },
    data() {
        return {
            colorItems: [
                ' #b7ddb0',
                ' #f5ea92',
                '#fad29c',
                ' #efb3ab',
                ' #dfc0eb',
            ],
        }
    },
    computed: {
        colorsForDisplay() {

        },
    },
    created() {

    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
        setColor(color) {
            this.$emit('setBgColor', color)
        }
    },
    computed: {


    },
}
</script>


