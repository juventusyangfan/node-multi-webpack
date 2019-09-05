/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const backCrumbs = require('../../../public-resource/components/back-crumbs/html.ejs')({
    crumbsItem: {
        textItem: '招标详情',
        links: ['独家招标']
    }
});
const timeline = require('../../../public-resource/components/tender-timeline/html.ejs')({
    step:[{
        changeI: 'bg_red',
        changeItxt: '1',
        changeStatus: '报名中',
        changeA: '报名',
        changeAbg: 'btn_bg_green',
        description1: '',
        description1_2: '',
        description2: '',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_gray',
        changeItxt: '2',
        changeStatus: '投标中',
        changeA: '',
        changeAbg: '',
        description1: '',
        description1_2: '',
        description2: '',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_gray',
        changeItxt: '3',
        changeStatus: '已截标',
        changeA: '',
        changeAbg: '',
        description1: '',
        description1_2: '',
        description2: '',
        description2_2: '',
        description3: ''
    },{
        changeI: 'bg_gray',
        changeItxt: '4',
        changeStatus: '已定标',
        changeA: '',
        changeAbg: '',
        description1: '已回标：5/10',
        description1_2: '查看回标信息',
        description2: '',
        description2_2: '',
        description3: ''
    }]
});
//图片
const proimg = require('./imgs/pro001.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {backCrumbs,timeline,proimg});

module.exports = layout.init({
    pageTitle: '独家招标'
}).run(content(renderData));