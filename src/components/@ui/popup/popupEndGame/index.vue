<template>
      <div :class="$style.overlay" @click="$emit('closePopup')">
        <div :class="$style.popupContainer" @click.stop>
        <v-icon :class="[$style.closeButton]" :name="'closePopup'" @click="$emit('closePopup')"></v-icon>
        <v-image v-if="stage === 2" :class="[$style.backButton]" @click="stage = 1" :name="'backBlack'"></v-image>
        <template v-if="stage === 1">
          <div :class="$style.title">Завершение игры</div>
          <v-btn v-if="$props.sportId !== 4 && $props.sportId !== 5 && $props.sportId !== 6"
          :class="[$style.button,
          (($props.sportId === 1 && $props.matchStatistics.period === 3) ||
          ($props.sportId === 2 && $props.matchStatistics.period === 2) ||
          ($props.sportId === 3 && $props.matchStatistics.period === 6) ||
          ($props.sportId === 4 && $props.matchStatistics.period === 5) ||
          ($props.sportId === 5 && (($props.matchStatistics.periodScore.length === 3 && $props.matchStatistics.period === 3) || ($props.matchStatistics.periodScore.length === 5 && $props.matchStatistics.period === 5))) ||
          ($props.sportId === 6 && $props.matchStatistics.period === 7)) && $style.disabled]"
          @click="$emit('makeEvent', {id: 35})"
          :color="'black'">
              Завершение {{$props.sportId === 3 ? 'четверти' :
              $props.sportId === 7 ? 'овера' : 'периода'}}
          </v-btn>
          <v-btn v-if="$props.sportId === 1" :class="[$style.button, !($props.matchStatistics.stage === 1 && $props.matchStatistics.period === 3) && $style.disabled]" @click="$emit('makeEvent', {id: 10})" :color="'black'">
              Игра по буллитам
          </v-btn>
          <v-btn v-if="$props.sportId === 2" :class="[$style.button, !($props.matchStatistics.stage === 1 && $props.matchStatistics.period === 2) && $style.disabled]" @click="$emit('makeEvent', {id: 20})" :color="'black'">
              Серия пенальти
          </v-btn>
          <v-btn :class="$style.button" @click="$emit('endGame')" :color="'black'">
              Завершение игры
          </v-btn>
          <v-btn :class="$style.button" @click="stage = 2" :color="'black'">
              Закончить игру по тех. причинам
          </v-btn>
          <v-btn :class="$style.button" v-if="$props.sportId === 4 || $props.sportId === 6" @click="stage = 3" :color="'black'">
              Закончить игру из-за травмы участника
          </v-btn>
          <v-btn :class="$style.button" v-if="$props.sportId === 4" @click="$emit('endGame', 'tech', 'Неподходящие погодные условия')" :color="'black'">
              Закончить игру из-за погодных условий
          </v-btn>
          <v-btn v-if="$props.sportId === 4 " @click="stage = 4" :color="'black'">
              Сменить режим игры
          </v-btn>
        </template>

        <template v-if="stage === 2">
          <div :class="$style.title">Закончить игру по тех. причинам</div>
          <div :class="$style.subtitle">Укажите причину</div>
          <input type="text" v-model="techInfo" placeholder="Опишите причину">
          <v-btn @click="$emit('endGame', 'tech', techInfo)" :color="'black'">
              ОК
          </v-btn>
        </template>

        <template v-if="stage === 3">
          <div :class="$style.title">Закончить игру из-за травмы участника</div>
          <div :class="$style.subtitle">Выберите игрока</div>
          <div :class="$style.selectContainer">
            <select
              :class="$style.select"
              :required="true"
              :value="false"
              v-model="player"
            >
              <option
                v-for="(item, index) in $props.playerArray"
                :key="index"
                :class="$style.optionItem"
                :selected="1"
              >
                {{ item }}
              </option>
            </select>
            <v-icon :class="[$style.selectArrow]" :name="'selectArrow'"></v-icon>
        </div>
          <v-btn @click="player && $emit('endGame', 'tech', `Травма игрока ${player}`)" :color="'black'">
              ОК
          </v-btn>
        </template>

        <template v-if="stage === 4">
          <div :class="$style.title">Сменить формат</div>
          <div :class="$style.subtitle">Выберите формат</div>
          <div :class="$style.selectContainer">
            <select
              :class="$style.select"
              :required="true"
              :value="false"
              @change="selectFormat"
              v-model="format.name"
            >
              <option
                v-for="(item, index) in formatArray"
                :key="index"
                :class="$style.optionItem"
                :selected="1"
              >
                {{ item.name }}
              </option>
            </select>
            <v-icon :class="[$style.selectArrow]" :name="'selectArrow'"></v-icon>
          </div>
          <v-btn @click="$emit('changeGameMode', formatArray[format.index])" :color="'black'">
              ОК
          </v-btn>
        </template>
        </div>
      </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
    name: 'v-popupEndGame',
    props: {
      sportId: {
        type: Number,
        defaul: 0,
      },
      playerArray: {
        type: Array,
        default: () => [],
      },
      matchStatistics: {
        type: Object,
        default: () => {},
      },
    },
  setup(props, context) {
    const router = context.root.$router
    const themeWhite = computed(() => context.root.$store.state.whiteTheme)
    const arrayProblems = ref(['Травма', 'Плохая погода', 'Проблема с инвентарём'])
    const formatArray = ref([
      {
        name: '3 Сета',
        mode: '3',
        length: 3,
      },
      {
        name: '5 Сетов',
        mode: '5',
        length: 5,
      },
      {
        name: '3 Сета пары',
        mode: '3D',
        length: 3,
      },
      {
        name: '5 Сетов пары',
        mode: '5D',
        length: 5,
      },
      {
        name: '3 Сета большой шлем',
        mode: '3B',
        length: 3,
      },
      {
        name: '5 Сетов большой шлем',
        mode: '5B',
        length: 5,
      },
      {
        name: 'Шорт',
        mode: '3S',
        length: 3,
      },
    ])
    const stage = ref(1)
    const techInfo = ref()
    const player = ref()
    const format = ref({
      name: null,
      index: null,
    })

    const selectFormat = (val) => {
      format.value.index = val.target.selectedIndex
    }

    const backToMenu = () => {
        router.push('/')
    }

    return {
      backToMenu,
      selectFormat,
      stage,
      techInfo,
      themeWhite,
      arrayProblems,
      player,
      format,
      formatArray,
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
    .backButton {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      width: 3rem;
      height: 3rem;
    }
    .title {
      text-align: center;
      font-weight: 700;
      @include button;
      margin-bottom: 1.7rem;
      color: var(--black);
    }
    .subtitle {
      font-weight: 400;
      @include text-small;
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--black);
    }
    .button {
        margin-bottom: 1rem;
    }
    .disabled {
      opacity: .4;
      pointer-events: none;
    }
    input {
      background: rgba(0, 0, 0, 0.05);
      width: 100%;
      border-radius: var(--border-radius);
      outline: none;
      border: 0;
      height: 5rem;
      padding: 0 1.5rem;
      margin: 1rem 0 2rem;
      color: var(--white);
      font-weight: 400;
      @include text-small;
      color: var(--buttonBackColor);
    }
    // input:hover {
    //   background: rgba(255, 255, 255, 0.15);
    // }
    // input:focus {
    //   border: 2px solid #FFFFFF;
    // }
  }
}
.invert {
    filter: invert(1);
}
.selectContainer {
  width: 100%;
  padding: 1rem 2rem 1.6rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius);
  position: relative;
  margin-bottom: 2rem;
  select{
      position: relative;
      -webkit-appearance: none;
      -moz-appearance: none;
      width: 100%;
      border: none;
      outline: none;
      background: rgba(0, 0, 0, 0.00);
      border-bottom: 1px solid var(--matchInfoUnderlineColor);
      padding-bottom: .9rem;
      color: var(--black);
      font-weight: 400;
      @include text-small;
      cursor: pointer;
  }
  option {
      color: black;
  }
  .selectArrow {
      position: absolute;
      width: 1.4rem;
      height: 0.9rem;
      top: 2.5rem;
      right: 2.4rem;
  }
}
</style>
