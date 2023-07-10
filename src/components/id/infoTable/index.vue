<template>
    <div :class="[$style.container]">
        <div :class="[$style.wrapper, $style.expanded]">
            <div :class="$style.row">
                <div :class="[$style.color, $style.title]"></div>
                <div :class="[$style.data, $style.title]">Дата</div>
                <div :class="[$style.gameTime, $style.title]">Игровое время</div>
                <div :class="[$style.gameTime, $style.title]">МСК время</div>
                <div :class="[$style.event, $style.title]">Тип события</div>
                <div :class="[$style.team, $style.title]">Команда</div>
                <div :class="[$style.player, $style.title]">Игрок</div>
                <div :class="[$style.score, $style.title]">Счет</div>
                <div :class="[$style.time, $style.title]">{{$props.sportId === 6 ? 'Штраф' : 'Время на удалении (мин.)'}}</div>
            </div>
            <div :class="[$style.row, $style.contentRow, item.status === 'deleted' && $style.deleted]"
            v-for="(item, index) in $props.data"
            :key="index">
                <div v-if="item.status !== 'deleted' && item.eventMessage && index < 6" :class="[$style.eventRow,  $style.text]">{{item.eventMessage}}</div>
                <div :class="$style.mainRow">
                    <template v-if="index < 5 || roleId === 3 || roleId === 2 || $props.stage === 3">
                        <div :class="[$style.color, $style.text]">
                            <div :class="[$style.colorContainer, $style[item.event.eventColor]]"></div>
                        </div>
                        <div :class="[$style.data, $style.text]">{{item.date}}</div>
                        <div :class="[$style.gameTime, $style.text]">{{item.gameTime}}</div>
                        <div :class="[$style.gameTime, $style.text]">{{item.moscowTime}}</div>
                        <div :class="[$style.event, $style.text]">{{item.event.eventName}}</div>
                        <div :class="[$style.team, $style.text]">{{item.team}}</div>
                        <div :class="[$style.player, $style.text]">{{item.player}}</div>
                        <div  :class="[$style.score, $style.text]">
                            <template v-if="$props.sportId === 4">
                                {{`${item.matchStatistics.Side_2.tennisScore} : ${item.matchStatistics.Side_1.tennisScore}`}}
                            </template>
                            <template v-else-if="$props.replace">
                                {{`${item.matchStatistics.Side_2.score} : ${item.matchStatistics.Side_1.score}`}}
                            </template>
                            <template v-else>
                                {{`${item.matchStatistics.Side_1.score} : ${item.matchStatistics.Side_2.score}`}}
                            </template>
                        </div>
                        <div :class="[$style.time, $style.text]">{{$props.sportId !== 6 ? item.deleteTime[0] : ''}}{{$props.sportId !== 6 ? item.deleteTime[1] : ''}}{{$props.sportId === 6 ? item.deleteTime : ''}}</div>
                        <template v-if="$props.stage !== 3 && roleId === 2">
                            <div :class="[$style.edit]" v-if="item.status !== 'loading'">
                                <v-icon :class="[$style.editIcon]" v-if="item.status !== 'deleted' && item.event.editable" @click="$emit('editItem')" :name="'edit'"></v-icon>
                            </div>
                            <div :class="[$style.delete]" v-if="index === $props.lastDeletableEventIndex && item.status !== 'loading'">
                                <v-icon :class="[$style.deleteIcon]" v-if="item.status !== 'deleted' && item.event.deletable" @click="$emit('deleteItem')" :name="'delete'"></v-icon>
                            </div>
                            <div :class="[$style.delete]" v-if="item.status === 'loading'">
                                <div :class="[$style.loader]"></div>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <div :class="$style.rowNoInfo" v-if="!$props.data.length">
                Нет событий
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import { computed } from '@vue/composition-api'

export default {
  name: 'v-infoTable',
  props: {
    data: {
        type: Array,
        default: () => [],
    },
    lastDeletableEventIndex: {
        type: Number,
        default: 0,
    },
    stage: {
        type: Number,
        default: 0,
    },
    sportId: {
        type: Number,
        default: 0,
    },
  },
  setup(props, context) {
    const themeWhite = computed(() => context.root.$store.state.whiteTheme)
    const store = context.root.$store
    const roleId = computed(() => store?.state?.roleId)

    return {
        themeWhite,
        roleId,
    }
  },
}
</script>
<style lang="scss" module src="./style.scss"></style>
