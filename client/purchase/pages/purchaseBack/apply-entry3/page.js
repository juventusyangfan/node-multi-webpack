require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    // 上一步
    $(".applyentry_btn_up").off().on("click", function () {
        history.go(-1);
    });

    // 同意协议
    $(".applyentry_btn_go").off().on("click", function () {
        var main = $(this);
        $.ajaxForJson(config.shopPath + 'admissionPost', {
            admission_id: main.attr("data-id"),
            step: main.attr("step_val")
        }, function (json) {
            if (json.code === 2000) {
                location.href = '/' + json.data.url;
            }
        });
    });
});