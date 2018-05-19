const Koa = require('koa')

const logger = require('./utils/logger')
const config = require('./config')

const onerror = require('./middleware/onerror')
const header = require('./middleware/header.js')
// const utf8 = require('./middleware/utf8.js')
const template = require('./middleware/template.js')
const memoryCache = require('./middleware/lru-cache.js')
const redisCache = require('./middleware/redis-cache.js')
const favicon = require('koa-favicon')
const debug = require('./middleware/debug.js')

const router = require('./router')

process.on('uncaughtException', (e) => {
  logger.error('uncaughtException: ' + e)
})

logger.info('🍻 APIHub start! Cheers!')

const app = new Koa()
app.proxy = true

// favicon
app.use(favicon(__dirname + '/favicon.ico'))

// global error handing
app.use(onerror)

// 1 set header
app.use(header)
app.use(template)

// 6 debug
app.context.debug = {
  hitCache: 0,
  request: 0,
  routes: [],
  ips: []
}
app.use(debug)

// 5 fix incorrect `utf-8` characters
// app.use(utf8);

// 2 cache
if (config.cacheType === 'memory') {
  app.use(
    memoryCache({
      app: app,
      expire: config.cacheExpire,
      ignoreQuery: true
    })
  )
} else if (config.cacheType === 'redis') {
  app.use(
    redisCache({
      app: app,
      expire: config.cacheExpire,
      ignoreQuery: true,
      redis: config.redis,
      onerror: (e) => {
        logger.error('Redis error: ', e)
      },
      onconnect: () => {
        logger.info('Redis connected.')
      }
    })
  )
}

// router
app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port, parseInt(config.listenInaddrAny) ? null : '127.0.0.1')
