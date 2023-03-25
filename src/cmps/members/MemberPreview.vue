<template>
  <div class="member-preview">
    <div>
      {{
        member.imgUrl ? member.imgUrl : member.fullname.charAt(0).toUpperCase()
      }}
    </div>
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
