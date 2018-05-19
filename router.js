const Router = require('koa-router')
const router = new Router()
const art = require('art-template')
const path = require('path')
const config = require('./config')
const logger = require('./utils/logger')

let gitHash
try {
  gitHash = require('git-rev-sync').short()
} catch (e) {
  gitHash = (process.env.HEROKU_SLUG_COMMIT && process.env.HEROKU_SLUG_COMMIT.slice(0, 7)) || 'unknown'
}
const startTime = +new Date()
router.get('/', async ctx => {
  ctx.set({
    'Content-Type': 'text/html; charset=UTF-8'
  })

  const time = (+new Date() - startTime) / 1000

  const routes = Object.keys(ctx.debug.routes).sort((a, b) => ctx.debug.routes[b] - ctx.debug.routes[a])
  const hotRoutes = routes.slice(0, 10)
  let hotRoutesValue = ''
  hotRoutes.forEach(item => {
    hotRoutesValue += `${ctx.debug.routes[item]}&nbsp;&nbsp;${item}<br>`
  })

  const ips = Object.keys(ctx.debug.ips).sort((a, b) => ctx.debug.ips[b] - ctx.debug.ips[a])
  const hotIPs = ips.slice(0, 10)
  let hotIPsValue = ''
  hotIPs.forEach(item => {
    hotIPsValue += `${ctx.debug.ips[item]}&nbsp;&nbsp;${item}<br>`
  })

  ctx.body = art(path.resolve(__dirname, './views/welcome.art'), {
    debug: [
      {
        name: 'git hash',
        value: gitHash
      },
      {
        name: '请求数',
        value: ctx.debug.request
      },
      {
        name: '请求频率',
        value: (ctx.debug.request / time * 60).toFixed(3) + ' 次/分钟'
      },
      {
        name: '缓存命中率',
        value: ctx.debug.request ? (ctx.debug.hitCache / ctx.debug.request).toFixed(3) : 0
      },
      {
        name: '内存占用',
        value: process.memoryUsage().rss / 1000000 + ' MB'
      },
      {
        name: '运行时间',
        value: time + ' 秒'
      },
      {
        name: '热门路由',
        value: hotRoutesValue
      },
      {
        name: '热门IP',
        value: hotIPsValue
      }
    ]
  })
})

// // 妹子图
router.get('/mzitu', require('./routes/mzitu/category'))
router.get('/mzitu/tags', require('./routes/mzitu/tags'))
router.get('/mzitu/:page', require('./routes/mzitu/category'))
router.get('/mzitu/category/:category', require('./routes/mzitu/category'))
router.get('/mzitu/category/:category/:page', require('./routes/mzitu/category'))
router.get('/mzitu/post/:id', require('./routes/mzitu/post'))
router.get('/mzitu/tag/:tag', require('./routes/mzitu/tag'))
router.get('/mzitu/tag/:tag/:page', require('./routes/mzitu/tag'))
module.exports = router
