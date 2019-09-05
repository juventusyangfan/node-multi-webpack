/**
 * Created by yangfan on 2017/7/5.
 */
var webpack = require('webpack');
var pluginsConfig = require('./inherit/plugins.config.js');

/* webpack1下，用了压缩插件会导致所有loader添加min配置，而autoprefixser也被定格到某个browers配置 */
// pluginsConfig.push(new webpack.optimize.UglifyJsPlugin({
//     compress: {
//         warnings: false
//     }
// }));

pluginsConfig.push(new webpack.DefinePlugin({
    IS_PRODUCTION: true
}));

module.exports = pluginsConfig;