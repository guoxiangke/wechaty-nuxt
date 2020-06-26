// import '~/server/database/seeders/node_modules/reflect-metadata'
// import { createConnection, getRepository, Connection } from '~/server/database/seeders/node_modules/typeorm'
// import { User } from '../entity/user'
// ;(async function() {
//   const connection: Connection = await createConnection()
//   console.log(`${connection}`)

//   const userRepository = getRepository(User) // you can also get it via getConnection().getRepository() or getManager().getRepository()
//   const user = await userRepository.findOne(1)
//   console.log(`${user}`)
//   if (user) {
//     user.email = 'Umed@t1.com'
//     await userRepository.save(user)
//   } else {
//     const user = new User()
//     user.email = 'test@init.com'
//     user.password = 'xxx'
//     await connection.manager.save(user)
//     console.log('Saved a new user with id: ' + user.id)
//   }
// })()
