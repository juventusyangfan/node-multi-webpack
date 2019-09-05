const config = require('configModule');
const content = require('./content.ejs');
const layoutOther = require('layoutOther');
//图片
const goods01 = require('./imgs/goods01.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {goods01});

module.exports = layoutOther.init({
    pageTitle: '购物车'
}).run(content(renderData));