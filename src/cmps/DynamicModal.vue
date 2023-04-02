<template>
  <div class="modal-container">
    <div class="header">
      <div>
        <h3>
          <slot name="title">default</slot>
        </h3>
        <span class="icon btn-close icon-close" v-close-popper></span>
      </div>
    </div>

    <main class="inner-content">
      <slot></slot>
    </main>

    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>
<script>

export default {
  data() {
    return {
    }
  },
}
</script>
