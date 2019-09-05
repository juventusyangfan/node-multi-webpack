const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const logo = require('./imgs/logo.jpg');
const photo01 = require('./imgs/shili.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {logo,photo01});

module.exports = layout.init({
    pageTitle: '店铺 - 简介',
    layType: "shop"
}).run(content(renderData));