import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../database/config'
export class AutoReply extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  // 响应 所有人 Personal // 不响应群，或响应配置群？
  public keyword!: string // 响应的 正则/字符串
  public reply!: any // 响应资源内容 json {type:text,content:'xxxx'}
}

// smartreply
AutoReply.init(
  {
    keyword: {
      type: new DataTypes.STRING(),
      unique: true,
      allowNull: false
    },
    reply: {
      type: DataTypes.JSON,
      allowNull: false
    }
  },
  {
    // tableName: 'autoreply',
    sequelize: db
  }
)
