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
    if ($(".js_zhuchiren").length > 0 && $(".js_zhuchiren").hasClass("disNone")) {
        var dataObj = JSON.parse($(".js_zhuchiren").eq(0).attr("data"));
        var dialogHTML = '';
        dialogHTML += '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>';
        dialogHTML += '<div class="cjy-poplayer" style="top: ' + ($(document).scrollTop() + 200) + 'px;left: 50%;margin-left: -270px;"><div class="cjy-layer-wrap" style="width: 540px;">';
        dialogHTML += '<div class="cjy-layer-inner">';
        dialogHTML += '<div class="cjy-layer-body">';
        dialogHTML += '<div class="zjWaiting-content"><div class="zjWaiting-title">··· 专家确认中 ···</div><div class="progress-con"><div class="progress-line" style="width:' + (parseInt(dataObj.confirm_num) / parseInt(dataObj.total_num) * 100 + 1) + '%"><span class="progress-bar"><span class="progress-text"><i class="iconfont icon-xiajiantou"></i>' + dataObj.confirm_num + '/' + dataObj.total_num + '</span></span></div></div></div>';
        dialogHTML += '</div></div></div></div>';

        $("body").eq(0).append(dialogHTML);
    }
    //主持人提交结果
    $(".js_zhuchiren").unbind().bind("click", function () {
        if (!$(this).hasClass("disNone")) {
            $.cueDialog({
                title: "提交结果",
                topWords: ["icon-i", '是否继续提交？'],
                content: '<div style="padding: 20px 30px;">提交得分汇总信息，评标专家将进行结果确认，<br>确认无误后将作为后续定标依据。</div>',
                allow: true,
                callback: function () {
                    $.ajaxForJson(config.pingbiaoPath + "CollectTender/publishCollectAjax", {
                        tender_id: $("input[name='tender_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            var dialogHTML = '';
                            dialogHTML += '<div class="cjy-bg" style="height: ' + $(document).outerHeight() + 'px;"></div>';
                            dialogHTML += '<div class="cjy-poplayer" style="top: ' + ($(document).scrollTop() + 200) + 'px;left: 50%;margin-left: -270px;"><div class="cjy-layer-wrap" style="width: 540px;">';
                            dialogHTML += '<div class="cjy-layer-inner">';
                            dialogHTML += '<div class="cjy-layer-body">';
                            dialogHTML += '<div class="zjWaiting-content"><div class="zjWaiting-title">··· 专家确认中 ···</div><div class="progress-con"><div class="progress-line" style="width:' + (parseInt(dataObj.data.confirm_num) / parseInt(dataObj.data.total_num) * 100 + 1) + '%"><span class="progress-bar"><span class="progress-text"><i class="iconfont icon-xiajiantou"></i>' + dataObj.data.confirm_num + '/' + dataObj.data.total_num + '</span></span></div></div></div>';
                            dialogHTML += '</div></div></div></div>';

                            $("body").eq(0).append(dialogHTML);
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

    //专家确认结果
    $(".js_zhuanjia").unbind().bind("click", function () {
        if (!$(this).hasClass("disNone")) {
            $.cueDialog({
                title: "确认结果",
                topWords: ["icon-i", '确认结果无误！'],
                content: "",
                allow: true,
                callback: function () {
                    $.ajaxForJson(config.pingbiaoPath + "CollectTender/confirmInfoAjax", {
                        tender_id: $("input[name='tender_id']").val()
                    }, function (dataObj) {
                        if (dataObj.code == 2000) {
                            $.msgTips({
                                type: "success",
                                content: dataObj.msg,
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
                }
            });
        }
        return false;
    });

    //专家确认通道
    if ($(".js_zhuchiren").length > 0) {
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
                if (content.code == 2000) { //开始唱标状态
                    if (content.act == "confirmCollectTender") {
                        var progressLine = parseInt(content.data.confirm_num) / parseInt(content.data.total_num) * 100 + '%',
                            progressText = '<i class="iconfont icon-xiajiantou"></i>' + content.data.confirm_num + '/' + content.data.total_num;
                        $(".zjWaiting-content").find(".progress-line").css("width", progressLine);
                        $(".zjWaiting-content").find(".progress-text").html(progressText);
                        if (content.data.confirm_num == content.data.total_num) {
                            window.location.href = config.pingbiaoPath + "CollectTender/finish?tender_id=" + $("input[name='tender_id']").val();
                        }
                    }
                }
            }
        });
    }

    //查看详情
    $("a[file-data]").unbind().bind("click", function () {
        var bid_file_path = $(this).attr("file-data");
        bid_file_path = JSON.parse(bid_file_path);
        var _html = '<div style="padding: 0 20px;">';
        for (var i = 0; i < bid_file_path.length; i++) {
            _html += '<div style="margin-bottom:10px;"><a href="' + config.filePath + bid_file_path[i].path + '" target="_blank" class="textBlue">' + bid_file_path[i].name + '</a></div>';
        }
        _html += '</div>';
        $.dialog({
            title: '投标详情',
            content: _html,
            width: 540,
            confirm: {
                show: false,
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
            }
        });
        return false;
    });
});