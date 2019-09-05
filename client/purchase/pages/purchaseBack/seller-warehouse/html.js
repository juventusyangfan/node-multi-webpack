const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav});

module.exports = layout.init({
    pageTitle: '仓库管理',
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
            act: false
        },{
            name: "仓库管理",
            act: true
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
        links:["供应商中心"],
        textItem:"子账号管理"
    }
}).run(content(renderData));