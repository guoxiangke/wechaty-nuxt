import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../../database/config'
export class FileBox extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public md5!: string
  public path!: string
  public msgId: string // 第一次发送本文件的 msg.id
}

//  确保每个文件只存储一次
FileBox.init(
  {
    md5: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    path: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    msgId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize: db
  }
)
