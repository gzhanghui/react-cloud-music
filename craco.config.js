const CracoLessPlugin = require('craco-less');
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {
                            '@primary-color': '#00cc4c',
                            // '@text-color': 'hsla(0,0%,100%,.6)',
                            '@text-color-secondary': 'hsla(0,0%,100%,.4)',
                            '@text-color-title': 'hsla(0,0%,100%,.92)',
                            '@text-color-highlight': '#FFFFFF',
                            // '@component-background': '#191a20',
                            '@background-opacity':'rgba(18,19,24,.9)',
                            '@border-color':'rgba(24,25,30,.04)',
                            '@color-0-3':'hsla(0,0%,100%,.03)',
                            '@color-1-2':'hsla(0,0%,100%,.12)',
                            '@color-2-5':'hsla(0,0%,100%,.25)',
                            '@color-3':'hsla(0,0%,100%,.3)',
                            // '@color-4':'hsla(0,0%,100%,.4)',#bdb9b9
                            '@color-4':'#bdb9b9',
                            '@color-5':'hsla(0,0%,100%,.5)',
                            '@color-6':'hsla(0,0%,100%,.6)',
                            '@color-7':'hsla(0,0%,100%,.7)'
                        },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    devServer: {
        port: 8080,
        proxy: {
            '/api': {
                target: 'http://120.55.54.183:4000',
                changeOrigin: true,
                ws: false,
                pathRewrite: {
                    '^/api': '',
                },
                secure: false,
            },
        }
    },
    webpack: {
        alias: {
            '@': resolve("src"),
            'components': resolve("src/components"),
            'pages': resolve("src/pages"),
            'common': resolve("src/common"),
            'apis': resolve("src/apis"),
        }

    }
};
