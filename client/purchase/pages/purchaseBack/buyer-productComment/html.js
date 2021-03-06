const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const detailPic = require('./imgs/detailDemo.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { detailPic });

module.exports = layout.init({
    pageTitle: '我的订单',
    topItems: [{
        name: "我的订单",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-jiaoyi'></i>交易管理",
        dd: [{
            name: "订单管理",
            act: true
        }]
    }],
    crumbsItem: {
        links: ["商家中心"],
        textItem: "商品仓库"
    }
}).run(content(renderData));