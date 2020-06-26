import { Contact, Wechaty } from 'wechaty'
import { log } from 'brolog'
import { Bot } from '../../models'

async function onLogin(wechaty: Wechaty, bot: Bot) {
  // const wechaty = this
  // await wechaty.say(`robot.startSay`)

  // user: Contact,
  // log.info(`bot ${user} login`)
  // log.info(`bot name: ${user.name()}`)
  // log.info(`bot id: ${user.id}`)

  const contact: Contact = wechaty.userSelf()
  bot.status = true
  bot.bind = contact.id
  await bot.save()

  // log & test
  log.info(`Bot Login: ${contact}`)
  return { isLogin: true }
}

// module.exports = onLogin
export { onLogin }
