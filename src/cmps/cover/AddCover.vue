<template>
    <DynamicModal>
        <template v-slot:title>
            Cover
        </template>

        <template v-slot scope="props">
            <section ref="groupMenu" class="group-menu flex column label-menu label-edit">
                <form class="add-checklist-form">
                    <h4>Size</h4>
                    <!-- <CoverDisplay /> -->
                </form>
                <form class="add-checklist-form">
                    <h4>Colors</h4>
                    <CoverColor :quantity="10" />
                </form>
            </section>
        </template>
    </DynamicModal>
</template>

<script>

import CoverColor from './CoverColor.vue'
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

    },
    components: {
        DynamicModal,
        CoverColor,
        LabelColorPicker,
    },

})
</script>
