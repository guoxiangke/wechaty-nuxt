// DOC @see https://www.jianshu.com/p/0738e29d8af3
import { Sequelize } from 'sequelize'
// const Sequelize = require('sequelize')
// import dotenv from 'dotenv'
// dotenv.config()
const dbName = process.env.DB_NAME || 'nuxtchat'
const dbHost = process.env.DB_HOST || 'db:3306'
const dbUser = process.env.DB_USER || 'root'
const dbPass = process.env.DB_PASS || 'root'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: dbHost,
  database: dbName,
  username: dbUser,
  password: dbPass,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  // logging: (msg: any) => log.silly(msg),
  logging: false,
  // timezone: '+08:00',
  define: {
    timestamps: true,
    paranoid: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    underscored: true, // 把驼峰命名转换为下划线
    scopes: {
      bh: {
        attributes: {
          exclude: ['password', 'updated_at', 'deleted_at', 'created_at']
        }
      },
      iv: {
        attributes: {
          exclude: ['content', 'password', 'updated_at', 'deleted_at']
        }
      }
    }
  }
})

// module.exports = {
//     sequelize
// }
export { sequelize }
