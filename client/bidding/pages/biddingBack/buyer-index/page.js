require('cp');
require('cbp');
require('elem');
require('./page.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //下载弹框
    $(".comingList .downLoad").unbind().bind("click", function () {
        var main = $(this);
        var tenderId = main.attr("tender-id"),
            tenderName = libs.html2Escape(main.attr("tender-name")),
            tenderBuyer = main.attr("tender-buyer");
        $.cueDialog({
            allow: true,
            title: "下载密钥",
            topWords: ["icon-i", '请开标人设置开标口令，并下载和保存密钥文件。<br>口令和密钥由开标人独立保管，在线开标时将同时录入，以解密投标文件。'],
            content: '<div class="downLoad-pop"><div class="dl-pop-item"><label>集采名称：</label><div class="dl-pop-block"><a href="/exclusive/details/' + tenderId + '.html" target="_blank" class="textOrange" style="display: inline-block;line-height: 1.5;">' + tenderName + '</a></div></div><div class="dl-pop-item"><label>发布人：</label><div class="dl-pop-block">' + tenderBuyer + '</div></div><div class="dl-pop-item"><label>输入口令：</label><div class="dl-pop-block"><input type="password" name="pw" class="cjy-input-" autocomplete="false"></div></div><div class="dl-pop-item"><label>确认口令：</label><div class="dl-pop-block"><input type="password" name="pwc" class="cjy-input-" autocomplete="false"></div></div></div>',
            callback: function () {
                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    if ($("input[name='pw']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请输入口令"
                        });
                        return false;
                    }
                    else if ($("input[name='pwc']").val() == "") {
                        $.msgTips({
                            type: "warning",
                            content: "请确认口令"
                        });
                        return false;
                    }
                    else if ($("input[name='pw']").val() != $("input[name='pwc']").val()) {
                        $.msgTips({
                            type: "warning",
                            content: "请保证输入的两遍口令一致"
                        });
                        return false;
                    }
                    $.ajaxForJson(config.wwwPath + "/ajaxDownOpenKey", {
                        pw: $("input[name='pw']").val(),
                        pwc: $("input[name='pwc']").val(),
                        tenderId: tenderId
                    }, function (dataObj) {
                        if (dataObj.code == "2000") {
                            $.msgTips({
                                type: "success",
                                content: "开始下载",
                                callback: function () {
                                    location.reload();
                                }
                            });
                            window.location.href = dataObj.data;
                        }
                        else {
                            $.msgTips({
                                type: "warning",
                                content: dataObj.msg
                            });
                        }
                    })
                });
            }
        });
        return false;
    });
});