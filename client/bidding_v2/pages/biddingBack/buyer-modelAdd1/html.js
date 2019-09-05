const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig);

module.exports = layout.init({
    pageTitle: '供应商中心首页',
    topItems: [{
        name: "供应商中心",
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
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-mobanku'></i>评价模板库",
        dd: [{
            name: "供应商评价模板库",
            act: true
        }, {
            name: "在线评标模板库",
            act: false
        }]
    }],
    crumbsItem:{
        links:["供应商中心"],
        textItem:"首页"
    }
}).run(content(renderData));