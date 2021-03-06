/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');
const otherTop = require('../../../public-resource/components/other-top_buyer/html.ejs')({
    timeShow: false,
    title: '结果公示中'
});
//图片

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {otherTop});

module.exports = layout.init({
    pageTitle: '中标公示'
}).run(content(renderData));