import { MessageType } from 'wechaty-puppet'
import dotenv from 'dotenv'
import { sequelize as db } from '../../database/config'
import { Contact, Message, Member, Room, Task, Bot, User } from '../index'
import { AutoReply } from '../AutoReply'
import { AutoForward } from '../AutoForward'
import { Subscription } from '../Subscription'

console.log(Contact, Message, Room, Member)

dotenv.config()
const token = process.env.WECHATY_PUPPET_PADPLUS_TOKEN || 'UniqueToken'

db.sync({ force: false })
  .then(async () => {
    await Bot.create({
      name: 'MyFirstUniqueBot',
      description: 'description string',
      token,
      config: {
        logMsg: true,
        autoReply: true,
        welcomeMsg: 'Welcome'
      },
      status: false // 是否登录
    })

    const user = new User()
    user.email = 'admin@unqiue.com'
    user.password = 'password' // todo
    user.loginAt = new Date()
    user.botId = 1
    await user.save()
    console.log(user.toJSON())
  })
  .then(() => {
    const data = require(`./task.json`).data
    data.forEach(async (el: any) => {
      const job = {
        name: el.name,
        description: el.description,
        path: el.path,
        type: MessageType[el.type], // “方括号法” 使用变量动态访问对象属性
        isByCount: el.isByCount,
        config: el.config
      }
      if (job) {
        await Task.create(job)
      }
    })
  })
  .then(() => {
    const data = require(`./autoreply.json`).data
    data.forEach(async (el: any) => {
      await AutoReply.create({
        keyword: el.key,
        reply: {
          type: MessageType[el.reply.type], // “方括号法” 使用变量动态访问对象属性
          data: el.reply.data
        }
      })
    })
  })
  .then(() => {
    const data = require(`./autoforward.json`).data
    data.forEach(async (el: any) => {
      await AutoForward.create({
        isRoom: el.isRoom,
        from: el.fromName,
        senders: { data: el.senders },
        destinations: { data: el.destinations }
      })
    })
  })
  .then(() => {
    const data = require(`./subscription.json`).data
    data.forEach(async (el: any) => {
      await Subscription.create({
        taskId: el.taskId,
        cron: el.cron,
        to: { data: el.to },
        offset: el.offset
      })
    })
  })
