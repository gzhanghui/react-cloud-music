const Router = require('koa-router')
const router = new Router()


router.prefix('/user')

router.get('/login', async (ctx, next) => {
    ctx.body = 'this is a users response!'
    await next()
})
module.exports = router