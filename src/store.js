import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  // Persistence
  plugins: [createPersistedState()],
  // State
  state: {
      provider: '',
      status: '',
      googleAuth2: null,
      user: {},
  },
  // Mutations
  mutations: {
      auth_success_login_only_email(state, userEmail) {
          state.status = 'success'
          state.provider = userEmail.provider
          state.user = userEmail.user
      },
      auth_success_login_google(state, googleLogin) {
          state.status = 'success'
          state.provider = googleLogin.provider
          state.user = googleLogin.user
          state.googleAuth2 = googleLogin.user
      },
      auth_error(state) {
          state.status = 'error'
      },
      auth_logout(state) {
          state.status = ''
          state.user = {}
          state.googleAuth2 = null;
      },
  },
  // Actions
  actions: {
      login_only_email({
          commit
      }, userEmail) {
          commit('auth_success_login_only_email', userEmail);
      },
      login_google({
          commit
      }, googleLogin) {
          if (googleLogin.isResponseOK) {
              commit("auth_success_login_google", googleLogin);
          } else {
              commit("auth_error");
          }
      },
      logout({
          commit
      }) {
          commit("auth_logout");
      },
  },
  // Getters
  getters: {
      isLoggedIn: state => {
          return state.status === 'success'
      },
      userLoggedIn: state => {
          if (state.provider === 'google') {
              return {
                  id: state.user.Eea,
                  name: state.user.ofa,
                  lastname: state.user.wea,
                  email: state.user.U3,
                  image: state.user.Paa
              }
          } else if (state.provider === 'email') {
              return {
                  id: state.user.id,
                  name: state.user.name,
                  lastname: state.user.lastname,
                  email: state.user.email,
                  image: state.user.image
              }
          }
      },
      googleAuth2: state => {
          return state.googleAuth2
      },
  }
})