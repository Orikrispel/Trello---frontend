<template>
  <div class="member-preview">
    <img class="user-img" v-if="member.imgUrl" :src="member.imgUrl" alt="" />
    <div v-else class="member-img">
      <span>{{ member.fullname.charAt(0).toUpperCase() }}</span>
    </div>
    <div>{{ member.fullname }}</div>
    <div>{{ member.isActive }}</div>
    <span>{{ member.isSelected ? '✔' : '' }}</span>
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
