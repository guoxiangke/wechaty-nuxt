export const state = () => ({
  authUser: null
})

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, data) {
    // console.log(Object.keys(data.req.user))
    if (data.req.user) {
      commit('SET_USER', data.req.user)
    }
  },
  async login({ commit }, { email, password }) {
    try {
      const uri = '/auth/login'
      const { user } = await this.$axios.$post(uri, { email, password })
      commit('SET_USER', user)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    const uri = '/auth/logout'
    await this.$axios.$get(uri)
    commit('SET_USER', null)
  }
}
