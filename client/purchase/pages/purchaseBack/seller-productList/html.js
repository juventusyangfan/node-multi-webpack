const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { pageNav});

module.exports = layout.init({
    pageTitle: '管理我发布的商品',
    topItems: [{
        name: "供应商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-toubiao'></i>商品管理",
        dd: [{
            name: "商品发布",
            act: false
        }, {
            name: "商品仓库",
            act: true
        },{
            name: "仓库管理",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-gerenziliao'></i>交易管理",
        dd: [{
            name: "订单管理",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-youshang'></i>店铺管理",
        dd: [{
            name: "公司信息",
            act: false
        }, {
            name: "店铺管理",
            act: false
        }]
    }],
    crumbsItem:{
        links:["商家中心"],
        textItem:"商品仓库"
    }
}).run(content(renderData));