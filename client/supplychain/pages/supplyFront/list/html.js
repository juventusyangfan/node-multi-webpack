const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const listEq=require("./imgs/eq1.png");
const icon1=require("./imgs/icon.png");
const logo_small=require("../../../public-resource/imgs/logo_small.jpg");

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,listEq,icon1,logo_small});


module.exports = layout.init({
    pageTitle: '产品服务',
    topItems: [{
        name: "首页",
        act: false
    }, {
        name: "产品服务",
        act: true
    }, {
        name: "服务商",
        act: false
    }]
}).run(content(renderData));