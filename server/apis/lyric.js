const Router = require('koa-router')
const Lyric = require('../libs/lyric-parser')
const { getLyric } = require('../common/song')
const router = new Router()
router.get('/lyric', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const res = await getLyric(ctx.query.id)
    const lyric = new Lyric(res.lrc.lyric)
    ctx.body = {
        code: res.code,
        data: lyric
    }
    await next()
})


module.exports = router