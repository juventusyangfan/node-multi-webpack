require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    // 倒计时
    var countdownFuc = function () {
        var timer = null;
        var countdown = $(".countdown").html();
        var sec = null,
            min = null,
            hr = null,
            day = null;
        var countdownAni = function () {
            var timeArr = countdown.split(":");
            if (parseInt(day) == 0 && parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                clearTimeout(timer);
                location.reload();
                return false;
            }
            if (parseInt(timeArr[3]) == 0) {
                if (parseInt(timeArr[2]) == 0) {
                    if (parseInt(timeArr[1]) == 0) {
                        if (parseInt(timeArr[0]) == 0) {
                            sec = 0;
                            min = 0;
                            hr = 0;
                            day = 0;
                        } else {
                            sec = 59;
                            min = 59;
                            hr = 23;
                            day = parseInt(timeArr[0]) - 1;
                        }
                    } else {
                        sec = 59;
                        min = 59;
                        hr = parseInt(timeArr[1]) - 1;
                        day = parseInt(timeArr[0]);
                    }
                } else {
                    sec = 59;
                    min = parseInt(timeArr[2]) - 1;
                    hr = parseInt(timeArr[1]);
                    day = parseInt(timeArr[0]);
                }
            } else {
                sec = parseInt(timeArr[3]) - 1;
                min = parseInt(timeArr[2]);
                hr = parseInt(timeArr[1]);
                day = parseInt(timeArr[0]);
            }

            $(".countdown").html(day + '天' + hr + "时" + min + "分" + sec + "秒");
            countdown =  day + ':' + hr + ':' + min + ':' + sec;
            timer = setTimeout(function () {
                countdownAni();
            }, 1000);
        };
        countdownAni();
    };
    if ($(".countdown").length > 0) {
        countdownFuc();
    }

    //取消订单
    $(".cancel_order").unbind().bind("click",function(){
        $.dialog({
            title: "取消订单",
            content: '<div class="inquiry-box clearfix"><label class="inquiry-label">原因说明：</label><div class="inquiry-input"><textarea class="cjy-textarea" name="reason" placeholder="请填写取消订单原因" maxlen="100"></textarea></div></div>',
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.inquiryPath + '/purchaser/order/dealOrder', {
                        id: $("input[name='order_id']").val(),
                        status: 0,
                        cancel_reason: $("textarea[name='reason']").val()
                    }, function (json) {
                        if (json.code === 2000) {
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
                    return false;
                });
            }
        });
        return false;
    });
});