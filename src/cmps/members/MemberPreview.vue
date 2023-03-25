<template>
  <div class="member-preview">
    <div>{{ member.imgUrl }}</div>
    <div>{{ member.fullname }}</div>
    <div>{{ member.isActive }}</div>
  </div>
</template>
<script>
export default {
  name: 'MemberPreview',
  props: {
    member: {
      type: Object,
      required: true,
    },
  },
}
</script>
