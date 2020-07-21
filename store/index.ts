// https://nuxt-socket-io.netlify.app/installation
// Finally, since the module requires Vuex to operate correctly, please at the minimum make sure you have a Vuex state defined:
// The module needs this so it can register its own Vuex module
export const state = () => ({
  chatMessages: '',
  titleFromUser: ''
})

export const mutations = {
  SET_MESSAGE(state: any, chatMessage: any) {
    state.chatMessages += chatMessage
  }
}

export const actions = {
  FORMAT_MESSAGE({ commit }: any, chatMessage: any) {
    const chatMessageFmt = `${new Date().toLocaleString()}: ${chatMessage}\r\n`
    commit('SET_MESSAGE', chatMessageFmt)
  }
}
