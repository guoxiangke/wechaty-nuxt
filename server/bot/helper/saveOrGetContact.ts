import { Contact } from 'wechaty'
import { FileBoxType } from 'file-box'
import { Contact as ContactInstance, Bot } from '../../models'
import { Type } from '../../models/wechat/Contact'

export async function saveOrGetContact(bot: Bot, contact: Contact, from: Type) {
  let contactInstance = await ContactInstance.findOne({
    where: { wechatId: contact.id }
  })

  // 获取头像
  // https://github.com/wechaty/wechaty/issues/1918
  // avatar: (await contact.avatar()).toDataURL // contact.avatar() ⇒ Promise <FileBox> ==> toUrl
  // const avatar = contact.payload ? contact.payload.avatar : null
  const avatar = await contact.avatar()
  const type = avatar.boxType
  let avatarUrl = null
  if (type === FileBoxType.Url) {
    avatarUrl = (avatar as any).remoteUrl
  }
  const weight = contact.star()
  // const tags = await contact.tags() //todo
  // log.error(JSON.stringify(tags))
  // 06:05:31 ERR [{"domain":null,"_events":{},"_eventsCount":0,"id":"i看电影会员"}]

  if (contact.type() === Contact.Type.Official) {
    from = Type.Official
  }

  if (!contactInstance) {
    contactInstance = await ContactInstance.create({
      botId: bot.id,
      type: contact.type(),
      from,

      wechatId: contact.id,
      name: contact.name(),
      alias: await contact.alias(),
      gender: contact.gender(),
      province: contact.province(),
      city: contact.city(),
      avatar: avatarUrl,
      // tags, //todo
      weight
    })
  } else {
    // 再次更新 from.
    contactInstance.from = from
    // // 如果是群主
    // if (contactInstance.from === Type.RoomOwner) {
    // }

    // 更新微信可以更改的资料
    contactInstance.name = contact.name()
    contactInstance.alias = await contact.alias()
    contactInstance.avatar = avatarUrl
    contactInstance.gender = contact.gender()
    contactInstance.province = contact.province()
    contactInstance.city = contact.city()
    contactInstance.weight = weight ? 1 : 0
    // contactInstance.tags = tags //todo
    await contactInstance.save()
  }

  return contactInstance
}
