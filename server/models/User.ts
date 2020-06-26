import { Model, DataTypes } from 'sequelize'
import { sequelize as db } from '../database/config'

export class User extends Model {
  // Sequelize also defines by default the fields id (primary key),
  // createdAt and updatedAt to every model.
  // This behavior can also be changed,
  // of course (check the API Reference to learn more about the available options).
  public id!: number // Note that the `null assertion` `!` is required in strict mode.
  public readonly createdAt!: Date
  public readonly updatedAt!: Date
  public readonly deletedAt!: Date

  public email!: string
  public password!: string
  public botId!: number // 多个人可以管理同一个的bot
  public loginAt!: Date
}

User.init(
  {
    // id: {
    //   type: DataTypes.BIGINT.UNSIGNED,
    //   autoIncrement: true,
    //   primaryKey: true
    // },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    botId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true
    },
    loginAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    // tableName: 'xxxs',
    sequelize: db
  }
)
