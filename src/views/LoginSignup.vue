<template>
  <section class="login-signup main flex column align-center">
    <img class="logo" src="../assets/logo colored.png" alt="Jello logo" />
    <article class="login-form flex column">
      <h2>Log in to Jello</h2>

      <form @submit.prevent="login" class="flex column align-center">
        <input type="text" v-model="credentials.username" placeholder="Enter username" />
        <input type="password" v-model="credentials.password" placeholder="Enter password" />
        <button>Log in</button>
      </form>

      <div class="flex column status">
        <p class="seperator">OR</p>
        <hr>
        <p class="toggle-status">Sign up for an account</p>
      </div>
    </article>
  </section>


  <section class="login-signup">
    <h2 v-if="loggedinUser" class="btn-rounded" @click="logout">Logout</h2>
    <h2 v-if="!loggedinUser" @click="loginClicked = true" class="btn-rounded">
      Login
    </h2>
    <form v-if="!loggedinUser && loginClicked" @submit.prevent="login">
      <input type="text" v-model="credentials.username" placeholder="Username" />
      <input type="password" v-model="credentials.password" placeholder="Password" />
      <button>Login</button>
    </form>
    <h2 v-if="!loggedinUser" @click="signupClicked = true" class="btn-rounded">
      Signup
    </h2>
    <form v-if="!loggedinUser && signupClicked" @submit.prevent="signup">
      <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
      <input type="text" v-model="signupInfo.username" placeholder="Username" />
      <input type="password" v-model="signupInfo.password" placeholder="Password" />
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
    loggedinUser() {
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
