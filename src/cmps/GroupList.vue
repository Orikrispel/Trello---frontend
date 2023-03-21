<template>
  <section>
    <ul class="group-list flex">
      <li v-for="group in groups" :key="group._id">
        <GroupPreview :group="group" />
      </li>
    </ul>
  </section>
</template>

<script>
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { boardService } from '../services/board.service.local'
import GroupPreview from '../cmps/GroupPreview.vue'
import { getActionRemoveGroup, getActionUpdateGroup, getActionAddGroupMsg } from '../store/board.store'
export default {
  props: ["groups"],
  data() {
    return {
      groupToAdd: boardService.getEmptyGroup()
    }
  },
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    },
  },
  methods: {
    async addGroup() {
      try {
        await this.$store.dispatch({ type: 'addGroup', group: this.groupToAdd })
        showSuccessMsg('Group added')
        this.groupToAdd = groupService.getEmptyGroup()
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add group')
      }
    },
    async removeGroup(groupId) {
      try {
        await this.$store.dispatch(getActionRemoveGroup(groupId))
        showSuccessMsg('Group removed')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot remove group')
      }
    },
    async updateGroup(group) {
      try {
        group = { ...group }
        group.price = +prompt('New price?', group.price)
        await this.$store.dispatch(getActionUpdateGroup(group))
        showSuccessMsg('Group updated')

      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot update group')
      }
    },
    async addGroupMsg(groupId) {
      try {
        await this.$store.dispatch(getActionAddGroupMsg(groupId))
        showSuccessMsg('Group msg added')
      } catch (err) {
        console.log(err)
        showErrorMsg('Cannot add group msg')
      }
    },
    printGroupToConsole(group) {
      console.log('Group msgs:', group.msgs)
    }
  },
  components: {
    GroupPreview,
  }


}
</script>
