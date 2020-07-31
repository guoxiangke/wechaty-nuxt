export const state = () => ({
  list: [] // 最近100条个人消息+100条群消息 todo
})

export const actions = {
  async init({ commit }) {
    const uri = '/conversation/1/messages'
    const items = await this.$axios.get(uri)
    commit('INIT', items)
  }
}

export const mutations = {
  INIT(state, items) {
    state.list = items
  },
  ADD(state, item) {
    state.list.unshift(item)
  }

  // SET_SOMEOBJ(state, someObj) {
  //   Object.assign(state, { someObj })
  // }
}
