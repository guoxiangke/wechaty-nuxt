/* eslint-disable require-await */
import * as Koa from 'koa'
// import Router from 'koa-router'
// const router = require('koa-router')()
import Router from '@koa/router'
import { User } from '../models'

const router = new Router({
  prefix: '/api/users'
})

// const routerOpts: Router.IRouterOptions = {
//   prefix: '/api/users'
// }

// const router: Router = new Router(routerOpts)

// router.prefix('/api/bot')

// https://github.com/koajs/router/blob/master/API.md
router.get('/', async (ctx: Koa.Context) => {
  const users = await User.findByPk(1)
  console.log('users', users)
  // ctx.body = users
  ctx.body = 'GET ALL'
})

router.get('/:id', async (ctx: Koa.Context) => {
  const user = await User.findByPk(ctx.params.id)
  console.log('user', user, ctx.params.id)
  ctx.body = 'GET SINGLE'
})

router.post('/', async (ctx: Koa.Context) => {
  // ctx.body = 'POST SAVE New'
  const newUser = await User.create(ctx.params.body)
  await newUser.save()
  ctx.body = newUser
})

router.delete('/:id', async (ctx: Koa.Context) => {
  // ctx.body = 'DELETE'
  const results = await User.destroy(ctx.params.id)
  console.log('DELETE user', results)
  ctx.body = results
})

// router.patch('/:id', async (ctx: Koa.Context) => {
//   // ctx.body = 'PATCH'
//   const user = await User.findByPk(ctx.params.id)
//   if (user) {
//     User.merge(user, ctx.body)
//     ctx.body = await User.save(user)
//   }
// })

// export { router }
export default router

// import * as Koa from 'koa'

// import { getRepository } from 'typeorm'
// import { User } from '../entity/User'

// export const getUsers = async (ctx: Koa.Context) => {
//   const users = await getRepository(User).find()
//   return res.json(users)
// }

// export const getUser = async (ctx: Koa.Context) => {
//   const results = await getRepository(User).findOne(req.params.id)
//   return res.json(results)
// }

// export const createUser = async (ctx: Koa.Context) => {
//   const newUser = await getRepository(User).create(req.body)
//   const results = await getRepository(User).save(newUser)
//   return res.json(results)
// }

// export const updateUser = async (ctx: Koa.Context) => {
//   const user = await getRepository(User).findOne(req.params.id)
//   if (user) {
//     getRepository(User).merge(user, req.body)
//     const results = await getRepository(User).save(user)
//     return res.json(results)
//   }

//   return res.json({ msg: 'Not user found' })
// }

// export const deleteUser = async (ctx: Koa.Context) => {
//   const results = await getRepository(User).delete(req.params.id)
//   return res.json(results)
// }
