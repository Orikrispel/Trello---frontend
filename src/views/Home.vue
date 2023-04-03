<template>
  <section class="homepage-container">
    <header class="homepage-header flex justify-between">
      <div class="logo flex flex-center"><img src="../assets/logo.png"></div>
      <nav class="nav-container flex">
        <RouterLink to="/login">Log in</RouterLink>
        <RouterLink to="/board">Start demo</RouterLink>
      </nav>
    </header>

    <main class="homepage-main">
      <section class="hero flex">
        <div class="hero-container">
          <div class="hero-intro">
            <h1>Jello brings all your tasks, teammates, and tools together</h1>
            <p>Keep everything in the same place — even if your team isn’t.</p>
            <Router-Link @click="setDemoUser" to="/board" class="btn-demo fs16">Start demo</Router-Link>
          </div>
          <img class="intro-img" src="../../src/assets/imgs/homepage/homepage-2.png" />
        </div>
      </section>
    </main>
  </section>
</template>

<script>
import { svgService } from '../services/svg.service'
export default {
  name: 'homepage',
  data() {
    return {
      credentials: {
        username: 'yoyo',
        password: '123',
      },
    }
  },
  computed: {},
  created() { },
  methods: {
    async setDemoUser() {
      try {
        let user = await this.$store.dispatch({
          type: 'login',
          userCred: this.credentials,
        })
        this.loginClicked = false
      } catch (err) {
        console.log('Cannot login', err)
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
