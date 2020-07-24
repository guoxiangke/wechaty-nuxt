import { Vars as Global } from '../global-var'
const consola = require('consola')
export default function Svc(socket, io) {
  if (!Global.io) {
    consola.error(io)
    Global.io = io
  }
  return Object.freeze({
    broadcastMsg(data) {
      console.log(data)
      socket.broadcast.emit('chatMessage', 'hi so.emit')
    },
    getMessage(data) {
      return new Promise((resolve, reject) => {
        const msgs = [
          'Hi, this is a chat message from IO server!',
          'Hi, this is another chat message from IO server!'
        ]
        let msgIdx = 0
        const timer = setInterval(() => {
          socket.emit('chatMessage', msgs[msgIdx])
          if (++msgIdx >= msgs.length) {
            clearInterval(timer)
            resolve('It worked! Received msg: ' + JSON.stringify(data))
          }
        }, 500)
      })
    },
    echoBack({ evt, data }) {
      socket.emit(evt, data)
      return { evt, data }
    },
    titleFromUser(msg) {
      return {
        data: `received msg ${msg}!`
      }
    }
  })
}
