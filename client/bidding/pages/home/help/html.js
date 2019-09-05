/**
 * Created by yangfan on 2017/7/6.
 */
const config = require('configModule');
const content = require('./content.ejs');
const layout = require('layout');

const help1_1 = require('./imgs/help1_1.png');
const help1_2 = require('./imgs/help1_2.png');
const help2_1 = require('./imgs/help2_1.png');
const help3_1 = require('./imgs/help3_1.png');
const seller1_1 = require('./imgs/seller1_1.png');
const seller1_2 = require('./imgs/seller1_2.png');
const seller2_1 = require('./imgs/seller2_1.png');
const seller2_2 = require('./imgs/seller2_2.png');
const seller3_1 = require('./imgs/seller3_1.png');
const buyer1_1 = require('./imgs/buyer1_1.png');
const buyer1_2 = require('./imgs/buyer1_2.png');
const buyer1_1_2 = require('./imgs/buyer1_1_2.png');
const buyer1_1_3 = require('./imgs/buyer1_1_3.png');
const buyer2_1 = require('./imgs/buyer2_1.png');
const buyer2_2 = require('./imgs/buyer2_2.png');
const buyer2_1_2 = require('./imgs/buyer2_1_2.png');
const buyer2_1_3 = require('./imgs/buyer2_1_3.png');
const buyer3_1 = require('./imgs/buyer3_1.png');
const buyer3_1_2 = require('./imgs/buyer3_1_2.png');

const video1 = require('./imgs/video/buyer_1.png');
const video2 = require('./imgs/video/buyer_2.png');
const video3 = require('./imgs/video/buyer_3.png');
const video4 = require('./imgs/video/buyer_4.png');
const video5 = require('./imgs/video/buyer_5.png');
const video6 = require('./imgs/video/supplier_1.png');
const video7 = require('./imgs/video/supplier_2.png');
const video8 = require('./imgs/video/supplier_3.png');
const video9 = require('./imgs/video/buyer_print.png');

const handleBuyer = require('./imgs/handbook_buyer.png');
const handleManager = require('./imgs/handbook_manager.jpg');

const dirsConfig = config.DIRS;
const renderData = Object.assign({}, dirsConfig, {
    help1_1,
    help1_2,
    help2_1,
    help3_1,
    seller1_1,
    seller1_2,
    seller2_1,
    seller2_2,
    seller3_1,
    buyer1_1,
    buyer1_2,
    buyer1_1_2,
    buyer1_1_3,
    buyer2_1,
    buyer2_2,
    buyer2_1_2,
    buyer2_1_3,
    buyer3_1,
    buyer3_1_2,
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
    video7,
    video8,
    video9,
    handleBuyer,
    handleManager
});

module.exports = layout.init({
    pageTitle: '生材网'
}).run(content(renderData));