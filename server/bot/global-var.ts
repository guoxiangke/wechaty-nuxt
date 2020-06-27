import { Room, Wechaty, Contact } from 'wechaty'
import { Bot } from '../models'
// import { LevelUP } from 'levelup'
// import { RedisClient } from 'redis'

// @see https://stackoverflow.com/questions/38906359/create-a-global-variable-in-typescript
// @see https://blog.csdn.net/u011607490/article/details/86775236
export class Vars {
  // public declare static wechaty: Array<Wechaty>
  public declare static allRooms: Array<Room>
  public declare static indexRooms: Array<Room>
  public declare static myRooms: Array<Room>
  public declare static autoJoinRooms: Array<string>

  public declare static autoReply: boolean
  public declare static aiReply: boolean

  // public declare static rocksdb: LevelUP
  // public declare static redis: RedisClient
  // public declare static redisSync: any

  public static async getBot(wechaty: Wechaty) {
    const contact: Contact = wechaty.userSelf()
    const bot: Bot | null = await Bot.findOne({ where: { bind: contact.id } })
    if (!bot) throw new Error('no bot!')
    return bot
  }
}
