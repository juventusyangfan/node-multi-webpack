/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const banner1 = require('./imgs/banner/banner1.jpg');
const logoDemo = require('./imgs/logoDemo.png');
const ad1 = require('./imgs/companyBannerEq1.jpg');
const ad2 = require('./imgs/companyBannerEq2.jpg');
const logoEq1 = require('./imgs/logoEq1.png');
const zxyhIcon = require('./imgs/zxyhIcon.jpg');
const zsyhIcon = require('./imgs/zsyhIcon.jpg');
const jsyhIcon = require('./imgs/jsyhIcon.jpg');
const jtyhIcon = require('./imgs/jtyhIcon.jpg');
const bhyhIcon = require('./imgs/bhyhIcon.jpg');
const gjyhIcon = require('./imgs/gjyhIcon.jpg');
const payhIcon = require('./imgs/payhIcon.jpg');
const logo1 = require('./imgs/logoEg1.jpg');
const logo2 = require('./imgs/logoEg2.jpg');
const logo3 = require('./imgs/logoEg3.jpg');
const logoDefault = require('../../../public-resource/imgs/noPicOp.png');

const codeImg = require('./imgs/codeImg.jpg');


const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { banner1, logoDemo, ad1, logoEq1, ad2, zxyhIcon, zsyhIcon, jsyhIcon, jtyhIcon, bhyhIcon, gjyhIcon, payhIcon, logo1, logo2, logo3, logoDefault, codeImg });

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));