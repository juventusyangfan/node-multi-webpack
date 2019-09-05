const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '发布报价单'
}).run(content(renderData));