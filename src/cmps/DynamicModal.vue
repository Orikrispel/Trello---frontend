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

    <main>
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
  computed: {
  },

  methods: {
  },
}
</script>

<style>
/* .group-menu {
  padding: 0 12px 0;
  top: 40px;
  right: -100%;
  border-radius: 3px;
  box-shadow: 0 8px 16px -4px $btn-hover-clr1;
  position: absolute;
  background-color: $secondary-clr1;
  width: rem(304px);
  z-index: 10;

  &-header {
    border-bottom: 1px solid $btn-hover-clr1;
    text-align: center;
    color: $font-clr3;
    display: block;
    overflow: hidden;
    padding: 0 32px;
    position: relative;

    &>* {
      font-size: rem(14px);
    }

    h3 {
      margin: 0;
      font-weight: 200;
      line-height: 40px;
    }

    .btn-close {
      cursor: pointer;
      padding: 10px 0 10px 8px;
      position: absolute;
      right: 0;
      top: 0;
      font-size: rem(16px);
    }
  }
} */
</style>
