import Router from '@koa/router'
import auth from '../middlewares/auth'
// import { Wechat } from '../bot'
// import { Bot } from '../models/Bot'

import { ConversationController as Controller } from '../controllers'

const router = new Router()
router.prefix('/api/conversation')
router.use(auth())

router.get('/:bot_id', Controller.list)

router.get('/:bot_id/messages', Controller.getMessages)
router.get('/:bot_id/messages/:to', Controller.getMessagesByTo)
router.get('/:bot_id/contacts', Controller.getAllContacts)
router.get('/:bot_id/rooms', Controller.getAllRooms)

// /conversation/1/rooms

// router.get('/:bot_id/:to', Controller.show)

export default router
