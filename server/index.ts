import * as fs from 'fs' // https://blog.csdn.net/u013782762/article/details/76598999
import * as path from 'path' // http://nodejs.cn/api/path.html
import Koa from 'koa'
// import jwt from 'koa-jwt'
import bodyParser from 'koa-bodyparser'
import helmet from 'koa-helmet'
import cors from '@koa/cors'

// import winston from 'winston'

// import { unprotectedRouter } from './routes/unprotectedRoutes'
// import { protectedRouter } from './routes/protectedRoutes'

const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')

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

  await nuxt.ready()

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

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use((ctx: any) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

// // 获取数据连接和初始化方法
// const { connect, initSchema } = require('./database')
//   // 立即执行函数，连接数据库
;(async () => {
  // const connection = await getConnectionManager().get()
  // const connection = await createConnection()
  // connection.name = 'default'
  // isConnected - 指示是否建立了与数据库的真实连接。
  // await connect()
  // initSchema()
})()

start()
