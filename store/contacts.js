export const state = () => ({
  list: []
})

export const actions = {
  async init({ commit }) {
    const uri = '/conversation/1/contacts' // + context.page
    const { data } = await this.$axios.get(uri)
    commit('INIT', data)
  },
  async reset_unread({ commit }, index) {
    const uri = `/conversation/1/readed/${index}` // index = contactInstance.id
    await this.$axios.$post(uri)
    commit('RESET_UNREAD', index)
  }
}

export const mutations = {
  INIT(state, items) {
    state.list = items
  },
  INCREASE_WEIGHT(state, index) {
    state.list[index].weight += 1
  },
  RESET_WEIGHT(state, index) {
    state.list[index].weight = 0
  },
  RESET_UNREAD(state, index) {
    state.list[index].unreadCount = 0
  },
  INCREAE_UNREAD(state, index) {
    state.list[index].unreadCount += 1
  }
}
