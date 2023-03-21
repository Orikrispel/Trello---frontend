import { createRouter, createWebHashHistory } from 'vue-router'

import Home from './views/Home.vue'
import BoardIndex from './views/BoardIndex.vue'
import BoardDetails from './views/BoardDetails.vue'
import LoginSignup from './views/LoginSignup.vue'
import UserDetails from './views/UserDetails.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board',
    name: 'BoardIndex',
    component: BoardIndex
  },
  {
    path: '/board/:id',
    name: 'BoardDetails',
    component: BoardDetails
  },
  {
    path: '/login',
    name: 'LoginSignup',
    component: LoginSignup
  },
  {
    path: '/user/:id',
    name: 'UserDetails',
    component: UserDetails
  }
]


export const router = createRouter({
  routes,
  history: createWebHashHistory()
  // base: process.env.BASE_URL,
})

