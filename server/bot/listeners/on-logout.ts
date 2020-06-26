// import { Vars as Global } from '../global-var'

import { Bot } from '../../models/Bot'
// import { Autojoin } from '../model/autojoin'

async function onLogout(bot: Bot) {
  bot.status = false
  await bot.save()

  return { isLogin: false }
}
// module.exports = onLogout
export { onLogout }
