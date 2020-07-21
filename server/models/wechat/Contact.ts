import { Model, DataTypes } from 'sequelize'
import { ContactType, ContactGender } from 'wechaty-puppet'
import { sequelize as db } from '../../database/config'

export enum Type {
  Unknown = 0,
  RoomOwner, // 4=>1 群主
  Individual, // 2=>2. bot个人联系人 //Personal
  RoomMemeber, // 3=>4. 群成员联系人
  Official // 1=>4. 公号
}

export class Contact extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date // 上次activeAt时间/回复消息时间
  public readonly deletedAt!: Date

  public type!: number // 0,1,2  contact.type() ⇒ ContactType.Unknown | ContactType.Personal | ContactType.Official
  public from!: number // Type.Unknown

  public wechatId!: string // Get Contact id. This function is depending on the Puppet Implementation, see puppet-compatible-table
  public name!: string
  public alias!: string | null // contact.alias(newAlias) ⇒ Promise <null | string | void>
  public gender!: number // ContactGender.Unknown | ContactGender.Male | ContactGender.Female
  public province!: string | null
  public city!: string | null
  public avatar!: string | null // contact.avatar() ⇒ Promise <FileBox>

  public botId!: number
  public weight!: number // 星标/vip/排序显示 contact.start()
  public tags!: any // | null // any
}

Contact.init(
  {
    wechatId: {
      type: new DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    name: {
      type: new DataTypes.STRING(64),
      allowNull: false
    },
    alias: {
      type: new DataTypes.STRING(64)
    },
    gender: {
      type: new DataTypes.TINYINT(), // 0,1,2
      defaultValue: ContactGender.Unknown,
      allowNull: false
    },
    province: {
      type: new DataTypes.STRING(64)
    },
    city: {
      type: new DataTypes.STRING(64)
    },
    avatar: {
      type: DataTypes.STRING
    },
    type: {
      type: new DataTypes.TINYINT(),
      defaultValue: ContactType.Unknown
    },
    from: {
      type: new DataTypes.TINYINT(),
      defaultValue: Type.Unknown
    },
    weight: {
      type: new DataTypes.TINYINT(),
      defaultValue: 0
    },
    tags: {
      type: DataTypes.JSON
    },
    botId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    }
  },
  {
    tableName: 'contacts',
    sequelize: db // this bit is important
  }
)
