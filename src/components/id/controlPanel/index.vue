<template>
<div :class="$style.container">

    <template v-if="$props.sportId !== 7">
        <div :class="$style.row">
            <div :class="$style.teamName">
                <verte ref="verte" :class="[$style.colorPicker, (!$props.socketConnect || !$props.stage) && $style.disabled]" picker="square" v-model="teamColor" model="rgb"></verte>
                {{$props.teamInfo.name}}
            </div>
        </div>
        <draggable v-if="$props.stage !== 2 && !($props.sportId === 3 && $props.teamInfo.delay === 1)" v-model="rows" :disabled="!$props.freeButtonMovement" :class="[$style.dragContaner, $style.colomn]">
            <div :class="$style.row" v-for="row in rows" :key="row.index">
                <draggable :list="row.items" :group="{ name: 'row' }" @change="controlsChange" :disabled="!$props.freeButtonMovement" :class="$style.dragContaner">
                    <v-btn
                    v-for="item in row.items"
                    :class="[
                    (!$props.socketConnect || !$props.stage || $props.gameEnd) && $style.disabled,
                    $props.freeButtonMovement && $style.grab,
                    (item.id === 29 && ($props.sportId === 6) && ($props.teamInfo.delay === 4 || $props.teamInfo.delay === 2)) && $style.disabled,
                    (item.id === 29 && ($props.sportId === 6) && ($props.teamInfo.delay === 1 || $props.teamInfo.delay === 3 || $props.teamInfo.delay === 5)) && $style.hidden,
                    (item.id === 30 && ($props.sportId === 6) && !($props.teamInfo.delay === 1 || $props.teamInfo.delay === 3 || $props.teamInfo.delay === 5)) && $style.hidden,
                    (item.name !== 'Очко' && $props.sportId === 4 && ($props.teamInfo.delay === 2)) && $style.disabled,
                    (item.name === 'Подача' && ($props.sportId === 4) && ($props.teamInfo.delay === 1)) && $style.disabled,
                    ($props.sportId === 3 && $props.teamInfo.delay === 2) && $style.disabled,
                    ($props.sportId === 3 && !showOffButton && (item.name === 'Перехват' || item.name === 'Потеря' || item.name === 'Подбор в атаке' || item.name === 'Подбор в защите' || item.name === 'Замена')) && $style.hidden
                    ]"
                    :high="$props.sportId === 5"
                    :medium="$props.sportId === 6"
                    :key="item.name"
                    :color="item.color"
                    @click="$emit('makeEvent', item, $props.teamInfo.name)"
                    :animation="item.name === 'Владение' && $props.animation"
                    >
                        {{ item.name === 'Штрафной' && $props.sportId === 3 && $props.penaltyMain ? 'Закончить штрафной' : item.name}}
                        {{ (item.name === 'Фол' && ($props.sportId === 1 || $props.sportId === 3)) ? `: ${$props.teamInfo.foul}` : ''}}
                        {{ (item.name === 'Угловой' && $props.sportId === 2) ? `: ${$props.teamInfo.cornerKick}` : '' }}
                        {{ (item.name === 'Красная карточка' && $props.sportId === 2) ? `: ${$props.teamInfo.redCard}` : '' }}
                        {{ (item.name === 'Желтая карточка' && $props.sportId === 2) ? `: ${$props.teamInfo.yellowCard}` : '' }}
                        {{ (item.name === 'Владение' && $props.sportId === 3) ? `: ${$props.teamInfo.holdTimeBasket}` : '' }}
                    </v-btn>
                </draggable>
            </div>
        </draggable>
    </template>

        <template v-if="$props.stage === 2">
            <div :class="$style.row">
                <v-btn :class="$props.stage" @click="$emit('makeEvent', {id: 1}, $props.teamInfo.name)">
                    Гол +1
                </v-btn>
                <v-btn :class="$props.stage" @click="$emit('makeEvent', {id: 6}, $props.teamInfo.name)">
                    Промах
                </v-btn>
            </div>
            <div :class="$style.row">
                <v-btn :class="$props.stage" @click="$emit('endGame')" :color="'red'">
                    Победа по {{$props.sportId === 1 ? 'буллитам' : 'пенальти'}}
                </v-btn>
            </div>
        </template>

        <template v-if="$props.sportId === 3 && $props.teamInfo.delay === 1">
            <div :class="$style.row">
                <v-btn :class="$props.stage" @click="$emit('makeEvent', {id: 24}, $props.teamInfo.name)">
                    1 Очко
                </v-btn>
            </div>
            <div :class="$style.row">
                <v-btn :class="$props.stage" @click="$emit('makeEvent', {id: 42}, $props.teamInfo.name)">
                    Закончить штрафной
                </v-btn>
                <v-btn :class="$props.stage" @click="$emit('makeEvent', {id: 6}, $props.teamInfo.name)">
                    Промах
                </v-btn>
            </div>
        </template>

        <input v-if="$props.sportId === 3" :class="$style.showOffButton" v-model="showOffButton" type="checkbox">

    <!-- Крикет -->
    <!-- <template v-if="$props.sportId === 7">
        <div :class="$style.row">
            <div :class="$style.teamName">
                {{$props.team}}
            </div>
        </div>
        <div v-if="$props.cricketEnableStats" :class="[$style.row, $style.cricketText]">
            <div><span>Need</span> {{$props.cricketEnemyScore + 1}}</div>
            <div><span>From</span> {{$props.cricketOverCount / 2}}</div>
        </div>
        <div :class="[$style.row, $style.outContainer]">
            <div :class="$style.outCount">
                {{$props.foul}}
            </div>
            <div :class="$style.outCount">
                Ауты
            </div>
        </div>
        <div :class="$style.row">
            <div :class="$style.selectContainer"></div>
            <div :class="$style.replaceButtonContainer"></div>
        </div>

        <div v-if="!$props.cricket" :class="$style.row">
            <div :class="$style.selectorContainer">
                <div :class="$style.selectorname">Боулер</div>
                <select
                :disabled="$props.gameStatus"
                :class="$style.select"
                @input="setPropertyCricketBowler"
                >
                <option
                    v-for="(item, index) in $props.arrayTeam"
                    :key="index"
                    :class="$style.optionItem"
                    :selected="item === $props.cricketBowler && $props.cricketBowler"
                >
                    {{ item }}
                </option>
                <option :class="$style.optionItem" :selected="!$props.cricketBowler"></option>
                </select>
                <v-image :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectSecond'"></v-image>
            </div>
        </div>

        <div v-if="$props.cricket" :class="$style.row">
            <v-image @click="$emit('swapBatters'); swapBattersRotate = !swapBattersRotate" :name="'replace'" :class="[$style.swapBatters, swapBattersRotate && $style.swapBattersRotate, themeWhite && $style.invert, $props.gameStatus && $style.disabled]"></v-image>
            <div :class="$style.multiSelectorContainer">
                <div :class="$style.selectorContainer">
                    <div :class="$style.selectorname">Главный Бэттер</div>
                    <select
                    :disabled="$props.gameStatus"
                    :class="$style.select"
                    @input="setPropertyCricketBatterMain"
                    >
                    <option
                        v-for="(item, index) in $props.arrayTeam"
                        :key="index"
                        :class="$style.optionItem"
                        :value="item"
                        :selected="item === $props.cricketBatterMain && $props.cricketBatterMain"
                    >
                        {{ item }}
                    </option>
                    <option :class="$style.optionItem" :selected="!$props.cricketBatterMain"></option>
                    </select>
                    <v-image :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectSecond'"></v-image>
                </div>
                <div :class="$style.selectorContainer">
                    <div :class="$style.selectorname">Бэттер</div>
                    <select
                    :disabled="$props.gameStatus"
                    :class="$style.select"
                    @input="setPropertyCricketBatterRest"
                    >
                    <option
                        v-for="(item, index) in $props.arrayTeam"
                        :key="index"
                        :class="$style.optionItem"
                        :selected="item === $props.cricketBatterRest && $props.cricketBatterRest"
                    >
                        {{ item }}
                    </option>
                    <option :class="$style.optionItem" :selected="!$props.cricketBatterRest"></option>
                    </select>
                    <v-image :class="[$style.selectArrow, themeWhite && $style.invert]" :name="'selectSecond'"></v-image>
                </div>
            </div>
        </div>

    </template> -->
</div>
</template>

<script>
/* eslint-disable */
import { ref, computed, watch } from '@vue/composition-api'
import draggable from 'vuedraggable'
import Verte from 'verte'
import 'verte/dist/verte.css'

export default {
    name: 'v-control-panel',
    props: {
        sportId: {
            type: Number,
            defaul: 0,
        },
        freeButtonMovement: {
            type: Boolean,
            default: false,
        },
        stage: {
            type: Number,
            default: 0,
        },
        socketConnect: {
            type: Boolean,
            default: false,
        },
        teamInfo: {
            type: Object,
            ddefault: () => {},
        },
        animation: {
            type: Boolean,
            default: false,
        },
        gameEnd: {
            type: Boolean,
            default: false,
        },
    },
    components: {
        draggable,
        Verte,
    },
    setup(props, ctx) {
    const store = ctx.root.$store
    const { emit } = ctx
    const themeWhite = computed(() => ctx.root.$store.state.whiteTheme)
    const showOffButton = ref(true)
    // const swapBattersRotate = ref(false)
    const teamColor = ref(props.teamInfo.color)
    const teamColorStart = ref(props.teamInfo.color)
    const verte = ref()
    const rows = computed(() => {
        if (props.sportId === 1) {
            return store?.state?.rowHockey
        }
        if (props.sportId === 2) {
            return store?.state?.rowSoccer
        }
        if (props.sportId === 3) {
            return store?.state?.rowBasketball
        }
        if (props.sportId === 4) {
            return store?.state?.rowTennis
        }
        if (props.sportId === 5) {
            return store?.state?.rowVolleyball
        }
        if (props.sportId === 6) {
            return store?.state?.rowPingPong
        }
        return ''
    })

    const controlsChange = () => {
        emit('controlsChange', rows.value)
    }

    // const setPropertyCricketBowler = (val) => {
    //     emit('setPropertyCricketBowler', val.target.value)
    // }

    // const setPropertyCricketBatterMain = (val) => {
    //     emit('setPropertyCricketBatterMain', val.target.value)
    // }

    // const setPropertyCricketBatterRest = (val) => {
    //     emit('setPropertyCricketBatterRest', val.target.value)
    // }

    watch(() => verte?.value?.isMenuActive, () => {
        if (!verte.value.isMenuActive && teamColorStart.value !== teamColor.value) {
            emit('setNewTeamColor', {
                color: teamColor.value,
                team: props.teamInfo.name,
            })
        }
    })

    return {
        showOffButton,
        // setPropertyCricketBowler,
        // setPropertyCricketBatterMain,
        // setPropertyCricketBatterRest,
        // swapBattersRotate,
        rows,
        controlsChange,
        themeWhite,
        verte,
        teamColor,
        teamColorStart,
    }
  },
}
</script>
<style lang="scss" module src="./style.scss"></style>
