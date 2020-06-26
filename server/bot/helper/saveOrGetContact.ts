import { Contact } from 'wechaty'
import { Contact as ContactModel, Bot } from '../../models'
import { Type } from '../../models/wechat/Contact'

export async function saveOrGetContact(
  bot: Bot,
  contact: Contact,
  fromType: Type = Type.Unknown
) {
  let contactModel = await ContactModel.findOne({
    where: { wechatId: contact.id }
  })
  if (!contactModel) {
    if (contact.type() === Contact.Type.Official) {
      fromType = Type.Official
    }
    contactModel = await ContactModel.create({
      botId: bot.id,
      type: contact.type(),
      fromType,

      wechatId: contact.id,
      name: contact.name(),
      alias: await contact.alias(),
      gender: contact.gender(),
      province: contact.province(),
      city: contact.city()
      // avatar: (await contact.avatar()).toDataURL // contact.avatar() ⇒ Promise <FileBox> ==> toUrl
    })
  } else {
    // update from
    // eslint-disable-next-line no-lonely-if
    if (Type.Unknown !== fromType) {
      contactModel.from = fromType
      await contactModel.save()
    }
  }

  return contactModel
}
