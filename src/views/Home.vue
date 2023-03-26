<template>
  <main class="homepage">
    <section class="hero flex">
      <div class="hero-container">
        <div class="hero-intro">
          <h1>Jello brings all your tasks, teammates, and tools together</h1>
          <p>Keep everything in the same place—even if your team isn’t.</p>
          <Router-Link to="/board" class="btn btn-blue">Start demo</Router-link>
        </div>
        <img class="intro-img" src="../../src/assets/imgs/homepage/homepage-2.png">
      </div>
    </section>

    <div class="intro-home-container">
      <div class="intro-header">
        <h2>A productivity powerhouse</h2>
        <p> Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way
          your
          team works is unique—accomplish it all with Trello.</p>
        <p> Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way
          Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who’s doing
          what and what needs to get done.</p>
      </div>
      <img class="intro-img" src="../../src/assets/imgs/homepage/homepage-1.png">

    </div>
    <div class="intro-home-container">
      <div class="intro-header">
        <h1>A productivity powerhouse</h1>
        <p> Collaborate, manage projects, and reach new productivity peaks. From high rises to the home office, the way
          Simple, flexible, and powerful. All it takes are boards, lists, and cards to get a clear view of who’s doing
          what and what needs to get done.</p>
      </div>
      <img class="intro-img" src="../../src/assets/imgs/homepage/homepage-3.png">
    </div>
  </main>
</template>

<script>
export default {
  name: 'homepage',
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  },
  methods: {
  }

}
</script>
