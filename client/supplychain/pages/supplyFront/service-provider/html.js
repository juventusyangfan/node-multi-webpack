/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const provider01 = require('./imgs/provider01.jpg');
const bank01 = require('./imgs/bank01.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,provider01,bank01});

module.exports = layout.init({
    pageTitle: '服务商',
    topItems: [{
        name: "首页",
        act: false
    }, {
        name: "产品服务",
        act: false
    }, {
        name: "服务商",
        act: true
    }]
}).run(content(renderData));