<template>
  <div :class="$style.overlay" @click="$emit('closePopupScoreChange')">
    <div :class="$style.popupContainer" @click.stop>
      <v-icon
        :class="[$style.closeButton, themeWhite && $style.invert]"
        :name="'closePopup'"
        @click="$emit('closePopupScoreChange')"
      ></v-icon>
      <div :class="$style.title">Изменение счета матча</div>

      <div :class="$style.mainScore">
        <template v-if="$props.sportId !== 4">
          <div>{{proxyMatchStatistics.Side_1.score}}</div>
          :
          <div>{{proxyMatchStatistics.Side_2.score}}</div>
        </template>
        <template v-else>
          <div>{{proxyMatchStatistics.Side_1.tennisScore}}</div>
          :
          <div>{{proxyMatchStatistics.Side_2.tennisScore}}</div>
        </template>
      </div>

      <div :class="$style.periodScore">
        <!-- <span v-for="(item, index) in proxyMatchStatistics.value.periodScor" :key="index">{{index > 0 ? ' | ' : ''}}{{item[0]}} : {{item[1]}}</span> -->
        <div :class="[$style.periodScoreValue]" v-for="(item, index) in proxyMatchStatistics.periodScore" :key="index">
          <template>
            <input :class="(index >= $props.matchStatistics.period) && $style.hidden" @input="changePeriodScore(index)" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" type="text" v-model="item[0]" :disabled='index >= $props.matchStatistics.period' maxlength="3" placeholder="0">
            :
            <input :class="(index >= $props.matchStatistics.period) && $style.hidden" @input="changePeriodScore(index)" oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');" type="text" v-model="item[1]" :disabled='index >= $props.matchStatistics.period' maxlength="3" placeholder="0">
          </template>
        </div>
      </div>

      <div :class="$style.buttonContainer">
        <v-btn @click="confirmScoreChange" :color="'black'"> ОК </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
import Vue from 'vue'

export default {
  name: 'v-popupScoreChange',
  props: {
    matchStatistics: {
      type: Object,
      default: () => {},
    },
    sportId: {
      type: Number,
      default: 0,
    },
  },
  setup(props, ctx) {
    const proxyMatchStatistics = ref(Object.assign({}, props.matchStatistics))
    const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)
    const { emit } = ctx

    const changePeriodScore = () => {
        let scoreRight = 0
        let scoreLeft = 0
        proxyMatchStatistics.value.periodScore.forEach((item, index) => {
          if (proxyMatchStatistics.value.period > index) {
            if (props.sportId === 1 || props.sportId === 2 || props.sportId === 3) {
              scoreLeft += Number(proxyMatchStatistics.value.periodScore[index][0])
              scoreRight += Number(proxyMatchStatistics.value.periodScore[index][1])
            } else if (props.sportId === 5 || props.sportId === 6 || (props.sportId === 4 && props.matchStatistics.gameMode === '3S')) {
              scoreLeft = Number(proxyMatchStatistics.value.periodScore[index][0])
              scoreRight = Number(proxyMatchStatistics.value.periodScore[index][1])
            }
          }
        })
        if (props.sportId !== 4 || props.matchStatistics.gameMode === '3S') {
          proxyMatchStatistics.value.Side_1.score = scoreLeft
          proxyMatchStatistics.value.Side_2.score = scoreRight
          if (props.sportId === 4) {
            proxyMatchStatistics.value.Side_1.tennisScore = scoreLeft
            proxyMatchStatistics.value.Side_2.tennisScore = scoreRight
          }
        }
    }

    const confirmScoreChange = () => {
      if ((Number(proxyMatchStatistics.value.Side_1.score) || Number(proxyMatchStatistics.value.Side_1.score) === 0 || proxyMatchStatistics.value.Side_1.score === 'AD') && (Number(proxyMatchStatistics.value.Side_2.score) || Number(proxyMatchStatistics.value.Side_2.score) === 0 || proxyMatchStatistics.value.Side_2.score === 'AD')) {
        let emitEnable = true
        proxyMatchStatistics.value.periodScore.every((item) => {
          item[0] = Number(item[0])
          item[1] = Number(item[1])
          if (!((Number(item[0]) || Number(item[0]) === 0) && (Number(item[1]) || Number(item[1]) === 0))) {
            Vue.$toast.error('Невозможно применить введённые очки', {
              position: 'bottom-right',
            })
            emitEnable = false
            return false
          }
          return true
        })
        if (emitEnable) {
          emit('setNewScore', proxyMatchStatistics.value)
        }
      } else {
        Vue.$toast.error('Невозможно применить введённые очки', {
          position: 'bottom-right',
        })
      }
    }

    return {
      themeWhite,
      proxyMatchStatistics,
      confirmScoreChange,
      changePeriodScore,
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
    max-width: 70rem;
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
      font-weight: 500;
      @include score;
      display: flex;
      width: 100%;
      justify-content: center;
      color: var(--black);
      input {
        width: 100%;
        outline: none;
        border: 0;
      }
      input:first-child {
        text-align: right;
      }
      input:last-child {
        text-align: left;
      }
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
        width: 22%;
        input {
          width: 100%;
          outline: none;
          border: 0;
        }
        input:first-child {
          text-align: right;
        }
        input:last-child {
          text-align: left;
        }
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
  .hidden {
    // display: none;
    opacity: 0.4;
    pointer-events: none;
  }
}
.invert {
    filter: invert(1);
}
</style>
