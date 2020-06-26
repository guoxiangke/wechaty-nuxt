// import { log } from 'brolog'
import { Bot } from '../../models/Bot'

async function onLogout(bot: Bot) {
  bot.status = false
  await bot.save()
  return { isLogin: false }
}
// module.exports = onLogout
export { onLogout }
