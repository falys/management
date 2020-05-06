import { smscode, login, refreshToken } from '@/api/auth'

const user = {
  state: {
    userid: '',
    name: '',
    token: '',
    token_expire: '',
    menus: []
  },

  mutations: {
    SET_USERID: (state, userid) => {
      state.userid = userid
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_TOKENEXPIRE: (state, token_expire) => {
      state.token_expire = token_expire
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    }
  },

  actions: {
    Smscode({ commit }, data) {
      return new Promise((resolve, reject) => {
        smscode(data).then(response => {
          if (response !== undefined && response) {
            resolve()
          } else {
            reject()
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登录
    Login({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const data = response.data
          console.log(response)
          commit('SET_USERID', data.userid)
          commit('SET_NAME', data.username)
          commit('SET_TOKEN', data.token)
          commit('SET_TOKENEXPIRE', data.token_expire)
          sessionStorage.setItem('userid', data.userid)
          sessionStorage.setItem('username', data.username)
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('token_expire', data.token_expire)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    LogOut({ commit, state }) {
      commit('SET_USERID', '')
      commit('SET_NAME', '')
      commit('SET_TOKEN', '')
      commit('SET_TOKENEXPIRE', '')
      sessionStorage.clear()
    },
    refreshToken({ commit, state }) {
      return new Promise((resolve, reject) => {
        const token = sessionStorage.getItem('token')
        refreshToken(token).then(response => {
          const data = response.data
          commit('SET_TOKEN', data.token)
          commit('SET_TOKENEXPIRE', data.token_expire)
          sessionStorage.setItem('token', data.token)
          sessionStorage.setItem('token_expire', data.token_expire)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        resolve()
      })
    }
  }
}

export default user
