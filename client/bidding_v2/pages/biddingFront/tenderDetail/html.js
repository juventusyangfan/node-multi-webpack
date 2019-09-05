/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const npPic = require('../../../public-resource/imgs/noPic.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {npPic});

module.exports = layout.init({
    pageTitle: '招标详情'
}).run(content(renderData));