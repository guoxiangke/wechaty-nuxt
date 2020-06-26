import { log } from 'brolog'
import { Room, Contact, Wechaty } from 'wechaty'

// Global.autoReply 全局控制变量
import { ContactSelf } from 'wechaty/dist/src/user'
import { Vars as Global } from '../global-var'

async function onRoomJoin(
  this: Wechaty,
  room: Room,
  inviteeList: Array<Contact>,
  inviter: Contact
) {
  // TODO 先保存群信息/群成员到数据库
  const wechay: Wechaty = this
  // room.id 如果不在数据库 initRoom and contacts
  // get Room Entity, 如果
  const owner = await room.owner()
  if (!owner) throw new Error('!owner at onRoomJoin line 18')
  const isOwner = owner.self()

  // 如果机器人被拉到一个新的群组里, inviteeList[0] === wechay.self()
  const aBot: ContactSelf = wechay.userSelf()
  if (inviteeList[0].id === aBot.id) {
    await room.say('新人报道[转圈]，多多关照[抱拳]')
    // 群主肯定不是bot的群
    await room.say(
      '，我可以为本群定制新人欢迎信息！要开通，请群主@我并回复群欢迎',
      owner
    )
  } else {
    // 新人加入
    // 如果是自己的群，发布群公告
    const topic = await room.topic()
    if (isOwner) {
      const inviteeName = inviteeList.map((c) => c.name()).join(', ')
      await room.say(
        inviteeName +
          ' 欢迎加入【' +
          topic +
          '】\r=====本群公告=====\r' +
          (await room.announce())
        // inviter.name()
      )
    } else {
      const rooms = Global.autoJoinRooms
      const topics = Object.keys(rooms)
      if (topics.includes(topic)) {
        // 如果不是，&& 配置了发送欢迎消息，则发送欢迎信息
        const inviteeName = inviteeList.map((c) => c.name()).join(', ')
        await room.say(inviteeName + '\r欢迎您加入本群\r请先查阅群公告')
      }
    }
  }
  log.warn(
    'onRoomJoin',
    'room: %s  inviteeList:%s Contact:%s ',
    room,
    inviteeList,
    inviter
  )

  // 更新 contacts 表
}

module.exports = onRoomJoin
