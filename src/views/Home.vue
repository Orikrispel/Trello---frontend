<template>
  <main class="homepage">
    <section class="hero flex">
      <div class="hero-container">
        <div class="hero-intro">
          <h1>Jello brings all your tasks, teammates, and tools together</h1>
          <p>Keep everything in the same place—even if your team isn’t.</p>
          <Router-Link @click="setDemoUser" to="/board" class="btn btn-blue"
            >Start demo</Router-Link
          >
        </div>
        <img
          class="intro-img"
          src="../../src/assets/imgs/homepage/homepage-2.png" />
      </div>
    </section>
  </main>
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
  created() {},
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
        showErrorMsg(`Cannot login`)
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },
  },
}
</script>
