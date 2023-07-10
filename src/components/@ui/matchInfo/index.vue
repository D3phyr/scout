<template>
    <div @click="$emit('click', $event)" :class="[$style.container, $style[color]]">
        <div :class="$style.name">{{$props.title}}</div>
        <v-image v-if="$props.complited" :class="[$style.complited]" :name="'complited'"></v-image>
        <div :class="[$style.text, $props.date && $style.date]">
          <slot />
        </div>
    </div>
</template>

<script>

export default {
  name: 'v-btn',
  props: {
    color: {
      type: String,
      default: 'white',
    },
    title: {
      type: String,
      default: '',
    },
    complited: {
      type: [String, Array, Boolean],
      default: '',
    },
    date: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
        return {
        }
  },
}
</script>

<style lang="scss" module>

.container {
  border-radius: var(--border-radius);
  width: 29.0rem;
  min-height: 22.0rem;
  padding: 2rem;
  background: var(--buttonBackColor);
  color: var(--white);
  .name {
    font-weight: 700;
    @include button;
    width: 100%;
    padding-bottom: 2rem;
    border-bottom: .1rem solid var(--matchInfoUnderlineColor);
  }
  .text {
    height: 90%;
    font-weight: 700;
    @include button;
    width: 100%;
    padding-top: 2rem;
  }
  .complited {
    width: 2rem;
    height: 2rem;
    position: absolute;
    right: 2rem;
    top: 2rem;
    cursor: initial;
  }
  .date {
    display: flex;
    justify-content: center;
  }
}

.green.container {
    background-color: var(--greenLight);
    // color: var(--black);
    color: #000000;
    .name {
        border-color: rgba(#000000, 0.2);
    }
}

.yellow.container {
    background-color: var(--yellow);
    // color: var(--black);
    color: #000000;
    .name {
        border-color: rgba(#000000, 0.2);
    }
}
</style>
