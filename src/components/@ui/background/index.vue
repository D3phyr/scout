<template>
    <div :class="$style.wrapper">
        <slot />
    </div>
</template>

<script>

export default {
  name: 'v-background',
  props: {
  },
  setup() {
    return {
    }
  },
}
</script>

<style lang="scss" module>

.wrapper {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 0;
    background: var(--background) 100%;
    padding: 0 3rem;
    min-height: 100vh;
}
</style>
