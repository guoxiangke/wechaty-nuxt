import * as Koa from 'koa'
import { Contact } from 'wechaty'
// import { log } from 'brolog'
// import { Vars as Global } from '../global-var'
import { Sequelize } from 'sequelize' //, QueryTypes
import { Bot, Contact as ContactModel, Message, Room } from '../models'
import { Type } from '../models/wechat/Contact'
// import { sequelize } from '../database/config'
const { Op } = require('sequelize')

export default class ConversationController {
  // 显示与某个人的会话消息 包含room

  // todo delete！
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

  public static async getMessages(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const messages: Array<any> = await Message.findAll({
      order: [['id', 'DESC']],
      limit: 1000,
      where: {
        bot_id: botId
      }
    })
    ctx.body = messages
  }

  // 获取与某人/群的消息历史
  public static async getMessagesByTo(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    if (!ctx.params.to) throw new Error('缺少to')

    const to = ctx.params.to
    // 接收的消息 to = wxid_7nof1pauaqyd22/2765789013@chatroom
    // 发送的消息 fromId = 22 // 22 = getIdFrom('wxid_7nof1pauaqyd22')
    let fromId = 0
    let messages: Array<any> = []
    if (to.includes('@chatroom')) {
      // 获取群组聊天记录
      messages = await Message.findAll({
        limit: 1000,
        where: {
          to
        }
      })
    } else {
      // 获取个人聊天记录
      const from: ContactModel | null = await ContactModel.findOne({
        attributes: ['id'],
        where: {
          wechat_id: to
        }
      })
      if (!from) throw new Error('必须要有from118')
      fromId = from.id

      if (bot.bind === to) {
        // todo 如果是bot自己的对话！！自己给自己发消息聊天/记事儿
        messages = await Message.findAll({
          limit: 1000,
          where: {
            bot_id: botId,
            // from_id 和 to 是AND关系
            from_id: fromId,
            to
          }
        })
      } else {
        messages = await Message.findAll({
          // order: [['id', 'ASC']],
          // limit: 1000, // 获取所有的聊天记录
          where: {
            bot_id: botId,
            to: { [Op.notLike]: '%chatroom' },
            // from_id 和 to 是或的关系，一来一回，两轮消息
            [Op.or]: [{ to: { [Op.eq]: to } }, { from_id: { [Op.eq]: fromId } }]
          }
        })
      }
    }

    ctx.body = messages
  }

  public static async getAllContacts(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const contacts = await ContactModel.findAll({
      order: [
        ['weight', 'DESC'], // 星标排序
        ['from', 'DESC'], // 个人/群主/群成员/公号 ...
        ['id', 'ASC']
      ],
      where: {
        bot_id: botId
        // type: Contact.Type.Personal // Contact.type()
        // 获取群成员，为了显示群消息，前段过滤群成员
        // from: [Type.Individual, Type.RoomOwner, Type.RoomMemeber] // 不显示群成员！
      }
    })
    // allContacts 转换成obj
    const contactsObj: any = {}
    contacts.forEach((e) => {
      const id = e.id
      contactsObj[id] = e
    })
    ctx.body = contactsObj
  }

  public static async getAllRooms(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    const botId = ctx.params.bot_id
    const bot: Bot | null = await Bot.findByPk(botId)
    if (!bot) throw new Error('机器人不存在')
    if (!bot.token) throw new Error('缺少协议token')

    const rooms = await Room.findAll({
      // order: [['id', 'ASC']],
      where: {
        bot_id: botId
      }
    })
    // 转换成obj
    const roomsObj: any = {}
    rooms.forEach((e) => {
      const id = e.roomId // xxx@chatroom
      roomsObj[id] = e
    })
    ctx.body = roomsObj
  }

  // 显示与某个人的会话消息
  public static async show(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    if (!ctx.params.to) throw new Error('缺少to')

    ctx.body = await ContactModel.findAndCountAll({
      where: { bot_id: ctx.params.bot_id, to: ctx.params.to }
    })
  }

  // reset unread count
  public static async resetUnread(ctx: Koa.Context): Promise<void> {
    if (!ctx.params.bot_id) throw new Error('缺少bot_id')
    if (!ctx.params.to) throw new Error('缺少to')

    const to = ctx.params.to
    if (to.includes('@chatroom')) {
      await Room.update(
        { unreadCount: 0 },
        {
          where: { bot_id: ctx.params.bot_id, room_id: ctx.params.to }
        }
      )
    } else {
      await ContactModel.update(
        { unreadCount: 0 },
        {
          where: { bot_id: ctx.params.bot_id, id: ctx.params.to }
        }
      )
    }
    ctx.body = { success: true }
  }
}
