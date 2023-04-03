<template>
  <section class="login-signup main flex column align-center">
    <img class="logo" src="../assets/logo.png" alt="Jello logo" />

    <article v-if="!loggedinUser && loginClicked" class="login-form flex column">
      <h2>Log in to Jello</h2>
      <form @submit.prevent="login" class="flex column align-center">
        <input type="text" v-model="credentials.username" placeholder="Enter username" />
        <input type="password" v-model="credentials.password" placeholder="Enter password" />
        <button class="btn-login" type="submit">Log in</button>
      </form>

      <div class="flex column align-center status">
        <p class="seperator">OR</p>
        <GoogleLogin :callback="callback" />
        <p class="toggle-status" @click="toggleForm">Sign up for an account</p>
      </div>
    </article>

    <article v-if="!loggedinUser && signupClicked" class="login-form flex column">
      <h2>Signup to Jello</h2>
      <form @submit.prevent="signup" class="flex column align-center">
        <input type="text" v-model="signupInfo.fullname" placeholder="Full name" />
        <input type="text" v-model="signupInfo.username" placeholder="Username" />
        <input type="password" v-model="signupInfo.password" placeholder="Password" />
        <button class="btn-login" type="submit">Signup</button>
      </form>
      <div class="flex column status">
        <p class="seperator">Already have an account?</p>
        <hr />
        <p class="toggle-status" @click="toggleForm">Log in</p>
      </div>
    </article>

    <article v-if="loggedinUser" class="login-form logout flex column">
      <h2>You are connected as:</h2>
      <div class="flex gap align-center">
        <img class="user-img" v-if="loggedinUser.imgUrl" :src="loggedinUser.imgUrl" alt="">
        <div v-else class="member-img">
          <span>{{ loggedinUser.fullname.charAt(0).toUpperCase() }}</span>
        </div>
        <p class="fs16">{{ loggedinUser.fullname }}</p>
      </div>
      <button class="btn clean-btn" @click="logout">
        Logout
      </button>
    </article>

    <div class="img-comtainer flex justify-between">
      <img src="../assets/imgs/loginSingup/svg1.svg" />
      <img src="../assets/imgs/loginSingup/svg2.svg" />
    </div>
  </section>
</template>

<script>
import { svgService } from '../services/svg.service'
import { decodeCredential } from 'vue3-google-login'

export default {
  data() {
    return {
      loginClicked: true,
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
        this.$router.push(`/board`)
      } catch (err) {
        console.log('Cannot login', err)
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
      }
    },
    async logout() {
      this.$store.dispatch({ type: 'logout' })
    },
    async callback(response) {
      const { given_name, sub, name, picture } = decodeCredential(response.credential)
      const userCred = {
        fullname: name,
        username: given_name,
        password: sub.toString(),
        imgUrl: picture
      }
      try {
        await this.$store.dispatch({ type: 'login', userCred })
        this.loginClicked = false
        this.$router.push(`/board`)
      } catch (err) {
        try {
          await this.$store.dispatch({ type: 'signup', userCred })

        } catch (err) {
          console.log('Cannot signup', err)
          this.$router.push(`/board`)
        }
      }
    },
    getSvg(iconName) {
      return svgService.getSvg(iconName)
    },

    toggleForm() {
      this.signupClicked = !this.signupClicked
      this.loginClicked = !this.loginClicked
    },
  },
}
</script>
