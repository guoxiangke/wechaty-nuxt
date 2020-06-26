import { Model, DataTypes } from 'sequelize'
import { MessageType } from 'wechaty-puppet'
import { sequelize as db } from '../database/config'

// can't use Job. todo why?
export class Task extends Model {
  public id!: number
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public name!: string
  public description!: string
  public type!: number // MessageType.Unknown,
  public path!: string
  public isByCount!: boolean // date or count

  public config!: any // todo ?json: {count=>150, pad=>3, fill=>'0'} default:{null,null,null}
}

Task.init(
  {
    name: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    type: {
      type: DataTypes.TINYINT,
      defaultValue: MessageType.Unknown,
      allowNull: false
    },
    path: {
      // "/usr/src/app/bot/files/19_Psalm/19_${current}.mp3"
      type: DataTypes.STRING,
      allowNull: false
    },
    isByCount: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    config: {
      // The DataTypes.JSON data type is only supported for SQLite, MySQL, MariaDB and PostgreSQL. However, there is a minimum support for MSSQL (see below).
      type: DataTypes.JSON,
      unique: true,
      allowNull: true
    }
  },
  {
    // tableName: 'xxxs',
    sequelize: db
  }
)
