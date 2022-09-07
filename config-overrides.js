const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');
const axios = require('axios');
const cheerio = require('cheerio');
const { override, useEslintRc, addLessLoader, fixBabelImports, addWebpackAlias } = require("customize-cra");

const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);

const useEslintConfig = configRules => config => {
  const updatedRules = config.module.rules.map(
    rule => {
      // Only target rules that have defined a `useEslintrc` parameter in their options
      if (rule.use && rule.use.some(use => use.options && use.options.useEslintrc !== void 0)) {
        const ruleUse = rule.use[0];
        const baseOptions = ruleUse.options;
        const baseConfig = baseOptions.baseConfig || {};
        const newOptions = {
          useEslintrc: false,
          ignore: true,
          baseConfig: { ...baseConfig, ...configRules }
        }
        ruleUse.options = newOptions;
        return rule;

        // Rule not using eslint. Do not modify.
      } else {
        return rule;
      }
    }
  );

  config.module.rules = updatedRules;
  return config;
};


module.exports = {
  webpack: override(
    useEslintConfig(require('./.eslintrc.js')),
    useEslintRc(),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: { '@primary-color': '#0BBD70' },
    }),
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: 'css',
    }),
    addWebpackAlias({ '@': resolve("src") })
  ),
  jest: function override(config) {
    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);

      config.proxy = {
        '/trending_search': {
          target: 'https://www.jianshu.com',
          secure: false,
          changeOrigin: true
        },
        '/users/recommended': {
          target: 'https://www.jianshu.com',
          secure: false,
          changeOrigin: true
        },
        '/api': {
          target: 'http://localhost:10010',
          secure: false,
          changeOrigin: true,
          pathRewrite: {
            '^/api': '',
          },
        }
      };

      config.before = function (app) {
        app.use(errorOverlayMiddleware());
        app.use(noopServiceWorkerMiddleware());
        app.get('/api/jianshu', function (req, res) {
          let url = 'https://www.jianshu.com';
          axios.get(url, {
            headers: {
              referer: 'https://www.jianshu.com/p/a52fb2cd7e8b',
              host: 'www.jianshu.com'
            },
            params: req.query
          }).then((response) => {
            let ret = response.data;
            let type = req.query.type;
            let data = {
              data: null,
              msg: 'success',
              code: 0
            };
            switch (type) {
              case 'carousel':
                data.data = carousel(ret);
                break;
              case 'notelist':
                data.data = notelist(ret);
                break;
              case 'recommend':
                data.data = recommend(ret);
                break;
              case 'board':
                data.data = board(ret);
                break;
              default:
                console.log()
            }
            res.json(data)
          }).catch((e) => {
            console.log(e)
          })
        });
        app.get('/api/article', function (req, res) {
          const url = 'https://www.jianshu.com/p/' + req.query.hash;
          console.log(url);
          axios.get(url, {
            headers: {
              referer: 'https://www.jianshu.com',
              host: 'www.jianshu.com'
            },
            params: req.query
          }).then((response) => {
            const ret = response.data;
            const data = {
              data: null,
              msg: 'success',
              code: 0
            };
            const $ = cheerio.load(ret);
            $('.image-view img').each(function (index, item) {
              $(item).attr('src', $(item).attr('data-original-src'))
            });
            const articleHtml = { 'content': $('.show-content').html() };
            const author = {
              'name': $('.author .info .name a').text(),
              'avatar': $('.avatar img').attr('src'),
              'info': $('.author .info .meta').html()
            };
            const title = { 'title': $('.article .title').text() };
            const target = Object.assign({}, title, author, articleHtml);
            data.data = target;
            res.json(data)
          }).catch((e) => {
            console.log(e)
          })
        });


        app.get('/api/login', function (req, res) {
          const url = 'http://api.okayapi.com';
          axios.get(url, {
            params: req.query
          }).then((response) => {
            const ret = response.data;
            res.json(ret)
          }).catch((e) => {
            console.log(e)
          })
        });


        app.post('/api/trending_notes', function (req, res) {
          const url = 'https://www.jianshu.com/trending_notes';
          axios.post(url, {
            headers: {
              referer: 'https://www.jianshu.com/?seen_snote_ids[]=31937987&seen_snote_ids[]=31504138&seen_snote_ids[]=33843166&seen_snote_ids[]=32723177&seen_snote_ids[]=34530940&seen_snote_ids[]=32002261&seen_snote_ids[]=34721128&seen_snote_ids[]=34766552&seen_snote_ids[]=31339881&seen_snote_ids[]=30923363&seen_snote_ids[]=32108842&seen_snote_ids[]=31375799&seen_snote_ids[]=32094745&seen_snote_ids[]=34819395&seen_snote_ids[]=34148953&seen_snote_ids[]=34702654&seen_snote_ids[]=32952446&seen_snote_ids[]=32277218&seen_snote_ids[]=30440154&seen_snote_ids[]=34944033&page=2',
              host: 'www.jianshu.com',
              accept: 'text/html, */*; q=0.01'
            },
            params: req.query
          }).then((response) => {
            console.log(response);
            const data = {
              data: response.data,
              msg: 'success',
              code: 0
            };
            res.json(data)
          }).catch((e) => {
            console.log(e)
          })
        });

      };
      return config;
    }
  }
};

function carousel(ret) {
  let $ = cheerio.load(ret);
  let slideData = [];
  let slide = $(".carousel-inner .item");
  slide.each(function () {
    let _this = $(this),
      o = {};
    o['banner'] = _this.children('.banner').attr('data-banner-name');
    o['url'] = _this.find('a').attr('href');
    o['img'] = _this.find('img').attr('src');
    slideData.push(o)
  });
  return slideData
}

function notelist(ret) {
  let $ = cheerio.load(ret);
  let notelistData = [];
  let notelist = $('.note-list li');
  notelist.each(function () {
    const o = {};
    let _this = $(this);
    o['id'] = _this.attr('data-note-id');
    o['hash'] = _this.find('.content .title').attr('href').replace('/p/', '');
    o['herf'] = _this.find('.wrap-img').attr('href');
    o['img'] = _this.find('img').attr('src');
    o['title'] = _this.find('.title').text();
    o['abstract'] = _this.find('.abstract').text();
    o['nickname'] = _this.find('.nickname').text();
    o['nickHerf'] = _this.find('.nickname').attr('href');
    o['nickNum'] = _this.find('.meta .iconfont').parent().text();
    o['collection'] = _this.find('.meta span').text();
    notelistData.push(o)
  });
  return notelistData
}

function recommend(ret) {
  let $ = cheerio.load(ret);
  let recommendData = [];

  let recommendlist = $('.recommend-collection .collection');
  recommendlist.each(function () {
    const o = {};
    let _this = $(this);
    o['href'] = _this.attr('href');
    o['src'] = _this.children('img').attr('src');
    o['name'] = _this.children('.name').text();
    recommendData.push(o)
  });
  return recommendData
}

function board(ret) {
  let $ = cheerio.load(ret);
  let boardList = [];

  let list = $('.board a');
  list.each(function () {
    const o = {};
    let _this = $(this);
    o['href'] = _this.attr('href');
    o['src'] = _this.children('img').attr('src');

    boardList.push(o)
  });
  return boardList
}


function entityToString(entity) {
  const entity1 = decodeURIComponent(entity.replace(/\\u/g, "%u"));
  entity = entity1.replace(/&#(x)?(\w+);/g, function ($, $1, $2) {
    return String.fromCharCode(parseInt($2, $1 ? 16 : 10));
  });
  return entity.replace(/[\r\n +]/g, "")
}


