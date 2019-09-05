/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');

$(() => {
    $(".page_container_wrap").ajxForPage(config.wwwPath + 'ajaxGetTenderList', null);
});