/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片
const bigPic = require('./imgs/detailDemo.jpg');
const logo = require('./imgs/logoDemo.jpg');
const commentDemo = require('./imgs/commentDemo.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { pageNav, bigPic, logo, commentDemo });

module.exports = layout.init({
    pageTitle: '生材网-产品详情'
}).run(content(renderData));