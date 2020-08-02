export const state = () => ({
  list: [] // 所有的群组
})

export const actions = {
  async init({ commit }) {
    const uri = '/conversation/1/rooms'
    const items = await this.$axios.get(uri)
    commit('INIT', items)
  }
}

export const mutations = {
  INIT(state, items) {
    state.list = items
  }
}
