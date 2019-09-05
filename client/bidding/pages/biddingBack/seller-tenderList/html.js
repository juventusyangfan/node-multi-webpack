const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig);

module.exports = layout.init({
    pageTitle: '企业全部投标',
    topItems: [{
        name: "供应商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-toubiao'></i>投标管理",
        dd: [{
            name: "企业全部投标",
            act: true
        }, {
            name: "邀请招标管理",
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
        }]
    }, {
        dt: "<i class='iconfont icon-youshang'></i>友商管理",
        dd: [{
            name: "企业友商",
            act: false
        }, {
            name: "申请成为友商",
            act: false
        }]
    }],
    crumbsItem:{
        links:["供应商中心"],
        textItem:"企业全部投标"
    }
}).run(content(renderData));