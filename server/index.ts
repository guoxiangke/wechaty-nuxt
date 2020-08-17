import * as fs from 'fs' // https://blog.csdn.net/u013782762/article/details/76598999
import * as path from 'path' // http://nodejs.cn/api/path.html
import Koa from 'koa'
// import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'
// @ts-ignore
import { Nuxt, Builder } from 'nuxt'
// const session = require('koa-session')
// import passport from 'koa-passport';
import passport from './interface/passport'
import { Vars as Global } from './global-var'
const consola = require('consola')
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
function useRouter(dir: string = '') {
  // todo 空文件夹bug in routes/protected
  dir = path.join(__dirname, 'routes', dir) //  __dirname + '/routes'
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
    host = process.env.HOST || 'localhost',
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

  // sessions
  // https://www.cnblogs.com/shenshangzz/p/9973422.html
  const session = require('koa-session')
  app.keys = [process.env.SESSION_SECRET || 'your-session-secret']
  app.use(session({}, app))

  app.use(passport.initialize())
  app.use(passport.session())

  useRouter()
  // Koa.Context
  app.use((ctx: any) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  // Server DOC: https://github.com/ambelovsky/koa-socket-2
  // Client DOC: https://github.com/probil/vue-socket.io-extended
  const IO = require('koa-socket-2')
  const io = new IO()
  io.attach(app)

  // https://stackoverflow.com/questions/6849599/how-to-broadcast-when-out-of-socket-io-loop
  // setInterval(() => {
  //   io.socket.sockets.emit('broadcastEmit', '1000')
  // }, 1000)
  // consola.log(io.socket.sockets)
  Global.io = io

  // broadcast in controller
  // ctx.socket.emit('broadcastEmit', '1000') // NOT WORK !!!
  // Global.io.socket.sockets.emit('broadcastEmit', '1000') // WORK !!!

  // DOC https://blog.csdn.net/nathanhuang1220/article/details/41348213
  io.on('connection', (socket: any) => {
    consola.success('SOCKET: connected', socket.id)
    socket.on('disconnect', () => {
      consola.info('SOCKET: disconnected', socket.id)
    })
    socket.on('emit_ping', (ctx: any) => {
      consola.log('get ctx.data', ctx.data)
      socket.broadcast.emit('broadcastEmit', 'from server broadcast')
      socket.emit('messageChannel', 'pong')
    })
  })

  await app.listen(port, host)
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
