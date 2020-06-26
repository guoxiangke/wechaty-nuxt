import { User } from './User'
import { Bot } from './Bot'
import { Contact } from './wechat/Contact'
import { Member } from './wechat/Member'
import { Room } from './wechat/Room'
import { Message } from './wechat/Message'
import { Subscription } from './Subscription'
import { Task } from './Task'

export { Contact } from './wechat/Contact'
export { Message } from './wechat/Message'
export { Room } from './wechat/Room'
export { Member } from './wechat/Member'

export { AutoReply } from './AutoReply'
export { AutoForward } from './AutoForward'
export { FileBox } from './wechat/FileBox'

export { User } from './User'
export { Bot } from './Bot'
export { Task } from './Task'
export { Subscription } from './Subscription'

// 一对一关系示例
// Address(userId)
// User
// 一个地址属于一个用户
// Address.belongsTo(User, {targetKey: 'id'});
// 一个用户拥有一个地址
// User.hasOne(Address,{sourceKey: 'id'});

// Address(userId) => user（botID）
// User =>  bot
User.belongsTo(Bot, { targetKey: 'id' })
Bot.hasOne(User, { sourceKey: 'id' })

// User.hasMany(Project);
// Project.belongsTo(User);
// var project = Project.create({title: 'ISD Corp'});
// user.addProject({project});

// 每个Contact 必须 属于 某一个 bot
// 每条消息 必须 属于 某一个 Contact (fromId)

// fromId is contactId
Contact.hasMany(Message, {
  foreignKey: 'fromId'
})
Message.belongsTo(Contact, {
  foreignKey: 'fromId'
})

//
Task.hasMany(Subscription, {
  foreignKey: 'taskId'
})
Subscription.belongsTo(Task)

// roomOwner
Contact.hasMany(Room, {
  as: 'owner',
  foreignKey: 'ownerId'
})
Room.belongsTo(Contact)

// Member
// Contact HasMany Room 1个用户可以在多个群里
// Room HasMany Contact 1个群可以有多个用户
// Foo.hasMany(Bar)
// Contact.belongsToMany(Room, { through: Member })
// Room.belongsToMany(Contact, { through: 'members' })
Room.hasMany(Member, {
  foreignKey: 'roomId',
  as: 'member'
})
Member.belongsTo(Room)

Contact.hasMany(Member, {
  foreignKey: 'contactId',
  as: 'Room'
})
Member.belongsTo(Contact)
