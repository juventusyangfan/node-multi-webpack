/**
 * Created by yangfan on 2018/8/10.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '用户反馈 '
}).run(content(renderData));