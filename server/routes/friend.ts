import Router from '@koa/router'
import auth from '../middlewares/auth'
// import { Wechat } from '../bot'
// import { Bot } from '../models/Bot'

import { FriendController as Controller } from '../controllers'

// const router = new Router()
// router.prefix('/api/bot')
const router = new Router({
  prefix: '/api/friend'
})
router.use(auth())

router.get('/:bot_id', Controller.list)
// router.get('/:bot_id/:to', Controller.show)

export default router
