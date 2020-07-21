export default function(socket: any, io: any) {
  console.log(socket, io, 'ioo')
  return {
    getNamespaces() {
      return Object.keys(io.nsps)
    },
    echo(msg: any) {
      return msg
    }
  }
}
