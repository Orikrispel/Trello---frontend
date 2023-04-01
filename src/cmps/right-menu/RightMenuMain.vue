<template>
    <section class="right-menu-actions">
        <button>
            <span v-html="getSvg('addMember')" style="padding-top: 3px;"></span>
            About this board
        </button>
        <button @click="this.$emit('ChangeCmp', 'ChangeBgMenu')">
            <span v-html="getSvg('pencil')" style="padding-top: 2px;"></span>
            Change background
        </button>
    </section>
    <section class="right-menu-actions">

    </section>
</template>

<script>
import { svgService } from '../../services/svg.service';
import { eventBus } from '../../services/event-bus.service'
export default {
    name: 'RightMenuMain',
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


