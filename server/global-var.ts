import { Wechaty } from 'wechaty'
// import { Wechat } from './bot'
import { Bot } from './models'
// import { LevelUP } from 'levelup'
// import { RedisClient } from 'redis'

// @see https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript
// @see https://blog.csdn.net/u011607490/article/details/86775236
export class Vars {
  public declare static wechaty: Array<Wechaty>
  // public declare static rocksdb: LevelUP
  // public declare static redis: RedisClient
  // public declare static redisSync: any

  /**
   * function getWechaty
   * 要保证存在再调用！
   * TypeError: Cannot read property '1' of undefined
   */
  public static getWechaty(bot: Bot) {
    return this.wechaty[bot.id]
    // if (this.wechaty) {
    // } else {
    //   throw new Error('should have wechay to call')
    // }
  }
}
