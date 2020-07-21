import consola from 'consola'
consola.log('hi from file with .ts extension')
export default function Svc(socket: any, io: any) {
  consola.log('echoHello', io)
  return Object.freeze({
    getProgress({ period }: any) {
      return new Promise((resolve) => {
        let progress = 0
        const timer = setInterval(() => {
          progress += 10
          socket.emit('progress', progress)
          if (progress === 100) {
            clearInterval(timer)
            resolve(progress)
          }
        }, period)
      })
    },
    echoBack(msg: any) {
      const { evt = 'echoBack', data = evt }: any = msg || {}
      socket.emit(evt, data)
      return { evt, data }
    },
    echoHello(data: any) {
      consola.log('echoHello', data)
      return { evt: 'echoHello', data: 'hello' }
    },
    echoError() {
      throw new Error('ExampleError')
    },
    'examples/sample'({ data: sample }: any) {
      socket.emit('sampleDataRxd', {
        data: {
          msg: 'Sample data rxd on state change',
          sample
        }
      })
    },
    'examples/someObj'(data: any) {
      consola.log('someObj received!', data)
      return { msg: 'ok' }
    },
    sample2({ data: sample }: any) {
      socket.emit('sample2DataRxd', {
        data: {
          msg: 'Sample2 data rxd on state change',
          sample
        }
      })
    },
    sample2b({ data: sample }: any) {
      socket.emit('sample2bDataRxd', {
        data: {
          msg: 'Sample2b data rxd on state change',
          sample
        }
      })
    },
    sample3(msg: any) {
      const { data: sample } = msg || {}
      return {
        msg: 'rxd sample ' + (sample || 'undef')
      }
    },
    sample4({ data: sample }: any) {
      return {
        msg: 'rxd sample ' + sample
      }
    },
    sample5({ data: sample }: any) {
      return {
        msg: 'rxd sample ' + sample
      }
    },
    receiveArray(msg: any) {
      return {
        resp: 'Received array',
        length: msg.length
      }
    },
    receiveArray2(msg: any) {
      return {
        resp: 'Received array2',
        msg
      }
    },
    receiveString(msg: any) {
      return {
        resp: 'Received string',
        length: msg.length
      }
    },
    receiveString2(msg: any) {
      return {
        resp: 'Received string again',
        length: msg.length
      }
    },
    receiveUndef(msg: any) {
      consola.log('receiveUndef', msg)
    }
  })
}
