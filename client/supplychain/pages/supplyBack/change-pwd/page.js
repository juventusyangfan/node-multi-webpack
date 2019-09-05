require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 新密码
    $("input[name='old_pwd']").off().on({
        input: function () {
            var main = $(this);
            if ($.trim(main.val()) == "" || !libs.checkPassword(main.val())) {
                $("input[name='old_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
                return false;
            } else {
                main.initInput();
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 新密码
    $("input[name='user_pwd']").off().on({
        input: function () {
            var main = $(this);
            if ($.trim(main.val()) == "" || !libs.checkPassword(main.val())) {
                $("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
                return false;
            } else {
                main.initInput();
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 确认密码
    $("input[name='renew_pwd']").off().on({
        input: function () {
            var main = $(this);
            if ($.trim(main.val()) !== $.trim($("input[name='user_pwd']").val())) {
                $("input[name='renew_pwd']").initInput("error", "两次密码不一致");
                return false;
            } else {
                main.initInput();
            }
        },
        blur: function () {
            var main = $(this);
            main.initInput();
        }
    });

    // 确认密码
    $("input[name='captcha']").off().on("blur", function () {
        var main = $(this);
        main.initInput();
    });

    // 保存
    $(".btn_confirm").off().on("click", function (event) {
        event.preventDefault();

        // 必填项
        var opt = {
            old_pwd: $("input[name='old_pwd']").val(),
            user_pwd: $("input[name='user_pwd']").val(),
            renew_pwd: $("input[name='renew_pwd']").val(),
            captcha: $("input[name='captcha']").val()
        }
        if ($.trim(opt.old_pwd) == "" || !libs.checkPassword(opt.old_pwd)) {
            $("input[name='old_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            return false;
        } else if ($.trim(opt.user_pwd) == "" || !libs.checkPassword(opt.user_pwd)) {
            $("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            return false;
        } else if ($.trim(opt.renew_pwd) !== $.trim(opt.user_pwd)) {
            $("input[name='renew_pwd']").initInput("error", "两次密码不一致");
            return false;
        } else if ($.trim(opt.captcha) == "") {
            $("input[name='captcha']").initInput("error", "验证码不能为空");
            return false;
        }

        // 表单提交
        var reqUrl = $(".back_main form").attr("action");
        var reqData = $(".back_main form").serialize();
        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.reload();
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