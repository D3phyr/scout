/* eslint-disable */
<template>
  <div :class="[$style.wrapper]">
    <div v-if="matchStatistics.stage > 0 && matchStatistics.stage !== 3 && userRole === 2" :class="[$style.colorBackground, timer.timerRun ? $style.green : $style.yellow, !internetConnection && $style.red]"></div>
    <div :class="$style.proxyHeaderContainer">
      <v-matchHeader
      :token="$props.data.match.token"
      :stage="matchStatistics.stage"
      :socketConnect="socketConnect"
      :freeButtonMovement="freeButtonMovement"
      :lastDeletableEventIndex="lastDeletableEventIndex"
      @deleteEvent="deleteEvent"
      @downloadProtocol="downloadProtocol"
      @changeControlPanel="changeControlPanel"
      @endGame="popup.endGame = true"
      @openPopupWidget="popup.widgetIsShow = true"
      @openPopupMatchLinkChange="popup.matchLinkChange = true"
      ></v-matchHeader>
    </div>

    <div :class="$style.title">
      <div :class="$style.backButton" v-if="matchStatistics.stage === 0 || matchStatistics.stage === 3 || userRole === 3">
        <v-image @click="$router.push('/')" :name="'back'"></v-image>
      </div>

      <span v-for="(item, index) in sportArray" :key="index">
        <template v-if="$props.data.match.sportId === item.id">
          {{item.name}}
          {{settings[`${$props.data.match.sportId}`] ? settings[`${$props.data.match.sportId}`][`${matchStatistics.gameMode}`].name : ''}}
        </template>
      </span>

      <span :class="$style.white">
        {{matchStatistics.Side_1.name}} - {{matchStatistics.Side_2.name}}: {{gameTime}}
      </span>
    </div>

    <div :class="[$style.controls, userRole === 3 && $style.spectatorView]">
      <!-- Контроллер левой команды -->
      <v-control-panel
      v-if="matchStatistics.stage !== 3 && userRole === 2"
      :teamInfo="matchStatistics.Side_1"
      :stage="matchStatistics.stage"
      :sportId="$props.data.match.sportId"
      :socketConnect="socketConnect"
      :animation="timer.Side_1.holdIntervalRun"
      :freeButtonMovement="freeButtonMovement"
      :gameEnd="gameEnd"
      @makeEvent="makeEvent"
      @controlsChange="controlsChange"
      @setNewTeamColor="setNewTeamColor"
      @endGame="endGame"
      ></v-control-panel>

      <!-- Центральный контроллер -->
      <v-score-panel
      v-if="reRender"
      :class="[$style.score]"
      :sportId="$props.data.match.sportId"
      :timer="timer"
      :matchStatistics="matchStatistics"
      :stage="matchStatistics.stage"
      :socketConnect="socketConnect"
      :freeButtonMovement="freeButtonMovement"
      :gameEnd="gameEnd"
      @makeEvent="makeEvent"
      @controlsChange="controlsChange"
      @changeTime="popup.timeChange = true"
      @changeScore="popup.scoreChange = true"
      ></v-score-panel>

      <!-- Контроллер правой команды -->
      <v-control-panel
      v-if="matchStatistics.stage !== 3 && userRole === 2"
      :teamInfo="matchStatistics.Side_2"
      :stage="matchStatistics.stage"
      :sportId="$props.data.match.sportId"
      :socketConnect="socketConnect"
      :animation="timer.Side_2.holdIntervalRun"
      :freeButtonMovement="freeButtonMovement"
      :gameEnd="gameEnd"
      @makeEvent="makeEvent"
      @controlsChange="controlsChange"
      @setNewTeamColor="setNewTeamColor"
      @endGame="endGame"
      ></v-control-panel>


      <div v-if="userRole === 3" :class="$style.matchVideoContainer">
        <video ref="video" autoPlay muted webkit-playsinline="true" playsInline preload="auto" tabindex="-1"></video>
      </div>
    </div>

    <div :class="$style.subtitle">Протокол событий</div>
    <v-infoTable
    :data="tableData"
    :sportId="$props.data.match.sportId"
    :stage="matchStatistics.stage"
    :lastDeletableEventIndex="lastDeletableEventIndex"
    @deleteItem="popup.delete = true"
    @editItem="popup.player = true"
    ></v-infoTable>

    <portal to="popup">
      <v-popupPlayer
      v-if="popup.player"
      @closePopupPlayer="popup.player = false"
      ></v-popupPlayer>
    </portal>

    <portal to="popup">
      <v-popupDelete
      v-if="popup.delete"
      @closePopupDelete="popup.delete = false"
      @deleteItem="deleteEvent"
      ></v-popupDelete>
    </portal>

    <!-- <portal to="popup">
      <v-popupTimeout
      v-if="popupTimeout"
      :array="teamsArray"
      @closePopupTimeout="popupTimeout = !popupTimeout"
      @popupTimeoutValue="popupTimeoutValue"
      ></v-popupTimeout>
    </portal> -->

    <portal to="popup">
      <v-popupTimeChange
      v-if="popup.timeChange"
      :timer="timer"
      @closePopupTimeChange="popup.timeChange = false"
      @setNewTime="setNewTime"
      ></v-popupTimeChange>
    </portal>

    <portal to="popup">
      <v-popupScoreChange
      v-if="popup.scoreChange"
      :matchStatistics="matchStatistics"
      :sportId="$props.data.match.sportId"
      @closePopupScoreChange="popup.scoreChange = false"
      @setNewScore="setNewScore"
      ></v-popupScoreChange>
    </portal>

    <portal to="popup">
      <v-popupMatchLinkChange
      v-if="popup.matchLinkChange"
      :matchLink="matchLink"
      @closePopupMatchLinkChange="popup.matchLinkChange = false"
      @changeMatchLink="changeMatchLink"
      ></v-popupMatchLinkChange>
    </portal>

    <!-- <portal to="popup">
      <v-popupDisconnectOperator
      :style="{'display': popupDisconnectOperator ? 'flex' : 'none'}"
      main
      ></v-popupDisconnectOperator>
    </portal> -->

    <portal to="popup">
      <v-popupEndGame
      v-if="popup.endGame"
      @closePopup="popup.endGame = false"
      @makeEvent="makeEvent"
      @changeGameMode="changeGameMode"
      @endGame="endGame"
      :playerArray="playerArray.all"
      :matchStatistics="matchStatistics"
      :sportId="$props.data.match.sportId"
      ></v-popupEndGame>
    </portal>

    <portal to="popup">
      <v-popupWidget
      v-if="popup.widgetIsShow"
      @closePopupWidget="popup.widgetIsShow = false"
      :matchInfo="$props.data.match"
      :convertedTimer="timer.timerConverted.length < 7 ? timer.timerConverted : '00:00'"
      ></v-popupWidget>
    </portal>

  </div>
</template>
<script>
/* eslint-disable */



// Как это работает:
// Нажимая на различные кнопки в интерфейсе наблюдателя мы будем вызывать различные события
// События делятся на 3 типа:
// 1. События не влияющие на счетчики и не влияющие на время
// Такие события можно легко откатить и глобального они ничего не делают
// Пример: Аут, удар в створ и тд.
// 2. События влияющие на счетчики и не влияющие на время
// Такие события вызывают логику или увеличение параметров матча, можно откатить
// Пример: Гол, Желтая карточка и тд.
// 3. События влияющие на время
// Такие события вызывают остановку или продолжнеие работы таймера
// НИ В КОЕМ СЛУЧАЕ НЕ УДАЛЯЙТЕ ТАКИЕ СОБЫТИЯ
// Пример: Пауза, Таймаут, Возобновление игры, Изменение времени


// Сами копки заданы в store.JSON
// Там прописано название кнопки и id события которое оно должно вывести
// Список событий указан в events.JSON
// В случае добавления новых событий на бэке, обновляйте свой файл тоже
// Пример события: 
// {
//   "eventId": 1, Id События
//   "eventName": "Гол", Его название в протоколе событий
//   "eventColor": "green", Его цвет в протоколе
//   "deletable": true, Можно ли его удалить в протоколе
//   "editable": true, Можно ли его изменить в протоколе
//   "record": true, Будет ли он отображаться в протоколе
//   "method": "paramIncrease", Какой метод он вызовет при нажатии
//   "methodParam": "score", Какой параметр статистики он может увеличить при вызове
//   "methodValue": 1 На сколько он его увеличит
// }

// Некоторые события не вызываются нажатие кнопок через панели оператора
// Они напрямую отправляются в соккет

// Загрузка событий происходит:
// 1. Загрузка всех событий в таблицу
// 2. Приравнивание состояние матча к последнему действительному неудалённому событию
// 3. Подсчет времени в зависимости от включонности таймера на последнем событии

// Наблдюдатель работает:
// 1. Получает событие по вебсоккету
// 2. Передаёт его emit'ом в родительский компонент и добавляет в массив с событиями
// 3. Запускается метод загрузки матча

// В теннисе присутствует сложная логика сэтов и периодов, которые зависят от режима игры
// + особый счет который накладывается поверх обычного увеличения на 1
// Как правило, теннис работаеет так:
// По достижению в партии счета AD или выше игроку присуждается победа
// Счет в текущем периоде становится 1:0
// Такие сэты играются до 6 очков с преимуществом в 2
// Вслучае если счет 6:6 играется тай-брейк
// В нем счет увеличевается на 1 и должен достигнуть определённой отметки для победы в периоде
// Все настройки указаны в файле settings.json
// Пример: 
//  "4": {                                         id спорта
//         "3": {                                  режим игры
//             "name": "3 Сета",                   название режима
//             "settings": { 
//                 "period_1": {                   номер периода
//                     "set_13": {                 номер сэта
//                         "type": "tie-break",    особые правила проведения сэта
//                         "win_condition": 7,     колличество очков для победа
//                         "score_difference": 2   преимущество в очках
//                     }
//                 },
//                 "period_2": {
//                     "set_13": {
//                         "type": "tie-break",
//                         "win_condition": 7,
//                         "score_difference": 2
//                     }
//                 },
//                 "period_3": {
//                     "set_13": {
//                         "type": "tie-break",
//                         "win_condition": 7,
//                         "score_difference": 2
//                     }
//                 }
//             }
//         },
//  }
// Учтите что особые правила могут быть сразу же у периода

// Советую просмотреть цепочку методов самых базовых событий, для ознакомления с первичным фунционалом кнопок

// На блокирование кнопок для пользователя влияют:
// 1. Подключение к интернету\соккету
// 2. Стадия игры
// 3. Наличие задержки

// stage = 0 Матч не начат
// stage = 1 Матч начат
// stage = 2 Матч на пенальти/булиттах
// stage = 3 Матч окончен


import {
  ref, onMounted, computed,
  onUnmounted,
  //watch,
  nextTick,
  } from '@vue/composition-api'
import Vue from 'vue'
import {
  clearInterval,
  setInterval,
} from 'worker-timers'
import events from './../events.json'
import settings from './settings.json'
import Hls from 'hls.js'

export default {
  name: 'match-all',
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    spectatorToken: {
      type: String,
      default: '',
    },
  },
  setup(props, context) {
    const store = context.root.$store
    const { emit } = context
    const themeWhite = computed(() => context.root.$store.state.whiteTheme)
    const userRole = computed(() => store?.state?.roleId)
    const userToken = computed(() => store?.state?.token)
    const sportArray = computed(() => store?.state?.allKindsOfSport)

    const matchLink = ref(props.data.match.statistics.matchLink)

    const lastDeletableEventIndex = computed(() => {
      let index = null
      for (let i = 0; i < tableData.value.length; i += 1) {
        if ((tableData.value[i].event.deletable) && (tableData.value[i].status !== 'deleted')) {
          index = i
          break
        }
      }
      return index
    })

    const gameEnd = computed(() => {
      if (props.data.match.sportId === 4 || props.data.match.sportId === 5 || props.data.match.sportId === 6) {
        const periodToWin = Math.ceil(matchStatistics.value.periodScore.length / 2)
        let Side_1 = 0
        let Side_2 = 0
        matchStatistics.value.periodScore.map((item) => {
          if (item[0] > item[1]) {
            Side_1 += 1
          } else if (item[0] < item[1]) {
            Side_2 += 1
          }
        })
        if (matchStatistics.value.period > matchStatistics.value.periodScore.length || Side_1 === periodToWin || Side_2 === periodToWin) {
          return true
        }
      }
      return false
    })

    const popup = ref({
      endGame: false,
      delete: false,
      widgetIsShow: false,
      matchLinkChange: false,
      scoreChange: false,
      timeChange: false,
      player: false,
    })


    const reRender = ref(true)

    const freeButtonMovement = ref(false)
    const controlPanelNew = ref()

    const timer = ref({
      timerInterval: 0,
      timerRun: false,
      timerValue: 0,
      timerEvent: [0, 0],
      timerConverted: '00:00',
      Side_1: {
        holdInterval: 0,
        holdIntervalRun: false,
      },
      Side_2: {
        holdInterval: 0,
        holdIntervalRun: false,
      },
    })

    const internetConnection = ref(true)
    const socketConnect = ref(false)

    const matchStatistics = ref({
      Side_1: {
        name: props.data.match.statistics.Side_1.name,
        score: 0,
        tennisScore: 0,
        redCard: 0,
        yellowCard: 0,
        cornerKick: 0,
        foul: 0,
        delay: 0,
        color: props.data.match.statistics.Side_1.color,
        holdTime: 0,
        holdTimeBasket: 0,
      },
      Side_2: {
        name: props.data.match.statistics.Side_2.name,
        score: 0,
        tennisScore: 0,
        redCard: 0,
        yellowCard: 0,
        cornerKick: 0,
        foul: 0,
        delay: 0,
        color: props.data.match.statistics.Side_2.color,
        holdTime: 0,
        holdTimeBasket: 0,
      },
      periodScore: [],
      period: 1,
      stage: 0,
      cypher: -1,         // Уникальный ключ события в текущем матче, нужен для дальнейшего взаимодействия с отправленным событием
      gameMode: props.data.match.statistics.gameMode,
    })

    const playerArray = computed(() => {
      const array1 = []
      const array2 = []
      Object.values(props.data.match.statistics.Side_1.Players).forEach((item) => {
        array1.push(item.name)
      })
      Object.values(props.data.match.statistics.Side_2.Players).forEach((item) => {
        array2.push(item.name)
      })
      return {
        Side_1: array1,
        Side_2: array2,
        all: array1.concat(array2)
      }
    })


    const tableData = ref([])

    const currentEvent = ref({})

    const socketData = ref({})   // Объект для изменения объекта статистики матча

    const convertedTime = computed(() => {
      const monthNames = [
        'янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.',
        'июл.', 'авг.', 'сен.', 'окт.', 'нояб.', 'дек.',
      ]
      const time = convertTime(monthNames)
      return time
    })

    const gameTime = computed(() => {
      const monthNames = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
      ]
      const time = convertTime(monthNames)
      return time
    })

    // Текущее Московское время для таблицы
    const MCWTime = () => {
      const MSCtime = new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }).split(' ')[1]
      return `${MSCtime.split(':')[0]}:${MSCtime.split(':')[1]}:${MSCtime.split(':')[2]}`
    }

    // Заполнение periodScore в зависимости от колличества times в объекте матча
    const convertedPeriods = () => {
      const array = []
      array.length = props.data.match.statistics.times.length
      array.fill([0, 0], 0, props.data.match.statistics.times.length)
      matchStatistics.value.periodScore = JSON.parse(JSON.stringify(array))
      if (props.data.match.sportId === 3) {
        if (props.data.match.statistics.basket_period_time === 10) {
          timer.value.timerValue = 600
        } else if (props.data.match.statistics.basket_period_time === 12) {
          timer.value.timerValue = 720
        }
        changeTimeFormat()
      }
    }

    const convertTime = (monthArray) => {
      let time = new Date(props.data.match.date)
        const day = time.getDate()
        const year = time.getFullYear()
        const month = monthArray[time.getMonth()]
        time = `${day} ${month} ${year}`
        return time
    }

    // Изменение вида времени для таблицы и бэка
    const changeTimeFormat = () => {
      timer.value.timerConverted = converTimeToMMSS(timer.value.timerValue)
      timer.value.timerEvent = (timer.value.timerConverted.split(':')).map(item => parseInt(item, 10))
      timerStopCheck()
    }

    // Перевод времени в ММ:СС
    const converTimeToMMSS = (val) => {
      let min = Math.floor(val / 60)
      let sec = val % 60
      if (sec < 10) {
        sec = `0${sec}`
      }
      if (min < 10) {
        min = `0${min}`
      }
      return `${min}:${sec}`
    }

    // Отсчет таймера или владения
    const countdown = (team) => {
      let enemyTeam
      if (team === 'Side_1') {
        enemyTeam = 'Side_2'
      } else {
        enemyTeam = 'Side_1'
      }
      if (team) {
        matchStatistics.value[`${team}`].holdTime += 1
        if (props.data.match.sportId === 3) {
          matchStatistics.value[`${team}`].holdTimeBasket += 1
          if (matchStatistics.value[`${team}`].holdTimeBasket === 25) {
            timer.value[`${team}`].holdIntervalRun = false
            clearInterval(timer.value[`${team}`].holdInterval)
            matchStatistics.value[`${team}`].holdTimeBasket = 0
            changeHoldTime(null, null, enemyTeam)
          }
        }
      } else {
        if (props.data.match.sportId === 3) {
          timer.value.timerValue -= 1
        } else {
          timer.value.timerValue += 1
        }
        changeTimeFormat()
      }
    }

    // Смена таймера
    const timerChange = (val) => {
      if (val === 'start' || val === 'continue') {
        timer.value.timerRun = true
        timer.value.timerInterval = setInterval(() => countdown(), 1000)
        socketData.value['Match.statistics.Idtimeevent'] = '=44'
        socketData.value['Match.statistics.for_api.Idtimeevent'] = '=44'
        socketData.value['Match.statistics.isPaused'] = '=false'
        socketData.value['Match.statistics.for_api.isPaused'] = '=false'
        if (val === 'start') {
          matchStatistics.value.stage = 1
        }
      } else if (val === 'stop' || val === 'end') {
        timer.value.timerRun = false
        clearInterval(timer.value.timerInterval)
        socketData.value['Match.statistics.Idtimeevent'] = '=45'
        socketData.value['Match.statistics.for_api.Idtimeevent'] = '=45'
        socketData.value['Match.statistics.isPaused'] = '=true'
        socketData.value['Match.statistics.for_api.isPaused'] = '=true'
        if (val === 'end') {
          matchStatistics.value.stage = 3
        }
      }
    }

    // Проверка таймера на остановку
    const timerStopCheck = () => {
      if (userRole.value === 2 && timer.value.timerRun) {
        if (props.data.match.sportId === 1) {
          if (timer.value.timerValue === 1200 * matchStatistics.value.period) {
            makeEvent({id: 8})
          }
        } else if (props.data.match.sportId === 2) {
          if (timer.value.timerValue === Number(props.data.match.statistics.basket_period_time) * 60 * matchStatistics.value.period) {
            makeEvent({id: 8})
          }
        } else if (props.data.match.sportId === 3) {
          if (timer.value.timerValue === 0) {
            makeEvent({id: 8})
          }
        }
      }
    }

    // Изменение формата очков для тенниса
    const scoreFormatChange = (type) => {
      if (type) {
        matchStatistics.value.Side_1.tennisScore = matchStatistics.value.Side_1.score
        matchStatistics.value.Side_2.tennisScore = matchStatistics.value.Side_2.score
      } else {
        const tennisScoreArray = ['0', '15', '30', '40', 'AD']
        matchStatistics.value.Side_1.tennisScore = tennisScoreArray[matchStatistics.value.Side_1.score]
        matchStatistics.value.Side_2.tennisScore = tennisScoreArray[matchStatistics.value.Side_2.score]
      }
    }

    // Проверка на автоматическую смену сэта
    const changeSetCheck = (team) => {
      let teamWin
      let teamLose
      let teamWinIndex
      let teamLoseIndex
      if (team === 'Side_1') {
        teamWin = 'Side_1'
        teamLose = 'Side_2'
        teamWinIndex = 0
        teamLoseIndex = 1
      } else {
        teamWin = 'Side_2'
        teamLose = 'Side_1'
        teamWinIndex = 1
        teamLoseIndex = 0
      }
      if (props.data.match.sportId === 4) {
        const period = settings[props.data.match.sportId][matchStatistics.value.gameMode].settings[`period_${matchStatistics.value.period}`]
        let set
        if (period[`set_${matchStatistics.value.periodScore[matchStatistics.value.period - 1][0] + matchStatistics.value.periodScore[matchStatistics.value.period - 1][1] + 1}`]) {
          set = period[`set_${matchStatistics.value.periodScore[matchStatistics.value.period - 1][0] + matchStatistics.value.periodScore[matchStatistics.value.period - 1][1] + 1}`]
        }
        if (period && period.type === "short") {
          putScoreToPeriodScore()
          if (matchStatistics.value[`${teamWin}`].score >= period.win_condition && Math.abs(matchStatistics.value[`${teamWin}`].score - matchStatistics.value[`${teamLose}`].score) >= period.score_difference) {
            changePeriod()
          }
          scoreFormatChange('default')
        } else if (period && period.type === "super-tie-break") {
          putScoreToPeriodScore()
          if (matchStatistics.value[`${teamWin}`].score >= period.win_condition) {
            changePeriod()
          }
          scoreFormatChange('default')
        } else if (set && set.type === "tie-break") {
          if (matchStatistics.value[`${teamWin}`].score >= set.win_condition && Math.abs(matchStatistics.value[`${teamWin}`].score - matchStatistics.value[`${teamLose}`].score) >= set.score_difference) {
            changeSet(teamWin)
            changePeriod()
          }
          scoreFormatChange('default')
        } else {
          if (matchStatistics.value[`${teamWin}`].score === 4 && matchStatistics.value[`${teamLose}`].score < 3
          || matchStatistics.value[`${teamWin}`].score === 5 && matchStatistics.value[`${teamLose}`].score === 3) {
            matchStatistics.value.Side_1.score = 0
            matchStatistics.value.Side_2.score = 0
            if (period && period.type === "long") {
              changeSet(teamWin, 'long')
            } else {
              changeSet(teamWin)
            }
          } else if (matchStatistics.value[`${teamWin}`].score === 4 && matchStatistics.value[`${teamLose}`].score === 4) {
            matchStatistics.value.Side_1.score = 3
            matchStatistics.value.Side_2.score = 3
          }
          if (period && period.type === "long" && matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamWinIndex] >= period.win_condition && (matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamWinIndex] - matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamLoseIndex]) >= period.score_difference) {
            changePeriod()
          }
          scoreFormatChange()
        }
      } else if (props.data.match.sportId === 5) {
        if (matchStatistics.value[`${teamWin}`].score >= 25 && Math.abs(matchStatistics.value[`${teamWin}`].score - matchStatistics.value[`${teamLose}`].score) >= 2) {
          changePeriod()
        }
      } else if (props.data.match.sportId === 6) {
        if (matchStatistics.value.period !== matchStatistics.value.periodScore.length) {
          if (matchStatistics.value[`${teamWin}`].score >= 11 && Math.abs(matchStatistics.value[`${teamWin}`].score - matchStatistics.value[`${teamLose}`].score) >= 2) {
            changePeriod()
          }
        } else {
          if (matchStatistics.value[`${teamWin}`].score >= Number(props.data.match.statistics.finall_period_max_score) && Math.abs(matchStatistics.value[`${teamWin}`].score - matchStatistics.value[`${teamLose}`].score) >= 2) {
            changePeriod()
          }
        }
      }
    }

    // Смена сэта
    const changeSet = (team, type) => {
      let teamLoseIndex
      let teamWinIndex
      if (team === 'Side_1') {
        teamWinIndex = 0
        teamLoseIndex = 1
      } else {
        teamWinIndex = 1
        teamLoseIndex = 0
      }
      if (matchStatistics.value.Side_1.delay === 1) {
        matchStatistics.value.Side_1.delay = 2
        matchStatistics.value.Side_2.delay = 1
      } else {
        matchStatistics.value.Side_1.delay = 1
        matchStatistics.value.Side_2.delay = 2
      }
      matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamWinIndex] += 1
      if (matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamWinIndex] >= 6 && Math.abs(matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamWinIndex] - matchStatistics.value.periodScore[matchStatistics.value.period - 1][teamLoseIndex]) >= 2 && type !== 'long') {
        changePeriod()
      }
    }

    // Проверка на распределение очков в периоды и смену сэтов
    const scoreCheck = (team) => {
      if (props.data.match.sportId !== 4 && matchStatistics.value.stage !== 2) {
        putScoreToPeriodScore()
      } 
      changeSetCheck(team)
    }

    // Проверка на изменение задержки путём набора очков
    const delayCheck = (team) => {
      if (props.data.match.sportId === 6) {
        if (matchStatistics.value.Side_1.delay === 1 && matchStatistics.value.Side_2.delay === 3) {
          matchStatistics.value.Side_1.delay = 0
          matchStatistics.value.Side_2.delay = 4
        } else if (matchStatistics.value.Side_1.delay === 1 && matchStatistics.value.Side_2.delay === 5) {
          matchStatistics.value.Side_1.delay = 2
          matchStatistics.value.Side_2.delay = 0
        } else if (matchStatistics.value.Side_2.delay === 1 && matchStatistics.value.Side_1.delay === 3) {
          matchStatistics.value.Side_2.delay = 0
          matchStatistics.value.Side_1.delay = 4
        } else if (matchStatistics.value.Side_2.delay === 1 && matchStatistics.value.Side_1.delay === 5) {
          matchStatistics.value.Side_2.delay = 2
          matchStatistics.value.Side_1.delay = 0
        }
      }
    }

    // Увеличение параметра matchStatistics.Side, задаётся из JSON
    const paramIncrease = (val, param, team) => {
      matchStatistics.value[team][param] += val
      scoreCheck(team)
      delayCheck(team)
    }

    // Смена периода игры
    const changePeriod = () => {
      matchStatistics.value.period += 1
      socketData.value['Match.statistics.Idtimeevent'] = '=24'
      socketData.value['Match.statistics.for_api.Idtimeevent'] = '=24'
      socketData.value['Match.statistics.for_api.Period'] = '+1'
      socketData.value['Match.statistics.period'] = '+1'
      socketData.value['Match.statistics.lastPeriodTimeSec'] = `=${timer.value.timerValue}`
      socketData.value['Match.statistics.for_api.lastPeriodTimeSec'] = `=${timer.value.timerValue}`
      if (props.data.match.sportId === 3) {
        if (matchStatistics.value.period < 5) {
          matchStatistics.value.Side_1.foul = 0
          matchStatistics.value.Side_2.foul = 0
          if (props.data.match.statistics.basket_period_time === 10) {
            timer.value.timerValue = 600
          } else if (props.data.match.statistics.basket_period_time === 12) {
            timer.value.timerValue = 720
          }
        } else {
          timer.value.timerValue = 300
          matchStatistics.value.periodScore.push([0, 0])
        }
        changeTimeFormat()
      }
      if (props.data.match.sportId === 4 || props.data.match.sportId === 5 || props.data.match.sportId === 6) {
        matchStatistics.value.Side_1.score = 0
        matchStatistics.value.Side_2.score = 0
        if (props.data.match.sportId === 6 || props.data.match.sportId === 4) {
            matchStatistics.value.Side_1.delay = 0
            matchStatistics.value.Side_2.delay = 0
        }
      }
    }

    // Смена стадии игры(буллиты в хоккее и пенальти в футболе)
    const changeStage = () => {
      matchStatistics.value.stage = 2
    }

    // Смена владения
    const changeHoldTime = (val, param, team) => {
      if (val === 'both') {
        if (timer.value.Side_1.holdIntervalRun) {
          timer.value.Side_1.holdIntervalRun = false
          clearInterval(timer.value.Side_1.holdInterval)
        }
        if (timer.value.Side_2.holdIntervalRun) {
          timer.value.Side_2.holdIntervalRun = false
          clearInterval(timer.value.Side_2.holdInterval)
        }
      } else {
        let enemyTeam
        if (team === 'Side_1') {
          enemyTeam = 'Side_2'
        } else {
          enemyTeam = 'Side_1'
        }
        if (timer.value[`${enemyTeam}`].holdIntervalRun) {
          timer.value[`${enemyTeam}`].holdIntervalRun = false
          clearInterval(timer.value[`${enemyTeam}`].holdInterval)
        }
        if (timer.value[`${team}`].holdIntervalRun) {
          timer.value[`${team}`].holdIntervalRun = false
          clearInterval(timer.value[`${team}`].holdInterval)
        } else {
          timer.value[`${team}`].holdInterval = setInterval(() => countdown(team), 1000)
          timer.value[`${team}`].holdIntervalRun = true
        }
        if (props.data.match.sportId === 3) {
          matchStatistics.value[`${team}`].holdTimeBasket = 0
          matchStatistics.value[`${enemyTeam}`].holdTimeBasket = 0
        }
      }
    }

    // Смена задержки
    const changeDelay = (val, param, team) => {
      let enemyTeam
      if (team === 'Side_1') {
        enemyTeam = 'Side_2'
      } else {
        enemyTeam = 'Side_1'
      }
      if (props.data.match.sportId === 3) {
        matchStatistics.value[`${team}`].delay = 1
        matchStatistics.value[`${enemyTeam}`].delay = 2
      }
      if (props.data.match.sportId === 4) {
        matchStatistics.value[`${team}`].delay = 1
        matchStatistics.value[`${enemyTeam}`].delay = 2
      }
      if (props.data.match.sportId === 6) {
        if (matchStatistics.value[`${team}`].delay === 0 && matchStatistics.value[`${enemyTeam}`].delay === 0) {
          matchStatistics.value[`${team}`].delay = 1
          matchStatistics.value[`${enemyTeam}`].delay = 3
        } else if (matchStatistics.value.Side_1.delay === 0 && matchStatistics.value.Side_2.delay === 2) {
          matchStatistics.value.Side_1.delay = 1
          matchStatistics.value.Side_2.delay = 3
        } else if (matchStatistics.value.Side_2.delay === 0 && matchStatistics.value.Side_1.delay === 2) {
          matchStatistics.value.Side_2.delay = 1
          matchStatistics.value.Side_1.delay = 3
        } else if (matchStatistics.value.Side_1.delay === 0 && matchStatistics.value.Side_2.delay === 4) {
          matchStatistics.value.Side_1.delay = 1
          matchStatistics.value.Side_2.delay = 5
        } else if (matchStatistics.value.Side_2.delay === 0 && matchStatistics.value.Side_1.delay === 4) {
          matchStatistics.value.Side_2.delay = 1
          matchStatistics.value.Side_1.delay = 5
        }
      }
    }

    // Сброс задержек
    const resetDelay = () => {
      matchStatistics.value.Side_1.delay = 0
      matchStatistics.value.Side_2.delay = 0
    }

    // Методы вызываемые из JSON
    const eventMethods = {
      paramIncrease,
      timerChange,
      changePeriod,
      changeStage,
      changeHoldTime,
      changeDelay,
      resetDelay
    }

    // Создание события, вызывается нажатием кнопки в одном из контроллеров, необходимо передать id ивента согласно events.json
    const makeEvent = (val, info) => {
      let currentItem
      let currentTeam
      matchStatistics.value.cypher += 1
      events.map((item) => {
        if (item.eventId === val.id) {
          currentItem = item
        }
      })
      if (currentItem.editable || currentItem.deletable) {
        if (info === matchStatistics.value.Side_1.name) {
          currentTeam = 'Side_1'
        } else if (info === matchStatistics.value.Side_2.name) {
          currentTeam = 'Side_2'
        }
      }
      if (currentItem.method) {
        eventMethods[currentItem.method](currentItem.methodValue, currentItem.methodParam, currentTeam)
      }
      if (currentItem.deletable) {
        setDefaultSocketData()
      } 
      socketData.value['Match.statistics.lastEventTimeSec'] = `=${timer.value.timerValue}`
      socketData.value['Match.statistics.for_api.lastEventTimeSec'] = `=${timer.value.timerValue}`
      socketData.value['Match.statistics.lastEventTimeMillSec'] = `=${Date.now()}`
      socketData.value['Match.statistics.for_api.lastEventTimeMillSec'] = `=${Date.now()}`
      if (currentTeam) {
        socketData.value[`Match.statistics.${currentTeam}.events.event_${currentItem.eventId}.count`] = '+1'
        socketData.value[`${currentTeam}.statistics.event_${currentItem.eventId}.count`] = '+1'
      }


      if (currentItem.record) {
        let stat = structuredClone(matchStatistics.value)
        tableData.value.unshift({
          date: convertedTime.value,
          gameTime: timer.value.timerConverted,
          dateNow: Date.now(),
          moscowTime: MCWTime(),
          event: currentItem,
          matchStatistics: stat,
          team: info ? info : '-',
          player: '-',
          deleteTime: '-',
          eventMessage: '',

          cypher: matchStatistics.value.cypher,
          status: 'loading',
        })
      }
      sendMessage(currentItem.eventId)
    }

    // Удаление события и приравнивание состояние к предыдущему удаляемому событию
    const deleteEvent = () => {
      let newEventIndex = lastDeletableEventIndex.value + 1
      for (let i = newEventIndex; i < tableData.value.length; i++) {
        if (tableData.value[i].cypher === 0 || (tableData.value[i].event.deletable && tableData.value[i].status !== 'deleted')) {
          newEventIndex = i
          break
        }
      }
      matchStatistics.value = tableData.value[newEventIndex].matchStatistics
      sendMessage(null, 'deleteEvent')
      tableData.value[lastDeletableEventIndex.value].status = 'deleted'
      showNotification('Событие удалено', 'success')
    }

    // Помещение текущего счета в счет периода
    const putScoreToPeriodScore = () => {
      if (props.data.match.sportId === 4 || props.data.match.sportId === 5 || props.data.match.sportId === 6) {
        matchStatistics.value.periodScore[matchStatistics.value.period - 1] = [matchStatistics.value.Side_1.score, matchStatistics.value.Side_2.score]
      } else {
        let localScoreLeft = 0
        let localScoreRight = 0
        matchStatistics.value.periodScore.forEach((item, index) => {
          if (matchStatistics.value.period > index + 1) {
            localScoreLeft += matchStatistics.value.periodScore[index][0]
            localScoreRight += matchStatistics.value.periodScore[index][1]
          }
        })
        matchStatistics.value.periodScore[matchStatistics.value.period - 1] = [matchStatistics.value.Side_1.score - localScoreLeft, matchStatistics.value.Side_2.score - localScoreRight]
      }
    }

    // type: 'addEvent'|'cancelOrEditEvent'|'startEvent'|'endEvent'
    // Отправка событий по соккету
    const sendMessage = (eventId, type) => {
      const message = {
        matchId: props.data.match.id,
        cypher: type !== 'deleteEvent' ? matchStatistics.value.cypher : undefined,
        eventId: type !== 'deleteEvent' ? eventId : undefined,
        canceledEvent: type === 'deleteEvent' ? tableData.value[lastDeletableEventIndex.value].cypher : undefined,
        type: (type === 'deleteEvent' || type === 'editEvent') ? 'cancelOrEditEvent' : eventId === 43 ? 'startEvent' : eventId === 44 ? 'endEvent' : 'addEvent',
        currentTime: timer.value.timerEvent,
        dateNow: Date.now(),
        comfort_data: (type !== 'editMatch') ? {
          matchStatistics: structuredClone(matchStatistics.value),
          timerValue: timer.value.timerValue,
          timerRun: timer.value.timerRun,
          event: eventId !== 3 ? tableData.value[0] : undefined,
        } : {},
        data: type !== 'deleteEvent' ? socketData.value : {},
      }
      socket.send(JSON.stringify(message))
      socketData.value = {}
      closePopups()
    }


    // Загрузка всей прошедшей статистики
    const loadStatistics = () => {
      tableData.value = []
      // Загрузка всех событий
      props.data.events.forEach((item) => {
        if (item) {
          if ((!item.deleted && Object.keys(item.comfort_data).length && item.comfort_data.event && item.comfort_data.event.event.deletable) || item.cypher === 0) {
            matchStatistics.value = item.comfort_data.matchStatistics
          } else {
            matchStatistics.value.cypher = item.cypher
          }
          if (item.comfort_data.event) {
            timer.value.timerValue = item.comfort_data.timerValue
            timer.value.timerRun = item.comfort_data.timerRun
            if (item.comfort_data.event.status === 'loading') {
              item.comfort_data.event.status = ''
            }
            if (item.deleted) {
              item.comfort_data.event.status = 'deleted'
            }
            tableData.value.unshift(item.comfort_data.event)
          }
        }
      })
      if (props.data.match.ended_at) {
        matchStatistics.value = tableData.value[0].matchStatistics
      }
      // Загрузка времени
      if (timer.value.timerRun) {
        let lastIntevalTime
        if (props.data.match.sportId === 3) {
          lastIntevalTime = tableData.value[0].dateNow - Date.now()
        } else {
          lastIntevalTime = Date.now() - tableData.value[0].dateNow
        }
        lastIntevalTime = Number((lastIntevalTime / 1000).toFixed(0))
        timer.value.timerValue += lastIntevalTime
        if (timer.value.timerValue < 0) {
          timer.value.timerValue = 1
        }
        timer.value.timerInterval = setInterval(() => countdown(), 1000)
      }
      changeTimeFormat()
      matchStatistics.value.Side_1.color = props.data.match.statistics.Side_1.color
      matchStatistics.value.Side_2.color = props.data.match.statistics.Side_2.color
      matchStatistics.value.Side_1.holdTimeBasket = 0
      matchStatistics.value.Side_2.holdTimeBasket = 0
      timer.value.Side_1.holdIntervalRun = false
      timer.value.Side_2.holdIntervalRun = false
    }

    // Окончание игры
    const endGame = (type, val) => {
      if (type) {
        socketData.value['Match.statistics.techEnd'] = '=true'
        socketData.value['Match.statistics.techEndInfo'] = `=${val}`
      } 
      changeHoldTime('both')
      if (props.data.match.sportId === 4 || props.data.match.sportId === 5 || props.data.match.sportId === 6) {
        convertPeriodPoint()
      }
      socketData.value['Match.statistics.Side_1.won'] = `=${matchStatistics.value.Side_1.score > matchStatistics.value.Side_2.score}`
      socketData.value['Match.statistics.Side_2.won'] = `=${matchStatistics.value.Side_1.score < matchStatistics.value.Side_2.score}`
      socketData.value['Match.statistics.isPaused'] = '=false'
      socketData.value['Match.statistics.for_api.isPaused'] = '=false'
      socketData.value['Side_1.statistics.wins_home'] = matchStatistics.value.Side_1.score > matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_1.statistics.wins_total'] = matchStatistics.value.Side_1.score > matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_2.statistics.fails_anywhere'] = matchStatistics.value.Side_1.score > matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_2.statistics.fails_total'] = matchStatistics.value.Side_1.score > matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_2.statistics.wins_anywhere'] = matchStatistics.value.Side_1.score < matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_2.statistics.wins_total'] = matchStatistics.value.Side_1.score < matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_1.statistics.fails_home'] = matchStatistics.value.Side_1.score < matchStatistics.value.Side_2.score ? '+1' : undefined
      socketData.value['Side_1.statistics.fails_total'] = matchStatistics.value.Side_1.score < matchStatistics.value.Side_2.score ? '+1' : undefined
      makeEvent({id: 44})
    }

    const convertPeriodPoint = () => {
      let Side_1 = 0
      let Side_2 = 0
      matchStatistics.value.periodScore.map((item) => {
        if (item[0] > item[1]) {
          Side_1 += 1
        } else if (item[0] < item[1]) {
          Side_2 += 1
        }
      })
      matchStatistics.value.Side_1.score = Side_1
      matchStatistics.value.Side_2.score = Side_2
    }

    // Изменение состояний отвечающих за счетчики в объекте матча
    const setDefaultSocketData = () => {
      socketData.value['Match.statistics.Side_1.points'] = `=${matchStatistics.value.Side_1.score}`
      socketData.value['Match.statistics.Side_2.points'] = `=${matchStatistics.value.Side_2.score}`
      socketData.value['Match.statistics.for_api.Side_1_points'] = `=${matchStatistics.value.Side_1.score}`
      socketData.value['Match.statistics.for_api.Side_2_points'] = `=${matchStatistics.value.Side_2.score}`
      socketData.value[`Match.statistics.Side_1.corner_kick_count`] = `=${matchStatistics.value.Side_1.cornerKick}`
      socketData.value[`Match.statistics.Side_2.corner_kick_count`] = `=${matchStatistics.value.Side_2.cornerKick}`
      socketData.value[`Match.statistics.Side_1.red_card_count`] = `=${matchStatistics.value.Side_1.redCard}`
      socketData.value[`Match.statistics.Side_2.red_card_count`] = `=${matchStatistics.value.Side_2.redCard}`
      socketData.value[`Match.statistics.Side_1.yellow_card_count`] = `=${matchStatistics.value.Side_1.yellowCard}`
      socketData.value[`Match.statistics.Side_2.yellow_card_count`] = `=${matchStatistics.value.Side_2.yellowCard}`
      socketData.value['Match.statistics.Side_1.basket_foul_count'] = `=${matchStatistics.value.Side_1.foul}`
      socketData.value['Match.statistics.Side_2.basket_foul_count'] = `=${matchStatistics.value.Side_2.foul}`
      socketData.value[`Match.statistics.times|${matchStatistics.value.period - 1}`] = `=${matchStatistics.value.Side_1.score} : ${matchStatistics.value.Side_2.score}`
      socketData.value[`Match.statistics.for_api.ScoreSets|${matchStatistics.value.period - 1}`] = `=${matchStatistics.value.Side_1.score} : ${matchStatistics.value.Side_2.score}`
      if (matchStatistics.value.Side_1.delay) {
        socketData.value['Match.statistics.servingSide'] = '=1'
      } else if (matchStatistics.value.Side_2.delay) {
        socketData.value['Match.statistics.servingSide'] = '=2'
      }
    }

    // Редактирование времени
    const setNewTime = (val) => {
      timer.value.timerValue = val.timerValue
      changeTimeFormat()
      makeEvent({id: 38})
    }

    // Редактирование счета
    const setNewScore = (val) => {
      matchStatistics.value.Side_1.score = val.Side_1.score
      matchStatistics.value.Side_2.score = val.Side_2.score
      matchStatistics.value.periodScore = val.periodScore
      if (props.data.match.sportId === 4 && matchStatistics.value.gameMode === '3S') {
        scoreFormatChange('default')
      }
      makeEvent({id: 37})
    }

    // Новый цвет у команд
    const setNewTeamColor = (val) => {
      if (val.team === matchStatistics.value.Side_1.name) {
        socketData.value['Match.statistics.Side_1.color'] = `=${val.color}`
      } else {
        socketData.value['Match.statistics.Side_2.color'] = `=${val.color}`
      }
      matchStatistics.value.cypher += 1
      sendMessage(41, 'editMatch')
    }

    // Новая ссылка трансляции
    const changeMatchLink = (val) => {
      socketData.value['Match.statistics.matchLink'] = `=${val}`
      matchStatistics.value.cypher += 1
      sendMessage(41, 'editMatch')
    }

    // Изменение режима игры у тенниса
    const changeGameMode = (val) => {
      matchStatistics.value.gameMode = val.mode
      socketData.value['Match.statistics.gameMode'] = `=${matchStatistics.value.gameMode}`
      socketData.value['Match.statistics.times_max_length'] = `=${val.length}`
      if (val.length === 3 && matchStatistics.value.periodScore.length !== 3) {
        matchStatistics.value.periodScore.splice(-2)
        socketData.value['Match.statistics.times|4'] = '['
        socketData.value['Match.statistics.times|3'] = '['
      } else if (val.length === 5 && matchStatistics.value.periodScore.length !== 5) {
        matchStatistics.value.periodScore.push([0, 0], [0, 0])
        socketData.value['Match.statistics.times|3'] = '=0 : 0'
        socketData.value['Match.statistics.times|4'] = '=0 : 0'
      }
      makeEvent({'id': 41})
    }

    const controlsChange = (val) => {
      controlPanelNew.value = val
    }

    // Изменение расстановки кнопок
    const changeControlPanel = async () => {
      freeButtonMovement.value = !freeButtonMovement.value
      if (!freeButtonMovement.value && controlPanelNew.value) {
        if (props.data.match.sportId === 1) {
          store.commit('changeRowHockey', controlPanelNew.value)
        } else if (props.data.match.sportId === 2) {
          store.commit('changeRowSoccer', controlPanelNew.value)
        } else if (props.data.match.sportId === 3) {
          store.commit('changeRowBasketball', controlPanelNew.value)
        } else if (props.data.match.sportId === 4) {
          store.commit('changeRowTennis', controlPanelNew.value)
        } else if (props.data.match.sportId === 5) {
          store.commit('changeRowVolleyball', controlPanelNew.value)
        } else if (props.data.match.sportId === 6) {
          store.commit('changeRowPingPong', controlPanelNew.value)
        } else if (props.data.match.sportId === 7) {
          store.commit('changeRowCricket', controlPanelNew.value)
        }
        await store.dispatch('postButtons', {
          buttons: controlPanelNew.value,
          sportId: props.data.match.sportId,
          operatorId: store.state.userId,
        })
      }
    }

    // Соккет
    let socket
    if (userRole.value === 3) {
      socket = new WebSocket(process.env.VUE_APP_SOCKET, props.spectatorToken)
    } else {
      socket = new WebSocket(process.env.VUE_APP_SOCKET, userToken.value)
    }
    const socketCloseListener = () => {
      socket.onmessage = async (event) => {
        const data = JSON.parse(event.data)
        if (userRole.value === 2) {
          if (data.result || data.type === 'Initial') {
            tableData.value.forEach((item) => {
              if (item.cypher === Number(data.cypher) && item.status === 'loading') {
                setTimeout(() => {
                  item.status = ''
                }, 200)
              }
            })
          } else {
            showNotification(`Ошибка отправки события. ${data.message}`, 'error')
          }
        } else {
          if (data.type === 'Disconnect') {
            // popup.disconnectOperator = true
          } else if (data.type === 'Connect') {
            // popup.disconnectOperator = false
          } else {
            if (timer.value.timerRun) {
              clearInterval(timer.value.timerInterval)
              timer.value.timerRun = false
            }
            emit('loadNewEvents', data)
            loadStatistics()
          }
        }
      }
      socket.onopen = () => {
        socketConnect.value = true
      }
      socket.onerror = () => {
        window.location.reload()
      }
    }
    socketCloseListener()

    // Закрытие всех popup'ов
    const closePopups = () => {
      Object.keys(popup.value).forEach(v => popup.value[v] = false)
    }

    // Показать всплывающее уведомление
    const showNotification = (text, type) => {
      Vue.$toast[type](text, {
        position: 'bottom-right',
      })
    }

    // Подключение/отключение соккета при разворачивании/сворачивании страницы
    const visibilityCheck = () => {
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          socket.close()
          socketConnect.value = false
        } else {
          socket = ''
          if (userRole.value === 3) {
            socket = new WebSocket(process.env.VUE_APP_SOCKET, props.spectatorToken)
          } else {
            socket = new WebSocket(process.env.VUE_APP_SOCKET, userToken.value)
          }
          socketCloseListener()
        }
      })
    }

    // Скачивание протокола матча
    const downloadProtocol = async () => {
      const result = await store.dispatch('getMatchEvents', props.data.match.id)
      if (result) {
        showNotification('Ссылка на скачивание отправлена вам на почту', 'success')
      }
    }

    // Запустить ререндер чего-либо
    const triggerRender = () => {
      reRender.value = false
      nextTick(() => {
        reRender.value = true
      })
    }

    onMounted(() => {
      convertedPeriods()
      visibilityCheck()
      if (props.data.match.factically_started_at) {
        loadStatistics()
      }
      triggerRender()
      // Подключение к трансляции
      if (userRole.value === 3) {
        const hls = new Hls()
        const stream = props.data.match.statistics.matchLink
        const video = context.refs.video
        hls.loadSource(stream)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play()
        })
      }
    })

    onUnmounted(() => {
      socket.close()
      if (timer.value.timerRun) {
        clearInterval(timer.value)
      }
    })

    window.addEventListener('offline', () => {
      socket.close()
      internetConnection.value = false
      socketConnect.value = false
      showNotification('Проблема с интернет соединением, обновите страницу.', 'error')
    })

    return {
      themeWhite,
      userRole,
      userToken,
      sportArray,
      playerArray,
      lastDeletableEventIndex,
      settings: settings,
      gameEnd,


      matchLink,

      reRender,
      triggerRender,

      popup,

      timer,
      MCWTime,
      gameTime,
      convertTime,
      converTimeToMMSS,
      convertedTime,
      changeTimeFormat,

      convertedPeriods,

      freeButtonMovement,
      changeControlPanel,
      controlsChange,

      internetConnection,
      socketConnect,

      matchStatistics,
      tableData,

      currentEvent,

      makeEvent,
      deleteEvent,

      setNewTeamColor,
      changeMatchLink,
      setNewTime,
      setNewScore,

      socket,
      socketCloseListener,
      setDefaultSocketData,
      sendMessage,

      downloadProtocol,
      showNotification,
      visibilityCheck,
      closePopups,

      eventMethods,
      paramIncrease,
      timerChange,
      loadStatistics,

      scoreCheck,
      delayCheck,
      changeSetCheck,
      changeSet,
      scoreFormatChange,
      changeGameMode,
      putScoreToPeriodScore,
      endGame,
      convertPeriodPoint,
    }
  },
}
</script>
<style lang="scss" module src="./style.scss"></style>
