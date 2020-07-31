export const state = () => ({
  counter: 0
})

export const mutations = {
  // increment
  INCREMENT(state: any) {
    state.counter++
  }
}

// export const actions = {
//   FORMAT_MESSAGE({ commit }: any, chatMessage: any) {
//     const chatMessageFmt = `${new Date().toLocaleString()}: ${chatMessage}\r\n`
//     commit('SET_MESSAGE', chatMessageFmt)
//   }
// }
