<template>
      <div :class="$style.overlay" @click="$emit('closePopupPlayer')">
        <div :class="$style.popupContainer" @click.stop>
          <v-icon :class="[$style.closeButton, themeWhite && $style.invert]" :name="'closePopup'" @click="$emit('closePopupPlayer')"></v-icon>
          <div :class="$style.title">Редактирование события</div>
          <div :class="$style.subtitle">{{$props.title === 'Замена' ? 'Приходит' : 'Игрок'}}</div>
          <div :class="$style.selectContainer">
            <select
              :class="$style.select"
              :required="true"
              @input="setProperty"
              :value="false"
            >
              <option
                v-for="(item, index) in $props.array"
                :key="index"
                :class="$style.optionItem"
                :selected="1"
              >
                {{ item }}
              </option>
            </select>
            <v-icon :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectArrow'"></v-icon>
        </div>
        <template v-if="$props.title === 'Удаление'">
            <div :class="$style.subtitle">Время</div>
            <div :class="$style.selectContainer">
                <select
                :class="$style.select"
                :required="true"
                @input="setPropertyFine"
                :value="false"
                >
                <option
                    v-for="(item, index) in $props.arrayFine"
                    :key="index"
                    :class="$style.optionItem"
                    :selected="1"
                >
                    {{ item }}
                </option>
                </select>
                <v-icon :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectArrow'"></v-icon>
            </div>
        </template>
        <!-- <template v-if="$props.title === 'Красная карточка' && $props.sportId === 6">
            <div :class="$style.subtitle">Штраф</div>
            <div :class="$style.selectContainer">
                <select
                :class="$style.select"
                :required="true"
                @input="setPropertyFine"
                :value="false"
                >
                <option
                    v-for="(item, index) in $props.arrayFine"
                    :key="index"
                    :class="$style.optionItem"
                    :selected="1"
                >
                    {{ item }}
                </option>
                </select>
                <v-icon :class="$style.selectArrow" :name="'selectArrow'"></v-icon>
            </div>
        </template> -->
        <template v-if="$props.title === 'Замена'">
            <div :class="$style.subtitle">Уходит</div>
            <div :class="$style.selectContainer">
                <select
                :class="$style.select"
                :required="true"
                :value="false"
                @input="setPropertyChange"
                >
                <option
                    v-for="(item, index) in $props.array"
                    :key="index"
                    :class="$style.optionItem"
                    :selected="1"
                >
                    {{ item }}
                </option>
                </select>
                <v-icon :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectArrow'"></v-icon>
            </div>
        </template>
        <v-btn @click="sendProperty" :color="'black'">
            ОК
        </v-btn>
        </div>
      </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'

export default {
    name: 'v-popupPlayer',
    props: {
        array: {
            type: Array,
            default: () => [],
        },
        arrayFine: {
            type: Array,
            default: () => [],
        },
        title: {
            type: String,
            default: '',
        },
        sportId: {
            type: Number,
            default: 0,
        },
        // arrayTeam1: {
        //     type: Array,
        //     default: () => [],
        // },
        // arrayTeam2: {
        //     type: Array,
        //     default: () => [],
        // },
        // currentEventTeam: {
        //     type: String,
        //     default: '',
        // },
        // team1: {
        //     type: String,
        //     default: '',
        // },
        // team2: {
        //     type: String,
        //     default: '',
        // },
    },
  setup(props, ctx) {
        const { emit } = ctx
        const property = ref('')
        const propertyChange = ref('')
        const propertyFine = ref('-')
        const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)
        const setProperty = (val) => {
          property.value = val.target.value
        }
        const setPropertyChange = (val) => {
          propertyChange.value = val.target.value
        }
        const sendProperty = () => {
          emit('popupPlayerValue', { player: property.value, fine: propertyFine.value, playerChange: propertyChange.value })
          emit('closePopupPlayer')
          propertyFine.value = '-'
        }
        const setPropertyFine = (val) => {
          propertyFine.value = val.target.value
        }
    return {
        setProperty,
        sendProperty,
        setPropertyChange,
        setPropertyFine,
        property,
        propertyFine,
        propertyChange,
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
    .subtitle {
      font-weight: 400;
      @include text-small;
      margin-bottom: 1rem;
      opacity: 0.5;
      color: var(--black);
    }
  }
  .selectContainer {
    position: relative;
    margin-bottom: 2.8rem;
    .select {
      position: relative;
      -webkit-appearance: none;
      -moz-appearance: none;
      border-radius: var(--border-radius);
      width: 100%;
      height: 5rem;
      border: none;
      outline: none;
      background: rgba(0, 0, 0, 0.05);
      padding: 0 1.5rem;
      font-weight: 400;
      @include text-small;
      cursor: pointer;
      color: var(--black);
      option {
        color: black;
      }
    }
    .selectArrow {
      position: absolute;
      top: 2.2rem;
      right: 1.5rem;
    }
  }
}
.invert {
    filter: invert(1);
}
</style>
