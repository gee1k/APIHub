const axios = require('../../utils/axios')
const cheerio = require('cheerio')
const config = require('../../config')

module.exports = async ctx => {
  const url = 'http://www.mzitu.com/zhuanti'

  const response = await axios({
    method: 'get',
    url: url,
    headers: {
      'User-Agent': config.ua,
      Referer: url
    }
  })

  const data = response.data
  const $ = cheerio.load(data)
  const list = $('.main-content > div.postlist > dl > dd')

  ctx.state.data = {
    title: $('title').text(),
    link: url,
    description: $('meta[name="description"]').attr('content') || $('title').text(),
    item:
      list &&
      list
        .map((item, index) => {
          item = $(index)
          const linkA = item.find('a')
          const previewImg = linkA.find('img')
          const link = linkA.attr('href')
          let tag = link.substring(link.lastIndexOf('tag/') + 4)
          if (tag && tag.endsWith('/')) {
            tag = tag.substring(0, tag.length - 1)
          }
          return {
            title: previewImg.attr('alt'),
            description: item.find('i').text(),
            image: previewImg.attr('src'),
            tag,
            link
          }
        })
        .get()
  }
}
