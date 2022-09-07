const Router = require('koa-router')
const Joi = require('joi');
const axios = require('axios')
const moment = require('moment')
// import {get} from 'lodash'
const chalk = require('chalk')
const { login_cellphone, login } = require('NeteaseCloudMusicApi')
const router = new Router()

const log = console.log
router.post('/login', async (ctx, next) => {
    debugger

    // const p = {
    //     reqBody: {
    //       content:
    //         { usercode: '13893662020', password: 'wsy1234567', osversion: '10', phoneversion: 'OPPO FIND', lon: '103.779031', lat: '36.073702', address: '兰州市七里河区西津西路27号', netsource: '4', registrationid: '1a0018970a62b1b80b4', logintype: '2', logindate: moment().format('YYYY-MM-DD HH:mm:ss'), version: 'V1.1.3.1' }
    //     },
    //     reqHead: { optcode: 'userLogin' }
    //   }
    //   try {
    //     const res = await axios.post(
    //       'https://smp.tsingtao.com.cn/app-intfcxy//CxyComController/Api',
    //       p
    //     )
    //     console.log(res)
    //   } catch (error) {
    //       debugger
    //       console.log(error)
    //   }








    // const { account, password } = ctx.request.body
    // const isEmail = Joi.string().email().validate(account)
    // const isPhone = Joi.string().pattern(new RegExp('^[1][3,5,7,8][0-9]\\d{8}$')).validate(account)
    // const schema = Joi.object({
    //     account: [Joi.string().email().required(), Joi.string().pattern(new RegExp('^[1][3,5,7,8][0-9]\\d{8}$'))],
    //     password: Joi.string().required()
    // })
    // const { error } = schema.validate({ account, password })
    // if (error) {
    //     const msg = { message: error.message, code: 400 }
    //     ctx.throw(400, msg)
    // }
    // let result = {}
    // // 不是email登录
    // if (!isEmail.error) {
    //     result = await login({
    //         username: account,
    //         password
    //     })
    // } else if (!isPhone.error) {
    //     result = await login_cellphone({
    //         phone: account,
    //         password
    //     })
    // }
    // ctx.body = result
    // await next()
})
module.exports = router