<template>
      <div :class="$style.overlay" @click="$emit('closePopupDelete')">
        <div :class="$style.popupContainer" @click.stop>
          <v-icon :class="[$style.closeButton, themeWhite && $style.invert]" :name="'closePopup'" @click="$emit('closePopupDelete')"></v-icon>
          <div :class="$style.title">Уверены, что хотите удалить{{$props.admin ? '' : ' событие'}}?</div>
            <div :class="$style.buttonContainer">
                <v-btn @click="$emit('deleteItem')" :color="'black'">
                    Да
                </v-btn>
                <v-btn @click="$emit('closePopupDelete')" :color="'red'">
                    Нет
                </v-btn>
            </div>
        </div>
      </div>
</template>

<script>
import { computed } from '@vue/composition-api'

export default {
    name: 'v-popupDelete',
    props: {
      admin: {
        type: Boolean,
        default: false,
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

<style lang="scss" module>
.overlay {
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  .popupContainer {
    width: 42.0rem;
    background: var(--white);
    border-radius: var(--border-radius);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 4rem 2rem 2.5rem;
    .closeButton {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 1.4rem;
      height: 1.4rem;
    }
    .title {
      text-align: center;
      font-weight: 700;
      @include button;
      margin-bottom: 1.7rem;
      color: var(--black);
    }
    .buttonContainer {
        display: flex;
        gap: 1rem;
    }
  }
}
.invert {
    filter: invert(1);
}
</style>
