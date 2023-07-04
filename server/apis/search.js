const Router = require("koa-router");

const chalk = require("chalk");
const { search_hot, search_suggest } = require("NeteaseCloudMusicApi");
const get = require("lodash/get");
const router = new Router({
  prefix: "/search",
});
const log = console.log;

log(chalk.green("search"));
router.get("/hot", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const res = await search_hot();
  ctx.body = {
    code: get(res, "body.code", []),
    data: get(res, "body.result.hots", []),
  };
  await next();
});

router.post("/suggest", async (ctx, next) => {
  const { keywords } = ctx.request.body;
  const res = await search_suggest({ keywords });
  ctx.body = {
    code: res.body.code,
    data: get(res, "body.result", []),
  };
  await next();
});

module.exports = router;
