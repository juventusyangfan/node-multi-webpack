/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '招标详情',
        links: ['独家招标']
    }
});
const timeline = require('../../../public-resource/components/tender-timeline/html.ejs')({
    step:[{
        changeI: 'bg_red iconfont icon-gou',
        changeItxt: '',
        changeStatus: '报名成功',
        changeA: '报名',
        changeAbg: 'btn_bg_green',
        description1: '',
        description1_2: '',
        description2: '',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_red iconfont icon-gou',
        changeItxt: '',
        changeStatus: '投标成功',
        changeA: '',
        changeAbg: '',
        description1: '',
        description1_2: '',
        description2: '查看我的投标',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_red iconfont icon-gou',
        changeItxt: '',
        changeStatus: '已截标',
        changeA: '',
        changeAbg: '',
        description1: '',
        description1_2: '',
        description2: '开标',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_gray',
        changeItxt: '4',
        changeStatus: '已废标',
        changeA: '',
        changeAbg: '',
        description1: '',
        description1_2: '',
        description2: '查看废标详情',
        description2_2: '',
        description3: ''
    }]
});
//图片
const proimg = require('./imgs/pro001.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,timeline,backCrumbs,proimg});

module.exports = layout.init({
    pageTitle: '独家招标'
}).run(content(renderData));