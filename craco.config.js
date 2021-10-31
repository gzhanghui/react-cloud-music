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
                            '@white':'#FFFFFF',
                            '@transparent': 'transparent',
                            '@primary-color': '#00cc4c',
                            '@text-color': 'hsla(0,0%,100%,.6)',
                            '@text-color-title': 'hsla(0,0%,100%,.92)',
                            '@text-color-secondary': 'hsla(0,0%,100%,.4)',
                            '@text-color-highlight': '#FFFFFF',
                            '@component-background': 'rgba(25,26,32,1)',
                            '@border-color': 'rgba(24,25,30,.04)',
                            '@input-border-color': 'rgba(216,216,216,.4)',
                            '@input-bg':'@transparent',
                            '@layout-body-background': '@transparent',
                            '@layout-header-background':'@transparent',
                            '@table-bg': '@transparent',
                            '@table-header-bg': 'rgba(0, 0, 0,0.3)',
                            '@table-header-color': '@text-color-title',
                            '@table-border-color': '@transparent',
                            '@table-row-hover-bg': 'hsla(0,0%,100%,0.03)',
                            '@slider-handle-size': '8px',
                            '@slider-dot-border-color':'#D8D8D8',
                            '@slider-dot-border-color-active': '@white',
                            '@slider-disabled-color': '@white',
                            '@slider-handle-border-width': '2px',
                            '@slider-rail-background-color': '#55585F',
                            '@slider-rail-background-color-hover': '#676B74',
                            '@slider-track-background-color':'@white',
                            '@slider-track-background-color-hover':'@white',
                            '@card-head-color': '@transparent',
                            '@card-background': '@transparent',
                            '@card-head-padding': '24px',
                            '@progress-loaded':'#BFBFBF',
                            '@list-hover': 'hsla(0,0%,100%,0.03)',
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
