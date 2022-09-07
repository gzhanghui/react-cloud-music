require('module-alias/register')
const onerror = require('koa-onerror');
const requireDirectory = require('require-directory')
const Router = require('koa-router')


class InitManager {
    static init(app) {
        InitManager.app = app
        InitManager.onHttpException()
        InitManager.loadRouters()
    }


    static loadRouters() {
        const apiDirectory = `${process.cwd()}/server/apis`
        requireDirectory(module, apiDirectory, {
            visit: whenLoadModule
        })

        function whenLoadModule(obj) {
            if (obj instanceof Router) {
                InitManager.app.use(obj.routes())
            }
        }
    }

    static onHttpException() {
        onerror(InitManager.app, {
            accepts() {
                return 'json'
            },
            json: (err, ctx) => {
                console.log(err)
                ctx.body = {
                    message: err.message,
                    code: err.code,
                    status: err.status
                };
            },
        });
    }
}

module.exports = InitManager