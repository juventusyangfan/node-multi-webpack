const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '企业供应商',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-ziyuan'></i>供应商资源库",
        dd: [{
            name: "我的供应商",
            act: false
        }, {
            name: "供应商准入",
            act: false
        }, {
            name: "供应商评价",
            act: true
        }]
    }],
    crumbsItem: {
        links: ["采购商中心"],
        textItem: "企业供应商"
    }
}).run(content(renderData));