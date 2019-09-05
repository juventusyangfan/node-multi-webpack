/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const ad = require('./imgs/ad.gif');
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '中标公示详情',
        links: ['中标公示']
    }
});
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {ad, backCrumbs});

module.exports = layout.init({
    pageTitle: '中标公示'
}).run(content(renderData));