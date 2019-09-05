/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');

//图片
const logoDemo = require('./imgs/logoDemo.jpg');
const ylIcon = require('./imgs/ylIcon.jpg');
const wxIcon = require('./imgs/wxIcon.jpg');
const zfbIcon = require('./imgs/zfbIcon.jpg');
const qqIcon = require('./imgs/qqIcon.jpg');
const codeZH = require('./imgs/codeZH.jpg');
const codeZX = require('./imgs/codeZX.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { logoDemo, ylIcon, wxIcon, zfbIcon, qqIcon, codeZH, codeZX });

module.exports = layout.init({
    pageTitle: '生材网-订单成功',
    layType: "menu"
}).run(content(renderData));