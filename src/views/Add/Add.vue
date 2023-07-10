<template>
  <div :class="$style.wrapper">
    <div :class="$style.container">
      <div :class="$style.backButton" @click="stageBack">
        <v-image :name="'back'"></v-image>
      </div>
      <template v-if="stage === 0">
        <div :class="$style.title">Создать <span :class="$style.white">матч</span></div>
        <div :class="$style.gamesContainer">
          <div :class="$style.column">
            <div :class="$style.item" @click="changeStage('Hockey')">
              <img src="@/assets/Hockey.png" alt="">
              <div :class="$style.gameName">Хоккей</div>
            </div>
            <div :class="$style.item" @click="changeStage('Volleyball')">
              <img src="@/assets/Volleyball.png" alt="">
              <div :class="$style.gameName">Волейбол</div>
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.item" @click="changeStage('Basketball')">
              <img src="@/assets/Basketball.png" alt="">
              <div :class="$style.gameName">Баскетбол</div>
            </div>
            <div :class="$style.item" @click="changeStage('PingPong')">
              <img src="@/assets/PingPong.png" alt="">
              <div :class="$style.gameName">Настольный теннис</div>
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.item" @click="changeStage('Soccer')">
              <img src="@/assets/Soccer.png" alt="">
              <div :class="$style.gameName">Футбол</div>
            </div>
            <div :class="[$style.item]" @click="changeStage('Cricket')">
              <img src="@/assets/Cricket.png" alt="">
              <div :class="$style.gameName">Крикет</div>
            </div>
          </div>
          <div :class="$style.column">
            <div :class="$style.item" @click="changeStage('Tennis')">
              <img src="@/assets/Tennis.png" alt="">
              <div :class="$style.gameName">Большой теннис</div>
            </div>
          </div>
        </div>
      </template>
      <template v-if="stage === 1">
        <div :class="$style.title">
          <img :class="$style.sportImg" :src="require(`@/assets/${sportImg}.png`)" alt="">{{sportTitle}} <span :class="$style.white"></span>
        </div>
        <div :class="$style.infoContainer" @click="closeDate">
          <div :class="$style.infoContainer__upper">
            <v-match-info :class="$style.infoItem" :complited="matchTeam1 && matchTeam2" :title="'Участники'">
              <div :class="$style.matchTeams">
                <div :class="$style.teamContainer">
                  <div :class="$style.matchTeamItem">Участник №1:
                    <verte :class="$style.colorPicker" picker="square" v-model="colorTeam1" model="rgb"></verte>
                  </div>
                  <textarea @focus="team1focus = true" @blur="blurInput(1)" @input="searchTeam1(); team1Id = 0" :class="$style.textarea" v-model="matchTeam1"></textarea>
                  <div :class="$style.options" v-if="teamArray1 && matchTeam1 && team1focus">
                    <div :class="$style.optionsItem" @click="chooseTeam(1, item)" :key="index" v-for="(item, index) in teamArray1">{{item.name}}</div>
                  </div>
                </div>
                <div :class="$style.teamContainer">
                  <div :class="$style.matchTeamItem">Участник №2:
                    <verte :class="$style.colorPicker" picker="square" v-model="colorTeam2" model="rgb"></verte>
                  </div>
                  <textarea @focus="team2focus = true" @blur="blurInput(2)" @input="searchTeam2(); team2Id = 0" :class="$style.textarea" v-model="matchTeam2"></textarea>
                  <div :class="$style.options" v-if="teamArray2 && matchTeam2 && team2focus">
                    <div :class="$style.optionsItem" @click="chooseTeam(2, item)" :key="index" v-for="(item, index) in teamArray2">{{item.name}}</div>
                  </div>
                </div>
              </div>
            </v-match-info>
            <v-match-info :class="$style.infoItem" :complited="leagueName" :title="'Лига'">
              <textarea @focus="leagueFocus = true" @blur="blurInput(3)" @input="searchLeague(); leagueId = 0" :class="$style.textarea" v-model="leagueName"></textarea>
              <div :class="$style.options" v-if="leagueArray && leagueName && leagueFocus">
                <div :class="$style.optionsItem" @click="chooseTeam(3, item)" :key="index" v-for="(item, index) in leagueArray">{{item.name}}</div>
              </div>
            </v-match-info>
            <v-match-info @click="openDate(), dateInput.blur()" :complited="convertedTime" :class="[$style.infoItem, $style.pointer, $style.infoItemDate]" date :title="'Дата по МСК'">
              <textarea :class="$style.pointer" ref="dateInput" v-model="convertedTime"></textarea>
              <div :class="[$style.dateContainer, $style.pointer]">
                <date-picker
                v-if="dateOpen"
                append-to-body
                :show-second="false"
                inline
                @change="dateChange"
                v-model="dateTime"
                type="datetime"></date-picker>
              </div>
            </v-match-info>
            <v-match-info @click="!matchLink.indexOf('http') && loaded && matchTeam1 && matchTeam2 && leagueName && convertedTime && makeEvent(1)" :class="[$style.infoItem, $style.disabled, !matchLink.indexOf('http') && loaded && matchTeam1 && matchTeam2 && leagueName && convertedTime && $style.active]" :title="'Добавить в расписание'" :color="'yellow'">
              <div :class="$style.imageAddContainer">
                <v-image :name="'addBlack'"></v-image>
              </div>
            </v-match-info>
          </div>
          <div :class="$style.infoContainer__bottom">
            <v-match-info @click="triggerLoader" :class="[$style.infoItem, $style.pointer]" :complited="playersArray" :title="'Состав команд'">
              <div :class="$style.imageContainer">
                <v-image :name="'add'"></v-image>
                <input :class="$style.inputHide" type="file" ref="loader" accept=".csv" v-on:change="loadSuccess( $event )"/>
              </div>
              <span :class="$style.playersFileName">{{playersFileName}}</span>
            </v-match-info>
            <v-match-info @click="triggerLoaderReferee" :class="[$style.infoItem, $style.pointer]" :complited="refereeArray" :title="'Судейский cостав'">
              <div :class="$style.imageContainer">
                <v-image :name="'add'"></v-image>
                <input :class="$style.inputHide" type="file" ref="loaderReferee" accept=".csv" v-on:change="loadSuccessReferee( $event )"/>
              </div>
              <span :class="$style.playersFileName">{{refereeFileName}}</span>
            </v-match-info>
            <v-match-info @click="triggerLoaderCoach" :class="[$style.infoItem, $style.pointer]" :complited="coachArray" :title="'Тренерский состав'">
              <div :class="$style.imageContainer">
                <v-image :name="'add'"></v-image>
                <input :class="$style.inputHide" type="file" ref="loaderCoach" accept=".csv" v-on:change="loadSuccessCoach( $event )"/>
              </div>
              <span :class="$style.playersFileName">{{coachFileName}}</span>
            </v-match-info>
            <v-match-info @click="!matchLink.indexOf('http') && loaded && matchTeam1 && matchTeam2 && leagueName && convertedTime && makeEvent(2)" :class="[$style.infoItem, $style.disabled, !matchLink.indexOf('http') && loaded && matchTeam1 && matchTeam2 && leagueName && convertedTime && $style.active]" :title="'Начать матч сейчас'" :color="'green'">
              <div :class="$style.imageAddContainer">
                <v-image :name="'start'"></v-image>
              </div>
            </v-match-info>
          </div>
          <div :class="$style.infoContainer__bottom">
            <v-match-info v-if="sportId === 3" :class="[$style.infoItem]" :complited="true" :title="'Время четверти (мин.)'">
              <div :class="$style.radioContainer">
                <input v-model="basketPeriodTime" value="10" type="radio" name="time" checked>
                <label :class="$style.label">10 минут</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="basketPeriodTime" value="12" type="radio" name="time" >
                <label :class="$style.label">12 минут</label>
              </div>
            </v-match-info>
            <v-match-info v-if="sportId === 2" :class="[$style.infoItem]" :complited="true" :title="'Время периода (мин.)'">
              <div :class="$style.radioContainer">
                <input v-model="footballPeriodTime" value="5" type="radio" name="footballTime">
                <label :class="$style.label">5 минут</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="footballPeriodTime" value="15" type="radio" name="footballTime">
                <label :class="$style.label">15 минут</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="footballPeriodTime" value="20" type="radio" name="footballTime" >
                <label :class="$style.label">20 минут</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="footballPeriodTime" value="45" type="radio" name="footballTime" checked>
                <label :class="$style.label">45 минут</label>
              </div>
            </v-match-info>
            <v-match-info v-if="sportId === 4 || sportId === 5" :class="[$style.infoItem]" :complited="true" :title="'Кол-во сетов'">
              <div :class="$style.radioContainer">
                <input v-model="setCount" value="3" type="radio" name="sets" checked>
                <label :class="$style.label">3 {{sportId === 4 ? 'сета' : 'партии'}}</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="setCount" value="5" type="radio" name="sets" >
                <label :class="$style.label">5 {{sportId === 4 ? 'сетов' : 'партий'}}</label>
              </div>
              <div v-if="sportId === 4" :class="$style.radioContainer">
                <input v-model="setCount" value="3D" type="radio" name="sets" >
                <label :class="$style.label">3 сета пары</label>
              </div>
              <div v-if="sportId === 4" :class="$style.radioContainer">
                <input v-model="setCount" value="5D" type="radio" name="sets" >
                <label :class="$style.label">5 сетов пары</label>
              </div>
              <div v-if="sportId === 4" :class="$style.radioContainer">
                <input v-model="setCount" value="3B" type="radio" name="sets" >
                <label :class="$style.label">3 сета большой шлем</label>
              </div>
              <div v-if="sportId === 4" :class="$style.radioContainer">
                <input v-model="setCount" value="5B" type="radio" name="sets" >
                <label :class="$style.label">5 сетов большой шлем</label>
              </div>
              <div v-if="sportId === 4" :class="$style.radioContainer">
                <input v-model="setCount" value="3S" type="radio" name="sets" >
                <label :class="$style.label">Шорт</label>
              </div>
            </v-match-info>
            <v-match-info v-if="sportId === 6" :class="[$style.infoItem]" :complited="true" :title="'Очков в решающей партии'">
              <div :class="$style.radioContainer">
                <input v-model="finallScore" value="5" type="radio" name="sets" checked>
                <label :class="$style.label">5 очков</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="finallScore" value="7" type="radio" name="sets" >
                <label :class="$style.label">7 очков</label>
              </div>
              <div :class="$style.radioContainer">
                <input v-model="finallScore" value="11" type="radio" name="sets" >
                <label :class="$style.label">11 очков</label>
              </div>
            </v-match-info>
            <v-match-info v-if="sportId === 7" :class="$style.infoItem" :complited="overCount && outCount" :title="'Правила игры'">
              <div :class="$style.matchTeams">
                <div>Кол-во оверов</div>
                <textarea :class="$style.textarea" v-model="overCount"></textarea>
                <div>Кол-во аутов</div>
                <textarea :class="$style.textarea" v-model="outCount"></textarea>
              </div>
            </v-match-info>
            <v-match-info :class="$style.infoItem" :complited="!matchLink.indexOf('http')" :title="'Сылка на видеопоток'">
              <textarea :class="$style.textarea" v-model="matchLink"></textarea>
            </v-match-info>
            <v-match-info :class="$style.infoItem" :title="'Дополнительные настройки'">
              <div :class="$style.radioContainer">
                <input disabled v-model="statistics" value="true" type="checkbox" name="statistics" >
                <label :class="$style.label">Отображать статистику игры на сайт</label>
              </div>
            </v-match-info>
            <v-match-info :class="$style.infoItem" :complited="description" :title="'Описание матча'">
              <textarea :class="$style.textarea" v-model="description"></textarea>
            </v-match-info>
            <!-- <v-match-info :class="[$style.infoItem, $style.hiddenItem]">
            </v-match-info> -->
            <v-match-info v-if="sportId === 1" :class="[$style.infoItem, $style.hiddenItem]">
            </v-match-info>
          </div>
        </div>
      </template>
    </div>
    <portal to="popup">
      <v-popupConfirm
      v-if="popupConfirm"
      @closePopup="toTimetable"
      ></v-popupConfirm>
    </portal>
  </div>
</template>
<script>
import {
  ref, computed,
  onMounted,
  // nextTick,
} from '@vue/composition-api'
import Vue from 'vue'
import Papa from 'papaparse'
import DatePicker from 'vue2-datepicker'
import Verte from 'verte'
import 'vue2-datepicker/index.css'
import 'vue2-datepicker/locale/ru'
import 'verte/dist/verte.css'
// import csvLoader from 'vue-csv-loader'
// import 'vue-csv-loader/dist/csv-loader.css'

export default {
  name: 'Add',
  components: { DatePicker, Verte },
  setup(props, context) {
    const router = context.root.$router
    const store = context.root.$store
    const matchId = computed(() => context.root.$router.currentRoute.query.id)
    const allKindsOfSport = computed(() => context.root.$store.state.allKindsOfSport)
    const stage = ref(0)
    const popupConfirm = ref(false)

    const sportImg = ref('Hockey')
    const sportTitle = ref('Хоккей')

    const loader = ref(null)
    const matchEditData = ref()
    const sportId = ref(0)
    const statistics = ref(true)

    const description = ref('')

    const matchTeam1 = ref('')
    const matchTeam2 = ref('')
    const leagueName = ref('')
    const teamArray1 = ref([])
    const teamArray2 = ref([])
    const leagueArray = ref([])

    const playersFileName = ref('')
    const playersTeam1 = ref({})
    const playersTeam2 = ref({})
    const playersArray = ref()

    const coachFileName = ref('')
    const coachTeam1 = ref([])
    const coachTeam2 = ref([])
    const coachArray = ref()
    const loaderCoach = ref(null)

    const team1Id = ref()
    const team2Id = ref()
    const leagueId = ref()

    const loaded = ref(true)

    const refereeFileName = ref('')
    const refereeArray = ref()
    const loaderReferee = ref(null)

    const closeTag = ref('')
    const dateTime = ref()
    const dateOpen = ref(false)
    const convertedTime = ref('')
    const parsedTime = ref()
    const dateInput = ref(null)
    const dateSelected = ref(false)

    const colorTeam1 = ref('rgb(255,0,0)')
    const colorTeam2 = ref('rgb(0,0,255)')
    const matchLink = ref('http')

    const basketPeriodTime = ref('10')
    const footballPeriodTime = ref('45')
    const setCount = ref('3')
    const overCount = ref(10)
    const outCount = ref(10)
    const finallScore = ref(5)

    const team1focus = ref(false)
    const team2focus = ref(false)
    const leagueFocus = ref(false)

    const openDate = () => {
      setTimeout(() => {
        if (!dateSelected.value) {
          dateOpen.value = true
        }
      }, 10)
    }

    const closeDate = (e) => {
      if (!(e.target.className === 'mx-time-item active'
      || e.target.className === 'mx-calendar'
      || e.target.className === 'mx-calendar-panel-date'
      || e.target.className === 'cell active'
      || e.target.className === ''
      || e.target.className === 'mx-scrollbar-track'
      || e.target.className === 'mx-scrollbar mx-time-column'
      || e.target.className === 'mx-scrollbar-thumb'
      || e.target.className === 'mx-time-list'
      || e.target.className === 'mx-time-header'
      || e.target.className === 'mx-btn mx-btn-text mx-time-header-title'
      || e.target.className === 'mx-time mx-calendar-time'
      || e.target.className === 'mx-btn mx-btn-text mx-btn-current-month'
      || e.target.className === 'mx-icon-double-left'
      || e.target.className === 'mx-icon-double-right'
      || e.target.className === 'mx-calendar mx-calendar-panel-date'
      || e.target.className === 'mx-calendar-header'
      || e.target.className === 'cell not-current-month'
      || e.target.className === 'mx-icon-right'
      || e.target.className === 'mx-icon-left'
      || e.target.className === 'mx-btn mx-btn-text mx-btn-current-year'
      || e.target.className === 'mx-btn mx-btn-text mx-btn-icon-left'
      || e.target.className === 'mx-btn mx-btn-text mx-btn-icon-right')
      ) {
        dateOpen.value = false
      }
    }

    const searchLeague = async () => {
      const requestData = {
        searchData: {
          name: {
            contains: leagueName.value,
            mode: 'insensitive',
          },
        },
        page: 1,
        count: 1000,
      }
      const result = await store.dispatch('searchLeague', requestData)
      leagueArray.value = result
    }

    const searchTeam1 = async () => {
      const requestData = {
        searchData: {
          name: {
            contains: matchTeam1.value,
            mode: 'insensitive',
          },
          sportId: sportId.value,
        },
        page: 1,
        count: 1000,
      }
      const result = await store.dispatch('searchTeam', requestData)
      teamArray1.value = result
    }

    const searchTeam2 = async () => {
      const requestData = {
        searchData: {
          name: {
            contains: matchTeam2.value,
            mode: 'insensitive',
          },
          sportId: sportId.value,
        },
        page: 1,
        count: 1000,
      }
      const result = await store.dispatch('searchTeam', requestData)
      teamArray2.value = result
    }

    const chooseTeam = (team, val) => {
      if (team === 1) {
        matchTeam1.value = val.name
        teamArray1.value = []
        team1Id.value = val.id
      } else if (team === 2) {
        matchTeam2.value = val.name
        teamArray2.value = []
        team2Id.value = val.id
      } else if (team === 3) {
        leagueName.value = val.name
        leagueArray.value = []
        leagueId.value = val.id
      }
    }

    const stageBack = () => {
      if (stage.value === 0) {
        router.push('/')
      } else {
        stage.value = 0
        matchTeam1.value = ''
        matchTeam2.value = ''
        teamArray1.value = []
        teamArray2.value = []
        leagueArray.value = []
        leagueName.value = ''
        convertedTime.value = ''
        playersArray.value = null
        refereeArray.value = null
        coachArray.value = null
        playersFileName.value = ''
        refereeFileName.value = ''
        coachFileName.value = ''
        overCount.value = 10
        outCount.value = 10
        matchLink.value = 'http'
        description.value = ''
        dateOpen.value = false
      }
    }

    const changeStage = (val) => {
      stage.value = 1
      sportImg.value = val
      switch (val) {
        case 'Hockey': {
          sportTitle.value = 'Хоккей'
          sportId.value = 1
          break
        }
        case 'Soccer': {
          sportTitle.value = 'Футбол'
          sportId.value = 2
          break
        }
        case 'Basketball': {
          sportTitle.value = 'Баскетбол'
          sportId.value = 3
          break
        }
        case 'Tennis': {
          sportTitle.value = 'Большой теннис'
          sportId.value = 4
          break
        }
        case 'Volleyball': {
          sportTitle.value = 'Волейбол'
          sportId.value = 5
          break
        }
        case 'PingPong': {
          sportTitle.value = 'Настольный теннис'
          sportId.value = 6
          break
        }
        case 'Cricket': {
          sportTitle.value = 'Крикет'
          sportId.value = 7
          break
        }
        default:
      }
    }

    const toTimetable = () => {
      popupConfirm.value = false
      router.push('/')
    }

    const blurInput = (val) => {
      setTimeout(() => {
        if (val === 1) {
          team1focus.value = false
        } else if (val === 2) {
          team2focus.value = false
        } else if (val === 3) {
          leagueFocus.value = false
        } else {
          team1focus.value = false
          team2focus.value = false
          leagueFocus.value = false
        }
      }, 300)
    }

    const makeEvent = async (val) => {
      if (!teamNameCheck()) return

      if (val === 2) {
        const userMatches = await store.dispatch('checkUsersMatch')
        if (userMatches.matchNow) {
          Vue.$toast.error('Закончите предыдуший матч, перед началом нового', {
            position: 'bottom-right',
          })
          return
        }
        if (userMatches.isOnline) {
          Vue.$toast.error('С этого аккаунта уже ведётся матч', {
            position: 'bottom-right',
          })
          return
        }
      }

      let team = 1
      loaded.value = false
      if (playersArray.value && !Number(matchId.value)) {
        playersArray.value.forEach((item, index) => {
          if (item[0] === '') {
            team = 2
          } else if (team === 1) {
            playersTeam1.value[index] = {
              name: item[0],
              points: 0,
              on_bench: true,
            }
          } else if (team === 2) {
            playersTeam2.value[index] = {
              name: item[0],
              points: 0,
              on_bench: true,
            }
          }
        })
      }
      let gameTimes = ['0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0']
      if (sportId.value === 1) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0']
      }
      if (sportId.value === 2) {
        gameTimes = ['0 : 0', '0 : 0']
      }
      if (sportId.value === 3) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0', '0 : 0']
      }
      if (sportId.value === 4) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0']
      }
      if (sportId.value === 5) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0']
      }
      if (sportId.value === 6) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0']
      }
      if (sportId.value === 7) {
        gameTimes = ['0 : 0', '0 : 0']
      }
      if ((setCount.value === '5' || setCount.value === '5D' || setCount.value === '5B') && (sportId.value === 4 || sportId.value === 5)) {
        gameTimes = ['0 : 0', '0 : 0', '0 : 0', '0 : 0', '0 : 0']
      }
      let tennisLength
      if ((setCount.value === '5' || setCount.value === '5D' || setCount.value === '5B') && (sportId.value === 4 || sportId.value === 5)) {
        tennisLength = '5'
      } else {
        tennisLength = '3'
      }

      let teamCoach = 1
      if (coachArray.value && !Number(matchId.value)) {
        coachArray.value.forEach((item) => {
          if (item[0] === '') {
            teamCoach = 2
          } else if (teamCoach === 1) {
            coachTeam1.value.push(item)
          } else if (teamCoach === 2) {
            coachTeam2.value.push(item)
          }
        })
      }

      if (!team1Id.value) {
        if (teamArray1.value.length) {
          teamArray1.value.forEach((item) => {
            if (item.name === matchTeam1.value) {
              team1Id.value = item.id
            }
          })
          if (!team1Id.value) {
            team1Id.value = await createTeam(matchTeam1.value)
          }
        } else {
          team1Id.value = await createTeam(matchTeam1.value)
        }
      }

      if (!team2Id.value) {
        if (teamArray2.value.length) {
          teamArray2.value.forEach((item) => {
            if (item.name === matchTeam2.value) {
              team2Id.value = item.id
            }
          })
          if (!team2Id.value) {
            team2Id.value = await createTeam(matchTeam2.value)
          }
        } else {
          team2Id.value = await createTeam(matchTeam2.value)
        }
      }

      if (!leagueId.value) {
        if (leagueArray.value.length) {
          leagueArray.value.forEach((item) => {
            if (item.name === leagueName.value) {
              leagueId.value = item.id
            }
          })
          if (!leagueId.value) {
            leagueId.value = await createLeague(leagueName.value)
          }
        } else {
          leagueId.value = await createLeague(leagueName.value)
        }
      }

      const responseData = {
        // id: Number(matchId.value),
        // data: Number(matchId.value)
        date: parsedTime.value,
        sportId: sportId.value,
        side_1_id: team1Id.value,
        side_2_id: team2Id.value,
        leagueId: leagueId.value,
        name: `${matchTeam1.value} - ${matchTeam2.value}`,
        broadcast_link: matchLink.value,
        description: description.value,
        // place: leagueName.value,
        statistics: {
          Side_1: {
            name: matchTeam1.value,
            Players: Object.assign({}, playersTeam1.value),
            Trainers: Object.assign({}, coachTeam1.value),
            won: false,
            points: 0,
            have_ball: false,
            lost_ball: 0,
            basket_foul_count: 0,
            red_card_count: 0,
            yellow_card_count: 0,
            corner_kick_count: 0,
            criket_wicket: 0,
            criket_overIndex: 0,
            color: colorTeam1.value,
            possession: 0,
            events: allKindsOfSport.value[sportId.value - 1].team_base_statistic,
          },
          Side_2: {
            name: matchTeam2.value,
            Players: Object.assign({}, playersTeam2.value),
            Trainers: Object.assign({}, coachTeam2.value),
            won: false,
            points: 0,
            have_ball: false,
            lost_ball: 0,
            basket_foul_count: 0,
            red_card_count: 0,
            yellow_card_count: 0,
            corner_kick_count: 0,
            criket_wicket: 0,
            criket_overIndex: 0,
            color: colorTeam2.value,
            possession: 0,
            events: allKindsOfSport.value[sportId.value - 1].team_base_statistic,
          },
          for_api: {
            Op1: matchTeam1.value,
            Op2: matchTeam2.value,
            Period: 1,
            Idtimeevent: 24,
            ScoreSets: gameTimes,
            lastEventTimeSec: sportId.value === 3 ? Number(basketPeriodTime.value) * 60 : 0,
            lastEventTimeMillSec: 0,
            lastPeriodTimeSec: 0,
            Side_1_points: 0,
            Side_2_points: 0,
            isPaused: true,
          },
          playersFileName: playersFileName.value,
          refereeFileName: refereeFileName.value,
          coachFileName: coachFileName.value,
          overCount: overCount.value,
          outCount: outCount.value,
          cricketBatterMain: '',
          cricketBatterRest: '',
          cricketBowler: '',
          text_messages: [],
          text_messages_1: [],
          text_messages_2: [],
          text_messages_max_length: 1,
          times_max_length: (sportId.value === 4 || sportId.value === 5) ? tennisLength : 7,
          gameMode: sportId.value === 4 ? setCount.value : '',
          finall_period_max_score: sportId.value === 6 ? finallScore.value : 0,
          basket_period_time: sportId.value === 3 ? Number(basketPeriodTime.value) : sportId.value === 2 ? Number(footballPeriodTime.value) : sportId.value === 1 ? 20 : 0,
          fall_count: 0,
          times: gameTimes,
          replacement_count: 0,
          dead_heat: false,
          period: 1,
          Referee: refereeArray.value,
          techEnd: false,
          techEndInfo: '',
          matchLink: matchLink.value,
          criket_ball: 1,
          criket_servePlayer: 1,
          isPaused: true,
          lastEventTimeSec: sportId.value === 3 ? Number(basketPeriodTime.value) * 60 : 0,
          lastEventTimeMillSec: 0,
          lastPeriodTimeSec: 0,
          servingSide: 0,
          timeDir: sportId.value !== 3,
          Idtimeevent: 24,
          sendStatisticsToLSPRO: statistics.value,
        },
      }
      if (val === 1 && matchId.value) {
        store.dispatch('editMatch', { id: Number(matchId.value), data: responseData })
        loaded.value = true
        popupConfirm.value = true
      } else if (val === 2 && matchId.value) {
        await store.dispatch('editMatch', { id: Number(matchId.value), data: responseData })
        router.push(`/match/${Number(matchId.value)}`)
        loaded.value = true
      } else if (val === 1) {
        await store.dispatch('createMatch', responseData)
        loaded.value = true
        popupConfirm.value = true
      } else if (val === 2) {
        const result = await store.dispatch('createMatch', responseData)
        router.push(`/match/${result.id}`)
        loaded.value = true
      }
    }

    const createLeague = async (val) => {
      const requestData = {
        name: val,
        sportId: sportId.value,
      }
      const result = await store.dispatch('createLeague', requestData)
      return result.id
    }

    const createTeam = async (val) => {
      const requestData = teamEvents(val)
      const result = await store.dispatch('createTeam', requestData)
      return result.id
    }

    const teamEvents = (val) => {
      const requestData = {
        name: val,
        sportId: sportId.value,
        statistics: allKindsOfSport.value[sportId.value - 1].team_base_statistic,
      }
      requestData.statistics.wins_home = 0
      requestData.statistics.fails_home = 0
      requestData.statistics.wins_total = 0
      requestData.statistics.fails_total = 0
      requestData.statistics.wins_anywhere = 0
      requestData.statistics.fails_anywhere = 0
      return requestData
    }

    const parseFile = (val) => {
      playersFileName.value = val.name
      Papa.parse(val, {
        complete: function (results) {
          playersArray.value = results.data
        },
      })
    }

    const loadSuccess = (event) => {
      parseFile(event.target.files[0])
    }

    const triggerLoader = () => {
      context.refs.loader.click()
    }

    const parseFileReferee = (val) => {
      refereeFileName.value = val.name
      Papa.parse(val, {
        complete: function (results) {
          refereeArray.value = results.data
        },
      })
    }

    const loadSuccessReferee = (event) => {
      parseFileReferee(event.target.files[0])
    }

    const triggerLoaderReferee = () => {
      context.refs.loaderReferee.click()
    }

    const parseFileCoach = (val) => {
      coachFileName.value = val.name
      Papa.parse(val, {
        complete: function (results) {
          coachArray.value = results.data
        },
      })
    }

    const loadSuccessCoach = (event) => {
      parseFileCoach(event.target.files[0])
    }

    const triggerLoaderCoach = () => {
      context.refs.loaderCoach.click()
    }

    const convertTime = (val, edit) => {
      if (edit) {
        val = new Date(Date.parse(new Date(val)) + (new Date(val).getTimezoneOffset() * 60 * 1000) + (180 * 60 * 1000))
      }
      parsedTime.value = Date.parse(val) - (val.getTimezoneOffset() * 60 * 1000) - (180 * 60 * 1000)
      const array = val.toString().split(' ')
      const monthDay = array[2]
      let month = array[1]
      const year = array[3]
      const time = array[4]
      switch (month) {
        case 'Jan': {
          month = 'января'
          break
        }
        case 'Feb': {
          month = 'февраля'
          break
        }
        case 'Mar': {
          month = 'марта'
          break
        }
        case 'Apr': {
          month = 'апреля'
          break
        }
        case 'May': {
          month = 'мая'
          break
        }
        case 'Jun': {
          month = 'июня'
          break
        }
        case 'Jul': {
          month = 'июля'
          break
        }
        case 'Aug': {
          month = 'августа'
          break
        }
        case 'Sep': {
          month = 'сентября'
          break
        }
        case 'Oct': {
          month = 'октября'
          break
        }
        case 'Nov': {
          month = 'ноября'
          break
        }
        case 'Dec': {
          month = 'декабря'
          break
        }
        default:
      }
      convertedTime.value = `${monthDay} ${month} ${year} ${time.slice(0, -3)}`
    }

    const teamNameCheck = () => {
      if (matchTeam1.value === matchTeam2.value) {
        Vue.$toast.error('Названия команд не должны совпадать', {
          position: 'bottom-right',
        })
        return false
      }
      return true
    }

    const dateChange = (value, type) => {
      convertTime(value)
      if (type === 'minute') {
        setTimeout(() => {
          dateOpen.value = false
          dateSelected.value = true
          setTimeout(() => {
            dateSelected.value = false
          }, 100)
        }, 0)
      }
    }

    onMounted(async () => {
      if (matchId.value) {
        matchEditData.value = await store.dispatch('getMatch', matchId.value)
        sportId.value = await matchEditData.value.match.sportId
        switch (sportId.value) {
          case 1: {
            changeStage('Hockey')
            break
          }
          case 2: {
            changeStage('Soccer')
            break
          }
          case 3: {
            changeStage('Basketball')
            break
          }
          case 4: {
            changeStage('Tennis')
            break
          }
          case 5: {
            changeStage('Volleyball')
            break
          }
          default:
        }
        matchTeam1.value = await matchEditData.value.match.statistics.Side_1.name
        matchTeam2.value = await matchEditData.value.match.statistics.Side_2.name
        team1Id.value = await matchEditData.value.match.side_1_id
        team2Id.value = await matchEditData.value.match.side_2_id
        leagueName.value = await matchEditData.value.match.League.name
        leagueId.value = matchEditData.value.match.League.id
        colorTeam1.value = await matchEditData.value.match.statistics.Side_1.color
        colorTeam2.value = await matchEditData.value.match.statistics.Side_2.color
        description.value = await matchEditData.value.match.description
        matchLink.value = await matchEditData.value.match.broadcast_link
        playersFileName.value = await matchEditData.value.match.statistics.playersFileName
        refereeFileName.value = await matchEditData.value.match.statistics.refereeFileName
        coachFileName.value = await matchEditData.value.match.statistics.coachFileName
        convertTime(matchEditData.value.match.date, true)
        if (Object.keys(JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_2.Players))).length || Object.keys(JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_1.Players))).length) {
          playersTeam1.value = JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_1.Players))
          playersTeam2.value = JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_2.Players))
          playersArray.value = true
        }
        if (Object.keys(JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_2.Trainers))).length || Object.keys(JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_1.Trainers))).length) {
          coachTeam1.value = JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_1.Trainers))
          coachTeam2.value = JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Side_2.Trainers))
          coachArray.value = true
        }
        if (matchEditData.value.match.statistics.Referee) {
          refereeArray.value = JSON.parse(JSON.stringify(matchEditData.value.match.statistics.Referee))
        }
        if (matchEditData.value.match.statistics.times_max_length === '5') {
          setCount.value = 5
        }
      }
    })

    return {
      stage,
      stageBack,
      changeStage,
      toTimetable,
      popupConfirm,
      makeEvent,
      sportImg,
      sportTitle,
      allKindsOfSport,

      loadSuccess,
      parseFile,
      loader,
      triggerLoader,

      sportId,
      matchTeam1,
      matchTeam2,
      // teamName,
      closeTag,
      playersTeam1,
      playersTeam2,
      playersArray,
      dateTime,
      leagueName,
      playersFileName,

      refereeArray,
      refereeFileName,
      loaderReferee,
      parseFileReferee,
      loadSuccessReferee,
      triggerLoaderReferee,

      coachArray,
      coachFileName,
      loaderCoach,
      parseFileCoach,
      loadSuccessCoach,
      triggerLoaderCoach,

      dateOpen,
      dateChange,

      convertedTime,
      convertTime,
      parsedTime,
      setCount,
      matchId,
      matchEditData,
      coachTeam1,
      coachTeam2,
      finallScore,
      basketPeriodTime,
      footballPeriodTime,

      overCount,
      outCount,
      dateInput,
      matchLink,

      openDate,
      closeDate,
      dateSelected,
      colorTeam1,
      colorTeam2,
      statistics,
      teamNameCheck,
      createTeam,
      createLeague,

      loaded,
      searchTeam1,
      searchTeam2,
      searchLeague,


      leagueArray,
      teamArray1,
      teamArray2,
      team1Id,
      team2Id,
      teamEvents,

      description,

      team1focus,
      team2focus,
      leagueFocus,
      chooseTeam,
      blurInput,
    }
  },
}
</script>
<style lang="scss" module>
.wrapper {
    width: 100%;
    .container {
      width: 100%;
      display: flex;
      flex-direction: column;
      padding-top: 6rem;
      height: calc(100vh - 6.7rem - 3.5rem);
    }
    .backButton {
      width: 3rem;
      height: 3rem;
    }
    .title {
      @include teamName;
      color: var(--red);
      margin-top: 2rem;
      margin-bottom: 2rem;
      display: flex;
      align-items: center;
      font-weight: bold;
      .white  {
        color: var(--white);
      }
      .sportImg {
        width: 3.2rem;
        height: 3.2rem;
        margin-right: 1rem;
      }
    }
    .gamesContainer {
      display: flex;
      gap: 2rem;
      flex-wrap: wrap;
      // cursor: pointer;
      .column {
        flex-direction: column;
        display: flex;
        gap: 2rem;
        flex: 1;
      }
      .item {
        min-width: 29rem;
        height: 22rem;
        background: var(--buttonBackColor);
        border-radius: var(--border-radius);
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transform: translate3d(0);
        transition: transform 0.15s ease-out;
        img {
          width: 9.6rem;
          height: 9.6rem;
          margin: 4.2rem 0 2.3rem;
        }
        .gameName {
          color: var(--white);
          @include text-game-name;
          font-weight: bold;
        }
      }
      .item:hover {
        transform: scale(1.05);
      }
      .item:active {
        transform: scale(0.95);
      }
      .disabled {
        opacity: .4;
        pointer-events: none;
        cursor: initial;
      }
    }
    .infoContainer {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      padding-bottom: 2rem;
      flex: 1;
      .infoItem {
        flex: 1;
        position: relative;
        display: flex;
        justify-content: center;
        position: relative;
        flex-direction: column;
        .playersFileName {
          width: 100%;
          margin-top: 2rem;
          word-break: break-all;
        }
        .inputHide {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .matchTeams {
          display: flex;
          flex-direction: column;
          height: 100%;
          textarea {
            height: 60%;
          }
          .matchTeamItem {
            display: flex;
            align-items: center;
            .colorPicker {
              margin-left: auto;
              button {
                cursor: pointer;
              }
            }
          }
        }
        .dateContainer {
          position: absolute;
          z-index: 1;
          margin-top: 4rem;
        }
        .radioContainer {
          display: flex;
          align-items: center;
          margin-top: 1.5rem;
          gap: 1rem;
        }
      }
      .hiddenItem {
        opacity: 0;
      }
      .infoItemDate {
        textarea{
          height: auto;
        }
      }
      .disabled {
        opacity: 0.4;
      }
      .active {
        opacity: 1;
        cursor: pointer;
        transform: translate3d(0);
        transition: transform 0.15s ease-out;
      }
      .active:hover {
        transform: scale(1.05);
      }
      .active:active {
        transform: scale(0.95);
      }
      .pointer {
        cursor: pointer;
      }
      &__upper {
        display: flex;
        gap: 2rem;
        width: 100%;
        flex-wrap: wrap;
        flex: 1;
      }
      &__bottom {
        display: flex;
        gap: 2rem;
        width: 100%;
        flex-wrap: wrap;
        flex: 1;
      }
      .imageContainer {
        width: 3rem;
        height: 3rem;
      }
      .imageAddContainer {
        width: 3.2rem;
        height: 3.2rem;
      }
    }
    input {
        cursor: pointer;
    }
    input[type="radio"] {
        appearance: none;
        background-color: transparent;
        border: .2rem solid var(--white);
        border-radius: 50%;
        width: 2.4rem;
        height: 2.4rem;
        padding: 0.4rem;
    }
    input[type="radio"]:checked {
        background: var(--white);
        background-clip: content-box;
    }
    input[type="checkbox"] {
        appearance: none;
        background-color: transparent;
        border: .2rem solid var(--white);
        // border-radius: 50%;
        width: 2.4rem;
        height: 2.4rem;
        padding: 0.4rem;
    }
    input[type="checkbox"]:checked {
        background: var(--white);
        background-clip: content-box;
    }
    textarea{
      background: rgba(0, 0, 0, 0);
      width: 100%;
      height: 50%;
      outline: none;
      border: 0;
      color: var(--white);
      resize: none;
      font-weight: 700;
      @include button;
    }
}

.options {
  height: auto;
  max-height: 300%;
  width: 100%;
  position: absolute;
  // bottom: 0;
  overflow-y: auto;
  left: 0;
  z-index: 1;
  background-color: var(--black);
  .optionsItem {
    width: 100%;
    @include teamName;
    padding: 1rem;
    border-bottom: 1px solid var(--matchInfoUnderlineColor);
    cursor: pointer;
  }
  .optionsItem:hover {
    background-color: var(--inputHoverColor);
  }
}

.teamContainer {
  height: 100%;
  position: relative;
}

.invert {
    filter: invert(1);
}
.textarea {
  display: block;
}
</style>
