/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');
//图片
const vipBuyer = require('./imgs/vip_buyer.png');
const vipSeller = require('./imgs/vip_seller.png');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {vipBuyer,vipSeller});

module.exports = layout.init({
    pageTitle: 'VIP会员协议'
}).run(content(renderData));