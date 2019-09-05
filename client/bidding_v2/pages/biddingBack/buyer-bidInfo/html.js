const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const npPic = require('../../../public-resource/imgs/noPic.png');
const list = require('../../../public-resource/components/list/html.ejs')({
    tableList: {
        widths: [50, 200, 150, 100, 100, 100, 200, 150, 100],
        titles: ['序号', '招标名称', '公告时间', '招标方式', '评标方式', '招标类型', '交付地点', '截标时间', '状态'],
        contents: [['1', '昆明分公司寻沾高...', '2018-06-29', '公开', '在线', '物资招标', '湖北省-恩施...', '2018-06-29', '报名中'], ['2', '昆明分公司寻沾高...', '2018-06-29', '公开', '在线', '物资招标', '湖北省-恩施...', '2018-06-29', '报名中'], ['3', '昆明分公司寻沾高...', '2018-06-29', '公开', '在线', '物资招标', '湖北省-恩施...', '2018-06-29', '报名中']]
    }
});
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {list, pageNav, npPic});

module.exports = layout.init({
    pageTitle: '招标基本信息',
    topItems: [{
        name: "采购商中心",
        act: true
    }],
    sideItems: [{
        dt: "<i class='iconfont icon-xiangmu'></i>企业项目库",
        dd: [{
            name: "新建项目",
            act: true
        }, {
            name: "企业项目库",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-daan'></i>企业招标",
        dd: [{
            name: "发布招标",
            act: false
        }, {
            name: "企业全部招标",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-ziyuan'></i>企业供应商资源库",
        dd: [{
            name: "我的供应商",
            act: false
        }, {
            name: "添加供应商",
            act: false
        }]
    }, {
        dt: "<i class='iconfont icon-qiandai1'></i>收款管理",
        dd: [{
            name: "标书订单管理",
            act: false
        }, {
            name: "头部保证金订单管理",
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
    }],
    crumbsItem: {
        links: ["采购中心"],
        textItem: "项目详情"
    }
}).run(content(renderData));