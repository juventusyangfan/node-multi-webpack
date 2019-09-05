/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片
const banner1 = require('./imgs/bg.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,banner1});

module.exports = layout.init({
    pageTitle: '招标公告'
}).run(content(renderData));