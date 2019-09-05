require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    $(".detail_done_btn").off().on("click", function () {
        $.msgTips({
            type: "warning",
            content: '当前服务商暂不支持申请'
        });
    });

    $(".unlogin_txt a").off().on("click", function () {
        $.loginDialog();
    });
});