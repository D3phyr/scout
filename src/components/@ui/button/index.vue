<template>
    <button :class="[$style.wrapper, $style[color], high && $style.high, medium && $style.medium, $props.disable && $style.disable]" :style="{'width': $props.width}" @click="$emit('click')">
      <template v-if="!$props.animation">
        <slot />
      </template>
      <template v-else>
        <div :class="[$props.animation && $style.animationContainer, animationCycle && $style.animationCicle]"></div>
        <div :class="$style.textAnimation">
          <slot />
        </div>
      </template>
    </button>
</template>

<script>
import { ref, watch, computed } from '@vue/composition-api'

export default {
  name: 'v-btn',
  props: {
    color: {
      type: String,
      default: 'white',
    },
    high: {
      type: Boolean,
      default: false,
    },
    medium: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '100%',
    },
    animation: {
      type: Boolean,
      defaul: false,
    },
    disable: {
      type: Boolean,
      defaul: false,
    },
  },
  setup(props) {
    const animationStart = computed(() => props.animation)
    const animationCycle = ref(false)
    watch(animationStart, () => {
      animationCycle.value = false
      if (animationStart) {
        setTimeout(() => {
          animationCycle.value = true
        }, 2000)
      }
    })

    return {
      animationStart,
      animationCycle,
    }
  },
}
</script>

<style lang="scss" module>

.wrapper {
  border-radius: var(--border-radius);
  border: 0;
  outline: none;
  cursor: pointer;
  width: 100%;
  height: 5.5rem;
  font-weight: 700;
  @include button;
  text-align: center;
  position: relative;
  overflow: hidden;
  transform: translate3d(0);
  transition: transform 0.15s ease-out;
  -webkit-overflow: hidden;
  -webkit-transform: translate3d(0, 0, 0);
}
.wrapper:hover {
  transform: scale(1.05);
}
.wrapper:active {
  transform: scale(0.95);
}

.red {
    background-color: var(--red);
    color: var(--white);
}

.redDark {
    background-color: var(--red);
    color: var(--black);
}

.white {
    background-color: var(--white);
    color: var(--black);
}

.black {
    background-color: var(--black);
    color: var(--white);
}

.green {
    background-color: var(--greenLight);
    color: var(--black);
}

.yellow {
    background-color: var(--yellow);
    color: var(--black);
}

.grey {
  background-color: var(--grey);
  color: var(--white);
}

.high {
    height: 11rem;
}

.medium {
  height: 8.7rem;
}

.disable {
  opacity: .4;
  pointer-events: none;
}

.animationContainer {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  animation: fill;
  animation-duration: 1s;
  background-color: var(--greenLight);
  animation-fill-mode: forwards;
  overflow: hidden;
}
.animationCicle {
  animation: cicle;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  overflow: hidden;
}
.textAnimation {
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  display: flex;
  align-items: center;
}

@keyframes fill {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}

@keyframes cicle {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

</style>
