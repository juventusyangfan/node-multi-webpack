/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');

const config = require('configModule');
const libs = require('libs');

const noPic = require('../../../public-resource/imgs/noPic.png');

$(() => {
    var end_time = $("span[end_time]").attr("end_time"),
        timeStr = "",
        timer = null;

    function setTime() {
        clearTimeout(timer);
        if (end_time != "") {
            var timeArr = end_time.split(":");
            var sec = 0,
                min = 0,
                hr = 0,
                day = 0;
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

            if (parseInt(day) == 0 && parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                timeStr = "交易关闭";
                $(".order_confirm").removeClass("order_confirm").addClass("order_confirm_none");
            } else {
                day = day > 9 ? day : '0' + day
                hr = hr > 9 ? hr : '0' + hr
                min = min > 9 ? min : '0' + min
                sec = sec > 9 ? sec : '0' + sec
                end_time = day + ':' + hr + ':' + min + ':' + sec;
                timeStr = day + '天' + hr + '小时' + min + '分' + sec + '秒';
            }
            $("span[end_time]").html(timeStr);
        }
        // 一秒后递归
        timer = setTimeout(function () {
            setTime();
        }, 1000);
    }
    setTime();

    // 去支付
    $(".js_goPay").unbind().bind("click", function () {
        //if (!$(this).hasClass("order_confirm_none")) {
        if ($(".pay_body_bg1").hasClass("active")) {
            $(".pay_body_bg2").hide();
            $(this).parent().hide();
            $(".order_pay_body").addClass("transfer_open");
            $(".transfer_warp").show();
        } else {
            window.location.href = "/";
        }
        //}
        return false;
    });
    //返回
    $(".js_goBack").unbind().bind("click", function () {
        $(".order_pay_body").removeClass("transfer_open");
        $(".transfer_warp").hide();
        $(".pay_body_bg2").show();
        $(".js_goPay").parent().show();
        return false;
    });
    //上传凭证
    $(".js_upload").unbind().bind("click", function () {
        var html = '<div class="upload_wrap"><div><span id="uploadBtn"></span><div id="process-files"></div></div><div class="default_img"><img src="' + config.staticPath + noPic + '"><input type="hidden" name="file_name[]"><input type="hidden" name="file_path[]"></div><div class="upload_notice_con"><span class="iconfont icon-i"></span>请尽量上传清晰无误的凭证图片，以便采购商快速确认</div></div>';
        $.dialog({
            title: '上传资审文件费凭证',
            content: html,
            width: 400,
            confirm: {
                show: true,
                allow: true,
                name: "确定"
            },
            cancel: {
                show: true,
                name: "取消"
            },
            callback: function () {
                $("#uploadBtn").uppyUpload("#uploadBtn", function (name, url) {
                    $(".default_img img").attr("src", config.filePath + url);
                    $("input[name='file_name[]']").val(name);
                    $("input[name='file_path[]']").val(url)
                    $(".default_img img").unbind().bind("click", function () {
                        var path = $(this).attr("src");
                        $.showPhoto(path);
                    });
                }, {
                    allowedFileTypes: ['image/*'],
                    processCon: "#process-files",
                    extArr: ['jpg', 'png', 'jpeg', 'bmp']
                });

                //确认事件
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $.ajaxForJson(config.wwwPath + "supplier/payment/upPaymentFile", {
                        apply_id: $("input[name='apply_id']").val(),
                        file_name: $("input[name='file_name[]']").val(),
                        file_path: $("input[name='file_path[]']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    window.location.href = dataObj.data.url;
                                }
                            });
                        } else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                            ajaxKey = true;
                        }
                    });
                });
                //返回事件
                $(".cjy-cancel-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                });
            }
        });
        return false;
    });

    //切换支付方式
    $(".pay_body_cell").unbind().bind("click", function () {
        $(this).parent().find(".pay_body_cell").removeClass("active");
        $(this).addClass("active");
    });
});