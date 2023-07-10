<template>
<div :class="$style.container">
    <div @click="$emit('changeTime')" :class="[$style.time]">{{$props.timer.timerConverted.length >= 6 ? '00:00' : $props.timer.timerConverted}}</div>
    <template>
        <div :class="$style.score" @click="$emit('changeScore')">
            <template v-if="$props.sportId !== 4 || $props.matchStatistics.stage === 3">
                {{$props.matchStatistics.Side_1.score}} : {{$props.matchStatistics.Side_2.score}}
            </template>
            <template v-else>
                {{$props.matchStatistics.Side_1.tennisScore}} : {{$props.matchStatistics.Side_2.tennisScore}}
            </template>
        </div>

        <div :class="$style.periodScore" @click="$emit('changeScore')">
            <span v-for="(item, index) in $props.matchStatistics.periodScore" :key="index">
                {{index > 0 ? ' | ' : ''}}{{item[0]}} : {{item[1]}}
            </span>
        </div>
        <template v-if="$props.stage !== 3">
            <div :class="$style.periodCount">
                <div v-for="(item, index) in $props.matchStatistics.periodScore" :key="index" :class="[$style.periodCountNumber, $props.matchStatistics.period - 1 === index && $style.active]">{{index + 1}}</div>
            </div>
            <div :class="$style.periodName">{{periodName}}</div>
        </template>

        <template v-if="($props.sportId === 1 || $props.sportId === 2 || $props.sportId === 3) && $props.stage !== 2 && roleId === 2">
            <div :style="{'margin-top':'2rem'}" :class="$style.ballPossession" >
                <div :class="$style.ballPossessionLeftContainer">
                    <div :class="$style.leftProgress" :style="{'width':$props.matchStatistics.Side_1.holdTime + $props.matchStatistics.Side_2.holdTime ? `${Math.round($props.matchStatistics.Side_1.holdTime/($props.matchStatistics.Side_1.holdTime+$props.matchStatistics.Side_2.holdTime)*100)}%` : '50%'}"></div>
                </div>
                <div :class="$style.ballPossessionRightContainer">
                    <div :class="$style.rightProgress" :style="{'width': $props.matchStatistics.Side_1.holdTime + $props.matchStatistics.Side_2.holdTime ? `${Math.round($props.matchStatistics.Side_2.holdTime/($props.matchStatistics.Side_1.holdTime+$props.matchStatistics.Side_2.holdTime)*100)}%` : '50%'}"></div>
                </div>
            </div>
            <div :class="$style.ballPossessionCount">
                <div :class="$style.possessionCount">{{$props.matchStatistics.Side_1.holdTime ? Math.round($props.matchStatistics.Side_1.holdTime/($props.matchStatistics.Side_1.holdTime+$props.matchStatistics.Side_2.holdTime)*100) : '0'}}%</div>
                <div :class="$style.possessionCount">{{$props.matchStatistics.Side_2.holdTime ? Math.round($props.matchStatistics.Side_2.holdTime/($props.matchStatistics.Side_1.holdTime+$props.matchStatistics.Side_2.holdTime)*100) : '0'}}%</div>
            </div>
        </template>

        <!-- <div v-if="$props.sportId === 7 && $props.gameStatus">Иннингс</div>
        <div v-if="$props.sportId === 7 && $props.gameStatus" :class="$style.overCount">{{$props.periodGame}}
            <span>Овер</span>
        </div> -->

        <div :class="$style.controls" v-if="$props.stage !== 3 && roleId === 2">
            <v-image :class="[$style.controlButton, (($props.timer.timerConverted === '00:00' && $props.sportId === 3) || $props.gameEnd) && $style.disabled]" @click="$emit('makeEvent', $props.stage === 0 ? {id: 43} : $props.timer.timerRun ? {id: 8} : {id: 9})" :name="$props.timer.timerRun ? 'pause' : 'play'"></v-image>
            <v-image v-if="$props.sportId !== 7" :class="[$style.controlButton, (!$props.timer.timerRun || $props.gameEnd) && $style.disabled]" @click="$emit('makeEvent', {id: 40})" :name="'timeout'"></v-image>
            <!-- <v-image v-if="$props.sportId === 7" :class="[$style.controlButton]" @click="$emit('overChange')" :name="'overChange'"></v-image> -->
            <!-- <v-image v-if="$props.sportId === 5 || $props.sportId === 6" :class="[$style.controlButton]" @click="$emit('replace')" :name="'replace'"></v-image> -->
        </div>


<!--
        <div v-if="$props.sportId === 7 && $props.userRole && $props.gameStatus" :class="$style.pointsContainer">
            <div v-for="(item, index) in $props.cricketPeriodScore" :key="index" :class="[$style.point, (item === 'c') && $style.current, (item === 'x') && $style.out]" >
                <div :class="[$style.pointContent]">
                    {{!isNaN(Number(item)) ? item : ''}}
                </div>
            </div>
        </div>

        <div v-if="$props.sportId === 7 && $props.userRole && $props.gameStatus" :class="$style.buttonsContainer">
            <draggable v-model="rows" :disabled="$props.freeButtonMovement" :class="[$style.dragContaner, $style.colomn]">
                <div :class="$style.row" v-for="row in rows" :key="row.index">
                    <draggable :list="row.items" :group="{ name: 'row' }" @change="controlsChange" :disabled="$props.freeButtonMovement" :class="$style.dragContaner">
                        <v-btn
                        v-for="item in row.items"
                        :class="[$props.gameStatus && $style.disabled,
                        !$props.freeButtonMovement && $style.grab]"
                        :key="item.title"
                        @click="$props.freeButtonMovement && sendEvent(item.title)"
                        >
                            {{ item.title }}
                        </v-btn>
                    </draggable>
                </div>
            </draggable>
        </div>

        <div v-if="$props.sportId === 7 && $props.userRole && $props.gameStatus"  :class="$style.outContainer">
            <v-btn :class="$props.gameStatus && $style.disabled" @click="$emit('cricketGoal', 'out')">
                Аут
            </v-btn>
        </div> -->

    </template>
</div>
</template>

<script>
import { ref, computed } from '@vue/composition-api'
// import draggable from 'vuedraggable'

export default {
    name: 'v-score-panel',
    props: {
        sportId: {
            type: Number,
            defaul: 0,
        },
        timer: {
            type: Object,
            default: () => {},
        },
        stage: {
            type: Number,
            default: 0,
        },
        freeButtonMovement: {
            type: Boolean,
            defaul: true,
        },
        socketConnect: {
            type: Boolean,
            default: false,
        },
        matchStatistics: {
            type: Object,
            default: () => {},
        },
        gameEnd: {
            type: Boolean,
            default: false,
        },
    },
    // components: {
    //     draggable,
    // },
    setup(props, ctx) {
        const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)
        const connection = ref(true)
        const { emit } = ctx
        const store = ctx.root.$store
        const roleId = computed(() => store?.state?.roleId)
        const periodName = computed(() => {
            if (props.sportId === 1) {
                return 'период'
            }
            if (props.sportId === 2) {
                return 'период'
            }
            if (props.sportId === 3) {
                return 'четверть'
            }
            if (props.sportId === 4) {
                return 'сет'
            }
            if (props.sportId === 5) {
                return 'партия'
            }
            if (props.sportId === 6) {
                return 'партия'
            }
            return ''
        })

    const controlsChange = () => {
        emit('controlsChange', rows.value)
    }

    const rows = computed(() => {
        if (props.sportId === 7) {
            return store?.state?.rowCricket
        }
        return ''
    })

    const sendEvent = (val) => {
        console.log(val)
    }


        window.addEventListener('offline', () => {
            connection.value = false
        })
        return {
            connection,
            themeWhite,
            periodName,
            rows,
            sendEvent,
            controlsChange,
            roleId,
        }
    },
}
</script>
<style lang="scss" module src="./style.scss"></style>
