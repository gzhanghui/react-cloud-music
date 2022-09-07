const Router = require('koa-router')
const { get } = require('lodash')
const { personalized, personalized_newsong } = require('NeteaseCloudMusicApi')
const { getSongUrl, createSong, getLyric } = require('../common/song')
const router = new Router({
    prefix: '/personalized'
})

router.get('/songList', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const res = await personalized()
    ctx.body = {
        data: res.body.result,
        code: res.body.code
    }
    await next()
})

router.get('/songs', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const res = await personalized_newsong()
    let ids = res.body.result.map(item => item.id)
    ids = ids.join(',')
    const result = await getSongUrl(ids)
    const data = res.body.result.map(item => {
        const { song } = item
        const current = get(result, 'body.data').find(m => m.id === song.id)
        return current ? createSong({
            name: item.name, id: item.id, artists: song.artists,
            album: song.album, duration: song.duration, image: item.picUrl,
            url: current.url, metadata: item
        }) : { ...item }
    })
    ctx.body = {
        code: 0,
        data
    }
    await next()
})







module.exports = router