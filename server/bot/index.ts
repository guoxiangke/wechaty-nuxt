import { log } from 'brolog'
import { Wechaty } from 'wechaty'
import { PuppetPadplus } from 'wechaty-puppet-padplus'

import { Bot } from '../models/Bot'
import { onLogin } from './listeners/on-login'
import { onLogout } from './listeners/on-logout'
import { onReady } from './listeners/on-ready'
// import { onMessage } from './listeners/on-message'
// import { onReady } from './listeners/on-ready'
// const { Robot } = require('../models/robot')
// const { onLogin } = require('./listeners/on-login')
// const onFriendShip = require('./lib/FriendShip')
// const { onRoomJoin, onRoomLeave } = require('./lib/Room')

class Wechat {
  // Repository<Bot>
  public bot: Bot
  constructor(bot: Bot) {
    this.bot = bot
  }

  public wechaty: Wechaty | null = null

  async start() {
    const wechaty = new Wechaty({
      name: `${this.bot.id}`, // "1"
      puppet: new PuppetPadplus({
        token: this.bot.token
      })
    })
    this.wechaty = wechaty
    return await new Promise((resolve, reject) => {
      // wechaty.on('scan', './listeners/on-scan')
      // wechaty.on('login', './listeners/on-login')
      wechaty
        .on('scan', (qrcode) => {
          resolve({ qrcode })
        })
        .on('login', async () => {
          const res = await onLogin(wechaty, this.bot)
          resolve(res)
        })
        .on('ready', async () => {
          const res = await onReady(wechaty, this.bot)
          resolve(res)
        })
        .on('logout', async () => {
          const res = await onLogout(this.bot)
          resolve(res)
        })
        .on('error', (error) => {
          log.error('机器人故障，error：' + error)
          reject(error)
        })

      //   .on('heartbeat', './listeners/on-heartbeat')
      wechaty.on('room-join', './listeners/on-room-join')
      wechaty.on('room-invite', './listeners/on-room-invite')
      wechaty.on('room-topic', './listeners/on-room-topic')
      wechaty.on('friendship', './listeners/on-friendship')
      wechaty.on('message', './listeners/on-message')
      // wechaty.on('ready', './listeners/on-ready')
      wechaty
        .start()
        .then(() => log.info('Bot Started.'))
        .catch((e) => log.error('StarterBot', e))
    })
  }
}

export { Wechat }
