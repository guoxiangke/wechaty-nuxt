import { Message, Contact, Room } from 'wechaty'
import { log } from 'brolog'
import { Vars as Global } from '../../global-var'
import { Message as MsgModel, Bot } from '../../models'
import { saveMsg } from './saveMsg'
/**
 * save received msg from room or persional to db.
 * @param msg
 * @param bot
 */
export async function say(
  to: string,
  content: any,
  bot: Bot,
  kfId = null
): Promise<MsgModel | any> {
  const wechaty = Global.getWechaty(bot)
  if (!wechaty) throw new Error('no wechay to call on Say')

  let message: void | Message
  // room or contact?
  if (to.includes('@chatroom')) {
    const room: Room | null = await wechaty.Room.find({
      topic: to
    })
    if (!room) throw new Error('should have contact to say')
    message = await room.say(content)
  } else {
    const contact: Contact | null = await wechaty.Contact.load(to)
    if (!contact) throw new Error('should have contact to say')
    message = await contact.say(content)
  }
  log.error('say message:', [message])
  if (message) {
    const res: MsgModel = await saveMsg(message, bot, kfId)
    return res
  } else {
    throw new Error('no message to save')
  }
}
