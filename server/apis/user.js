/* eslint-disable no-unused-vars */
const Router = require("koa-router");
const { get } = require("lodash");
const dayjs = require("dayjs");
const { user_detail, user_account, user_subcount, user_playlist, likelist, user_record } = require("NeteaseCloudMusicApi");
const { getSongUrl, createSong, getSongDetail } = require("../common/song");
const router = new Router({
  prefix: "/user",
});

const cookie = `MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/api/feedback;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/neapi/feedback;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/weapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/weapi/feedback;;MUSIC_U=1558d3ca84273da075af0ae019d318deb5003a8283792c97e25195a053e6bbea519e07624a9f0053b41e9912da6738081e853fffdf0fd73752d51abb23158c524a96829840c5da507a561ba977ae766d; Max-Age=1296000; Expires=Mon, 21 Nov 2022 18:48:20 GMT; Path=/;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/openapi/clientlog;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/wapi/feedback;;MUSIC_SNS=; Max-Age=0; Expires=Sun, 06 Nov 2022 18:48:20 GMT; Path=/;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/api/clientlog;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/eapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/wapi/clientlog;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/neapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/wapi/feedback;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/api/feedback;;__csrf=5f85dd50ea15cbdf4d747a1a0d6d4a4d; Max-Age=1296010; Expires=Mon, 21 Nov 2022 18:48:30 GMT; Path=/;;__remember_me=true; Max-Age=1296000; Expires=Mon, 21 Nov 2022 18:48:20 GMT; Path=/;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/eapi/feedback;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/neapi/feedback;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/api/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/eapi/clientlog;;MUSIC_R_T=1523038572873; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/wapi/clientlog;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/weapi/feedback;;MUSIC_A_T=1523038533594; Max-Age=2147483647; Expires=Fri, 24 Nov 2090 22:02:27 GMT; Path=/eapi/feedback;`;

router.get("/detail", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const uid = ctx.query.uid;
  const result = await user_detail({ uid });

  if (result.body) {
    ctx.body = {
      data: result.body,
      cookie: result.cookie,
      code: result.status,
    };
  } else {
    ctx.body = result;
  }

  await next();
});

router.get("/playlist", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const uid = ctx.query.uid;
  const result = await user_playlist({ uid });

  if (result.body) {
    ctx.body = {
      data: result.body,
      cookie: result.cookie,
      code: result.status,
    };
  } else {
    ctx.body = result;
  }

  await next();
});

router.get("/likelist", async (ctx, next) => {
  const { uid, cookie, timestamp } = ctx.query;

  ctx.header["Content-Type"] = "application/json; charset=utf-8";

  const res = await likelist({
    uid,
    cookie,
  });

  const ids = get(res, "body.ids", []).join(",");
  const song = await getSongDetail(ids);
  const result = await getSongUrl(ids);

  const data = get(song, "songs", []).map((item) => {
    const current = get(result, "body.data", []).find((m) => m.id === item.id);
    return current
      ? createSong({
          name: item.name,
          id: item.id,
          artists: item.ar,
          album: item.al,
          duration: item.dt,
          image: item.al.picUrl,
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

router.get("/record", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const uid = ctx.query.uid;
  const type = ctx.query.type || 0;
  const result = await user_record({ uid, type });
  const songs = get(result, "body.allData");
  const ids = songs.map((item) => item.song.id);
  const res = await getSongUrl(ids);

  const data = songs.map((item) => {
    const song = item.song;
    const current = get(res, "body.data", []).find((m) => m.id === song.id);
    return current
      ? createSong({
          name: song.name,
          id: song.id,
          artists: song.ar,
          album: song.al,
          duration: song.dt,
          image: song.al.picUrl,
          url: current.url,
          playCount: item.playCount,
          score: item.score,
          alia: get(song, "alia", []).join(),
          publishTime: dayjs(song.publishTime).format("YYYY-MM-DD"),
          metadata: item,
        })
      : { ...song };
  });

  if (result.body) {
    ctx.body = {
      data,
      code: get(result, "body.code"),
    };
  } else {
    ctx.body = result;
  }
  await next();
});

router.get("/account", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const res = await user_account();
  ctx.body = {
    data: res.body.account,
    code: res.body.code,
  };
  await next();
});

router.get("/subcount", async (ctx, next) => {
  ctx.header["Content-Type"] = "application/json; charset=utf-8";
  const res = await user_subcount({ cookie });
  ctx.body = {
    data: res.body,
    code: res.body.code,
  };
  await next();
});

module.exports = router;
