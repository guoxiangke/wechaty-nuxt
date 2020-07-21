import * as Koa from 'koa'
import { Contact } from 'wechaty'
// import { log } from 'brolog'
// import { Vars as Global } from '../global-var'
import { Sequelize } from 'sequelize' //, QueryTypes
import { Bot, Contact as ContactModel, Message, Room } from '../models'
// import { sequelize } from '../database/config'

export default class ConversationController {
  // 显示与某个人的会话消息 包含room

  public static async list(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    // DISTINCT https://stackoverflow.com/questions/12156206/sequelize-select-distinct-rows/30070249#30070249
    // 1.找到DISTINCT的wechat_id
    const tos: Array<any> = await Message.findAll({
      // order: [['id', 'ASC']],
      attributes: [[Sequelize.literal('DISTINCT `to`'), 'to']]
    })

    const roomIDArray: Array<string> = []
    const wechatIDArray = tos.map(function(data) {
      if (!data.to.includes('@chatroom')) {
        return data.to
      } else {
        roomIDArray.push(data.to)
      }
    })

    // 2.找到这些contact资料
    const contacts = await ContactModel.findAll({
      order: [
        ['weight', 'DESC'], // 星标排序
        ['from', 'DESC'], // 个人/群主/群成员/公号 ...
        ['id', 'ASC']
      ],
      where: {
        bot_id: botId,
        type: Contact.Type.Personal,
        wechat_id: wechatIDArray
      }
    })
    // todo load with owner!
    const rooms = await Room.findAll({
      where: {
        bot_id: botId,
        room_id: roomIDArray
      }
    })
    // 3.找出LastMessage

    // sequelize.query(sql, {
    //   type: QueryTypes.SELECT
    // })

    // Q: 一条语句找出每个联系人(who)的最后一条信息（而非所有消息）？
    // messages表结构： id, who, content
    // 下面语句是找出distinct 联系人
    // select distinct who from messages
    // 下面是多条语句分别找出每个from的最新消息
    // select * from messages where who = 1 order by created_at desc limit 1
    // select * from messages where who = 2 order by created_at desc limit 1
    // select * from messages where who = 3 order by created_at desc limit 1
    // Q: 一条语句找出每个联系人(who)的最后一条信息（而非所有消息）？

    const messages: Array<any> = await Message.findAll({
      where: {
        bot_id: botId,
        to: wechatIDArray.concat(roomIDArray)
      }
    })
    ctx.body = { rooms, contacts, messages }
  }

  // 显示与某个人的会话消息
  public static async show(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    if (!ctx.params.to) throw new Error('缺少to')

    ctx.body = await ContactModel.findAndCountAll({
      where: { bot_id: ctx.params.bot_id, to: ctx.params.to }
    })
  }

  //
}
