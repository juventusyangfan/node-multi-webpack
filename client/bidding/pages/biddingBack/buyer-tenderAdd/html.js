const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layoutBack');
const list = require('../../../public-resource/components/list/html.ejs')({
    tableList: {
        widths: [50, 300, 100, 100, 100, 150, 50],
        titles: ['序号', '供应商', '企业评级', '参与投标次数', '参与投标次数', '供应商联系方式', '操作'],
        contents: [['1', '武汉市市政集团有限公司', '-', '4', '1', '027-12322434', '<a href="javascript:;" class="textRed js_remove"><i class="iconfont icon-huishouxiang"></i></a>'], ['2', '武汉市大建设市政集团有限公司', 'A', '4', '1', '027-12322434', '<a href="javascript:;" class="textRed js_remove"><i class="iconfont icon-huishouxiang"></i></a>'], ['3', '武汉市市政集团有限公司', 'A', '4', '1', '027-12322434', '<a href="javascript:;" class="textRed js_remove"><i class="iconfont icon-huishouxiang"></i></a>']]
    }
});

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {list});

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
    }, {
        dt: "<i class='iconfont icon-daan'></i>企业招标",
        dd: [{
            name: "发布招标",
            act: true
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
        links: ["采购商中心", "企业招标"],
        textItem: "发布招标"
    }
}).run(content(renderData));