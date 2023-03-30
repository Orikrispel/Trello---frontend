<template>
    <DynamicModal>
        <template v-slot:title>
            Cover
        </template>

        <template v-slot scope="props">
            <section ref="groupMenu" class="group-menu flex column label-menu label-edit">
                <form class="add-checklist-form">
                    <h5 class="cover-h5">Size</h5>
                </form>
                <form class="add-checklist-form">
                    <CoverDisplay @setCover="setCover" @removeCover="removeCover" />
                    <h5 class="cover-h5">Colors</h5>
                    <CoverColor :quantity="10" />
                </form>
            </section>
        </template>
    </DynamicModal>
</template>

<script>

import CoverColor from './CoverColor.vue'
import CoverDisplay from './CoverDisplay.vue'
import DynamicModal from '../DynamicModal.vue'
import LabelColorPicker from '../LabelColorPicker.vue'


export default ({
    props: {
        task: {
            type: Object,
            require: true,
        }
    },
    data() {
        return {

        }
    },
    methods: {
        setCover(type, color) {
            this.$emit('setCover', type, color)
        },
        removeCover() {
            this.$emit('removeCover')
        }
    },
    emits: ['setCover', 'removeCover'],

    components: {
        DynamicModal,
        CoverColor,
        LabelColorPicker,
        CoverDisplay,
    },

})
</script>
