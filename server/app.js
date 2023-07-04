
const path = require('path')
const chalk = require('chalk')
const koaStatic = require('koa-static')
const parser = require('koa-body')
const Koa = require('koa')
const InitManager = require('./init')

const app = new Koa();

app.use(parser({ multipart: true }));
app.use(koaStatic(path.join(__dirname, './docs')))


InitManager.init(app)


app.listen(10010, '127.0.0.1', () => {
  console.log(chalk.green('server running at'), chalk.green(`http://localhost:10010`))
});


