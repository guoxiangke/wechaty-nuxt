import { Wechaty } from 'wechaty'
import { Bot } from './models'

export class Vars {
  public declare static wechaty: Array<Wechaty>

  public declare static io: any

  /**
   * function getWechaty
   * 要保证存在再调用！
   * TypeError: Cannot read property '1' of undefined
   */
  public static getWechaty(bot: Bot) {
    if (this.wechaty) {
      return this.wechaty[bot.id]
    } else {
      return null // new Error('should have wechay to call')
    }
  }
}
