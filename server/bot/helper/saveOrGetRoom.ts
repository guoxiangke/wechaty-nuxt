import { Contact, Room, log } from 'wechaty'
import { FileBoxType } from 'file-box'
import { Contact as ContactModel, Room as RoomModel, Bot } from '../../models'
import { Type } from '../../models/wechat/Contact'
import { saveRoomMember } from './saveRoomMember'
import { saveOrGetContact } from './saveOrGetContact'
// save room into db

export async function saveOrGetRoom(bot: Bot, room: Room) {
  const owner: Contact | null = await room.owner()
  if (!owner) throw new Error("Can't get room owner!")

  const contact: ContactModel | null = await saveOrGetContact(
    bot,
    owner,
    Type.RoomOwner
  )
  if (!contact) throw new Error('没有保存群主')
  log.info('群主', [room, owner, contact.id])

  // 如果是群主，则可以自动入群
  let autoJoin: boolean = false
  if (bot.bind === owner.id) {
    autoJoin = true
  }

  const avatar = await room.avatar()
  const type = avatar.boxType
  let avatarUrl = null
  if (type === FileBoxType.Url) {
    avatarUrl = (avatar as any).remoteUrl
  }

  const [roomInstance, created] = await RoomModel.findOrCreate({
    where: { roomId: room.id, botId: bot.id },
    defaults: {
      topic: await room.topic(),
      announce: await room.announce(),
      ownerId: contact.id,
      autoJoin,
      avatar: avatarUrl,
      config: { logMsg: true, autoReply: false }
    }
  })

  if (!roomInstance) throw new Error('没有获得要使用的群')
  if (created) log.silly('新建了一个群')

  await saveRoomMember(bot, roomInstance.id, room)
  log.info('RoomInited', `${room}, '${contact.wechatId}'=>${contact.name}`)
  return roomInstance
}
