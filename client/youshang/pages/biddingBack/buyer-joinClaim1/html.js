const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const list = require('../../../public-resource/components/list/html.ejs')({
    tableList: {
        widths: [50, 200, 150, 100, 100, 100, 50],
        titles: ['序号', '供应商名称', '申请/加入时间', '加入方式', '状态', '供应商等级', '操作'],
        contents: [['1', '武汉市市政集团有限公司', '2018-06-29 12:00', '邀请加入', '待审核', '待审核', '<a href="javascript:;" class="textOrange audit_sell">审核</a>'], ['2', '武汉市大建设市政集团有限公司', '2018-06-29 12:00', '申请加入', '审核未通过', '/', '<a href="javascript:;" class="textBlue">修改</a>'], ['3', '武汉市大建设市政集团有限公司', '2018-06-29 12:00', '申请加入', '正常', 'A', '<a href="javascript:;" class="textBlue">修改</a>']]
    }
});
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {list, pageNav});

module.exports = layout.init({
    pageTitle: '企业供应商',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-ziyuan'></i>供应商资源库",
        dd: [{
            name: "我的供应商",
            act: true
        }, {
            name: "供应商准入",
            act: false
        }, {
            name: "供应商评价",
            act: false
        }]
    }],
    crumbsItem: {
        links: ["采购商中心"],
        textItem: "企业供应商"
    }
}).run(content(renderData));