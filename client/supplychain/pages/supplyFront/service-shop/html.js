const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const banner1 = require('./imgs/banner1.jpg');
const eq1 = require('./imgs/shopEq1.png');
const eq2 = require('./imgs/shopEq2.png');
const videoEq1 = require('./imgs/videoEq1.png');
const videoEq2 = require('./imgs/videoEq2.png');
const videoEq3 = require('./imgs/videoEq3.png');
const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {banner1,eq1,eq2,videoEq1,videoEq2,videoEq3});


module.exports = layout.init({
    pageTitle: '服务商详情页'
}).run(content(renderData));