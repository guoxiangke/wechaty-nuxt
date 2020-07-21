import { Contact, Wechaty } from 'wechaty'
import { log } from 'brolog'
import { Bot } from '../../models'
import { Type } from '../../models/wechat/Contact'
import { saveOrGetContact } from '../helper/saveOrGetContact'
import { saveOrGetRoom } from '../helper/saveOrGetRoom'

import { Vars as Global } from '../global-var'
import { initSchedule } from '../helper/initSchedule'

module.exports = onReady
// Module '"./listeners/on-ready"' declares 'onReady' locally, but it is not exported.ts(2459)
// on-ready.ts(13, 16): 'onReady' is declared here.
// export { onReady }
async function onReady(this: Wechaty) {
  // wechaty: Wechaty, bot: Bot
  const wechaty = this
  const bot: Bot = await Global.getBot(wechaty)
  const allRooms = await wechaty.Room.findAll()
  Global.allRooms = allRooms

  // 关键词入群，按群名/配置
  // 缓存(自动入群配置)到全局变量，不再每次查询数据库
  const tmp: Array<string> = []
  for (const room of allRooms) {
    const roomInstance = await saveOrGetRoom(bot, room)
    if (roomInstance.autoJoin) {
      tmp.push(roomInstance.alias ? roomInstance.alias : roomInstance.topic)
    }
  }
  Global.autoJoinRooms = tmp
  log.info('onReady', `Bot Room inited: ${allRooms.length}`)

  // 包含 群联系人+个人联系人+？部分公众号联系人
  const allContacts: Contact[] | null = await wechaty.Contact.findAll()
  for (const contact of allContacts) {
    await saveOrGetContact(bot, contact, Type.Individual)
  }
  log.info('onReady', `Bot Contact Inited: ${allContacts.length}`)

  initSchedule(wechaty)

  return { isLogin: true }
}
