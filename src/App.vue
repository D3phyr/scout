<template>
  <div id="app">
    <template v-if="!isWidgetHref">
      <v-background></v-background>
        <component :is="layout">
          <router-view :class="$style.content" />
        </component>
      <PortalTarget name="popup" multiple></PortalTarget>
    </template>
    <template v-else>
      <!--<router-view :class="$style.content" />-->
      <ViewWidgetComponent/>
    </template>
  </div>
</template>

<script>
// import { onMounted } from '@vue/composition-api'
import { computed } from '@vue/composition-api'
import ViewWidgetComponent from './views/Widget'

export default {
  name: 'App',
  metaInfo: {
    title: 'Главная',
    titleTemplate: '',
  },
  components: {
    ViewWidgetComponent,
  },
  computed: {
    layout() {
      return this.$route.meta.layout || 'default-layout'
    },
    isWidget() {
      return this.$route.name === 'widget'
    },
  },
  setup() {
    // const router = ctx.root.$router
    // console.log(router)
    const isWidgetHref = computed(() => window.location.pathname === '/widget/')
    return {
      isWidgetHref,
    }
  },
}
</script>
<style lang="scss" module>
  @import './styles/main.scss';

  .content {
    position: relative;
    z-index: 1;
  }
</style>
