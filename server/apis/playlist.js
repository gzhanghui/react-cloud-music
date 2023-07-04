const Router = require("koa-router");
const ERROR_CODE = 200;
const { top_playlist, playlist_catlist, playlist_hot, playlist_highquality_tags, playlist_detail } = require("NeteaseCloudMusicApi");
const get = require("lodash/get");
const router = new Router({
  prefix: "/playlist",
});

/**
 *  分类歌单
 */
router.get("/list", async (ctx, next) => {
  const { cat = "全部", order = "hot", limit = 50, offset = 0, total = true } = ctx.query;
  //cat  全部,华语,欧美,日语,韩语,粤语,小语种,流行,摇滚,民谣,电子,舞曲,说唱,轻音乐,爵士,乡村,R&B/Soul,古典,民族,英伦,金属,朋克,蓝调,雷鬼,世界音乐,拉丁,另类/独立,New Age,古风,后摇,Bossa Nova,清晨,夜晚,学习,工作,午休,下午茶,地铁,驾车,运动,旅行,散步,酒吧,怀旧,清新,浪漫,性感,伤感,治愈,放松,孤独,感动,兴奋,快乐,安静,思念,影视原声,ACG,儿童,校园,游戏,70后,80后,90后,网络歌曲,KTV,经典,翻唱,吉他,钢琴,器乐,榜单,00后
  //order,  hot,new
  const res = await top_playlist({ cat, order, limit, offset, total });
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

/**
 * 全部歌单分类
 */
router.get("/catalogue", async (ctx, next) => {
  const res = await playlist_catlist({});
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

/**
 * 精品歌单 tags
 */
router.get("/highQuality/tags", async (ctx, next) => {
  const res = await playlist_highquality_tags({});
  const code = get(res, "body.code");

  if (code !== ERROR_CODE)
    ctx.throw({
      status: res.status,
      message: res.body.message,
      code,
    });
  ctx.body = {
    code: get(res, "body.code", []),
    data: get(res, "body.tags", []),
  };
  await next();
});
/**
 * 热门歌单 标签
 */
router.get("/hotTags", async (ctx, next) => {
  const res = await playlist_hot({});
  const code = get(res, "body.code");

  if (code !== ERROR_CODE)
    ctx.throw({
      status: res.status,
      message: res.body.message,
      code,
    });
  ctx.body = {
    code: get(res, "body.code", []),
    data: get(res, "body.tags", []),
  };
  await next();
});

router.get("/detail", async (ctx, next) => {
  const res = await playlist_detail({ id: ctx.query.id });
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
