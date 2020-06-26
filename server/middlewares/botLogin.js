module.exports = function() {
  return async function(ctx: any, next) {
    if (!global.bot) {
      console.log({
        message: '机器人已掉线，请重新登录',
        badge: true
      })
    }
    await next()
  }
}
