/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const banner1 = require('./imgs/banner01.jpg');
const flow01 = require('./imgs/flow01.png');
const flow02 = require('./imgs/flow02.png');
const flow03 = require('./imgs/flow03.png');
const flow04 = require('./imgs/flow04.png');
const product01 = require('./imgs/product01.jpg');
const logo01 = require('./imgs/logo01.png');
const bank01 = require('./imgs/bank01.png');
const bank02 = require('./imgs/bank02.png');
const bank03 = require('./imgs/bank03.png');
const bank04 = require('./imgs/bank04.png');
const bank05 = require('./imgs/bank05.png');
const bank06 = require('./imgs/bank06.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {banner1,flow01,flow02,flow03,flow04,product01,logo01,bank01,bank02,bank03,bank04,bank05,bank06});

module.exports = layout.init({
    pageTitle: '首页',
    topItems: [{
        name: "首页",
        act: true
    }, {
        name: "产品服务",
        act: false
    }, {
        name: "服务商",
        act: false
    }]
}).run(content(renderData));