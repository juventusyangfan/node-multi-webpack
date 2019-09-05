/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '详情',
        links: ['生材网头条']
    }
});
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {backCrumbs});

module.exports = layout.init({
    pageTitle: '头条详情'
}).run(content(renderData));