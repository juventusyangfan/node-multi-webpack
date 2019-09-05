/**
 * Created by yangfan on 2017/7/4.
 */
var dirVars = require('./base/dir-vars.config.js');
module.exports = {
    path: dirVars.buildDir,
    publicPath: '/bidding/',//本地跑静态文件时使用'/'；打包发布线上时需加入项目文件夹名如：'/bidding/'
    filename: 'static/[name]/entry.js',
    chunkFilename: '[id].bundle.js'
};