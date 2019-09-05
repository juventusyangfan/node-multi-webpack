/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');

//图片
const detailPic = require('./imgs/detailDemo.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { detailPic });

module.exports = layout.init({
    pageTitle: '生材网-订单确认'
}).run(content(renderData));