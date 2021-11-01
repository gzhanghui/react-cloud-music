const http = require('http');
const Koa = require('koa');
const Router = require('koa-router')
const onerror = require('koa-onerror')

const user = require('./apis/user')

const app = new Koa();
const router = new Router()
app.use(router.routes())
app.use(user.routes())

onerror(app)
console.log('koa')
const server = http.createServer(app.callback());
server.listen(3000);
server.on('listening', function(){
  console.log(`http://localhost:3000`)
});