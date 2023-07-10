<template>
    <div :class="$style.wrapper">
        <div :class="$style.row">

            <template v-if="$props.tableOptionsIndex === 0">
                <div :class="[$style.data, $style.title]">Дата</div>
                <div :class="[$style.type, $style.title]">Тип игры</div>
                <div :class="[$style.teams, $style.title]">Команды</div>
                <div :class="[$style.score, $style.title]">Счет</div>
                <div :class="[$style.statistic, $style.title]">Статистика</div>
                <div v-if="roleId === 1 || roleId === 4" :class="[$style.score, $style.title]">Модерация</div>
                <div v-if="roleId === 1 || roleId === 4" :class="[$style.score, $style.title]">Логотип</div>
                <div :class="[$style.status, $style.title]">Статус</div>
                <div :class="[$style.edit]"></div>
            </template>

            <template v-if="$props.tableOptionsIndex === 1">
                    <div :class="[$style.data, $style.title]">Название команды</div>
                    <div :class="[$style.data, $style.title]">Вид спорта</div>
                    <div :class="[$style.type, $style.title]">Модерация</div>
                    <div :class="[$style.score, $style.title]">Логотип</div>
                    <div :class="[$style.adminEdit]" :style="{width: '16.2rem'}">
                        <div :class="[$style.delete]"></div>
                    </div>
            </template>

            <template v-if="$props.tableOptionsIndex === 2">
                    <div :class="[$style.data, $style.title]">Название лиги</div>
                    <div :class="[$style.data, $style.title]">Вид спорта</div>
                    <div :class="[$style.type, $style.title]">Модерация</div>
                    <div :class="[$style.score, $style.title]">Логотип</div>
                    <div :class="[$style.adminEdit]" :style="{width: '16.2rem'}">
                        <div :class="[$style.delete]"></div>
                    </div>
            </template>

            <template v-if="$props.tableOptionsIndex === 3">
                    <div :class="[$style.data, $style.title]">Пользователь</div>
                    <div :class="[$style.data, $style.title]">Email</div>
                    <div :class="[$style.type, $style.title]">Кол-во просмотров</div>
                    <div :class="[$style.teams, $style.title]">Роль</div>
                    <div :class="[$style.adminEdit]" :style="{width: '16.2rem'}">
                        <div :class="[$style.delete]"></div>
                    </div>
            </template>

            <template v-if="$props.tableOptionsIndex === 4">
                    <div :class="[$style.data, $style.title]">Название формулы</div>
                    <div :class="[$style.data, $style.title]">Формула</div>
                    <div :class="[$style.adminEdit]" :style="{width: '16.2rem'}">
                        <div :class="[$style.delete]"></div>
                    </div>
            </template>

        </div>
        <div :class="$style.row"
        v-for="(item, index) in data"
        :key="index">

            <template v-if="tableOptionsIndex === 0 && item.statistics">
                <div :class="[$style.data, $style.text]">{{convertedTime[index]}}</div>
                <div :class="[$style.type, $style.text]">{{item.KindOfSport ? item.KindOfSport.name : ''}}</div>
                <div :class="[$style.teams, $style.text]">{{item.name}}</div>
                <template v-if="item.ended_at && !item.statistics.techEnd">
                    <div :class="[$style.score, $style.text]">{{item.statistics.Side_1.points}}:{{item.statistics.Side_2.points}}</div>
                </template>
                <template v-else>
                    <div :class="[$style.score, $style.text]">-</div>
                </template>
                <div :class="[$style.statistic, $style.text, item.ended_at && $style.underlinep]">
                    {{item.statistics.techEnd && item.statistics.techEndInfo !== "undefined" ? item.statistics.techEndInfo : ''}}
                    <template v-if="!item.statistics.techEnd">
                        <div :class="[$style.periodScore]" v-for="(item, index) in item.statistics.times" :key="index">
                            {{item}}
                        </div>
                    </template>
                </div>
                <div v-if="roleId === 1 || roleId === 4" :class="[$style.score, $style.title]">{{item.moderation ? 'Да' : 'Нет'}}</div>
                <div v-if="(roleId === 1 || roleId === 4) && item.Files" :class="[$style.score, $style.title]">{{item.Files.length ? 'Да' : 'Нет'}}</div>
                <div :class="[$style.status, $style.text]" :style="{padding: item.statistics.techEnd && '0.2rem'}">
                    <template v-if="item.factically_started_at && !item.ended_at">
                        <div @click="$emit('startMatch', item.id)" :class="[$style.statusText, $style.greenDark]">
                            {{roleId === 3 ? 'Присоединиться' : roleId === 2 ? 'Продолжить' : 'Идёт'}}
                        </div>
                    </template>
                    <template v-else-if="item.ended_at && item.statistics.techEnd">
                        <div @click="$emit('browseMatch', item.id)" :class="[$style.statusText, $style.yellow, $style.expand]">
                            Завершен по тех. причинам
                        </div>
                    </template>
                    <template v-else-if="item.ended_at">
                        <div @click="$emit('browseMatch', item.id)" :class="[$style.statusText, $style.purple]">
                            Завершен
                        </div>
                    </template>
                    <template v-else-if="!item.ended_at">
                        <div @click="$emit('startMatch', item.id)" :class="[$style.statusText, $style.green]">
                            {{roleId === 2 ? 'Начать матч' : 'Не начат'}}
                        </div>
                    </template>
                </div>
                <div :class="[$style.edit]">
                    <v-icon  @click="roleId === 2 ? $emit('editMatch', item.id) : $emit('changeInfo', item)" v-if="(!item.ended_at && !item.factically_started_at && roleId !== 3) || (roleId === 1 || roleId === 4)" :name="'edit'"></v-icon>
                </div>
            </template>


            <template v-if="tableOptionsIndex === 1 && item">
                <div :class="[$style.data, $style.text]">{{item.name}}</div>
                <div :class="[$style.data, $style.text]">{{item.KindOfSport ? item.KindOfSport.name : ''}}</div>
                <div :class="[$style.type, $style.text]">{{item.moderation ? 'Да' : 'Нет'}}</div>
                <div v-if="item.Files" :class="[$style.score, $style.title]">{{item.Files.length ? 'Да' : 'Нет'}}</div>
                <div :class="[$style.status, $style.text]">
                    <div @click="$emit('changeInfo', item)" :class="[$style.statusText, $style.greenDark]">
                        Редактировать
                    </div>
                    <div :class="[$style.delete]">
                        <v-icon @click="$emit('deleteInfo', item)" :class="[$style.deleteIcon]" :name="'delete'"></v-icon>
                    </div>
                </div>
            </template>


            <template v-if="tableOptionsIndex === 2 && item">
                <div :class="[$style.data, $style.text]">{{item.name}}</div>
                <div :class="[$style.data, $style.text]">{{item.KindOfSport ? item.KindOfSport.name : ''}}</div>
                <div :class="[$style.type, $style.text]">{{item.moderation ? 'Да' : 'Нет'}}</div>
                <div v-if="item.Files" :class="[$style.score, $style.title]">{{item.Files.length ? 'Да' : 'Нет'}}</div>
                <div :class="[$style.status, $style.text]">
                    <div @click="$emit('changeInfo', item)" :class="[$style.statusText, $style.greenDark]">
                        Редактировать
                    </div>
                    <div :class="[$style.delete]">
                        <v-icon @click="$emit('deleteInfo', item)" :class="[$style.deleteIcon]" :name="'delete'"></v-icon>
                    </div>
                </div>
            </template>


            <template v-if="tableOptionsIndex === 3 && item">
                <div :class="[$style.data, $style.text]">{{item.name}}</div>
                <div :class="[$style.data, $style.text]">{{item.email}}</div>
                <div :class="[$style.type, $style.text]">{{item.matchCount ? item.matchCount.WatchedMatches : 0}}</div>
                <div :class="[$style.teams, $style.title]">{{item.roleId === 1 ? 'Админ' : item.roleId === 2 ? 'Оператор' : item.roleId === 3 ? 'Наблюдатель' : 'Модератор'}}</div>
                <div :class="[$style.status, $style.text]">
                    <div @click="$emit('changeInfo', item)" :class="[$style.statusText, $style.greenDark]">
                        Редактировать
                    </div>
                    <div :class="[$style.delete]">
                        <!-- <v-icon v-if="item.roleId !== 1" @click="deleteContent(item.id)" :class="[$style.deleteIcon]" :name="'delete'"></v-icon> -->
                    </div>
                </div>
            </template>

            <template v-if="tableOptionsIndex === 4 && item">
                <div :class="[$style.data, $style.title]">{{item.name}}</div>
                <div :class="[$style.data, $style.title]">{{item.formula_string}}</div>
                <div :class="[$style.status, $style.text]">
                    <div @click="$emit('changeInfo', item)" :class="[$style.statusText, $style.greenDark]">
                        Редактировать
                    </div>
                    <div :class="[$style.delete]">
                        <v-icon @click="$emit('deleteInfo', item)" :class="[$style.deleteIcon]" :name="'delete'"></v-icon>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
import { computed } from '@vue/composition-api'

export default {
  name: 'v-gameTable',
  props: {
    matchInfo: {
        type: [Array, Object],
        default: () => [],
    },
    tableOptionsIndex: {
        type: Number,
        default: 0,
    },
  },
  setup(props, context) {
    const roleId = computed(() => context.root.$store.state.roleId)
    // const store = context.root.$store
    // const { emit } = context

    const data = computed(() => Array.from(props.matchInfo))
    const convertedTime = computed(() => {
        const timeArray = []
        const localData = Array.from(props.matchInfo)
        localData.forEach((item) => {
            timeArray.push(item.date)
        })
        timeArray.forEach((item, index) => {
            timeArray[index] = new Date(item)
            const month = timeArray[index].getMonth()
            const day = timeArray[index].getDate()
            const year = timeArray[index].getFullYear()
            const monthNames = [
                'янв.', 'фев.', 'мар.', 'апр.', 'мая', 'июн.',
                'июл.', 'авг.', 'сен.', 'окт.', 'нояб.', 'дек.',
            ]
            timeArray[index] = `${day} ${monthNames[month]} ${year}`
        })
        return timeArray
    })

    // const changeRole = (val) => {
    //     currentItem.value = val
    //     popupInfoChange.value = true
    // }
    // const changeInfo = (val) => {
    //     currentItem.value = val
    //     popupInfoChange.value = true
    // }

    // const confirmRoleChange = async (val) => {
    //     popupInfoChange.value = false
    //     let newRole = ''
    //     if (val === 'Админ') {
    //         newRole = 1
    //     } else if (val === 'Оператор') {
    //         newRole = 2
    //     } else if (val === 'Наблюдатель') {
    //         newRole = 3
    //     } else if (val === 'Модератор') {
    //         newRole = 4
    //     }
    //     const responseData = {
    //         userId: currentItem.value.id,
    //         newRole: newRole,
    //     }
    //     await store.dispatch('changeUserRole', responseData)
    //     popupInfoChange.value = false
    //     currentItem.value = {}
    //     emit('reloadPage')
    // }

    // const confirmTeamChange = async (val) => {
    //     await store.dispatch('updateTeam', val)
    //     popupInfoChange.value = false
    //     currentItem.value = {}
    //     emit('reloadPage')
    // }

    // const confirmLeagueChange = async (val) => {
    //     await store.dispatch('updateLeague', val)
    //     popupInfoChange.value = false
    //     currentItem.value = {}
    //     emit('reloadPage')
    // }

    // const deleteContent = (val) => {
    //     popupDelete.value = true
    //     deletedItem.value = val
    // }

    // const confirmDeleteContent = async () => {
    //     if (props.tableOptionsIndex === 1) {
    //         await store.dispatch('deleteTeam', deletedItem.value.id)
    //     } else if (props.tableOptionsIndex === 2) {
    //         await store.dispatch('deleteLeague', deletedItem.value.id)
    //     }
    //     popupInfoChange.value = false
    //     currentItem.value = {}
    //     emit('reloadPage')
    // }

    // const confirmMatchChange = async (val) => {
    //     const requestData = {
    //         id: val.id,
    //         data: {
    //             moderation: val.moderation,
    //         },
    //     }
    //     await store.dispatch('editMatch', requestData)
    //     popupInfoChange.value = false
    //     currentItem.value = {}
    //     emit('reloadPage')
    // }

    return {
        convertedTime,
        roleId,
        // currentItem,
        // popupInfoChange,
        // popupDelete,
        // deletedItem,
        data,

        // changeRole,
        // changeInfo,
        // deleteContent,
        // confirmRoleChange,
        // confirmTeamChange,
        // confirmLeagueChange,
        // confirmMatchChange,
        // confirmDeleteContent,
    }
  },
}
</script>

<style lang="scss" module>

.wrapper {
  width: 100%;
  display: flex;
  padding-bottom: 2rem;
  flex-direction: column;
    .row{
        width: 100%;
        display: flex;
        padding: 0 2rem;
        justify-content: space-between;
        .title {
            font-weight: 700;
            @include text-small;
            color: var(--white);
            display: flex;
            align-items: flex-end;
            padding: 0.9rem 0;
        }
        .text {
            font-weight: 400;
            @include text-small;
            color: var(--white);
            padding: 0.9rem 0;
            display: flex;
            align-items: center;
        }
        .data {
            width: 18.1rem;
        }
        .type {
            width: 16.5rem;
        }
        .teams {
            width: 22.5rem;
        }
        .score {
            width: 8rem;
        }
        .statistic {
            width: 30.5rem;
            .periodScore + .periodScore {
                margin-left: 1rem;
            }
        }
        .delete {
            display: flex;
            align-items: center;
            width: 2.4rem;
            height: 2.4rem;
            .deleteIcon {
                width: 100%;
                height: 100%;
            }
        }
        .status {
            width: 16.2rem;
            padding: 0;
            display: flex;
            align-items: center;
            .delete {
                margin-left: 2rem;
            }
            .statusText {
                height: 2.6rem;
                border-radius: var(--border-radius);
                padding: 0 1.2rem;
                // color: var(--black);
                color: black;
                width: 13.8rem;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            .green {
                cursor: pointer;
                background-color: var(--greenLight);
                transform: translate3d(0);
                transition: transform 0.15s ease-out;
            }
            .purple {
                background-color: var(--purple);
                cursor: pointer;
                transform: translate3d(0);
                transition: transform 0.15s ease-out;
            }
            .yellow {
                background-color: var(--yellow);
                cursor: pointer;
                transform: translate3d(0);
                transition: transform 0.15s ease-out;
            }
            .greenDark {
                cursor: pointer;
                background-color: var(--green);
                transform: translate3d(0);
                transition: transform 0.15s ease-out;
            }
        }
        .expand {
            text-align: center;
            height: 4rem !important;
        }
        .statusText:hover {
            transform: scale(1.05);
        }
        .statusText:active {
            transform: scale(0.95);
        }
        .adminEdit{
            display: flex;
            align-items: center;
            width: 2.4rem;
            img {
                width: 100%;
            }
        }
        .edit {
            display: flex;
            align-items: center;
            width: 2.4rem;
            // margin-right: 2.5rem;
            img {
                width: 100%;
            }
        }
        .underline {
            text-decoration-line: underline;
        }
    }
    .row:nth-child(even) {
        background-color: rgba(#D9D9D9, 0.1);
    }
}

.invert {
    filter: invert(1);
}
</style>
