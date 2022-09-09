const Router = require('koa-router')
const Lyric = require('../libs/lyric-parser')
const { get } = require('lodash')
const { getLyric } = require('../common/song')
const router = new Router()
router.get('/lyric', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const res = await getLyric(ctx.query.id)
    console.log(ctx.query.id)
    const lyric = new Lyric(get(res, 'lrc.lyric'))
    ctx.body = {
        code: res.code,
        data: lyric.lines
    }
    await next()
})


module.exports = router