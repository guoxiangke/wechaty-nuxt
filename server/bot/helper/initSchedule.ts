import { log, Contact, Wechaty, Room } from 'wechaty'
import { FileBox } from 'file-box'
import { Task, Subscription } from '../../models'
// const { FileBox } = require('file-box')
const moment = require('moment')

export { initSchedule }

async function initSchedule(wechaty: Wechaty) {
  // const wechaty: Wechaty
  const cron = require('node-schedule')
  // todo 每天发一个链接

  const subscriptions: Array<any> = await Subscription.findAll()

  const jobs: Array<any> = []
  // todo load新任务，当数据库改变时
  subscriptions.forEach((subscription) => {
    log.info(
      'SCHEDULE',
      `taskId:${subscription.taskId} cron:${subscription.cron}`
    )
    jobs[subscription.id] = cron.scheduleJob(subscription.cron, () =>
      setOrRun(subscription, wechaty)
    )
  })

  // var k = schedule.scheduleJob(cancelRule, function () {
  //     console.log('定时器取消' + moment().format())
  //     j.cancel();
  // })
}

async function setOrRun(subscription: any, wechaty: Wechaty) {
  const task = await Task.findOne({ where: { id: subscription.taskId } })
  if (!task) throw new Error('no task! @setOrRun line:40')

  let current: string = ''
  if (task.isByCount) {
    const startDate = moment(subscription.offset, 'YYYY-M-DD')
    const daysDiff = moment().diff(startDate, 'days')
    current = String(daysDiff % task.config.count)
    if (task.config.pad && task.config.fill) {
      current = current.padStart(task.config.pad, task.config.fill)
    }
  } else {
    current = moment().format('MMDD') // 0101.mp4
  }
  // eslint-disable-next-line no-template-curly-in-string
  const path = task.path.replace('${current}', current)

  // todo answer = Text 每日一句
  let answer: any
  if (task.path.startsWith('http')) {
    answer = FileBox.fromUrl(encodeURI(path))
  } else {
    answer = FileBox.fromFile(path)
  }

  subscription.to.data.forEach(async (el: any) => {
    let receiver: Room | Contact | null = null
    if (el.type === 'room') {
      // get the room by topic
      receiver = await wechaty.Room.find({ topic: `${el.value}` })
    } else if (el.type === 'name') {
      receiver = await wechaty.Contact.find({ name: `${el.value}` })
    } else if (el.type === 'alias') {
      receiver = await wechaty.Contact.find({ alias: `${el.value}` })
    }
    if (!receiver) throw new Error(`no receiver! ${el}`)

    log.info('SCHEDULE', `${task.name} ${receiver} ${path}`)

    return receiver.say(answer)
  })
}
