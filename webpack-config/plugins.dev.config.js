/**
 * Created by yangfan on 2017/7/4.
 */
var webpack = require('webpack');
var pluginsConfig = require('./inherit/plugins.config.js');

pluginsConfig.push(new webpack.DefinePlugin({
    IS_PRODUCTION: false
}));

pluginsConfig.push(new webpack.LoaderOptionsPlugin({
    options: {
        devServer: require('./vendor/devServer.config.js')
    }
}));

module.exports = pluginsConfig;
