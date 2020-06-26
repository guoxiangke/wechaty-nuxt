import { log, Room, RoomInvitation, Wechaty } from 'wechaty'
import { saveOrGetRoom } from '../helper/saveOrGetRoom'
import { Bot } from '../../models'
import { getBot } from '../helper/getBot'

async function onRoomInvite(
  this: Wechaty,
  room: Room,
  invitation: RoomInvitation
) {
  const wechaty: Wechaty = this
  await invitation.accept()
  // init room & contacts
  const bot: Bot | null = await getBot(wechaty)
  if (!bot) throw new Error('no bot!')
  await saveOrGetRoom(bot, room)
  log.info(`BotJoinedANewRoom`, `${room}`)
}

module.exports = onRoomInvite
