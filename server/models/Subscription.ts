import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../database/config'

export class Subscription extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public taskId!: number
  public cron!: string // * * * * *
  public to!: string // json
  public offset!: string
}

Subscription.init(
  {
    taskId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false
    },
    cron: {
      type: DataTypes.STRING,
      allowNull: false
    },
    to: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false
    },
    offset: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize: db
  }
)
