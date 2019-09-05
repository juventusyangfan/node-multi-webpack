const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const demo1 = require('./imgs/upload_demo.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {demo1});

module.exports = layout.init({
    pageTitle: '商家中心 - 商品发布',
    topItems: [{
        name: "我的订单",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-shangpin'></i>商品管理",
        dd: [{
            name: "商品发布",
            act: true
        }, {
            name: "商品仓库",
            act: false
        }, {
            name: "仓库管理",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-jiaoyi'></i>交易管理",
        dd: [{
            name: "订单管理",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-dianpu'></i>店铺管理",
        dd: [{
            name: "公司信息",
            act: false
        }, {
            name: "店铺管理",
            act: false
        }]
    }],
    crumbsItem: {
        links: ["商家中心"],
        textItem: "商品仓库"
    }
}).run(content(renderData));