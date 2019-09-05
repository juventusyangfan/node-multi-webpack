/**
 * Created by yangfan on 2017/7/5.
 */
const config = require('configModule');
const layout = require('./html.ejs'); // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('../../components/header/html.ejs');
const footer = require('../../components/footer/html.ejs');
const topNav = require('../../components/top-nav/html.ejs');
const topMenu = require('../../components/top-menu-back/html.ejs');
const sideMenu = require('../../components/side-menu/html.ejs');
const backCrumbs = require('../../components/back-crumbs/html.ejs');
const bottomFooter = require('../../components/bottom-footer/html.ejs');

const qrcode = require("../../imgs/logo/qrcode_app.jpg");

/* 整理渲染公共部分所用到的模板变量 */
const pf = {
    pageTitle: '生材网',
    topItems: [{
        name: "采购中心",
        act: true
    }],
    sideItems: [{
        dt: "企业项目库",
        dd: [{
            name: "新建项目",
            act: true
        }, {
            name: "企业项目库",
            act: false
        }]
    }, {
        dt: "企业招标",
        dd: [{
            name: "发布招标",
            act: false
        }, {
            name: "企业全部招标",
            act: false
        }]
    }, {
        dt: "企业供应商资源库",
        dd: [{
            name: "我的供应商",
            act: false
        }, {
            name: "添加供应商",
            act: false
        },]
    }, {
        dt: "收款管理",
        dd: [{
            name: "标书订单管理",
            act: false
        }, {
            name: "头部保证金订单管理",
            act: false
        },]
    }, {
        dt: "账户管理",
        dd: [{
            name: "企业信息管理",
            act: false
        }, {
            name: "个人信息管理",
            act: false
        },]
    }],
    crumbsItem: {
        links: ["采购中心"],
        textItem: "新建项目"
    },
    qrcode: qrcode
};

const moduleExports = {
    /* 处理各个页面传入而又需要在公共区域用到的参数 */
    init({pageTitle, topItems, sideItems, crumbsItem}) {
        pf.pageTitle = pageTitle;
        pf.topItems = topItems;
        pf.sideItems = sideItems;
        pf.crumbsItem = crumbsItem;
        return this;
    },

    /* 整合各公共组件和页面实际内容，最后生成完整的HTML文档 */
    run(content) {
        const componentRenderData = Object.assign({}, config, pf); // 页头组件需要加载css/js等，因此需要比较多的变量
        const renderData = {
            header: header(componentRenderData),
            footer: footer(componentRenderData),
            topNav: topNav(componentRenderData),
            topMenu: topMenu(componentRenderData),
            sideMenu: sideMenu(componentRenderData),
            backCrumbs: backCrumbs(componentRenderData),
            bottomFooter: bottomFooter(componentRenderData),
            content
        };
        return layout(renderData);
    }
};

module.exports = moduleExports;