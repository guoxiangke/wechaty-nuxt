import Vue from 'vue'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
// import dotenv from 'dotenv'
// dotenv.config()
const host = '127.0.0.1' // process.env.SOCKET_HOST ||
const port = 3000 // process.env.PORT ||
const socket = io(`http://${host}:${port}`)

export default ({ store }: any) => {
  // console.log(store.state, 'store')
  Vue.use(VueSocketIOExt, socket, { store })
}
