/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
const pageNav = require('../../../public-resource/components/page-nav/html.ejs')();
//图片
const carouselImg = require('./imgs/banner1.jpg');
const displayImg1 = require('./imgs/show_location1.jpg');
const displayImg2 = require('./imgs/show_location2.jpg');
const companyLogo1 = require('./imgs/companylogo1.jpg');
const companyLogo2 = require('./imgs/companylogo2.jpg');
const companyLogo3 = require('./imgs/companylogo3.jpg');
const companyLogo4 = require('./imgs/companylogo4.jpg');
const companyLogo5 = require('./imgs/companylogo5.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {pageNav,carouselImg,displayImg1,displayImg2,companyLogo1,companyLogo2,companyLogo3,companyLogo4,companyLogo5});

module.exports = layout.init({
    pageTitle: '找供应商'
}).run(content(renderData));