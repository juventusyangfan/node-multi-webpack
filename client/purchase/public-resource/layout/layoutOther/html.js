/**
 * Created by yangfan on 2017/7/5.
 */
const config = require('configModule');
const layout = require('./html.ejs'); // 整个页面布局的模板文件，主要是用来统筹各个公共组件的结构
const header = require('../../components/header/html.ejs');
const footer = require('../../components/footer/html.ejs');
const topNav = require('../../components/top-nav/html.ejs');
const topMenu = require('../../components/top-menu-other/html.ejs');
const bottomFooter = require('../../components/bottom-footer/html.ejs');

const qrcode = require("../../imgs/logo/qrcode_app.jpg");

/* 整理渲染公共部分所用到的模板变量 */
const pf = {
    pageTitle: '生材网',
    topItems: [{
        name: "采购中心",
        act: true
    }],
    layType: "step",
    qrcode: qrcode
};

const moduleExports = {
    /* 处理各个页面传入而又需要在公共区域用到的参数 */
    init({ pageTitle, topItems, layType }) {
        pf.pageTitle = pageTitle;
        pf.topItems = topItems;
        pf.layType = layType || pf.layType;
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