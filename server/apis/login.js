const Router = require("koa-router");
const Joi = require("joi");
const chalk = require("chalk");
const { get, isEmpty } = require("lodash");
const { login_cellphone, login, login_status, logout } = require("NeteaseCloudMusicApi");

const router = new Router({
  prefix: "/login",
});
const log = console.log;

log(chalk.green("login"));

/**
 * 获取登录状态
 */
router.post("/status", async (ctx, next) => {
  const { cookie, timestamp } = ctx.request.body;

  let result = await login_status({ cookie, timestamp });
  const account = get(result, "body.data.account");
  const profile = get(result, "body.data.profile");
  if (result.body) {
    ctx.body = {
      data: {
        status: get(result, "body.data.code") === 200 && !isEmpty(account) && !isEmpty(profile),
        info: {
          account,
          profile,
        },
        cookie,
      },
      code: result.status,
    };
  } else {
    ctx.body = result;
  }
  //&& !isEmpty(result.cookie)
  console.log(isEmpty(""));
  await next();
});

/**
 * 电话号登录
 */
router.post("/phone", async (ctx, next) => {
  const { account, password } = ctx.request.body;
  const schema = Joi.object({
    account: Joi.string().pattern(new RegExp("^[1][3,5,7,8][0-9]\\d{8}$")),
    password: Joi.string().required(),
  });
  const { error } = schema.validate({ account, password });
  if (error) {
    const msg = { message: error.message, code: 400 };
    ctx.throw(400, msg);
  }
  const result = await login_cellphone({
    phone: account,
    password,
  });
  if (result.body) {
    ctx.body = {
      // data: {
      //   loginType: result.body.loginType,
      //   token: result.body.token,
      //   cookie: result.body.cookie,
      //   id: result.body.account.id,
      //   userId: result.body.profile.userId,
      //   userType: result.body.profile.userType,
      //   userName: result.body.account.userName,
      //   nickname: result.body.profile.nickname,
      //   avatar: result.body.profile.avatarUrl,
      //   background: result.body.profile.backgroundUrl,
      //   birthday: result.body.profile.birthday,
      //   city: result.body.profile.city,
      //   signature: result.body.profile.signature,
      //   vipType: result.body.profile.vipType,
      // },
      data: {
        info: {
          ...get(result, "body", {}),
          profile: get(result, "body.profile"),
          account: get(result, "body.account"),
        },
        cookie: result.cookie,
      },
      code: result.status,
    };
  } else {
    ctx.body = result;
  }

  await next();
});
/**
 * 邮箱登录
 */
router.post("/email", async (ctx, next) => {
  const { email, password } = ctx.request.body;
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const { error } = schema.validate({ email, password });
  if (error) {
    const msg = { message: error.message, code: 400 };
    ctx.throw(400, msg);
  }
  let result = await login({
    email,
    password,
  });

  if (result.body) {
    ctx.body = {
      data: result.body.data,
      cookie: result.cookie,
      status: result.status,
    };
  } else {
    ctx.body = result;
  }

  await next();
});
/**
 * 退出登录
 */
router.post("/logout", async (ctx, next) => {
  let result = await logout();
  ctx.body = {
    code: get(result, "body.code"),
    cookie: get(result, "cookie", []),
    data: {
      status: get(result, "body.code") === 200,
    },
  };

  await next();
});

module.exports = router;
