const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {});

module.exports = layout.init({
    pageTitle: '商家中心 - 申请入驻',
    topItems: [{
        name: "商家中心",
        act: true
    }],
    layType: "merchant"
}).run(content(renderData));