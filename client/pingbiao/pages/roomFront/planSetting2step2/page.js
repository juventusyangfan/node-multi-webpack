require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //关闭
    $(".setting_btn_cancel").unbind().bind("click", function () {
        window.close();
        return false;
    });
});