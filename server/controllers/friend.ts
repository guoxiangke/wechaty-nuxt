import * as Koa from 'koa'
// import { Wechaty, Contact, Room } from 'wechaty'
// import { log } from 'brolog'
import { Contact, log } from 'wechaty'
// import { Vars as Global } from '../global-var'
import { Bot, Contact as ContactModel, Message } from '../models'

export default class FriendController {
  // 显示所有联系人 + todo rooms
  public static async list(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const page = ctx.query.page ? ctx.query.page : 0
    const pageSize = 10 // 固定不可变
    const offset = page * pageSize
    const limit = pageSize
    log.error('page, offset', page, offset, ctx.query)

    ctx.body = await ContactModel.findAll({
      limit,
      offset,
      order: [
        ['weight', 'DESC'], // 星标排序
        ['from', 'DESC'], // 个人/群主/群成员/公号 ...
        ['id', 'ASC']
      ],
      where: { bot_id: botId, type: Contact.Type.Personal }
    })
  }
}
