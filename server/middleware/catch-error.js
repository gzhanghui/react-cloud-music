const { HttpException } = require('@root/exception')

const catchError = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        const isHttpException = error instanceof HttpException
        if (isHttpException) {
            ctx.body = {
                message: error.message,
                code: error.code,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = error.state
        }
        else {
            ctx.body = {
                message: 'we made a mistake O(∩_∩)O~~',
                status: 999,
                request: `${ctx.method} ${ctx.path}`
            }
            ctx.status = 500
        }
    }
}

module.exports = catchError