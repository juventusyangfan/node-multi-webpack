const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片
const shopLogo = require('./imgs/shop.jpg');
const productImg = require('./imgs/product.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,shopLogo,productImg});

module.exports = layout.init({
    pageTitle: '找店铺'
}).run(content(renderData));