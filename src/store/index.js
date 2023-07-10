/* eslint-disable */
import { axios } from '@/plugins/axios'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const axiosPlugin = (store) => {
  store.$axios = axios
}

const tokenStr = localStorage.getItem('token')
axios.defaults.baseURL = process.env.VUE_APP_BASE_URL

const LSstore = new Vuex.Store({
  state: {
    token: tokenStr,
    userId: '',
    name: '',
    email: '',
    roleId: 0,
    whiteTheme: false,
    allKindsOfSport: [],
    rowHockey:
      [
        { index: 1, items: [{ name: 'Гол +1', id: 1 }, { name: 'Удар в створ', id: 5 }, { name: 'Промах', id: 6 }] },
        { index: 2, items: [{ name: 'Фол', color: 'red', id: 7 }] },
        { index: 3, items: [{ name: 'Удаление', id: 2 }] },
        { index: 4, items: [{ name: 'Владение', id: 3 }] },
        { index: 5, items: [{ name: 'Замена', id: 4 }] },
      ],
    rowSoccer:
      [
        { index: 1, items: [{ name: 'Гол +1', id: 1 }] },
        { index: 2, items: [{ name: 'Аут', id: 14 }, { name: 'Удар по воротам', id: 13 }, { name: 'Удар в створ', id: 5 }] },
        { index: 3, items: [{ name: 'Владение', id: 3 }] },
        { index: 4, items: [{ name: 'Желтая карточка', color: 'yellow', id: 15 }, { name: 'Красная карточка', color: 'redDark', id: 16 }] },
        { index: 5, items: [{ name: 'Оффсайд', id: 17 }, { name: 'Угловой', id: 18 }] },
        { index: 6, items: [{ name: 'Штрафной', id: 19 }, { name: 'Пенальти', id: 34 }] },
        { index: 7, items: [{ name: 'Замена', id: 4 }] },
      ],
    rowBasketball:
      [
        { index: 1, items: [{ name: '3 Очка', id: 22 }, { name: '2 Очка', id: 23 }] },
        { index: 2, items: [{ name: 'Фол', id: 7, color: 'red' }] },
        { index: 3, items: [{ name: 'Штрафной', id: 19 }, { name: 'Промах', id: 6 }] },
        { index: 4, items: [{ name: 'Владение', id: 3 }] },
        { index: 5, items: [{ name: 'Перехват', id: 25 }, { name: 'Потеря', id: 26 }] },
        { index: 6, items: [{ name: 'Подбор в атаке', id: 27 }, { name: 'Подбор в защите', id: 28 }] },
        { index: 7, items: [{ name: 'Замена', id: 4 }] },
      ],
    rowVolleyball:
      [
        { index: 1, items: [{ name: '+1 Очко', id: 30 }] },
        { index: 2, items: [{ name: 'Подача', id: 29 }] },
      ],
    rowPingPong:
      [
        { index: 1, items: [{ name: '+1 Очко', id: 30 }, { name: 'Подача', id: 29 }] },
        { index: 2, items: [{ name: 'Желтая карточка', color: 'yellow', id: 15 }, { name: 'Красная карточка', color: 'redDark', id: 16 }] },
        { index: 3, items: [] },
      ],
    rowTennis:
      [
        { index: 1, items: [{ name: 'Подача', id: 29 }] },
        { index: 2, items: [{ name: 'Очко', id: 30 }] },
        { index: 3, items: [{ name: 'Ошибка', id: 31 }] },
        { index: 4, items: [{ name: 'Эйс', id: 32 }] },
      ],
    rowCricket:
      [
        { index: 1, items: [{ name: '0' }, { name: '+1' }, { name: '+2' }, { name: '+3' }, { name: '+4' }] },
        { index: 2, items: [{ name: '+5' }, { name: '+6' }, { name: '+7' }, { name: '+8' }, { name: '+9' }] },
        { index: 3, items: [] },
        { index: 4, items: [] },
      ],
  },
  mutations: {
    changeRowHockey(state, value) {
      state.rowHockey = value
    },
    changeRowSoccer(state, value) {
      state.rowSoccer = value
    },
    changeRowBasketball(state, value) {
      state.rowBasketball = value
    },
    changeRowVolleyball(state, value) {
      state.rowVolleyball = value
    },
    changeRowPingPong(state, value) {
      state.rowPingPong = value
    },
    changeRowTennis(state, value) {
      state.rowTennis = value
    },
    changeRowCricket(state, value) {
      state.rowCricket = value
    },
    changeTheme(state) {
      state.whiteTheme = !state.whiteTheme
    },
    setToken(state) {
      const token = localStorage.getItem('token')
      if (token) {
        this.$axios.defaults.headers.common.Authorization = `Bearer ${token}`
        state.token = token
      }
    },
    setUserInfo(state, params) {
      state.userId = params.id
      state.name = params.name
      state.email = params.email
      state.roleId = params.roleId
      if (params.role) {
        state.roleId = params.role
      }
      if (params.buttons) {
        params.buttons.forEach((item) => {
          if (item.sportId === 1 && Object.keys(item.data).length) {
            state.rowHockey = item.data
          } else if (item.sportId === 2 && Object.keys(item.data).length) {
            state.rowSoccer = item.data
          } else if (item.sportId === 3 && Object.keys(item.data).length) {
            state.rowBasketball = item.data
          } else if (item.sportId === 4 && Object.keys(item.data).length) {
            state.rowTennis = item.data
          } else if (item.sportId === 5 && Object.keys(item.data).length) {
            state.rowVolleyball = item.data
          } else if (item.sportId === 6 && Object.keys(item.data).length) {
            state.rowPingPong = item.data
          } else if (item.sportId === 7 && Object.keys(item.data).length) {
            state.rowCricket = item.data
          }
        })
      }
      if (params.kindsOfSport.length) {
        state.allKindsOfSport = []
        params.kindsOfSport.forEach((item, index) => {
          // params.kindsOfSport[index].f.name = `${item.f.name} (Ж)`
          state.allKindsOfSport.push(item.m, item.f)
        })
        state.allKindsOfSport.sort((a, b) => a.id - b.id)
      }
    },
    clearUserInfo(state) {
      state.userId = ''
      state.name = ''
      state.email = ''
    },
  },
  actions: {
    async authorization(store, params) {
      try {
        const res = await this.$axios.post('/authByEmailAndPassword', params)
        localStorage.setItem('token', res.data.token)
        this.commit('setToken')
        this.commit('setUserInfo', res.data)
        Vue.$toast.success('Вы успешно авторизировались', {
          position: 'bottom-right',
        })
        return res.data
      } catch (e) {
        if (e.response.status === 400) {
          Vue.$toast.error(e.response.data, {
            position: 'bottom-right',
          })
        }
        return e
      }
    },

    async authByToken(store, params) {
      try {
        const res = await this.$axios.post('/authByToken', params)
        return res
      } catch (e) {
          return e.response
      }
    },

    async logout() {
      try {
        const res = await this.$axios.get('/logout')
        if (res.status === 200) {
          localStorage.removeItem('token')
          this.commit('clearUserInfo')
        }
        return res.data
      } catch (e) {
          return e.response.status
      }
    },

    async registration(store, params) {
      try {
        const res = await this.$axios.post('/registerNewOperator', params)
        Vue.$toast.success('Вы успешно зарегистрировались, проверьте свою почту', {
          position: 'bottom-right',
        })
        return res
      } catch (e) {
        if (e.response.status === 400) {
          Vue.$toast.error(e.response.data, {
            position: 'bottom-right',
          })
        }
        return e.response
      }
    },

    async recovery(store, params) {
      try {
        const res = await this.$axios.post('/resetPassword', params)
        return res.data
      } catch (e) {
        if (e.response.status === 400) {
          Vue.$toast.error(e.response.data, {
            position: 'bottom-right',
          })
        }
        return e
      }
    },

    async createMatch(store, params) {
      try {
        const res = await this.$axios.post('/createMatch', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async createTeam(store, params) {
      try {
        const res = await this.$axios.post('/createTeam', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async createLeague(store, params) {
      try {
        const res = await this.$axios.post('/createLeague', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async editMatch(store, params) {
      try {
        const res = await this.$axios.post('/editMatch', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async updateTeam(store, params) {
      try {
        const res = await this.$axios.post('/updateTeam', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async updateKindOfSport(store, params) {
      try {
        const res = await this.$axios.post('/updateKindOfSport', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async addFile(store, params) {
      try {
        const formData = new FormData()
        for (const key in params) {
          formData.append(key, params[key])
        }
        const config = {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
        const res = await this.$axios.post(`${process.env.VUE_APP_ROOT_URL}/files/api/addFile`, formData, config)
          return res.data
      } catch (e) {
          return e
      }
    },

    async deleteFile(store, params) {
      try {
        const res = await this.$axios.post(`${process.env.VUE_APP_ROOT_URL}/files/api/deleteFile`, params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async updateLeague(store, params) {
      try {
        const res = await this.$axios.post('/updateLeague', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async checkVerify() {
      try {
        const res = await this.$axios.get('/verifyToken')
        if (res.status === 200) {
          this.commit('setUserInfo', res.data)
        }
        return res
      } catch (e) {
        return e
      }
    },

    async getMatch(store, params) {
      try {
        const res = await this.$axios.get(`/getMatch/${params}`)
          return res.data
      } catch (e) {
          return e
      }
    },

    async getMatchSpectate(store, params) {
      try {
        const res = await this.$axios.get(`/getMatchState/${params}`)
          return res.data
      } catch (e) {
          return e
      }
    },

    async checkUsersMatch() {
      try {
        const res = await this.$axios.get('/checkUsersMatch')
          return res.data
      } catch (e) {
          return e
      }
    },

    async searchTeam(store, params) {
      try {
        const res = await this.$axios.post('/searchTeam', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async searchLeague(store, params) {
      try {
        const res = await this.$axios.post('/searchLeague', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async getMatchesStateForSite(store, params) {
      try {
        const res = await this.$axios.post('/getMatchesStateForSite', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async searchUsers(store, params) {
      try {
        const res = await this.$axios.post('/searchUsers', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async getMatchEvents(store, params) {
      try {
        const res = await this.$axios.get(`/getMatchEvents/${params}`)
          return res.data
      } catch (e) {
          return e
      }
    },

    async getMatches(store, params) {
      try {
        const res = await this.$axios.post('/getMatches', params)
          return res.data.message
      } catch (e) {
          return e
      }
    },

    async changeUserRole(store, params) {
      try {
        const res = await this.$axios.post('/changeUsersRole', params)
          return res.data
      } catch (e) {
          return e
      }
    },

    async deleteTeam(store, params) {
      try {
        const res = await this.$axios.delete(`/deleteTeam/${params}`)
          return res.data
      } catch (e) {
        if (e.response.status === 400) {
          Vue.$toast.error(e.response.data, {
            position: 'bottom-right',
          })
        }
        return e
      }
    },

    async deleteLeague(store, params) {
      try {
        const res = await this.$axios.delete(`/deleteLeague/${params}`)
          return res.data
      } catch (e) {
        if (e.response.status === 400) {
          Vue.$toast.error(e.response.data, {
            position: 'bottom-right',
          })
        }
        return e
      }
    },

    async postButtons(state, params) {
      try {
        const data = params.buttons
        const sportId = params.sportId
        const operatorId = params.operatorId
        const res = await this.$axios.post(`/postButtons/${operatorId}/${sportId}`, { data })
          return res.data
      } catch (e) {
          return e
      }
    },
  },
  modules: {
  },
  plugins: [axiosPlugin],
})

export default LSstore
