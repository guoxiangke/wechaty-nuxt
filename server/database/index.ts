// import '~/server/database/seeders/node_modules/reflect-metadata'
// import {
//   // createConnection,
//   getConnectionManager,
//   getConnectionOptions
// } from '~/server/database/seeders/node_modules/typeorm'

// module.exports = {
//   connect: async () => {
//     const connectionManager = getConnectionManager()

//     if (!connectionManager.has('default')) {
//       // ? load connection options from ormconfig or environment
//       const connectionOptions = await getConnectionOptions()
//       connectionManager.create(connectionOptions)
//     }

//     // ? connect to the database
//     try {
//       const connection = connectionManager.get()
//       // connection.name = 'default'
//       // isConnected - 指示是否建立了与数据库的真实连接。
//       console.log('数据库连接成功?', connection.isConnected)
//       // console.log(db)
//       await connection.connect()
//     } catch (error) {
//       console.log('数据库连接出错', error)
//     }

//     // createConnection()
//     //   .then((_connection) => {
//     //     console.log('_connection')
//     //   })
//     //   .catch(function(error) {
//     //     if (error.name === 'AlreadyHasActiveConnectionError') {
//     //       const existentConn = getConnectionManager().get('default')
//     //       return existentConn
//     //     }
//     //     console.log('TypeORM connection error: ', error)
//     //   })
//   },
//   initSchema: () => {
//     console.log(`TODO initSchema`)
//   }
// }
