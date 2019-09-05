const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '询价单管理',
    topItems: [{
        name: "我的订单",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-ziyuan'></i>询价单管理",
        dd: [{
            name: "发布询价单",
            act: false
        },{
            name: "询价单管理",
            act: true
        }]
    },{
        dt: "<i class='iconfont icon-jiaoyi'></i>交易管理",
        dd: [{
            name: "订单管理-担保交易",
            act: false
        }]
    }],
    crumbsItem: {
        links: ["商家中心"],
        textItem: "商品仓库"
    }
}).run(content(renderData));