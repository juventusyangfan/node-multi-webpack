/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav});

module.exports = layout.init({
    pageTitle: '独家招标'
}).run(content(renderData));