import Router from '@koa/router'
// import { Wechat } from '../bot'
// import { Bot } from '../models/Bot'

import { ConversationController as Controller } from '../controllers'

const router = new Router()
router.prefix('/api/conversation')
// const router = new Router({
//   prefix: '/api/conversation'
// })

router.get('/:bot_id', Controller.list)

router.get('/:bot_id/messages', Controller.getMessages)
router.get('/:bot_id/messages/:to', Controller.getMessagesByTo)
router.get('/:bot_id/contacts', Controller.getAllContacts)

// router.get('/:bot_id/:to', Controller.show)

export default router
