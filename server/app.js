require('module-alias/register')
const path = require('path')
const chalk = require('chalk')

const Koa = require('koa')
const Router = require('koa-router')
const onerror = require('koa-onerror');
const static = require('koa-static')
const parser = require('koa-body')
const requireDirectory = require('require-directory')
const app = new Koa();
const router = new Router()

app.use(parser({ multipart: true }));

onerror(app, {
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
initLoadRouters()

app.use(static(path.join(__dirname, '../docs')))
app.listen(3000, '127.0.0.1', () => {
  console.log(chalk.green('server running at'), chalk.green(`http://localhost:3000`))
});



function initLoadRouters() {
  const apiDirectory = `${process.cwd()}/server/apis`
  requireDirectory(module, apiDirectory, {
    visit: whenLoadModule
  })
}

function whenLoadModule(obj) {
  if (obj instanceof Router) {
    app.use(obj.routes()).use(router.allowedMethods());
  }
}