/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');
const otherTop = require('../../../public-resource/components/other-top_publish/html.ejs')();
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {otherTop});

module.exports = layout.init({
    pageTitle: '中标公示'
}).run(content(renderData));