// import * as Koa from 'koa'
import Router from '@koa/router'
// import { Wechat } from '../bot'
// import { Bot } from '../models/Bot'

import { BotController } from '../controllers'

// const router = new Router()
// router.prefix('/api/bot')
const router = new Router({
  prefix: '/api/bots'
})

router.get('/:id/login', BotController.login)
router.get('/:id/logout', BotController.logout)

export default router
