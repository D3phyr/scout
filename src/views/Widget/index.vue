<template>
  <div >
    <!--<component :style="{ position: 'fixed', bottom: widgetOptionsDouble.top + '%' }" :is="widgetOptionsDouble.type"/>-->
    <component :team="widgetOptionsDouble.team" :convertedTimer="convertedTimer" :statistics="statistics" :color="widgetOptionsDouble.color" :allMatchData="allMatchData" :widgetData="widgetData" :style="{ position: 'fixed', [widgetOptionsDouble.positionY]: widgetOptionsDouble[widgetOptionsDouble.positionY] + '%', [widgetOptionsDouble.positionX]: widgetOptionsDouble[widgetOptionsDouble.positionX] + '%', transform: `scale(${widgetOptionsDouble.scale})`, transformOrigin : `${widgetOptionsDouble.originX}% ${widgetOptionsDouble.originY}%` }" :class="$style.widget" :is="widgetOptionsDouble.type"/>
  </div>
</template>

<script>

// import { computed, onMounted } from '@vue/composition-api'
import { clearInterval, setInterval } from 'worker-timers'
import widjets from '../../components/@ui/widgets/components/index'

export default {
    name: 'Widget',
    components: {
      ...widjets,
    },
    data() {
      return {
        scaleFactorX: null,
        verifying: false,
        widgetData: {},
        allMatchData: {},
        timerRun: false,
        timer: null,
        convertedTimer: '',
        events: [],
        statistics: [],
      }
    },
    computed: {
      widgetOptionsDouble() {
        // Create a params object
        const params = {}
        const url = window.location
        new URL(url).searchParams.forEach((val, key) => {
          console.log(key, val)
          if (params[key] !== undefined) {
            if (!Array.isArray(params[key])) {
              params[key] = [params[key]]
            }
            params[key].push(val)
          } else {
            params[key] = val
          }
        })

        return params
      },
      fontSize() {
        return document.documentElement.style.fontSize
      },
    },
    mounted() {
      this.connect()
      this.loadNewEvents()
      const matches = +this.fontSize.match(/^([0-9]+\.?[0-9]*)(.*)/)[1]
      document.documentElement.classList.add('bg-light')
      // document.documentElement.style.fontSize = `${matches * 1.8}px`
      // setTimeout(() => {
      //  document.documentElement.style.fontSize = '20.8px'
      // }, 0)
      console.log(matches, '%')
      const { clientWidth } = document.body
      this.scaleFactorX = 14.5 * clientWidth / 1280
      if (clientWidth <= 450) this.scaleFactorX = 14.5
      if (clientWidth >= 1920) {
        // this.scaleFactorX = 13.9 * 1920 / 1280
      }
      setTimeout(() => {
        document.documentElement.style.fontSize = `${this.scaleFactorX}px`
      }, 50)
      window.addEventListener('resize', () => this.updateFactors('resize'))
    },
    methods: {
      convertMoscowTime() {
        // return (Date.now() - (new Date().getTimezoneOffset() * 60 * 1000) - (180 * 60 * 1000))
        return Date.now()
      },
      updateFactors() {
        const { clientWidth } = document.body
        console.log(clientWidth)
        this.scaleFactorX = 14.5 * clientWidth / 1280
        if (clientWidth <= 450) this.scaleFactorX = 14.5
        if (clientWidth >= 1920) {
          // this.scaleFactorX = 13.9 * 1920 / 1280
        }
        setTimeout(() => {
          document.documentElement.style.fontSize = `${this.scaleFactorX}px`
        }, 50)
      },
      countdown() {
        if (this.allMatchData.sportId === 3) {
          this.timerValue -= 1
        } else {
          this.timerValue += 1
        }
        if (this.allMatchData.sportId === 2 && !this.events[this.events.length - 1].data['Match.statistics.text_messages'].includes('Возобновление игры') && this.timerValue > 2700) this.timerValue = 2700
        if (this.timerValue < 0) this.timerValue = 0
        let min = Math.floor(this.timerValue / 60)
        let sec = this.timerValue % 60
        if (sec < 10) {
          if (sec < 0) sec = 0
          sec = `0${sec}`
        }
        if (min < 10) {
          if (min < 0) sec = 0
          min = `0${min}`
        }
        this.convertedTimer = `${min}:${sec}`
        this.timerEvent = (this.convertedTimer.split(':')).map(item => parseInt(item, 10))
      },
      updateTimer() {
        const gamePause = this.widgetData.statistics.isPaused
        let lastEventTime = 0
        let lastEventDate = 0
        let lastEventName = ''
        this.events?.forEach((item) => {
          if (item) {
            if (item.data['Match.statistics.text_messages']) {
              if (item.data['Match.statistics.text_messages'].split('|')[0].substr(1) && item.data['Match.statistics.text_messages'].split('|')[0].substr(1) !== 'Матч начат' && item.data['Match.statistics.text_messages'].split('|')[0].substr(1) !== 'Матч окончен') {
                lastEventTime = item.data['Match.statistics.text_messages'].split('|')[0].substr(1)
                if (item.data['Match.statistics.text_messages_2']) {
                  lastEventName = item.data['Match.statistics.text_messages_2'].split(']')[1]
                }
                lastEventDate = Date.parse(item.date)
              }
            }
          }
        })
        if (!lastEventTime) {
          console.log(lastEventTime)
          lastEventTime = '00:00'
          if (!this.allMatchData.factically_started_at && this.events.length) {
            const startEvent = this.events.find(el => el.type === 'startEvent')
            lastEventDate = Date.parse(startEvent.factically_started_at)
          } else {
            lastEventDate = Date.parse(this.allMatchData.factically_started_at)
          }
          if (this.widgetData.statistics.basket_period_time === 10) {
            lastEventTime = '10:00'
          } else if (this.widgetData.statistics.basket_period_time === 12) {
            lastEventTime = '12:00'
          }
        }
        const a = lastEventTime.split(':')
        lastEventTime = ((+a[0]) * 60 + (+a[1])) * 1000
        if (!gamePause && lastEventName !== 'Таймаут' && !this.events[this.events.length - 1].data['Match.statistics.text_messages'].includes('Смена периода') && this.timerRun === false) {
          console.log('start timer')
          this.timerRun = true
          this.timer = setInterval(() => this.countdown(), 1000)
          console.log(lastEventTime, lastEventDate, this.convertMoscowTime())
          if (this.allMatchData.sportId === 3) {
            lastEventTime += lastEventDate - this.convertMoscowTime()
          } else {
            lastEventTime += this.convertMoscowTime() - lastEventDate
          }
        } else if (gamePause || lastEventName === 'Таймаут') {
          console.log('clear')
          clearInterval(this.timer)
          this.timerRun = false
        }
        lastEventTime = Number((lastEventTime / 1000).toFixed(0))
        this.timerValue = lastEventTime
        let min2 = Math.floor(lastEventTime / 60)
        let sec2 = lastEventTime % 60
        if (sec2 < 10) {
          if (sec2 < 0) sec2 = 0
          sec2 = `0${sec2}`
        }
        if (min2 < 10) {
          if (min2 < 0) min2 = 0
          min2 = `0${min2}`
        }
        this.convertedTimer = `${min2}:${sec2}`
      },
      connect() {
        this.verifying = true
        // setLastMessage('Подключение...')
        fetch(`${process.env.VUE_APP_ROOT_URL}/api/authByToken`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                token: this.widgetOptionsDouble.token,
            }),
        }).then((result) => {
            if (result.status === 400) {
                return false
            }
            if (result.status === 200) {
                console.log(result)
                return result.json()
            }
        }).then(async (response) => {
            if (typeof response !== 'boolean') {
                console.log(response)
                const { data } = await this.$axios(`${process.env.VUE_APP_ROOT_URL}/api/getMatchInfo/${this.widgetOptionsDouble.matchId}`, {
                  method: 'GET',
                  headers: {
                      'Content-type': 'application/json',
                      Authorization: `Bearer ${response.token}`,
                  },
                })
                this.allMatchData = data
                let ws = new WebSocket(process.env.VUE_APP_SOCKET, response.token)
                ws.onclose = () => {
                    ws = null
                    // setIsConnected(false);
                    // setPaused(true);
                    // setMinutes(0);
                    // setSeconds(0);
                    console.log('ws', ws)
                }
                ws.onopen = () => {
                    // setIsConnected(true)
                    // setLastMessage('Подключились');
                }
                ws.onmessage = (event) => {
                  const parsedData = JSON.parse(event.data)
                  if (parsedData.type === 'Connect' || parsedData.type === 'Disconnect') return
                  if (parsedData.type === 'Initial') {
                    this.events = parsedData.events
                    this.statistics = {
                      Side_1: parsedData.statistics.Side_1.events,
                      Side_2: parsedData.statistics.Side_2.events,
                    }
                  }
                  if (parsedData.type === 'addEvent' || parsedData.type === 'startEvent') {
                    this.events.push(parsedData)
                    this.statistics = {
                      Side_1: parsedData.statistics.Side_1.events,
                      Side_2: parsedData.statistics.Side_2.events,
                    }
                  }
                  if (parsedData.type === 'endEvent') {
                    clearInterval(this.timer)
                    this.timerRun = false
                  }
                  if (parsedData.type === 'cancelOrEditEvent') {
                    if (parsedData.deleted) {
                      this.timerValue = parsedData.currentTime[0] * 60 + parsedData.currentTime[1]
                      this.widgetData = parsedData
                      return
                    }
                  }
                  this.widgetData = parsedData
                  this.updateTimer(parsedData)
                }
            }
        })
      },
      async loadNewEvents() {
        // this.widgetData = await this.$store.dispatch('getMatchSpectate', 771)
        // console.log(this.widgetData)
        // loading.value = false
        // nextTick(() => {
        //   loading.value = true
        // })
      },

    },
    setup() {
      // console.log(widjets)
      // const router = ctx.root.$router
      // console.log(router.app._route.query)
      // const widgetOptions = computed(() => router.app._route.query)
      // const fontSize = computed(() => document.documentElement.style.fontSize)
      // onMounted(() => {
      //  const matches = +fontSize.value.match(/^([0-9]+\.?[0-9]*)(.*)/)[1]
      //  // document.documentElement.style.fontSize = `${matches * 1.8}px`
      //  document.documentElement.style.fontSize = '18px'
      //  console.log(matches)
      //  window.addEventListener('resize', () => {
      //    console.log('resize')
      //    document.documentElement.style.fontSize = '18px'
      //  })
      // })
      return {
        // widgetOptions,
        // fontSize,
      }
    },
}
</script>

<style lang="scss" module>
.wrapper {
    display: flex;
    height: 90vh;
    justify-content: center;
    align-items: center;

    .authorizationContainer {
        width: 32rem;
        display: flex;
        flex-direction: column;

        .title {
            width: 100%;
            font-weight: 700;
            @include teamName;
            color: var(--red);
            margin-bottom: 4rem;
            text-align: center;
        }

        .subtitle {
            font-weight: 400;
            @include text-small;
            color: var(--white);
            opacity: 0.5;
        }

        input {
            background: var(--inputBackColor);
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
        }
        input:hover {
            background: var(--inputHoverColor);
        }
        input:focus {
            border: 2px solid var(--white);
        }
        .error {
            border: 2px solid var(--red);
            color: var(--red);
        }
        .error:focus {
            border: 2px solid var(--red);
        }

        .resendLetter {
            font-weight: 400;
            @include text-small;
            color: var(--white);
            opacity: 0.5;
            margin-top: 1.5rem;
            width: 100%;
            text-align: center;
        }

        .inputContainer {
            width: 100%;
            display: flex;
            gap: 1rem;
            margin: 1rem 0 2rem;

            .inputItem {
                background: var(--inputBackColor);
                width: 100%;
                border-radius: var(--border-radius);
                height: 5rem;
                display: flex;
                align-items: center;

                .inputNumber {
                    color: var(--white);
                    width: 100%;
                    text-align: center;
                    @include title;
                    font-weight: 400;
                }
            }
        }
        .sendLetter {
            margin-top: 1.5rem;
        }
        .buttonChangeStage {
            margin-bottom: 1rem;
        }
        .buttonBack {
            position: absolute;
            width: 3rem;
            height: 3rem;
            left: 3rem;
            top: 12.7rem;
        }
    }
}
.invert {
    filter: invert(1);
}
</style>
