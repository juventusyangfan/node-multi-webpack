/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const picError = require('../../../public-resource/imgs/error.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {picError});

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));