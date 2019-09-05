/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const default01 = require('./imgs/01.jpg');
const default02 = require('./imgs/02.jpg');
const default03 = require('./imgs/03.jpg');
const default04 = require('./imgs/04.jpg');
const default05 = require('./imgs/05.jpg');
const company01 = require('./imgs/company/company.jpg');
const company001 = require('./imgs/company/company001.jpg');
const company002 = require('./imgs/company/company002.jpg');
const company003 = require('./imgs/company/company003.jpg');
const company004 = require('./imgs/company/company004.jpg');
const gongshi01 = require('./imgs/gongshi001.jpg');
const gongshi02 = require('./imgs/gongshi002.jpg');
const gongshi03 = require('./imgs/gongshi003.jpg');
const gongshi04 = require('./imgs/gongshi004.jpg');
const banner1 = require('./imgs/banner/banner1.jpg');
const banner2 = require('./imgs/banner/banner2.jpg');
const banner3 = require('./imgs/banner/banner3.jpg');
const banner4 = require('./imgs/banner/zb_banner.png');
const banner5 = require('./imgs/banner/banner5.jpg');
const kefuApp = require('./../../../public-resource/imgs/logo/qrcode_app.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {default01,default02,default03,default04,default05,company01,company001,company002,company003,company004,gongshi01,gongshi02,gongshi03,gongshi04,banner1,banner2,banner3,banner4,banner5,kefuApp});

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));