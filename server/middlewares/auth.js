module.exports = function() {
  return async function(ctx, next) {
    if (ctx.isAuthenticated()) {
      await next()
    } else {
      console.log('error', 'Not Authenticated')
    }
  }
}
