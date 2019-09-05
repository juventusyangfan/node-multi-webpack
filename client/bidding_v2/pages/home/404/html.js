/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const pic404 = require('../../../public-resource/imgs/404.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pic404});

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));