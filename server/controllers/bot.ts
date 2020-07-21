import * as Koa from 'koa'
import { Wechaty, Contact, Room } from 'wechaty'
import { log } from 'brolog'
import { Wechat } from '../bot'
import { Bot } from '../models'
import { Vars as Global } from '../global-var'

export default class BotController {
  public static async login(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.id) throw new Error('缺少id')
    const id = ctx.params.id
    const bot: Bot | null = await Bot.findByPk(id)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    // 如果已经登录，不再重复登录！
    let result: any
    if (!Global.getWechaty(bot)) {
      const webot = new Wechat(bot)
      result = await webot.start()
      // {"qrcode":"http://weixin.qq.com/x/Ifj3ZIn5AkXnSMGSAPvu"}
      // { success: true } // {"isLogin":true}
      if ('qrcode' in result) {
        // QR on.scan
        log.error('BotController:onScan.qrcode', JSON.stringify(result))
        ctx.body = result
        return
      }
      // 缓存到内存中，
      const wechaty: Wechaty | null = webot.wechaty
      if (!wechaty) throw new Error('should have wechaty')
      // tmp绕一圈，不可直接复制，报错
      const tmp: any = Global.wechaty ? Global.wechaty : [] // 保留旧数据
      tmp[bot.id] = wechaty // 添加新的
      Global.wechaty = tmp // 缓存成功，Global.getWechaty(bot)获取

      // DB
      bot.status = true
      const contact: Contact = wechaty.userSelf()
      bot.bind = contact.id
      await bot.save()
    } else {
      // result = { isLogin: 'already' }
      log.info('BotController:login', 'already')
    }
    ctx.body = result
  }

  public static async logout(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.id) throw new Error('缺少id')
    const id = ctx.params.id
    const bot: Bot | null = await Bot.findByPk(id)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const wechaty: Wechaty | null = Global.getWechaty(bot)
    if (wechaty) {
      await wechaty.stop()
      log.info('BotController:logout', 'stoped wechaty')
    } else {
      log.info('BotController:logout', 'already destroyed')
      // throw new Error('no wechay to call on logout')
    }

    // DB
    bot.status = false
    await bot.save()
    // 清空全局缓存
    if (Global.wechaty && bot.id in Global.wechaty) {
      delete Global.wechaty[bot.id]
      log.info('BotController:logout', 'deleted Global.wechaty[bot.id]')
    }

    ctx.body = { success: true }
  }

  // POST /api/bots/1/send
  // body:{id:xxx@room/wxid, content:{type:text, data:'hello,text!'}}
  // 主动发送 消息给 联系人/群
  public static async send(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.id) throw new Error('缺少id')
    const id: string = ctx.params.id
    const bot: Bot | null = await Bot.findByPk(id)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const wechaty = Global.getWechaty(bot)
    if (!wechaty) throw new Error('no wechay to call on Say')

    // room or contact?
    log.error(`${ctx.request.body}, ${ctx.params} `)
    const sayContent = ctx.request.body.content.data
    const idd = ctx.request.body.id // room_id or contact_id
    // idd:string = 2017353977@chatroom | wxid_p8049l6lj3ea22

    if (id.includes('@chatroom')) {
      const room: Room | null = await wechaty.Room.find({
        topic: idd
      })
      if (!room) throw new Error('should have contact to say')
      await room.say(sayContent)
    } else {
      const contact: Contact | null = await wechaty.Contact.load(idd)
      if (!contact) throw new Error('should have contact to say')
      await contact.say(sayContent)
    }
    ctx.body = {}
  }
}
// module.exports = {
//   // getRoom: async (ctx) => {
//   //   try {
//   //     const room = await bot.Room.find({ id: ctx.params.id })
//   //     const topic = await room.topic()
//   //     const announce = await room.announce()
//   //     ctx.body = {topic,announce}
//   //   } catch (err) { throw err }
//   // },
//   // updateRoom: async (ctx) => {
//   //   try {
//   //     const room = await bot.Room.find({ id: ctx.params.id })
//   //     if(ctx.request.body.topic) {
//   //       await room.topic(ctx.request.body.topic)
//   //       await Group.updateOne({id:ctx.params.id},{topic:ctx.request.body.topic})
//   //     }
//   //     if(ctx.request.body.announce) {
//   //       await room.announce(ctx.request.body.announce)
//   //     }
//   //     ctx.body = {}
//   //   } catch (err) {throw {message:'没有权限，不是群主或者管理员'} }
//   // },
//   // roomQuit: async (ctx) => {
//   //   try {
//   //     const room = await bot.Room.find({ id: ctx.request.body.id })
//   //     await room.quit()
//   //     ctx.body = {}
//   //   } catch (err) { throw err }
//   // }
// }
