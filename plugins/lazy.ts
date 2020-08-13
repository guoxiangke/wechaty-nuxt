import Vue from 'vue'
import VueLazyload from 'vue-lazyload'

export default () => {
  // { store }: any
  // console.log(store.state, 'store')
  // Vue.use(VueSocketIOExt, socket, { store })
  Vue.use(VueLazyload)
}
