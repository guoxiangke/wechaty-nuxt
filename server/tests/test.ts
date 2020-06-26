import { Bot } from '../models/Bot'
import { AutoForward, Room as RoomModel } from '../models'

async function test() {
  const bot: Bot | null = await Bot.findByPk(1)
  if (!bot) return

  console.log('old', bot.config)
  bot.status = true
  bot.config.autoReply = true
  // eslint-disable-next-line no-self-assign
  bot.config = bot.config
  await bot.save() // { fields: ['config'] }
  // await bot.reload()
  console.log('after', bot.config)

  const forwards = await AutoForward.findAll({
    where: { isRoom: true }
  })
  for (const forward of forwards) {
    const destinations = forward.destinations
    console.log(destinations.data, forward.from, forward.senders.data)
  }

  await RoomModel.findOrCreate({
    where: { roomId: '22669411442@chatroom', botId: bot.id },
    defaults: {
      topic: 'await room.topic()', // room.topic([newTopic]) ⇒ Promise <void | string>
      announce: 'await room.announce()', // room.announce([text]) ⇒ Promise <void | string>
      ownerId: 1,
      config: { logMsg: true, saveFile: false }
    }
  })
    .then()
    .catch((e) => console.log(e))
  // console.log(roomInstance.id, created)
}
test()
