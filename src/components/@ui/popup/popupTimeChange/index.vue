<template>
  <div :class="$style.overlay" @click="$emit('closePopupTimeChange')">
    <div :class="$style.popupContainer" @click.stop>
      <v-icon
        :class="[$style.closeButton, themeWhite && $style.invert]"
        :name="'closePopup'"
        @click="$emit('closePopupTimeChange')"
      ></v-icon>
      <div :class="$style.title">Изменение времени матча</div>
      <div :class="$style.mainScore">
        <!-- <div @input="onMainChangeLeft" contenteditable>{{proxyTimeLeft}}</div>:<div @input="onMainChangeRight" contenteditable>{{proxyTimeRight}}</div> -->
        <input type="text" v-model="proxyTimeLeft" maxlength="2" placeholder="00">:<input type="text" v-model="proxyTimeRight" maxlength="2" placeholder="00">
      </div>

      <div :class="$style.buttonContainer">
        <v-btn @click="confirmTimeChange" :color="'black'"> ОК </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api'
import Vue from 'vue'

export default {
  name: 'v-popupTimeChange',
  props: {
    timer: {
      type: Object,
      default: () => {},
    },
  },
  setup(props, ctx) {
    const timeAll = ref(props.timer.timerConverted)
    const proxyTimeLeft = ref('')
    const proxyTimeRight = ref('')
    const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)
    const { emit } = ctx

    const confirmTimeChange = () => {
      if ((Number(proxyTimeLeft.value) || Number(proxyTimeLeft.value) === 0) && (Number(proxyTimeRight.value) || Number(proxyTimeRight.value) === 0) && Number(proxyTimeRight.value) < 60) {
        const a = `${Number(proxyTimeLeft.value)}:${Number(proxyTimeRight.value)}`.split(':')
        const timerValue = ((+a[0]) * 60 + (+a[1]))
        emit('setNewTime', {
          timerConverted: `${Number(proxyTimeLeft.value)}:${Number(proxyTimeRight.value)}`,
          timerValue: timerValue,
        })
      } else {
        Vue.$toast.error('Невозможно применить введённое время', {
          position: 'bottom-right',
        })
      }
    }

    onMounted(() => {
      proxyTimeLeft.value = timeAll.value.split(':')[0]
      proxyTimeRight.value = timeAll.value.split(':')[1]
    })
    return {
      timeAll,
      proxyTimeLeft,
      proxyTimeRight,
      confirmTimeChange,
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
    width: 42rem;
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
      margin-bottom: 1.1rem;
      color: var(--black);
    }
    .mainScore {
      font-weight: 700;
      @include score;
      display: flex;
      width: 100%;
      justify-content: center;
      margin-bottom: 1rem;
      color: var(--black);
      input {
        width: 23%;
        outline: none;
        border: 0;
      }
      // div:first-child {
      //   // text-align: right;
      // }
      // div:last-child {
      //   // text-align: left;
      // }
    }
    .periodScore {
      font-weight: 700;
      @include text-game-name;
      display: flex;
      width: 100%;
      justify-content: center;
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
