import { Model, DataTypes } from 'sequelize'
import { MessageType } from 'wechaty-puppet'
import { sequelize as db } from '../../database/config'

export class Message extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public msgId!: string // from wx/wechaty server
  public fromId!: number
  public botId!: number
  // to where
  public to: string | null // messge.from() or room.id
  public type!: number | null // message.type() ⇒ MessageType
  // 根据不同的MessageType而有的内容 如 Url/Image 发送文字： {text:'xxx'}
  public content!: any | null // json
  // botUser 回复内容给 群/好友 记录到数据库 kfId
  public kfId!: number | null
}

Message.init(
  {
    msgId: {
      type: new DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    fromId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    kfId: {
      type: DataTypes.BIGINT.UNSIGNED,
      defaultValue: null
    },
    to: {
      type: DataTypes.STRING,
      defaultValue: null
    },
    type: {
      type: new DataTypes.TINYINT(),
      defaultValue: MessageType.Unknown
    },
    content: {
      defaultValue: {},
      type: DataTypes.JSON,
      allowNull: true
    },
    botId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  },
  {
    indexes: [{ fields: ['to'] }],
    sequelize: db
  }
)
