import * as fs from 'fs' // https://blog.csdn.net/u013782762/article/details/76598999
import * as path from 'path' // http://nodejs.cn/api/path.html
import Koa from 'koa'
// import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
const consola = require('consola')

// const { Nuxt, Builder } = require('nuxt')
// Doc: https://www.npmjs.com/package/consola
// import Consola from 'consola' // todo
// import { log } from 'brolog'

// import winston from 'winston'

const app = new Koa()
// 注册路由
// function useRouter() {
//   // app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())
//   // const module = require('./routes/articles')
//   // router.use('/v1/articles', module.routes())
//   app.use(router.routes()).use(router.allowedMethods())
// }

// 路由自动化注册
// https://www.cnblogs.com/chanwahfung/p/12899714.html#559612336
function useRouter(dir?: string) {
  dir = dir || path.join(__dirname, 'routes') //  __dirname + '/routes'

  // 获取 routes 目录下的所有文件名，urls为文件名数组
  const urls = fs.readdirSync(dir)
  urls.forEach((element: string) => {
    const elementPath = dir + path.sep + element
    const stat = fs.lstatSync(elementPath)
    // 是否为文件夹
    const isDir = stat.isDirectory()
    // 文件夹递归注册路由
    if (isDir) {
      useRouter(elementPath)
    } else {
      const module = require(elementPath)
      // 使用路由
      app.use(module.default.routes()).use(module.default.allowedMethods())
      // How can i get a list of Koa server url routes?
      // console.log(module.default.stack.map((i: any) => i.path))
    }
  })
}

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = app.env !== 'production'
async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server
  // 使用中间件
  // Provides important security headers to make your app more secure
  app.use(helmet())

  // Enable cors with default options
  app.use(cors())

  // Logger middleware -> use winston as logger (logging.ts with config)
  // app.use(logger(winston))

  // Enable bodyParser with default options
  app.use(bodyParser())

  useRouter()
  // these routes are NOT protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  // app.use(unprotectedRouter.routes()).use(unprotectedRouter.allowedMethods())

  // JWT middleware -> below this line routes are only reached if JWT token is valid, secret as env variable
  // do not protect swagger-json and swagger-html endpoints
  // app.use(jwt({ secret: config.jwtSecret }).unless({ path: [/^\/swagger-/] }))

  // These routes are protected by the JWT middleware, also include middleware to respond with "Method Not Allowed - 405".
  // app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())

  // Koa.Context
  app.use((ctx: any) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  await app.listen(port, host)
  // Doc: https://github.com/richardeschloss/nuxt-socket-io/issues/124
  // todo nuxt koa socket.io all in 3000
  await nuxt.listen('3001')

  // https://github.com/koajs/koa/issues/1041#issuecomment-344318977
  // const server = http.createServer(app.callback())
  // const ioo = require('socket.io')
  // const io = ioo(server)
  // server.listen('3001')

  // io.on('connection', (socket: any) => {
  //   console.log('a user connected', socket)
  //   socket.on('click', (data: any) => {
  //     // process the data here
  //     console.log('client clicked! data:')
  //     console.log(data)

  //     // emit an event
  //     console.log('responding with news')
  //     socket.emit('news', { hello: 'world' })
  //   })
  // })

  // consola.info('Nuxt server info', )
  // Global.socket = nuxt.server.listeners.app
  console.log('Global.socket104', nuxt.server.options.io)
  console.log('Global.socket123', nuxt.server.listeners[0].app)
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

if (require.main === module) {
  start()
}
