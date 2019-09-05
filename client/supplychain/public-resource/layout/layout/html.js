/**
 * Created by yangfan on 2017/7/5.
 */
const config = require('configModule');
const layout = require('./html.ejs'); // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('../../components/header/html.ejs');
const footer = require('../../components/footer/html.ejs');
const topNav = require('../../components/top-nav/html.ejs');
const topMenu = require('../../components/top-menu/html.ejs');
const bottomFooter = require('../../components/bottom-footer/html.ejs');
const qrcode = require("../../imgs/logo/qrcode_app.jpg");

/* 整理渲染公共部分所用到的模板变量 */
const pf = {
    pageTitle: '生材网',
    topItems: [{
        name: "首页",
        act: true
    }, {
        name: "产品服务",
        act: false
    }, {
        name: "服务商",
        act: false
    }],
    qrcode: qrcode
};

const moduleExports = {
    /* 处理各个页面传入而又需要在公共区域用到的参数 */
    init({pageTitle}) {
        pf.pageTitle = pageTitle; // 比如说页面名称，会在<title>或面包屑里用到
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
            bottomFooter: bottomFooter(componentRenderData),
            content
        };
        return layout(renderData);
    }
};

module.exports = moduleExports;