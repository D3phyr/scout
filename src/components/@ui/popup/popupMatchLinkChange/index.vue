<template>
  <div :class="$style.overlay" @click="$emit('closePopupMatchLinkChange')">
    <div :class="$style.popupContainer" @click.stop>
      <v-icon
        :class="[$style.closeButton, themeWhite && $style.invert]"
        :name="'closePopup'"
        @click="$emit('closePopupMatchLinkChange')"
      ></v-icon>

      <div :class="$style.title">Сcылка для просмотра</div>

      <input :class="$style.input" v-model="newLink" type="text" :placeholder="''">

      <div :class="$style.buttonContainer">
        <v-btn @click="confirmLinkChange" :color="'black'"> ОК </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
  name: 'v-popupBasketPenalty',
  props: {
    matchLink: {
      type: String,
      default: '',
    },
  },
  setup(props, ctx) {
    const { emit } = ctx
    const newLink = ref(props.matchLink)
    const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)

    const confirmLinkChange = () => {
      console.log(newLink.value, props.matchLink)
      if (newLink.value !== props.matchLink) {
        emit('changeMatchLink', newLink.value)
      }
    }

    return {
      confirmLinkChange,
      newLink,
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
      margin-bottom: 2.1rem;
      color: var(--black);
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
      color: var(--black);
      width: 100%;
      justify-content: center;
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
