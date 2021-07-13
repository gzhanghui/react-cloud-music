'use strict'
const path = require("path");
const resolve = dir => path.resolve(__dirname, dir);
module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': resolve("src"),
            'components': resolve("src/components"),
            'pages': resolve("src/pages"),
            'store': resolve("src/store"),
            'common': resolve("src/common"),
            'apis': resolve("src/apis"),
        }
    }
}
