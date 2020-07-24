import { Vars as Global } from './global-var'
const consola = require('consola')
export default function(socket, io) {
  if (!Global.io) {
    // consola.error(socket, 'socket')
    // consola.error(io, 'io')
    Global.io = io
  }
  return {
    getNamespaces() {
      return Object.keys(io.nsps)
    },
    echo(msg) {
      return msg
    }
  }
}
