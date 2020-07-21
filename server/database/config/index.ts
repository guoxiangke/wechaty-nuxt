// DOC @see https://www.jianshu.com/p/0738e29d8af3
import { Sequelize } from 'sequelize'
// const Sequelize = require('sequelize')
const sequelize = new Sequelize({
  dialect: 'sqlite',
  // todo storage path keep same as config.json
  storage: './server/database/db.sqlite',
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
