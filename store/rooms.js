export const state = () => ({
  list: [] // 所有的群组
})

export const actions = {
  async init({ commit }) {
    const uri = '/conversation/1/rooms'
    const { data } = await this.$axios.get(uri)
    commit('INIT', data)
  },
  async reset_unread({ commit }, index) {
    const uri = `/conversation/1/readed/${index}` // + context.page
    await this.$axios.$post(uri)
    commit('RESET_UNREAD', index)
  }
}

export const mutations = {
  INIT(state, items) {
    state.list = items
  },
  RESET_UNREAD(state, index) {
    state.list[index].unreadCount = 0
  },
  INCREAE_UNREAD(state, index) {
    state.list[index].unreadCount += 1
  }
}
