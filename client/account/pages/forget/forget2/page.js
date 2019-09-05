require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");

$(() => {

    //选择贸易身份
    $(".js_choose > span").unbind().bind("click",function () {
        $(this).parent().find("span").removeClass("act");
        $(this).addClass("act");
        return false;
    });

    // 表单输入
    $(".register_block input").off().on("input", function () {
        var main = $(this);
        if (main.val() !== "") {
            if (main.parent().find(".msgCon").length>0) {
                main.parent().find(".msgCon").remove();
                main.removeClass("cjy-input-error");
            }
        }
    });

    // 下一步
    $(".btn_confirm").off().on("click", function () {
        var main = $(this);

        if ($.trim($("input[name='new_pwd']").val()) == "" || !libs.checkPassword($("input[name='new_pwd']").val())) {
            $("input[name='new_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            return false;
        }
        else if ($.trim($("input[name='renew_pwd']").val()) == "" || $("input[name='renew_pwd']").val() != $("input[name='new_pwd']").val()) {
            $("input[name='renew_pwd']").initInput("error", "请填写一致的密码");
            return false;
        }

        var reqUrl = config.accountPath + '/findPwd';
        var reqData = $(".register_block input").serialize() + '&user_mobile=' + libs.getUrlParam("zh");

        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.href = json.data.url;
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
            }
        });
    });
});