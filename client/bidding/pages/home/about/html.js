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
    pageTitle: '关于我们 '
}).run(content(renderData));