require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require("libs");


$(() => {

    // 表单提交
    $(".js_psd").off().on("click", function () {
        var main = $(this), formObj = $("form").eq(0);

        if ($.trim(formObj.find("input[name='old_pwd']").val()) == "" || !libs.checkPassword(formObj.find("input[name='old_pwd']").val())) {
            formObj.find("input[name='old_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            formObj.find("input[name='old_pwd']").unbind().bind("blur", function () {
                formObj.find("input[name='old_pwd']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='user_pwd']").val()) == "" || !libs.checkPassword(formObj.find("input[name='user_pwd']").val())) {
            formObj.find("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            formObj.find("input[name='user_pwd']").unbind().bind("blur", function () {
                formObj.find("input[name='user_pwd']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='renew_pwd']").val()) == "" || formObj.find("input[name='renew_pwd']").val() != formObj.find("input[name='user_pwd']").val()) {
            formObj.find("input[name='renew_pwd']").initInput("error", "请填写一致的密码");
            formObj.find("input[name='renew_pwd']").unbind().bind("blur", function () {
                formObj.find("input[name='renew_pwd']").initInput();
            });
            return false;
        }

        var reqUrl = config.wwwPath + $("form").eq(0).attr("action");
        var reqData = $("form").eq(0).serialize();

        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        window.location.href = json.data.url;
                    }
                });
            } else {
                $.msgTips({
                    type: "warning",
                    content: json.msg
                });
                document.getElementById('verify_img').src = '/captcha.action?' + Math.random();
            }
        });
    });

    //获取短信验证码
    var setCode = true;
    $(".sendCode").unbind().bind("click", function () {
        if ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val())) {
            $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
            $("input[name='user_mobile']").unbind().bind("blur", function () {
                $("input[name='user_mobile']").initInput();
            });
            return false;
        }
        var main = $(this);
        var timeObj = null;
        if (setCode) {
            var time = 60;
            setCode = false;
            main.removeClass("sendCode").addClass("wait_code").html(time + "秒");
            timeObj = setInterval(function () {
                time--;
                if (time <= 0) {
                    main.removeClass("wait_code").addClass("sendCode").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                }
                else {
                    main.html(time + "秒");
                }
            }, 1000);
            $.ajaxForJson(config.wwwPath + "/account/sendSms", {
                user_mobile: $("input[name='user_mobile']").val(),
                use_type: main.attr("data-type")
            }, function (dataObj) {
                if (dataObj.code != 2000) {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    main.removeClass("wait_code").addClass("sendCode").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                }
            });
        }
        return false;
    });

    //更换手机
    $(".is_tel").off().on("click", function () {
        var main = $(this), formObj = $("form").eq(1);

        if ($.trim(formObj.find("input[name='user_pwd']").val()) == "" || !libs.checkPassword(formObj.find("input[name='user_pwd']").val())) {
            formObj.find("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            formObj.find("input[name='user_pwd']").unbind().bind("blur", function () {
                formObj.find("input[name='user_pwd']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='user_mobile']").val()) == "" || !libs.checkMobile(formObj.find("input[name='user_mobile']").val())) {
            formObj.find("input[name='user_mobile']").initInput("error", "请填写正确的手机");
            formObj.find("input[name='user_mobile']").unbind().bind("blur", function () {
                formObj.find("input[name='user_mobile']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='sms_code']").val()) == "") {
            formObj.find("input[name='sms_code']").initInput("error", "请填写验证码");
            formObj.find("input[name='sms_code']").unbind().bind("blur", function () {
                formObj.find("input[name='sms_code']").initInput();
            });
            return false;
        }

        var reqUrl = config.wwwPath + $("form").eq(1).attr("action");
        var reqData = $("form").eq(1).serialize();

        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        window.location.href = json.data.url;
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

    //获取邮箱验证码
    var setEmailCode = true;
    $(".sendEmail").unbind().bind("click", function () {
        if ($.trim($("input[name='user_email']").val()) == "" || !libs.checkEmail($("input[name='user_email']").val())) {
            $("input[name='user_email']").initInput("error", "请填写正确的邮箱");
            $("input[name='user_email']").unbind().bind("blur", function () {
                $("input[name='user_email']").initInput();
            });
            return false;
        }
        if (setEmailCode) {
            $.ajaxForJson(config.wwwPath + "/account/sendEmailCode", {
                user_email: $("input[name='user_email']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                }
                else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
                setEmailCode = true;
            });
            setEmailCode = false;
        }
        else {
            $.msgTips({
                type: "warning",
                content: "验证码已发送！请勿重复点击"
            });
        }
        return false;
    });

    //更换邮箱
    $(".is_email").off().on("click", function () {
        var main = $(this), formObj = $("form").eq(2);

        if ($.trim(formObj.find("input[name='user_pwd']").val()) == "" || !libs.checkPassword(formObj.find("input[name='user_pwd']").val())) {
            formObj.find("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            formObj.find("input[name='user_pwd']").unbind().bind("blur", function () {
                formObj.find("input[name='user_pwd']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='user_email']").val()) == "" || !libs.checkEmail(formObj.find("input[name='user_email']").val())) {
            formObj.find("input[name='user_email']").initInput("error", "请填写正确的邮箱");
            formObj.find("input[name='user_email']").unbind().bind("blur", function () {
                formObj.find("input[name='user_email']").initInput();
            });
            return false;
        }
        else if ($.trim(formObj.find("input[name='email_code']").val()) == "") {
            formObj.find("input[name='email_code']").initInput("error", "请填写验证码");
            formObj.find("input[name='email_code']").unbind().bind("blur", function () {
                formObj.find("input[name='email_code']").initInput();
            });
            return false;
        }

        var reqUrl = config.wwwPath + formObj.attr("action");
        var reqData = formObj.serialize();

        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        window.location.reload();
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