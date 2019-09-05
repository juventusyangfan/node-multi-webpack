const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const kefuApp = require('./../../../public-resource/imgs/logo/qrcode_app.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { kefuApp });

module.exports = layout.init({
    pageTitle: '快捷询价'
}).run(content(renderData));