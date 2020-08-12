// import LocalStrategy from 'passport-local'
// import passport from 'koa-passport'
// https://stackoverflow.com/questions/20978585/typescript-for-passportjs
import { User } from '../models/User'
const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email: string, password: string, done: Function) => {
      const user: User | null = await User.findOne({ where: { email } })
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect password or email.' })
      }
      return done(null, user)
    }
  )
)

// 在每次请求时 会从session中读取用户对象  用户通过验证后serializeUser会将用户数据存在session中
// 序列化  ctx.login()触发
passport.serializeUser((user: User, done: Function) => {
  done(null, user)
})
// 反序列化 （请求时，session中存在"passport":{"user":"1"}触发）
passport.deserializeUser((user: User, done: Function) => {
  done(null, user)
})

export default passport
