/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片
const proDemo = require('./imgs/productDemo.jpg');
const logo = require('./imgs/logo.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { pageNav, proDemo, logo });

module.exports = layout.init({
    pageTitle: '生材网-产品列表',
    layType: "shop"
}).run(content(renderData));