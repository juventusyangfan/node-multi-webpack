/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');

//图片
const logoDemo = require('./imgs/logoDemo.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { logoDemo });

module.exports = layout.init({
    pageTitle: '生材网-订单成功',
    layType: "menu"
}).run(content(renderData));