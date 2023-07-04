const Router = require("koa-router");
const ERROR_CODE = 200;
const { toplist } = require("NeteaseCloudMusicApi");
const get = require("lodash/get");
const router = new Router({
  prefix: "/toplist",
});

router.get("/", async (ctx, next) => {
  const res = await toplist({});
  const code = get(res, "body.code");

  if (code !== ERROR_CODE)
    ctx.throw({
      status: res.status,
      message: res.body.message,
      code,
    });
  ctx.body = {
    code: get(res, "body.code", []),
    data: get(res, "body", {}),
  };
  await next();
});

module.exports = router;
