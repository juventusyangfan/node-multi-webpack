const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig);

module.exports = layout.init({
    pageTitle: '申请成为友商',
    topItems: [{
        name: "供应商中心",
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
    crumbsItem:{
        links:["供应商资源库"],
        textItem:"供应商准入"
    }
}).run(content(renderData));