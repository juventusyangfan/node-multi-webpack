const libs = require('libs');
require('cp');
require('elem');
require('./page.css');
const config = require('configModule');

$(() => {
    //入驻协议相关
    var timer = null,
        timeNum = 10;
    timer = setInterval(function () {
        timeNum--;
        $(".confirmAgreement").find("span").html("（" + timeNum + "s）");
        if (timeNum <= 0) {
            clearInterval(timer);
            $(".confirmAgreement").removeClass("confirmDisabled");
            $(".confirmAgreement").find("span").remove();
        }
    }, 1000);
    $(".cjy-close").unbind().bind("click", function () {
        window.location.href = config.wwwPath;
        return false;
    });
    $(".confirmAgreement").unbind().bind("click", function () {
        if (!$(this).hasClass("confirmDisabled")) {
            $(".cjy-poplayer,.cjy-bg").remove();
        }
        return false;
    });

    //选择贸易身份
    $(".js_choose > li").unbind().bind("click", function () {
        var roleType = $(this).attr("data-id");
        if ($(this).hasClass("act")) {
            $(this).removeClass("act");

        } else {
            $(this).addClass("act");
            if (roleType == "5") {
                $(".js_choose").find("li[data-id='1']").removeClass("act");
                $(".js_choose").find("li[data-id='2']").removeClass("act");
            } else {
                $(".js_choose").find("li[data-id='5']").removeClass("act");
            }
        }
        if ($(".js_choose li.act").length == 2) {
            $("input[name='role_type']").val("4");
        } else {
            $("input[name='role_type']").val($(".js_choose li.act").attr("data-id"));
        }
        return false;
    });

    //获取短信验证码
    var setCode = true;
    $(".set_code").unbind().bind("click", function () {
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
            main.removeClass("set_code").addClass("wait_code").html(time + "秒");
            timeObj = setInterval(function () {
                time--;
                if (time <= 0) {
                    main.removeClass("wait_code").addClass("set_code").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                } else {
                    main.html(time + "秒");
                }
            }, 1000);
            $.ajaxForJson(config.accountPath + "user/sendUserSms", {
                user_mobile: $("input[name='user_mobile']").val(),
                use_type: "REGISTER"
            }, function (dataObj) {
                if (dataObj.code != 2000) {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    main.removeClass("wait_code").addClass("set_code").html("获取验证码");
                    clearInterval(timeObj);
                    setCode = true;
                }
            });
        }
        return false;
    });

    //提交表单
    var ajaxKey = true;
    $(".btn_confirm").unbind().bind("click", function () {
        if ($("input[name='invitation_code']").length > 0 && $.trim($("input[name='invitation_code']").val()) == "") {
            $("input[name='invitation_code']").initInput("error", "请填写推荐码");
            $("input[name='invitation_code']").unbind().bind("blur", function () {
                $("input[name='invitation_code']").initInput();
            });
            return false;
        } else if ($("input[name='user_mobile']").length > 0 && ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val()))) {
            $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
            $("input[name='user_mobile']").unbind().bind("blur", function () {
                $("input[name='user_mobile']").initInput();
            });
            return false;
        } else if ($("input[name='sms_code']").length > 0 && $.trim($("input[name='sms_code']").val()) == "") {
            $("input[name='sms_code']").initInput("error", "请填写短信验证码");
            $("input[name='sms_code']").unbind().bind("blur", function () {
                $("input[name='sms_code']").initInput();
            });
            return false;
        } else if ($("input[name='real_name']").length > 0 && $.trim($("input[name='real_name']").val()) == "") {
            $("input[name='real_name']").initInput("error", "请填写姓名");
            $("input[name='real_name']").unbind().bind("blur", function () {
                $("input[name='real_name']").initInput();
            });
            return false;
        } else if ($("input[name='user_pwd']").length > 0 && ($.trim($("input[name='user_pwd']").val()) == "" || !libs.checkPassword($("input[name='user_pwd']").val()))) {
            $("input[name='user_pwd']").initInput("error", "请填写8-20位字及字母组合的密码");
            $("input[name='user_pwd']").unbind().bind("blur", function () {
                $("input[name='user_pwd']").initInput();
            });
            return false;
        } else if ($("input[name='user_pwd']").length > 0 && ($.trim($("input[name='user_repwd']").val()) == "" || $("input[name='user_repwd']").val() != $("input[name='user_pwd']").val())) {
            $("input[name='user_repwd']").initInput("error", "请填写一致的密码");
            $("input[name='user_repwd']").unbind().bind("blur", function () {
                $("input[name='user_repwd']").initInput();
            });
            return false;
        } else if ($("input[name='user_email']").length > 0 && ($.trim($("input[name='user_email']").val()) == "" || !libs.checkEmail($("input[name='user_email']").val()))) {
            $("input[name='user_email']").initInput("error", "请填写正确的邮箱");
            $("input[name='user_email']").unbind().bind("blur", function () {
                $("input[name='user_email']").initInput();
            });
            return false;
        }
        if (ajaxKey) {
            var reqUrl = config.accountPath + $("form").attr("action"),
                reqData = $("form").serialize();
            $.ajaxForJson(reqUrl, reqData, function (dataObj) {
                if (dataObj.code == 2000) {
                    window.location.href = dataObj.data.url;
                    $.msgTips({
                        type: "success",
                        content: dataObj.msg
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    ajaxKey = true;
                }

            });
        }
        ajaxKey = false;
        return false;
    });
});