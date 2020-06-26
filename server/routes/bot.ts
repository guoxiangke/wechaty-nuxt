import * as Koa from 'koa'
import Router from '@koa/router'
// import { getRepository } from 'typeorm'
import { Wechat } from '../bot'
import { Bot } from '../models/Bot'

// import { BotController } from '../controllers'

// const router = require('koa-router')()
// const router = new Router()
// router.prefix('/api/bot')
const router = new Router({
  prefix: '/api/bots'
})

router.get('/:id/login', async (ctx: Koa.Context) => {
  const bot: Bot | null = await Bot.findByPk(ctx.params.id)
  if (!bot) throw new Error('机器人不存在')
  // if (!bot.token) throw new Error('缺少协议token')
  const webot = new Wechat(bot)
  ctx.body = await webot.start()
  // const result = {"qrcode":"http://weixin.qq.com/x/Ifj3ZIn5AkXnSMGSAPvu"}
})

export default router
