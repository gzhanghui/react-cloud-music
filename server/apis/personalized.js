const Router = require("koa-router");
const { get } = require("lodash");
const { personalized, personalized_newsong, album_newest } = require("NeteaseCloudMusicApi");
const { getSongUrl, createSong } = require("../common/song");
const router = new Router({
  prefix: "/personalized",
});
const ERROR_CODE = 200;

router.get("/playlist", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const res = await personalized();
  ctx.body = {
    data: res.body.result,
    code: res.body.code,
  };
  await next();
});

router.get("/newsong", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const res = await personalized_newsong();
  let ids = res.body.result.map((item) => item.id);
  ids = ids.join(",");
  const result = await getSongUrl(ids);
  const data = res.body.result.map((item) => {
    const { song } = item;
    const current = get(result, "body.data").find((m) => m.id === song.id);
    return current
      ? createSong({
          name: item.name,
          id: item.id,
          artists: song.artists,
          album: song.album,
          duration: song.duration,
          image: item.picUrl,
          url: current.url,
          metadata: item,
        })
      : { ...item };
  });
  ctx.body = {
    code: 0,
    data,
  };
  await next();
});

router.get("/new/album", async (ctx, next) => {
  const res = await album_newest({});
  const code = get(res, "body.code");

  if (code !== ERROR_CODE)
    ctx.throw({
      status: res.status,
      message: res.body.message,
      code,
    });
  ctx.body = {
    code: get(res, "body.code", []),
    data: get(res, "body.albums", []),
  };
  await next();
});

module.exports = router;
