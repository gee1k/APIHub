const axios = require('../../utils/axios')
const cheerio = require('cheerio')
const config = require('../../config')

module.exports = async ctx => {
  const id = ctx.params.id

  const url = `http://www.mzitu.com/${id}`

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

  const img = $('.main-image > p > a > img')
  const imgUrl = img.attr('src')

  const prefix = imgUrl.substr(0, imgUrl.lastIndexOf('01.'))
  const suffix = imgUrl.substr(imgUrl.lastIndexOf('.'))

  let totalPage = $('.pagenavi > a:nth-last-child(2)')
    .find('span')
    .text()
  totalPage = +totalPage

  const list = [
    {
      url,
      imgUrl,
      page: 1
    }
  ]
  for (let i = 2; i <= totalPage; i++) {
    const p = i < 10 ? `0${i}` : i
    const nextImgUrl = `${prefix}${p}${suffix}`
    const nextUrl = `${url}/${i}`
    list.push({
      url: nextUrl,
      imgUrl: nextImgUrl,
      page: i
    })
  }

  const title = $('title').text()

  ctx.state.data = {
    title: title,
    link: url,
    total: totalPage,
    description: $('meta[name="description"]').attr('content') || title,
    item:
      list &&
      list.map(item => {
        let dateStr = $('.main-meta > span:nth-child(2)').text()
        dateStr = dateStr.replace(/发布于[\s*]?/, '')

        const category = $('.main-meta > span:nth-child(1) > a')

        return {
          title: `${title}（${item.page}）`,
          category: category.text(),
          image: item.imgUrl,
          date: dateStr,
          link: item.url
        }
      })
  }
}
