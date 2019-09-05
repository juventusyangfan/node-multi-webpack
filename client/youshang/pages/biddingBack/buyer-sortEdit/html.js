const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const npPic = require('../../../public-resource/imgs/noPic.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {npPic});

module.exports = layout.init({
    pageTitle: '个人信息管理',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-ziyuan'></i>供应商资源库",
        dd: [{
            name: "我的供应商",
            act: true
        }, {
            name: "供应商准入",
            act: false
        }, {
            name: "供应商评价",
            act: false
        }]
    }],
    crumbsItem: {
        links: ["采购商中心"],
        textItem: "个人信息管理"
    }
}).run(content(renderData));