import * as Koa from 'koa'
import { Wechat } from '../bot'
import { Bot } from '../models'

export default class BotController {
  public static async login(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.id) throw new Error('缺少id')
    const id = ctx.params.id

    const bot: Bot | null = await Bot.findByPk(id)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const webot = new Wechat(bot)
    // 如果已经登录，不再重复登录！
    let result: any = {}
    if (bot.status) {
      result = { isLogin: true }
    } else {
      result = await webot.start()
    }

    // await wechays[0].stop()

    // const result = {"qrcode":"http://weixin.qq.com/x/Ifj3ZIn5AkXnSMGSAPvu"}
    ctx.body = result
  }
}
// module.exports = {
//   login: (ctx: any) => {
//     // if (!ctx.request.body.id) throw new Error('缺少id')
//     const bot = new Bot() // ctx.request.body.id
//     const result = bot.start()
//     // const result = 1
//     log.info('SUCCESS', `${JSON.stringify({ result })}`)
//     ctx.body = result
//     return '1'
//   }
//   // loginOut: async (ctx) => {
//   //   try {
//   //     if (!global.bot) {
//   //       await Robot.updateOne({ _id: ctx.request.body.id }, { status: 0 })
//   //       delete global.bot
//   //       return (ctx.body = {})
//   //     }
//   //     await bot.logout()
//   //     ctx.body = {}
//   //   } catch (err) {
//   //     throw err
//   //   }
//   // }
//   // friendSay: async (ctx) => {
//   //   try {
//   //     const contact = await bot.Contact.find({ id: ctx.request.body.id })
//   //     await contact.say(ctx.request.body.content)
//   //     ctx.body = {}
//   //   } catch (err) { throw err }
//   // },
//   // roomSay: async (ctx) => {
//   //   try {
//   //     const room = await bot.Room.find({ id: ctx.request.body.id })
//   //     await room.say(ctx.request.body.content)
//   //     ctx.body = {}
//   //   } catch (err) { throw err }
//   // },
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
