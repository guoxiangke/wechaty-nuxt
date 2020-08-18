import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../../database/config'

export class Room extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date // 上次activeAt时间/回复消息时间
  public readonly deletedAt!: Date

  public roomId!: string
  public topic!: string // room.topic([newTopic]) ⇒ Promise <void | string>
  public announce!: string | null // room.announce([text]) ⇒ Promise <void | string>
  public ownerId!: number // room.owner() ⇒ Contact | null  => Contact.id
  public config!: any // json config: { logMsg: true, autoReply: false }
  public avatar!: string | null // room.avatar()

  public alias!: string // 自动入群暗号别名
  public autoJoin!: boolean // 入群管理

  public botId!: number
  public unreadCount!: number // 每收到一个消息，count+1
}

Room.init(
  {
    roomId: {
      type: new DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    topic: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    announce: {
      type: DataTypes.TEXT
    },
    avatar: {
      type: DataTypes.STRING
    },
    alias: {
      type: DataTypes.STRING(64)
    },
    autoJoin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ownerId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    config: {
      defaultValue: {},
      type: DataTypes.JSON
    },
    botId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    unreadCount: {
      type: new DataTypes.SMALLINT(),
      defaultValue: 0
    }
  },
  {
    tableName: 'rooms',
    // Using `unique: true` in an attribute above is exactly the same as creating the index in the model's options:
    indexes: [{ fields: ['room_id'] }],
    sequelize: db // this bit is important
  }
)
