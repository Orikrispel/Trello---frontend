<template>
  <section>
    <AppHeader v-if="!isHome" />
    <RouterView />
    <UserMsg />
  </section>
</template>

<script>
import { userService } from './services/user.service'
import { store } from './store/store'

import AppHeader from './cmps/AppHeader.vue'
import UserMsg from './cmps/UserMsg.vue'

export default {
  created() {
    console.log('Vue App created')
    const user = userService.getLoggedinUser()
    if (user) store.commit({ type: 'setLoggedinUser', user })
  },
  computed: {
    isHome() {
      return this.$route.name === 'Home'
    }
  },
  components: {
    AppHeader,
    UserMsg,
  },
}
</script>
