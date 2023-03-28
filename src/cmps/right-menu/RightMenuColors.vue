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
                ' #f5ea92',
                ' #b7ddb0',
                '#fad29c',
                '#7bc86c',
                ' #ffaf3f',
                ' #efb3ab',
                '#ef7564',
                ' #dfc0eb',
                '#cd8de5',
                ' #5aac44',
                ' #e6c60d',
                ' #e79217',
                ' #cf513d',
                ' #5ba4cf',
                ' #6deca9',
                ' #f5dd29',
            ]
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


