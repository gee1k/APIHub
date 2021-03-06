const axios = require('../../utils/axios')
const cheerio = require('cheerio')
const config = require('../../config')

module.exports = async ctx => {
  let category = ctx.params.category
  const page = ctx.params.page

  category = category === undefined || category === 'undefined' ? '' : category
  const pageUrl = page === undefined || page === 'undefined' ? '' : `/page/${page}`

  const url = `http://www.mzitu.com/${category}${pageUrl}`

  console.log('fetch --> ', url)

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
  const list = $('#pins li')

  ctx.state.data = {
    title: $('title').text(),
    link: url,
    page: page ? +page : undefined,
    description: $('meta[name="description"]').attr('content') || $('title').text(),
    item:
      list &&
      list
        .map((item, index) => {
          item = $(index)
          const linkA = item.find('a')
          const previewImg = linkA.find('img')
          const link = linkA.attr('href')
          let postId = link.substring(link.lastIndexOf('/') + 1)
          if (postId && postId.endsWith('/')) {
            postId = postId.substring(0, postId.length - 1)
          }
          return {
            postId,
            title: previewImg.attr('alt'),
            image: previewImg.data('original'),
            date: item.find('.time').text(),
            link
          }
        })
        .get()
  }
}
