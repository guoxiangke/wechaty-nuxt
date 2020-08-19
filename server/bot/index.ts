import { log } from 'brolog'
import { Wechaty } from 'wechaty'
// import { PuppetPadplus } from 'wechaty-puppet-padplus'

import { Bot } from '../models/Bot'
import { onLogin } from './listeners/on-login'
import { onLogout } from './listeners/on-logout'
import { onReady } from './listeners/on-ready'
import { onMessage } from './listeners/on-message'
import { onRoomJoin } from './listeners/on-room-join'

import { onRoomInvite } from './listeners/on-room-invite'
import { onRoomTopic } from './listeners/on-room-topic'
import { onFriendship } from './listeners/on-friendship'

// const { onRoomJoin } = require('./lib/Room') //, onRoomLeave

class Wechat {
  // Repository<Bot>
  public bot: Bot
  constructor(bot: Bot) {
    this.bot = bot
  }

  public wechaty: Wechaty | null = null

  async start() {
    // https://github.com/wechaty/wechaty-puppet-padplus/issues/142
    const puppet = 'wechaty-puppet-padplus'
    const token = this.bot.token
    const wechaty = new Wechaty({
      name: `${this.bot.id}`,
      puppet,
      puppetOptions: { token }
    })
    this.wechaty = wechaty
    return await new Promise((resolve, reject) => {
      // wechaty.on('scan', './listeners/on-scan')
      // wechaty.on('login', './listeners/on-login')
      // wechaty.on('logout', './listeners/on-logout')
      wechaty
        .on('scan', (qrcode: any) => {
          resolve({ qrcode })
        })
        .on('login', async () => {
          const res = await onLogin(wechaty)
          resolve(res)
        })
        .on('logout', async () => {
          const res = await onLogout()
          resolve(res)
        })
        // .on('ready', async () => {
        //   const res = await onReady(wechaty, this.bot)
        //   resolve(res)
        // })
        .on('error', (error) => {
          log.error('机器人故障，error：' + error)
          reject(error)
        })
      // wechaty.on('heartbeat', './listeners/on-heartbeat')
      wechaty.on('room-join', onRoomJoin)
      wechaty.on('room-invite', onRoomInvite)
      wechaty.on('room-topic', onRoomTopic)
      wechaty.on('friendship', onFriendship)
      wechaty.on('message', onMessage)
      wechaty.on('ready', onReady)
      wechaty
        .start()
        .then(() => log.info('Bot Started.'))
        .catch((e) => log.error('StarterBot', e))
    })
  }
}

export { Wechat }
