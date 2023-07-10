<template>
  <img
    :class="[$style.icon,
    ($props.name !== 'moon' && themeWhite) && !($props.name === 'mic' || $props.name === 'freemove' || $props.name === 'done') && $style.invert,
    (($props.name === 'mic' || $props.name === 'freemove' || $props.name === 'done') && !themeWhite) && $style.invert
    ]"
    @click="$emit('click', $event)"
    :src="require(`@/assets/${name}.png`)"
  />
</template>
<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'VImage',
  props: {
    name: {
      type: String,
      default: 'image',
    },
  },
  setup(props, context) {
    const themeWhite = computed(() => context.root.$store.state.whiteTheme)
    return {
      themeWhite,
    }
  },
}
</script>

<style lang="scss" scoped module>
.icon {
  line-height: 0;
  user-select: none;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
.invert {
  filter: invert(1);
}
</style>
