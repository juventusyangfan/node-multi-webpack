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
                //开始唱标状态
                if (content.act == "confirmAnnounceTender") {
                    $(".confirm_tips").html("（确认进度：" + content.data.confirm_num + "/" + content.data.total_num + "）");
                    if (content.data.confirm_num > 0 && content.data.total_num > 0 && content.data.total_num == content.data.confirm_num) {
                        $(".box_title_confirm").removeClass("disNone");
                    }
                } else if (content.act == "startEvaluateTender" || content.act == "startAnnounceTender") {
                    var isLeader = $(".room_container").attr("is_leader");
                    if (isLeader != '1') {
                        window.location.href = content.data;
                    }
                }
            }
        }
    });

    //确认唱标倒计时
    if ($(".finish_time_limit").length > 0 && $(".box_title_going").hasClass("disNone")) {
        var timer = null,
            timeNum = parseInt($(".finish_time_limit").find("span").html());
        timer = setInterval(function () {
            if (timeNum > 0) {
                timeNum--;
                $(".finish_time_limit").find("span").html(timeNum);
            } else {
                $(".box_title_going").removeClass("disNone");
                clearInterval(timer);
            }
        }, 1000);
    }
    //确认唱标完成
    $(".box_title_going").unbind().bind("click", function () {
        var main = $(this);
        if (!main.hasClass("disNone")) {
            $.cueDialog({
                title: "确认唱标完成",
                topWords: ["icon-i", '确认唱标完成？'],
                content: '',
                allow: true,
                callback: function () {
                    $.ajaxForJson(config.pingbiaoPath + "AnnounceTender/announceConfirm", {
                        tender_id: $("input[name='tender_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
                                callback: function () {
                                    window.location.reload();
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
            });
        }
        return false;
    });

    //结束唱标
    $(".box_title_confirm").unbind().bind("click", function () {
        var main = $(this);
        if (!main.hasClass("disNone")) {
            $.dialog({
                title: '结束唱标',
                content: '<div class="cbEndDlg-content"><div class="cbEndDlg-txt"><i class="iconfont icon-i"></i><span>结束唱标后，将进入评标环节！ <br>点击下方“确定”按钮后开始计时，倒计时结束前提交的评分信息方才 有效，否则无效！</span></div><div class="cbEndDlg-handler"><label>评标时长：</label><input name="evaluate_time" type="text" class="cjy-input-" placeholder="请设置时间">分钟</div></div>',
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
                    //填写分钟
                    $("input[name='evaluate_time']").unbind().bind("input", function () {
                        libs.lenNumber(this);
                    });

                    $(".cjy-cancel-btn").unbind().bind("click", function () {
                        $(".cjy-poplayer").remove();
                        $(".cjy-bg").remove();
                        return false;
                    });
                    $(".cjy-confirm-btn").off().on("click", function () {
                        $.ajaxForJson(config.pingbiaoPath + "AnnounceTender/changeStatusAjax", {
                            tender_id: $("input[name='tender_id']").val(),
                            status: 3,
                            evaluate_time: $("input[name='evaluate_time']").val(),
                        }, function (dataObj) {
                            if (dataObj.code == 2000) {
                                $.loadingTips({
                                    type: "changbiao",
                                    icon: '',
                                    content: '即将进入 <span class="textRed">[评标]</span> 环节···',
                                    time: 2000,
                                    callback: function () {
                                        window.location.href = dataObj.data;
                                    }
                                });
                            } else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    });
                }
            });
        }
        return false;
    });

    //批量下载
    var webPullKey = true;
    $(".package_down").unbind().bind("click", function () {
        var main = this;
        if (webPullKey) {
            $.ajaxForJson(config.pingbiaoPath + "batchDocDownload", {
                tender_id: $("input[name='tender_id']").val()
            }, function (dataObj) {
                if (dataObj.code == 2000) {
                    var pullDown = new libs.webPull({
                        channel: 'pingbiao_' + $("input[name='tender_id']").val() + '_' + $("input[name='tender_package_id']").val(),
                        signUrl: config.pingbiaoPath + 'getSign',
                        subUrl: config.pullPath + 'sub',
                        callback: function (content, type) {
                            try {
                                content = eval('(' + content + ')');
                            } catch (ex) {
                                content = content;
                            }
                            $(main).html("下载中" + content.pro + "...");
                            if (content.pro == "100%") {
                                window.location.href = content.name;
                                webPullKey = true;
                                $(main).html("下载完成");
                            }
                        }
                    });
                } else {
                    $.msgTips({
                        type: "warning",
                        content: dataObj.msg
                    });
                    webPullKey = true;
                    $(main).html("重新下载");
                }
            });
        }
        $(main).html("下载中0%...");
        webPullKey = false;
    });
});