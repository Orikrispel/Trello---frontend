<template>
    <section class="right-menu-actions">
        <button>
            <span v-html="getSvg('addMember')"></span>
            About this board
        </button>
        <button @click="this.$emit('ChangeCmp', 'ChangeBgMenu')">
            <span v-html="getSvg('pencil')"></span>
            Change background
        </button>
    </section>
</template>

<script>
import { svgService } from '../../services/svg.service';
import { eventBus } from '../../services/event-bus.service'
export default {
    name: 'RightMenuMain',
    props: {
        task: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            currTask: null,
        }
    },
    created() {

    },
    methods: {
        getSvg(iconName) {
            return svgService.getSvg(iconName)
        },
    },
    computed: {


    },
}
</script>


