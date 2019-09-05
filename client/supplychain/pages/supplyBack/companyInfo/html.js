const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const npPic = require('../../../public-resource/imgs/noPic.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {npPic});

module.exports = layout.init({
    pageTitle: '新建企业项目',
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
    }],
    crumbsItem: {
        links: ["采购商中心"],
        textItem: "新建企业项目"
    }
}).run(content(renderData));