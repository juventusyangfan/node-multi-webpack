/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
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
const fIcon7 = require('./imgs/friend/fIcon7.jpg');
const fIcon8 = require('./imgs/friend/fIcon8.jpg');
const fIcon9 = require('./imgs/friend/fIcon9.jpg');
const fIcon10 = require('./imgs/friend/fIcon10.jpg');
const fIcon11 = require('./imgs/friend/fIcon11.jpg');
const fIcon12 = require('./imgs/friend/fIcon12.jpg');
const fIcon13 = require('./imgs/friend/fIcon13.jpg');
const fIcon14 = require('./imgs/friend/fIcon14.jpg');
const fIcon15 = require('./imgs/friend/fIcon15.jpg');
const fIcon16 = require('./imgs/friend/fIcon16.jpg');
const fIcon17 = require('./imgs/friend/fIcon17.jpg');
const fIcon18 = require('./imgs/friend/fIcon18.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, { bankImg1, bankImg2, bankImg3, bankImg4, bankImg5, bankImg6, shopNone, fIcon1, fIcon2, fIcon3, fIcon4, fIcon5, fIcon6, fIcon7, fIcon8, fIcon9, fIcon10, fIcon11, fIcon12, fIcon13, fIcon14, fIcon15, fIcon16, fIcon17, fIcon18 });

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));