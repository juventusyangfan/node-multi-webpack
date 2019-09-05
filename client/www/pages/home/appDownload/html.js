/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const header = require('../../../public-resource/components/header/html.ejs');
const footer = require('../../../public-resource/components/footer/html.ejs');
const bottomFooter = require('../../../public-resource/components/bottom-footer/html.ejs');

const codeImg = require('../../../public-resource/imgs/logo/qrcode_app.jpg');

/* 整理渲染公共部分所用到的模板变量 */
const pf = {
    pageTitle: '生材网'
};

const componentRenderData = Object.assign({}, config, pf); // 页头组件需要加载css/js等，因此需要比较多的变量
const renderData = {
    header: header(componentRenderData),
    footer: footer(componentRenderData),
    bottomFooter: bottomFooter(componentRenderData),
    codeImg
};

module.exports = content(renderData);