/**
 * Created by yangfan on 2018/8/10.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const teamPic = require('./imgs/ourTeam.jpg');
const busPic = require('./imgs/business.png');
const advPic = require('./imgs/advantage.png');
const teamPic1 = require('./imgs/ourTeam1.jpg');
const teamPic2 = require('./imgs/ourTeam2.jpg');
const teamPic3 = require('./imgs/ourTeam3.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {teamPic,busPic,advPic,teamPic1,teamPic2,teamPic3});

module.exports = layout.init({
    pageTitle: '关于我们 ',
    topItems: [{
        name: "生材网",
        act: "active"
    }, {
        name: "招投标平台",
        act: ""
    }, {
        name: "供应链金场",
        act: ""
    }, {
        name: "直采商城",
        act: ""
    }, {
        name: "快捷竞价",
        act: ""
    }],
}).run(content(renderData));