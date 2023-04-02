<template>
  <ul class="clean-list comment-list">
    <CommentPreview
      v-for="comment in comments"
      :key="comment.id"
      class="comment-container-list-item"
      :comment="comment" />
  </ul>
</template>

<script>
import CommentPreview from './CommentPreview.vue'

export default {
  name: 'CommentList',
  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  components: {
    CommentPreview,
  },
}
</script>
