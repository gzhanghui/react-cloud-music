const axios = require('axios')
const Router = require('koa-router')
const router = new Router({
    prefix:'/user'
})

router.get('/banner', async (ctx, next) => {
    ctx.header['Content-Type'] = 'application/json; charset=utf-8'
    const data = await axios.get(`http://120.55.54.183:4000/banner`)
    ctx.body = data.data
    console.log(data.data)
    await next()
})
module.exports = router