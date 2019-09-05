/**
 * Created by yangfan on 2017/7/6.
 */
require('elem');
require('cp');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');

import Vue from 'vue';

const config = require('configModule');
const libs = require('libs');

$(() => {
    //金场动画
    $(".jc_bank_cell").unbind().bind("mouseover", function () {
        if (!$(this).hasClass("active")) {
            $(".jc_bank_cell").removeClass("active");
            $(this).addClass("active");
        }
    });
});