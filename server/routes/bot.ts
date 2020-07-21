// import * as Koa from 'koa'
import Router from '@koa/router'
// import { Wechat } from '../bot'
// import { Bot } from '../models/Bot'

import { BotController as Controller } from '../controllers'

// const router = new Router()
// router.prefix('/api/bot')
const router = new Router({
  prefix: '/api/bots'
})

router.get('/:id/login', Controller.login)
router.get('/:id/logout', Controller.logout)

router.post('/:id/send', Controller.send)
export default router
