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
    //开始唱标
    $(".box_title_going").unbind().bind("click", function () {
        var main = $(this);
        $.cueDialog({
            title: "提示",
            topWords: ["icon-i", '是否立即进入唱标环节？'],
            content: '<div style="padding: 10px 30px;line-height: 1.5;">确认后，其他专家将同屏显示您的屏幕内容，<br>所有在线专家“确认唱标完成”后，唱标过程方才结束。</div>',
            allow: true,
            callback: function () {
                $.ajaxForJson(config.pingbiaoPath + "AnnounceTender/changeStatusAjax", {
                    tender_id: main.attr("data-id"),
                    status: 2
                }, function (dataObj) {
                    if (dataObj.code == 2000) {
                        $.loadingTips({
                            type: "changbiao",
                            icon: '',
                            content: '即将进入 <span class="textRed">[唱标]</span> 环节···',
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
            }
        });
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