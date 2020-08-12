export const state = () => ({
  list: [], // 激活会话的消息 Conversation messages,从新从后台获取！
  type: '', // active type room|contact
  current: {} // active obj
})

export const actions = {
  async init({ commit }, to) {
    const uri = '/conversation/1/messages/' + to
    const { data } = await this.$axios.get(uri)
    commit('INIT', data)
  }
}

export const mutations = {
  INIT(state, messages) {
    state.list = messages
  },
  ADD(state, item) {
    state.list.push(item)
  },
  ACTIVE(state, current) {
    state.current = current
  },
  SET_TYPE(state, type) {
    state.type = type
  }
}
