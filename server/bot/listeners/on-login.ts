import { Contact, Wechaty } from 'wechaty'
import { log } from 'brolog'

function onLogin(wechaty: Wechaty) {
  // const wechaty = this
  // await wechaty.say(`robot.startSay`)

  // user: Contact,
  // log.info(`bot ${user} login`)
  // log.info(`bot name: ${user.name()}`)
  // log.info(`bot id: ${user.id}`)

  const contact: Contact = wechaty.userSelf()

  // log & test
  log.info(`Bot Login: ${contact}`)
  return { success: true }
}

// module.exports = onLogin
export { onLogin }
