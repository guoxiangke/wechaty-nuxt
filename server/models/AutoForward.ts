import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../database/config'

/**
 * FromType Room/Contact
 */
export enum Type {
  Room = 0,
  Contact
}
export class AutoForward extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public isRoom!: boolean // room / contact
  public from!: string // topic or contact alias
  public senders!: any // json

  // 转发某个群里的某几个用户的信息
  // from.type = "room"
  // from.name = roomName
  // from.senders = [{"alias": "扎根（鲍弟兄）"},{"name":"xxxx"}]

  // 转发某个联系人的信息
  // from.type = "contact"
  // from.name = contact.name()
  // from.senders = []
  public destinations!: any // json

  // 转发到 某几个群里 destinations
  // destinations.type = "room"
  // destinations = [{type:"room","topic":roomName},{type:"contact","name":contact.name()}]
}

AutoForward.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    isRoom: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senders: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false
    },
    destinations: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false
    }
  },
  {
    sequelize: db
  }
)
