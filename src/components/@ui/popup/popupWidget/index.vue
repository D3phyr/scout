<template>
      <div :class="$style.overlay" @click="$emit('closePopupWidget')">
        <div :class="$style.popupContainer" @click.stop>
          <v-icon :class="[$style.closeButton]" :name="'closePopup'" @click="$emit('closePopupWidget')"></v-icon>

          <!--<div :class="$style.subtitle">{{$props.title === 'Замена' ? 'Приходит' : 'Игрок'}}</div>-->
          <div :class="$style.header">
            <div :class="$style.title">Конструктор виджетов</div>
            <div :class="$style.tabs">
              <v-btn v-show="item.isShow !== false" @click="chooseWidget(item)" v-for="(item) in tabs" :key="item.id" :class="[$style.button, $style.tab, item.active && $style.active]">
                {{ item.label }}
              </v-btn>
            </div>
            <div v-if="activeWidget.widget === 'Team'" :class="$style.teams">
              <div :class="$style.tabs">
                <v-btn @click="chooseTeam('Side_1')" :class="[$style.button, $style.tab, widgetSettings[activeWidget.widget].team === 'Side_1' && $style.active]">
                  {{ $props.matchInfo.Side_1.name }}
                </v-btn>
                <v-btn v-if="$props.matchInfo.Side_2" @click="chooseTeam('Side_2')" :class="[$style.button, $style.tab, widgetSettings[activeWidget.widget].team === 'Side_2' && $style.active]">
                  {{ $props.matchInfo.Side_2.name }}
                </v-btn>
              </div>
            </div>
            <div v-if="widgetSettings[activeWidget.widget]" :class="$style.fields">
              <div :class="$style.wrap">
                <div :class="$style.field">
                  <div :class="$style.subtitle">Положение</div>
                  <div :class="$style.selectContainer">
                    <select
                      :class="$style.select"
                      :required="true"
                      v-model="widgetSettings[activeWidget.widget].position"
                    >
                      <option value="" disabled selected>Выбрать</option>
                      <option
                        v-for="(item, index) in listPositions"
                        :key="index"
                        :class="$style.optionItem"
                        :value="item.value"
                      >
                        {{ item.label }}
                      </option>
                    </select>
                    <v-icon :class="[$style.selectArrow]" :name="'selectArrow'"></v-icon>
                  </div>
                </div>
                <div :class="$style.field">
                  <div :class="$style.subtitle">Ось X (%)</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].x" type="text" :placeholder="''">
                </div>
                <div :class="$style.field">
                  <div :class="$style.subtitle">Ось Y (%)</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].y" type="text" :placeholder="''">
                </div>
                <div :class="$style.field">
                  <div :class="$style.subtitle">Scale</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].scale" type="text" :placeholder="''">
                </div>
                <!--<div :class="$style.field">
                  <div :class="$style.subtitle">Origin X (%)</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].originX" type="text" :placeholder="''">
                </div>
                <div :class="$style.field">
                  <div :class="$style.subtitle">Origin Y (%)</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].originY" type="text" :placeholder="''">
                </div>-->
                <div :class="[$style.field, $style.colorPicker]">
                  <div :class="$style.subtitle">Color</div>
                  <input :class="$style.input" v-model="widgetSettings[activeWidget.widget].color" type="text" :placeholder="''">
                  <label :class="$style.pickerLabel">
                    <div :style="{ backgroundColor: widgetSettings[activeWidget.widget].color}" :class="$style.colorPicker"></div>
                    <input type="color" id="head" name="head" v-model="widgetSettings[activeWidget.widget].color">
                  </label>
                </div>
              </div>
              <v-btn :class="$style.button" @click="copyHref" :color="'black'">
                Копировать ссылку
              </v-btn>
            </div>
          </div>
          <div :class="$style.body">
            <!--<img src="./backgroundWidget.jpg" alt="">-->
            <component :statistics="statistics" :team="widgetSettings[activeWidget.widget].team" :convertedTimer="convertedTimer" v-if="widgetSettings[activeWidget.widget]" :events="$props.events" :allMatchData="matchInfo" :widgetData="matchInfo" :color="widgetSettings[activeWidget.widget].color" :style="{ [positionY] : widgetSettings[activeWidget.widget].y + '%', transform: `scale(${widgetSettings[activeWidget.widget].scale})`, transformOrigin : `${widgetSettings[activeWidget.widget].originX}% ${widgetSettings[activeWidget.widget].originY}%`, [positionX]: widgetSettings[activeWidget.widget].x + '%' }" :class="$style.widget" :is="activeWidget.widget"/>
            <!--<Online/>-->
          </div>
        </div>
      </div>
</template>

<script>
import Vue from 'vue'
import {
  ref,
  computed,
  reactive,
  nextTick,
} from '@vue/composition-api'
import widjets from '../../widgets/components'

export default {
    name: 'v-popupWidget',
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
      matchInfo: {
        type: Object,
        default: () => {},
      },
      events: {
        type: Array,
        default: () => [],
      },
      convertedTimer: {
        type: String,
        default: '',
      },
    },
  components: {
    ...widjets,
  },
  setup(props, ctx) {
    const store = ctx.root.$store
    console.log(store.state.token)
    const hasPlayers = computed(() => {
      const team1 = props.matchInfo.statistics.Side_1.Players
      Object.keys(team1).length === 0 && team1.constructor === Object
      const team2 = props.matchInfo.statistics.Side_2.Players
      Object.keys(team2).length === 0 && team2.constructor === Object
      // Проверка на то не пустой ли хоть один макет
      return !(Object.keys(team1).length === 0 && team1.constructor === Object) || !(Object.keys(team2).length === 0 && team2.constructor === Object)
    })
    const hasJudges = computed(() => {
      if (props.matchInfo.statistics?.Referee?.length) {
        return true
      } else return false
    })
    const activeWidget = computed(() => tabs.value.find(item => item.active))
    const listPositions = ref([
      // {
      //  id: 0,
      //  label: 'Низ',
      //  value: 'bottom, left',
      // },
      // {
      //  id: 1,
      //  label: 'Верх',
      //  value: 'top, left',
      // },
      // {
      //  id: 2,
      //  label: 'Лево',
      //  value: 'bottom, left',
      // },
      // {
      //  id: 3,
      //  label: 'Право',
      //  value: 'bottom, right',
      // },
      {
        id: 4,
        label: 'Верх-Лево',
        value: 'top,left',
      },
      {
        id: 5,
        label: 'Верх-Право',
        value: 'top,right',
      },
      {
        id: 6,
        label: 'Низ-Лево',
        value: 'bottom,left',
      },
      {
        id: 7,
        label: 'Низ-Право',
        value: 'bottom,right',
      },
    ])
    const tabs = ref([
      {
        id: 0,
        label: 'Онлайн',
        active: true,
        widget: 'Online',
      },
      {
        id: 1,
        label: 'Превью к игре / игровой счет',
        active: false,
        widget: 'Preview',
      },
      {
        id: 2,
        label: 'Статистика встречи',
        active: false,
        widget: 'Statistics',
      },
      {
        id: 3,
        label: 'Составы команд',
        active: false,
        widget: 'Team',
        isShow: hasPlayers.value,
      },
      {
        id: 4,
        label: 'Судейская бригада',
        active: false,
        widget: 'Judges',
        isShow: hasJudges.value,
      },
    ])
    const widgetSettings = reactive({
      Online: {
        x: 0,
        y: 0,
        scale: 1,
        originX: 0,
        originY: 0,
        color: '#FF2626',
        token: props.matchInfo.token,
        matchId: props.matchInfo.id,
        position: '',
      },
      Preview: {
        x: 0,
        y: 0,
        scale: 1,
        originX: 0,
        originY: 0,
        color: '#FF2626',
        token: props.matchInfo.token,
        matchId: props.matchInfo.id,
        position: '',
      },
      Statistics: {
        x: 0,
        y: 0,
        scale: 1,
        originX: 0,
        originY: 0,
        color: '#FF2626',
        token: props.matchInfo.token,
        matchId: props.matchInfo.id,
        position: '',
      },
      Team: {
        x: 0,
        y: 0,
        scale: 1,
        originX: 0,
        originY: 0,
        color: '#FF2626',
        token: props.matchInfo.token,
        matchId: props.matchInfo.id,
        position: '',
        team: 'Side_1',
      },
      Judges: {
        x: 0,
        y: 0,
        scale: 1,
        originX: 0,
        originY: 0,
        color: '#FF2626',
        token: props.matchInfo.token,
        matchId: props.matchInfo.id,
        position: '',
      },
    })
    const chooseWidget = (tab) => {
      const activeTab = activeWidget.value
      activeTab.active = false
      tab.active = true
    }
    const statisticsSide1 = computed(() => props.matchInfo.Side_1.statistics)
    const statisticsSide2 = computed(() => props.matchInfo.Side_2.statistics)
    const statistics = computed(() => {
      console.log(statisticsSide1.value, statisticsSide2.value)
      return {
        Side_1: statisticsSide1.value,
        Side_2: statisticsSide2.value,
      }
    })
    console.log(process.env.VUE_APP_ROOT_URL)
     const widgetUrl = computed(() => `${window.location.host}/widget/?type=${activeWidget.value.widget}&${widgetSettings[activeWidget.value.widget].position.split(',')[1]}=${widgetSettings[activeWidget.value.widget].x}&${widgetSettings[activeWidget.value.widget].position.split(',')[0]}=${widgetSettings[activeWidget.value.widget].y}&scale=${widgetSettings[activeWidget.value.widget].scale}&originX=${widgetSettings[activeWidget.value.widget].originX}&originY=${widgetSettings[activeWidget.value.widget].originY}&token=${widgetSettings[activeWidget.value.widget].token}&matchId=${widgetSettings[activeWidget.value.widget].matchId}&team=${widgetSettings.Team.team}&positionY=${positionY.value}&positionX=${positionX.value}&color=%23${widgetSettings[activeWidget.value.widget].color.split('#')[1]}`)
    // const widgetUrl = computed(() => widgetSettings[activeWidget.value.widget])
    const copyHref = async () => {
      await navigator.clipboard.writeText(widgetUrl.value)
      Vue.$toast.success('Ссылка успешно скопирована', {
        position: 'bottom-right',
      })
    }
    const changePosition = (event) => {
      console.log(event.target.value)
       const choosedItem = listPositions.value.find(el => el.id === +event.target.value)
       console.log(choosedItem)
       console.log(widgetSettings[activeWidget.value.widget])
       Vue.set(widgetSettings[activeWidget.value.widget], 'position', choosedItem)
       nextTick(() => {
        Vue.set(widgetSettings[activeWidget.value.widget], 'position', choosedItem)
       })

      // widgetSettings[activeWidget.value.widget].position = choosedItem
    }
    const positionY = computed(() => widgetSettings[activeWidget.value.widget].position.split(',')[0])
    const positionX = computed(() => widgetSettings[activeWidget.value.widget].position.split(',')[1])
    const chooseTeam = (name) => {
      widgetSettings[activeWidget.value.widget].team = name
    }
    return {
      tabs,
      chooseWidget,
      activeWidget,
      widgetSettings,
      widgetUrl,
      copyHref,
      hasPlayers,
      hasJudges,
      statistics,
      listPositions,
      changePosition,
      positionY,
      positionX,
      chooseTeam,
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
    width: 92.0rem;
    background: var(--white);
    border-radius: var(--border-radius);
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .closeButton {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      width: 1.4rem;
      height: 1.4rem;
    }
    .header {
      padding: 3rem 8.4rem;
      .teams {
        .tabs {
          display: flex;
          justify-content: center;
          .tab {
            font-size: 1.4rem;
            padding: 1rem 2.6rem;
            display: flex;
            align-items: center;
            justify-content: center;
            &:not(:last-child) {
              margin-right: 1.5rem;
            }
          }
        }
      }
      .tabs {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3rem;
        .button {
          &.tab {
            width: auto !important;
            height: 2.6rem;
            font-size: 1.4rem;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2rem;
            color: #000;
            font-weight: 400;
            transition: .2s;
            &.active {
              background: rgba(255, 9, 9, 0.1);
              color: #FF2626;
            }
          }
        }
      }

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
      width: 17.8rem !important;
    }
    .wrap {
      display: flex;
      align-items: flex-end;
    }
    .fields {
      display: flex;
      //justify-content: space-between;
      align-items: flex-end;
      justify-content: center;
      //margin-bottom: 3rem;
      .selectContainer {
        position: relative;
        width: 13rem;
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
    .field {
      position: relative;
      margin-right: 1.5rem;
      input {
        background: rgba(0, 0, 0, 0.05);
        //width: 100%;
        width: 6rem;
        border-radius: var(--border-radius);
        outline: none;
        border: 0;
        height: 5rem;
        padding: 0 1.5rem;
        //margin: 1rem 0 2rem;
        color: var(--black);
        font-weight: 400;
        @include text-small;
      }
      &.colorPicker {
        width: 13rem;
        input {
          width: 100%;
        }
      }
      .pickerLabel {
        position: absolute;
        right: 1.3rem;
        bottom: 1.3rem;
        .colorPicker {
          width: 2.4rem;
          height: 2.4rem;
          background: red;
          border-radius: 50%;
          border: .2rem solid #fff;
          box-shadow: 0px 2px 1px rgba(0, 0, 0, 0.25);
        }
      }
      input[type=color] {
        position: absolute;
        left: 0;
        bottom: 0;
        padding: 0;
        border: 0;
        background: unset;
        color: transparent;
        //display: none;
        width: 0;
        height: 0;
        visibility: hidden;
      }
    }

    .body {
      height: 49.4rem;
      background-image: url("./backgroundWidget.jpg");
      background-size: cover;
      background-repeat: no-repeat;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      position: relative;
      overflow: hidden;
      .widget {
        transition: .2s;
        position: absolute;
      }
    }
  }
}
.invert {
    filter: invert(1);
}
</style>
