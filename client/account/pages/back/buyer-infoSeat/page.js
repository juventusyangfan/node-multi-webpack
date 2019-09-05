require('cp');
require('cbp');
require('elem');
require('./page.css');
require('../../../public-resource/css/list.css');
require('../../../public-resource/css/pageNav.css');
const config = require('configModule');
const libs = require('libs');

$(() => {
    //邀请弹窗
    $(".btn_inviteB,.btn_inviteS").unbind().bind("click", function () {
        var dialogHTML = '<div class="dlg_invite"><div class="dlg_invite_search"><input class="cjy-input-" name="company_name"><a href="javascript:;" class="dlg_btn">确定</a></div><div class="dlg_list" style="display: none;"><div class="dlg_tips"></div><div class="material_list" style="max-height: 550px;overflow-y: auto;"><table class="js_list"><colgroup><col width="50"><col width="300"><col width="200"><col width="200"></colgroup><thead><tr><th>序号</th><th>采购商</th><th>当前席位</th><th>操作</th></tr></thead><tbody></tbody></table><div class="clear"></div></div></div></div>';
        $.dialog({
            title: '邀请子（分）公司',
            content: dialogHTML,
            width: 680,
            confirm: {
                show: true,
                allow: true,
                name: "完成邀请"
            },
            callback: function () {
                //搜索按钮
                $(".dlg_btn").unbind().bind("click", function () {
                    if ($.trim($("input[name='company_name']").val()) != "") {
                        $.ajaxForJson(config.accountPath + "/getCompanyByName", {
                            company_name: $.trim($("input[name='company_name']").val())
                        }, function (dataObj) {
                            if (dataObj.code == "2000") {
                                var trHTml = '';
                                for (var i = 0; i < dataObj.data.length; i++) {
                                    var status = "";
                                    switch (dataObj.data[i].company_seat) {
                                        case "1":
                                            status = "未设置";
                                            break;
                                        case "2":
                                            status = "集团（母）公司";
                                            break;
                                        case "3":
                                            status = "分（子）公司";
                                            break;
                                        case "4":
                                            status = "独立公司";
                                            break;
                                    }
                                    trHTml += '<tr company_id="' + dataObj.data[i].company_id + '" company_seat="' + dataObj.data[i].company_seat + '"><td>' + (i + 1) + '</td><td>' + dataObj.data[i].company_name + '</td><td>' + status + '</td><td><a href="javascript:;" class="textBlue js_dlgInvite">发送邀请</a></td></tr>';
                                }
                                $(".js_list").find("tbody").html(trHTml);
                                $(".dlg_list").show();
                                //发起邀请
                                $(".js_dlgInvite").unbind().bind("click", function () {
                                    var trObj = $(this).parents("tr");
                                    $.ajaxForJson(config.accountPath + "/addSeat", {
                                        company_id: trObj.attr("company_id"),
                                        company_seat: trObj.attr("company_seat")
                                    }, function (obj) {
                                        if (obj.code == "2000") {
                                            trObj.remove();
                                            $.msgTips({
                                                type: "success",
                                                content: obj.msg
                                            });
                                        }
                                        else {
                                            $.msgTips({
                                                type: "warning",
                                                content: obj.msg
                                            });
                                        }
                                    });
                                    return false
                                });
                            }
                            else {
                                $.msgTips({
                                    type: "warning",
                                    content: dataObj.msg
                                });
                            }
                        });
                    }
                    return false;
                });
                $("input[name='company_name']").bind("keypress", function (event) {
                    if (event.keyCode == "13") {
                        $(".dlg_btn").triggerHandler("click");
                        return false;
                    }
                });

                $(".cjy-confirm-btn").unbind().bind("click", function () {
                    $(".cjy-poplayer").remove();
                    $(".cjy-bg").remove();
                    window.location.reload();
                    return false;
                });
            }
        });
        return false;
    });

    //同意拒绝
    $(".inviteAgree,.inviteRefuse,.js_reinvite").unbind().bind("click", function () {
        var status = $(this).attr("data-status"), id = $(this).parent().find("input[name='id']").val(),
            con = $(this).html();
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '是否' + con + '该邀请？'],
            content: '',
            callback: function () {
                $.ajaxForJson(config.accountPath + "/dealInvitation", {
                    id: id,
                    status: status
                }, function (dataObj) {
                    if (dataObj.code == "2000") {
                        $.msgTips({
                            type: "success",
                            content: dataObj.msg
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                    else {
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

    //移除事件
    $(".js_remove").unbind().bind("click", function () {
        var id = $(this).parent().find("input[name='id']").val()
        $.cueDialog({
            title: "确认框",
            topWords: ["icon-i", '是否移除该条消息？'],
            content: '',
            callback: function () {
                $.ajaxForJson(config.accountPath + "/delSeat", {
                    id: id
                }, function (dataObj) {
                    if (dataObj.code == "2000") {
                        $.msgTips({
                            type: "success",
                            content: dataObj.msg
                        });
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000);
                    }
                    else {
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


    //选择公司类型确认
    $(".btn_confirm").unbind().bind("click", function () {
        var code = $("input[name='bCode']:checked").val();
        $.ajaxForJson(config.accountPath + "/setSeat", {
            bCode: code
        }, function (dataObj) {
            if (dataObj.code == "2000") {
                $.msgTips({
                    type: "success",
                    content: dataObj.msg
                });
                setTimeout(function () {
                    window.location.reload();
                }, 1000);
            }
            else {
                $.msgTips({
                    type: "warning",
                    content: dataObj.msg
                });
            }
        });
    });
});