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

  public name!: string
  public email!: string
  public password!: string
  public avatar!: string
  public botId!: number // 多个人可以管理同一个的bot
  public loginAt!: Date

  // Instance Method
  // https://sequelize.org/master/manual/model-basics.html#taking-advantage-of-models-being-classes
  validatePassword(password: string) {
    return this.password === password
  }

  // classLevelMethod todo crypto
  static setPassword() {
    return 'foo'
  }

  // https://www.freecodecamp.org/news/learn-how-to-handle-authentication-with-node-using-passport-js-4a56ed18e81e/
  // https://stackoverflow.com/questions/30100686/how-to-add-custom-function-to-sequelize-js-in-node-js

  // UsersSchema.methods.setPassword = function(password) {
  //   this.salt = crypto.randomBytes(16).toString('hex');
  //   this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  // };

  // UsersSchema.methods.validatePassword = function(password) {
  //   const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  //   return this.hash === hash;
  // };
}

User.init(
  {
    name: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    avatar: {
      // http or 上传路径
      type: DataTypes.STRING,
      allowNull: true
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
