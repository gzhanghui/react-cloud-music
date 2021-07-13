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
                            '@primary-color': '#20BF76',
                            '@black': '#05030D',
                            '@text-color': '#81858B',
                            '@text-color-highlight': '#FFFFFF',
                            '@component-background': 'transparent',
                            '@background-color-light': 'rgba(0,0,0,0.18)'
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
            'store': resolve("src/store"),
            'common': resolve("src/common"),
            'apis': resolve("src/apis"),
        }

    }
};