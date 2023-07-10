<template>
  <div :class="$style.wrapper">

    <div :class="$style.upperPanel">
      <div>
        <div v-if="roleId === 2 || roleId === 3" :class="$style.title">Список <span :class="$style.white">матчей</span></div>
        <div v-else :class="[$style.tableOptions]">
          <div :class="[$style.title, index === currentTableIndex && $style.current]" v-for="(item, index) in tableOptions" @click="currentTableIndex !== index && changeTableOptions(index)" :key="index">{{roleId === 4 && (item === 'Пользователи' || item === 'Формулы') ? '' : item}}</div>
        </div>
        <div v-if="roleId === 2" :class="$style.createGameButton" @click="createNew">
          <v-image :class="[$style.image]" :name="'add'"></v-image>
          <div :class="$style.buttonText">Создать новый матч</div>
        </div>
        <input
        @input="searchContent"
        :placeholder="
          currentTableIndex === 1 && (roleId === 1 || roleId === 4) ? 'Поиск команды' :
          currentTableIndex === 2 && (roleId === 1 || roleId === 4) ? 'Поиск лиги' :
          currentTableIndex === 3 && (roleId === 1 || roleId === 4) ? 'Поиск пользователя' :
          currentTableIndex === 4 && (roleId === 1 || roleId === 4) ? 'Поиск формул' :
          'Поиск матча'"
        type="text"
        v-model="search">
      </div>
      <div v-if="(roleId === 1 || roleId === 4) && (currentTableIndex === 4)" :class="$style.pannelItemContainer">
        <div :class="$style.createGameButton" @click="popup.changeItem = true; currentAction = 'add'; currentItem = {}">
          <v-image :class="[$style.image]" :name="'add'"></v-image>
          <div :class="$style.buttonText">Создать новую {{currentTableIndex === 1 ? 'команду' : currentTableIndex === 2 ? 'лигу' : 'Формулу'}}</div>
        </div>
      </div>
    </div>

    <!-- {{currentItem}} -->

    <v-gameTable
    v-if="loading"
    :matchInfo="currentTableIndex !== 4 ? data : formulasArray[0]"
    :tableOptionsIndex="currentTableIndex"
    @startMatch="startMatch"
    @browseMatch="browseMatch"
    @editMatch="editMatch"
    @reloadPage="reloadPage"
    @changeInfo="(val) => {currentItem = val; popup.changeItem = true; currentAction = 'edit'; searchFormulaIndex()}"
    @deleteInfo="(val) => {currentItem = val; popup.delete = true; currentAction = 'delete'; searchFormulaIndex()}"
    ></v-gameTable>

    <portal to="popup">
      <v-popupInfoChange
      v-if="popup.changeItem"
      :tableOptionsIndex="currentTableIndex"
      :item="currentItem"
      @closePopupInfoChange="popup.changeItem = false"
      @saveItem="saveItem"
      ></v-popupInfoChange>
      <v-popupDelete
      v-if="popup.delete"
      admin
      @closePopupDelete="popup.delete = false"
      @deleteItem="deleteInfo"
      ></v-popupDelete>
    </portal>
  </div>
</template>
<script>
/* eslint-disable */
import {
  ref, onMounted,
  computed, onUnmounted,
  nextTick,
} from '@vue/composition-api'
// import {
//   clearInterval,
//   setInterval,
// } from 'worker-timers'
import Vue from 'vue'

export default {
  name: 'Home',
    setup(props, context) {
    const store = context.root.$store
    const router = context.root.$router
    const operatorId = computed(() => context.root.$store.state.userId)
    const roleId = computed(() => context.root.$store.state.roleId)
    const allKindsOfSport = computed(() => context.root.$store.state.allKindsOfSport)
    const formulasArray = computed(() => {
      const array = []
      const allFormulas = []
      context.root.$store.state.allKindsOfSport.forEach((item) => {
        array.push(item.formulas)
        item.formulas.forEach((formula) => {
          formula.sportId = item.id
          allFormulas.push(formula)
        })
      })
      array.unshift(allFormulas)
      return array
    })

    const search = ref('')
    // const liveInterval = ref()
    const tableOptions = ref(['Матчи', 'Команды', 'Лиги', 'Пользователи', 'Формулы'])

    const currentTableIndex = ref(0)
    const currentItem = ref({})
    const currentAction = ref('')
    const currentFormulaIndex = ref(-1)

    const loading = ref(true)

    const popup = ref({
      changeItem: false,
      delete: false,
    })
    const data = ref({
      matches: {},
    })

    const createNew = () => {
      router.push('/add')
    }

    const startMatch = async (val) => {
      if (roleId.value === 2) {
        const userMatches = await store.dispatch('checkUsersMatch')
        if (val === userMatches.matchNow) {
          router.push(`/match/${val}`)
        } else if (userMatches.isOnline) {
          Vue.$toast.error('С этого аккаунта уже ведётся матч', {
            position: 'bottom-right',
          })
        } else if (userMatches.matchNow) {
          Vue.$toast.error('Закончите предыдуший матч, перед началом нового', {
            position: 'bottom-right',
          })
        } else {
          router.push(`/match/${val}`)
        }
      } else if (roleId.value === 3) {
        router.push(`/match/${val}`)
      }
    }

    const browseMatch = (val) => {
      router.push(`/match/${val}`)
    }

    const editMatch = (val) => {
      router.push(`/add?id=${val}`)
    }

    const addInfo = async () => {
      popup.value.changeItem = true
    }

    const changeInfo = async (val) => {
      currentItem.value = val
      popup.value.changeItem = false
    }

    const deleteInfo = async () => {
      if (currentTableIndex.value === 4) {
        let allFormulas = allKindsOfSport.value[currentItem.value.sportId - 1].formulas
        allFormulas.splice(currentFormulaIndex.value, 1)
        const responseData = {
          id: currentItem.value.sportId,
          data: {
            formulas: allFormulas,
          },
        }
        await store.dispatch('updateKindOfSport', responseData)
      }
      popup.value.delete = false
      searchContent()
    }

    const searchFormulaIndex = () => {
      allKindsOfSport.value[currentItem.value.sportId - 1].formulas.forEach((item, index) => {
        if (item.name === currentItem.value.name) {
          currentFormulaIndex.value = index
        }
      })
    }

    const saveItem = async (val, file) => {
      if (file) {
        if (currentItem.value.Files[0]) {
          const requestData = {
            fileName: currentItem.value.Files[0].url,
          }
          await store.dispatch('deleteFile', requestData)
        }
        const requestData = {
          image: file,
          avatar: true,
        }
        if (currentTableIndex.value === 0) {
          requestData.matchId = val.id
        } else if (currentTableIndex.value === 1) {
          requestData.team_id = val.id
        } else if (currentTableIndex.value === 2) {
          requestData.leagueId = val.id
        }
        await store.dispatch('addFile', requestData)
      }

      if (currentAction.value === 'add') {
        if (currentTableIndex.value === 4) {
          let editedFormula = val.user_friendly_formula_string
          Object.entries(allKindsOfSport.value[val.sportId - 1].team_base_statistic).map((item) => {
            editedFormula = editedFormula.replace(item[1].name, item[0]);
          })
          let formula = {
            formula_string: editedFormula,
            name: val.name,
            user_friendly_formula_string: val.user_friendly_formula_string,
          }
          let allFormulas = allKindsOfSport.value[val.sportId - 1].formulas
          allFormulas.push(formula)
          const responseData = {
            id: val.sportId,
            data: {
              formulas: allFormulas,
            },
          }
          await store.dispatch('updateKindOfSport', responseData)
        }
      } else if (currentAction.value === 'edit') {
        if (currentTableIndex.value === 0) {
          const requestData = {
            id: val.id,
            data: {
              moderation: val.moderation,
            },
          }
          await store.dispatch('editMatch', requestData)
        } else if (currentTableIndex.value === 1) {
          const requestData = {
            id: val.id,
            data: {
              name: val.name,
              sportId: val.sportId,
              moderation: val.moderation,
            },
          }
          await store.dispatch('updateTeam', requestData)
        } else if (currentTableIndex.value === 2) {
          const requestData = {
            id: val.id,
            data: {
              name: val.name,
              sportId: val.sportId,
              moderation: val.moderation,
            },
          }
          await store.dispatch('updateLeague', requestData)
        } else if (currentTableIndex.value === 3) {
          const responseData = {
            userId: val.id,
            newRole: val.roleId,
          }
          await store.dispatch('changeUserRole', responseData)
        } else if (currentTableIndex.value === 4) {
          let editedFormula = val.user_friendly_formula_string
          Object.entries(allKindsOfSport.value[val.sportId - 1].team_base_statistic).map((item) => {
            editedFormula = editedFormula.replace(item[1].name, item[0]);
          })
          let formula = {
            formula_string: editedFormula,
            name: val.name,
            user_friendly_formula_string: val.user_friendly_formula_string,
          }
          let allFormulas = allKindsOfSport.value[val.sportId - 1].formulas
          allFormulas.splice(currentFormulaIndex.value, 1)
          allFormulas.push(formula)
          const responseData = {
            id: val.sportId,
            data: {
              formulas: allFormulas,
            },
          }
          await store.dispatch('updateKindOfSport', responseData)
        }
      }
      popup.value.changeItem = false
      searchContent()
    }

    const changeTableOptions = async (val) => {
      loading.value = false
      currentTableIndex.value = val
      if (val === 0) {
        await getMatches()
      } else if (val === 1) {
        await getTeams()
      } else if (val === 2) {
        await getLeagues()
      } else if (val === 3) {
        await getUsers()
      }
      loading.value = true
    }

    const searchContent = async () => {
      // loading.value = false
      if (roleId.value === 2 || roleId.value === 3) {
        await getMatches()
      } else if (currentTableIndex.value === 0) {
        await getMatches()
      } else if (currentTableIndex.value === 1) {
        await getTeams()
      } else if (currentTableIndex.value === 2) {
        await getLeagues()
      } else if (currentTableIndex.value === 3) {
        await getUsers()
      } else if (currentTableIndex.value === 4) {
        await store.dispatch('checkVerify')
      }
      // loading.value = true
    }

    const reloadPage = () => {
      searchContent()
    }

    const getLiveInfo = async () => {
      const liveMatchesArray = []
      if (data.value.length) {
        data.value.forEach((item) => {
          if (item.factically_started_at && !item.ended_at) {
            liveMatchesArray.push(item.id)
          }
        })
      }
      const responseLiveData = {
        ids: liveMatchesArray,
      }
      const liveInfo = await store.dispatch('getMatchesStateForSite', responseLiveData)
      if (data.value.length) {
        data.value.forEach((item, index) => {
          if (item.factically_started_at && !item.ended_at) {
            data.value[index].statistics.Side_1.points = liveInfo[item.id].statistics.Side_1.points
            data.value[index].statistics.Side_2.points = liveInfo[item.id].statistics.Side_2.points
            data.value[index].statistics.times = liveInfo[item.id].statistics.times
          }
        })
      }
      loading.value = false
      nextTick(() => {
        loading.value = true
      })
    }

    const getUsers = async () => {
      const responseData = {
        page: 1,
        count: 99,
        conditions: {
          OR: [
            {
              name: {
                startsWith: search.value,
              },
            }, {
              email: {
                startsWith: search.value,
              },
            },
          ],
        },
      }
      data.value = await store.dispatch('searchUsers', responseData)
    }

    const getLeagues = async () => {
      const responseData = {
        page: 1,
        count: 99,
        searchData: {
          name: {
            contains: search.value,
            mode: 'insensitive',
          },
        },
      }
      data.value = await store.dispatch('searchLeague', responseData)
    }

    const getTeams = async () => {
      const responseData = {
        page: 1,
        count: 99,
        searchData: {
          name: {
            contains: search.value,
            mode: 'insensitive',
          },
        },
      }
      data.value = await store.dispatch('searchTeam', responseData)
    }

    const getMatches = async () => {
      const responseData = {
        page: 1,
        count: 99,
        searchData: {
          name: {
            contains: search.value,
          },
        },
      }
      data.value = await store.dispatch('getMatches', responseData)
    }

    onMounted(async () => {
      setTimeout(async () => {
        getMatches()
        if (roleId.value === 3) {
          getLiveInfo()
          // liveInterval.value = setInterval(() => getLiveInfo(), 20000)
        }
      }, 500)
    })

    onUnmounted(() => {
      // if (liveInterval.value) {
      //   clearInterval(liveInterval.value)
      // }
    })

    return {
      data,
      operatorId,
      roleId,
      allKindsOfSport,
      formulasArray,

      createNew,
      startMatch,
      editMatch,
      browseMatch,
      // editFormula,

      reloadPage,

      search,
      searchContent,

      loading,
      popup,

      getLiveInfo,
      getUsers,
      getMatches,
      getLeagues,
      getTeams,

      tableOptions,
      changeTableOptions,

      currentTableIndex,
      currentItem,
      currentAction,
      currentFormulaIndex,
      changeInfo,
      deleteInfo,
      addInfo,
      saveItem,
      searchFormulaIndex,
    }
  },
}
</script>
<style lang="scss" module src="./style.scss"></style>
