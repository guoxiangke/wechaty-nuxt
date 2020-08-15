import { AutoReply } from '../../models'
import { Vars as Global } from '../global-var'

export async function getDefaultReply() {
  const replies: Array<AutoReply> = await AutoReply.findAll()
  let defaultReply: string =
    '非常抱歉，没有理解你的意思，若有问题请反馈给我们，我们会第一时间处理。\r请回复以下关键词获取资源\r===============\r'
  for (const reply of replies) {
    // https://www.cnblogs.com/season-huang/p/3544873.html
    defaultReply += `【${reply.keyword}】\r`
  }

  // 所有可以 自动加入 的群

  const topics = Global.autoJoinRooms // 存入全局变量，不再每次查找数据ku
  let defaultRooms: string = ''
  if (topics) {
    for (const topic of topics) {
      defaultRooms += `【${topic}】\r`
    }
  }
  if (defaultRooms) {
    defaultReply += `\r回复群名，自动入群\r===============\r${defaultRooms}`
  }
  return defaultReply
}
