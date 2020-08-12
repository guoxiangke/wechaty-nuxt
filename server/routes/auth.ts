/* eslint-disable require-await */
import * as Koa from 'koa'
import Router from '@koa/router'
import passport from '../interface/passport'
import auth from '../middlewares/auth'

const router = new Router({
  prefix: '/api/auth'
})

// 登录接口
// POST /login
router.post('/login', async (ctx: Koa.Context, next) => {
  return passport.authenticate('local', async function(
    err: any,
    user: any,
    info: any,
    status: any
  ) {
    if (user) {
      await ctx.login(user)
    }
    ctx.body = { err, user, info, status }
  })(ctx, next)
})

router.get('/who', auth(), async (ctx: Koa.Context) => {
  if (ctx.isAuthenticated()) {
    ctx.body = ctx.session.passport.user
  } else {
    ctx.body = {}
  }
})

// 退出接口
router.get('/logout', auth(), async (ctx: Koa.Context) => {
  // ctx.logout() 由passport包提供
  await ctx.logout()
  // isAuthenticated 这个API由passport包提供
  if (!ctx.isAuthenticated()) {
    // 检查当前是不是登录状态 不是的话 说明退出成功
    ctx.body = {
      code: 0
    }
  } else {
    ctx.body = {
      code: -1
    }
  }
})
// export { router }
export default router
