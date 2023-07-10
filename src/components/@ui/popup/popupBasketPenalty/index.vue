<template>
  <div :class="$style.overlay" @click="$emit('closePopupMatchLinkChange')">
    <div :class="$style.popupContainer" @click.stop>
      <v-icon
        :class="[$style.closeButton, themeWhite && $style.invert]"
        :name="'closePopup'"
        @click="$emit('closePopupMatchLinkChange')"
      ></v-icon>
      <div :class="$style.title">Колличество шрафных бросков</div>

      <input :class="$style.input" v-model="throwCount" type="text" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" :placeholder="0">

      <div :class="$style.buttonContainer">
        <v-btn @click="confirmThrowChange" :color="'black'"> ОК </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
  name: 'v-popupMatchLinkChange',
  props: {},
  setup(props, ctx) {
    const { emit } = ctx
    const throwCount = ref()
    const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)

    const confirmThrowChange = () => {
      emit('confirmThrowChange', throwCount.value)
    }
    return {
      confirmThrowChange,
      throwCount,
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
    min-width: 42rem;
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
      color: var(--black);
      margin-bottom: 2.1rem;
    }
    .input {
      font-weight: 700;
      @include text-game-name;
      margin-bottom: 2.1rem;
            color: var(--black);
      background-color: var(--white);
      border: 2px solid var(--black);
      outline: none;
    }
    .mainScore {
      font-weight: 700;
      @include score;
      display: flex;
      width: 100%;
      justify-content: center;
      color: var(--black);
    }
    .periodScore {
      font-weight: 700;
      @include text-game-name;
      display: flex;
      width: 100%;
      justify-content: center;
      color: var(--black);
      .periodScoreValue {
        display: flex;
        margin-bottom: 2rem;
      }
      .periodScoreValue + .periodScoreValue {
        margin-left: 1rem;
      }
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
