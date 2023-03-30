<template>
  <section class="login-signup">
    <h2 v-if="loggedInUser" class="btn-rounded" @click="logout">Logout</h2>
    <h2 v-if="!loggedInUser" @click="loginClicked = true" class="btn-rounded">
      Login
    </h2>
    <form v-if="!loggedInUser && loginClicked" @submit.prevent="login">
      <input
        type="text"
        v-model="credentials.username"
        placeholder="Username" />
      <input
        type="password"
        v-model="credentials.password"
        placeholder="Password" />
      <button>Login</button>
    </form>
    <h2 v-if="!loggedInUser" @click="signupClicked = true" class="btn-rounded">
      Signup
    </h2>
    <form v-if="!loggedInUser && signupClicked" @submit.prevent="signup">
      <input
        type="text"
        v-model="signupInfo.fullname"
        placeholder="Full name" />
      <input type="text" v-model="signupInfo.username" placeholder="Username" />
      <input
        type="password"
        v-model="signupInfo.password"
        placeholder="Password" />
      <button>Signup</button>
    </form>
  </section>
</template>
<script>
import {
  showUserMsg,
  showSuccessMsg,
  showErrorMsg,
} from '../services/event-bus.service'
export default {
  data() {
    return {
      loginClicked: false,
      signupClicked: false,

      credentials: {
        username: '',
        password: '',
      },
      signupInfo: {
        fullname: '',
        username: '',
        password: '',
      },
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
  },
  methods: {
    async login() {
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
    async signup() {
      try {
        let user = await this.$store.dispatch({
          type: 'signup',
          userCred: this.signupInfo,
        })
        this.signupClicked = false
      } catch (err) {
        console.log('Cannot signup', err)
        showErrorMsg(`Cannot signup`)
      }
    },
    async logout() {
      this.$store.dispatch({ type: 'logout' })
    },
  },
}
</script>
