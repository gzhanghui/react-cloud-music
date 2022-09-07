const Router = require('koa-router')
const { banner } = require('NeteaseCloudMusicApi')
console.log(banner)
const router = new Router()
router.get('/banner', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const res = await banner()
    ctx.body = {
        code: res.body.code,
        data: res.body.banners
    }
    await next()
})


module.exports = router