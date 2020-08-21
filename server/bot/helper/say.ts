import { Message, Contact, Room, FileBox } from 'wechaty'
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
  content: any,
  bot: Bot,
  kfId = null
): Promise<MsgModel | any> {
  const wechaty = Global.getWechaty(bot)
  if (!wechaty) throw new Error('no wechay to call on Say')

  const to: string = content.to
  const type: string = content.type
  const data: string = content.data
  // room or contact?
  let who: Room | Contact | null = null
  if (to.includes('@chatroom')) {
    const room: Room | null = await wechaty.Room.load(to)
    if (!room) throw new Error('should have contact to say')
    who = room
  } else {
    const contact: Contact | null = await wechaty.Contact.load(to)
    if (!contact) throw new Error('should have contact to say')
    who = contact
  }

  if (who) {
    let res: MsgModel | null = null
    // 发送文件
    if (Object.keys(content.file).length !== 0) {
      const message = await who.say(
        FileBox.fromFile(content.file.path, content.file.name)
      )
      if (message) {
        log.info('OnSayFile: ', `${kfId} say ${message}`)
        res = await saveMsg(message, bot, kfId)
      }
    }

    // textMessage todo
    if (type === 'text' && data.length > 0) {
      const message = await who.say(data)
      if (message) {
        res = await saveMsg(message, bot, kfId)
        log.info('OnSayText: ', `${kfId} say ${message}`)
      } else {
        throw new Error('no message to save')
      }
    }

    return res
  }
}
