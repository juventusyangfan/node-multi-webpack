require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");


$(() => {
    //确认提交
    $(".btn_confirm").unbind().bind("click", function () {
        var requestData = $("form").serialize();
        $.ajaxForJson(config.youshangPath + "purchaser/evaluate/editPost", requestData, function (dataObj) {
            if (dataObj.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg,
                    callback: function () {
                        location.href = "/purchaser/evaluate/index";
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});