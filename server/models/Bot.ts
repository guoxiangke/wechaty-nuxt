import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../database/config'

export class Bot extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date // == lastLoginAt:Date
  public readonly deletedAt!: Date

  public name!: string
  public bind!: string | null
  public description!: string
  public token!: string
  // todo  自定义参数json：{logMsg:true, autoReply:true, welcomeMsg:'Welcome'}
  public config!: any // 是否保存 个人 消息/文件
  public status!: boolean // 是否登录
}

Bot.init(
  {
    name: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    token: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true
    },
    bind: {
      type: DataTypes.STRING(32),
      allowNull: true
    },
    config: {
      type: DataTypes.JSON,
      allowNull: true
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    // tableName: 'xxxs',
    sequelize: db
  }
)
