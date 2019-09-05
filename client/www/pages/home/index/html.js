/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const banner1 = require('./imgs/banner/banner1.jpg');
const banner2 = require('./imgs/banner/banner2.jpg');
const banner3 = require('./imgs/banner/banner3.jpg');
const banner4 = require('./imgs/banner/banner4.jpg');
const banner5 = require('./imgs/banner/www_banner.png');
const banner6 = require('./imgs/banner/banner5.jpg');
const banner7 = require('./imgs/banner/banner6.jpg');
const banner8 = require('./imgs/banner/banner7.jpg');
const banner9 = require('./imgs/banner/banner8.jpg');
const banner10 = require('./imgs/banner/banner9.jpg');
const kefuApp = require('./../../../public-resource/imgs/logo/qrcode_app.jpg');
const noPic = require('./../../../public-resource/imgs/noPic.png');

const bankImg1 = require('./imgs/bIcon1.jpg');
const bankImg2 = require('./imgs/bIcon2.jpg');
const bankImg3 = require('./imgs/bIcon3.jpg');
const bankImg4 = require('./imgs/bIcon4.jpg');
const bankImg5 = require('./imgs/bIcon5.jpg');
const bankImg6 = require('./imgs/bIcon6.jpg');

const shopNone = require('./imgs/shopNone.png');

const fIcon1 = require('./imgs/friend/fIcon1.jpg');
const fIcon2 = require('./imgs/friend/fIcon2.jpg');
const fIcon3 = require('./imgs/friend/fIcon3.jpg');
const fIcon4 = require('./imgs/friend/fIcon4.jpg');
const fIcon5 = require('./imgs/friend/fIcon5.jpg');
const fIcon6 = require('./imgs/friend/fIcon6.jpg');
const fIcon7 = require('./imgs/friend/fIcon7.png');
const fIcon8 = require('./imgs/friend/fIcon8.png');
const fIcon9 = require('./imgs/friend/fIcon9.png');
const fIcon10 = require('./imgs/friend/fIcon10.jpg');
const fIcon11 = require('./imgs/friend/fIcon11.jpg');
const fIcon12 = require('./imgs/friend/fIcon12.jpg');
const fIcon13 = require('./imgs/friend/fIcon13.jpg');
const fIcon14 = require('./imgs/friend/fIcon14.jpg');
const fIcon15 = require('./imgs/friend/fIcon15.jpg');
const fIcon16 = require('./imgs/friend/fIcon16.jpg');
const fIcon17 = require('./imgs/friend/fIcon17.jpg');
const fIcon18 = require('./imgs/friend/fIcon18.jpg');
const fIcon19 = require('./imgs/friend/fIcon19.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { banner1, banner2, banner3, banner4, banner5, banner6, banner7, banner8, banner9, banner10, kefuApp, bankImg1, bankImg2, bankImg3, bankImg4, bankImg5, bankImg6, shopNone, fIcon1, fIcon2, fIcon3, fIcon4, fIcon5, fIcon6, fIcon7, fIcon8, fIcon9, fIcon10, fIcon11, fIcon12, fIcon13, fIcon14, fIcon15, fIcon16, fIcon17, fIcon18, fIcon19, noPic });

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));