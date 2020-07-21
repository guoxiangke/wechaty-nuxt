// RES
console.log('hi from file with .ts extension')
export default function(socket: any, io: any) {
  console.log(socket, io)
  return Object.freeze({
    hi() {
      console.log('hi rxd!')
      return 'world'
    }
  })
}
