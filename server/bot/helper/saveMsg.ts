import { Message, Contact, log } from 'wechaty'
import { MessageType } from 'wechaty-puppet'

import { Type as ContactModelType } from '../../models/wechat/Contact'

import { Message as MsgModel, Bot, Room } from '../../models'
import { Vars as Globals } from '../../global-var'
import { saveOrGetContact } from './saveOrGetContact'
import { saveMsgFile } from './saveMsgFile'
import { xmlToJson } from './xmlToJson'

/**
 * save received msg from room or persional to db.
 * @param msg
 * @param bot
 */
export async function saveMsg(
  msg: Message,
  bot: Bot,
  kfId = null
): Promise<MsgModel | any> {
  const sender: Contact | null = msg.from()
  if (!sender) throw new Error('no sender!')
  // 获取消息发送的联系人。在微信群中，Message.to() 会返回null，使用Message.room()获取微信群信息。
  // 上面👆文档解释错误🙅‍♂️！ to()始终有值！ 2020.6.23
  let to: any = msg.to()
  if (!to) {
    to = msg.room()
  }

  let content: any // 要保存到数据库中的内容，默认为 msg.text()
  content = msg.text()
  const room = msg.room()
  const type: number = msg.type()

  let toId: string
  if (room) {
    toId = room.id
  } else if (sender.id === bot.bind) {
    // bot 主动发送的消息的用户 wechatId
    // 如果是bot主动发送的消息， sender = self
    toId = to.id
  } else {
    // 默认，bot 被动接收消息时，消息来源者
    toId = sender.id
  }

  let next: boolean = true
  // save file first
  switch (type) {
    // 语音消息，存不存储?决定在上一层逻辑
    case MessageType.Audio:
    case MessageType.Emoticon:
    case MessageType.Image:
    case MessageType.Attachment: // mp3
    case MessageType.Video: {
      const subDir = MessageType[type].toLowerCase()
      // get content to save
      content = await saveMsgFile(msg, subDir)
      break
    }

    case MessageType.Url: {
      const jsonPayload = await xmlToJson(content)
      // get content to save
      content = {
        title: jsonPayload.msg.appmsg.title,
        url: jsonPayload.msg.appmsg.url,
        description: jsonPayload.msg.appmsg.des,
        thumbnailUrl: jsonPayload.msg.appmsg.thumburl
      }
      break
    }
    case MessageType.MiniProgram: // todo  主动发送小程序！
      next = false
      break
    case MessageType.Contact:
    case MessageType.ChatHistory:
    case MessageType.Location:
    case MessageType.Transfer:
    case MessageType.RedEnvelope:
    case MessageType.Recalled:
      next = false
      break
    case MessageType.Unknown:
      next = false
      break
    default:
      break
  }
  if (!next) {
    log.info(`MessageType`, `${MessageType[type]} not saved! ${content}`)
    return
  }

  // 默认类型为个人，如果是群，判定是群主还是群成员
  let fromType = ContactModelType.Individual
  if (room) {
    const owner: Contact | null = await room.owner()
    if (!owner) throw new Error("Can't get room owner!")
    if (sender === owner) {
      fromType = ContactModelType.RoomOwner
    } else {
      fromType = ContactModelType.RoomMemeber
    }
  }
  // 数据库中找到该记录，并更新正确的 类型（如果fromType不对的话）。
  const contactModel = await saveOrGetContact(bot, sender, fromType)

  const res: MsgModel = await MsgModel.create({
    kfId,
    botId: bot.id,
    msgId: msg.id,
    fromId: contactModel.id,
    to: toId,
    type,
    content: { data: content }
  })

  if (!room) {
    contactModel.unreadCount += 1
    contactModel.save()
  } else {
    const roomInstance: Room | null = await Room.findOne({
      where: { room_id: room.id }
    })
    if (roomInstance) {
      roomInstance.unreadCount += 1
      roomInstance.save()
    }
  }

  // broadcast in controller todo by bot as room
  // ctx.socket.emit('broadcastEmit', '1000') // NOT WORK !!!
  Globals.io.socket.sockets.emit('newMsgEmit', res) // WORK !!!
  return res
}
