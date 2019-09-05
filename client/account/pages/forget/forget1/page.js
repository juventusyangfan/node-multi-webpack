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

    //获取短信验证码
    var setCode = true;
    $(".set_code").off().on("click", function () {
        var main = $(this);
        var timeObj = null;
        if ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val())) {
            $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
            return false;
        }
        $.ajaxForJson(config.accountPath + 'isMobileUsed', {
            user_mobile: $("input[name='user_mobile']").val()
        }, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "warning",
                    content: "手机号不存在"
                });
            } else {
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
                        }
                        else {
                            main.html(time + "秒");
                        }
                    }, 1000);
                    $.ajaxForJson(config.accountPath + "user/sendUserSms", {
                        user_mobile: $("input[name='user_mobile']").val(),
                        use_type: "FIND_PWD"
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
            }
        });
        return false;
    });

    // 下一步
    $(".btn_confirm").off().on("click", function () {
        var main = $(this);

        if ($.trim($("input[name='user_mobile']").val()) == "" || !libs.checkMobile($("input[name='user_mobile']").val())) {
            $("input[name='user_mobile']").initInput("error", "请填写正确的手机");
            return false;
        }
        else if ($.trim($("input[name='sms_code']").val()) == "") {
            $("input[name='sms_code']").initInput("error", "验证码不能为空");
            return false;
        }

        var reqUrl = config.accountPath + 'findPost';
        var reqData = $(".register_block input").serialize() + '&use_type=FIND_PWD';

        $.ajaxForJson(reqUrl, reqData, function (json) {
            if (json.code == 2000) {
                $.msgTips({
                    type: "success",
                    content: json.msg,
                    callback: function () {
                        location.href = '/input.html?zh=' + $("input[name='user_mobile']").val();
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