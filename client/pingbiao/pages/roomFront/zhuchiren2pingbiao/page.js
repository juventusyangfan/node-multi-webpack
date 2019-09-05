/**
 * Created by yangfan on 2017/7/6.
 */
require('cp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    var end_time = $(".box_info_time").attr("expire_time"),
        timer = null;

    function setTime() {
        clearTimeout(timer);
        if (end_time != "" && end_time != "0" && end_time != "00:00:00") {
            var timeArr = end_time.split(":");
            var sec = 0,
                min = 0,
                hr = 0;
            if (parseInt(timeArr[2]) == 0) {
                if (parseInt(timeArr[1]) == 0) {
                    if (parseInt(timeArr[0]) == 0) {
                        sec = 0;
                        min = 0;
                        hr = 0;
                    } else {
                        sec = 59;
                        min = 59;
                        hr = parseInt(timeArr[0]) - 1;
                    }
                } else {
                    sec = 59;
                    min = parseInt(timeArr[1]) - 1;
                    hr = parseInt(timeArr[0]);
                }
            } else {
                sec = parseInt(timeArr[2]) - 1;
                min = parseInt(timeArr[1]);
                hr = parseInt(timeArr[0]);
            }

            if (parseInt(hr) == 0 && parseInt(min) == 0 && parseInt(sec) == 0) {
                hr = '00';
                min = '00';
                sec = '00';
                end_time = hr + ':' + min + ':' + sec;
            } else {
                hr = hr > 9 ? hr : '0' + hr;
                min = min > 9 ? min : '0' + min;
                sec = sec > 9 ? sec : '0' + sec;
                end_time = hr + ':' + min + ':' + sec;
            }
            $(".box_info_time").find("span").eq(0).html(hr.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(1).html(hr.toString().substring(1));
            $(".box_info_time").find("span").eq(2).html(min.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(3).html(min.toString().substring(1));
            $(".box_info_time").find("span").eq(4).html(sec.toString().substring(0, 1));
            $(".box_info_time").find("span").eq(5).html(sec.toString().substring(1));

            // 一秒后递归
            timer = setTimeout(function () {
                setTime();
            }, 1000);
        } else {
            $(".box_info_time").find("span").eq(0).html(0);
            $(".box_info_time").find("span").eq(1).html(0);
            $(".box_info_time").find("span").eq(2).html(0);
            $(".box_info_time").find("span").eq(3).html(0);
            $(".box_info_time").find("span").eq(4).html(0);
            $(".box_info_time").find("span").eq(5).html(0);
        }
    }
    setTime();

    //进度通道
    var pull = new libs.webPull({
        channel: 'trace_tenderEvaluate_' + $("input[name='tender_id']").val(),
        signUrl: config.pingbiaoPath + 'getSign',
        subUrl: config.pullPath + 'sub',
        callback: function (content, type) {
            try {
                content = eval('(' + content + ')');
            } catch (ex) {
                content = content;
            }
            if (content.code == 2000) {
                if (content.act == "confirmEvaluateTender") {
                    $(".room_box_title span.textCoffee").html("（评标进度：" + content.data.leader.confirm_num + "/" + content.data.leader.total_num + "）");
                    if (content.data.leader.confirm_num > 0 && content.data.leader.total_num > 0 && content.data.leader.confirm_num == content.data.leader.total_num) {
                        $(".box_title_going").removeClass("disNone");
                    }
                }
            }
        }
    });

    //汇总
    $(".box_title_going").unbind().bind("click", function () {
        if (!$(this).hasClass("disNone")) {
            $.ajaxForJson(config.pingbiaoPath + "EvaluateTender/finishInfoAjax", {
                tender_id: $("input[name='tender_id']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    $.dialog({
                        title: '评分汇总',
                        content: '<div class="rateCfmDlg-content"><i class="iconfont icon-gantanhao"></i><span class="rateCfmDlg-txt">剩余  <span class="textRed">' + dataObj.data.less_expertId_count + '</span>  个专家尚未完成评分提交，确定汇总将只统计已提交的评分。</span></div>',
                        width: 540,
                        confirm: {
                            show: true,
                            allow: true,
                            name: "确定"
                        },
                        cancel: {
                            show: true,
                            allow: true,
                            name: "取消"
                        },
                        callback: function () {
                            $(".cjy-cancel-btn").unbind().bind("click", function () {
                                $(".cjy-poplayer").remove();
                                $(".cjy-bg").remove();
                                return false;
                            });
                            $(".cjy-confirm-btn").off().on("click", function () {
                                $.ajaxForJson(config.pingbiaoPath + "EvaluateTender/evaluateFinishAjax", {
                                    tender_id: $("input[name='tender_id']").val()
                                }, function (jsonObj) {
                                    if (jsonObj.code == 2000) {
                                        $.msgTips({
                                            type: "success",
                                            content: jsonObj.msg,
                                            callback: function () {
                                                window.location.href = jsonObj.data;
                                            }
                                        });
                                    } else {
                                        $.msgTips({
                                            type: "warning",
                                            content: jsonObj.msg
                                        });
                                    }
                                });
                            });
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                }
            });
        }
        return false;
    });
});