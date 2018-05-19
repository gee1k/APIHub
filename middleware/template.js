const config = require('../config')

module.exports = async (ctx, next) => {
  await next()
  if (!ctx.body) {
    ctx.body = {
      lastBuildDate: new Date().toUTCString(),
      ttl: config.cacheExpire,
      ...ctx.state.data
    }
  }
}
