const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutOther');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig);

module.exports = layout.init({
    pageTitle: '设置招标文件',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    crumbsItem: {
        links: ["采购商中心", "企业采集", "设置招标文件"],
        textItem: "设置招标文件"
    }
}).run(content(renderData));