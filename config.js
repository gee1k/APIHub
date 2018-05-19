module.exports = {
  port: process.env.PORT || 1200, // 监听端口
  cacheType: process.env.CACHE_TYPE || 'memory', // 缓存类型，支持 'memory' 和 'redis'，设为空可以禁止缓存
  cacheExpire: process.env.CACHE_EXPIRE || 5 * 60, // 缓存时间，单位为秒
  ua:
    process.env.UA ||
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.181 Safari/537.36',
  listenInaddrAny: process.env.LISTEN_INADDR_ANY || 1, // 是否允许公网连接，取值 0 1
  requestRetry: process.env.REQUEST_RETRY || 2, // 请求失败重试次数
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379/',
    options: {
      // 支持这些参数 https://github.com/NodeRedis/node_redis#options-object-properties
      password: process.env.REDIS_PASSWORD || null
    }
  }
}
