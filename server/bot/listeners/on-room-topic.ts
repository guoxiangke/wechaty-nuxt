// * @property   {Function} room-topic      -(this: Wechaty, room: Room, newTopic: string, oldTopic: string, changer: Contact) => void
import { Room, Contact } from 'wechaty'

import { Room as RoomModel } from '../../models'

// 群名防篡改功能
// 测试通过！
// module.exports = onRoomTopic
// export { onRoomTopic }
export async function onRoomTopic(
  room: Room,
  newTopic: string,
  oldTopic: string,
  changer: Contact
) {
  const aRoom: RoomModel | null = await RoomModel.findOne({
    where: { roomId: room.id }
  })
  if (!aRoom) throw new Error('no aRoom!')

  if (changer.self()) {
    // 允许bot修改群名
    await updateTopic(aRoom, newTopic)
  } else {
    const owner = room.owner()
    if (!owner) throw new Error('no owner!')
    // 1. 是群主，允许修改
    // 2. 是群管理员，允许修改 todo: 获取 群管理员
    // 3. 是 managed(autoJoin) 群,且不是1，2，不允许修改
    if (aRoom.autoJoin && changer !== owner) {
      await room.topic(oldTopic) // 这一句不能放后面！
      await room.say(`请勿随意更改群名`, changer, owner)
    } else {
      await updateTopic(aRoom, newTopic)
    }
  }
}

export async function updateTopic(aRoom: RoomModel, newTopic: string) {
  await aRoom.update({ topic: newTopic })
}
