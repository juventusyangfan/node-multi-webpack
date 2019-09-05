/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '三方招标详情',
        links: ['三方招标']
    }
});
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {backCrumbs});

module.exports = layout.init({
    pageTitle: '三方招标'
}).run(content(renderData));