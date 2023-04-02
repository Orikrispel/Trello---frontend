import { createApp } from 'vue'

import { router } from './router.js'
import { store } from './store/store.js'
import FloatingVue from 'floating-vue'
import VCalendar from 'v-calendar'
import vue3GoogleLogin from 'vue3-google-login'
import 'v-calendar/style.css'

import './assets/styles/main.scss'
import './assets/styles/setup/_typography.scss'
import 'floating-vue/dist/style.css'
import App from './App.vue'

const app = createApp(App)
app.use(VCalendar, {})
app.use(router)
app.use(store)
app.use(FloatingVue)
app.use(vue3GoogleLogin, {
  clientId: '167650953278-sh1blmg7ucborjqu4144ict0bp1b8mhf.apps.googleusercontent.com'
})
app.mount('#app')
