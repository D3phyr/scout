<template>
  <div v-if="loading">
    <v-matchAll :data="matchInfo" :spectatorToken="spectatorToken" @loadNewEvents="loadNewEvents"></v-matchAll>
  </div>
</template>
<script>
import {
  onMounted,
  ref,
  computed,
  // nextTick,
} from '@vue/composition-api'

export default {
  name: 'id',
  setup(props, context) {
    const store = context.root.$store
    const router = context.root.$router
    const roleId = computed(() => context.root.$store.state.roleId)
    const userId = computed(() => context.root.$store.state.userId)

    const matchInfo = ref({})
    const spectatorToken = ref('')
    const loading = ref(false)

    const loadNewEvents = async (val) => {
      matchInfo.value.match.statistics = val.statistics
      if (val.type === 'Initial') {
        matchInfo.value.match.statistics = val.statistics
        matchInfo.value.events = val.events
      } else if (val.type === 'addEvent' || val.type === 'endEvent' || val.type === 'startEvent') {
        matchInfo.value.events.push({
          eventId: val.eventId,
          cypher: val.cypher,
          date: val.date,
          comfort_data: val.comfort_data,
        })
      } else if (val.type === 'cancelOrEditEvent') {
        matchInfo.value.events.forEach((item, index) => {
          if (item && item.cypher === val.cypher) {
            matchInfo.value.events[index].deleted = val.deleted
          }
        })
      }
    }

    onMounted(async () => {
      setTimeout(async () => {
        if (roleId.value === 2) {
          matchInfo.value = await store.dispatch('getMatch', router.currentRoute.params.id)
          if (userId.value !== matchInfo.value.match.operatorId) {
            router.push('/')
          }
        } else if (Number(router.currentRoute.params.id)) {
          matchInfo.value = await store.dispatch('getMatchSpectate', router.currentRoute.params.id)
          const socketToken = await store.dispatch('authByToken', { token: `${matchInfo.value.match.token}` })
          spectatorToken.value = socketToken.data.token
        }
        loading.value = true
      }, 500)
    })

    return {
      roleId,
      userId,

      matchInfo,
      loading,
      spectatorToken,

      loadNewEvents,
    }
  },
}
</script>
