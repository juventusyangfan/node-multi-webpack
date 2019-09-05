/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

//图片
const showDemo = require('./imgs/showDemo.jpg');
const proDemo = require('./imgs/productDemo.jpg');
const companyDemo = require('./imgs/companyDemo.jpg');
const logo = require('./imgs/logo.jpg');
const banner1 = require('./imgs/banner/banner1.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { showDemo, proDemo, companyDemo, logo, banner1 });

module.exports = layout.init({
    pageTitle: '生材网-店铺首页',
    layType: "shop"
}).run(content(renderData));