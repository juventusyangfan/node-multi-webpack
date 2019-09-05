/**
 * Created by yangfan on 2017/7/5.
 */
module.exports = {
    entry: require('./webpack-config/entry.config.js'),

    output: require('./webpack-config/output.config.js'),

    module: require('./webpack-config/module.product.config.js'),

    resolve: require('./webpack-config/resolve.config.js'),

    plugins: require('./webpack-config/plugins.product.config.js'),

    externals: require('./webpack-config/externals.config.js'),

    node: {
        fs: "empty"
    }
};