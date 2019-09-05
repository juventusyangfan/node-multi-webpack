/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '供应商详情',
        links: ['找供应商']
    }
});
//图片
const companyLogo = require('./imgs/company_logo.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {backCrumbs,companyLogo});

module.exports = layout.init({
    pageTitle: '找供应商'
}).run(content(renderData));