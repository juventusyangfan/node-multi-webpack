/**
 * Created by yangfan on 2018/8/10.
 */
require('cp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //提交
    $(".btn_confirm").unbind().bind("click", function () {
        if ($("textarea[name='feedback']").val().length > 400) {
            $.msgTips({
                type: "warning",
                content: "您填写的反馈内容过长！"
            });
            return false;
        }
        else if ($("textarea[name='feedback']").val().length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请填写反馈内容！！"
            });
            return false;
        }
        else if ($("input[name='captcha']").val().length <= 0) {
            $.msgTips({
                type: "warning",
                content: "请填写验证码！！"
            });
            return false;
        }
        $.ajaxForJson(config.wwwPath + "/addFeedback", {
            feedback: libs.html2Escape($("textarea[name='feedback']").val()),
            contact_phone: libs.html2Escape($("input[name='contact_phone']").val()),
            captcha: libs.html2Escape($("input[name='captcha']").val())
        }, function (dataObj) {
            if (dataObj.code == "2000") {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg,
                    callback: function () {
                        window.location.reload();
                    }
                });
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
        return false;
    });
});