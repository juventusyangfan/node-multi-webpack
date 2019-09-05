const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const list = require('../../../public-resource/components/list/html.ejs')({
    tableList: {
        widths: [50, 200, 150, 100, 100],
        titles: ['序号', '采购商名称', '申请/加入时间', '加入方式', '状态'],
        contents: [['1', '武汉市市政集团有限公司', '2018-06-29 12:00', '邀请加入', '待审核'], ['2', '武汉市大建设市政集团有限公司', '2018-06-29 12:00', '申请加入', '审核未通过'], ['3', '武汉市大建设市政集团有限公司', '2018-06-29 12:00', '申请加入', '正常']]
    }
});
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {list, pageNav});

module.exports = layout.init({
    pageTitle: '企业友商',
    topItems: [{
        name: "供应商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-toubiao'></i>投标管理",
        dd: [{
            name: "企业全部投标",
            act: false
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
            act: true
        }, {
            name: "申请成为友商",
            act: false
        }]
    }],
    crumbsItem:{
        links:["供应商中心"],
        textItem:"企业友商"
    }
}).run(content(renderData));