<template>
  <div class="labels-container">
    <button>X</button>
    <h3>Labels</h3>
    <hr />
    <input type="text" name="label-search" placeholder="Search labels" />
    <h4>Labels</h4>
    <ul>
      <li v-for="label in labels">
        <input type="checkbox" />
        <div class="label-container">
          <span>{{ label.txt }}</span>
        </div>
        <button @click="editLabel">edit</button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labels: [],
      label: {},
    }
  },
}
</script>
