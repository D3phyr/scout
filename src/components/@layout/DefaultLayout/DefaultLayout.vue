<template>
  <div>
    <v-matchHeader v-if="path !== 'id'"></v-matchHeader>
    <div :class="$style.wrapper">
      <slot />
    </div>
  </div>
</template>
<script>
import { computed, onMounted } from '@vue/composition-api'

export default {
  name: 'DefaultLayout',
  setup(props, context) {
    const store = context.root.$store
    const path = computed(() => context.root.$route.name)
    const roleId = computed(() => context.root.$store.state.roleId)
    onMounted(async () => {
      if (localStorage.getItem('token')) {
        await store.commit('setToken')
        const verify = await store.dispatch('checkVerify')
        if (!verify.status) {
          localStorage.removeItem('token')
          store.commit('clearUserInfo')
        }
      }
    })
    return {
      path,
      roleId,
    }
  },
}
</script>
<style lang="scss" module>
@import './DefaultLayout.scss';
</style>
