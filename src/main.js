import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'
import FloatingVue from 'floating-vue'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import './assets/styles/main.scss'
import './assets/styles/setup/_typography.scss'
import 'floating-vue/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.component('VueDatePicker', VueDatePicker)
app.use(router)
app.use(store)
app.use(FloatingVue)
app.mount('#app')
