export const state = () => ({
  list: [],
  current: {}
})

export const actions = {
  async init({ commit }) {
    const uri = '/conversation/1/contacts' // + context.page
    const items = await this.$axios.get(uri)
    commit('INIT', items)
  },

  active({ commit }, item) {
    commit('ACTIVE', item)
  }
}

export const mutations = {
  INIT(state, items) {
    state.list = items
  },
  ACTIVE(state, item) {
    state.current = item
  },
  INCREASE_WEIGHT(state, index) {
    state.list[index].weight += 1
  },
  RESET_WEIGHT(state, index) {
    state.list[index].weight = 0
  }, // unreadCount
  RESET_UNREAD(state, index) {
    state.list[index].unreadCount = 0
  }, // unreadCount
  INCREAE_UNREAD(state, index) {
    state.list[index].unreadCount += 1
  }
}
