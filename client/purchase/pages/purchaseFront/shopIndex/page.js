/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');

const config = require('configModule');
const libs = require('libs');

$(() => {
    //banner轮播
    $(".js_slides").initPicPlayer();
});