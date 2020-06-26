// MemberShip 谁，在哪个群里/ 在群里都有谁

import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../../database/config'

export class Member extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public contactId!: number
  public roomId!: number
}

Member.init(
  {
    contactId: {
      type: DataTypes.BIGINT.UNSIGNED
    },
    roomId: {
      type: DataTypes.BIGINT.UNSIGNED
    }
  },
  {
    indexes: [{ unique: true, fields: ['room_id', 'contact_id'] }],
    sequelize: db
  }
)
