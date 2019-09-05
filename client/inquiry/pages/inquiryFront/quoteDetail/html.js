const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '报价单详情'
}).run(content(renderData));