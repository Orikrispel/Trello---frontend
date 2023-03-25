<template>
  <div class="member-preview">
    <div class="member-img">
      {{
        member.imgUrl ? member.imgUrl : member.fullname.charAt(0).toUpperCase()
      }}
    </div>
    <div>{{ member.fullname }}</div>
    <div>{{ member.isActive }}</div>
    <div>{{ member.isSelected ? '✔' : '' }}</div>
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
