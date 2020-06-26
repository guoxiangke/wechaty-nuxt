import { log, Contact, Message, Wechaty, UrlLink, Room } from 'wechaty'
import { MessageType } from 'wechaty-puppet'
const xmlToJson = require('../helper/xmlToJson')

/**
 *
 * @param destinations: Array<any>
 * @param msg: Message
    转发处理，转发源分2重情况：room或contact 即转发来自群的消息或转发来自某个联系人的消息
    如果是来自群的消息，可以配置只转发群内的某几个人的消息，或者全部转发（senders为空）

    已支持 小程序转发
    https://github.com/wechaty/wechaty-puppet-padplus/issues/226
 */
export function forwardMsg(
  destinations: Array<any>,
  msg: Message,
  wechaty: Wechaty
) {
  const text = msg.text()
  const type: number | any = msg.type()
  destinations.forEach(async (to) => {
    // todo unknownMsg support
    // todo add Music & Location Support
    let unknownMsg: any
    if (type === MessageType.Unknown) {
      // Music support in receive and forward
      // https://github.com/wechaty/wechaty-puppet-padplus/issues/243
      const jsonPayload = await xmlToJson(text)
      if (jsonPayload.msg.appmsg.type === 3) {
        // type = 'MusicLink' // 15 Music ？
        unknownMsg = new UrlLink({
          description: jsonPayload.msg.appmsg.des + ' 点击[浮窗]后台播放',
          thumbnailUrl:
            'https://res.wx.qq.com/a/wx_fed/assets/res/OTE0YTAw.png',
          title: jsonPayload.msg.appmsg.title,
          url: jsonPayload.msg.appmsg.url
        })
      } else {
        log.error('TODO', 'unknownMsg forward', unknownMsg)
      }
    }

    let who: Contact | Room | null = null
    // 转发到room
    if (to.type === 'room') {
      //  && to.topic in Global.indexRooms
      who = await wechaty.Room.find({ topic: to.topic }) // Global.indexRooms[to.topic]
      if (!who) throw new Error('!room for room forwardMsg')
      await msg.forward(who)
    }
    // 转发给个人
    if (to.type === 'contact') {
      // https://github.com/wechaty/wechaty/issues/1217  Contact.find(error!)
      who = await wechaty.Contact.find({ alias: to.alias })
      log.info('who?', to)
      if (!who) throw new Error('!contact for personal forwardMsg')
      await msg.forward(who)
    }

    // await who.say(unknownMsg)
  })
}
