/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav});

module.exports = layout.init({
    pageTitle: '产品管理',
    topItems: [{
        name: "企业中心",
        act: true
    }],
    sideItems: [{
        dt: "客户管理",
        dd: [{
            name: "产品申请记录",
            act: false
        }]
    }, {
        dt: "产品管理",
        dd: [{
            name: "新增产品",
            act: false
        }, {
            name: "产品管理",
            act: true
        }, {
            name: "广告位管理",
            act: false
        }, {
            name: "首页广告设置",
            act: false
        }]
    }, {
        dt: "机构信息",
        dd: [{
            name: "修改基本信息",
            act: false
        }, {
            name: "修改密码",
            act: false
        },]
    }],
    crumbsItem: {
        links: ["企业中心"],
        textItem: "产品管理"
    }
}).run(content(renderData));