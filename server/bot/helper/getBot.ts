import { Contact, Wechaty } from 'wechaty'
import { Bot } from '../../models'

export async function getBot(wechaty: Wechaty) {
  const contact: Contact = wechaty.userSelf()
  const bot: Bot | null = await Bot.findOne({ where: { bind: contact.id } })
  if (!bot) throw new Error('no bot!')
  return bot
}
