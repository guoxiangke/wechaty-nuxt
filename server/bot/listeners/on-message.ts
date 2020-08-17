import { log } from 'brolog'
import { Contact, Message, Wechaty, UrlLink, Room } from 'wechaty'
import { MessageType } from 'wechaty-puppet'
import { FileBox } from 'file-box'
import {
  AutoReply,
  Bot,
  AutoForward as ForwardModel,
  Room as RoomModel
} from '../../models'
import { Vars as Global } from '../global-var'
import { saveOrGetRoom } from '../helper/saveOrGetRoom'
import { getBot } from '../helper/getBot'
import { getDefaultReply } from '../helper/getDefaultReply'
import { forwardMsg } from '../helper/forwardMsg'
import { saveMsg } from '../helper/saveMsg'

// @see https://github.com/wechaty/wechaty/issues/2007
module.exports = onMessage
// @see http://www.semlinker.com/ts-this-param-type/
async function onMessage(this: Wechaty, msg: Message) {
  const wechaty: Wechaty = this
  // console.log(this)
  // if (msg.age() > 300) {
  //   log.warn(
  //     'onMessage',
  //     'Message discarded because its TOO OLD(than 5 minute)'
  //   )
  //   return
  // }
  // todo check if login ready
  const bot: Bot | null = await getBot(wechaty)
  if (!bot) throw new Error('no bot!')
  const sender: Contact | null = msg.from()
  if (!sender) throw new Error('!sender')

  log.info('onMessage', `${msg}`)

  const text = msg.text().trim()
  const room: Room | null = msg.room()
  const type: number = msg.type()
  // todo Recalled 不支持转发，无法撤回
  if (type === MessageType.Recalled) {
    return
  }
  log.info('Message', text, type)

  if (sender.type() === Contact.Type.Official) {
    log.info('onMessage', 'todo 暂不处理公众号消息')
    return
  }
  const filehelper = wechaty.Contact.load('filehelper')

  let msgSenderAlias = await sender.alias()
  // bot本身无法通过alias获取群昵称
  if (!msgSenderAlias) {
    msgSenderAlias = await sender.name()
  }

  // 处理群消息
  if (room) {
    const hostRoom: Room = room
    const topic: string = await room.topic()
    const allRooms = Global.allRooms
      ? Global.allRooms
      : await wechaty.Room.findAll()

    // region begin 万群群发
    // 本群的每条消息/bot发的消息，都群发给bot的所有群！
    const ownerGroupName: string = process.env.FORWOARD_ALL || 'FORWOARD_ALL'
    if (topic === ownerGroupName) {
      log.info('onMessage', `FORWOARD_ALL: ${allRooms}`)
      allRooms.forEach((room) => {
        if (room === hostRoom) return // 不再次转发到源群
        // 返回 不做DB和files处理了！
        msg.forward(room) // return 不用返回，因为转发到群的信息不做二次onmessage event
      })
    }
    // region end 万群群发

    // forward begin for room
    const forwards = await ForwardModel.findAll({
      where: { isRoom: true }
    })
    for (const forward of forwards) {
      const destinations = forward.destinations.data
      // 转发群消息
      if (topic === forward.from) {
        // 如果是来自于 配置要群发的群
        if (
          // 如果 发送者 在配置中 or
          forward.senders.data.includes(msgSenderAlias) ||
          // 如果是空，则代表所有人的消息都群发到 destinations
          forward.senders.data.length === 0
        ) {
          forwardMsg(destinations, msg, wechaty)
        }
      }
    }
    // forward end for room

    // todo ([有人@我])
    if (await msg.mentionSelf()) {
      // 入群管理 begin
      const owner = room.owner()
      // 必须是群主@bot
      if (owner === sender) {
        if (text.includes('入群管理')) {
          // 加入缓存
          Global.autoJoinRooms.push(topic)
          // 保存到数据库
          const roomModel: RoomModel | null = await RoomModel.findOne({
            where: { roomId: room.id }
          })
          if (!roomModel) throw new Error('!roomModel')
          roomModel.config.autoReply = true
          await roomModel.save()
          room.say(
            `已为本群开通本功能，新用户可以回复本群名给本bot即可自动入群，请关闭群邀请确认功能`
          )
        }
      }
      // 入群管理 end
    }

    // #群挑战#
    // if (false) {
    //   const challenge = require('./common/challenge')
    //   challenge(msg, room, text, sender, msgSenderAlias)
    // }
  } else {
    // 处理个人消息

    let isReplied: boolean = false // 已处理
    // bot 主动发消息到个人
    // bot 主动发消息到群，没有msg.to()
    const receiver: Contact | null = msg.to()
    if (!receiver) throw new Error('!receiver')

    // forward begin 个人转发 配置
    // 转发与 isReplied 无关
    const forwards = await ForwardModel.findAll({
      where: { isRoom: false }
    })
    for (const forward of forwards) {
      const destinations = forward.destinations.data
      if (msgSenderAlias === forward.from) {
        forwardMsg(destinations, msg, wechaty)
      }
    }
    // forward end

    // let aiReply = false
    // 自己发给filehelper
    if (receiver.id === 'filehelper') {
      // bot作为系统管理员，处理bot发出的指令处理
      const keyword = text.toLowerCase().replace('#', '') // #On #off
      switch (keyword) {
        case 'on':
        case 'off':
          bot.config.autoReply = !bot.config.autoReply
          // eslint-disable-next-line no-self-assign
          bot.config = bot.config // json 数据库更新 必须这一步
          await bot.save()
          await filehelper.say(`autoReply: ${bot.config.autoReply}`)
          break
        default:
          await filehelper.say('Error: Invalid instruction')
          break
      }
    }

    // 除了给filehelper和自己发之外的 所有自己发的消息，不再继续处理，到此为止
    // if (msg.self()) return
    // 自己发给自己的消息  自保存记录，不再继续处理
    if (receiver.id === sender.id) {
      dbSave(bot, msg, room)
      return
    }

    // 匹配用户发的消息开始
    // 完全匹配模式的关键词回复配置 autoReply.json
    if (bot.config.autoReply) {
      // const autoReplyConfig = require(`${CONFIG_JSON_PATH}/autoReply.json`).data
      const autoReplyConfig = await AutoReply.findAll()
      for (const temp of autoReplyConfig) {
        // https://www.cnblogs.com/season-huang/p/3544873.html
        const re = new RegExp('^' + temp.keyword + '$', 'i')
        const config = temp.reply
        const keyword = text.toLowerCase()
        if (re.test(keyword)) {
          // 用户回复的关键词 == 设定的关键词
          // @todo 7 == Text
          switch (config.type) {
            case MessageType.Text:
              await sender.say(config.data)
              isReplied = true
              break

            case MessageType.Contact: {
              const contact = await wechaty.Contact.find({
                name: config.data
              })
              if (!contact) {
                log.warn(`No Contact Card to response: ${config.data}`)
                return
              }
              const contactCard = wechaty.Contact.load(contact.id)
              await sender.say(contactCard)
              isReplied = true
              break
            }

            case MessageType.Audio:
            case MessageType.Video:
            case MessageType.Image:
            case MessageType.Emoticon:
            case MessageType.Attachment: {
              let fileBox: any
              if (config.data.startsWith('http')) {
                fileBox = FileBox.fromUrl(`${config.data}`)
              } else {
                fileBox = FileBox.fromFile(`${config.data}`)
              }
              await sender.say(fileBox)
              isReplied = true
              break
            }

            case MessageType.Url: {
              const urlLink = new UrlLink(config.data)
              await sender.say(urlLink)
              isReplied = true
              break
            }

            default:
              log.warn(`Unknow MessageType config: ${config.type}`)
              break
          }
        }
      }
    }

    // 关键词入群，按群名/配置
    // isReplied，确认未处理过
    if (!isReplied) {
      const topics = Global.autoJoinRooms // 存入全局变量，不再每次查找数据
      if (topics && topics.includes(text)) {
        isReplied = true
        // 群别名加入！text or alias?
        let topic = text
        const aRoom = await RoomModel.findOne({ where: { topic: text } })
        if (!aRoom) {
          const aRoom = await RoomModel.findOne({ where: { alias: text } })
          if (!aRoom) throw new Error('should have aRoom')
          topic = aRoom.topic
        }
        const myRoom: Room | null = await wechaty.Room.find({ topic })
        if (!myRoom) throw new Error(`should have myRoom ${topic}`)
        if (await myRoom.has(sender)) {
          sender.say('You are already in the room')
        } else {
          await sender.say(`Will put you in ${text} room!`)
          myRoom.add(sender)
        }
      }
    }

    if (!isReplied && bot.config.autoReply) {
      if (sender.id !== 'weixin') {
        // 微信团队等不处理 todo more
        await sender.say(await getDefaultReply())
      }
    }
  }

  // save msg in db begin
  dbSave(bot, msg, room)
  // save msg in db end
}

async function dbSave(bot: Bot, msg: Message, room: Room | null) {
  // 只保存个人聊天记录 和 配置的群 config: { logMsg: true, autoReply: false }
  let isNeedSave = false
  if (!room) {
    isNeedSave = true
  } else {
    // get roomModel config
    const roomModel = await saveOrGetRoom(bot, room)
    if (roomModel.config.logMsg === true) {
      isNeedSave = true
    }
  }
  if (isNeedSave) {
    await saveMsg(msg, bot)
  }
}
