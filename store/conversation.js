export const state = () => ({
  list: [] // 激活会话的消息 Conversation messages,从新从后台获取！
})

export const actions = {
  async active({ commit }, to) {
    const uri = '/conversation/1/messages/' + to
    const items = await this.$axios.get(uri)
    commit('ACTIVE', items)
  }
}

export const mutations = {
  ACTIVE(state, items) {
    state.list = items
  },
  ADD(state, item) {
    state.list.push(item)
  }
}
