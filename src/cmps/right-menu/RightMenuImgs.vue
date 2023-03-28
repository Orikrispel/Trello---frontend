<template>
    <section class="right-menu-imgs">

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


