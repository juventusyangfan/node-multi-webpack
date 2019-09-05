const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const list = require('../../../public-resource/components/list/html.ejs')({
    tableList: {
        widths: [50, 400],
        titles: ['序号', '上级单位名称'],
        contents: [['1', '湖北路桥集团有限公司'], ['2', '武汉市大建设市政集团有限公司'], ['3', '武汉市大建设市政集团有限公司']]
    }
});
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {list, pageNav});

module.exports = layout.init({
    pageTitle: '子账号管理',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-xiangmu'></i>企业项目库",
        dd: [{
            name: "新建项目",
            act: false
        }, {
            name: "企业项目库",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-daan'></i>企业招标",
        dd: [{
            name: "发布招标",
            act: false
        }, {
            name: "企业全部招标",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-ziyuan'></i>企业供应商资源库",
        dd: [{
            name: "我的供应商",
            act: false
        }, {
            name: "添加供应商",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-qiandai1'></i>收款管理",
        dd: [{
            name: "标书订单管理",
            act: false
        }, {
            name: "头部保证金订单管理",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-gerenziliao'></i>账户管理",
        dd: [{
            name: "企业信息管理",
            act: false
        }, {
            name: "个人信息管理",
            act: false
        }, {
            name: "子账号管理",
            act: true
        }]
    }],
    crumbsItem: {
        links: ["采购商中心"],
        textItem: "子账号管理"
    }
}).run(content(renderData));