<template>
  <header class="app-haeder">
    <nav class="flex gap">
      <img class="logo" src="../assets/imgs/header/logo white.png" alt="Jello logo">
      <RouterLink to="/board">Boards</RouterLink>
      <button class="btn">Create</button>
    </nav>
    <nav class="flex gap">
      <RouterLink to="/login">Login / Signup</RouterLink>
    </nav>
    <section class="loggedin-user" v-if="loggedInUser">
      <RouterLink :to="`/user/${loggedInUser._id}`">
        {{ loggedInUser.fullname }}
      </RouterLink>
      <span>{{ loggedInUser.score.toLocaleString() }}</span>
      <img :src="loggedInUser.imgUrl" />
    </section>
  </header>
</template>
<script>
export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
  }
}
</script>